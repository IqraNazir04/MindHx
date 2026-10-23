"""Exports the Dpngtm/wav2vec2-emotion-recognition voice-emotion classifier to an
int8-quantized ONNX file that the backend runs with onnxruntime alone.

Build-time only: this script needs torch + transformers + onnx (see
requirements-export.txt), the backend at runtime does not - loading PyTorch
in-process is the kind of fixed memory cost that already got the backend
OOM-killed once (see /transcribe in main.py).

    python backend/scripts/export_voice_emotion_model.py backend/voice_model/voice-emotion.onnx

The model expects 16 kHz mono float32 PCM, normalized per clip to zero mean
and unit variance (do_normalize in its preprocessor_config.json) - main.py's
_voice_emotion_model_scores does that before running it.
"""
import json
import sys
from pathlib import Path

import numpy as np
import torch
from onnxruntime.quantization import QuantType, quantize_dynamic
from transformers import AutoModelForAudioClassification

MODEL_ID = "Dpngtm/wav2vec2-emotion-recognition"
# Pinned so a rebuild never silently picks up different weights or labels.
MODEL_REVISION = "033a5751a5bbe5b0b67c2c71e6102c38de35a346"


class _Logits(torch.nn.Module):
    """Returns the logits tensor alone, so the ONNX graph has one plain output."""

    def __init__(self, model: torch.nn.Module) -> None:
        super().__init__()
        self.model = model

    def forward(self, input_values: torch.Tensor) -> torch.Tensor:
        return self.model(input_values=input_values).logits


def main(output_path: str) -> None:
    output = Path(output_path)
    output.parent.mkdir(parents=True, exist_ok=True)
    float_path = output.with_suffix(".fp32.onnx")

    # Eager attention exports to plain ONNX ops on every torch version; the fused
    # scaled_dot_product_attention kernel does not on older ones.
    model = AutoModelForAudioClassification.from_pretrained(MODEL_ID, revision=MODEL_REVISION, attn_implementation="eager").eval()
    labels = [model.config.id2label[index] for index in range(model.config.num_labels)]
    dummy = torch.randn(1, 16000 * 4)
    torch.onnx.export(
        _Logits(model),
        (dummy,),
        str(float_path),
        input_names=["input_values"],
        output_names=["logits"],
        dynamic_axes={"input_values": {0: "batch", 1: "samples"}, "logits": {0: "batch"}},
        opset_version=17,
        do_constant_folding=True,
    )
    # Only the transformer's MatMuls (nearly all of the weights) are quantized:
    # onnxruntime's CPU provider has no kernel for the ConvInteger op that
    # quantizing the convolutional feature encoder would produce.
    quantize_dynamic(str(float_path), str(output), weight_type=QuantType.QInt8, op_types_to_quantize=["MatMul"])
    float_path.unlink()
    # Labels travel with the model file, so main.py never hardcodes their order.
    output.with_suffix(".labels.json").write_text(json.dumps(labels))

    import onnxruntime

    session = onnxruntime.InferenceSession(str(output), providers=["CPUExecutionProvider"])
    sample = np.random.default_rng(0).standard_normal((1, 16000 * 3)).astype(np.float32)
    with torch.no_grad():
        expected = torch.softmax(model(input_values=torch.from_numpy(sample)).logits, dim=-1).numpy()
    logits = session.run(None, {"input_values": sample})[0]
    actual = np.exp(logits - logits.max()) / np.exp(logits - logits.max()).sum()
    print(f"Wrote {output} ({output.stat().st_size / 1e6:.0f} MB), labels {labels}")
    print(f"Max probability difference vs PyTorch after int8 quantization: {float(np.abs(expected - actual).max()):.3f}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else str(Path(__file__).resolve().parent.parent / "voice_model" / "voice-emotion.onnx"))

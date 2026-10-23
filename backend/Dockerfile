FROM python:3.11-slim AS voice-model
# Exports the wav2vec2 voice-emotion model to int8 ONNX. torch and
# transformers live only in this stage - the backend runs the result with
# onnxruntime alone.
WORKDIR /export
COPY requirements-export.txt .
# torch is a ~200 MB download; a longer timeout and retries ride out slow mirrors.
ENV PIP_DEFAULT_TIMEOUT=120 PIP_RETRIES=10
RUN pip install --no-cache-dir torch==2.2.2 --index-url https://download.pytorch.org/whl/cpu \
    && pip install --no-cache-dir -r requirements-export.txt
COPY scripts/export_voice_emotion_model.py .
RUN python export_voice_emotion_model.py /export/voice_model/voice-emotion.onnx

FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY main.py auth.py database.py envfile.py mailer.py manage.py models.py ratelimit.py ./
COPY --from=voice-model /export/voice_model ./voice_model

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
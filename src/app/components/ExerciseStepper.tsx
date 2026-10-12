"use client";

import { useEffect, useState } from "react";

type Step = { instruction: string; seconds: number };

type Props = {
  id: string;
  name: string;
  steps: Step[];
  startLabel: string;
  restartLabel: string;
  progressLabel: (current: number, total: number) => string;
  onComplete?: () => void;
};

// The 4-7-8 exercise's three steps are always breathe-in, hold, breathe-out
// in that fixed order (see INTERACTIVE_EXERCISES in backend/main.py) - so the
// circle's target scale per step index is hardcoded to that shape rather than
// parsed from the (bilingual, free-text) instruction strings.
const BREATHING_EXERCISE_ID = "478-breathing";
const BREATHING_SCALE_BY_STEP = [1, 1, 0.55];

export default function ExerciseStepper({ id, name, steps, startLabel, restartLabel, progressLabel, onComplete }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => {
      if (secondsLeft <= 1) {
        setStepIndex((index) => {
          if (index < steps.length - 1) {
            setSecondsLeft(steps[index + 1].seconds);
            return index + 1;
          }
          setRunning(false);
          setDone(true);
          onComplete?.();
          return index;
        });
      } else {
        setSecondsLeft((value) => value - 1);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [running, secondsLeft, steps, onComplete]);

  function start() {
    setStepIndex(0);
    setSecondsLeft(steps[0]?.seconds ?? 0);
    setDone(false);
    setRunning(true);
  }

  const isBreathing = id === BREATHING_EXERCISE_ID;
  const breathingScale = running ? BREATHING_SCALE_BY_STEP[stepIndex] ?? 1 : 0.55;

  return (
    <div className="exercise-stepper">
      <p className="exercise-stepper-name">{name}</p>
      {isBreathing && (
        <div className="breathing-circle-wrap">
          <div
            className="breathing-circle"
            style={{ transform: `scale(${breathingScale})`, transitionDuration: `${running ? steps[stepIndex].seconds : 0.6}s` }}
          />
        </div>
      )}
      {running && (
        <>
          <p className="exercise-stepper-instruction">{steps[stepIndex].instruction}</p>
          <div className="exercise-stepper-timer">{secondsLeft}</div>
          <div className="exercise-stepper-progress">{progressLabel(stepIndex + 1, steps.length)}</div>
        </>
      )}
      {!running && (
        <button className="check-in-button exercise-stepper-button" type="button" onClick={start}>
          {done ? restartLabel : startLabel}
        </button>
      )}
    </div>
  );
}

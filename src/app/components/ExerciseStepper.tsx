"use client";

import { useEffect, useState } from "react";

type Step = { instruction: string; seconds: number };

type Props = {
  name: string;
  steps: Step[];
  startLabel: string;
  restartLabel: string;
  progressLabel: (current: number, total: number) => string;
  onComplete?: () => void;
};

export default function ExerciseStepper({ name, steps, startLabel, restartLabel, progressLabel, onComplete }: Props) {
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

  return (
    <div className="exercise-stepper">
      <p className="exercise-stepper-name">{name}</p>
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

"use client";

import { useState } from "react";

type Props = {
  prompt: string;
  thanks: string;
  onSelect: (mood: number) => void;
};

const FACES = ["😞", "🙁", "😐", "🙂", "😊"];

export default function MoodCheckIn({ prompt, thanks, onSelect }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  function handleSelect(mood: number) {
    setSelected(mood);
    onSelect(mood);
  }

  return (
    <div className="mood-checkin">
      <p>{selected ? thanks : prompt}</p>
      <div className="mood-checkin-faces">
        {FACES.map((face, index) => {
          const mood = index + 1;
          return (
            <button
              key={mood}
              type="button"
              className={`mood-checkin-face ${selected === mood ? "selected" : ""}`}
              onClick={() => handleSelect(mood)}
              aria-label={`Mood ${mood} of 5`}
            >
              {face}
            </button>
          );
        })}
      </div>
    </div>
  );
}

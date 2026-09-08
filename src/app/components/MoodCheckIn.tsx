"use client";

import { useState } from "react";
import { MoodFace } from "./MoodFace";

type Props = {
  prompt: string;
  thanks: string;
  onSelect: (mood: number) => void;
};

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
        {[1, 2, 3, 4, 5].map((mood) => (
          <button
            key={mood}
            type="button"
            className={`mood-checkin-face ${selected === mood ? "selected" : ""}`}
            onClick={() => handleSelect(mood)}
            aria-label={`Mood ${mood} of 5`}
          >
            <MoodFace mood={mood} size={44} />
          </button>
        ))}
      </div>
    </div>
  );
}

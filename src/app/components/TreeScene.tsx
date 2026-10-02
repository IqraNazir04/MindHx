"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createMapleScene } from "../lib/mapleScene";

type TreeApi = { dispose: () => void };

/**
 * Ambient, bounded-box companion to the hero heading: the same procedural
 * maple generator as "The Tree Within" (roots = foundational core, trunk =
 * resilience, crown = outward expression - the same roots/trunk/crown
 * language MindHx's three signals echo), auto-orbiting with a gentle wind,
 * stripped of its original full-page HUD, season picker and storm button.
 */
export default function TreeScene({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let api: TreeApi | null = null;
    try {
      api = createMapleScene(THREE, canvas, {
        season: "spring",
        wind: 2.5,
        autoOrbit: true,
        interactive: true,
        zoom: false,
        sky: true,
        quality: "low",
        annotations: false,
      });
    } catch {
      // WebGL unavailable - the box stays empty rather than breaking the page.
    }
    return () => api?.dispose();
  }, []);

  return (
    <div className={`tree-scene ${className || ""}`}>
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}

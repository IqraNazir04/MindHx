"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createMapleScene } from "../lib/mapleScene";

type TreeApi = { dispose: () => void };

/**
 * Full-bleed hero background: the same procedural maple generator as "The
 * Tree Within" (roots = foundational core, trunk = resilience, crown =
 * outward expression - the same roots/trunk/crown language MindHx's three
 * signals echo), auto-orbiting with a gentle wind, stripped of its original
 * full-page HUD, season picker and storm button. Quality is "auto" (not
 * forced "low") since this now fills a wide hero banner rather than a small
 * side widget, so it should get the fuller leaf/grass density on desktop.
 */
export default function TreeScene({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let api: TreeApi | null = null;
    try {
      api = createMapleScene(THREE, canvas, {
        season: "mindhx",
        wind: 2.5,
        autoOrbit: true,
        interactive: true,
        zoom: false,
        sky: true,
        quality: "auto",
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

import type { CSSProperties } from "react";

type DoodleProps = { className?: string; style?: CSSProperties };

// Loose, hand-drawn-style line-art decorations, originally designed for MindHx.
// Single currentColor stroke, rounded caps/joins, wobble via slightly irregular
// path points rather than perfectly geometric curves.

export function DoodleCloud({ className, style }: DoodleProps) {
  return (
    <svg className={className} style={style} width="72" height="46" viewBox="0 0 72 46" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M14 33c-7 0-11-5.5-9.5-11 1.2-4.5 5.6-6.8 9.8-6 .6-6.5 6.4-11 13-10.3 5.6.6 9.8 5 10.4 10.4 5-2 10.8.6 12 6 1.3 5.7-2.7 10.9-8.6 10.9H14Z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DoodleSpeechBubble({ className, style }: DoodleProps) {
  return (
    <svg className={className} style={style} width="58" height="50" viewBox="0 0 58 50" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M8 8.5C8 5 11 3 15 3h30c4 0 8 2.6 8 7v18c0 4.3-4 7-8 7H24l-9 10.5-1-10.5H15c-4 0-7-2.7-7-7.3V8.5Z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 16.5h24M17 24.5h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function DoodleSun({ className, style }: DoodleProps) {
  return (
    <svg className={className} style={style} width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="26" cy="26" r="11" stroke="currentColor" strokeWidth="2.2" />
      <path d="M26 2v7M26 43v7M50 26h-7M9 26H2M42.5 9.5l-5 5M14.5 37.5l-5 5M42.5 42.5l-5-5M14.5 14.5l-5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function DoodleWave({ className, style }: DoodleProps) {
  return (
    <svg className={className} style={style} width="80" height="28" viewBox="0 0 80 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M2 18c5-13 11-13 16 0s11 13 16 0 11-13 16 0 11 13 16 0 11-13 12-2" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DoodleHeart({ className, style }: DoodleProps) {
  return (
    <svg className={className} style={style} width="46" height="42" viewBox="0 0 46 42" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M23 39C10 30 3 22.5 3 14 3 7.5 8 3 14 3c4 0 7.3 2.2 9 5.8C24.7 5.2 28 3 32 3c6 0 11 4.5 11 11 0 8.5-7 16-20 25Z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DoodleLeaf({ className, style }: DoodleProps) {
  return (
    <svg className={className} style={style} width="40" height="52" viewBox="0 0 40 52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M20 49c-14-6-19-19-15-33C9 8 17 3 20 3s11 5 15 13c4 14-1 27-15 33Z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 49V15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

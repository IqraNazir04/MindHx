"use client";

import { startTransition, useCallback, useEffect, useState } from "react";

export type Language = "English" | "اردو";

const STORAGE_KEY = "mindhx:language";

function readStoredLanguage(): Language | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === "English" || raw === "اردو" ? raw : null;
  } catch {
    return null;
  }
}

function writeStoredLanguage(language: Language): void {
  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // Storage unavailable - the choice just won't carry over to other pages.
  }
}

/**
 * For pages that derive their own default language from something more
 * specific than the site-wide preference (e.g. Emergency matches whatever
 * language the crisis-triggering check-in used) but should still broadcast
 * an explicit user choice to every other page, or fall back to the site-wide
 * preference when there's nothing more specific to match.
 */
export function setStoredLanguage(language: Language): void {
  writeStoredLanguage(language);
}

export function getStoredLanguage(): Language {
  return readStoredLanguage() ?? "English";
}

/**
 * Drop-in replacement for `useState<Language>("English")` used on every
 * bilingual page. Persists the choice to localStorage so that picking Urdu
 * once keeps every page in Urdu - across navigation and reloads - until
 * English is picked again, instead of each page resetting to English on
 * mount. Starts as "English" on every render (matching the server's render,
 * since localStorage isn't available there) to avoid a hydration mismatch,
 * then syncs from storage right after mount.
 */
export function useLanguage(): [Language, (language: Language) => void] {
  const [language, setLanguageState] = useState<Language>("English");

  useEffect(() => {
    const stored = readStoredLanguage();
    if (stored && stored !== "English") {
      startTransition(() => setLanguageState(stored));
    }
  }, []);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    writeStoredLanguage(next);
  }, []);

  return [language, setLanguage];
}

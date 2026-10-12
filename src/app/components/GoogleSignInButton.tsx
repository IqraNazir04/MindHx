"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { fetchGoogleClientId, loginWithGoogle } from "../lib/auth";

// Minimal typing for the parts of Google Identity Services used here.
type GoogleCredentialResponse = { credential?: string };
type GoogleAccountsId = {
  initialize: (options: { client_id: string; callback: (response: GoogleCredentialResponse) => void; ux_mode?: "popup" | "redirect" }) => void;
  renderButton: (parent: HTMLElement, options: Record<string, string | number>) => void;
};
declare global {
  interface Window {
    google?: { accounts: { id: GoogleAccountsId } };
  }
}

type Props = {
  // "signin_with" -> "Sign in with Google", "signup_with" -> "Sign up with Google".
  mode: "signin_with" | "signup_with";
  urdu: boolean;
  dividerLabel: string;
  onSignedIn: () => void;
  onError: (message: string) => void;
};

// The "Sign in with Google" button plus an "or" divider above the email
// form. Renders nothing until the backend reports a Google client ID, so a
// deployment without GOOGLE_CLIENT_ID simply shows the email form alone.
export default function GoogleSignInButton({ mode, urdu, dividerLabel, onSignedIn, onError }: Props) {
  const [clientId, setClientId] = useState<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  // Latest callbacks, so Google's (once-registered) callback never calls stale ones.
  const handlers = useRef({ onSignedIn, onError });
  useEffect(() => {
    handlers.current = { onSignedIn, onError };
  });

  useEffect(() => {
    let cancelled = false;
    fetchGoogleClientId().then((id) => {
      if (!cancelled) setClientId(id);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const googleId = window.google?.accounts.id;
    const parent = buttonRef.current;
    if (!clientId || !scriptReady || !googleId || !parent) return;
    googleId.initialize({
      client_id: clientId,
      ux_mode: "popup",
      callback: async ({ credential }) => {
        if (!credential) {
          handlers.current.onError("Google sign-in was cancelled.");
          return;
        }
        try {
          await loginWithGoogle(credential);
          handlers.current.onSignedIn();
        } catch (err) {
          handlers.current.onError(err instanceof Error ? err.message : "Google sign-in failed.");
        }
      },
    });
    parent.replaceChildren();
    googleId.renderButton(parent, {
      type: "standard",
      theme: "outline",
      size: "large",
      shape: "rectangular",
      text: mode,
      logo_alignment: "center",
      locale: urdu ? "ur" : "en",
      width: Math.min(400, parent.offsetWidth || 400),
    });
  }, [clientId, scriptReady, mode, urdu]);

  if (!clientId) return null;
  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onReady={() => setScriptReady(true)} />
      <div className="google-signin" ref={buttonRef} />
      <p className="auth-divider"><span>{dividerLabel}</span></p>
    </>
  );
}

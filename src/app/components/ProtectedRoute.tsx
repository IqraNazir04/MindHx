"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchCurrentUser, type CurrentUser } from "../lib/auth";

type Status = "checking" | "authorized" | "unauthorized";

// Wraps a page that requires a signed-in user. Redirects to /login if the
// stored token is missing or the backend rejects it (expired/invalid).
export default function ProtectedRoute({ children }: { children: (user: CurrentUser) => React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("checking");
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchCurrentUser().then((currentUser) => {
      if (cancelled) return;
      if (currentUser) {
        setUser(currentUser);
        setStatus("authorized");
      } else {
        setStatus("unauthorized");
        router.replace("/login");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (status === "checking") {
    return (
      <main className="resource-page">
        <div className="protected-route-loading">Checking your session…</div>
      </main>
    );
  }

  if (status === "unauthorized" || !user) {
    return null;
  }

  return <>{children(user)}</>;
}

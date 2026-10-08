"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminLogin, fetchCurrentUser } from "../../lib/auth";

export default function AdminLoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCurrentUser().then((user) => {
      if (user?.is_admin) router.replace("/admin");
    });
  }, [router]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await adminLogin(email.trim(), password);
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <p className="admin-login-brand"><img className="brand-mark" src="/logo-mark.png" alt="" /> MindHx <span className="admin-login-tag">Admin</span></p>
        <h1>Sign in</h1>
        <label>
          Email
          <input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>
        {error && <p className="assessment-error">{error}</p>}
        <button className="check-in-button" type="submit" disabled={submitting}>{submitting ? "Signing in…" : "Sign in"}</button>
      </form>
    </main>
  );
}

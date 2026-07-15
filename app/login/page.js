"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const ERROR_MESSAGES = {
  invalid_credentials: "Nieprawid\u0142owy e-mail lub has\u0142o.",
  too_many_attempts: "Zbyt wiele nieudanych pr\u00f3b. Spr\u00f3buj ponownie za kilka minut.",
  server_error: "Co\u015b posz\u0142o nie tak. Spr\u00f3buj ponownie."
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.ok) {
        setStatus("idle");
        setError(ERROR_MESSAGES[data.error] || ERROR_MESSAGES.server_error);
        return;
      }

      const next = searchParams.get("next") || "/dashboard";
      router.push(next);
      router.refresh();
    } catch {
      setStatus("idle");
      setError(ERROR_MESSAGES.server_error);
    }
  }

  return (
    <main className="app-shell">
      <section className="date-card auth-card">
        <p className="kicker">jamnikowa randka</p>
        <h1>zaloguj si\u0119</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>e-mail</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </label>

          <label className="field">
            <span>has\u0142o</span>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </label>

          {error ? <p className="soft-message error">{error}</p> : null}

          <button className="bone-button confirm-button" type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "logowanie..." : "zaloguj si\u0119"}
          </button>
        </form>
        <p className="auth-links">
          <Link href="/reset-password">Zapomnia\u0142e\u015b/a\u015b has\u0142a?</Link>
        </p>
        <p className="auth-links">
          Nie masz konta? <Link href="/register">Zarejestruj si\u0119</Link>
        </p>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

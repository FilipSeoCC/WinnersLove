"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function RequestForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [done, setDone] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("submitting");

    try {
      await fetch("/api/auth/reset-password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
    } catch {
      // celowo ignorujemy blad sieci - i tak nie zdradzamy, czy e-mail istnieje w bazie
    }

    setStatus("idle");
    setDone(true);
  }

  if (done) {
    return (
      <>
        <h1>sprawd\u017a skrzynk\u0119</h1>
        <p className="success-copy">
          Je\u015bli podany adres istnieje w naszej bazie, wys\u0142ali\u015bmy na niego link do zresetowania has\u0142a.
        </p>
      </>
    );
  }

  return (
    <>
      <h1>zresetuj has\u0142o</h1>
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
        <button className="bone-button confirm-button" type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "wysy\u0142anie..." : "wy\u015blij link resetuj\u0105cy"}
        </button>
      </form>
    </>
  );
}

const CONFIRM_ERROR_MESSAGES = {
  invalid_token: "Link do resetu has\u0142a jest nieprawid\u0142owy lub wygas\u0142.",
  invalid_password: "Has\u0142o musi mie\u0107 co najmniej 8 znak\u00f3w.",
  server_error: "Co\u015b posz\u0142o nie tak. Spr\u00f3buj ponownie."
};

function ConfirmForm({ token }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Has\u0142a nie s\u0105 takie same.");
      return;
    }

    setStatus("submitting");
    setError("");

    try {
      const response = await fetch("/api/auth/reset-password/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.ok) {
        setStatus("idle");
        setError(CONFIRM_ERROR_MESSAGES[data.error] || CONFIRM_ERROR_MESSAGES.server_error);
        return;
      }

      setDone(true);
    } catch {
      setStatus("idle");
      setError(CONFIRM_ERROR_MESSAGES.server_error);
    }
  }

  if (done) {
    return (
      <>
        <h1>has\u0142o zmienione</h1>
        <p className="success-copy">Mo\u017cesz si\u0119 teraz zalogowa\u0107 nowym has\u0142em.</p>
        <p className="auth-links">
          <Link href="/login">Przejd\u017a do logowania</Link>
        </p>
      </>
    );
  }

  return (
    <>
      <h1>ustaw nowe has\u0142o</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>nowe has\u0142o</span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
          />
        </label>
        <label className="field">
          <span>powt\u00f3rz has\u0142o</span>
          <input
            type="password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
          />
        </label>
        {error ? <p className="soft-message error">{error}</p> : null}
        <button className="bone-button confirm-button" type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "zapisywanie..." : "ustaw nowe has\u0142o"}
        </button>
      </form>
    </>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return (
    <main className="app-shell">
      <section className="date-card auth-card">
        <p className="kicker">jamnikowa randka</p>
        {token ? <ConfirmForm token={token} /> : <RequestForm />}
      </section>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}

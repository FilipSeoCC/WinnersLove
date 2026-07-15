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
        <h1>sprawdź skrzynkę</h1>
        <p className="success-copy">
          Jeśli podany adres istnieje w naszej bazie, wysłaliśmy na niego link do zresetowania hasła.
        </p>
      </>
    );
  }

  return (
    <>
      <h1>zresetuj hasło</h1>
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
          {status === "submitting" ? "wysyłanie..." : "wyślij link resetujący"}
        </button>
      </form>
    </>
  );
}

const CONFIRM_ERROR_MESSAGES = {
  invalid_token: "Link do resetu hasła jest nieprawidłowy lub wygasł.",
  invalid_password: "Hasło musi mieć co najmniej 8 znaków.",
  server_error: "Coś poszło nie tak. Spróbuj ponownie."
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
      setError("Hasła nie są takie same.");
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
        <h1>hasło zmienione</h1>
        <p className="success-copy">Możesz się teraz zalogować nowym hasłem.</p>
        <p className="auth-links">
          <Link href="/login">Przejdź do logowania</Link>
        </p>
      </>
    );
  }

  return (
    <>
      <h1>ustaw nowe hasło</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>nowe hasło</span>
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
          <span>powtórz hasło</span>
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
          {status === "submitting" ? "zapisywanie..." : "ustaw nowe hasło"}
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

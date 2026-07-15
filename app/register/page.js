"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ERROR_MESSAGES = {
  invalid_email: "Podaj poprawny adres e-mail.",
  invalid_password: "Has\u0142o musi mie\u0107 co najmniej 8 znak\u00f3w.",
  terms_required: "Musisz zaakceptowa\u0107 Regulamin i Polityk\u0119 Prywatno\u015bci.",
  email_taken: "Ten e-mail jest ju\u017c zarejestrowany.",
  server_error: "Co\u015b posz\u0142o nie tak. Spr\u00f3buj ponownie."
};

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [phoneConsent, setPhoneConsent] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Has\u0142a nie s\u0105 takie same.");
      return;
    }

    setStatus("submitting");
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          phone: phone || undefined,
          termsAccepted,
          phoneConsent: phone ? phoneConsent : false
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.ok) {
        setStatus("idle");
        setError(ERROR_MESSAGES[data.error] || ERROR_MESSAGES.server_error);
        return;
      }

      router.push("/dashboard");
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
        <h1>za\u0142\u00f3\u017c konto</h1>
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

          <label className="field">
            <span>numer telefonu (opcjonalnie)</span>
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              autoComplete="tel"
            />
          </label>

          {phone ? (
            <label className="checkbox-field">
              <input
                type="checkbox"
                checked={phoneConsent}
                onChange={(event) => setPhoneConsent(event.target.checked)}
              />
              <span>Chc\u0119 dostawa\u0107 SMS, gdy dziewczyna odpowie na zaproszenie.</span>
            </label>
          ) : null}

          <label className="checkbox-field">
            <input
              type="checkbox"
              required
              checked={termsAccepted}
              onChange={(event) => setTermsAccepted(event.target.checked)}
            />
            <span>
              Akceptuj\u0119 <Link href="/regulamin">Regulamin</Link> i{" "}
              <Link href="/polityka-prywatnosci">Polityk\u0119 Prywatno\u015bci</Link>.
            </span>
          </label>

          {error ? <p className="soft-message error">{error}</p> : null}

          <button className="bone-button confirm-button" type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "zak\u0142adam konto..." : "za\u0142\u00f3\u017c konto"}
          </button>
        </form>
        <p className="auth-links">
          Masz ju\u017c konto? <Link href="/login">Zaloguj si\u0119</Link>
        </p>
      </section>
    </main>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";

export default function NewInvitationPage() {
  const [recipientLabel, setRecipientLabel] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [link, setLink] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    try {
      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientLabel })
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.ok) {
        setStatus("idle");
        setError("Co\u015b posz\u0142o nie tak. Spr\u00f3buj ponownie.");
        return;
      }

      setLink(`${window.location.origin}/r/${data.invitation.token}`);
      setStatus("done");
    } catch {
      setStatus("idle");
      setError("Co\u015b posz\u0142o nie tak. Spr\u00f3buj ponownie.");
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      // schowek moze byc niedostepny - link jest tez widoczny do recznego skopiowania
    }
  }

  if (status === "done") {
    return (
      <main className="app-shell">
        <section className="date-card auth-card">
          <p className="kicker">jamnikowa randka</p>
          <h1>gotowe!</h1>
          <p className="success-copy">Wy\u015blij ten link w wiadomo\u015bci:</p>
          <p className="invitation-link invitation-link-big">{link}</p>
          <button className="bone-button confirm-button" type="button" onClick={handleCopy}>
            skopiuj link
          </button>
          <p className="auth-links">
            <Link href="/dashboard">Wr\u00f3\u0107 do panelu</Link>
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="date-card auth-card">
        <p className="kicker">jamnikowa randka</p>
        <h1>nowe zaproszenie</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>imi\u0119 odbiorczyni (opcjonalnie, tylko dla Ciebie)</span>
            <input
              type="text"
              value={recipientLabel}
              onChange={(event) => setRecipientLabel(event.target.value)}
              maxLength={80}
            />
          </label>
          {error ? <p className="soft-message error">{error}</p> : null}
          <button className="bone-button confirm-button" type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "tworzenie..." : "utw\u00f3rz link"}
          </button>
        </form>
        <p className="auth-links">
          <Link href="/dashboard">Wr\u00f3\u0107 do panelu</Link>
        </p>
      </section>
    </main>
  );
}

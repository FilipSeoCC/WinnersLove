import Link from "next/link";
import Dachshund from "@/components/Dachshund";
import FloatingHearts from "@/components/FloatingHearts";

export default function LandingPage() {
  return (
    <main className="app-shell">
      <FloatingHearts active />
      <section className="date-card landing-card">
        <div className="sparkle-row" aria-hidden="true">
          <span>{"♥"}</span>
          <span>{"✦"}</span>
          <span>{"♥"}</span>
        </div>
        <Dachshund mood="happy" />
        <p className="kicker">jamnikowa randka</p>
        <h1>zamień zaproszenie na randkę w małą, jamnikową kartkę</h1>
        <p className="success-copy">
          Załóż konto, stwórz unikalny link i wyślij go w wiadomości. W panelu zobaczysz,
          czy dostałeś potwierdzenie randki — bez żadnych sztuczek.
        </p>
        <div className="button-row">
          <Link className="bone-button yes-button" href="/register">
            załóż konto
          </Link>
          <Link className="bone-button no-button" href="/login">
            zaloguj się
          </Link>
        </div>
        <p className="auth-links">
          <Link href="/regulamin">Regulamin</Link> ·{" "}
          <Link href="/polityka-prywatnosci">Polityka Prywatności</Link>
        </p>
        <a className="aiops-credit" href="https://www.ai-ops.pl/" aria-label="Stworzone przez AiOps">
          <span>Stworzone przez</span>
          <img src="https://www.ai-ops.pl/aiops-logo.png" alt="AiOps" width="28" height="28" />
          <strong>AiOps</strong>
        </a>
      </section>
    </main>
  );
}

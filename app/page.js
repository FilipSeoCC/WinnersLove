import Link from "next/link";
import Dachshund from "@/components/Dachshund";
import FloatingHearts from "@/components/FloatingHearts";

export default function LandingPage() {
  return (
    <main className="app-shell">
      <FloatingHearts active />
      <section className="date-card landing-card">
        <div className="sparkle-row" aria-hidden="true">
          <span>{"\u2665"}</span>
          <span>{"\u2726"}</span>
          <span>{"\u2665"}</span>
        </div>
        <Dachshund mood="happy" />
        <p className="kicker">jamnikowa randka</p>
        <h1>zamie\u0144 zaproszenie na randk\u0119 w ma\u0142\u0105, jamnikow\u0105 kartk\u0119</h1>
        <p className="success-copy">
          Za\u0142\u00f3\u017c konto, stw\u00f3rz unikalny link i wy\u015blij go w wiadomo\u015bci. W panelu zobaczysz,
          czy dosta\u0142e\u015b prawdziwe TAK, czy prawdziwe NIE — bez \u017cadnych sztuczek.
        </p>
        <div className="button-row">
          <Link className="bone-button yes-button" href="/register">
            za\u0142\u00f3\u017c konto
          </Link>
          <Link className="bone-button no-button" href="/login">
            zaloguj si\u0119
          </Link>
        </div>
        <p className="auth-links">
          <Link href="/regulamin">Regulamin</Link> ·{" "}
          <Link href="/polityka-prywatnosci">Polityka Prywatno\u015bci</Link>
        </p>
      </section>
    </main>
  );
}

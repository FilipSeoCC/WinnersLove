import Link from "next/link";

export const metadata = {
  title: "Polityka Prywatno\u015bci — Jamnikowa Randka"
};

export default function PolitykaPrywatnosciPage() {
  return (
    <main className="app-shell legal-shell">
      <section className="date-card legal-card">
        <p className="kicker">jamnikowa randka</p>
        <h1 className="legal-title">Polityka Prywatno\u015bci</h1>
        <p className="legal-updated">Ostatnia aktualizacja: 15 lipca 2026</p>

        <h2>1. Administrator danych</h2>
        <p>
          Administratorem danych osobowych jest osoba prowadz\u0105ca projekt Jamnikowa Randka,
          kontakt: <a href="mailto:fkedziorawenet@gmail.com">fkedziorawenet@gmail.com</a>.
        </p>

        <h2>2. Jakie dane przetwarzamy</h2>
        <p>Je\u015bli zak\u0142adasz konto (jeste\u015b nadawc\u0105 zaproszenia), przetwarzamy:</p>
        <ul>
          <li>adres e-mail i zahaszowane has\u0142o (nigdy nie przechowujemy has\u0142a w jawnej postaci),</li>
          <li>opcjonalnie numer telefonu — tylko je\u015bli go podasz i zaznaczysz osobn\u0105 zgod\u0119,</li>
          <li>tre\u015b\u0107 utworzonych przez Ciebie zaprosze\u0144 (opcjonalna etykieta odbiorczyni, status, wybrany termin).</li>
        </ul>
        <p>
          Je\u015bli otrzyma\u0142a\u015b/otrzyma\u0142e\u015b link z zaproszeniem (jeste\u015b odbiorczyni\u0105/odbiorc\u0105), nie
          zak\u0142adasz konta i nie zbieramy o Tobie nic ponad Twoj\u0105 odpowied\u017a — TAK z wybranym
          terminem albo NIE. Nie \u015bledzimy, czy i kiedy otworzy\u0142a\u015b/otworzy\u0142e\u015b link, nie zapisujemy
          Twojego adresu IP ani innych danych technicznych poza sam\u0105 odpowiedzi\u0105.
        </p>

        <h2>3. Cel i podstawa prawna przetwarzania</h2>
        <ul>
          <li>Prowadzenie konta i dzia\u0142anie Us\u0142ugi — art. 6 ust. 1 lit. b) RODO (wykonanie umowy).</li>
          <li>Akceptacja Regulaminu i Polityki Prywatno\u015bci — art. 6 ust. 1 lit. a) RODO (zgoda).</li>
          <li>Opcjonalne powiadomienia SMS o odpowiedzi na zaproszenie — art. 6 ust. 1 lit. a) RODO (odr\u0119bna, dobrowolna zgoda; funkcja mo\u017ce zosta\u0107 uruchomiona w przysz\u0142o\u015bci).</li>
        </ul>

        <h2>4. Odbiorcy danych</h2>
        <p>Korzystamy z podmiot\u00f3w przetwarzaj\u0105cych dane w naszym imieniu:</p>
        <ul>
          <li><strong>Resend</strong> — wysy\u0142ka wiadomo\u015bci e-mail (powiadomienia o odpowiedziach, reset has\u0142a),</li>
          <li><strong>Upstash</strong> — hosting bazy danych (Redis), w kt\u00f3rej przechowywane s\u0105 konta i zaproszenia,</li>
          <li><strong>Vercel</strong> — hosting aplikacji.</li>
        </ul>

        <h2>5. Okres przechowywania danych</h2>
        <p>
          Dane konta i powi\u0105zanych zaprosze\u0144 przechowujemy do momentu usuni\u0119cia konta przez
          Ciebie (funkcja „Usu\u0144 konto” w panelu) — wtedy usuwamy je trwale i niezw\u0142ocznie, wraz
          z wszystkimi utworzonymi zaproszeniami.
        </p>

        <h2>6. Twoje prawa</h2>
        <p>Zgodnie z RODO przys\u0142uguje Ci prawo do:</p>
        <ul>
          <li>dost\u0119pu do swoich danych (funkcja „Pobierz moje dane” w panelu),</li>
          <li>sprostowania danych,</li>
          <li>usuni\u0119cia danych (funkcja „Usu\u0144 konto” w panelu),</li>
          <li>ograniczenia przetwarzania i przenoszenia danych,</li>
          <li>wniesienia sprzeciwu wobec przetwarzania,</li>
          <li>cofni\u0119cia zgody w dowolnym momencie, bez wp\u0142ywu na zgodno\u015b\u0107 z prawem przetwarzania dokonanego przed jej cofni\u0119ciem,</li>
          <li>wniesienia skargi do Prezesa Urz\u0119du Ochrony Danych Osobowych.</li>
        </ul>

        <h2>7. Dobrowolno\u015b\u0107 podania danych</h2>
        <p>
          Podanie e-maila i has\u0142a jest dobrowolne, ale niezb\u0119dne do za\u0142o\u017cenia konta i korzystania
          z Us\u0142ugi. Podanie numeru telefonu jest w pe\u0142ni opcjonalne.
        </p>

        <h2>8. Bezpiecze\u0144stwo</h2>
        <p>
          Has\u0142a przechowujemy wy\u0142\u0105cznie w postaci zahaszowanej (bcrypt). Komunikacja z Us\u0142ug\u0105
          odbywa si\u0119 przez szyfrowane po\u0142\u0105czenie HTTPS.
        </p>

        <h2>9. Kontakt</h2>
        <p>
          W sprawach dotycz\u0105cych ochrony danych osobowych napisz na{" "}
          <a href="mailto:fkedziorawenet@gmail.com">fkedziorawenet@gmail.com</a>.
        </p>

        <p className="auth-links">
          <Link href="/">Wr\u00f3\u0107 na stron\u0119 g\u0142\u00f3wn\u0105</Link>
        </p>
      </section>
    </main>
  );
}

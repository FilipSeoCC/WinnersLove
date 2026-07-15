import Link from "next/link";

export const metadata = {
  title: "Polityka Prywatności — Jamnikowa Randka"
};

export default function PolitykaPrywatnosciPage() {
  return (
    <main className="app-shell legal-shell">
      <section className="date-card legal-card">
        <p className="kicker">jamnikowa randka</p>
        <h1 className="legal-title">Polityka Prywatności</h1>
        <p className="legal-updated">Ostatnia aktualizacja: 15 lipca 2026</p>

        <h2>1. Administrator danych</h2>
        <p>
          Administratorem danych osobowych jest osoba prowadząca projekt Jamnikowa Randka,
          kontakt: <a href="mailto:fkedziorawenet@gmail.com">fkedziorawenet@gmail.com</a>.
        </p>

        <h2>2. Jakie dane przetwarzamy</h2>
        <p>Jeśli zakładasz konto (jesteś nadawcą zaproszenia), przetwarzamy:</p>
        <ul>
          <li>adres e-mail i zahaszowane hasło (nigdy nie przechowujemy hasła w jawnej postaci),</li>
          <li>opcjonalnie numer telefonu — tylko jeśli go podasz i zaznaczysz osobną zgodę,</li>
          <li>treść utworzonych przez Ciebie zaproszeń (opcjonalna etykieta odbiorczyni, status, wybrany termin).</li>
        </ul>
        <p>
          Jeśli otrzymałaś/otrzymałeś link z zaproszeniem (jesteś odbiorczynią/odbiorcą), nie
          zakładasz konta i nie zbieramy o Tobie nic ponad Twoją odpowiedź — TAK z wybranym
          terminem albo NIE. Nie śledzimy, czy i kiedy otworzyłaś/otworzyłeś link, nie zapisujemy
          Twojego adresu IP ani innych danych technicznych poza samą odpowiedzią.
        </p>

        <h2>3. Cel i podstawa prawna przetwarzania</h2>
        <ul>
          <li>Prowadzenie konta i działanie Usługi — art. 6 ust. 1 lit. b) RODO (wykonanie umowy).</li>
          <li>Akceptacja Regulaminu i Polityki Prywatności — art. 6 ust. 1 lit. a) RODO (zgoda).</li>
          <li>Opcjonalne powiadomienia SMS o odpowiedzi na zaproszenie — art. 6 ust. 1 lit. a) RODO (odrębna, dobrowolna zgoda; funkcja może zostać uruchomiona w przyszłości).</li>
        </ul>

        <h2>4. Odbiorcy danych</h2>
        <p>Korzystamy z podmiotów przetwarzających dane w naszym imieniu:</p>
        <ul>
          <li><strong>Resend</strong> — wysyłka wiadomości e-mail (powiadomienia o odpowiedziach, reset hasła),</li>
          <li><strong>Upstash</strong> — hosting bazy danych (Redis), w której przechowywane są konta i zaproszenia,</li>
          <li><strong>Vercel</strong> — hosting aplikacji.</li>
        </ul>

        <h2>5. Okres przechowywania danych</h2>
        <p>
          Dane konta i powiązanych zaproszeń przechowujemy do momentu usunięcia konta przez
          Ciebie (funkcja „Usuń konto” w panelu) — wtedy usuwamy je trwale i niezwłocznie, wraz
          z wszystkimi utworzonymi zaproszeniami.
        </p>

        <h2>6. Twoje prawa</h2>
        <p>Zgodnie z RODO przysługuje Ci prawo do:</p>
        <ul>
          <li>dostępu do swoich danych (funkcja „Pobierz moje dane” w panelu),</li>
          <li>sprostowania danych,</li>
          <li>usunięcia danych (funkcja „Usuń konto” w panelu),</li>
          <li>ograniczenia przetwarzania i przenoszenia danych,</li>
          <li>wniesienia sprzeciwu wobec przetwarzania,</li>
          <li>cofnięcia zgody w dowolnym momencie, bez wpływu na zgodność z prawem przetwarzania dokonanego przed jej cofnięciem,</li>
          <li>wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych.</li>
        </ul>

        <h2>7. Dobrowolność podania danych</h2>
        <p>
          Podanie e-maila i hasła jest dobrowolne, ale niezbędne do założenia konta i korzystania
          z Usługi. Podanie numeru telefonu jest w pełni opcjonalne.
        </p>

        <h2>8. Bezpieczeństwo</h2>
        <p>
          Hasła przechowujemy wyłącznie w postaci zahaszowanej (bcrypt). Komunikacja z Usługą
          odbywa się przez szyfrowane połączenie HTTPS.
        </p>

        <h2>9. Kontakt</h2>
        <p>
          W sprawach dotyczących ochrony danych osobowych napisz na{" "}
          <a href="mailto:fkedziorawenet@gmail.com">fkedziorawenet@gmail.com</a>.
        </p>

        <p className="auth-links">
          <Link href="/">Wróć na stronę główną</Link>
        </p>
      </section>
    </main>
  );
}

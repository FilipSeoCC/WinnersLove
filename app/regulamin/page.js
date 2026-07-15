import Link from "next/link";

export const metadata = {
  title: "Regulamin — Jamnikowa Randka"
};

export default function RegulaminPage() {
  return (
    <main className="app-shell legal-shell">
      <section className="date-card legal-card">
        <p className="kicker">jamnikowa randka</p>
        <h1 className="legal-title">Regulamin</h1>
        <p className="legal-updated">Ostatnia aktualizacja: 15 lipca 2026</p>

        <h2>1. Postanowienia ogólne</h2>
        <p>
          Jamnikowa Randka („Usługa”) to aplikacja internetowa umożliwiająca założenie konta,
          utworzenie unikalnego linku z zaproszeniem na randkę i wysłanie go wybranej przez siebie
          osobie. Właścicielem i administratorem Usługi jest osoba prowadząca ten projekt, kontakt:{" "}
          <a href="mailto:fkedziorawenet@gmail.com">fkedziorawenet@gmail.com</a>.
        </p>

        <h2>2. Warunki korzystania</h2>
        <p>
          Z Usługi mogą korzystać osoby pełnoletnie. Zakładając konto, oświadczasz, że masz
          ukończone 18 lat i podajesz prawdziwy adres e-mail. Odpowiadasz za bezpieczeństwo
          swojego hasła i za wszystkie działania wykonane z Twojego konta.
        </p>

        <h2>3. Zasady wysyłania zaproszeń</h2>
        <p>Link z zaproszeniem możesz wysłać wyłącznie osobie, z którą masz realny kontakt i podstawy sądzić, że taka wiadomość będzie mile widziana. Zabronione jest w szczególności:</p>
        <ul>
          <li>wysyłanie zaproszeń osobom, które wprost poprosiły o zaprzestanie kontaktu,</li>
          <li>wielokrotne, uporczywe wysyłanie linków tej samej osobie po braku odpowiedzi lub po odpowiedzi NIE,</li>
          <li>wykorzystywanie Usługi do nękania, zastraszania lub jakiejkolwiek formy niechcianego kontaktu,</li>
          <li>udostępnianie linków w sposób masowy lub automatyczny.</li>
        </ul>
        <p>
          Odpowiedź NIE jest w Usłudze zawsze prawdziwa i widoczna w Twoim panelu — Usługa nie
          ukrywa ani nie zniekształca odmowy. Naruszenie powyższych zasad może skutkować
          zawieszeniem lub usunięciem konta bez zwrotu ewentualnych opłat.
        </p>

        <h2>4. Dane osobowe</h2>
        <p>
          Zasady przetwarzania danych opisuje osobny dokument:{" "}
          <Link href="/polityka-prywatnosci">Polityka Prywatności</Link>.
        </p>

        <h2>5. Odpowiedzialność</h2>
        <p>
          Usługa jest udostępniana w formule „tak jak jest”. Nie gwarantujemy, że osoba, do
          której wyślesz zaproszenie, odpowie, ani że odpowie w określonym czasie. Nie ponosimy
          odpowiedzialności za treść wiadomości, w których wysyłasz link (np. treść DM na innej
          platformie) — to pozostaje wyłącznie Twoją odpowiedzialnością.
        </p>

        <h2>6. Zmiany regulaminu</h2>
        <p>
          Możemy aktualizować ten Regulamin. O istotnych zmianach poinformujemy przy kolejnym
          logowaniu. Dalsze korzystanie z Usługi po zmianie oznacza akceptację nowej wersji.
        </p>

        <h2>7. Kontakt i reklamacje</h2>
        <p>
          W sprawach związanych z Usługą, w tym reklamacji, napisz na{" "}
          <a href="mailto:fkedziorawenet@gmail.com">fkedziorawenet@gmail.com</a>.
        </p>

        <p className="auth-links">
          <Link href="/">Wróć na stronę główną</Link>
        </p>
      </section>
    </main>
  );
}

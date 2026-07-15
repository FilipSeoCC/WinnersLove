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

        <h2>1. Postanowienia og\u00f3lne</h2>
        <p>
          Jamnikowa Randka („Us\u0142uga”) to aplikacja internetowa umo\u017cliwiaj\u0105ca za\u0142o\u017cenie konta,
          utworzenie unikalnego linku z zaproszeniem na randk\u0119 i wys\u0142anie go wybranej przez siebie
          osobie. W\u0142a\u015bcicielem i administratorem Us\u0142ugi jest osoba prowadz\u0105ca ten projekt, kontakt:{" "}
          <a href="mailto:fkedziorawenet@gmail.com">fkedziorawenet@gmail.com</a>.
        </p>

        <h2>2. Warunki korzystania</h2>
        <p>
          Z Us\u0142ugi mog\u0105 korzysta\u0107 osoby pe\u0142noletnie. Zak\u0142adaj\u0105c konto, o\u015bwiadczasz, \u017ce masz
          uko\u0144czone 18 lat i podajesz prawdziwy adres e-mail. Odpowiadasz za bezpiecze\u0144stwo
          swojego has\u0142a i za wszystkie dzia\u0142ania wykonane z Twojego konta.
        </p>

        <h2>3. Zasady wysy\u0142ania zaprosze\u0144</h2>
        <p>Link z zaproszeniem mo\u017cesz wys\u0142a\u0107 wy\u0142\u0105cznie osobie, z kt\u00f3r\u0105 masz realny kontakt i podstawy s\u0105dzi\u0107, \u017ce taka wiadomo\u015b\u0107 b\u0119dzie mile widziana. Zabronione jest w szczeg\u00f3lno\u015bci:</p>
        <ul>
          <li>wysy\u0142anie zaprosze\u0144 osobom, kt\u00f3re wprost poprosi\u0142y o zaprzestanie kontaktu,</li>
          <li>wielokrotne, uporczywe wysy\u0142anie link\u00f3w tej samej osobie po braku odpowiedzi lub po odpowiedzi NIE,</li>
          <li>wykorzystywanie Us\u0142ugi do n\u0119kania, zastraszania lub jakiejkolwiek formy niechcianego kontaktu,</li>
          <li>udost\u0119pnianie link\u00f3w w spos\u00f3b masowy lub automatyczny.</li>
        </ul>
        <p>
          Odpowied\u017a NIE jest w Us\u0142udze zawsze prawdziwa i widoczna w Twoim panelu — Us\u0142uga nie
          ukrywa ani nie zniekszta\u0142ca odmowy. Naruszenie powy\u017cszych zasad mo\u017ce skutkowa\u0107
          zawieszeniem lub usuni\u0119ciem konta bez zwrotu ewentualnych op\u0142at.
        </p>

        <h2>4. Dane osobowe</h2>
        <p>
          Zasady przetwarzania danych opisuje osobny dokument:{" "}
          <Link href="/polityka-prywatnosci">Polityka Prywatno\u015bci</Link>.
        </p>

        <h2>5. Odpowiedzialno\u015b\u0107</h2>
        <p>
          Us\u0142uga jest udost\u0119pniana w formule „tak jak jest”. Nie gwarantujemy, \u017ce osoba, do
          kt\u00f3rej wy\u015blesz zaproszenie, odpowie, ani \u017ce odpowie w okre\u015blonym czasie. Nie ponosimy
          odpowiedzialno\u015bci za tre\u015b\u0107 wiadomo\u015bci, w kt\u00f3rych wysy\u0142asz link (np. tre\u015b\u0107 DM na innej
          platformie) — to pozostaje wy\u0142\u0105cznie Twoj\u0105 odpowiedzialno\u015bci\u0105.
        </p>

        <h2>6. Zmiany regulaminu</h2>
        <p>
          Mo\u017cemy aktualizowa\u0107 ten Regulamin. O istotnych zmianach poinformujemy przy kolejnym
          logowaniu. Dalsze korzystanie z Us\u0142ugi po zmianie oznacza akceptacj\u0119 nowej wersji.
        </p>

        <h2>7. Kontakt i reklamacje</h2>
        <p>
          W sprawach zwi\u0105zanych z Us\u0142ug\u0105, w tym reklamacji, napisz na{" "}
          <a href="mailto:fkedziorawenet@gmail.com">fkedziorawenet@gmail.com</a>.
        </p>

        <p className="auth-links">
          <Link href="/">Wr\u00f3\u0107 na stron\u0119 g\u0142\u00f3wn\u0105</Link>
        </p>
      </section>
    </main>
  );
}

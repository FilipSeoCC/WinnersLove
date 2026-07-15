# Jamnikowa randka

Aplikacja Next.js do wysyłania spersonalizowanych zaproszeń na randkę. Użytkownik zakłada konto,
tworzy unikalny link z jamnikową kartką i wysyła go w wiadomości. W panelu widzi prawdziwy status
każdego zaproszenia — TAK, NIE albo brak odpowiedzi — bez żadnych sztuczek: odpowiedź NIE jest
zawsze respektowana i widoczna.

## Uruchomienie lokalne

1. Zainstaluj zależności:

```bash
npm install
```

2. Skopiuj zmienne środowiskowe:

```bash
cp .env.example .env.local
```

3. Uzupełnij `.env.local` (patrz sekcja "Zmienne środowiskowe" niżej).

4. Włącz aplikację:

```bash
npm run dev
```

5. Otwórz `http://localhost:4210` (celowo nie `3000` — żeby nie kolidować z innymi projektami działającymi równolegle).

## Zmienne środowiskowe

- `RESEND_API_KEY` - klucz API z Resend, do wysyłki maili (powiadomienia o odpowiedzi, reset hasła).
- `FROM_EMAIL` - zweryfikowany nadawca w Resend, np. `Jamnikowa Randka <noreply@twojadomena.pl>`.
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` - **wymagane**. Cała aplikacja (konta,
  logowanie, panel, zaproszenia) przechowuje dane w Upstash Redis. Bez tych zmiennych aplikacja
  nie zadziała.

Uwaga: w trybie testowym Resend może wymagać użycia `onboarding@resend.dev` jako nadawcy lub
zweryfikowanej domeny, zależnie od konfiguracji konta.

### Podpięcie Upstash Redis

1. W panelu Vercel: `Storage` → `Marketplace Database Providers` → zainstaluj integrację
   `Upstash for Redis` i podepnij ją do projektu.
2. Uruchom `vercel env pull .env.local`, żeby pobrać `UPSTASH_REDIS_REST_URL` i
   `UPSTASH_REDIS_REST_TOKEN` do lokalnego środowiska.

## Jak to działa

1. Użytkownik zakłada konto (`/register`) — e-mail, hasło, opcjonalny numer telefonu, wymagana
   zgoda na Regulamin i Politykę Prywatności.
2. W panelu (`/dashboard`) tworzy nowe zaproszenie (`/dashboard/new`) i dostaje unikalny link
   `/r/{token}` do wysłania w wiadomości.
3. Osoba, która dostanie link, **nie zakłada konta** — widzi kartkę z jamnikiem, wybiera TAK
   (kalendarz i termin) albo NIE. Obie odpowiedzi są prawdziwe i trafiają do panelu nadawcy.
4. Właściciel zaproszenia dostaje e-mail z odpowiedzią (przez Resend) i widzi status w panelu.

## RODO i zgody

- Rejestracja wymaga zaznaczenia zgody na Regulamin i Politykę Prywatności (checkbox, domyślnie
  odznaczony, walidowany też po stronie serwera).
- Numer telefonu jest opcjonalny, z osobną zgodą i jasno określonym celem (powiadomienia SMS —
  funkcja nieaktywna w tej wersji, dane są tylko zbierane pod przyszłe uruchomienie).
- Panel usera ma funkcje realizujące prawa RODO: „Pobierz moje dane” (eksport JSON) i „Usuń
  konto” (kaskadowe, trwałe usunięcie konta i wszystkich powiązanych zaproszeń).
- Treść `/regulamin` i `/polityka-prywatnosci` to solidny szkic, ale **nie zastępuje konsultacji
  z prawnikiem** przed realnym, publicznym uruchomieniem płatnego produktu.

## Testy

Smoke testy Playwright pokrywają podstawowy flow. Żądania do API są mockowane, więc testy nie
wysyłają prawdziwych maili.

```bash
npx playwright install --with-deps chromium
npm run test
```

## Deploy na Vercel

1. Wrzuć projekt do repozytorium GitHub.
2. W Vercel wybierz `Add New Project`.
3. Wskaż repozytorium z GitHuba.
4. Framework powinien zostać wykryty jako Next.js.
5. Podepnij Upstash Redis (patrz wyżej) i dodaj zmienne środowiskowe.
6. Kliknij `Deploy`.

## Struktura

- `app/page.js` - strona główna (landing) z CTA do rejestracji/logowania.
- `app/register/`, `app/login/`, `app/reset-password/` - ekrany autoryzacji.
- `app/dashboard/` - panel usera: lista zaproszeń, tworzenie nowego, eksport/usunięcie danych.
- `app/r/[token]/` - publiczna kartka zaproszenia (dawny hardcodowany flow, teraz sparametryzowany).
- `app/regulamin/`, `app/polityka-prywatnosci/` - strony prawne.
- `app/api/auth/` - rejestracja, logowanie, wylogowanie, reset hasła.
- `app/api/invitations/` - tworzenie/listowanie zaproszeń i odpowiedź odbiorczyni.
- `app/api/account/` - eksport i usunięcie konta (prawa RODO).
- `components/` - `Dachshund`, `FloatingHearts`, `Confetti` - reużywane elementy wizualne.
- `lib/` - `redis.js`, `session.js`, `auth.js`, `email.js`, `consent.js`, `calendarSlots.js`,
  `feedback.js` - współdzielona logika serwerowa i kliencka.
- `middleware.js` - chroni `/dashboard/**` przed dostępem bez zalogowania.
- `app/globals.css` - cały wygląd: pastelowy styl, jamnik CSS, tryb ciemny, formularze, panel.
- `tests/smoke.spec.js` - testy smoke Playwright.
- `.env.example` - przykład konfiguracji środowiska.

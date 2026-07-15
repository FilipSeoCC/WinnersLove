# Jamnikowa randka

Prosta, mobilna aplikacja Next.js do romantycznego zaproszenia na randkę. Ma pastelowy kreskówkowy styl, animowanego jamnika, uciekający przycisk `NIE`, wybór daty oraz endpoint Vercel wysyłający termin mailem przez Resend.

## Uruchomienie lokalne

1. Zainstaluj zależności:

```bash
npm install
```

2. Skopiuj zmienne środowiskowe:

```bash
cp .env.example .env.local
```

3. Uzupełnij `.env.local`:

```env
RESEND_API_KEY=re_uzupelnij_klucz_resend
FROM_EMAIL=Jamnikowa Randka <onboarding@resend.dev>
TO_EMAIL=fkedziorawenet@gmail.com

# Opcjonalne - historia zgłoszeń (Upstash Redis, patrz sekcja niżej)
UPSTASH_REDIS_REST_URL=https://uzupelnij.upstash.io
UPSTASH_REDIS_REST_TOKEN=uzupelnij_token_upstash
```

4. Włącz aplikację:

```bash
npm run dev
```

5. Otwórz `http://localhost:3000`.

## Zmienne środowiskowe na Vercel

W panelu projektu Vercel ustaw:

- `RESEND_API_KEY` - klucz API z Resend.
- `FROM_EMAIL` - zweryfikowany nadawca w Resend, np. `Jamnikowa Randka <noreply@twojadomena.pl>`.
- `TO_EMAIL` - adres odbiorcy. Domyślnie aplikacja używa `fkedziorawenet@gmail.com`, jeśli zmienna nie zostanie ustawiona.
- `UPSTASH_REDIS_REST_URL` i `UPSTASH_REDIS_REST_TOKEN` - opcjonalne, do zapisu historii zgłoszeń (patrz niżej).

Uwaga: w trybie testowym Resend może wymagać użycia `onboarding@resend.dev` jako nadawcy lub zweryfikowanej domeny, zależnie od konfiguracji konta.

## Historia zgłoszeń (opcjonalnie)

Każde poprawnie wysłane zgłoszenie jest dodatkowo zapisywane w Redis (lista `jamnikowa-randka:submissions`, maks. 200 ostatnich wpisów), jeśli skonfigurowano bazę.

1. W panelu Vercel: `Storage` -> `Marketplace Database Providers` -> zainstaluj integrację `Upstash for Redis` i podepnij ją do projektu.
2. Uruchom `vercel env pull .env.local`, żeby pobrać `UPSTASH_REDIS_REST_URL` i `UPSTASH_REDIS_REST_TOKEN` do lokalnego środowiska.
3. Bez tych zmiennych aplikacja działa normalnie - zapis historii jest pomijany, a błąd trafia tylko do logów serwera, nie blokuje wysyłki maila.

## Testy

Smoke testy Playwright pokrywają flow TAK -> kalendarz -> wysyłka (sukces i błąd) oraz sprawdzają, że przycisk NIE nie blokuje TAK. Żądania do `/api/send-date` są mockowane, więc testy nie wysyłają prawdziwych maili.

```bash
npx playwright install --with-deps chromium
npm run test
```

## Deploy na Vercel

1. Wrzuć projekt do repozytorium GitHub.
2. W Vercel wybierz `Add New Project`.
3. Wskaż repozytorium z GitHuba.
4. Framework powinien zostać wykryty jako Next.js.
5. Dodaj zmienne środowiskowe z sekcji powyżej.
6. Kliknij `Deploy`.

## Struktura

- `app/page.js` - główny ekran, animacje flow, formularz wyboru daty (z blokadą terminów z przeszłości), dźwięk/wibracja i konfetti.
- `app/globals.css` - pastelowy styl, jamnik CSS, tryb ciemny (`prefers-color-scheme`), serduszka, konfetti i przyciski-kości.
- `app/api/send-date/route.js` - endpoint `/api/send-date` wysyłający mail przez Resend i zapisujący historię zgłoszeń w Upstash Redis.
- `tests/smoke.spec.js` - testy smoke Playwright dla flow TAK -> kalendarz -> wysyłka.
- `playwright.config.js` - konfiguracja testów Playwright.
- `.env.example` - przykład konfiguracji środowiska.
- `package.json` - zależności i skrypty projektu.

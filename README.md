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

Uwaga: w trybie testowym Resend może wymagać użycia `onboarding@resend.dev` jako nadawcy lub zweryfikowanej domeny, zależnie od konfiguracji konta.

## Deploy na Vercel

1. Wrzuć projekt do repozytorium GitHub.
2. W Vercel wybierz `Add New Project`.
3. Wskaż repozytorium z GitHuba.
4. Framework powinien zostać wykryty jako Next.js.
5. Dodaj zmienne środowiskowe z sekcji powyżej.
6. Kliknij `Deploy`.

## Struktura

- `app/page.js` - główny ekran, animacje flow, formularz wyboru daty.
- `app/globals.css` - pastelowy styl, jamnik CSS, serduszka i przyciski-kości.
- `app/api/send-date/route.js` - endpoint `/api/send-date` wysyłający mail przez Resend.
- `.env.example` - przykład konfiguracji środowiska.
- `package.json` - zależności i skrypty projektu.

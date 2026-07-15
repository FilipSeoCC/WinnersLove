import { test, expect } from "@playwright/test";

const HAS_TEST_DATABASE = Boolean(process.env.UPSTASH_REDIS_REST_URL);

function uniqueEmail() {
  return `test-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
}

test.describe("strony statyczne (bez bazy danych)", () => {
  test("strona główna pokazuje CTA do rejestracji i logowania", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "załóż konto" })).toBeVisible();
    await expect(page.getByRole("link", { name: "zaloguj się" })).toBeVisible();
  });

  test("regulamin i polityka prywatności się renderują", async ({ page }) => {
    await page.goto("/regulamin");
    await expect(page.getByRole("heading", { name: "Regulamin" })).toBeVisible();

    await page.goto("/polityka-prywatnosci");
    await expect(page.getByRole("heading", { name: "Polityka Prywatności" })).toBeVisible();
  });

  test("rejestracja bez zaznaczonej zgody nie przechodzi dalej", async ({ page }) => {
    await page.goto("/register");
    await page.getByLabel("e-mail").fill(uniqueEmail());
    await page.getByLabel("hasło", { exact: true }).fill("TestHaslo123");
    await page.getByLabel("powtórz hasło").fill("TestHaslo123");

    await page.getByRole("button", { name: "załóż konto" }).click();

    // przegladarka blokuje submit przez brak zaznaczenia wymaganego checkboxa (required),
    // wiec nadal jestesmy na /register
    await expect(page).toHaveURL(/\/register$/);
  });
});

test.describe("pełny flow z prawdziwą bazą (wymaga UPSTASH_REDIS_REST_URL)", () => {
  test.skip(!HAS_TEST_DATABASE, "brak skonfigurowanej bazy Upstash Redis dla testow");

  test("rejestracja -> nowe zaproszenie -> TAK -> sukces", async ({ page, context }) => {
    const email = uniqueEmail();

    await page.goto("/register");
    await page.getByLabel("e-mail").fill(email);
    await page.getByLabel("hasło", { exact: true }).fill("TestHaslo123");
    await page.getByLabel("powtórz hasło").fill("TestHaslo123");
    await page.getByLabel(/Akceptuję/).check();
    await page.getByRole("button", { name: "załóż konto" }).click();

    await expect(page).toHaveURL(/\/dashboard$/);

    await page.getByRole("link", { name: "nowe zaproszenie" }).click();
    await page.getByRole("button", { name: "utwórz link" }).click();

    const linkText = await page.locator(".invitation-link-big").innerText();
    const url = new URL(linkText.trim());

    const recipientPage = await context.newPage();
    await recipientPage.goto(url.pathname);

    await expect(
      recipientPage.getByRole("heading", { name: /umówisz się na randkę/ })
    ).toBeVisible();

    await recipientPage.getByRole("link", { name: "TAK" }).click();
    await expect(
      recipientPage.getByRole("heading", { name: "wybierz termin randki" })
    ).toBeVisible();

    await recipientPage.getByRole("button", { name: "potwierdzam randkę" }).click();
    await expect(
      recipientPage.getByRole("heading", { name: /randka zapisana/ })
    ).toBeVisible();
  });

  test("odpowiedź NIE jest zapisana i widoczna po odświeżeniu", async ({ page, context }) => {
    const email = uniqueEmail();

    await page.goto("/register");
    await page.getByLabel("e-mail").fill(email);
    await page.getByLabel("hasło", { exact: true }).fill("TestHaslo123");
    await page.getByLabel("powtórz hasło").fill("TestHaslo123");
    await page.getByLabel(/Akceptuję/).check();
    await page.getByRole("button", { name: "załóż konto" }).click();
    await expect(page).toHaveURL(/\/dashboard$/);

    await page.getByRole("link", { name: "nowe zaproszenie" }).click();
    await page.getByRole("button", { name: "utwórz link" }).click();

    const linkText = await page.locator(".invitation-link-big").innerText();
    const url = new URL(linkText.trim());

    const recipientPage = await context.newPage();
    await recipientPage.goto(url.pathname);
    await recipientPage.getByRole("button", { name: "nie, dziękuję" }).click();

    await expect(recipientPage.getByRole("heading", { name: /dzięki, że dałaś znać/ })).toBeVisible();

    await recipientPage.reload();
    await expect(
      recipientPage.getByRole("heading", { name: /odpowiedź została już zapisana/ })
    ).toBeVisible();

    await page.goto("/dashboard");
    await expect(page.getByText("odpowiedziała NIE")).toBeVisible();
  });
});

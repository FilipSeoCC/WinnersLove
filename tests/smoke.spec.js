import { test, expect } from "@playwright/test";

test("TAK -> kalendarz -> wysylka -> ekran sukcesu", async ({ page }) => {
  await page.route("**/api/send-date", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true })
    });
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "czy umówisz się ze mną na randkę?" })).toBeVisible();

  await page.getByRole("link", { name: "TAK" }).click();
  await expect(page.getByRole("heading", { name: "wybierz termin randki" })).toBeVisible();

  await page.getByRole("button", { name: "potwierdzam randkę" }).click();
  await expect(page.getByRole("heading", { name: /randka zapisana/ })).toBeVisible();
});

test("przycisk NIE nie blokuje przejscia przez TAK", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "NIE" }).click();
  await expect(page.getByText(/kość/)).toBeVisible();

  await page.getByRole("link", { name: "TAK" }).click();
  await expect(page.getByRole("heading", { name: "wybierz termin randki" })).toBeVisible();
});

test("blad API pokazuje lagodny komunikat zamiast szczegolow technicznych", async ({ page }) => {
  await page.route("**/api/send-date", async (route) => {
    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ ok: false })
    });
  });

  await page.goto("/");
  await page.getByRole("link", { name: "TAK" }).click();
  await expect(page.getByRole("heading", { name: "wybierz termin randki" })).toBeVisible();

  await page.getByRole("button", { name: "potwierdzam randkę" }).click();
  await expect(page.getByText(/coś poszło nie tak/)).toBeVisible();
});

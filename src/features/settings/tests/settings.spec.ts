import { test, expect, Page } from "@playwright/test";

async function login(
  page: Page,
  email = "dariolaborde2014@gmail.com",
  password = "LeonelMessi64.",
) {
  await page.goto("/auth/sign-in");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL("/home");
}

test("Settings page loads", async ({ page }) => {
  await login(page);
  await page.goto("/settings");
  await expect(page).toHaveURL(/.*settings/);
  await expect(page.getByRole("heading", { name: /settings/i })).toBeVisible();
});

test("Account tab is visible", async ({ page }) => {
  await login(page);
  await page.goto("/settings");
  await expect(page.getByRole("link", { name: /account/i })).toBeVisible();
});

test("Notifications tab is visible", async ({ page }) => {
  await login(page);
  await page.goto("/settings");
  await expect(
    page.getByRole("link", { name: /notifications/i }),
  ).toBeVisible();
});

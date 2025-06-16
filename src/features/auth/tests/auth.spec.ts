import { test, expect, Page } from "@playwright/test";

async function login(
  page: Page,
  email = "user@example.com",
  password = "password123",
) {
  await page.goto("/auth/sign-in");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL("/home");
}

test("Sign in page loads", async ({ page }) => {
  await page.goto("/auth/sign-in");
  await expect(page).toHaveURL(/.*sign-in/);
  await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
});

test("User can fill sign in form", async ({ page }) => {
  await page.goto("/auth/sign-in");
  await page.getByLabel("Email").fill("user@example.com");
  await page.getByLabel("Password").fill("password123");
  await expect(page.getByLabel("Email")).toHaveValue("user@example.com");
});

test("UI is different for Admin and User", async ({ browser }) => {
  const adminContext = await browser.newContext();
  const adminPage = await adminContext.newPage();
  await login(adminPage, "dariolaborde2014@gmail.com", "LeonelMessi64.");
  await adminPage.goto("/appointments");
  await expect(
    adminPage.getByRole("button", { name: /new appointment/i }),
  ).toBeVisible();
  await adminContext.close();

  const userContext = await browser.newContext();
  const userPage = await userContext.newPage();
  await login(userPage, "dariolaborde2017@gmail.com", "LeonelMessi64.");
  await userPage.goto("/appointments");
  await expect(
    userPage.getByRole("button", { name: /new appointment/i }),
  ).toHaveCount(0);
  await userContext.close();
});

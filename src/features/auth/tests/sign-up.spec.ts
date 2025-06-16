import { test, expect } from "@playwright/test";

function uniqueEmail() {
  return `testuser_${Date.now()}@example.com`;
}

test.describe("Sign Up", () => {
  test("Fails if the email already exists", async ({ page }) => {
    await page.goto("/sign-up");
    await page.getByLabel("Full Name").fill("Test User");
    await page.getByLabel("Identification Number").fill("1234567890");
    await page.getByLabel("Email").fill("user@example.com");
    await page.getByLabel("Password").fill("Password123!");
    await page.getByRole("button", { name: /sign up/i }).click();
    await expect(
      page.getByText(/email.*already exists|ya existe/i),
    ).toBeVisible();
  });

  test("Fails if the email is invalid", async ({ page }) => {
    await page.goto("/sign-up");
    await page.getByLabel("Full Name").fill("Test User");
    await page.getByLabel("Identification Number").fill("1234567890");
    await page.getByLabel("Email").fill("no-es-un-email");
    await page.getByLabel("Password").fill("Password123!");
    await page.getByRole("button", { name: /sign up/i }).click();
    const emailInput = await page.getByLabel("Email");
    const isValid = await emailInput.evaluate(
      (el: HTMLInputElement) => el.validity.valid,
    );
    expect(isValid).toBe(false);
    await expect(page).toHaveURL(/sign-up/);
  });

  test("Fails if the password is weak", async ({ page }) => {
    await page.goto("/sign-up");
    await page.getByLabel("Full Name").fill("Test User");
    await page.getByLabel("Identification Number").fill("1234567890");
    await page.getByLabel("Email").fill(uniqueEmail());
    await page.getByLabel("Password").fill("123");
    await page.getByRole("button", { name: /sign up/i }).click();
    await expect(
      page.getByText(/password.*weak|contraseña.*débil/i),
    ).toBeVisible();
  });

  test("Fails if any field is missing", async ({ page }) => {
    await page.goto("/sign-up");
    await page.getByRole("button", { name: /sign up/i }).click();
    await expect(
      page.getByText("Name must be at least 2 characters long", {
        exact: false,
      }),
    ).toBeVisible();
    await expect(
      page.getByText("Identification number must be 10 characters long", {
        exact: false,
      }),
    ).toBeVisible();
    await expect(
      page.getByText("Email must be a valid email address", { exact: false }),
    ).toBeVisible();
    await expect(
      page.getByText("Password must be at least 8 characters long", {
        exact: false,
      }),
    ).toBeVisible();
  });

  test("Fails if the name is missing", async ({ page }) => {
    await page.goto("/sign-up");
    await page.getByLabel("Identification Number").fill("1234567890");
    await page.getByLabel("Email").fill(uniqueEmail());
    await page.getByLabel("Password").fill("Password123!");
    await page.getByRole("button", { name: /sign up/i }).click();
    await expect(
      page.getByText("Name must be at least 2 characters long", {
        exact: false,
      }),
    ).toBeVisible();
  });

  test("Fails if the identification number is missing", async ({ page }) => {
    await page.goto("/sign-up");
    await page.getByLabel("Full Name").fill("Test User");
    await page.getByLabel("Email").fill(uniqueEmail());
    await page.getByLabel("Password").fill("Password123!");
    await page.getByRole("button", { name: /sign up/i }).click();
    await expect(
      page.getByText("Identification number must be 10 characters long", {
        exact: false,
      }),
    ).toBeVisible();
  });

  test("Fails if the email is missing", async ({ page }) => {
    await page.goto("/sign-up");
    await page.getByLabel("Full Name").fill("Test User");
    await page.getByLabel("Identification Number").fill("1234567890");
    // No llena email
    await page.getByLabel("Password").fill("Password123!");
    await page.getByRole("button", { name: /sign up/i }).click();
    await expect(
      page.getByText("Email must be a valid email address", { exact: false }),
    ).toBeVisible();
  });

  test("Fails if the password is missing", async ({ page }) => {
    await page.goto("/sign-up");
    await page.getByLabel("Full Name").fill("Test User");
    await page.getByLabel("Identification Number").fill("1234567890");
    await page.getByLabel("Email").fill(uniqueEmail());
    // No llena contraseña
    await page.getByRole("button", { name: /sign up/i }).click();
    await expect(
      page.getByText("Password must be at least 8 characters long", {
        exact: false,
      }),
    ).toBeVisible();
  });
});

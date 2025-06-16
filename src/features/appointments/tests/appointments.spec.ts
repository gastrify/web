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

test("Appointments page loads", async ({ page }) => {
  await login(page);
  await page.goto("appointments");
  await expect(page).toHaveURL(/.*appointments/);
  await expect(
    page.getByRole("heading", { name: "Appointments", exact: true }),
  ).toBeVisible();
});

test("Book appointment button exists", async ({ page }) => {
  await login(page);
  await page.goto("appointments");
  await expect(
    page.getByRole("button", { name: /new appointment/i }),
  ).toBeVisible();
});

test("User can see their appointments", async ({ page }) => {
  await login(page, "dariolaborde2017@gmail.com", "LeonelMessi64.");
  await page.goto("/appointments");
  await page.waitForLoadState("networkidle");
  const hasNoAppointments = await page
    .locator("text=You have no appointments yet")
    .count();
  if (hasNoAppointments > 0) {
    await expect(page.getByText("You have no appointments yet")).toBeVisible();
  } else {
    const cards = await page.locator("[class*=UserAppointmentCard]").count();
    expect(cards).toBeGreaterThan(0);
  }
});

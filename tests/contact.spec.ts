import { test, expect } from "@playwright/test";

test.describe("Contact Form", () => {
  test("should load Turnstile and submit form successfully", async ({ page }) => {
    // Navigate to contact page
    await page.goto("/contact");

    // Wait for Turnstile script to load
    await page.waitForFunction(() => typeof (window as any).turnstile !== "undefined", {
      timeout: 10000,
    });

    // Verify Turnstile SDK is loaded
    const turnstileType = await page.evaluate(() => typeof (window as any).turnstile);
    expect(turnstileType).toBe("object");

    // Verify Turnstile script is loaded
    const scriptCount = await page.evaluate(() => {
      return Array.from(document.scripts)
        .map((s) => s.src)
        .filter((u) => u.includes("challenges.cloudflare.com")).length;
    });
    expect(scriptCount).toBeGreaterThanOrEqual(1);

    // The widget's iframe lives in a closed shadow root, so assert on the token instead.
    // Cloudflare's always-pass test site key issues a dummy token without user interaction.
    await page.waitForFunction(() => !!(window as any).turnstile?.getResponse?.(), null, {
      timeout: 15000,
    });

    const tokenInput = await page.$('input[name="cf-turnstile-response"]');
    expect(tokenInput).not.toBeNull();

    // Fill out the form
    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('textarea[name="message"]', "This is a test message from E2E test.");

    // Submit the form
    const responsePromise = page.waitForResponse(
      (response) => response.url().includes("/api/contact") && response.request().method() === "POST",
      { timeout: 10000 }
    );

    await page.click('button[type="submit"]');

    // Wait for API response
    const response = await responsePromise;
    expect(response.ok()).toBe(true);

    // The form redirects on success, which discards the response body before it can be read.
    await expect(page).toHaveURL(/\/thanks\?src=contact/, { timeout: 10000 });
  });

  test("should show dev banner in non-production", async ({ page }) => {
    await page.goto("/contact");

    // Wait a bit for page to load
    await page.waitForTimeout(1000);

    // Check if dev banner is present (only in non-production)
    const devBanner = await page.$('text=Captcha:');
    if (devBanner) {
      const bannerText = await devBanner.textContent();
      expect(bannerText).toContain("Captcha:");
      expect(bannerText).toContain("SDK:");
      expect(bannerText).toContain("token:");
    }
  });
});


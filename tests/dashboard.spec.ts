import { test, expect } from '@playwright/test';

// Pattern: reuse saved auth state. No login steps here — the `chromium`
// project loads storageState from auth.setup.ts, so we land authenticated.
test('dashboard is reachable when already authenticated', async ({ page }) => {
  await page.goto('/dashboard.html');
  await expect(page.getByTestId('welcome')).toContainText('Welcome, demo-user');
  await expect(page.getByRole('button', { name: 'Log out' })).toBeVisible();
});

import { test as setup, expect } from '@playwright/test';

// Runs once (the `setup` project). Logs in and saves the browser state
// (localStorage/cookies) to disk so other tests start already authenticated.
const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('/login.html');
  await page.getByLabel('Username').fill('demo-user');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL(/dashboard\.html/);
  await expect(page.getByTestId('welcome')).toContainText('Welcome, demo-user');

  await page.context().storageState({ path: authFile });
});

import { test, expect } from '@playwright/test';

// Pattern: form interaction + both failure and success paths.
test.describe('login', () => {
  test('shows an error on bad credentials', async ({ page }) => {
    await page.goto('/login.html');
    await page.getByLabel('Username').fill('demo-user');
    await page.getByLabel('Password').fill('wrong');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByTestId('error')).toBeVisible();
    await expect(page).toHaveURL(/login\.html/);
  });

  test('@smoke logs in and redirects to dashboard', async ({ page }) => {
    await page.goto('/login.html');
    await page.getByLabel('Username').fill('alice');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL(/dashboard\.html/);
    await expect(page.getByTestId('welcome')).toHaveText('Welcome, alice!');
  });
});

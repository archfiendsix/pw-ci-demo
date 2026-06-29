import { test, expect } from '@playwright/test';

// Pattern: navigation + page structure assertions. Tagged @smoke so a
// PR-triggered job can run just this subset fast.
test.describe('home page @smoke', () => {
  test('loads with title and heading', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/PW CI Demo/);
    await expect(page.getByRole('heading', { name: 'Playwright CI Demo' })).toBeVisible();
  });

  test('nav links route to the right pages', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Todos' }).click();
    await expect(page).toHaveURL(/todos\.html/);
    await expect(page.getByRole('heading', { name: 'Todos' })).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';

// Pattern: network interception. Mock the backend so the UI is tested
// deterministically, independent of the real API.
test.describe('quote widget', () => {
  test('renders a mocked API response', async ({ page }) => {
    await page.route('**/api/quote', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ quote: 'Mocked quote for a stable test', source: 'mock' }),
      });
    });

    await page.goto('/');
    await expect(page.getByTestId('quote')).toHaveText('Mocked quote for a stable test');
  });

  test('handles an API failure gracefully', async ({ page }) => {
    await page.route('**/api/quote', (route) => route.abort());

    await page.goto('/');
    await expect(page.getByTestId('quote')).toHaveText('Failed to load');
  });
});

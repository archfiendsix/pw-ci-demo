import { test, expect } from '@playwright/test';

// Pattern: stateful CRUD UI + list assertions + persistence across reload.
test.describe('todos', () => {
  test('adds and removes items', async ({ page }) => {
    await page.goto('/todos.html');

    await page.getByLabel('New todo').fill('Write CI workflow');
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByLabel('New todo').fill('Review PR');
    await page.getByRole('button', { name: 'Add' }).click();

    const items = page.getByTestId('todo-list').getByRole('listitem');
    await expect(items).toHaveCount(2);
    await expect(page.getByTestId('count')).toHaveText('2 items');

    await page.getByRole('button', { name: 'Remove Review PR' }).click();
    await expect(items).toHaveCount(1);
    await expect(page.getByTestId('count')).toHaveText('1 item');
  });

  test('persists across reload', async ({ page }) => {
    await page.goto('/todos.html');
    await page.getByLabel('New todo').fill('Persist me');
    await page.getByRole('button', { name: 'Add' }).click();

    await page.reload();
    await expect(page.getByText('Persist me')).toBeVisible();
  });
});

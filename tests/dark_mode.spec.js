import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://kanban-566d8.firebaseapp.com/');
  await page.locator('label').click();
});
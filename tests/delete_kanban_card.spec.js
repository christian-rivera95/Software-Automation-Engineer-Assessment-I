import { test, expect } from '@playwright/test';

test('delete task test', async ({ page }) => {
  await page.goto('https://kanban-566d8.firebaseapp.com/');

  
  const taskLocator = page.locator('article').first();
  await expect(taskLocator).toBeVisible(); 
  await taskLocator.click(); 

  const svgLocator = page.locator('svg >> circle').nth(2); 
  await expect(svgLocator).toBeVisible(); 
  await svgLocator.click();

  const deleteButtonLocator = page.locator('text=Delete Task');
  await expect(deleteButtonLocator).toBeVisible();
  await deleteButtonLocator.click(); 

  // confirm deletion
  const confirmButton = page.locator('button:has-text("Delete")'); 
  await expect(confirmButton).toBeVisible(); 
  await confirmButton.click(); 
  
  await expect(taskLocator).not.toBeVisible();
});

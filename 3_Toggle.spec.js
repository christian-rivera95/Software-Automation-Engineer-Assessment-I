import { test, expect } from '@playwright/test';

test('Toggle dark mode', async ({ page }) => {

  // System goes to this Kanban Card application  
  await page.goto('https://kanban-566d8.firebaseapp.com/task1724856648687task1724856930756task1724856979829task1724856993182task1724857029403task1724860172006task1724862599662task1724862788966');

  // System clicks toggle switch to switch from light mode to dark mode
  await page.locator('//label[@class="bg-main-purple hover:bg-main-purple-light cursor-pointer min-w-[40px] min-h-[22px] p-1 rounded-xl relative"]').click();

  await page.waitForTimeout(3000);

  const darkMode = page.locator('//div[contains(@class, "translate-x-[18px]")]')
  await darkMode.waitFor({state: 'visible', timeout:5000});

  await expect (darkMode).toHaveClass("rounded-full h-[14px] w-[14px] bg-white transition-all absolute translate-x-[18px]");
  
  console.log("Application is set to dark mode.")
  });

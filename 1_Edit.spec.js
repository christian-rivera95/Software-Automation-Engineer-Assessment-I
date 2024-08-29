import { test, expect } from '@playwright/test';

test('Edit a card', async ({ page }) => {

  // System goes to this Kanban Card application  
  await page.goto('https://kanban-566d8.firebaseapp.com/task1724856648687task1724856930756task1724856979829task1724856993182task1724857029403task1724860172006task1724862599662task1724862788966');
  
  // System gets the column header of the first column
  const columnHeader = await page.locator('//div[@class="mx-auto w-11/12 pt-6 pb-24"]/div[1]/div[1]/section[1]/div[1]/h2').innerText();
  console.log('Column Header', columnHeader);

  // System locates first card on 2nd column by using XPATH
  await page.locator('//div[@class="flex gap-6"]/section[2]/div[2]/article[1]').click();

  // System locates the checkbox web element
  const cardCheckbox = await page.locator('//div[@class="flex flex-col gap-2"]/label')

  // System counts all the checkboxes on the modal
  const checkboxCount = await cardCheckbox.count();

  // System locates the first instance of un-checked checkbox and ticks it
  let tickedCheckbox = false;

  for (let i = 0; i < checkboxCount; i++){
    const checkbox = cardCheckbox.nth(i);
    const isChecked = await checkbox.isChecked();

    if (!isChecked){
        await checkbox.check();
        await expect(checkbox).toBeChecked();
        tickedCheckbox = true;
        break;
    }
  }

    // System expands drop down and selects the option that matches the 1st column's header
    await page.locator('//div[@class="bg-white dark:bg-dark-grey rounded-lg p-1"]/div[1]/div[3]/div[1]').click();
    const dropdownOption = `//div[@class="bg-white dark:bg-dark-grey rounded-lg p-1"]//div[text()="${columnHeader}"]`;
    await page.locator(dropdownOption).click();

    // System clicks outside the modal
    await page.locator('//div[@class="fixed min-h-screen min-w-full bg-black bg-opacity-50 top-0 left-0 z-10"').click();
});
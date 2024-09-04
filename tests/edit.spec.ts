import { expect, test } from '@playwright/test';

test('Edit Task', async ({ page }) => {
  await page.goto('https://kanban-566d8.firebaseapp.com/task1725349299199task1725349305063');
  
  const cards = await page.$$eval('section article h3', elements =>
    elements.map(el => el.textContent)
  );

  for (const card of cards) {
    await page.getByRole('heading', { name: card?.trim() }).first().click();

    //check subtask
    const checkboxLabels = await page.$$eval('label', elements =>
      elements.map(el => el.textContent?.trim() || '')
    );

    //subtask counter
    let uncheckedSubtask = 0;
    let checkedSubtask = 0;
    for (const checkboxlabel of checkboxLabels) {
      if(checkboxlabel != '') {
        const isChecked = await page.getByRole('checkbox', {name: checkboxlabel.trim()}).isChecked();
        if(!isChecked) {
          await page.locator('label').filter({hasText: checkboxlabel.trim()}).click();
          uncheckedSubtask +=1;
        }
        if(isChecked) {
          checkedSubtask +=1;
        }
      }
    }
    //Verify total number of completed subtask
    const totalCheckedSubtask = uncheckedSubtask + checkedSubtask;
    expect(totalCheckedSubtask).toBe(checkboxLabels.length-1)
    

    //edit task section
    await page.locator('div').filter({ hasText: /^Edit TaskDelete Task$/ }).locator('circle').first().click();
    await page.getByText('Edit Task').click();

    //set to first column
    const statusLocator = await page.locator('div.hidden.absolute.rounded.left-0.top-full.mt-4 > div').first().allTextContents();
    await page.locator('.group-focus\\:hidden > svg').click();
    await page.getByText(statusLocator[0], {exact: true}).click();

    //save & close task
    await page.getByRole('button', { name: 'Save Changes' }).click();
  }
});

test('Delete Card', async ({ page }) => {
  await page.goto('https://kanban-566d8.firebaseapp.com/task1725349299199task1725349305063');

  const cards = await page.$$eval('section article h3', elements =>
    elements.map(el => el.textContent)
  );
  const firstCard = cards[0];

  const columnLocator = 'div[data-dragscroll].flex.flex-col.gap-5 > article';
  const count = await page.locator(columnLocator).count();
  console.log('Total Articles: ', count);
  
  //open first card
  await page.getByRole('heading', { name: firstCard?.trim() }).first().click();

  //open task menu 
  await page.locator('div').filter({ hasText: /^Edit TaskDelete Task$/ }).locator('circle').first().click();
  await page.getByText('Delete Task').click();
  await page.getByRole('button', { name: 'Delete' }).click();
  console.log('Task Deleted Successfully')

  //verify if card is deleted
  async function isCardDeleted(page) {
    try {
      await page.waitForSelector(firstCard, { state: 'detached'});
      return true;
    } catch (error) {
      return false;
    }
  }

  await page.waitForTimeout(1000);

  const result = await isCardDeleted(page);
  expect(result).toBe(true);

  const columnLocatorUpdated = 'div[data-dragscroll].flex.flex-col.gap-5 > article';
  const countUpdated = await page.locator(columnLocatorUpdated).count();
  console.log('Total Articles After Delete: ', countUpdated);
  expect(countUpdated).toBe(count - 1)
});


test('Toggle Dark Mode', async ({ page }) => {
  await page.goto('https://kanban-566d8.firebaseapp.com/task1725349299199task1725349305063');
  const darkModeToggle = page.locator('label[class*="bg-main-purple"][class*="hover:bg-main-purple-light"][class*="cursor-pointer"][class*="min-w-[40px]"][class*="min-h-[22px]"][class*="p-1"][class*="rounded-xl"][class*="relative"]');
  
  // Get the initial state
  const initialIsDarkMode = await page.evaluate(() => {
    return document.documentElement.classList.contains('dark');
  });

  //Toggle
  await darkModeToggle.click();

  await page.waitForTimeout(1000);

  const finalIsDarkMode = await page.evaluate(() => document.documentElement.classList.contains('dark'));

  expect(finalIsDarkMode).not.toBe(initialIsDarkMode);
});





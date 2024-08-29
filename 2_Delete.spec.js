import { test, expect } from '@playwright/test';

test('Delete a card', async ({ page }) => {

  // System goes to this Kanban Card application  
  await page.goto('https://kanban-566d8.firebaseapp.com/task1724856648687task1724856930756task1724856979829task1724856993182task1724857029403task1724860172006task1724862599662task1724862788966');
  
  // System gets the column header of the second column
  const columnHeader = await page.locator('//div[@class="mx-auto w-11/12 pt-6 pb-24"]/div[1]/div[1]/section[2]/div[1]/h2[1]').innerText();
  console.log('Column Header', columnHeader);

  // System gets the card header of the first card on the second column
  const cardHeader = await page.locator('//div[@class="flex gap-6"]/section[2]/div[2]/article[1]/h3[1]').innerText();
  console.log('Card Header:', cardHeader);

  // System counts the cards inside the second column
  const cardCount = page.locator('//div[@class="flex gap-6"]/section[2]/div[2]/article[1]/h3').count();

  // If else statement in case the second column is already empty
if (cardCount > 0) {
  // System locates first card on 2nd column by using XPATH
  await page.locator('//div[@class="flex gap-6"]/section[2]/div[2]/article[1]').click();
  
  // System clicks ellipsis and deletes the card
  await page.locator('//div[@class="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] z-10 max-w-xs w-11/12 sm:max-w-md"]/div[1]/div[1]/div[1]/div[1]').click();
  await page.getByText('Delete Task').click();
  await page.getByRole('button', { name: 'Delete' }).click();

  // System checks if the specific card header is deleted or has a count of 0
  const deletedCard = page.locator(`//div[@class="flex gap-6"]/section[2]//article/h3[text()="${cardHeader}"]`);
  await expect(deletedCard).toHaveCount(0);

  // System displays message after test execution
  console.log(cardHeader + " has been successfully deleted from " + columnHeader)
} else { // System displays this message if column is already empty
  console.log(columnHeader + " column has no available cards.")
}
});
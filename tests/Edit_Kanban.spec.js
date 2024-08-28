import { test, expect } from '@playwright/test';

test('Edit a Kanban Card with Incomplete Subtask', async ({ page }) => {
  // Navigate to the Kanban board URL
  await page.goto('https://kanban-566d8.firebaseapp.com/');
  
  // Locate all card elements
  const cards = page.locator('article');
  let targetCard;
  for (let i = 0; i < await cards.count(); i++) {
    const card = cards.nth(i);

    // subtask text
    const cardTitle = await card.locator('p.card-title').textContent();
    const subtaskText = await card.locator('p.subtasks').textContent();

    // Check if the subtask text indicates incomplete subtasks
    if (/^\d+ of \d+/.test(subtaskText)) {
      const [completed, total] = subtaskText.split(' of ').map(Number);
      if (completed < total) {
        targetCard = card;
        break;
      }
    }
  }

  if (targetCard) {
    await targetCard.click();


    await page.waitForSelector('div.card-details', { state: 'visible' });

    await page.fill('input[name="card-title"]', 'Updated Title');
    await page.fill('textarea[name="card-description"]', 'Updated Description');

    // Save the changes
    await page.click('button.save-card');

    // Optionally: Verify that the changes are reflected
    const updatedTitle = await page.textContent('div.card-title');
    expect(updatedTitle).toBe('Updated Title');
    
    const updatedDescription = await page.textContent('div.card-description');
    expect(updatedDescription).toBe('Updated Description');
  } else {
    // Handle the case where no card with incomplete subtasks is found
    throw new Error('No card with incomplete subtasks found.');
  }
});

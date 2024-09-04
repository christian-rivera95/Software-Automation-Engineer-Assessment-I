import { test } from "@playwright/test";
import KanbanPage from "../pages/kanban";

test("Edit card", async ({page}) => {
    const kanban = new KanbanPage(page);
    await page.goto('https://kanban-566d8.firebaseapp.com/');
    await kanban.chooseCard();
    await kanban.completeSubTask();
    await kanban.moveToFirstColumn();
 
})

test("Toggle dark mode", async ({page}) => {
    const kanban = new KanbanPage(page);
    await page.goto('https://kanban-566d8.firebaseapp.com/');
    const bgcolor = await kanban.getInitialBG();
    await kanban.clickDarkMode();
    await kanban.validateColorChange(bgcolor);
})

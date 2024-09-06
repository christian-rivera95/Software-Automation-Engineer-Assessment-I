const { test, expect} = require('@playwright/test');
import {Kanban} from '../page-object/Locators'

test.beforeEach( async ({ page }) => {

    await page.goto('https://kanban-566d8.firebaseapp.com/')

})

test('Edit a Kanban Card', async ({page }) => {

    const kanban = new Kanban(page)

    await kanban.Edit_a_Kanban_Card()
})

test('Delete a Kanban Card', async ({page }) => {

    const kanban = new Kanban(page)

    await kanban.Delete_a_Card()
})

test("Toggle Dark Mode", async ({page }) => {

    const kanban = new Kanban(page)

    await kanban.Toogle_Dark_Mode()
    
})
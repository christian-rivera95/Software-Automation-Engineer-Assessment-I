import { expect, Page } from "@playwright/test";
import { randomInt } from "crypto";
export default class KanbanPage{

    constructor(public page: Page){    }
    async chooseCard(){

        //Check if the 2nd column has cards
        while (true) {
            const count = await this.page.locator('xpath = //div[@class="flex gap-6"]/descendant::section[2]/descendant::p').allInnerTexts();
            if (count.length>0) {
                break;
            }
            await this.page.reload();
        }
        var cardwithincomplete = 0;
        const result = await this.page.locator('xpath = //div[@class="flex gap-6"]/descendant::section[2]/descendant::p').allInnerTexts();
        
        //Get Card with incomplete subtask
        for (let index = 0; index < result.length; index++) {
            
            if (result[index].match(/\d+/g)[0] < result[index].match(/\d+/g)[1]) {
                cardwithincomplete = index+1;
                break;
            }
        }

        await this.page.locator(`xpath = //div[@class="flex gap-6"]/descendant::section[2]/descendant::article[${cardwithincomplete}]`)
        .click();
    }

    async completeSubTask(){
        await this.page.locator('xpath = (//span[@class="text-black dark:text-white text-xs font-bold"])[1]')
        .click();
    }

    async moveToFirstColumn(){
        const fristcol = await this.page.locator('xpath = //div[@class="flex gap-6"]/descendant::section[1]/descendant::h2').innerText();
        await this.page.locator('xpath = //div[@class="text-sm text-black dark:text-white font-bold rounded px-4 py-3 relative w-full flex items-center border border-medium-grey border-opacity-25 cursor-pointer hover:border-main-purple focus:border-main-purple group"]')
        .click();
        await this.page.locator('xpath = //div[@class="p-4 text-medium-grey hover:text-black dark:hover:text-white"]').filter({ hasText: fristcol.replace(/[^a-z]/gi, '') }).click();
    }

    async deleteKanbanCard(){
        //Choose a column
        const columns = await this.page.locator('xpath = //div[@class="flex gap-6"]/descendant::section/descendant::h2').allTextContents();
        
        var columnposition = 0;
        for (let index = 0; index < columns.length; index++) {
            // const element = array[index];
            if (Number(columns[index].match(/\d+/g)[0]) > 0) {
                columnposition = index+1;
                break;
            }
        }

        const cards = await this.page.locator(`xpath = //div[@class="flex gap-6"]/descendant::section[${columnposition}]/descendant::h3`).allInnerTexts();
        const selectedcardnumber = (cards.length=1) ? 1  : randomInt(1,cards.length);
        const selectedcard = cards[selectedcardnumber-1]

        await this.page.locator(`xpath = //div[@class="flex gap-6"]/descendant::section[${columnposition}]/descendant::h3[${selectedcardnumber}]`)
        .click()
        await this.page.locator('xpath = //div[@class="flex justify-between items-center gap-4"]/descendant::div[1]')
        .click()
        await this.page.locator('xpath = //div[@class="flex justify-between items-center gap-4"]/descendant::p[contains(text(),"Delete Task")]')
        .click()
        await this.page.locator('xpath = //div/descendant::button[@class = "text-white font-bold text-sm py-2.5 px-4 w-full rounded-3xl bg-red hover:bg-red-light"]')
        .click()

        //Validation
        expect(this.page.locator(`xpath = //div[@class="flex gap-6"]/descendant::section/descendant::h3[contains(text(),"${selectedcard}")]`))
        .toHaveCount(0);
    }

    async clickDarkMode(){
        await this.page.locator('xpath = //label[@class="bg-main-purple hover:bg-main-purple-light cursor-pointer min-w-[40px] min-h-[22px] p-1 rounded-xl relative"]')
        .click();
    }

    async getInitialBG(){
        const element = await this.page.waitForSelector("//body");
        const color = await element.evaluate((el) => {
            return window.getComputedStyle(el).getPropertyValue('background-color');
        });
        return color;
       }

    async validateColorChange(bgcolor: string){
        expect(this.getInitialBG).not.toContain(bgcolor)
    }
}
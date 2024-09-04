import { expect, Page } from "@playwright/test";
export default class KanbanPage{

    constructor(public page: Page){    }
    async chooseCard(){

        //Get Card with incomplete subtask
        
        while (true) {
            const count = await this.page.locator('xpath = //div[@class="flex gap-6"]/descendant::section[2]/descendant::p').allInnerTexts();
            if (count.length>0) {
                break;
            }
            await this.page.reload();
        }
        var cardwithincomplete = 0;
        const result = await this.page.locator('xpath = //div[@class="flex gap-6"]/descendant::section[2]/descendant::p').allInnerTexts();
        
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
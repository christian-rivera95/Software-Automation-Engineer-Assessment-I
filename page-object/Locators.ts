import { Locator, Page } from 'playwright'
import {expect} from '@playwright/test'
import { error } from 'console';
 
class Kanban {
    public page: Page;//page object

    //establish locators
    public secondColumnKanbanCard: Locator;
    public kanbanSubTask: Locator;
    public kanbanSubTaskContainer: Locator;
    public firstColumnName: Locator;
    public kanbanSubTaskDropdown: Locator;
    public firstColumnKanbanCard: Locator;
    public header: Locator;
    public hideSideBarButton:Locator;
    public boardsSelector: Locator;
    public dottedMenu: Locator;
    public deleteTaskButton: Locator;
    public deleteConfirmationPrompt: Locator;
    public deleteConfirmation: Locator;
    public darkModeSelector: Locator;
    public darkModeValidation: Locator;
 
    constructor(page: Page){

        //locator definitions
        this.page = page;
        
        this.firstColumnName = page.locator("section").first().locator('h2')
        this.firstColumnKanbanCard = page.locator("section").first().locator('div').locator('article')
        this.secondColumnKanbanCard = page.locator("section").nth(1).locator('div').locator('article')
        
        this.kanbanSubTaskContainer = page.locator(".p-5")
        this.kanbanSubTask = page.locator(".p-5").locator('label')
        this.kanbanSubTaskDropdown = page.locator('div[tabindex="1"]').last()
        this.header = page.locator('.fixed').last()
        this.hideSideBarButton = page.getByText("Hide Sidebar")
        this.dottedMenu = page.locator('div[tabindex="1"]').nth(1)
        this.deleteTaskButton = page.getByText('Delete Task')
        this.deleteConfirmationPrompt = page.locator('.p-6').last()
        this.deleteConfirmation = page.getByRole('button', { name: 'Delete' })
        this.darkModeSelector = page.locator('label div')
        this.darkModeValidation = page.locator('.dark')

        this.boardsSelector = page.locator('div.items-center').nth(5)
 
 
}
 //script functions - logic

    async Edit_a_Kanban_Card(){

        //1st step: review if there is a card on the second column, if there is not, then switch boards
        //2nd step: retrieve the first column name to both verify and select to which column to switch the task
        //3: review all cards on the second column and determine which one has no subtasks completed
        //4: 

        let firstColumnName
        let parsedColumnName
        let lowerCaseColumnName
        let sentenceCaseText
        //parse the first column name to save it then select it, later
    
        let secondColumnHasCard
        let altBoardSecondColumnHasCard
        
        try{

            await this.secondColumnKanbanCard.first().waitFor( {state: 'visible', timeout: 4000}) //review if the second column has a card
            secondColumnHasCard = true
        
        } catch (error){

            secondColumnHasCard = false

        }
    
        let initialTasks;
        let finalTasks;
        let taskName;
        let numberTypeInitialTasks;
        let numberTypeFinalTasks
        
        let k = -1;
        if(secondColumnHasCard){
    
            firstColumnName = await this.firstColumnName.innerText()
            parsedColumnName = firstColumnName.replace(/\s*\(\s*\d+\s*\)/, '').trim();
            lowerCaseColumnName = parsedColumnName.toLowerCase()
            sentenceCaseText = lowerCaseColumnName.charAt(0).toUpperCase() + lowerCaseColumnName.slice(1)
    
            await this.hideSideBarButton.click() // hide sidebar for better visibility - found flakyness when debugging
    
            const regex = /^(\d+)\s+of\s+(\d+)/; //filter for numbers of the subtasks in the kanban card
    
            for(let kanbanCards of await this.secondColumnKanbanCard.all()){ //iterate through all cards and evaluate their subtasks
                k++ //card position
                let subTaskText: string | null = await kanbanCards.locator("p").textContent() //subtask text under title
                if(subTaskText == null){

                subTaskText = " "

                }
        
                const numberMatches = subTaskText.match(regex) // matching criteria for the regex filter
    
                if(numberMatches){

                    initialTasks = numberMatches[1]; //String for the (X of X subtasks)
                    numberTypeInitialTasks = Number(initialTasks) //convert string to number
                    finalTasks = numberMatches[2];
                    numberTypeFinalTasks = Number (finalTasks)

                }
                
                if(numberTypeInitialTasks !== numberTypeFinalTasks){ //if the  first number is not equal to the second number, save the name of the task and break out of the loop

                    taskName = await this.secondColumnKanbanCard.nth(k).locator("h3").innerText() //Task Name
                    break;

                }
            }
    
            let i = -1; //subtask identifier
            
            await this.secondColumnKanbanCard.nth(k).click() //click the task identified above
            
            expect(this.kanbanSubTaskContainer).toBeVisible() //assert that the container is visible
    
            for(const checkboxes of await this.kanbanSubTask.locator('input[type="checkbox"]').all()){
                i++
                let checkStatus = await checkboxes.isChecked()

                if(!checkStatus){

                    await this.kanbanSubTask.nth(i).click()
                    break;

                }
            }
    
            await this.kanbanSubTaskDropdown.click()

            await this.page.getByText(sentenceCaseText).last().click()
            let dropdownValue = await this.kanbanSubTaskDropdown.getAttribute('value')
            expect(dropdownValue).toContain(sentenceCaseText)
            
            expect(this.kanbanSubTask.locator('input[type="checkbox"]').nth(i)).toBeChecked()
            
            await this.page.mouse.click(4, 4)
            
            expect(this.kanbanSubTaskContainer).toBeHidden()
            
            let finalSubTasks = await this.firstColumnKanbanCard.last().locator("p").textContent()
            let movedCardName = await this.firstColumnKanbanCard.last().locator("h3").innerText()
    
    
            if(finalSubTasks == null){
            finalSubTasks = " "
            }
            
            let finalNumberMatches = finalSubTasks.match(regex)
            let doneTasks;
            let numberTypeDoneTasks;
            
            if(finalNumberMatches){
                doneTasks = finalNumberMatches[1]
                numberTypeDoneTasks = Number(doneTasks)
            }
            
            expect(numberTypeDoneTasks == (numberTypeInitialTasks + 1)).toBeTruthy()
            
            expect(movedCardName).toContain(taskName)
    
    
        } else {
    
        for(let boards of await this.boardsSelector.all()){

            await boards.click()

            try{
                await this.secondColumnKanbanCard.first().waitFor( {state: 'visible', timeout: 4000}) //review if the second column has a card
                altBoardSecondColumnHasCard = true
        
            } catch (error){

            altBoardSecondColumnHasCard = false

            }
            if(altBoardSecondColumnHasCard){
            
                firstColumnName = await this.firstColumnName.innerText()
                parsedColumnName = firstColumnName.replace(/\s*\(\s*\d+\s*\)/, '').trim();
                lowerCaseColumnName = parsedColumnName.toLowerCase()
                sentenceCaseText = lowerCaseColumnName.charAt(0).toUpperCase() + lowerCaseColumnName.slice(1)
                
                await this.hideSideBarButton.click()
                
                const regex = /^(\d+)\s+of\s+(\d+)/;
                
                for(let kanbanCards of await this.secondColumnKanbanCard.all()){ //iterate through all cards and evaluate their subtasks
                    k++
                    let subTaskText: string | null = await kanbanCards.locator("p").textContent()
                
                    if(subTaskText == null){
                        subTaskText = " "
                    }
                
                    const numberMatches = subTaskText.match(regex)
                
                    if(numberMatches){
                        initialTasks = numberMatches[1];
                        numberTypeInitialTasks = Number(initialTasks)
                        finalTasks = numberMatches[2];
                        numberTypeFinalTasks = Number (finalTasks)
                    }
                
                    if(numberTypeInitialTasks !== numberTypeFinalTasks){
                        taskName = await this.secondColumnKanbanCard.nth(k).locator("h3").innerText()
                        break;
                    }
                }
                
                let i = -1;
                
                await this.secondColumnKanbanCard.nth(k).click()
                
                expect(this.kanbanSubTaskContainer).toBeVisible()
                
                for(const checkboxes of await this.kanbanSubTask.locator('input[type="checkbox"]').all()){
                    i++

                    let checkStatus = await checkboxes.isChecked()

                    if(!checkStatus){

                        await this.kanbanSubTask.nth(i).click()
                        break;

                    }
                }
                
                await this.kanbanSubTaskDropdown.click()
                await this.page.getByText(sentenceCaseText).last().click()
                let dropdownValue = await this.kanbanSubTaskDropdown.getAttribute('value')
                expect(dropdownValue).toContain(sentenceCaseText)
                
                expect(this.kanbanSubTask.locator('input[type="checkbox"]').nth(i)).toBeChecked()
                
                await this.page.mouse.click(4, 4) //close subTaskPrompt
                
                expect(this.kanbanSubTaskContainer).toBeHidden()
                
                let finalSubTasks = await this.firstColumnKanbanCard.last().locator("p").textContent()
                let movedCardName = await this.firstColumnKanbanCard.last().locator("h3").innerText()
                
                
                if(finalSubTasks == null){

                    finalSubTasks = " "

                }
                
                let finalNumberMatches = finalSubTasks.match(regex)
                let doneTasks;
                let numberTypeDoneTasks;
                
                if(finalNumberMatches){

                    doneTasks = finalNumberMatches[1]
                    numberTypeDoneTasks = Number(doneTasks)

                }
                
                expect(numberTypeDoneTasks == (numberTypeInitialTasks + 1)).toBeTruthy()
                
                expect(movedCardName).toContain(taskName)
                break;
            }
        }
    
        }
    }
 
    async Delete_a_Card(){
    
        let existFirstColumnCards;
    
        try{
            await this.firstColumnKanbanCard.first().waitFor( {state: 'visible', timeout: 4000})
            existFirstColumnCards = true
        
        } catch (error){

            existFirstColumnCards = false

        }
    
        if(existFirstColumnCards){
        
            let cardNamesArray: string [] = []
        
            for(let tasks of await this.firstColumnKanbanCard.all()){
            
                let name: string | null = await tasks.locator('h3').textContent()
            
                if(name){

                    cardNamesArray.push(name)

                }
            
            }
        
            let cardName = await this.firstColumnKanbanCard.first().locator('h3').innerText()
            let firstColumnCards;
            
            await this.firstColumnKanbanCard.first().click()
            
            expect(this.kanbanSubTaskContainer).toBeVisible()
            
            await this.dottedMenu.click()
            
            await this.deleteTaskButton.click()
            
            
            expect(this.deleteConfirmationPrompt).toBeVisible()
            
            await this.deleteConfirmation.click()
            
            await this.page.waitForTimeout(300)
        
            try{

                await this.firstColumnKanbanCard.first().waitFor( {state: 'visible', timeout: 4000} )
                cardNamesArray.shift()
                firstColumnCards = true;
            
            } catch (error){

                firstColumnCards = false;

            }

            let newCardNamesArray: string [] = []
            
            if(firstColumnCards){
                for(let kanbanCards of await this.firstColumnKanbanCard.all()){
            
                    let name: string | null = await kanbanCards.locator('h3').textContent()
            
                    if(name){

                        newCardNamesArray.push(name)

                    }
            
                    if(name == cardName){

                    break;

                    }
            
                }

                cardNamesArray.sort()
                newCardNamesArray.sort()
            
                for(let z = -1; z < cardNamesArray.length; z++){

                    if(cardNamesArray[z] !== newCardNamesArray[z]){

                        throw error;
                    }
                }
            }
        
        } else{
        
            let cardNamesArray: string [] = []
            
            for(let tasks of await this.secondColumnKanbanCard.all()){
            
                let name: string | null = await tasks.locator('h3').textContent()
            
                if(name){

                    cardNamesArray.push(name)

                }
            
            }
        
                let cardName = await this.secondColumnKanbanCard.first().locator('h3').innerText()
                let secondColumnCards;
                
                await this.secondColumnKanbanCard.first().click()
                
                expect(this.kanbanSubTaskContainer).toBeVisible()
                
                await this.dottedMenu.click()
                
                await this.deleteTaskButton.click()
                
                expect(this.deleteConfirmationPrompt).toBeVisible()
                
                await this.deleteConfirmation.click()
        
                try{

                await this.secondColumnKanbanCard.first().waitFor( {state: 'visible', timeout: 4000} )
                cardNamesArray.shift()
                secondColumnCards = true;
                
                } catch (error){

                secondColumnCards = false;

                }
                let newCardNamesArray: string [] = []
                
                if(secondColumnCards){
                    for(let kanbanCards of await this.secondColumnKanbanCard.all()){
                    
                        let name: string | null = await kanbanCards.locator('h3').textContent()
                    
                        if(name){
                        newCardNamesArray.push(name)
                        }
                    
                        if(name == cardName){
                        break;
                        }
                    
                    }
                    cardNamesArray.sort()
                    newCardNamesArray.sort()
                    
                    for(let z = 0; z < cardNamesArray.length; z++){
                        if(cardNamesArray[z] !== newCardNamesArray[z]){

                            return false;
                            
                        }
                    }
                }
        }
    }
 
    async Toogle_Dark_Mode(){
    
        await this.darkModeSelector.click()
        
        await this.darkModeValidation.waitFor()
    }
}
 
export {Kanban};

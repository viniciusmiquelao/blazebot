import { Bot } from "../../bot/CreateBot"
import { MountMessageHelper } from "../Messages/MountMessageHelpers"
import { CountsUseCase } from "../../useCases/counts/CountsUseCase"
import { DoubleUpdateV2 } from "../../Types"

let inGame = false;
let gale = 0;
let entryColorGame = 0;

class MetricDouble {
    bot: Bot
    mounteMessageHelper: MountMessageHelper
    alert: Promise<string>
    info: Promise<string>
    cover: Promise<string>
    entryBlack: Promise<string>
    entryRed: Promise<string>
    gale1: Promise<string>
    gale2: Promise<string>
    red: Promise<string>
    greenWithWhite: Promise<string>
    green: Promise<string>
    date: string
    createdAt: string

    constructor() {
        this.bot = new Bot()
        this.mounteMessageHelper = new MountMessageHelper()
        this.alert = this.mounteMessageHelper.Alert()
        this.info = this.mounteMessageHelper.Info()
        this.cover = this.mounteMessageHelper.Cover()
        this.entryBlack = this.mounteMessageHelper.Entryblack()
        this.entryRed = this.mounteMessageHelper.EntryRed()
        this.green = this.mounteMessageHelper.Green()
        this.gale1 = this.mounteMessageHelper.Gale1()
        this.gale2 = this.mounteMessageHelper.Gale2()
        this.greenWithWhite = this.mounteMessageHelper.GreenWithWhite()
        this.red = this.mounteMessageHelper.Red()
        this.date = Intl.DateTimeFormat("pt-br").format(new Date())
        this.createdAt = this.date
    }

    async entryInGame(entry: number | null){
        gale = 0;
        entryColorGame = entry;
        inGame = true;
    }

    

    async verifySequenceFour(list: DoubleUpdateV2[]) {
        let message: string;
        const finalFourUpdates = list.slice(list.length - 4,list.length)

        const checkReds = finalFourUpdates.filter((e)=> e.color == 1)

        if(checkReds.length == 4){
            message = await this.entryBlack;
            await this.entryInGame(2);
        }  

        const checkBlacks = finalFourUpdates.filter((e)=> e.color == 2)

        if(checkBlacks.length == 4){
            message = await this.entryRed;
            await this.entryInGame(1);
        }  

        if(message != undefined){
            this.bot.sendMessage({ message})
            console.log({ message })
        }
    }

    async verifyWhiteAndSequenceColors(list: DoubleUpdateV2[]) {
        let message: string;
        const finalTreeUpdates = list.slice(list.length - 3,list.length)

        const checkWhite = finalTreeUpdates[0]

        if(checkWhite.color != 0) return; 

        const checkBlacks = finalTreeUpdates.filter((e)=> e.color == 2)

        if(checkBlacks.length == 2){
            message = await this.entryRed;
            await this.entryInGame(1);
        }  

        const checkReds = finalTreeUpdates.filter((e)=> e.color == 1)

        if(checkReds.length == 2){
            message = await this.entryRed;
            await this.entryInGame(2);
        }  

        if(message != undefined){
            this.bot.sendMessage({ message})
            console.log({ message })
        }
    }

    async verifyChess(list: DoubleUpdateV2[]) {
        let message: string;
        const finalFiveUpdates = list.slice(list.length - 5,list.length)

        let result1 = true;
        let result2 = true;
        let result3 = true;
        let result4 = true;


        let odds = finalFiveUpdates.filter((a, i) => i%2)
        let evens = finalFiveUpdates.filter((a, i) => i%2 == 0)

        for (let i = 0; i < odds.length; i++) {
            if (odds[i].color != 1) {
                result1 = false;
                break;
            }
        }

        for (let i = 0; i < evens.length; i++) {
            if (evens[i].color != 2) {
                result2 = false;
                break;
            }
        }

        for (let i = 0; i < odds.length; i++) {
            if (odds[i].color != 2) {
                result3 = false;
                break;
            }
        }

        for (let i = 0; i < evens.length; i++) {
            if (evens[i].color != 1) {
                result4 = false;
                break;
            }
        }


        if((result1 == true && result2 == true) || (result3 == true && result4 == true)) {
            if(finalFiveUpdates[finalFiveUpdates.length - 1].color == 1){
                message = await this.entryRed;
                await this.entryInGame(1);
            } else if (finalFiveUpdates[finalFiveUpdates.length - 1].color == 2) {
                message = await this.entryBlack;
                await this.entryInGame(2);
            } else return
        } else return

        

        if(message != undefined){
            this.bot.sendMessage({ message})
            console.log({ message })
        }
    }

    async game(newUpdate: DoubleUpdateV2){
        let message: string;

        let counter = new CountsUseCase()

        let counterToday = await counter.getCounts()

        if(counterToday == null){
            const d = new Date()

            const date = Intl.DateTimeFormat("pt-br").format(d)
            counterToday =  await counter.createCounts({
                countGale1: 0, 
                countGale2: 0, 
                countGreen: 0, 
                countRed: 0, 
                countWhite: 0, 
                createdAt: date,
            })
        }

        if(newUpdate.color == entryColorGame){
            message = await this.green;
            await counter.updateCounts({
                id: counterToday.id, 
                createdAt: counterToday.createdAt, 
                countGreen: counterToday.countGreen + 1
            })
            inGame = false;
        } else if (newUpdate.color == 0){
            message = await this.greenWithWhite;
            await counter.updateCounts({
                id: counterToday.id, 
                createdAt: counterToday.createdAt, 
                countGreen: counterToday.countGreen + 1
            })
            inGame = false;
        }

        if(message == undefined){
            switch (gale) {
                case 0:
                    message = await this.gale1;
                    gale = gale + 1
                    break;
                case 1:
                    message = await this.gale2;
                    gale = gale + 1
                    break;
                case 2:
                    message = await this.red;
                    gale = 0
                    inGame = false;
                    await counter.updateCounts({
                        id: counterToday.id, 
                        createdAt: counterToday.createdAt, 
                        countRed: counterToday.countRed + 1
                    })
                    break;
    
            }
        }

        if(message != undefined){
            this.bot.sendMessage({ message})
            console.log({ message })
        }
       
    }
}

export { MetricDouble, inGame }
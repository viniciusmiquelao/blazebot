import { Bot } from "../../bot/CreateBot"
import { MountMessageHelper } from "../Messages/MountMessageHelpers"
import { CountsUseCase } from "../../useCases/counts/CountsUseCase"
import { DoubleUpdateV2 } from "../../Types"

let inGame = false;
let gale = 0;
let entryColorGame = 0;
let messageId = 0;

class MetricDouble {
    bot: Bot
    mounteMessageHelper: MountMessageHelper
    alert: Promise<string>
    info: Promise<string>
    cover: Promise<string>
    entryBlack: Promise<string>
    possibleGame: Promise<string>
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
        this.possibleGame = this.mounteMessageHelper.PossibleGame()
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

    async resetMessageId(){
        if(messageId != 0){
            this.bot.deleteMessageWithID(messageId)
            messageId = 0
        }
    }

    async sendPossibleGame(){
        if(!inGame){
            let message = await this.possibleGame;
            let messageIdSended = await this.bot.sendMessage({ message })
            messageId = messageIdSended
            console.log({ message }) 
        }
    }


    async verifySequenceFour(list: DoubleUpdateV2[]) {
        let message: string;
        let finalFourUpdates = list.slice(list.length - 4,list.length)

        let checkReds = finalFourUpdates.filter((e)=> e.color == 1)

        if(checkReds.length == 4){
            message = await this.entryBlack;
            await this.entryInGame(2);
        }  

        let checkBlacks = finalFourUpdates.filter((e)=> e.color == 2)

        if(checkBlacks.length == 4){
            message = await this.entryRed;
            await this.entryInGame(1);
        }  

        if(message == undefined){
            let finalTreeUpdates = list.slice(list.length - 3,list.length)

            let checkRedsPossible = finalTreeUpdates.filter((e)=> e.color == 1)

            if(checkRedsPossible.length == 3){
                message = await this.possibleGame;
            }  

            let checkBlacksPossible = finalTreeUpdates.filter((e)=> e.color == 2)

            if(checkBlacksPossible.length == 3){
                message = await this.possibleGame;
            }  

            
                
            if(message != undefined){
                await this.sendPossibleGame()
                return
            }
            
        }

        if(message != undefined){
            await this.bot.sendMessage({ message})
            console.log({ message })
        }

        return 
    }

    async verifySequenceTree(list: DoubleUpdateV2[]) {
        let message: string;
        let finalFourUpdates = list.slice(list.length - 3,list.length)

        let checkReds = finalFourUpdates.filter((e)=> e.color == 1)

        if(checkReds.length == 3){
            message = await this.entryBlack;
            await this.entryInGame(2);
        }  

        let checkBlacks = finalFourUpdates.filter((e)=> e.color == 2)

        if(checkBlacks.length == 3){
            message = await this.entryRed;
            await this.entryInGame(1);
        }  

        if(message == undefined){
            let finalTreeUpdates = list.slice(list.length - 2,list.length)

            let checkRedsPossible = finalTreeUpdates.filter((e)=> e.color == 1)

            if(checkRedsPossible.length == 2){
                message = await this.possibleGame;
            }  

            let checkBlacksPossible = finalTreeUpdates.filter((e)=> e.color == 2)

            if(checkBlacksPossible.length == 2){
                message = await this.possibleGame;
            }  

            
                
            if(message != undefined){
                await this.sendPossibleGame()
                return
            }
            
        }

        if(message != undefined){
            await this.bot.sendMessage({ message})
            console.log({ message })
        }

        return 
    }

    async verifyWhiteAndSequenceColors(list: DoubleUpdateV2[]) {
        let message: string;
        let finalTreeUpdates = list.slice(list.length - 3,list.length)

        let checkWhite = finalTreeUpdates[0]

        if(checkWhite.color == 0) {
            let checkBlacks = finalTreeUpdates.filter((e)=> e.color == 2)

            if(checkBlacks.length == 2){
                message = await this.entryRed;
                await this.entryInGame(1);
            }  

            let checkReds = finalTreeUpdates.filter((e)=> e.color == 1)

            if(checkReds.length == 2){
                message = await this.entryBlack;
                await this.entryInGame(2);
            }  

        }; 

        if(message == undefined){
            let finalTwoUpdates = list.slice(list.length - 2,list.length)

            if(finalTwoUpdates[1].color != 0 && finalTwoUpdates[0].color == 0){
                await this.sendPossibleGame()
                return
            }
        }

        if(message != undefined){
            this.bot.sendMessage({ message})
            console.log({ message })
        }

        return
    }

    async verifyChess(list: DoubleUpdateV2[]) {
        let message: string;
        let finalFiveUpdates = list.slice(list.length - 5,list.length)

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
            } 
        }

        if(message == undefined){
            let finalFourUpdates = list.slice(list.length - 4,list.length)
            let result5 = true;
            let result6 = true;
            let result7 = true;
            let result8 = true;


            let odds2 = finalFourUpdates.filter((a, i) => i%2)
            let evens2 = finalFourUpdates.filter((a, i) => i%2 == 0)

            for (let i = 0; i < odds2.length; i++) {
                if (odds2[i].color != 1) {
                    result5 = false;
                    break;
                }
            }

            for (let i = 0; i < evens2.length; i++) {
                if (evens2[i].color != 2) {
                    result6 = false;
                    break;
                }
            }

            for (let i = 0; i < odds2.length; i++) {
                if (odds2[i].color != 2) {
                    result7 = false;
                    break;
                }
            }

            for (let i = 0; i < evens2.length; i++) {
                if (evens2[i].color != 1) {
                    result8 = false;
                    break;
                }
            }

            if((result5 == true && result6 == true) || (result7 == true && result8 == true)) {
                await this.sendPossibleGame()
                return
            }
        }

        if(message != undefined){
            this.bot.sendMessage({ message})
            console.log({ message })
        }

        return
    }

    async game(newUpdate: DoubleUpdateV2){
        let message: string;

        let counter = new CountsUseCase()

        let counterToday = await counter.getCounts()

        if(counterToday == null){
            let d = new Date()

            let date = Intl.DateTimeFormat("pt-br").format(d)
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
            await this.bot.sendMessage({ message})
            console.log({ message })
        }
       
        return
    }

    async stopBot(){
        await this.bot.sendMessage({ message: 'O Mago precisa descansar! 🧙‍♂️\n\nEle retornará amanhã com mais GREENS✅ pra vocês!'})
        const d = new Date()
    
            const date = Intl.DateTimeFormat("pt-br").format(d)
            console.log(date)
            const countUseCase = new CountsUseCase()
            const data = await countUseCase.getCounts(date)

            if (data === null) {
                console.log("Sem registro")
                await this.bot.sendMessage({ message: `📊 Resultados até agora! 📈\n\n⛔<b>Sem registro</b>\n\n✅Acertos: <b>0</b>\n❌Não Bateu: <b>0</b>\n\n <b>0% de aproveitamento!</b>`})
                return
            }

            const { red, totalWin, percentageWin } = await this.calculateCounts(data)

            const message = `📊 Resultados até agora! 📈\n\n✅Acertos: <b>${totalWin}</b>\n❌Não Bateu: <b>${red}</b>\n\n<b>${Math.round(100 - percentageWin)}% de aproveitamento!</b>`
            await this.bot.sendMessage({ message})
            console.log('🤖 Bot Off! 🔴')
            process.exit()            
        
    }

    async calculateCounts(data: IDataCount) {
        let green = null
        let red = null

        
        green = green + data.countGreen
        red = red + data.countRed
        
        let totalWin = green
        let totalSent = totalWin + red
        let percentageWin = Math.round((red * 100) / totalSent)

        return {
            green,
            red,
            totalWin,
            totalSent,
            percentageWin
        }
    }
}

interface IDataCount {
    id: string
    countWhite: number
    countGreen: number
    countRed: number
    countGale1: number
    countGale2: number
    totalWin?: number
    totalSent?: number
    percentageWin?: number
}

export { MetricDouble, inGame }
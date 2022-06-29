import { Telegraf } from "telegraf"
import { ConfigsController } from "../useCases/configs/ConfigsController"
import { ConfigsUseCase } from "../useCases/configs/ConfigsUseCase"
import { CountsUseCase } from "../useCases/counts/CountsUseCase"

interface IMessage {
    countGreen?: number
    countRed?: number
    color?: string
    message: string
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

class Bot {
    start: string
    bots: Telegraf

    constructor() {
        this.start = "🤖 Bot On! 🟢"
        this.bots = new Telegraf(process.env.TOKEN_TELEGRAM)
    }

    public async inital() {

        try {
            console.log(this.start)
            this.bots.launch();

            process.once("SIGINT", () => this.bots.stop("SIGINT"));
            process.once("SIGTERM", () => this.bots.stop("SIGTERM"));
        } catch (error) {
            console.log("Error in connection of API!")
        }
    }

    async sendMessage({ countGreen, countRed, color, message }: IMessage) {
        try {
            const messageId = await this.bots.telegram.sendMessage(process.env.CHANNEL_NAME, message, { parse_mode: 'HTML' })

            return messageId.message_id
        } catch (error) {
            console.log("Error send message!")
            console.log(error)
        }

    }

    async deleteMessageWithID(messageID: any) {
        try {
            await this.bots.telegram.deleteMessage(process.env.CHANNEL_NAME, messageID)
        } catch (error) {
            console.log("Error in delete message!")
        }
    }

    async commandBot() {
        this.bots.start(async (ctx) => {
            await ctx.reply(`🤖 Bem vindo ao ${ctx.botInfo.first_name} 📣\n\n/padrao Ver as configurações do Bot.\n\n/config Cadastrar e alterar as configs do Bot.\n\n/resultado Envia relatório no canal.\n<i>Você pode passar uma data\nExemplo: '24/01/2022', se não vai\nser enviado com a data do dia.</i>\n\n/help Ajuda.`, { parse_mode: 'HTML' })
        })

        this.bots.help(async (ctx) => {
            await ctx.reply(`🤖 Bot Comandos 📣\n\n/padrao Ver as configurações do Bot.\n\n/config Cadastrar e alterar as configs do Bot.\n\n/resultado Envia relatório no canal.\n<i>Você pode passar uma data\nExemplo: '24/01/2022', se não vai\nser enviado com a data do dia.</i>`, { parse_mode: 'HTML' })
        })

        this.bots.command("padrao", async (ctx) => {
            const configUseCase = new ConfigsUseCase()
            const configs = await configUseCase.show()

            if (configs !== null) {
                const { activo, standard } = await configUseCase.show()
                await ctx.reply(`🤖 Bot Configs ⚙️\n\n<b>Bot:</b> ${activo ? "Ativado" : "Desativado"}\n<b>Padrão:</b> ${Number(standard)}`, { parse_mode: 'HTML' })
                return
            }
            await ctx.reply(`Você precisa configurar seu bot\n\n/config`, { parse_mode: 'HTML' })
        })

        this.bots.command("resultado", async (ctx) => {
            
            const d = new Date()
    
            const date = Intl.DateTimeFormat("pt-br").format(d)
            console.log(date)
            const countUseCase = new CountsUseCase()
            const data = await countUseCase.getCounts(date)

            if (data === null) {
                console.log("Sem registro")
                await ctx.reply(`📊 Resultados até agora! 📈\n\n⛔<b>Sem registro</b>\n\n✅Acertos: <b>0</b>\n❌Não Bateu: <b>0</b>\n\n <b>0% de aproveitamento!</b>`, { parse_mode: 'HTML' })
                return
            }

            const { red, totalWin, percentageWin } = await this.calculateCounts(data)

            const message = `📊 Resultados até agora! 📈\n\n✅Acertos: <b>${totalWin}</b>\n❌Não Bateu: <b>${red}</b>\n\n<b>${Math.round(100 - percentageWin)}% de aproveitamento!</b>`
            await this.sendMessage({ message })
            await ctx.replyWithHTML(`📨 <b>Relatório enviado!</b>`)
            return
        })

        this.bots.command("config", async (ctx) => {
            const configUseCase = new ConfigsUseCase()
            const configs = await configUseCase.show()

            const configsController = new ConfigsController()

            const respone = ctx.message.text.split(" ")
            const [_, botName, password, newDefault, activo] = ctx.message.text.split(" ")
            const newActivo = activo === "ativado" ? true : false

            if (respone.length !== 5) {
                await ctx.reply("⚠️ <b>Parametros Errados!</b>\n\nEnviar da seguinte maneira:\n\n<b>Comando:</b> /config\n<b>Bot:</b> nome do seu bot\n<b>Senha:</b> senha de acesso\n<b>Padrão:</b> número do seu padrão, ex. 3\n<b>Ativo:</b> ativado ou desativado\n\n<b>Exemplo:</b> /config blaze-bot abc123 4 ativado", { parse_mode: 'HTML' })
                return
            }

            switch (activo) {
                case "ativado":
                case "desativado":
                    if (configs === null) {
                        await configsController.create({ name: botName, standard: Number(newDefault), activo: newActivo, password: password.toString() })
                        await ctx.reply(`⚠️ Atenção ⚠️\n\nCadastro realizado!`, { parse_mode: 'HTML' })
                        return
                    }

                    if (configs.password === password && configs.name === botName) {
                        await configsController.create({ name: botName, standard: Number(newDefault), activo: newActivo, password: password.toString() })
                        await ctx.reply(`⚠️ Atenção ⚠️\n\nParâmetros Alterados\n\n<b>Bot:</b> ${newActivo ? "Ativado" : "Desativado"}\n<b>Padrão:</b> ${Number(newDefault)}`, { parse_mode: 'HTML' })
                        return
                    }
                    await ctx.reply(`⚠️ Atenção ⚠️\n\nNome do Bot ou Senha errada!`, { parse_mode: 'HTML' })
                    break;
                default:
                    await ctx.reply("⚠️ Atenção ⚠️\n\nInforme se o BOT está \n<b>ativado</b> ou <b>desativado</b>", { parse_mode: 'HTML' })
                    break;
            }
        })
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

export { Bot }
class MountMessageHelper {
    entryRed: string
    entryblack: string
    green: string
    red: string
    confirmedEntry: string
    info: string
    cover: string
    alert: string
    balance: string
    abortEntry: string
    greenWithWhite: string
    gale1: string
    gale2: string

    constructor() {
        this.confirmedEntry = "<b>⚠️Entrada Confirmada⚠️</b>"
        this.abortEntry = "<b>⚠️ABORTAR ENTRADA⚠️</b> \n\n ❌❌❌❌❌❌❌❌❌"
        this.entryRed = "💰 Entrada: 🔴\n\n⚠️ Proteção: ⚪\n\n🎰 Double Blaze\n\n==ATÉ GALE 2=="
        this.entryblack = "💰 Entrada: ⚫\n\n⚠️ Proteção: ⚪\n\n🎰 Double Blaze\n\n==ATÉ GALE 2=="
        this.green = "✅ <b>GREEN</b> ✅🤑💰"
        this.red = "❌ <b>LOSS</b> ❌"
        this.info = "2️⃣ Máximo <b>02 Martingale</b>"
        this.cover = "⚪"
        this.alert = "<b>⚠️ATENÇÃO⚠️</b>"
        this.balance = "📊 Balanço 📊"
        this.greenWithWhite = "<b>GREEN</b>✅✅ 🤑💰\n\n<i>No Branco</i>⚪"
        this.gale1 ="=== GALE 1 ==="
        this.gale2 = "=== GALE 2 ==="
    }

    async ConfirmedEntry() {
        return this.confirmedEntry
    }

    async AbortEntry() {
        return this.abortEntry
    }

    async EntryRed() {
        return this.entryRed
    }

    async Entryblack() {
        return this.entryblack
    }

    async Green() {
        return this.green
    }
    async Gale1() {
        return this.gale1
    }
    async Gale2() {
        return this.gale2
    }

    async GreenWithWhite() {
        return this.greenWithWhite
    }

    async Red() {
        return this.red
    }

    async Info() {
        return this.info
    }

    async Cover() {
        return this.cover
    }

    async Alert() {
        return this.alert
    }

    async Balance() {
        return this.balance
    }
}

export { MountMessageHelper }
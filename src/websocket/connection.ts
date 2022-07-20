import { makeConnectionBlaze} from "../Socket"
import { DoubleUpdateV2} from "../Types/IDoubleUpdate"
import {inGame, MetricDouble} from '../helpers/BotMetrics/MetricDouble'
import io from 'socket.io-client'


const socketIO = io(process.env.SOCKET_URL || 'http://localhost:4000')


let lastUpdatesList: DoubleUpdateV2[] = []

const metricDouble = new MetricDouble()

socketIO.on('double', async (msg)  => {
    delete msg.bets
    if(lastUpdatesList.length == 6) lastUpdatesList.shift()
    lastUpdatesList.push(msg as DoubleUpdateV2)
    await metricDouble.resetMessageId()
    if(inGame){
        await metricDouble.game(msg as DoubleUpdateV2)
    }

    if(inGame == false && lastUpdatesList.length >= 5){
        await metricDouble.verifySequenceTree(lastUpdatesList)
        // await metricDouble.verifyWhiteAndSequenceColors(lastUpdatesList)
        //await  metricDouble.verifyChess(lastUpdatesList)
    }
})




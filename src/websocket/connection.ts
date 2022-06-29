import { makeConnectionBlaze} from "../Socket"
import { DoubleUpdateV2} from "../Types/IDoubleUpdate"
import {inGame, MetricDouble} from '../helpers/BotMetrics/MetricDouble'


const socket = makeConnectionBlaze({needCloseWithCompletedSession: false,requireNotRepeated: true, type: 'doubles'})

let lastUpdatesList: DoubleUpdateV2[] = []

const metricDouble = new MetricDouble()


socket.ev.on('game_graphing', (msg) => {
    delete msg.bets
    if(lastUpdatesList.length == 6) lastUpdatesList.shift()
    lastUpdatesList.push(msg as DoubleUpdateV2)
    if(inGame){
        metricDouble.game(msg as DoubleUpdateV2)
    }

    if(inGame == false && lastUpdatesList.length > 4){
        metricDouble.verifySequenceFour(lastUpdatesList)
         metricDouble.verifyWhiteAndSequenceColors(lastUpdatesList)
         metricDouble.verifyChess(lastUpdatesList)
    }
})



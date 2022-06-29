"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeConnectionBlaze = void 0;
const ws_1 = __importDefault(require("ws"));
const events_1 = __importDefault(require("events"));
const __1 = require("..");
const onOpen_1 = require("./onOpen");
const onMessage_1 = require("./onMessage");
function makeConnectionBlaze({ needCloseWithCompletedSession = false, requireNotRepeated = true, timeoutSendingAliveSocket = 5000, token = undefined, type = 'crash' }) {
    const ev = new events_1.default();
    const wss = new ws_1.default(__1.API_BLAZE, {
        host: 'api-v2.blaze.com',
        origin: 'https://blaze.com',
        headers: {
            'Upgrade': 'websocket',
            'Sec-Webscoket-Extensions': 'permessage-defalte; client_max_window_bits',
            'Pragma': 'no-cache',
            'Connection': 'Upgrade',
            'Accept-Encoding': 'gzip, deflate, br',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'
        }
    });
    let interval = setInterval(() => {
        wss.send('2');
    }, timeoutSendingAliveSocket);
    wss.on('open', () => {
        (0, onOpen_1.onOpen)(wss, ev, token, type);
    });
    wss.on('message', (data) => {
        (0, onMessage_1.onMessage)(data, wss, ev, requireNotRepeated, needCloseWithCompletedSession, interval);
    });
    wss.on('close', (code, reason) => {
        ev.emit('close', {
            code,
            reason: reason.toString()
        });
        clearInterval(interval);
        wss.close();
    });
    return {
        ev: ev,
        closeSocket: () => {
            clearInterval(interval);
            wss.close();
        },
        sendToSocket: (data) => {
            wss.send(data, (error) => {
                if (error)
                    throw error;
            });
        }
    };
}
exports.makeConnectionBlaze = makeConnectionBlaze;

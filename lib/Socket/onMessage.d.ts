/// <reference types="node" />
/// <reference types="node" />
import WebSocket from "ws";
import EventEmitter from 'events';
export declare function onMessage(data: any, wss: WebSocket, ev: EventEmitter, requireNotRepeated: boolean, needCloseWithCompletedSession: boolean, interval: NodeJS.Timer): void;

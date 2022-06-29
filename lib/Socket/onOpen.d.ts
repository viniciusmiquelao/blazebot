/// <reference types="node" />
import WebSocket from "ws";
import EventEmitter from 'events';
export declare function onOpen(wss: WebSocket, ev: EventEmitter, token: string | undefined, type: 'crash' | 'doubles'): void;

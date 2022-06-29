import { IBlazeConnection, IMakeConnectionOptions } from '..';
export declare function makeConnectionBlaze({ needCloseWithCompletedSession, requireNotRepeated, timeoutSendingAliveSocket, token, type }: IMakeConnectionOptions): IBlazeConnection;

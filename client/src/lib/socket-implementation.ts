/* eslint-disable @typescript-eslint/no-namespace */
  import type { Socket as SocketBase } from "socket.io-client";

export namespace Root {
    /** @desc The actual path of the Root namespace */
    export const path = "/";
    export interface Emission {
        onChat: (p1: string, p2: {
            from: string;
        }) => void;
        time: (currentIsoTime: string) => void;
        rooms: (roomIds: string[]) => void;
    }
    export interface Actions {
        ping: ((cb1: (p1: "pong", ...rest: unknown[]) => void) => void) | ((rest1: unknown, cb2: (p1: "pong", ...rest: unknown[]) => void) => void) | ((rest1: unknown, rest2: unknown, cb3: (p1: "pong", ...rest: unknown[]) => void) => void);
        subscribe: (...doesNotMatter: unknown[]) => void;
        unsubscribe: (...doesNotMatter: unknown[]) => void;
        chat: (message: string) => void;
    }
    /** @example const socket: Root.Socket = io(Root.path) */
    export type Socket = SocketBase<Emission, Actions>;
}
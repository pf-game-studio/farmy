import io, { Socket } from 'socket.io-client';
import { GLOBALS } from './data/globals';

interface iRackArgs {
    token: string;
}

export default class ServerManager {
    //@ts-ignore no-unused-variable
    private socket: Socket;
    //@ts-ignore no-unused-variable
    private token: string;

    constructor() {
        this.token = '';

        this.socket = io(GLOBALS.server_addr);

        this.socket.on('rack', (args: iRackArgs) => {
            this.token = args.token;
            if (this.token != undefined && this.token != '') {
                console.log(`Received rack! Current token is ${this.token}`);
            } else {
                this.do_auth();
            }
        });

        this.do_auth();
    }

    do_auth() {
        const username = window.prompt('Digite seu usuário');
        const password = window.prompt('Digite sua senha');

        if (!username || !password) {
            this.do_auth();
        } else {
            this.socket.emit('register', { username, password });
        }
    }
}

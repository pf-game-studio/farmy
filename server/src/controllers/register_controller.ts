import { Socket } from 'socket.io';
import user from '../database/users';
import jwt from 'jsonwebtoken';

export interface iRegisterArgs {
    username: string;
    password: string;
}

export default {
    on_register(socket: Socket) {
        return (args: iRegisterArgs) => {
            console.log(
                `register attempt received from username ${args.username}`
            );

            const found = user.find(args.username);
            let token = '';
            if (found && found.password == args.password) {
                token = jwt.sign(found, 'minha-chave-secretíssima');
                console.log('register success');
            } else {
                console.log('register failed');
            }

            socket.emit('rack', { token });
        };
    }
};

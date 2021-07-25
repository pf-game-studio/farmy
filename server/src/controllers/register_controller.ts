import { Socket } from 'socket.io';
import user from '../database/users';
import jwt from 'jsonwebtoken';
import invite_controller from './invite_controller';

interface iRegisterArgs {
    username: string;
    password: string;
}

/**
 * Função de validação de um token de autorização.
 *
 * @param token token de autorização JWT
 * @returns verdadeiro se é válido
 */
export function validate_token(token: string): boolean {
    try {
        jwt.verify(token, 'minha-chave-secretíssima');
        return true;
    } catch (err) {
        return false;
    }
}

export default {
    /**
     * Functor de geração da callback de registro do cliente.
     *
     * @param socket socket do cliente
     * @returns Callback para ser enviado ao socket
     */
    on_register(socket: Socket) {
        return (args: iRegisterArgs) => {
            console.log(
                `register attempt received from username ${args.username}`
            );

            const found = user.find(args.username);
            let token = '';
            if (found && found.password == args.password) {
                token = jwt.sign({ data: found }, 'minha-chave-secretíssima', {
                    expiresIn: '7d'
                });
                console.log('register success');
            } else {
                console.log('register failed');
                socket.emit('nack', { reason: 'invalid_auth' });
                return;
            }

            socket.on('invite', invite_controller.on_invite(socket));

            socket.emit('rack', { token });
        };
    }
};

import { io } from '../io';
import { Socket } from 'socket.io';
import { validate_token } from './register_controller';

/**
 * Argumentos de mensagem com apenas o token de autorização
 */
interface iTokenArgs {
    token: string;
}

/**
 * Argumentos de mensagem de offer e answer
 */
interface iOfferAnswerArgs extends iTokenArgs {
    destination: string;
    description: string;
}

/**
 * Argumentos de mensagem de candidate
 */

interface iCandidateArgs extends iTokenArgs {
    destination: string;
    candidate: string;
}

const registered_clients: { first?: string; second?: string } = {};

export default {
    /**
     * Functor para o callback do invite. Trata a negociação de mídia.
     *
     * @param socket socket do cliente
     * @returns a callback de invite a ser passada para o socket
     */
    on_invite(socket: Socket) {
        return (args: iTokenArgs) => {
            console.log(`Invite received, socket id=${socket.id}`);
            if (!validate_token(args.token)) {
                socket.emit('nack', { reason: 'invalid-token' });
            }

            if (!registered_clients.first) {
                registered_clients.first = socket.id;
            } else if (!registered_clients.second) {
                registered_clients.second = socket.id;
            } else {
                socket.emit('nack', { reason: 'full-room' });
            }

            io.emit('other_users', registered_clients);

            socket.on('offer', (args: iOfferAnswerArgs) => {
                if (!validate_token(args.token)) {
                    socket.emit('nack', { reason: 'invalid-token' });
                }
                socket.to(args.destination).emit('offer', {
                    origin: socket.id,
                    description: args.description
                });
            });

            socket.on('answer', (args: iOfferAnswerArgs) => {
                if (!validate_token(args.token)) {
                    socket.emit('nack', { reason: 'invalid-token' });
                }
                socket.to(args.destination).emit('answer', {
                    origin: socket.id,
                    description: args.description
                });
            });

            socket.on('candidate', (args: iCandidateArgs) => {
                if (!validate_token(args.token)) {
                    socket.emit('nack', { reason: 'invalid-token' });
                }
                socket.to(args.destination).emit('candidate', {
                    origin: socket.id,
                    candidate: args.candidate
                });
            });

            socket.on('bye', (args: iTokenArgs) => {
                if (!validate_token(args.token)) {
                    socket.emit('nack', { reason: 'invalid-token' });
                }
                if (registered_clients.first === socket.id) {
                    registered_clients.first = undefined;
                } else if (registered_clients.second === socket.id) {
                    registered_clients.second = undefined;
                }
                io.emit('other_users', registered_clients);
            });
        };
    }
};

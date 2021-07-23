import { Socket } from 'socket.io';

interface iInviteArgs {
    token: string;
}

interface iOfferAnswerArgs {
    destination: string;
    description: string;
}

interface iCandidateArgs {
    destination: string;
    candidate: string;
}

const registered_clients: { first?: string; second?: string } = {};

export default {
    on_invite(socket: Socket) {
        return (args: iInviteArgs) => {
            if (!registered_clients.first) {
            } else if (!registered_clients.second) {
            } else {
            }

            socket.emit('other_users', registered_clients);

            socket.on('offer', (args: iOfferAnswerArgs) => {
                socket.to(args.destination).emit('offer', {
                    origin: this_client.socket_id,
                    description: args.description
                });
            });

            socket.on('answer', (args: iOfferAnswerArgs) => {
                socket.to(args.destination).emit('answer', {
                    origin: this_client.socket_id,
                    description: args.description
                });
            });

            socket.on('candidate', (args: iCandidateArgs) => {
                socket.to(args.destination).emit('candidate', {
                    origin: this_client.socket_id,
                    candidate: args.candidate
                });
            });

            socket.on('bye', () => remove_client(this_client.token));
        };
    }
};

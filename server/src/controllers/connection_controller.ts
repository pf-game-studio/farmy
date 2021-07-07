import { Socket } from 'socket.io';
import register_controller from './register_controller';

function register_events(socket: Socket) {
    socket.on('register', register_controller.on_register(socket));
}

export default {
    on_connection(socket: Socket) {
        console.log(`new user on socket id ${socket.id}`);

        register_events(socket);
    }
};

import { Socket } from 'socket.io';
import register_controller from './register_controller';

export default {
    on_connection(socket: Socket) {
        console.log(`new user on socket id ${socket.id}`);

        socket.on('register', register_controller.on_register(socket));
    }
};

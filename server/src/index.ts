import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connection_controller from './controllers/connection_controller';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:5000',
        methods: ['GET', 'POST']
    }
});

io.on('connection', connection_controller.on_connection);

httpServer.listen(1234, () => {
    console.log('listening on *:1234');
});

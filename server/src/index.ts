import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const server = express();
const httpServer = createServer(server);
const io = new Server(httpServer, {});

io.on('connection', socket => {
    console.log(socket.id);
});

httpServer.listen(1234);

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
export const httpServer = createServer(app);
export const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:5000',
        methods: ['GET', 'POST']
    }
});

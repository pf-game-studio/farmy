import { io, httpServer } from './io';
import connection_controller from './controllers/connection_controller';

io.on('connection', connection_controller.on_connection);

httpServer.listen(1234, () => {
    console.log('listening on *:1234');
});

import { WebSocketServer } from 'ws';
import { gameCommandHandler } from '../dispatcher/gameCommandHandler.js';
import { decodeCommand } from '../utils/commandHandler.js';
import { state } from '../state/state.js';
const WSSERVER_PORT = 3000;
const wsServer = new WebSocketServer({ port: WSSERVER_PORT });
console.log(`Start WebSocket server on port ${WSSERVER_PORT}`);
wsServer.on('connection', (ws) => {
    console.log('Client connected');
    state.serverClients.push(ws);
    ws.on('message', (command) => {
        try {
            const decodedCommand = decodeCommand(command.toString());
            console.log(`Game Command: ${JSON.stringify(decodedCommand)}`);
            gameCommandHandler(decodedCommand, ws);
        }
        catch (error) {
            console.error('Failed to decode command:', error);
            ws.send(JSON.stringify({ type: 'error', message: 'Invalid command format' }));
        }
    });
    ws.on('close', () => {
        console.log('Client disconnected');
        removeClient(ws);
    });
});
function removeClient(ws) {
    const index = state.serverClients.indexOf(ws);
    if (index > -1) {
        state.serverClients.splice(index, 1);
    }
}

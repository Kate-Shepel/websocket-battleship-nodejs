import { WebSocketServer, WebSocket } from 'ws';

import { gameCommandHandler } from '../dispatcher/gameCommandHandler.js';
import { decodeCommand } from '../utils/commandHandler.js';

const WSSERVER_PORT = 3000;
const wsServer = new WebSocketServer({ port: WSSERVER_PORT });
const serverClients: WebSocket[] = [];

console.log(`Start WebSocket server on port ${WSSERVER_PORT}`);

wsServer.on('connection', (ws: WebSocket) => {
  console.log('Client connected');
  serverClients.push(ws);

  ws.on('message', (command) => {
    try {
      const decodedCommand = decodeCommand(command.toString());

      console.log(`Game Command: ${JSON.stringify(decodedCommand)}`);
      gameCommandHandler(decodedCommand);
    } catch (error) {
      console.error('Failed to decode command:', error);
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid command format' }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    removeClient(ws);
  });
});

// function sendMessageToOthers(msg: string, sender: WebSocket) {
//   serverClients.forEach((player) => {
//     if (player !== sender && player.readyState === WebSocket.OPEN) {
//       player.send(`Message from other player: ${msg}`);
//     }
//   });
// }

function removeClient(ws: WebSocket) {
  const index = serverClients.indexOf(ws);

  if (index > -1) {
    serverClients.splice(index, 1);
  }
}

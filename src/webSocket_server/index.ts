import { WebSocketServer, WebSocket } from 'ws';

const wsServer = new WebSocketServer({ port: 4000 });
const serverClients: WebSocket[] = [];

console.log('Start WebSocket server on port 4000!');

wsServer.on('connection', (ws: WebSocket) => {
  console.log('Client connected');
  serverClients.push(ws);

  ws.on('message', (message: string) => {
    console.log(`Received message: ${message}`);

    sendMessageToOthers(message, ws);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    removeClient(ws);
  });
});

function sendMessageToOthers(msg: string, sender: WebSocket) {
  serverClients.forEach((player) => {
    if (player !== sender && player.readyState === WebSocket.OPEN) {
      player.send(`Message from other player: ${msg}`);
    }
  });
}

function removeClient(ws: WebSocket) {
  const index = serverClients.indexOf(ws);

  if (index > -1) {
    serverClients.splice(index, 1);
  }
}

import { WebSocketServer, WebSocket } from 'ws';
const wsServer = new WebSocketServer({ port: 4000 });
const serverClients = [];
console.log('Start WebSocket server on port 4000!');
wsServer.on('connection', (ws) => {
    console.log('Client connected');
    serverClients.push(ws);
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        sendMessageToOthers(message, ws);
    });
    ws.on('close', () => {
        console.log('Client disconnected');
        removeClient(ws);
    });
});
function sendMessageToOthers(msg, sender) {
    serverClients.forEach((player) => {
        if (player !== sender && player.readyState === WebSocket.OPEN) {
            player.send(`Message from other player: ${msg}`);
        }
    });
}
function removeClient(ws) {
    const index = serverClients.indexOf(ws);
    if (index > -1) {
        serverClients.splice(index, 1);
    }
}

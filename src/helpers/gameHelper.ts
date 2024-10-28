import { WebSocket } from 'ws';
import { state } from '../state/state.js';
import { getUserName } from './registrationHelper.js';
import { IShipData, IGameSession } from '../types/types.js';

export function handleAddShips(ws: WebSocket, shipData: IShipData) {
  const userName = getUserName(ws);
  const room = state.gameRooms.find((room) => room.players.includes(ws));

  if (!room) {
    ws.send(
      JSON.stringify({
        type: 'error',
        data: JSON.stringify({ error: true, errorText: 'Room not found' }),
        id: 0,
      }),
    );
    return;
  }

  if (!userName) {
    ws.send(
      JSON.stringify({
        type: 'error',
        data: JSON.stringify({ error: true, errorText: 'User not authenticated' }),
        id: 0,
      }),
    );
    return;
  }

  const player = state.gameUsers.find((user) => user.name === userName);
  if (!player) return;

  const game: IGameSession = state.gameSessions[room.roomId] || { players: {} };
  game.players[userName] = { ships: shipData.ships, ready: true };
  state.gameSessions[room.roomId] = game;

  if (Object.keys(game.players).length === 2 && Object.values(game.players).every((p) => p.ready)) {
    room.players.forEach((playerWs) => {
      const playerUserName = getUserName(playerWs);
      if (playerUserName && game.players[playerUserName]) {
        playerWs.send(
          JSON.stringify({
            type: 'start_game',
            data: JSON.stringify({
              ships: game.players[playerUserName].ships,
              currentPlayerIndex: 0,
            }),
            id: 0,
          }),
        );
      }
    });
    console.log(`Game started in room ${room.roomId}`);
  }
}

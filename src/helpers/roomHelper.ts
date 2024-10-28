import { WebSocket } from 'ws';
import { getUserName } from './registrationHelper.js';
import { state } from '../state/state.js';

export function handleCreateRoom(ws: WebSocket, userName: string) {
  const user = state.gameUsers.find((user) => user.name === userName);
  if (user) {
    const newRoomId = state.gameRooms.length + 1;
    state.gameRooms.push({ roomId: newRoomId, players: [ws] });

    const userIndex = state.gameUsers.indexOf(user);

    ws.send(
      JSON.stringify({
        type: 'create_room',
        data: JSON.stringify({ idGame: newRoomId, idPlayer: userIndex }),
        id: 0,
      }),
    );
    console.log(`Room ${newRoomId} created by ${userName}`);

    broadcastRoomStateUpdate();
  } else {
    ws.send(
      JSON.stringify({
        type: 'error',
        data: JSON.stringify({ error: true, errorText: 'User not authenticated' }),
        id: 0,
      }),
    );
  }
}

export function handleAddUserToRoom(ws: WebSocket, indexRoom: number) {
  const room = state.gameRooms.find((room) => room.roomId === indexRoom);
  const userName = getUserName(ws);

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

  if (room.players.length >= 2) {
    ws.send(
      JSON.stringify({
        type: 'error',
        data: JSON.stringify({ error: true, errorText: 'Room is full' }),
        id: 0,
      }),
    );
    return;
  }

  room.players.push(ws);
  console.log(`User ${userName} added to room ${indexRoom}`);

  room.players.forEach((playerWs) => {
    const user = state.gameUsers.find((user) => getUserName(playerWs) === user.name);
    const userIndex = state.gameUsers.indexOf(user!);

    playerWs.send(
      JSON.stringify({
        type: 'create_game',
        data: JSON.stringify({ idGame: indexRoom, idPlayer: userIndex }),
        id: 0,
      }),
    );
  });

  broadcastRoomStateUpdate();
}

function broadcastRoomStateUpdate() {
  const roomState = {
    type: 'update_room',
    data: JSON.stringify(
      state.gameRooms.map((room) => ({
        roomId: room.roomId,
        roomUsers: room.players.map((ws) => {
          const userName = getUserName(ws);
          const userIndex = state.gameUsers.findIndex((user) => user.name === userName);
          return { name: userName, index: userIndex };
        }),
      })),
    ),
    id: 0,
  };

  state.serverClients.forEach((client) => client.send(JSON.stringify(roomState)));
}

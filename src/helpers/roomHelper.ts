import { WebSocket } from 'ws';

import { getUserName } from './registrationHelper.js';

export function handleCreateRoom(
  gameRooms: Array<{ roomId: number; players: WebSocket[] }>,
  gameUsers: Array<{ name: string; password: string }>,
  ws: WebSocket,
  userName: string,
) {
  const user = gameUsers.find((user) => user.name === userName);
  if (user) {
    const newRoomId = gameRooms.length + 1;
    gameRooms.push({ roomId: newRoomId, players: [ws] });

    const userIndex = gameUsers.indexOf(user);

    ws.send(
      JSON.stringify({
        type: 'create_room',
        data: JSON.stringify({ idGame: newRoomId, idPlayer: userIndex }),
        id: 0,
      }),
    );
    console.log(`Room ${newRoomId} created by ${userName}`);
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

export function handleAddUserToRoom(
  gameRooms: Array<{ roomId: number; players: WebSocket[] }>,
  gameUsers: Array<{ name: string; password: string }>,
  ws: WebSocket,
  indexRoom: number,
) {
  const room = gameRooms.find((room) => room.roomId === indexRoom);
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

  room.players.forEach((playerWs, index) => {
    const user = gameUsers.find((user) => getUserName(playerWs) === user.name);
    const userIndex = gameUsers.indexOf(user!);

    playerWs.send(
      JSON.stringify({
        type: 'create_game',
        data: JSON.stringify({ idGame: indexRoom, idPlayer: userIndex }),
        id: 0,
      }),
    );
  });
}

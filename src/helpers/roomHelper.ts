import { WebSocket } from 'ws';

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

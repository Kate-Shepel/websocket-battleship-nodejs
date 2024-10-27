import { WebSocket } from 'ws';

import { IActionCommand, IRegisterUser } from '../types/types.js';

const userConnections: Map<WebSocket, string> = new Map();

export const gameCommandHandler = <T>(
  data: IActionCommand<T>,
  gameUsers: Array<{ name: string; password: string }>,
  gameRooms: Array<{ roomId: number; players: WebSocket[] }>,
  ws: WebSocket,
) => {
  const commandAction = data.type;

  switch (commandAction) {
    case 'reg': {
      const parsedData = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
      const { name, password } = parsedData as IRegisterUser;
      const existingUser = gameUsers.find((user) => user.name === name);

      if (existingUser) {
        if (existingUser.password === password) {
          console.log(`User ${name} authenticated successfully.`);
          const response = {
            type: 'reg',
            data: JSON.stringify({
              name,
              index: gameUsers.indexOf(existingUser),
              error: false,
              errorText: '',
            }),
            id: 0,
          };
          ws.send(JSON.stringify(response));
          userConnections.set(ws, name);
        } else {
          const errorResponse = {
            type: 'reg',
            data: JSON.stringify({
              name,
              error: true,
              errorText: 'Incorrect password',
            }),
            id: 0,
          };
          console.log(`Failed authentication for ${name}: incorrect password.`);
          ws.send(JSON.stringify(errorResponse));
        }
      } else {
        gameUsers.push({ name, password });
        console.log(gameUsers);
        const registrationResponse = {
          type: 'reg',
          data: JSON.stringify({
            name,
            index: gameUsers.length - 1,
            error: false,
            errorText: '',
          }),
          id: 0,
        };
        console.log(`User ${name} registered successfully.`);
        ws.send(JSON.stringify(registrationResponse));
        userConnections.set(ws, name);
      }
      break;
    }

    case 'create_room': {
      const userName = userConnections.get(ws);

      if (userName) {
        const user = gameUsers.find((user) => user.name === userName);
        const newRoomId = gameRooms.length + 1;
        gameRooms.push({ roomId: newRoomId, players: [ws] });
        const userIndex = gameUsers.indexOf(user!);

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
      break;
    }

    case 'add_user_to_room':
      console.log('Add user to existing room');
      break;

    case 'attack':
      console.log('Player attacks');
      break;

    default:
      console.log('Unknown command');
  }
};

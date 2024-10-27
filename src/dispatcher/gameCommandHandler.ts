import { WebSocket } from 'ws';

import { IActionCommand, IRegisterUser } from '../types/types.js';
import { handleRegistration, getUserName } from '../helpers/registrationHelper.js';
import { handleAddUserToRoom, handleCreateRoom } from '../helpers/roomHelper.js';

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
      handleRegistration(parsedData as IRegisterUser, gameUsers, ws);
      break;
    }

    case 'create_room': {
      const userName = getUserName(ws);
      if (userName) {
        handleCreateRoom(gameRooms, gameUsers, ws, userName);
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

    case 'add_user_to_room': {
      const parsedData = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
      const { indexRoom } = parsedData;
      handleAddUserToRoom(gameRooms, gameUsers, ws, indexRoom);
      break;
    }

    case 'attack':
      console.log('Player attacks');
      break;

    default:
      console.log('Unknown command');
  }
};

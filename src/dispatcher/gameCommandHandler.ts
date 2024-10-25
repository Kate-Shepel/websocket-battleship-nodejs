import { WebSocket } from 'ws';

import { IActionCommand, IRegisterUser } from '../types/types.js';

export const gameCommandHandler = <T>(
  data: IActionCommand<T>,
  gameUsers: Array<{ name: string; password: string }>,
  ws: WebSocket,
) => {
  console.log('Data in gameCommandHandler', data);
  const commandAction = data.type;

  switch (commandAction) {
    case 'reg': {
      const { name, password } = data.data as IRegisterUser;
      const existingUser = gameUsers.find((user) => user.name === name);

      if (existingUser) {
        ws.send(
          JSON.stringify({
            type: 'reg',
            data: { name, error: true, errorText: 'User already exists' },
            id: 0,
          }),
        );
      } else {
        gameUsers.push({ name, password });
        ws.send(
          JSON.stringify({
            type: 'reg',
            data: { name, index: gameUsers.length - 1, error: false, errorText: '' },
            id: 0,
          }),
        );
      }
      break;
    }

    case 'create_room':
      console.log('Create new room');
      break;

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

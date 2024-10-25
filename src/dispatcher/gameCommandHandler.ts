import { IActionCommand } from '../types/types.js';

export const gameCommandHandler = <T>(data: IActionCommand<T>) => {
  console.log('Data in gameCommandHandler', data);
  const commandAction = data.type;

  switch (commandAction) {
    case 'reg':
      console.log('Register player');
      break;

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

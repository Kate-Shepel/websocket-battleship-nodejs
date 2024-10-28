import { handleRegistration, getUserName } from '../helpers/registrationHelper.js';
import { handleAddUserToRoom, handleCreateRoom } from '../helpers/roomHelper.js';
import { handleAddShips } from '../helpers/gameHelper.js';
export const gameCommandHandler = (data, ws) => {
    const commandAction = data.type;
    switch (commandAction) {
        case 'reg': {
            const parsedData = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
            handleRegistration(parsedData, ws);
            break;
        }
        case 'create_room': {
            const userName = getUserName(ws);
            if (userName) {
                handleCreateRoom(ws, userName);
            }
            else {
                ws.send(JSON.stringify({
                    type: 'error',
                    data: JSON.stringify({ error: true, errorText: 'User not authenticated' }),
                    id: 0,
                }));
            }
            break;
        }
        case 'add_user_to_room': {
            const parsedData = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
            const { indexRoom } = parsedData;
            handleAddUserToRoom(ws, indexRoom);
            break;
        }
        case 'add_ships': {
            const shipsData = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
            handleAddShips(ws, shipsData);
            break;
        }
        case 'attack':
            console.log('Player attacks');
            break;
        default:
            console.log('Unknown command');
    }
};

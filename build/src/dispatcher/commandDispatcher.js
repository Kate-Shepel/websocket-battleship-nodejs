export const commandDispatcher = (data) => {
    console.log('Data in commandDispatcher', data);
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
        case 'create_game':
            console.log('Create game for both players');
            break;
        case 'update_room':
            console.log('Update room state');
            break;
        case 'add_ships':
            console.log('Players place ships');
            break;
        case 'start_game':
            console.log('Start the game');
            break;
        case 'attack':
            console.log('Player attacks');
            break;
        case 'randomAttack':
            console.log('Random attack');
            break;
        case 'turn':
            console.log('Server updates turn info');
            break;
        case 'finish':
            console.log('Game finished');
            break;
        case 'update_winners':
            console.log('Update winners table');
            break;
        default:
            console.log('Unknown command');
    }
};

export const gameCommandHandler = (data, gameUsers, ws) => {
    //console.log('Data in gameCommandHandler', data);
    const commandAction = data.type;
    switch (commandAction) {
        case 'reg': {
            const parsedData = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
            const { name, password } = parsedData;
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
                }
                else {
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
            }
            else {
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

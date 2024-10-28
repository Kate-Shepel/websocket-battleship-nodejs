import { WebSocket } from 'ws';
import { IRegisterUser } from '../types/types.js';
import { state } from '../state/state.js';

const userConnections: Map<WebSocket, string> = new Map();

export function handleRegistration(data: IRegisterUser, ws: WebSocket) {
  const { name, password } = data;
  const existingUser = state.gameUsers.find((user) => user.name === name);

  if (existingUser) {
    if (existingUser.password === password) {
      console.log(`User ${name} authenticated successfully.`);
      ws.send(
        JSON.stringify({
          type: 'reg',
          data: JSON.stringify({
            name,
            index: state.gameUsers.indexOf(existingUser),
            error: false,
            errorText: '',
          }),
          id: 0,
        }),
      );
      userConnections.set(ws, name);
    } else {
      console.log(`Failed authentication for ${name}: incorrect password.`);
      ws.send(
        JSON.stringify({
          type: 'reg',
          data: JSON.stringify({
            name,
            error: true,
            errorText: 'Incorrect password',
          }),
          id: 0,
        }),
      );
    }
  } else {
    state.gameUsers.push({ name, password });
    console.log(`User ${name} registered successfully.`);
    ws.send(
      JSON.stringify({
        type: 'reg',
        data: JSON.stringify({
          name,
          index: state.gameUsers.length - 1,
          error: false,
          errorText: '',
        }),
        id: 0,
      }),
    );
    userConnections.set(ws, name);
  }
}

export function getUserName(ws: WebSocket): string | undefined {
  return userConnections.get(ws);
}

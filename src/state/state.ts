import { WebSocket } from 'ws';

export const state = {
  gameUsers: [] as Array<{ name: string; password: string }>,
  gameRooms: [] as Array<{ roomId: number; players: WebSocket[] }>,
  serverClients: [] as WebSocket[],
};

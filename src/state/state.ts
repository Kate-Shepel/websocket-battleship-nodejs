import { WebSocket } from 'ws';

export const state = {
  gameUsers: [] as Array<{ name: string; password: string }>,
  gameRooms: [] as Array<{ roomId: number; players: WebSocket[] }>,
  serverClients: [] as WebSocket[],
  gameSessions: {} as {
    [key: number]: {
      players: {
        [key: string]: {
          ships: Array<{ position: { x: number; y: number }; direction: boolean; length: number; type: string }>;
        } & { ready: boolean };
      };
    };
  },
};

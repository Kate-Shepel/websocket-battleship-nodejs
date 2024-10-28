export interface IActionCommand<T> {
  type: string;
  data: T;
  id: number;
}

export interface IRegisterUser {
  name: string;
  password: string;
  error?: boolean;
  errorText?: string;
}

export interface IShipData {
  ships: Array<{ position: { x: number; y: number }; direction: boolean; length: number; type: string }>;
  ready: boolean;
}

export interface IGameSession {
  players: {
    [userName: string]: IShipData;
  };
}

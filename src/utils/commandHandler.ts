import { IActionCommand } from '../types/types.js';

export const decodeCommand = <T>(command: string): IActionCommand<T> => {
  const parsedCommand = JSON.parse(command);
  return {
    type: parsedCommand.type,
    data: parsedCommand.data,
    id: parsedCommand.id,
  };
};

export const stringifyResponse = <T>(response: IActionCommand<T>) => {
  return JSON.stringify(response);
};

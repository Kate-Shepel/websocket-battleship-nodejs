export const decodeCommand = (command) => {
    const parsedCommand = JSON.parse(command);
    return {
        type: parsedCommand.type,
        data: parsedCommand.data,
        id: parsedCommand.id,
    };
};
export const stringifyResponse = (response) => {
    return JSON.stringify(response);
};

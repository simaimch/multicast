import { Socket } from "socket.io";

import { MSG_CONNECT } from '../../../frontend/src/common/socket/messages';

function leaveAllRooms(socket: Socket) {
    const allRooms = socket.rooms;
    for (const room of allRooms)
        if (room != socket.id)
            socket.leave(room);
}

export default function websocket(socket: Socket) {
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on(MSG_CONNECT, (...args) => {
        if (!args[0])
            return;
        const sessionId = args[0].toString() as string;
        leaveAllRooms(socket);
        socket.join(sessionId);
    })
}
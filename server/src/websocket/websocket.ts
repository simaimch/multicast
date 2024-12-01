import { Socket } from "socket.io";

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

    socket.on('AUTH', (...args) => {
        if (!args[0])
            return;
        const sessionId = args[0].toString() as string;
        leaveAllRooms(socket);
        socket.join(sessionId);
    })
}
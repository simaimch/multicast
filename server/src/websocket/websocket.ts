import { Socket } from "socket.io";

import { MSG_CONNECT } from '../../../frontend/src/common/socket/messages';

function leaveAllRooms(socket: Socket) {
	const allRooms = socket.rooms;
	for (const room of allRooms)
		if (room != socket.id)
			socket.leave(room);
}

function sendInfo(socket: Socket){
	socket.emit("INFO", Array.from(socket.rooms));
}

export default function websocket(socket: Socket) {
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});

	socket.on(MSG_CONNECT, (...args) => {
		if (!args[0] || typeof args[0] !== "string"){

		}
		else
		{	
			const sessionId = args[0].toString() as string;
			leaveAllRooms(socket);
			socket.join(sessionId);
		}
		sendInfo(socket);
	})

	socket.on('GET_INFO', (...args) => {
		sendInfo(socket);
	});

	socket.on('JOIN', (...args) => {
		if (!args[0] || typeof args[0] !== "string"){
			socket.emit("REQUEST MALFORMED", "JOIN");
			return;
		}

		const roomId = args[0];

		socket.join(roomId);
		sendInfo(socket);
	});

	socket.on('POST', (...args) => {
		if (!args[0] || typeof args[0] !== "string")
			return;
		if (!args[1] || typeof args[1] !== "string")
			return;

		const roomId = args[0];
		const message = args[1];

		socket.to(roomId).emit('MSG',roomId,message);
	});
}
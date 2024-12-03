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

function roomIdCleaned(roomId:any):(false|string){
	if(typeof roomId !== "string")
		return false;

	roomId = roomId.trim();

	if(!roomId)
		return false;

	var isAlphabetic = (s: string) =>/^[\w\-]+$/.test(s);

	if(!isAlphabetic(roomId))
		return false;

	if(roomId.length > 50)
		return false;

	return roomId;
}

export default function websocket(socket: Socket) {
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});

	socket.on(MSG_CONNECT, (roomId) => {
		try {
			roomId = roomIdCleaned(roomId);
			if (!roomId) {
				socket.emit("REQUEST MALFORMED", MSG_CONNECT, JSON.stringify(roomId));
				return;
			}

			leaveAllRooms(socket);
			socket.join(roomId);
			
			sendInfo(socket);
		} catch (e) {
			console.error(e);
		}
	});

	socket.on('GET_INFO', (...args) => {
		try{
			sendInfo(socket);
		} catch (e) {
			console.error(e);
		}
	});

	socket.on('JOIN', (...args) => {
		try {
			if (!args[0] || typeof args[0] !== "string"){
				socket.emit("REQUEST MALFORMED", "JOIN", JSON.stringify(args[0]));
				return;
			}

			const roomId = roomIdCleaned(args[0]);
			if(!roomId){
				socket.emit("REQUEST MALFORMED", "JOIN", JSON.stringify(args[0]));
				return;
			}


			socket.join(roomId);
			sendInfo(socket);
		}catch (e) {
			console.error(e);
		}
	});

	socket.on('POST', (roomId, message , callback) => {
		try{
			roomId = roomIdCleaned(roomId);
			if (!roomId){
				callback({ status: "roomid invalid" });
				return;
			}
				
			if (!message){
				callback({ status: "empty message" });
				return;
			}

			if(JSON.stringify(message).length > 4096){
				callback({ status: "message too long" });
				return;
			}
				

			socket.to(roomId).emit('MSG',roomId,message);
			callback({status:"ok"});
		}
		catch(e){
			console.error(e);
			callback({ status: "err" });
		}
	});
}
import React, { useEffect, useState } from 'react';
import './App.css';
import { socket } from './_helpers/serverCommunication/socket';

import UserSession from './common/interfaces/UserSession';
import useLocalStorage from './_helpers/storage/useLocalStorage';

import {MSG_CONNECT} from './common/socket/messages';
import Room from './Room/Room';

//#region Session
	export const emptyUserSession = { username: "", session: "", level: 0 };
	let [userSession, setUserSession]: [UserSession, React.Dispatch<React.SetStateAction<UserSession>>] = [emptyUserSession, (() => { })];
	export function GetUserSession(): UserSession { return userSession; }
	export function SetUserSession(userSession: UserSession) {
		setUserSession(userSession);
	};
//#endregion

type RoomData = {messages:string[]};
type RoomDataDict = { [roomId: string]: RoomData};

function App() {
	[userSession, setUserSession] = useLocalStorage<UserSession>('session', emptyUserSession);

	const [isConnected, setIsConnected] = useState(socket.connected);

	const [roomData, setRoomData] = useState<RoomDataDict>({});

	const roomsDom = Object.entries(roomData).forEach(([roomId, roomData]) => <Room roomId={roomId} roomData={roomData} sendMessage={sendMessage} key={roomId}></Room>);

	function sendMessage(type:string,args:any[]){
		socket.emit(type,args);
	}

	useEffect(() => {
		function onConnect() {
			setIsConnected(true);
		}

		function onDisconnect() {
			setIsConnected(false);
		}


		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);

		function info(newInfo:string[]){
			const newRoomDataDict: RoomDataDict = {};

			for(const roomId of newInfo)
				newRoomDataDict[roomId] = roomData[roomId] ?? {messages:[]};

			setRoomData(newRoomDataDict);
		}

		function msg(roomId:string,message:string){
			const newRoomDataDict = {...roomData};
			newRoomDataDict[roomId].messages.push(message);
			setRoomData(newRoomDataDict);
		}

		socket.on('INFO', info);
		socket.on('MSG', msg);

		socket.connect();
		socket.emit(MSG_CONNECT, userSession.session);

		return () => {
			socket.off('connect', onConnect);
			socket.off('disconnect', onDisconnect);
			socket.off('INFO', info);
			socket.off('MSG', msg);

			socket.disconnect();
		};
	}, []);

	

	return (
		<div className="App">
			{
				isConnected && <>
					<div>CONNECTED</div>
					<div><button onClick={() => socket.emit('GET_INFO')}>Info</button></div>
					{roomsDom}
				</>
			}
		</div>
	);
}

export default App;

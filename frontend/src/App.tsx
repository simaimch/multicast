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

	const roomsDom = Object.entries(roomData).map(([roomId, roomData]) => <Room roomId={roomId} roomData={roomData} sendMessage={sendMessage} key={roomId}></Room>);

	function sendMessage(type:string,args:any[]){
		socket.emit(type,...args);
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
			console.log("INFO",newInfo);
			setRoomData(oldRoomData => {
				const newRoomDataDict: RoomDataDict = {};

				for(const roomId of newInfo)
					newRoomDataDict[roomId] = oldRoomData[roomId] ?? {messages:[]};

				console.log("INFO-Update",newRoomDataDict);

				return newRoomDataDict;
			});
		}

		function msg(roomId:string,message:string){
			console.log("MSG", roomId, message);
			setRoomData(oldRoomData => {
				const newRoomDataDict = { ...oldRoomData };
				newRoomDataDict[roomId].messages.push(message);
				return newRoomDataDict;
			});
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

	const [joinRoomId, setJoinRoomId] = useState("");

	const formKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			formSubmit();
		}
	}

	function formSubmit() {
		if(!joinRoomId)
			return;
		sendMessage("JOIN", [joinRoomId]);

		setJoinRoomId("");
	}

	return (
		<div className="App">
			{
				isConnected && <>
					<div>CONNECTED</div>
					<div><button onClick={() => socket.emit('GET_INFO')}>Info</button></div>
					{roomsDom}
					<h2>JOIN</h2>
					<div>
						<input onChange={(e) => setJoinRoomId(e.target.value)} value={joinRoomId} onKeyDown={formKeydown}></input>
					</div>
				</>
			}
		</div>
	);
}

export default App;

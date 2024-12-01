import React, { useEffect, useState } from 'react';
import './App.css';
import { socket } from './_helpers/serverCommunication/socket';

import UserSession from './common/interfaces/UserSession';
import useLocalStorage from './_helpers/storage/useLocalStorage';

import {MSG_CONNECT} from './common/socket/messages';

//#region Session
	export const emptyUserSession = { username: "", session: "", level: 0 };
	let [userSession, setUserSession]: [UserSession, React.Dispatch<React.SetStateAction<UserSession>>] = [emptyUserSession, (() => { })];
	export function GetUserSession(): UserSession { return userSession; }
	export function SetUserSession(userSession: UserSession) {
		setUserSession(userSession);
	};
//#endregion

function App() {
	[userSession, setUserSession] = useLocalStorage<UserSession>('session', emptyUserSession);

	const [isConnected, setIsConnected] = useState(socket.connected);

	const [info, setInfo] = useState("");

	useEffect(() => {
		function onConnect() {
			setIsConnected(true);
		}

		function onDisconnect() {
			setIsConnected(false);
		}


		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);

		function info(newInfo:string){
			setInfo(newInfo);
		}

		socket.on('INFO', info);

		socket.connect();
		socket.emit(MSG_CONNECT, userSession.session);

		return () => {
			socket.off('connect', onConnect);
			socket.off('disconnect', onDisconnect);
			socket.off('INFO', info);

			socket.disconnect();
		};
	}, []);



	return (
		<div className="App">
			{
				isConnected && <>
					<div>CONNECTED</div>
					<div><button onClick={() => socket.emit('GET_INFO')}>Info</button></div>
					<div>
						<h2>Info</h2>
						{info}
					</div>
				</>
			}
		</div>
	);
}

export default App;

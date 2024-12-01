import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { socket } from './_helpers/serverCommunication/socket';

import UserSession from '../../common/interfaces/UserSession';
import useLocalStorage from './_helpers/storage/useLocalStorage';

import {MSG_CONNECT} from '../../common/socket/messages';

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

	useEffect(() => {
		function onConnect() {
			setIsConnected(true);
		}

		function onDisconnect() {
			setIsConnected(false);
		}


		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);

		socket.connect();
		socket.emit(MSG_CONNECT, userSession.session);

		return () => {
			socket.off('connect', onConnect);
			socket.off('disconnect', onDisconnect);


			socket.disconnect();
		};
	}, []);



	return (
		<div className="App">
			{
				isConnected && <div>CONNECTED</div>
			}
		</div>
	);
}

export default App;

import { useState } from "react";
import { ServerRoom } from "../settings";

export default function Room(
	{
		roomId,
		roomData,
		postMessage,
	}
	:
	{
		roomId:string,
		roomData:{messages:string[]},
		postMessage: (room: string, msg: string) =>any,
	}
){

	const [newMessage, setNewMessage] = useState("");

	const formKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			formSubmit();
		}
	}

	function formSubmit() {
		postMessage(roomId,newMessage);

		setNewMessage("");
	}

	const messagesDom = roomData.messages.map((message,index)=><p key={index}>{index}: {message}</p>);

	const roomDisplayName = roomId === ServerRoom ? '# Global' : roomId;

	return <>
		<h2>{roomDisplayName}</h2>
		{messagesDom}
		
		<div><input onChange={(e) => setNewMessage(e.target.value)} onKeyDown={formKeydown} value={newMessage} /><button onClick={formSubmit}>Send</button></div>
		<hr/>
	</>;
}
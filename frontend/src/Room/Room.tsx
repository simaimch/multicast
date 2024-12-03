import { useState } from "react";

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

	return <>
		<h2>{roomId}</h2>
		{messagesDom}
		
		<div><input onChange={(e) => setNewMessage(e.target.value)} onKeyDown={formKeydown} value={newMessage}/></div>
		<hr/>
	</>;
}
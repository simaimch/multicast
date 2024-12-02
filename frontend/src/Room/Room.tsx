import { useState } from "react";

export default function Room(
	{
		roomId,
		roomData,
		sendMessage,
	}
	:
	{
		roomId:string,
		roomData:{messages:string[]},
		sendMessage: (type: string, args: any[])=>any,
	}
){

	const [newMessage, setNewMessage] = useState("");

	const formKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			formSubmit();
		}
	}

	function formSubmit() {
		sendMessage("POST",[roomId,newMessage]);

		setNewMessage("");
	}

	const messagesDom = roomData.messages.forEach((message,index)=><p key={index}>{message}</p>);

	return <>
		<h2>{roomId}</h2>
		{messagesDom}
		
		<div><input onChange={(e) => setNewMessage(e.target.value)} onKeyDown={formKeydown} value={newMessage}/></div>
		<hr/>
	</>;
}
import { ServerAddress } from "../../settings";


export async function serverRequest<T>(path:string, data:any):Promise<T|string>{
	const url = ServerAddress + path;

	return new Promise<T|string>((resolve, reject) => {

		fetch(url, {
			method: "POST", // *GET, POST, PUT, DELETE, etc.
			mode: "cors", // no-cors, *cors, same-origin
			cache: "default", // *default, no-cache, reload, force-cache, only-if-cached
			credentials: "omit", // include, *same-origin, omit
			headers: {
				"Content-Type": "application/json",
				// 'Content-Type': 'application/x-www-form-urlencoded',
			},
			redirect: "error", // manual, *follow, error
			referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
			body: JSON.stringify(data), // body data type must match "Content-Type" header
		})
		.then(
			async response=>{
				if(!response.ok){
					reject(await response.text());
					return;
				}

				resolve(response.json())
				
			}
		)
		.catch(reason=>{
			reject(reason);
		});
	});
		
	
}
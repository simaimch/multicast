import React from "react";

// https://www.robinwieruch.de/local-storage-react/
function useLocalStorage<T>(storageKey:string, fallbackState:T):[T, React.Dispatch<React.SetStateAction<T>>]{
	let state = fallbackState;
	const stringFromStorage = localStorage.getItem(storageKey);

	if(stringFromStorage){
		try{
			const stateParsed = JSON.parse(stringFromStorage) as T;
			state = stateParsed;
		}
		catch(e){
			throw new Error('Fuck you, JSON!'+(typeof stringFromStorage));
		}
	}

	const [value, setValue] = React.useState<T>(
		state
	);

	React.useEffect(() => {
		localStorage.setItem(storageKey, JSON.stringify(value));
	}, [value, storageKey]);

	return [value, setValue];
};

export default useLocalStorage;
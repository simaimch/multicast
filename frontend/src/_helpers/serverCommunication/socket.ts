import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? 'http://85.215.242.26:8719/' : 'http://85.215.242.26:8719/';

export const socket = io(URL, {autoConnect: false});
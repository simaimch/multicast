import { io } from 'socket.io-client';
import { URL } from '../../_config/Config';

export const socket = io(URL, {autoConnect: false});
import { io } from 'socket.io-client';
import React from 'react';

// export const socket = io('ws://localhost:8000');


export const socket = window.location.host.includes('localhost') ?
io(`ws://localhost:8000`)
: io(`ws://keepgoingapp.herokuapp.com:${process.env.PORT}`)


export const SocketContext = React.createContext();

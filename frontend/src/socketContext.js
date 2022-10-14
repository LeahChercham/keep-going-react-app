import { io } from 'socket.io-client';
import React from 'react';

// export const socket = io('ws://localhost:8000');

let socketurl = window.location.hostname === "localhost"
    ? "http://127.0.0.1:5000"
    : "https://keepgoingapp.herokuapp.com/"

export const socket = io.connect(socketurl)

// export const socket = window.location.host.includes('localhost') ?
// io(`ws://localhost:5000`)
// : io(`ws://keepgoingapp.herokuapp.com:${process.env.PORT}`)


export const SocketContext = React.createContext();

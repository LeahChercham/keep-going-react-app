import { io } from 'socket.io-client';
import React from 'react';

let socketurl = window.location.hostname === "localhost"
    ? "http://127.0.0.1:5000"
    : "https://keepgoingapp.herokuapp.com/"

export const socket = io.connect(socketurl)

export const SocketContext = React.createContext();

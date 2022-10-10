import { io } from 'socket.io-client';
import React from 'react';
import server from '../Server.js'

export const socket = io('ws://localhost:8000');


export const SocketContext = React.createContext();

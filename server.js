const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 5000
const path = require('path')
const cors = require('cors');
const user = require('./backend/routes/user')
const messenger = require('./backend/routes/messenger')
const offer = require('./backend/routes/offer')
const http = require('http')

// const messengerRoute = require('./routes/Not in Use messengerRoute')


let app = express();

app.use(cors());
app.options("", cors());

// Set Api Routes
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "*")
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
  next()
})

app.use(express.static(path.join(__dirname, "frontend", "build")))
console.log(path.join(__dirname, "frontend", "build"));
app.use(express.static('node_modules'));

// Necessary to parse the JSON from requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', user)
app.use('/', messenger)
app.use('/', offer)

console.log(process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI
  || 'mongodb://127.0.0.1:27017/KeepGoingDB',
  { useNewUrlParser: true }, { useUnifiedTopology: true })
  .then(() => console.log("Connected to DB"))
  .catch(err => console.log(err));


//This is a "catch-all" route handler, essentially saying that if the server did not register any of the other routes, it will send the index.html file from the build. 
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});


let server = http.createServer(app)
server.listen(PORT, () => console.log(`Running on port ${PORT}`))
// server start
// app.listen(PORT, () => console.log(`Running on port ${PORT}`))

// from socket.js

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

// socket functions
let users = [];
const addUser = (userId, socketId, userInfo) => {
  const checkUser = users.some(u => u.userId === userId);

  if (!checkUser) {
    users.push({ userId, socketId, userInfo });
  }
}
const userRemove = (socketId) => {
  users = users.filter(u => u.socketId !== socketId);
}

const findContact = (id) => {
  return users.find(u => u.userId === id);
}

const userLogout = (userId) => {
  users = users.filter(u => u.userId !== userId)
}
// -----


io.on('connection', (socket) => {
  console.log('connection');
  socket.on('addUser', (userId, userInfo) => {
    console.log('Socket is connecting...' + userInfo)
    addUser(userId, socket.id, userInfo);
    io.emit('getUser', users);

    const us = users.filter(u => u.userId !== userId);
    const con = 'new_user_add';
    for (var i = 0; i < us.length; i++) {
      socket.to(us[i].socketId).emit('new_user_add', con);
    }




  });
  socket.on('sendMessage', (data) => {
    console.log('sendMessage')
    const user = findContact(data.receiverId);

    if (user !== undefined) {
      socket.to(user.socketId).emit('getMessage', data)
    }
  })

  socket.on('respondToOffer', (data) => {
    console.log('respondToOffer')
    const user = findContact(data.receiverId);
    const sender = findContact(data.senderId);
    if (user !== undefined) {

      socket.to(user.socketId).emit('getOffer', data)

    }
    if (sender !== undefined) {
      socket.to(sender.socketId).emit('getOffer', data)
    }
  })

  socket.on('sendOffer', (data) => {
    console.log('sendOffer')
    const user = findContact(data.receiverId);
    const sender = findContact(data.senderId);
    if (user !== undefined) {
      console.log('socket emitting send offer')
      socket.to(user.socketId).emit('getOffer', data)
    }
    if (sender !== undefined) {
      socket.to(sender.socketId).emit('getOffer', data)
    }
  })

  socket.on('messageSeen', msg => {
    console.log('messageSeen')
    const user = findContact(msg.senderId);
    if (user !== undefined) {
      socket.to(user.socketId).emit('msgSeenResponse', msg)
    }
  })

  socket.on('deliveredMessage', msg => {
    console.log('deliveredMessage')
    const user = findContact(msg.senderId);
    if (user !== undefined) {
      socket.to(user.socketId).emit('msgDeliveredResponse', msg)
    }
  })

  socket.on('deliveredOffer', msg => {
    console.log('deliveredOffer')
    const user = findContact(msg.senderId);
    if (user !== undefined) {
      socket.to(user.socketId).emit('ofrDeliveredResponse', msg)
    }
  })




  socket.on('seen', data => {
    console.log('seen')
    const user = findContact(data.senderId);
    if (user !== undefined) {
      socket.to(user.socketId).emit('seenSuccess', data)
    }
  })


  socket.on('typingMessage', (data) => {
    console.log('typingMessage')
    const user = findContact(data.receiverId);
    if (user !== undefined) {
      socket.to(user.socketId).emit('typingMessageGet', {
        senderId: data.senderId,
        receiverId: data.receiverId,
        msg: data.msg

      })
    }
  })

  socket.on('logout', userId => {
    console.log('logout')
    userLogout(userId);
  })


  socket.on('disconnect', () => {
    console.log('user is disconnected... ' + socket.id);
    userRemove(socket.id);
    io.emit('getUser', users);
  })
})






















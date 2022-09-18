
const io = require('socket.io')(8000, {
     cors: {
          origin: '*',
          methods: ['GET', 'POST']
     }
})

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
               socket.to(user.socketId).emit('getOffer', data) // data nicht vollständig
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
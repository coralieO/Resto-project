const express = require('express');
const path =require('path')
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const {userJoin,getCurrentUser, userleave,getRoomUsers,userResto} = require('./utils/users');
const { formatMessage } = require('./utils/message');
const io = new Server(server);

const BotName ='miam miam bot'
app.use(express.static(path.join(__dirname,'public')));

server.listen(3000, () => {
  console.log('listening on *:3000');
});

//let users = [];

io.on('connection', (socket) => {
    socket.on("join room", ({username,room,lat,lng}) =>{
    const user = userJoin(socket.id,username, room,lat,lng);
    // socket.on("position",({lat,lng}) =>{
    //   const latitude =lat;
    //   const longitude = lng;
    // });
    
    //io.emit('new user', users);
    socket.join(user.room);
    
    //message destiné à la personne qui se connecte
    socket.emit('message', formatMessage(BotName, "bienvenu à toi"));
    
    //message destiné à tout le monde sauf celle qui se connecte
    socket.broadcast
    .to(user.room)
    .emit('message', formatMessage(BotName, `${user.username} vient de rejoindre`) );
    // Send users and room info
    io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });

  });

  socket.on("resto",({username,r,latr,lngr})=>{
    const user = getCurrentUser(socket.id)
    const resto = userResto(socket.id,username,r,latr,lngr);
    io.to(user.room).emit("restoUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
      restos: resto
    });
  });
    //recuperer les messages du tchat
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id)
        io.to(user.room)
        .emit('message',formatMessage(user.username, msg));
    });

    socket.on('disconnect', () =>{
        const user = userleave(socket.id);
        if(user){
        //message à tout le monde 
        io.to(user.room).emit(
        'message',formatMessage(BotName,`${user.username} a quitté le chat`));
        // Send users and room info
        io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
         });
        }

    })
    
});
let express = require('express');
let socket = require('socket.io');
var PORT = process.env.PORT || 5000;

let app = express();

server = app.listen(PORT, () => {
  console.log('server is running on port 5000')
});

io = socket(server);

io.on('connection', socket => {
  console.log('user connected');

  socket.on('SEND_MESSAGE', data => {
    io.emit('RECEIVE_MESSAGE', data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  })  
});

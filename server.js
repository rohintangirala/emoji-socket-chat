let express = require('express');
let socket = require('socket.io');

let app = express();

server = app.listen(5000, () => {
  console.log('server is running on port 5000')
});

io = socket(server);

io.on('connection', socket => {
  console.log(socket.id);

  socket.on('SEND_MESSAGE', data => {
    io.emit('RECEIVE_MESSAGE', data);
  });
});

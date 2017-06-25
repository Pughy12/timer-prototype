const express = require('express');
const app     = express();
const http    = require('http').Server(app);
const io      = require('socket.io')(http);

const serverPort = 3000;

class Timer {
  constructor(h,m,s,running) {
    this.hours = h;
    this.minutes = m;
    this.seconds = s;
    this.running = running;
  }

  addHour(value) {
    this.hours += Number(value);
  }

  addMinute(value) {
    // Check we don't go above 60 minutes, but instead wrap around to the hour
    if (this.minutes == 59) {
      this.addHour(1);
      this.minutes = 0;
      return;
    }

    this.minutes += Number(value);
  }

  addSecond(value) {
    // Check we don't go above 60 seconds, but instead wrap around to the minute
    if (this.seconds == 59) {
      this.addMinute(1);
      this.seconds = 0;
      return;
    }

    this.seconds += Number(value);
  }

  update() {
    console.log(timer);
  }

  start() {
    setTimeout(this.update(), 1000);
  }

  stop() {
    this.setRunning(false);
  }

  clear() {
    this.setRunning(false);
  }

  isRunning() {
    return this.running;
  }

  setRunning(value) {
    this.running = new Boolean(value);
  }

}

let timer = new Timer(0, 0, 0, false);

// Socket connection
io.on('connection', function(socket){
  
  // On client connection
  console.log(`Timer client connected: ${socket.client.id}`);
  var srvSockets = io.sockets.sockets;
  var users = Object.keys(srvSockets).length;
  io.emit('users update', users) // Update userCount on the UI

  // When a client wants to add minutes to the timer
  socket.on('timer add minutes', function(value) {
    console.log(`Adding ${value} minute to the timer`);
    timer.addMinute(value);

    io.emit('timer update', timer);
  }),

  // When a client wants to start or stop the timer
  socket.on('timer start-stop', function() {
    console.log(`Starting/stopping the timer`);
    timer.start();

    //TODO: Start or stop the timer

    // io.emit('timer update', timer);
  }),

  // When a client wants to clear the timer
  socket.on('timer clear', function() {
    console.log(`Clearing the timer`);
    timer.clear();
  })
});

// When a client disconnects
io.on('disconnection', function(socket) {
  console.log(`Timer client disconnected: ${socket.client.id}`);
  var srvSockets = io.sockets.sockets;
  var users = Object.keys(srvSockets).length;
  socket.emit('users update', users) // Update userCount on the UI
});

// Serve static content like index.html and css files, from the folder called public
app.use(express.static("client/public"));

// Start the server
http.listen(serverPort, function(){
  console.log(`~~~~~~~~~ Server started, listening on port ${serverPort} ~~~~~~~~~`);
});
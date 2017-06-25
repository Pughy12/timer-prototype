$(function () {

    // Utility functions
    function format(n){
      return n > 9 ? "" + n: "0" + n;
    }

    var socket = io();

    // On connecting, get the timer value in case it's already in progress
    // socket.on('connection', function() {
      
    // })

    // Adding time from the client
    $('button#add-minute').click(function(){
      socket.emit('timer add minutes', "1");
    });

    // Starting & stopping the timer
    $('button#start-stop').click(function(){
      socket.emit('timer start-stop');
    });

    // Clearing the timer
    $('button#clear').click(function(){
      socket.emit('timer clear');
    });

    // Receiving a time update. Set all the values to whatever comes through the pipes
    socket.on('timer update', function(timer){
      console.log('Received timer update');

      var hours = $('span#hours');
      var minutes = $('span#minutes');
      var seconds = $('span#seconds');

      hours.text(format(timer.hours));
      minutes.text(format(timer.minutes));
      seconds.text(format(timer.seconds));
    });

    // This event is emitted when a user connects or updated and we update the total user count
    socket.on('users update', function(value) {
      var userCount = $('span#users');
      userCount.text(value);
    })
  });
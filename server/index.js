
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//app.get('/', function(req, res){
//    res.sendFile(__dirname + '/index.html');
//});

http.listen(3001, function(){
    console.log('listening on *:3001');
});

io.sockets.on('connection', function (socket) {
    console.log('socket connected');

    socket.on('ALL', function (msg) {
        console.log(msg)
    });
});


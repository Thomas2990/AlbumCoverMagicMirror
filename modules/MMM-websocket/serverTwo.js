var Server = require('ws').Server;
var WebSocket = require('ws');
var port = 8081;
//var ws = new WebSocket("ws://localhost:8081");
var ws = new Server({port: port});
ws.on('connection', function(w) {

   w.on('message', function(msg){
     console.log('message from client :: ', msg);
   });

   w.on('close', function() {
     console.log('closing connection');
   });
});

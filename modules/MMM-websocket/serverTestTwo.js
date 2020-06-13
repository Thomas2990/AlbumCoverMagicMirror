var WebSocket = require('ws');
var connection = new WebSocket('ws://localhost:8081');

connection.onopen = function() {
   connection.send("HELLO WORLD");
};

connection.onerror = function (error) {
   console.error('WebSocket Error ' + error);
};

connection.onmessage = function (e) {

};

const WebSocket = require("ws");

var websocket = new WebSocket("wss://localhost:8081/");
websocket.onopen = function(event) {
	console.log("opened");
}
websocket.onmessage = function(event) {
	console.log(event.data);
}
websocket.onerror = function(error) {
	console.log(error);
}

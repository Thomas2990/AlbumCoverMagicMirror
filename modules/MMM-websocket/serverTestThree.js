var WebSocket = require('ws');
var connection = new WebSocket('ws://localhost:8081');
var sleepSpotify = {
    type: 'SPOTIFY_WAKE',
    payload: 'none'
}
connection.onopen = function() {
  console.log("opened");
  connection.send(JSON.stringify(sleepSpotify));
  // connection.send("SPOTIFY_SLEEP");
};

connection.onerror = function (error) {
   console.error('WebSocket Error ', error);
};

connection.onmessage = function (e) {

};

/* global Module */

/* Magic Mirror
 * Module: MMM-websocket
 *
 * By Jan Löbel
 * MIT Licensed.
 */
const NodeHelper = require("node_helper");
const WebSocket = require("ws");
const Server = require("ws").Server;


module.exports = NodeHelper.create({
	socketNotificationReceived: function (notification, payload) {
		var self = this;

		if(notification === "WS_CONNECT") {
			// Connect event will be handeled internally
			self.config = payload.config;
			self.connect(payload.config);
			return;
		} else if(notification === "WS_DISCONNECT") {
			// Disconnect event will be handeled internally
			self.config = undefined;
			self.disconnect();
			return;
		}

		// Forward all other socket notifications
		if(self.ws) {
			const obj = {
				type: notification,
				payload: payload
			};

			//self.ws.send(JSON.stringify(obj), function ack(error){
			self.ws.clients.forEach(function each(client) {
				if(client.readyState === WebSocket.OPEN) {
					client.send(JSON.stringify(obj));
				}
			});

			//self.ws.send(notification, function ack(error){
			//	if(error) {
			//		self.error("Error while sending obj: ", obj);
			//	}
			//});
		} else {
			self.debug("Can not send notification because WebSocket is not yet connected!", notification)
		}
	},

	connect: function(config, callback) {
		var self = this;

		// Disconnect to assure only one instance is running

		//const url = "ws://" + config.host + ":" + config.port;
		//self.ws = new WebSocket(url);
		self.ws = new Server({port: config.port});
		self.ws.on('connection', function(w) {
			w.on('message', function(msg){
			   self.sendMessage(msg);
                        });
                        if(callback) {
                          callback();
                        }
                });
	},

	sendMessage: function(event) {
		var self = this;
		self.debug("Send event: ", event);
		switch(event) {
			case "on":
			   self.sendSocketNotification("SPOTIFY_WAKE", "");
			   break;
			case "off":
			   self.sendSocketNotification("SPOTIFY_SLEEP", "");
			   break;
			case "refresh":
			   self.sendSocketNotification("ONSCREENMENU_PROCESS_ACTION", "restart");
			   break;
			case "restart":
			   self.sendSocketNotification("ONSCREENMENU_PROCESS_ACTION", "reboot");
			   break;
			case "shutdown":
			   self.sendSocketNotification("ONSCREENMENU_PROCESS_ACTION", "shutdown");
			   break;
			case "changeSpotifyAccount":
			   self.sendSocketNotification("SPOTIFY_CHANGE_ACCOUNT", "");
                           break;
			case "update":
			   self.sendSocketNotification("ONSCREENMENU_PROCESS_ACTION", "update");
			   break;
			case "startup":
			   self.sendSocketNotification("STATE_PAYLOAD_ONE", "");
			   break;
			default:
			   break;
                }
		//self.sendSocketNotification(event.type, event.payload);
	},

	reconnect: function(config) {
		//var self = this;
		//self.debug("Trying to reconnect...");
		//self.connect(config, function(error) {
		//	if(error) {
		//		self.error("Error while reconnecting to websocket...", error);
		//		setTimeout(function() { self.reconnect(config) }, config.reconnectInterval);
		//	}
		//});
	},

	disconnect: function() {
		var self = this;
                self.ws.close();
		//if (self.ws) {
			// Unregister listener
		//	self.ws.onclose = undefined;
		//	self.ws.onerror = undefined;
		//	self.ws.onopen = undefined;
		//	self.ws.onmessage = undefined;

		//	if(self.ws.readyState === WebSocket.OPEN) {
		//		self.ws.close();
		//		self.ws.terminate();
		//	}
		//	self.ws = undefined;
		//}
	},

	debug: function() {
		var self = this;
		if(self.config.debug) {
			console.log.apply(self, arguments);
		}
	},

	error: function() {
		var self = this;
		console.error.apply(self, arguments);
	},
});

/* Magic Mirror Config Sample
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 *
 * For more information how you can configurate this file
 * See https://github.com/MichMich/MagicMirror#configuration
 *
 */

var config = {
	address: "localhost", // Address to listen on, can be:
	                      // - "localhost", "127.0.0.1", "::1" to listen on loopback interface
	                      // - another specific IPv4/6 to listen on a specific interface
	                      // - "", "0.0.0.0", "::" to listen on any interface
	                      // Default, when address config is left out, is "localhost"
	port: 8080,
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1", "192.168.0.1/40"], // Set [] to allow all IP addresses
	                                                       // or add a specific IPv4 of 192.168.1.5 :
	                                                       // ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
	                                                       // or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
	                                                       // ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

	language: "en",
	timeFormat: 24,
	units: "metric",
	// serverOnly:  true/false/"local" ,
			     // local for armv6l processors, default
			     //   starts serveronly and then starts chrome browser
			     // false, default for all  NON-armv6l devices
			     // true, force serveronly mode, because you want to.. no UI on this device
	modules: [
		{
  			module: "MMM-NowPlayingOnSpotify",
  			position: "top_center",
		},
		/* {
			module: "MMM-AlexaControl",
			position: "middle_center",
			config: {
				image: false,
				pm2ProcessName: "MagicMirror",
				vcgencmd: "vcgencmd",
				stop: false,
				shutdown: false,
                                restart: true,
				refresh: false,
				reboot: true,
				notifications: [{
					name: "Album Cover Two",
					port: 11100,
					OnOff: true,
					notification: [["SPOTIFY_WAKE", {}],["SPOTIFY_SLEEP", {}]]
				}]
			}
		}, */
		{
			module: "MMM-OnScreenMenu",
		},
		{
			module: 'MMM-websocket',
			config: {
				debug: true,
			}
		},
		{
			module: "MMM-GroveGestures",
			config: {
				autoStart: true,
				verbose: false,
				recognitionTimeout: 50,
				visible: false,
				gestureMapFromTo: {
					"Up": "UP",
					"Down": "DOWN",
					"Left": "LEFT",
					"Right": "RIGHT",
					"Forward": "FORWARD",
					"Backward": "BACKWARD",
					"Clockwise": "CLOCKWISE",
					"anti-clockwise": "ANTICLOCKWISE",
					"wave": "WAVE"
				},
				defaultCommandSet: "default",
				commandSet: {
					"default": {
						"LEFT": {
							notificationExec: {
								notification: "SPOTIFY_NEXT_SONG",
								payload: null
							}
						},
						"RIGHT": {
							notificationExec: {
								notification: "SPOTIFY_PREVIOUS_SONG",
								payload: null
							}
						},
						"FORWARD": {
							notificationExec: {
								notification: "SPOTIFY_TOGGLE",
								payload: null
							}
						},
						"UP": {
							notificationExec: {
								notification: "SPOTIFY_RAISE_VOLUME",
								payload: null
							}
						},
						"DOWN": {
							notificationExec: {
								notification: "SPOTIFY_LOWER_VOLUME",
								payload: null
							}
						},
					}
				}
			}
		}
	]

};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}

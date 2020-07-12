'use strict';

Module.register('MMM-NowPlayingOnSpotify', {

  // default values
  defaults: {
    // Module misc
    name: 'MMM-NowPlayingOnSpotify',
    hidden: false,

    // user definable
    updatesEvery: 1,          // How often should the table be updated in s?
    showCoverArt: true       // Do you want the cover art to be displayed?
  },


  start: function () {
    Log.info('Starting module: ' + this.name );

    this.initialized = false;
    this.context = {};
    this.currentCoverArt = "-";
    this.startFetchingLoop();
    this.sleep = false;
    this.latestSong = {};
  },

  getDom: function () {
    let domBuilder = new NPOS_DomBuilder(this.config, this.file(''), this.currentCoverArt);

    if (this.initialized) {
      if (!this.context.noSong){
	this.currentCoverArt = this.context.imgURL;
      }
      return domBuilder.getDom(this.context);
    } else {
      return domBuilder.getInitDom(this.translate('LOADING'));
    }
  },

  getStyles: function () {
    return [
      this.file('css/styles.css'),
      this.file('node_modules/moment-duration-format/lib/moment-duration-format.js'),
      'font-awesome.css'
    ];
  },

  getScripts: function () {
    return [
      this.file('core/NPOS_DomBuilder.js'),
      'moment.js'
    ];
  },

  socketNotificationReceived: function (notification, payload) {
    console.log("socket notification in main: " + notification + " Payload: " + payload);
    switch (notification) {
      case 'RETRIEVED_SONG_DATA':
	if(!payload.noSong) {
	  this.latestSong = payload;
	}
        this.initialized = true;
        this.context = payload;
        this.updateDom();
	this.sendNotification("SPOTIFY_PAYLOAD", payload);
	break;
      case 'RETRIEVED_LATEST_SONG_DATA':
        this.sendNotification("STATE_PAYLOAD_TWO", payload);
	break;
    }
  },

  notificationReceived: function (notification, payload, sender) {
     switch (notification) {
	case 'SPOTIFY_SLEEP':
	   this.sleep = true;
           this.sendNotification("ONSCREENMENU_PROCESS_ACTION", "monitorOff");
	   break;
	case 'SPOTIFY_WAKE':
	   this.sleep = false;
	   this.sendNotification("ONSCREENMENU_PROCESS_ACTION", "monitorOn");
           break;
        case 'SPOTIFY_CHANGE_ACCOUNT':
           this.sendSocketNotification('SPOTIFY_CHANGE_ACCOUNT');
	   break;
        case 'STATE_PAYLOAD_ONE':
           var state = JSON.parse(JSON.stringify(this.latestSong));
	   state.power = !this.sleep;
           this.sendNotification("STATE_PAYLOAD_FINISHED", state);
	   break;
     }

     /*if (notification === "SPOTIFY_SLEEP") {
        this.sleep = true;
        this.sendNotification("ONSCREENMENU_PROCESS_ACTION", "monitorOff");
     } else if (notification === "SPOTIFY_WAKE") {
        this.sleep = false;
	this.sendNotification("ONSCREENMENU_PROCESS_ACTION", "monitorOn");
     } else if (notification === "SPOTIFY_CHANGE_ACCOUNT") {
	this.sendSocketNotification('SPOTIFY_CHANGE_ACCOUNT');
     } else if (notification === "STATE_PAYLOAD_ONE") {
	var stateJSON = { power: !this.sleep };
	this.sendNotification("STATE_PAYLOAD_FINISHED", stateJSON);
     }*/
  },

  startFetchingLoop() {
    // start immediately ...

    this.sendSocketNotification('CONNECT_TO_SPOTIFY', "USE_CONFIG");

    // ... and then repeat in the given interval
    setInterval(() => {
      if(!this.sleep) {
        this.sendSocketNotification('UPDATE_CURRENT_SONG');
      }
    }, this.config.updatesEvery * 1000);
  }
});

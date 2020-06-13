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
        this.initialized = true;
        this.context = payload;
        this.updateDom();
    }
  },

  notificationReceived: function (notification, payload, sender) {
     if (notification === "SPOTIFY_SLEEP") {
        this.sleep = true;
        this.sendNotification("ONSCREENMENU_PROCESS_ACTION", "monitorOff");
     } else if (notification === "SPOTIFY_WAKE") {
        this.sleep = false;
	this.sendNotification("ONSCREENMENU_PROCESS_ACTION", "monitorOn");
     }
      else if (notification === "SPOTIFY_CHANGE_ACCOUNT") {
	this.sendSocketNotification('SPOTIFY_CHANGE_ACCOUNT');
     }
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

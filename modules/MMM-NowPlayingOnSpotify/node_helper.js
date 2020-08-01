'use strict';

const NodeHelper = require('node_helper');
const SpotifyConnector = require('./core/SpotifyConnector');
const Authorizer = require('./Authorizer');
const exec = require("child_process").exec;
var spotifyConfig = require('./spotifyConfig.json');
const fs = require('fs');

module.exports = NodeHelper.create({

  start: function () {
    this.connector = undefined;
    this.authorizer = undefined;
    if(spotifyConfig.clientID === "") {
      spotifyConfig = require('./spotifyConfig2.json');
      this.authorizer = new Authorizer();
      this.authorizer.startServer();
    }
  },


  socketNotificationReceived: function (notification, payload) {
    console.log("SOCKET NOTIFICATION RECIEVED: " + notification + " payload: " + payload);
    switch (notification) {
      case 'CONNECT_TO_SPOTIFY':
        this.connector = new SpotifyConnector(spotifyConfig);
        this.retrieveCurrentSong();
        break;

      case 'UPDATE_CURRENT_SONG':
        this.retrieveCurrentSong();
        break;


      case 'SPOTIFY_CHANGE_ACCOUNT':
	spotifyConfig = require('./spotifyConfig2.json');
	this.authorizer = new Authorizer();
	this.authorizer.startServer();
        break;
		    
      case 'NEXT_SONG':
	 this.requestNextSong();
         break;
    
      case 'PREV_SONG':
         this.requestPreviousSong();
         break;
    }
  },

//  toggleMonitor: function (state) {
//    opts = { timeout: 8000 };
//    switch (state) {
//      case "monitorOn":
//	console.log("reached monitor on");
//        exec("vcgencmd display_power 1", opts, (error, stdout, stderr) => { });
//        break;
//      case "monitorOff":
//	console.log("reached monitor off");
//        exec("vcgencmd display_power 0", opts, (error, stdout, stderr) => { });
//        break;
//    }
//  },

  retrieveCurrentSong: function () {
    this.connector.retrieveCurrentlyPlaying()
      .then((response) => {
        if (response) {
          this.sendRetrievedNotification(response);
        } else {
          this.sendRetrievedNotification({ noSong: true });
        }
      })
      .catch((error) => {
        console.error('Can’t retrieve current song. Reason: ');
        console.error(error);
      });
  },


  sendRetrievedNotification: function (songInfo) {
    let payload = songInfo;

    if (!songInfo.noSong) {
      payload = {
        imgURL: this.getImgURL(songInfo.item.album.images),
        songTitle: songInfo.item.name,
        artist: this.getArtistName(songInfo.item.artists),
        album: songInfo.item.album.name,
        titleLength: songInfo.item.duration_ms,
        progress: songInfo.progress_ms,
        isPlaying: songInfo.isPlaying,
        deviceName: songInfo.device.name
      };
    }

    this.sendSocketNotification('RETRIEVED_SONG_DATA', payload);
  },
  
  requestNextSong: function() {
    this.connector.requestNextSong();
  },
	
  requestPreviousSong: function() {
    this.connector.requestPreviousSong();
  },

  getArtistName: function (artists) {
    return artists.map((artist) => {
      return artist.name;
    }).join(', ');
  },


  getImgURL(images) {
    //let filtered = images.filter((image) => {
    //  return image.width >= 650 && image.width <= 4000;
    //});
    //console.log(filtered[0].width);
    //return filtered[0].url;
      return images[0].url;
  }
});

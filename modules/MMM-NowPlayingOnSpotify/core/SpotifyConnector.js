'use strict';

const request = require('request-promise-native');
const moment = require('moment');

const tokenRefreshEndpoint = 'https://accounts.spotify.com/api/token';
const apiEndpoint = 'https://api.spotify.com/v1/me/player';
const nextSongEndpoint = 'https://api.spotify.com/v1/me/player/next';
const previousSongEndpoint = 'https://api.spotify.com/v1/me/player/previous';
const pauseSongEndpoint = 'https://api.spotify.com/v1/me/player/pause';
const playSongEndpoint = 'https://api.spotify.com/v1/me/player/play';
const playerEndpoint = 'https://api.spotify.com/v1/me/player/';
const play = 'play';
const pause = 'pause';

module.exports = class SpotifyConnector {

  constructor(credentials) {
    this.credentials = credentials;
    this.tokenExpiresAt = moment();
  }

  retrieveCurrentlyPlaying() {
    if (moment().isBefore(this.tokenExpiresAt)) {
      return this.getSpotifyData();

    } else {
      return this.refreshAccessToken()
        .then((response) => {
          console.log('Refreshed access token because it has expired. Expired at: %s now is: %s',
            this.tokenExpiresAt.format('HH:mm:ss'), moment().format('HH:mm:ss'));

          this.credentials.accessToken = response.access_token;
          this.tokenExpiresAt = moment().add(response.expires_in, 'seconds');

          return this.getSpotifyData();
        })
        .catch((err) => {
          console.error('Error while refreshing:');
          console.error(err);
        });
    }
  }

  requestNextSong() {
    /*if (moment().isBefore(this.tokenExpiresAt)) {
      return this.nextSong();

    } else {
      return this.refreshAccessToken()
        .then((response) => {
          console.log('Refreshed access token because it has expired. Expired at: %s now is: %s',
            this.tokenExpiresAt.format('HH:mm:ss'), moment().format('HH:mm:ss'));

          this.credentials.accessToken = response.access_token;
          this.tokenExpiresAt = moment().add(response.expires_in, 'seconds');

          return this.nextSong();
        })
        .catch((err) => {
          console.error('Error while refreshing:');
          console.error(err);
        });
    } MIGHT CAUSE A DOUBLE REQUEST FOR TOKEN, TAKING OUT FOR NOW*/
    return this.postRequest(nextSongEndpoint);
  }

  requestPreviousSong() {
    return this.postRequest(previousSongEndpoint);
  }

  requestPauseSong() {
    return this.putRequest(pauseSongEndpoint);
  }

  requestPlaySong() {
    return this.putRequest(playSongEndpoint);
  }

  getSpotifyData() {
    let options = {
      url: apiEndpoint,
      headers: {'Authorization': 'Bearer ' + this.credentials.accessToken},
      json: true
    };

    return request.get(options);
  }

  postRequest(postEndpoint) {
    let options = {
      url: postEndpoint,
      headers: {'Authorization': 'Bearer ' + this.credentials.accessToken},
      json: true
    };
    return request.post(options);
  }

  putRequest(postEndpoint) {
    let options = {
      url: postEndpoint,
      headers: {'Authorization': 'Bearer ' + this.credentials.accessToken},
      json: true
    };
    return request.put(options);
  }

  refreshAccessToken() {
    let client_id = this.credentials.clientID;
    let client_secret = this.credentials.clientSecret;
    let options = {
      url: tokenRefreshEndpoint,
      headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
      form: {
        grant_type: 'refresh_token',
        refresh_token: this.credentials.refreshToken
      },
      json: true
    };

    return request.post(options);
  }
};

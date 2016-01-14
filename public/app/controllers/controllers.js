'use strict';

(function() {
  angular
    .module('tweetBoxApp')
    .controller('MainController', ['$scope', 'Spotify', 'Twitter', 'Playlist', 'UserData', '$interval', '$cookies', '$http',
      function(
        $scope, Spotify, Twitter, Playlist, UserData, $interval, $cookies, $http
      ) {
        var vm = this;
        vm.tracks = Playlist.trackData;
        vm.auth = Twitter.authval;
        Twitter.authCheck();
        vm.previewPlay = {};

        vm.newPlaylist = function() {
          Twitter.new();
          Playlist.new();
          Twitter.fetch();
        };
        vm.searchAll = function(searchText) {
          Spotify.searchAll(searchText).then(function(data) {});
        };
        vm.twitterfetch = function() {
          Twitter.fetch();
          UserData.setSpotifyToken();
          // $interval(Twitter.fetch, 63000);
        };
        vm.changeSong = function(track, subtrack) {
          Playlist.sub(track, subtrack);
        };

        vm.openauth = function() {
          $('#modal1').openModal();
        };

        vm.spotifyAuth = function() {
          UserData.spotifyLogin();
        };
        vm.twitterAuth = function() {
          UserData.twitterLogin();
        };
        vm.vote = function(track, value) {
          Playlist.scoreChange(track, value);
        };
        vm.searchSpotify = function(searchString) {
          Spotify.searchAll(searchString).then(function(data) {
            console.log(data.tracks.items);
            for (var track of data.tracks.items) {
              track.playState = 'play_circle_outline';
              track.previewUrl = track.preview_url;
            };
            vm.searchResults = data.tracks.items;
          });
        };
        vm.addSong = function(trackObj) {
          vm.searchString = '';
          vm.searchResults = {};
          Playlist.addSearch([trackObj]);
        };
        vm.removeSong = function(trackObj) {
          Playlist.remove(trackObj);
        };
        vm.clearSearch = function() {
          vm.searchString = '';
          vm.searchResults = {};
        };
        vm.playTrack = function(track) {
          if (!vm.previewPlay[track.name]) {
            vm.previewPlay[track.name] = new Audio(track.previewUrl);
            vm.previewPlay[track.name].play();
            track.playState = 'pause_circle_outline';
            setTimeout(function() {
              if (track.playState === 'pause_circle_outline') {
                track.playState = 'play_circle_outline';
              };
            }, 30000);
          } else {
            vm.previewPlay[track.name].pause();
            vm.previewPlay[track.name] = null;
            track.playState = 'play_circle_outline';
          }
        };

        vm.getCurrentUser = function() {
          Spotify.getCurrentUser();
          console.log(Spotify.getCurrentUser());
        };

        vm.createPlaylist = function() {
              console.log(Spotify);
              var trackIDs = [];
              var tracks = Playlist.trackData;
              for (var track of tracks) {
                trackIDs.push('spotify:track:' + track.id);
              }
              console.log(trackIDs);

              var trackIdString = trackIDs.join('');
              console.log(trackIdString);

              Spotify.getCurrentUser()
              .then(function(data) {
                console.log('#######');
                console.log(data);
                var userId = data.id;
                console.log(data.id);
                var playlistId = 'tweetBox';

                Spotify
                .createPlaylist(data.id, {name: playlistId})
                .then(function(data) {
                  console.log('PLAYLIST DATA', data);
                  console.log('https://api.spotify.com/v1/users/' + userId + '/playlists/' + data.id + '/tracks?position=0&uris=' + trackIdString.toString());
                  $http({
                    url: 'https://api.spotify.com/v1/users/' + userId + '/playlists/' + data.id + '/tracks?position=0&uris=' + trackIdString.toString(),
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json;',
                      'Authorization': 'Bearer ' + localStorage.getItem('spotify-token')
                    },
                  });
                });
                console.log(Spotify);
              }, function(error) {
                console.log('ERROR');
              });
            }
      }
    ]);
})();

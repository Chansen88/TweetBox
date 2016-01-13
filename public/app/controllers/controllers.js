'use strict';

(function() {
  angular
    .module('tweetBoxApp')
    .controller('MainController', ['$scope', 'Spotify', 'Twitter', 'Playlist', 'UserData', '$interval', '$cookies',
      function(
        $scope, Spotify, Twitter, Playlist, UserData, $interval, $cookies
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
          var trackIDs = [];
          for (var track of vm.tracks) {
            trackIDs.push(track.id);
          }
          console.log(trackIDs);

          Spotify.getCurrentUser().then(function(data) {
            console.log('#######');
            console.log(data);
            var userID = data.id;
            var playlist_id = 'TweetBOX ' + moment().format('ll');
            Spotify
            .createPlaylist(data.id, {name: playlist_id})
            .then(function(data) {
              console.log('Created playlist' + vm.tracks);
              Spotify.addPlaylistTracks(vm.userID, playlist_id, trackIDs);
            });
            console.log(Spotify);
          }, function(error) {
              console.log('ERROR');
          });

        };
      }
    ]);
})();

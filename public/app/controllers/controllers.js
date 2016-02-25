'use strict';

(function () {
  angular
    .module('tweetBoxApp')
    .controller('MainController', ['$scope', 'Spotify', 'Twitter', 'Playlist', 'UserData', '$interval', '$http',
      function (
        $scope, Spotify, Twitter, Playlist, UserData, $interval, $http
      ) {
        var vm = this;
        vm.tracks = Playlist.trackData;
        vm.auth = Twitter.authval;
        Twitter.authval[0] = true;
        Twitter.authCheck();
        vm.previewPlay = {};
        vm.modalType = 'spotifyPlaylist';

        vm.newPlaylist = function () {
          Twitter.new();
          Playlist.new();
          Twitter.fetch();
        };

        vm.searchAll = function (searchText) {
          Spotify.searchAll(searchText).then(function (data) {
            console.log(data);
          });
        };

        vm.twitterfetch = function () {
          if (Twitter.authval[0] == false) {
            vm.modalType = 'twitterLogin';
            $('#modal-custom').openModal();
          } else {
            Twitter.fetch();
            UserData.setSpotifyToken();
          }

          // $interval(Twitter.fetch, 63000);
        };

        vm.changeSong = function (track, subtrack) {
          Playlist.sub(track, subtrack);
        };

        vm.openauth = function () {
          vm.modalType = 'twitterLogin';
          $('#modal-custom').openModal();
        };

        vm.spotifyAuth = function () {
          UserData.spotifyLogin().then(function (data) {
            console.log(data);
          });
        };

        vm.twitterAuth = function () {
          UserData.twitterLogin();
        };

        vm.vote = function (track, value) {
          Playlist.scoreChange(track, value);
        };

        vm.searchSpotify = function (searchString) {
          Spotify.searchAll(searchString).then(function (data) {
            console.log(data.tracks.items);
            for (var track of data.tracks.items) {
              track.playState = 'play_circle_outline';
              track.previewUrl = track.preview_url;
            };

            vm.searchResults = data.tracks.items;
          });
        };

        vm.addSong = function (trackObj) {
          vm.searchString = '';
          vm.searchResults = {};
          Playlist.addSearch([trackObj]);
        };

        vm.removeSong = function (trackObj) {
          Playlist.remove(trackObj);
        };

        vm.clearSearch = function () {
          vm.searchString = '';
          vm.searchResults = {};
        };

        vm.playTrack = function (track) {
          if (!vm.previewPlay[track.name]) {
            vm.previewPlay[track.name] = new Audio(track.previewUrl);
            vm.previewPlay[track.name].play();
            track.playState = 'pause_circle_outline';
            setTimeout(function () {
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

        vm.getCurrentUser = function () {
          Spotify.getCurrentUser();
        };

        vm.openPlaylistCreate = function () {
          UserData.setSpotifyToken();
          Spotify.getCurrentUser()
            .then(function (data) {
              vm.modalType = 'spotifyPlaylist';
              console.log(vm.modalType);
              console.log('spotifyPlaylist');
              $('#modal-custom').openModal();
            }, function (error) {

              console.log(vm.modalType);
              vm.modalType = 'spotifyLogin';
              $('#modal-custom').openModal();
            });
        };

        vm.createPlaylist = function (name) {
          if (name == undefined) name = 'TweetBOX';
          var trackIDs = [];
          var tracks = Playlist.trackData;
          for (var track of tracks) {
            trackIDs.push('spotify:track:' + track.id);
          }

          var trackIdString = trackIDs.join(',');

          Spotify.getCurrentUser()
          .then(function (data) {
            var userId = data.id;

            Spotify
            .createPlaylist(data.id, { name: name })
            .then(function (data) {
              $http({
                url: 'https://api.spotify.com/v1/users/' + userId + '/playlists/' + data.id + '/tracks?position=0&uris=' + trackIdString.toString(),
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + localStorage.getItem('spotify-token'),
                },
              });
            });

            vm.playlistName = '';
          }, function (error) {

            console.log('ERROR');
          });

          $('#modal-custom').closeModal();
        };

        vm.modalCloseCheck = function () {
          switch (vm.modalType) {
            case 'twitterLogin':
              $('#modal-custom').closeModal();
              break;
            case 'spotifyLogin':
              $('#modal-custom').closeModal();
              vm.openPlaylistCreate();
              break;
            default:
              $('#modal-custom').closeModal();
              break;
          }
        };
      },
    ]);
})();

'use strict';

(function() {
  angular
    .module('tweetBoxApp')
    .controller('MainController', ['$scope', 'Spotify', 'Twitter', 'Playlist', 'UserData', '$interval',
      function(
        $scope, Spotify, Twitter, Playlist, UserData, $interval
      ) {
        var vm = this;
        vm.tracks = Playlist.trackData;
        vm.auth = Twitter.authval;
        Twitter.authCheck();
        vm.previewPlay = {};

        vm.ngPopupOption = {
          modelName: "myNgPopup",
          width: 400,
          height: 300,
          hasTitleBar:true,
          template: '<img src="http://www.omgubuntu.co.uk/wp-content/uploads/2014/03/Forever-Shady-S.jpg" style="width:100%;height:100%;">',
          title: "Awesome Dialog",
          resizable:true,
          draggable: true,
          position: { top : 250, left : 300},
        };

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
        vm.createPlaylist = function() {
          var trackIDs = [];
          for (var track of vm.tracks) {
            trackIDs.push(track.id);
          }
          Spotify
          .createPlaylist(trackIDs, {name: 'TweetBOX ' + moment().format('ll')})
          .then(function(data) {
            console.log('Created playlist' + vm.tracks);
          });
        };
      }
    ]);
})();

(function() {
  angular
    .module('tweetBoxApp')
    .controller('MainController',
      ['$scope', 'Spotify', 'Twitter', 'Playlist', 'UserData', '$interval',
        function(
          $scope, Spotify, Twitter, Playlist, UserData, $interval
        ) {
          var vm = this;
          vm.trackID = Playlist.parsedTrack;
          vm.tracks = Playlist.trackData;
          vm.auth = Twitter.authval;
          Twitter.authCheck();

          vm.newPlaylist = function() {
            Twitter.new();
            Playlist.new();
            Twitter.fetch();
          };
          vm.searchAll = function(searchText) {
            Spotify.searchAll(searchText).then(function(data) {
            });
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
            console.log(track);
            console.log(track.preview_url);
            var audio = new Audio(track.preview_url);
            audio.play();
          };
        }]);
})();

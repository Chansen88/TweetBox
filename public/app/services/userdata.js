(function() {
  angular
  .module('tweetBoxApp')
  .factory('UserData', ['$http', '$location', '$window', 'Spotify',
    function($http, $location, $window, Spotify) {
      var w = 400;
      var h = 500;
      var left = (screen.width / 2) - (w / 2);
      var top = (screen.height / 2) - (h / 2);
      var UserData = {};

      UserData.twitterLogin = function() {
        var authWindow = window.open(
          '/twitterauth',
          'Spotify',
          'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,width='
            + w + ',height=' + h + ',top=' + top + ',left=' + left
        );
        $window.addEventListener('storage', UserData.storageChanged, false);
        console.log('called Function');
      };

      UserData.spotifyLogin = function() {
        var authWindow = window.open(
          '/api/spotifyauth',
          'Spotify',
          'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,width='
            + w + ',height=' + h + ',top=' + top + ',left=' + left
        );
        $window.addEventListener('storage', UserData.storageChanged, false);
      };

      UserData.setSpotifyToken = function() {
        $http({
          method: 'GET',
          url: '/api/spotifytoken/',
        }).then(function successCallback(response) {
          var storedToken = response.data;
          localStorage.setItem('spotify-token', storedToken);
          Spotify.setAuthToken(storedToken);
        }, function errCallback(response) {

          console.log('Error while fetching spotify token');
        });
      };

      return UserData;
    },
  ]);
})();

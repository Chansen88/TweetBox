(function() {
  angular
  .module('tweetBoxApp')
  .factory('UserData', ['$http', '$location', '$cookies', '$window',
    function($http, $location, $cookies, $window) {
      var w = 400;
      var h = 500;
      var left = (screen.width / 2) - (w / 2);
      var top = (screen.height / 2) - (h / 2);
      var UserData = {};
      UserData.user = [];

      var temp = $cookies.get('user');
      if (temp) {
        UserData.user.push(temp);
        console.log(UserData);
      }
      var favoriteCookie = $cookies.get('myFavorite');

      UserData.addUser = function(obj) {
        $http({
          method: 'POST',
          dataType: 'JSONP',
          url: '/api/users/signup',
          data: obj
        }).then(function successCallback(response) {
          if (response.data) {
            UserData.user.push(response.data);
            $cookies.put('user', response.data);
            $location.path('/account');
          } else {
            console.log('FAILED TO CREATE USER');
            $location.path('/signup');
          }
        });
      };

      UserData.signInUser = function(obj) {
        $http({
          method: 'POST',
          dataType: 'JSONP',
          url: '/api/users/login',
          data: obj
        }).then(function successCallback(response) {
          if (response.data) {
            UserData.user.push(response.data);
            $cookies.put('user', response.data);
            $location.path('/account');
          } else {
            //Set alert text to failed login
            console.log('FAILED TO LOGIN USER');
            $location.path('/login');
          }
        });
      };

      UserData.logout = function() {
        UserData.user = [];
        $cookies.delte('user');
      };

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
          '/spotifyauth',
          'Spotify',
          'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,width='
            + w + ',height=' + h + ',top=' + top + ',left=' + left
        );
        $window.addEventListener('storage', UserData.storageChanged, false);
      };

      return UserData;
    }]);
})();

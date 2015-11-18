(function() {
  angular
    .module('tweetBoxApp')
    .factory('Twitter', ['$http', 'Playlist', function($http, Playlist) {
      var Twitter = {};
      Twitter.tweets = [];
      Twitter.lastId = false;
      Twitter.authval = [true];

      Twitter.new = function() {
        $http({
          method: 'POST',
          dataType: 'JSONP',
          data: {count: '1'},
          url: '/api/twitterfetch',
          xhrFields: {
            withCredentials: true
          }
        }).then(function successCallback(response) {
          if (response.data.lastId) {
            Twitter.lastId = response.data.lastId;
          }
        }, function errorCallback(response) {
          console.log('Cant get these tweets man');
        });
      }

      Twitter.fetch = function() {
        console.log('twitterfetching');
        var data;
        if (Twitter.lastId) {
          data = {since_id: Twitter.lastId.toString()};
        } else {
          data = {count: '200'};
        }
        $http({
          method: 'POST',
          dataType: 'JSONP',
          data: data,
          url: '/api/twitterfetch',
          xhrFields: {
            withCredentials: true
          }
        }).then(function successCallback(response) {
          console.log(response);
          if (response.data.lastId) {
            Twitter.lastId = response.data.lastId;
            Twitter.tweets.push.apply(Twitter.tweets, response.data.tweets);
            Playlist.intake(response.data.tweets);
          }
        }, function errorCallback(response) {
          console.log('Cant get these tweets man');
        });
      };

      Twitter.authCheck = function() {
        console.log('checking auth');
        $http({
          method: 'POST',
          dataType: 'JSONP',
          url: '/api/authcheck',
          xhrFields: {
            withCredentials: true
          }
        }).then(function successCallback(response) {
          console.log(response);
          Twitter.authval[0] = response.data;

        }, function errorCallback(response) {
          Twitter.authval[0] = false;
        });
      };
      return Twitter;
    }]);
})();

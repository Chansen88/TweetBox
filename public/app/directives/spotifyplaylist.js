(function () {
  angular
    .module('tweetBoxApp')
    .directive('spotifyPlaylist', function () {
      return {
        restrict: 'E',
        replace: false,
        templateUrl: '/app/partials/spotifyplaylist.html',
      };
    });
})();


(function () {
  angular
    .module('tweetBoxApp')
    .directive('spotifyLogin', function () {
      return {
        restrict: 'E',
        replace: false,
        templateUrl: '/app/partials/spotifylogin.html',
      };
    });
})();

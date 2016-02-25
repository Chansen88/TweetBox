(function () {
  angular
    .module('tweetBoxApp')
    .directive('twitterLogin', function () {
      return {
        restrict: 'E',
        replace: false,
        templateUrl: '/app/partials/twitterlogin.html',
      };
    });
})();

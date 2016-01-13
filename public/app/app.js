(function() {
  angular
    .module('tweetBoxApp', [
      'ngRoute', 'spotify', 'ngCookies', 'ngResource', 'ngAnimate', 'ngPopup'
    ])
    .config(['$resourceProvider', '$routeProvider', '$locationProvider',
      function($resourceProvider, $routeProvider, $locationProvider) {
        // $resourceProvider.defaults.stripTrailingSlashes = false;
        $routeProvider
          .when('/', {
            templateUrl: '/app/partials/home.html',
            controller: 'MainController',
            controllerAs: 'vm'
          })
          .when('/close', {
            templateUrl: '/app/partials/callback.html',
            controller: 'CallBackController',
            controllerAs: 'vm'
          })
          .otherwise({
            redirectTo: '/'
          });
      }])
      .config(function(SpotifyProvider) {
        SpotifyProvider.setClientId('634a5dc250544991b91a8be0874b61be');
        SpotifyProvider.setRedirectUri(
          '/spotify/callback/'
        );
        SpotifyProvider.setScope('playlist-read-private');
      });
})();

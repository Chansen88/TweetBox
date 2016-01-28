(function() {
  angular
    .module('tweetBoxApp', [
      'ngRoute', 'spotify', 'ngResource', 'ngAnimate',
    ])
    .config(['$resourceProvider', '$routeProvider', '$locationProvider', 'SpotifyProvider',
      function($resourceProvider, $routeProvider, $locationProvider, SpotifyProvider) {
        // $resourceProvider.defaults.stripTrailingSlashes = false;
        SpotifyProvider.setClientId('634a5dc250544991b91a8be0874b61be');
        SpotifyProvider.setRedirectUri(
          '/spotifycallback'
        );
        SpotifyProvider.setScope('playlist-read-private');
        $routeProvider
          .when('/', {
            templateUrl: '/app/partials/home.html',
            controller: 'MainController',
            controllerAs: 'vm',
          })
          .when('/close', {
            templateUrl: '/app/partials/callback.html',
            controller: 'CallBackController',
            controllerAs: 'vm',
          })
          .otherwise({
            redirectTo: '/',
          });
      }, ]);
})();

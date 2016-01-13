(function() {
  angular
    .module('tweetBoxApp')
    .controller('CallBackController', ['$scope', '$window',
      function($scope, $window) {
        $scope.close = function() {
          $window.close();
        };
      }
    ]);
})();

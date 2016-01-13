(function() {
  angular
    .module('tweetBoxApp')
    .controller('CallBackController', ['$scope', '$window',
      function($scope, $window) {
        var vm = this;
        vm.close = function() {
          $window.close();
        };
      }
    ]);
})();

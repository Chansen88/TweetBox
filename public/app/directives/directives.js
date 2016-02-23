(function() {
  angular
    .module('tweetBoxApp')
    .directive('customPopover', function() {
      return {
        restrict: 'E',
        replace: true,
        template: '/app/partials/popover.html',
        link: function(scope, el, attrs) {
          console.log('running popover');
          $(el).popover({
            trigger: 'click',
            html: true,
            content: attrs.popoverData,
          });
        }
      };
    });
})();

var app = angular.module('bloggerApp');

//*** Directives ***
app.directive('navigation', function() {
    return {
      restrict: 'EA',
      //changed from /nav/navigation.html
      templateUrl: 'common/nav/navigationDirective.html',
      controller: 'NavigationController',
      controllerAs: 'vm'
    };
});

//*** Controller ***
//removed $state service snice it was not being used ; might need to add it later
app.controller('NavigationController', [ '$location', 'authentication', function NavigationController( $location, authentication) {
    var vm = this;
    vm.currentPath = $location.path();
    vm.currentUser = function()  {
        return authentication.currentUser();
    }
    vm.isLoggedIn = function() {
        return authentication.isLoggedIn();
    }
    vm.logout = function() {
      authentication.logout();
      $location.path('/');
    };
}]);

(function() {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$state', 'Authentication', 'menuService'];

  function HeaderController($scope, $state, Authentication, menuService) {
    var vm = this;

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = Authentication;
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');
    vm.search = search;

    // $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeSuccess() {
      // Collapsing the menu after navigation
      vm.isCollapsed = false;
    }

    function search() {
      var category = vm.category || 'all';
      var searchKey = vm.searchKey || '';

      $state.go('products.list', {
        category: category,
        searchKey: searchKey
      }, {
        reload: true
      });
    }

  }
}());

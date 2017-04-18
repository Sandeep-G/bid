(function() {
  'use strict';

  angular
    .module('sellings')
    .controller('SellingsListController', SellingsListController);

  SellingsListController.$inject = ['$scope', '$state', '$window', 'SellingsService'];

  function SellingsListController($scope, $state, $window, SellingsService) {
    var vm = this;
    var sellingsService = new SellingsService();

    if ($state.current.url === '/activeItems') {
      vm.products = SellingsService.listActiveItems();
    } else if ($state.current.url === '/soldItems') {
      vm.products = SellingsService.listSoldItems();
    } else if ($state.current.url === '/unsoldItems') {
      vm.products = SellingsService.listUnsoldItems();
    } else if ($state.current.url === '/listCanceledItems') {
      vm.products = SellingsService.listCanceledItems();
    }
  }

}());

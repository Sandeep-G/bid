(function () {
  'use strict';

  angular
    .module('buyings')
    .controller('BuyingsListController', BuyingsListController);

  BuyingsListController.$inject = ['$scope', '$state', '$window', 'BuyingsService'];

  function BuyingsListController($scope, $state, $window, BuyingsService) {
    var vm = this;

    if ($state.current.url === '/listWinning') {
      vm.products = BuyingsService.listWinning();
    } else if ($state.current.url === '/listLosing') {
      vm.products = BuyingsService.listLosing();
    } else if ($state.current.url === '/listWon') {
      vm.products = BuyingsService.listWon();
    } else if ($state.current.url === '/purchaseHistory') {
      vm.products = BuyingsService.listPurchased();
    }
  }
}());

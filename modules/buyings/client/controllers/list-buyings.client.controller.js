(function() {
  'use strict';

  angular
    .module('buyings')
    .controller('BuyingsListController', BuyingsListController);

  BuyingsListController.$inject = ['$scope', '$state', '$window', 'BuyingsService', 'PagerService'];

  function BuyingsListController($scope, $state, $window, BuyingsService, PagerService) {
    var vm = this;
    vm.pager = {};
    vm.setPage = setPage;

    initController();

    function initController() {
      if ($state.current.url === '/listWinning') {
        vm.products = BuyingsService.listWinning(onSuccessCallback);
      } else if ($state.current.url === '/listLosing') {
        vm.products = BuyingsService.listLosing(onSuccessCallback);
      } else if ($state.current.url === '/listWon') {
        vm.products = BuyingsService.listWon(onSuccessCallback);
      } else if ($state.current.url === '/purchaseHistory') {
        vm.products = BuyingsService.listPurchased(onSuccessCallback);
      }
    }

    function onSuccessCallback(data) {
      vm.products = data;
      setPage(1);
    }

    function setPage(page) {
      if (page < 1 || page > vm.pager.totalPages) {
        return;
      }

      // get pager object from service
      vm.pager = PagerService.getPager(vm.products.length, page, 6);

      // get current page of items
      vm.items = vm.products.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
    }
  }

}());

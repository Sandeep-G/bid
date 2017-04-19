(function() {
  'use strict';

  angular
    .module('buyings')
    .controller('BuyingsListController', BuyingsListController);

  BuyingsListController.$inject = ['$scope', '$state', '$window', 'Authentication', 'BuyingsService', 'PagerService'];

  function BuyingsListController($scope, $state, $window, Authentication, BuyingsService, PagerService) {
    var vm = this;
    vm.authentication = Authentication;
    vm.pager = {};
    vm.setPage = setPage;

    initController();
    function initController() {
      vm.isMyBid = true;
      vm.isSold = false;
      vm.isOver = false;
      if ($state.current.url === '/listWinning') {
        vm.header = 'My Bid : Winning';
        vm.products = BuyingsService.listWinning(onSuccessCallback);
      } else if ($state.current.url === '/listLosing') {
        vm.header = 'My Bid : Losing';
        vm.isMyBid = false;
        vm.products = BuyingsService.listLosing(onSuccessCallback);
      } else if ($state.current.url === '/listWon') {
        vm.header = 'My Bid : Won';
        vm.isOver = true;
        vm.products = BuyingsService.listWon(onSuccessCallback);
      } else if ($state.current.url === '/purchaseHistory') {
        vm.header = 'Purchase History';
        vm.isSold = true;
        vm.isOver = true;
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

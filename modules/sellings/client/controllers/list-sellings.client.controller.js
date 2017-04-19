(function() {
  'use strict';

  angular
    .module('sellings')
    .controller('SellingsListController', SellingsListController);

  SellingsListController.$inject = ['$scope', '$state', '$window', 'SellingsService', 'PagerService'];

  function SellingsListController($scope, $state, $window, SellingsService, PagerService) {
    var vm = this;
    vm.pager = {};
    vm.setPage = setPage;

    initController();

    function initController() {
      if ($state.current.url === '/activeItems') {
        vm.products = SellingsService.listActiveItems(onSuccessCallback);
      } else if ($state.current.url === '/soldItems') {
        vm.products = SellingsService.listSoldItems(onSuccessCallback);
      } else if ($state.current.url === '/unsoldItems') {
        vm.products = SellingsService.listUnsoldItems(onSuccessCallback);
      } else if ($state.current.url === '/listCanceledItems') {
        vm.products = SellingsService.listCanceledItems(onSuccessCallback);
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

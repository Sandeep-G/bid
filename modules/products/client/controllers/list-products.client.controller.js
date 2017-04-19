(function() {
  'use strict';

  angular
    .module('products')
    .controller('ProductsListController', ProductsListController);

  ProductsListController.$inject = ['$scope', '$state', '$stateParams', 'ProductsService', 'PagerService'];

  function ProductsListController($scope, $state, $stateParams, ProductsService, PagerService) {
    var vm = this;
    vm.pager = {};
    vm.setPage = setPage;

    initController();

    function initController() {
      var params = {
        category: $stateParams.category,
        searchKey: $stateParams.searchKey
      };
      vm.products = ProductsService.query(params, function(data) {
        vm.products = data;
        setPage(1);
      });
    }

    function setPage(page) {
      if (page < 1 || page > vm.pager.totalPages) {
        return;
      }

      // get pager object from service
      vm.pager = PagerService.getPager(vm.products.length, page, 12);

      // get current page of items
      vm.items = vm.products.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
    }
  }
}());

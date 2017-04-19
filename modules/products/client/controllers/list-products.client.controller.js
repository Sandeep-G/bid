(function () {
  'use strict';

  angular
    .module('products')
    .controller('ProductsListController', ProductsListController);

  ProductsListController.$inject = ['$scope', '$state', '$stateParams', 'ProductsService'];

  function ProductsListController($scope, $state, $stateParams, ProductsService) {
    var vm = this;
    var params = {
      category: $stateParams.category,
      searchKey: $stateParams.searchKey
    };
    vm.products = ProductsService.query(params);
  }
}());

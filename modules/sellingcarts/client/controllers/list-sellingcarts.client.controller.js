(function () {
  'use strict';

  angular
    .module('sellingcarts')
    .controller('SellingcartsListController', SellingcartsListController);

  SellingcartsListController.$inject = ['SellingcartsService'];

  function SellingcartsListController(SellingcartsService) {
    var vm = this;

    vm.sellingcarts = SellingcartsService.query();
  }
}());

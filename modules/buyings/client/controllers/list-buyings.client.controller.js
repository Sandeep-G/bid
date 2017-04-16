(function () {
  'use strict';

  angular
    .module('buyings')
    .controller('BuyingsListController', BuyingsListController);

  BuyingsListController.$inject = ['BuyingsService'];

  function BuyingsListController(BuyingsService) {
    var vm = this;

    vm.buyings = BuyingsService.listWinning();
  }
}());

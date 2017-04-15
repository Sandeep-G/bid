(function () {
  'use strict';

  angular
    .module('sellings')
    .controller('SellingsListController', SellingsListController);

  SellingsListController.$inject = ['SellingsService'];

  function SellingsListController(SellingsService) {
    var vm = this;

    vm.sellings = SellingsService.query();
  }
}());

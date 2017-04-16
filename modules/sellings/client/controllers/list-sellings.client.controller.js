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
      sellingsService.$listActiveItems().$promise.then(function(selling) {
        vm.selling;
      });
    }
  }

}());

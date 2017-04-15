(function() {
  'use strict';

  // Sellings controller
  angular
    .module('sellings')
    .controller('SellingsController', SellingsController);

  SellingsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'sellingResolve'];

  function SellingsController($scope, $state, $window, Authentication, selling) {
    var vm = this;

    vm.authentication = Authentication;
    vm.selling = selling;

    vm.selling.name = 'Test';
    vm.selling.startingBid = 30;
    vm.selling.bidIncrement = 1;
    vm.selling.quantity = 1;
    vm.selling.category = 'category';
    vm.selling.location = 'Dallas';
    vm.selling.endsAt = new Date();

    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Selling
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.selling.$remove($state.go('sellings.list'));
      }
    }

    // Save Selling
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.sellingForm');
        return false;
      }

      // TODO: move create/update logic to service
      vm.selling.$save(successCallback, errorCallback);

      function successCallback(res) {
        $state.go('products.view', {
          productId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());

(function () {
  'use strict';

  // Buyings controller
  angular
    .module('buyings')
    .controller('BuyingsController', BuyingsController);

  BuyingsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'buyingResolve'];

  function BuyingsController ($scope, $state, $window, Authentication, buying) {
    var vm = this;

    vm.authentication = Authentication;
    vm.buying = buying;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Buying
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.buying.$remove($state.go('buyings.list'));
      }
    }

    // Save Buying
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.buyingForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.buying._id) {
        vm.buying.$update(successCallback, errorCallback);
      } else {
        vm.buying.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('buyings.view', {
          buyingId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());

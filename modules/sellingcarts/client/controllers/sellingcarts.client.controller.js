(function () {
  'use strict';

  // Sellingcarts controller
  angular
    .module('sellingcarts')
    .controller('SellingcartsController', SellingcartsController);

  SellingcartsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'sellingcartResolve'];

  function SellingcartsController ($scope, $state, $window, Authentication, sellingcart) {
    var vm = this;

    vm.authentication = Authentication;
    vm.sellingcart = sellingcart;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Sellingcart
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.sellingcart.$remove($state.go('sellingcarts.list'));
      }
    }

    // Save Sellingcart
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.sellingcartForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.sellingcart._id) {
        vm.sellingcart.$update(successCallback, errorCallback);
      } else {
        vm.sellingcart.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('sellingcarts.view', {
          sellingcartId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());

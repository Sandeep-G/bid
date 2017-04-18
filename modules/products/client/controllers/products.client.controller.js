(function() {
  'use strict';

  // Products controller
  angular
    .module('products')
    .controller('ProductsController', ProductsController);

  ProductsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'productResolve', 'Upload', 'Notification'];

  function ProductsController($scope, $state, $window, Authentication, product, Upload, Notification) {
    var vm = this;

    vm.authentication = Authentication;
    vm.product = product;
    vm.error = null;
    vm.form = {};
    vm.fileSelected = false;
    vm.remove = remove;
    vm.save = save;

    // TODO Remove auto fill
    if (vm.product === undefined || vm.product === null || vm.product.name === undefined || vm.product.name === '') {
      vm.product.name = 'Test';
      vm.product.startingBid = 30;
      vm.product.bidIncrement = 1;
      vm.product.quantity = 1;
      vm.product.category = 'category';
      vm.product.location = 'Dallas';
      vm.product.endsAt = new Date();
    }

    vm.bidItem = bidItem;
    if (vm.product.currentBid === undefined || vm.product.currentBid === null)
      vm.minBid = vm.product.startingBid;
    else
      vm.minBid = vm.product.currentBid.amount + vm.product.bidIncrement;
    vm.newBid = vm.minBid;

    // Remove existing Product
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.product.$remove($state.go('products.list'));
      }
    }

    function bidItem() {
      vm.product.$bid({
        amount: vm.newBid
      });
    }

    // Save Product
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.productForm');
        return false;
      }

      console.log('IMAGE URL');
      console.log(vm.product.imageURL);

      // TODO: move create/update logic to service
      if (vm.product._id) {
        vm.product.$update(successCallback, errorCallback);
      } else {
        vm.product.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('products.view', {
          productId: res._id
        });
        vm.fileSelected = false;
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());

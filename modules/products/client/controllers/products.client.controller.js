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
    vm.edit = edit;

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

    vm.makeBid = makeBid;
    if (vm.product.currentBid === undefined || vm.product.currentBid === null)
      vm.minBid = vm.product.startingBid;
    else
      vm.minBid = vm.product.currentBid.amount + vm.product.bidIncrement;
    vm.newBid = vm.minBid;

    vm.product.endsAt = new Date(vm.product.endsAt);
    vm.isActive = vm.product.endsAt > new Date() && !vm.product.canceled && !vm.product.sold;
    vm.isAdmin = false;
    var roles = vm.authentication.user.roles;
    for (var i = 0; i < roles.length; i++) {
      if (roles[i] === 'admin')
        vm.isAdmin = true;
    }

    // Remove existing Product
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.product.$remove($state.go('products.list'));
      }
    }

    function edit() {
      $state.go('products.edit', {
        productId: vm.product._id
      });
    }

    function makeBid() {
      vm.product.$bid({
        amount: vm.newBid
      }, function(res) {
        Notification.success('Wohoo! Bid placed successfully!');
      }, function(res) {
        Notification.error('Oops! Failed to bid!');
      });
    }

    function makePayment() {
      vm.product.paid = true;
      vm.product.$update(successCallback, errorCallback);
    }

    // Save Product
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.productForm');
        return false;
      }

      console.log('IMAGE URL');
      console.log(vm.product.imageURL);

      console.log(vm.product);

      // TODO: move create/update logic to service
      if (vm.product._id) {
        vm.product.$update({
          productId: vm.product._id
        }, successCallback, errorCallback);
      } else {
        vm.product.$save(successCallback, errorCallback);
      }
    }

    function successCallback(res) {
      $state.go('products.view', {
        productId: res._id
      });
    }

    function errorCallback(res) {
      vm.error = res.data.message;
    }
  }
}());

// Sellingcarts service used to communicate Sellingcarts REST endpoints
(function () {
  'use strict';

  angular
    .module('sellingcarts')
    .factory('SellingcartsService', SellingcartsService);

  SellingcartsService.$inject = ['$resource'];

  function SellingcartsService($resource) {
    return $resource('api/sellingcarts/:sellingcartId', {
      sellingcartId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

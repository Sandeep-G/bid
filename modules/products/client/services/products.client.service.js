// Products service used to communicate Products REST endpoints
(function() {
  'use strict';

  angular
    .module('products')
    .factory('ProductsService', ProductsService);

  ProductsService.$inject = ['$resource'];

  function ProductsService($resource) {
    return $resource('/api/products/:productId', {
      productId: '@_id'
    }, {
      update: {
        method: 'PUT',
        url: '/api/products/:productId'
      }, save: {
        method: 'POST',
        url: '/api/products'
      }, bid: {
        method: 'PUT',
        url: '/api/products/:productId/bid'
      }, search: {
        method: 'POST',
        url: '/api/products/search'
      }
    });
  }
}());

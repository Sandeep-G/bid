// Buyings service used to communicate Buyings REST endpoints
(function () {
  'use strict';

  angular
    .module('buyings')
    .factory('BuyingsService', BuyingsService);

  BuyingsService.$inject = ['$resource'];

  function BuyingsService($resource) {
    return $resource('api/buyings/:buyingId', {
      buyingId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

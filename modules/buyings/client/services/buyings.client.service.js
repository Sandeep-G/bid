// Buyings service used to communicate Buyings REST endpoints
(function() {
  'use strict';

  angular
    .module('buyings')
    .factory('BuyingsService', BuyingsService);

  BuyingsService.$inject = ['$resource'];

  function BuyingsService($resource) {
    return $resource('/api/buyings/:buyingId', {
      buyingId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      listWinning: {
        url: '/api/buyings/listWinning',
        isArray: true,
        method: 'GET'
      },
      listLosing: {
        url: '/api/buyings/listLosing',
        isArray: true,
        method: 'GET'
      },
      listWon: {
        url: '/api/buyings/listWon',
        isArray: true,
        method: 'GET'
      },
      listPurchased: {
        url: '/api/buyings/listPurchased',
        isArray: true,
        method: 'GET'
      }
    });
  }
}());

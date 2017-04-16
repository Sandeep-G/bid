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
        method: 'GET'
      },
      listLosing: {
        url: '/api/buyings/listLosing',
        method: 'GET'
      },
      listWon: {
        url: '/api/buyings/listWon',
        method: 'GET'
      },
      listPurchased: {
        url: '/api/buyings/listPurchased',
        method: 'GET'
      }
    });
  }
}());

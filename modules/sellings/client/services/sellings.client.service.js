// Sellings service used to communicate Sellings REST endpoints
(function() {
  'use strict';

  angular
    .module('sellings')
    .factory('SellingsService', SellingsService);

  SellingsService.$inject = ['$resource'];

  function SellingsService($resource) {
    return $resource('/api/sellings/:sellingId', {
      sellingId: '@_id'
    }, {
      update: {
        url: '/api/sellings',
        method: 'PUT'
      },
      save: {
        url: '/api/sellings/sellItem',
        method: 'PUT'
      },
      listActiveItems: {
        url: '/api/sellings/listActiveItems',
        isArray: true,
        method: 'GET'
      },
      listSoldItems: {
        url: '/api/sellings/listSoldItems',
        isArray: true,
        method: 'GET'
      },
      listUnsoldItems: {
        url: '/api/sellings/listUnsoldItems',
        isArray: true,
        method: 'GET'
      },
      listCanceledItems: {
        url: '/api/sellings/listCanceledItems',
        isArray: true,
        method: 'GET'
      }
    });
  }
}());

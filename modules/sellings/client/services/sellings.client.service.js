// Sellings service used to communicate Sellings REST endpoints
(function () {
  'use strict';

  angular
    .module('sellings')
    .factory('SellingsService', SellingsService);

  SellingsService.$inject = ['$resource'];

  function SellingsService($resource) {
    return $resource('api/sellings/:sellingId', {
      sellingId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

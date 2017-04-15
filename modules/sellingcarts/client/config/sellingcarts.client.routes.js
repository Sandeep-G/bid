(function () {
  'use strict';

  angular
    .module('sellingcarts')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('sellingcarts', {
        abstract: true,
        url: '/sellingcarts',
        template: '<ui-view/>'
      })
      .state('sellingcarts.list', {
        url: '',
        templateUrl: 'modules/sellingcarts/client/views/list-sellingcarts.client.view.html',
        controller: 'SellingcartsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Sellingcarts List'
        }
      })
      .state('sellingcarts.create', {
        url: '/create',
        templateUrl: 'modules/sellingcarts/client/views/form-sellingcart.client.view.html',
        controller: 'SellingcartsController',
        controllerAs: 'vm',
        resolve: {
          sellingcartResolve: newSellingcart
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Sellingcarts Create'
        }
      })
      .state('sellingcarts.edit', {
        url: '/:sellingcartId/edit',
        templateUrl: 'modules/sellingcarts/client/views/form-sellingcart.client.view.html',
        controller: 'SellingcartsController',
        controllerAs: 'vm',
        resolve: {
          sellingcartResolve: getSellingcart
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Sellingcart {{ sellingcartResolve.name }}'
        }
      })
      .state('sellingcarts.view', {
        url: '/:sellingcartId',
        templateUrl: 'modules/sellingcarts/client/views/view-sellingcart.client.view.html',
        controller: 'SellingcartsController',
        controllerAs: 'vm',
        resolve: {
          sellingcartResolve: getSellingcart
        },
        data: {
          pageTitle: 'Sellingcart {{ sellingcartResolve.name }}'
        }
      });
  }

  getSellingcart.$inject = ['$stateParams', 'SellingcartsService'];

  function getSellingcart($stateParams, SellingcartsService) {
    return SellingcartsService.get({
      sellingcartId: $stateParams.sellingcartId
    }).$promise;
  }

  newSellingcart.$inject = ['SellingcartsService'];

  function newSellingcart(SellingcartsService) {
    return new SellingcartsService();
  }
}());

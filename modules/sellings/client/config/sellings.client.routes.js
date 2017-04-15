(function () {
  'use strict';

  angular
    .module('sellings')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('sellings', {
        abstract: true,
        url: '/sellings',
        template: '<ui-view/>'
      })
      .state('sellings.list', {
        url: '',
        templateUrl: 'modules/sellings/client/views/list-sellings.client.view.html',
        controller: 'SellingsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Sellings List'
        }
      })
      .state('sellings.sellItem', {
        url: '/create',
        templateUrl: 'modules/sellings/client/views/form-sell-item.client.view.html',
        controller: 'SellingsController',
        controllerAs: 'vm',
        resolve: {
          sellingResolve: newSelling
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Sell Item'
        }
      })
      .state('sellings.create', {
        url: '/create',
        templateUrl: 'modules/sellings/client/views/form-selling.client.view.html',
        controller: 'SellingsController',
        controllerAs: 'vm',
        resolve: {
          sellingResolve: newSelling
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Sellings Create'
        }
      })
      .state('sellings.edit', {
        url: '/:sellingId/edit',
        templateUrl: 'modules/sellings/client/views/form-selling.client.view.html',
        controller: 'SellingsController',
        controllerAs: 'vm',
        resolve: {
          sellingResolve: getSelling
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Selling {{ sellingResolve.name }}'
        }
      })
      .state('sellings.view', {
        url: '/:sellingId',
        templateUrl: 'modules/sellings/client/views/view-selling.client.view.html',
        controller: 'SellingsController',
        controllerAs: 'vm',
        resolve: {
          sellingResolve: getSelling
        },
        data: {
          pageTitle: 'Selling {{ sellingResolve.name }}'
        }
      });
  }

  getSelling.$inject = ['$stateParams', 'SellingsService'];

  function getSelling($stateParams, SellingsService) {
    return SellingsService.get({
      sellingId: $stateParams.sellingId
    }).$promise;
  }

  newSelling.$inject = ['SellingsService'];

  function newSelling(SellingsService) {
    return new SellingsService();
  }
}());

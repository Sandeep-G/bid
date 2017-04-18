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
      .state('sellings.listActiveItems', {
        url: '/activeItems',
        templateUrl: 'modules/sellings/client/views/list-sellings.client.view.html',
        controller: 'SellingsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Active Items'
        }
      })
      .state('sellings.listSoldItems', {
        url: '/soldItems',
        templateUrl: 'modules/sellings/client/views/list-sellings.client.view.html',
        controller: 'SellingsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Sold Items'
        }
      })
      .state('sellings.listUnsoldItems', {
        url: '/unsoldItems',
        templateUrl: 'modules/sellings/client/views/list-sellings.client.view.html',
        controller: 'SellingsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Unsold Items'
        }
      })
      .state('sellings.listCanceledItems', {
        url: '/canceledItems',
        templateUrl: 'modules/sellings/client/views/list-sellings.client.view.html',
        controller: 'SellingsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Canceled Items'
        }
      })
      .state('sellings.sellItem', {
        url: '/sellItem',
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

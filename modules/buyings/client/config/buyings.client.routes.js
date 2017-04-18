(function () {
  'use strict';

  angular
    .module('buyings')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('buyings', {
        abstract: true,
        url: '/buyings',
        template: '<ui-view/>'
      })
      .state('buyings.listWinningBids', {
        url: '/listWinning',
        templateUrl: 'modules/buyings/client/views/list-buyings.client.view.html',
        controller: 'BuyingsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Winning Bids'
        }
      })
      .state('buyings.listLosingBids', {
        url: '/listLosing',
        templateUrl: 'modules/buyings/client/views/list-buyings.client.view.html',
        controller: 'BuyingsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Losing Bids'
        }
      })
      .state('buyings.listWonBids', {
        url: '/listWon',
        templateUrl: 'modules/buyings/client/views/list-buyings.client.view.html',
        controller: 'BuyingsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Won Bids'
        }
      })
      .state('buyings.purchaseHistory', {
        url: '/purchaseHistory',
        templateUrl: 'modules/buyings/client/views/list-buyings.client.view.html',
        controller: 'BuyingsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Purchase History'
        }
      })
      .state('buyings.list', {
        url: '',
        templateUrl: 'modules/buyings/client/views/list-buyings.client.view.html',
        controller: 'BuyingsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Buyings List'
        }
      })
      .state('buyings.create', {
        url: '/create',
        templateUrl: 'modules/buyings/client/views/form-buying.client.view.html',
        controller: 'BuyingsController',
        controllerAs: 'vm',
        resolve: {
          buyingResolve: newBuying
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Buyings Create'
        }
      })
      .state('buyings.edit', {
        url: '/:buyingId/edit',
        templateUrl: 'modules/buyings/client/views/form-buying.client.view.html',
        controller: 'BuyingsController',
        controllerAs: 'vm',
        resolve: {
          buyingResolve: getBuying
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Buying {{ buyingResolve.name }}'
        }
      })
      .state('buyings.view', {
        url: '/:buyingId',
        templateUrl: 'modules/buyings/client/views/view-buying.client.view.html',
        controller: 'BuyingsController',
        controllerAs: 'vm',
        resolve: {
          buyingResolve: getBuying
        },
        data: {
          pageTitle: 'Buying {{ buyingResolve.name }}'
        }
      });
  }

  getBuying.$inject = ['$stateParams', 'BuyingsService'];

  function getBuying($stateParams, BuyingsService) {
    return BuyingsService.get({
      buyingId: $stateParams.buyingId
    }).$promise;
  }

  newBuying.$inject = ['BuyingsService'];

  function newBuying(BuyingsService) {
    return new BuyingsService();
  }
}());

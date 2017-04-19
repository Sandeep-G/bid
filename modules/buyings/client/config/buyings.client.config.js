(function () {
  'use strict';

  angular
    .module('buyings')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Buying',
      state: 'buyings',
      type: 'dropdown',
      roles: ['user', 'admin']
    });

    // Add the dropdown list winning bids
    menuService.addSubMenuItem('topbar', 'buyings', {
      title: 'Winning',
      state: 'buyings.listWinningBids',
      roles: ['user', 'admin']
    });

    // Add the dropdown list losing bids
    menuService.addSubMenuItem('topbar', 'buyings', {
      title: 'Losing',
      state: 'buyings.listLosingBids',
      roles: ['user', 'admin']
    });

    // Add the dropdown list won bids
    menuService.addSubMenuItem('topbar', 'buyings', {
      title: 'Won',
      state: 'buyings.listWonBids',
      roles: ['user', 'admin']
    });

    // Add the dropdown list purchase History
    menuService.addSubMenuItem('topbar', 'buyings', {
      title: 'Purchase History',
      state: 'buyings.purchaseHistory',
      roles: ['user', 'admin']
    });
  }
}());

(function () {
  'use strict';

  angular
    .module('sellings')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Selling',
      state: 'sellings',
      type: 'dropdown',
      roles: ['user', 'admin']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'sellings', {
      title: 'Sell Item',
      state: 'products.create',
      roles: ['user', 'admin']
    });

    // Add the dropdown list active items
    menuService.addSubMenuItem('topbar', 'sellings', {
      title: 'Active Items',
      state: 'sellings.listActiveItems',
      roles: ['user', 'admin']
    });

    // Add the dropdown sold items
    menuService.addSubMenuItem('topbar', 'sellings', {
      title: 'Sold Items',
      state: 'sellings.listSoldItems',
      roles: ['user', 'admin']
    });

    // Add the dropdown unsold items
    menuService.addSubMenuItem('topbar', 'sellings', {
      title: 'Unsold Items',
      state: 'sellings.listUnsoldItems',
      roles: ['user', 'admin']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'sellings', {
      title: 'Canceled Items',
      state: 'sellings.listCanceledItems',
      roles: ['user', 'admin']
    });

  }
}());

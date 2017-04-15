(function () {
  'use strict';

  angular
    .module('buyings')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Buyings',
      state: 'buyings',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'buyings', {
      title: 'List Buyings',
      state: 'buyings.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'buyings', {
      title: 'Create Buying',
      state: 'buyings.create',
      roles: ['user']
    });
  }
}());

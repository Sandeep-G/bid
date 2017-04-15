(function () {
  'use strict';

  angular
    .module('sellingcarts')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Sellingcarts',
      state: 'sellingcarts',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'sellingcarts', {
      title: 'List Sellingcarts',
      state: 'sellingcarts.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'sellingcarts', {
      title: 'Create Sellingcart',
      state: 'sellingcarts.create',
      roles: ['user']
    });
  }
}());

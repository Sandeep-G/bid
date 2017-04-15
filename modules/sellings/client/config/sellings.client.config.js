(function () {
  'use strict';

  angular
    .module('sellings')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Sellings',
      state: 'sellings',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'sellings', {
      title: 'Sell Item',
      state: 'sellings.sellItem',
      roles: ['user']
    });

  }
}());

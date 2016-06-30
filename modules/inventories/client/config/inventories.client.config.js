(function () {
  'use strict';

  angular
    .module('inventories')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Inventories',
      state: 'inventories',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'inventories', {
      title: 'List Inventories',
      state: 'inventories.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'inventories', {
      title: 'Create Inventory',
      state: 'inventories.create',
      roles: ['user']
    });
  }
})();

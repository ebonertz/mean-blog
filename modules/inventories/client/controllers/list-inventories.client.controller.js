(function () {
  'use strict';

  angular
    .module('inventories')
    .controller('InventoriesListController', InventoriesListController);

  InventoriesListController.$inject = ['InventoriesService'];

  function InventoriesListController(InventoriesService) {
    var vm = this;

    vm.inventories = InventoriesService.query();
  }
})();

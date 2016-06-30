//Inventories service used to communicate Inventories REST endpoints
(function () {
  'use strict';

  angular
    .module('inventories')
    .factory('InventoriesService', InventoriesService);

  InventoriesService.$inject = ['$resource'];

  function InventoriesService($resource) {
    return $resource('api/inventories/:inventoryId', {
      inventoryId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();

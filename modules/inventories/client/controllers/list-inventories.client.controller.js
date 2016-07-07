(function () {
  'use strict';
  var projectKey = "down-under";
  var token = "awrARTgYvsFNDoclnsWoV95btThUCleM";
  var baseURL = "https://api.sphere.io/$projectKey";
  var tokenHeader = "Authorization: Bearer $token";



  var inventories = angular.module('inventories');
  
  angular
    .module('inventories')
    .controller('InventoriesListController', InventoriesListController);

    inventories.controller('InventoriesListController',['$http', '$location', '$scope', function($http, $location, $scope) {
            console.log('InventoriesListController ran');
            $http.get('https://api.sphere.io/down-under/inventory?token=',
            {headers: { Authorization: 'Bearer awrARTgYvsFNDoclnsWoV95btThUCleM'}})
            .then(function successCallback(response){
              $scope.inventory = response.data.results;
              console.log(response);
              console.log($scope.inventory);


            });
      }]);

  InventoriesListController.$inject = ['InventoriesService'];

  function InventoriesListController(InventoriesService) {
    var vm = this;

    vm.inventories = InventoriesService.query();
  }






})();

(function () {
  'use strict';

  describe('Inventories Route Tests', function () {
    // Initialize global variables
    var $scope,
      InventoriesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _InventoriesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      InventoriesService = _InventoriesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('inventories');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/inventories');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          InventoriesController,
          mockInventory;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('inventories.view');
          $templateCache.put('modules/inventories/client/views/view-inventory.client.view.html', '');

          // create mock Inventory
          mockInventory = new InventoriesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Inventory Name'
          });

          //Initialize Controller
          InventoriesController = $controller('InventoriesController as vm', {
            $scope: $scope,
            inventoryResolve: mockInventory
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:inventoryId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.inventoryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            inventoryId: 1
          })).toEqual('/inventories/1');
        }));

        it('should attach an Inventory to the controller scope', function () {
          expect($scope.vm.inventory._id).toBe(mockInventory._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/inventories/client/views/view-inventory.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          InventoriesController,
          mockInventory;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('inventories.create');
          $templateCache.put('modules/inventories/client/views/form-inventory.client.view.html', '');

          // create mock Inventory
          mockInventory = new InventoriesService();

          //Initialize Controller
          InventoriesController = $controller('InventoriesController as vm', {
            $scope: $scope,
            inventoryResolve: mockInventory
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.inventoryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/inventories/create');
        }));

        it('should attach an Inventory to the controller scope', function () {
          expect($scope.vm.inventory._id).toBe(mockInventory._id);
          expect($scope.vm.inventory._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/inventories/client/views/form-inventory.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          InventoriesController,
          mockInventory;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('inventories.edit');
          $templateCache.put('modules/inventories/client/views/form-inventory.client.view.html', '');

          // create mock Inventory
          mockInventory = new InventoriesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Inventory Name'
          });

          //Initialize Controller
          InventoriesController = $controller('InventoriesController as vm', {
            $scope: $scope,
            inventoryResolve: mockInventory
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:inventoryId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.inventoryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            inventoryId: 1
          })).toEqual('/inventories/1/edit');
        }));

        it('should attach an Inventory to the controller scope', function () {
          expect($scope.vm.inventory._id).toBe(mockInventory._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/inventories/client/views/form-inventory.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();

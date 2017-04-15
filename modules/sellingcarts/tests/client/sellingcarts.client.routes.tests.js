(function () {
  'use strict';

  describe('Sellingcarts Route Tests', function () {
    // Initialize global variables
    var $scope,
      SellingcartsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SellingcartsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SellingcartsService = _SellingcartsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('sellingcarts');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/sellingcarts');
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
          SellingcartsController,
          mockSellingcart;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('sellingcarts.view');
          $templateCache.put('modules/sellingcarts/client/views/view-sellingcart.client.view.html', '');

          // create mock Sellingcart
          mockSellingcart = new SellingcartsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Sellingcart Name'
          });

          // Initialize Controller
          SellingcartsController = $controller('SellingcartsController as vm', {
            $scope: $scope,
            sellingcartResolve: mockSellingcart
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:sellingcartId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.sellingcartResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            sellingcartId: 1
          })).toEqual('/sellingcarts/1');
        }));

        it('should attach an Sellingcart to the controller scope', function () {
          expect($scope.vm.sellingcart._id).toBe(mockSellingcart._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/sellingcarts/client/views/view-sellingcart.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SellingcartsController,
          mockSellingcart;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('sellingcarts.create');
          $templateCache.put('modules/sellingcarts/client/views/form-sellingcart.client.view.html', '');

          // create mock Sellingcart
          mockSellingcart = new SellingcartsService();

          // Initialize Controller
          SellingcartsController = $controller('SellingcartsController as vm', {
            $scope: $scope,
            sellingcartResolve: mockSellingcart
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.sellingcartResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/sellingcarts/create');
        }));

        it('should attach an Sellingcart to the controller scope', function () {
          expect($scope.vm.sellingcart._id).toBe(mockSellingcart._id);
          expect($scope.vm.sellingcart._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/sellingcarts/client/views/form-sellingcart.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SellingcartsController,
          mockSellingcart;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('sellingcarts.edit');
          $templateCache.put('modules/sellingcarts/client/views/form-sellingcart.client.view.html', '');

          // create mock Sellingcart
          mockSellingcart = new SellingcartsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Sellingcart Name'
          });

          // Initialize Controller
          SellingcartsController = $controller('SellingcartsController as vm', {
            $scope: $scope,
            sellingcartResolve: mockSellingcart
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:sellingcartId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.sellingcartResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            sellingcartId: 1
          })).toEqual('/sellingcarts/1/edit');
        }));

        it('should attach an Sellingcart to the controller scope', function () {
          expect($scope.vm.sellingcart._id).toBe(mockSellingcart._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/sellingcarts/client/views/form-sellingcart.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());

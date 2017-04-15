(function () {
  'use strict';

  describe('Buyings Route Tests', function () {
    // Initialize global variables
    var $scope,
      BuyingsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _BuyingsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      BuyingsService = _BuyingsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('buyings');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/buyings');
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
          BuyingsController,
          mockBuying;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('buyings.view');
          $templateCache.put('modules/buyings/client/views/view-buying.client.view.html', '');

          // create mock Buying
          mockBuying = new BuyingsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Buying Name'
          });

          // Initialize Controller
          BuyingsController = $controller('BuyingsController as vm', {
            $scope: $scope,
            buyingResolve: mockBuying
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:buyingId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.buyingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            buyingId: 1
          })).toEqual('/buyings/1');
        }));

        it('should attach an Buying to the controller scope', function () {
          expect($scope.vm.buying._id).toBe(mockBuying._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/buyings/client/views/view-buying.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          BuyingsController,
          mockBuying;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('buyings.create');
          $templateCache.put('modules/buyings/client/views/form-buying.client.view.html', '');

          // create mock Buying
          mockBuying = new BuyingsService();

          // Initialize Controller
          BuyingsController = $controller('BuyingsController as vm', {
            $scope: $scope,
            buyingResolve: mockBuying
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.buyingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/buyings/create');
        }));

        it('should attach an Buying to the controller scope', function () {
          expect($scope.vm.buying._id).toBe(mockBuying._id);
          expect($scope.vm.buying._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/buyings/client/views/form-buying.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          BuyingsController,
          mockBuying;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('buyings.edit');
          $templateCache.put('modules/buyings/client/views/form-buying.client.view.html', '');

          // create mock Buying
          mockBuying = new BuyingsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Buying Name'
          });

          // Initialize Controller
          BuyingsController = $controller('BuyingsController as vm', {
            $scope: $scope,
            buyingResolve: mockBuying
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:buyingId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.buyingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            buyingId: 1
          })).toEqual('/buyings/1/edit');
        }));

        it('should attach an Buying to the controller scope', function () {
          expect($scope.vm.buying._id).toBe(mockBuying._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/buyings/client/views/form-buying.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());

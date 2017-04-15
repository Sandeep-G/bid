(function () {
  'use strict';

  describe('Sellings Route Tests', function () {
    // Initialize global variables
    var $scope,
      SellingsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SellingsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SellingsService = _SellingsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('sellings');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/sellings');
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
          SellingsController,
          mockSelling;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('sellings.view');
          $templateCache.put('modules/sellings/client/views/view-selling.client.view.html', '');

          // create mock Selling
          mockSelling = new SellingsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Selling Name'
          });

          // Initialize Controller
          SellingsController = $controller('SellingsController as vm', {
            $scope: $scope,
            sellingResolve: mockSelling
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:sellingId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.sellingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            sellingId: 1
          })).toEqual('/sellings/1');
        }));

        it('should attach an Selling to the controller scope', function () {
          expect($scope.vm.selling._id).toBe(mockSelling._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/sellings/client/views/view-selling.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SellingsController,
          mockSelling;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('sellings.create');
          $templateCache.put('modules/sellings/client/views/form-selling.client.view.html', '');

          // create mock Selling
          mockSelling = new SellingsService();

          // Initialize Controller
          SellingsController = $controller('SellingsController as vm', {
            $scope: $scope,
            sellingResolve: mockSelling
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.sellingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/sellings/create');
        }));

        it('should attach an Selling to the controller scope', function () {
          expect($scope.vm.selling._id).toBe(mockSelling._id);
          expect($scope.vm.selling._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/sellings/client/views/form-selling.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SellingsController,
          mockSelling;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('sellings.edit');
          $templateCache.put('modules/sellings/client/views/form-selling.client.view.html', '');

          // create mock Selling
          mockSelling = new SellingsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Selling Name'
          });

          // Initialize Controller
          SellingsController = $controller('SellingsController as vm', {
            $scope: $scope,
            sellingResolve: mockSelling
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:sellingId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.sellingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            sellingId: 1
          })).toEqual('/sellings/1/edit');
        }));

        it('should attach an Selling to the controller scope', function () {
          expect($scope.vm.selling._id).toBe(mockSelling._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/sellings/client/views/form-selling.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());

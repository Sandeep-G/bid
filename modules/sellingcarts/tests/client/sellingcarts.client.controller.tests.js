(function () {
  'use strict';

  describe('Sellingcarts Controller Tests', function () {
    // Initialize global variables
    var SellingcartsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      SellingcartsService,
      mockSellingcart;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _SellingcartsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      SellingcartsService = _SellingcartsService_;

      // create mock Sellingcart
      mockSellingcart = new SellingcartsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Sellingcart Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Sellingcarts controller.
      SellingcartsController = $controller('SellingcartsController as vm', {
        $scope: $scope,
        sellingcartResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleSellingcartPostData;

      beforeEach(function () {
        // Create a sample Sellingcart object
        sampleSellingcartPostData = new SellingcartsService({
          name: 'Sellingcart Name'
        });

        $scope.vm.sellingcart = sampleSellingcartPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (SellingcartsService) {
        // Set POST response
        $httpBackend.expectPOST('api/sellingcarts', sampleSellingcartPostData).respond(mockSellingcart);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Sellingcart was created
        expect($state.go).toHaveBeenCalledWith('sellingcarts.view', {
          sellingcartId: mockSellingcart._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/sellingcarts', sampleSellingcartPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Sellingcart in $scope
        $scope.vm.sellingcart = mockSellingcart;
      });

      it('should update a valid Sellingcart', inject(function (SellingcartsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/sellingcarts\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('sellingcarts.view', {
          sellingcartId: mockSellingcart._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (SellingcartsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/sellingcarts\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Sellingcarts
        $scope.vm.sellingcart = mockSellingcart;
      });

      it('should delete the Sellingcart and redirect to Sellingcarts', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/sellingcarts\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('sellingcarts.list');
      });

      it('should should not delete the Sellingcart and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());

'use strict';

describe('Sellings E2E Tests:', function () {
  describe('Test Sellings page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/sellings');
      expect(element.all(by.repeater('selling in sellings')).count()).toEqual(0);
    });
  });
});

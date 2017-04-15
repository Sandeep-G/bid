'use strict';

describe('Buyings E2E Tests:', function () {
  describe('Test Buyings page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/buyings');
      expect(element.all(by.repeater('buying in buyings')).count()).toEqual(0);
    });
  });
});

'use strict';

describe('Sellingcarts E2E Tests:', function () {
  describe('Test Sellingcarts page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/sellingcarts');
      expect(element.all(by.repeater('sellingcart in sellingcarts')).count()).toEqual(0);
    });
  });
});

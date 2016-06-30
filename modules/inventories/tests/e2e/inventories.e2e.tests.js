'use strict';

describe('Inventories E2E Tests:', function () {
  describe('Test Inventories page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/inventories');
      expect(element.all(by.repeater('inventory in inventories')).count()).toEqual(0);
    });
  });
});

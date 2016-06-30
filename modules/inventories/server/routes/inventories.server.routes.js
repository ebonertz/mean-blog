'use strict';

/**
 * Module dependencies
 */
var inventoriesPolicy = require('../policies/inventories.server.policy'),
  inventories = require('../controllers/inventories.server.controller');

module.exports = function(app) {
  // Inventories Routes
  app.route('/api/inventories').all(inventoriesPolicy.isAllowed)
    .get(inventories.list)
    .post(inventories.create);

  app.route('/api/inventories/:inventoryId').all(inventoriesPolicy.isAllowed)
    .get(inventories.read)
    .put(inventories.update)
    .delete(inventories.delete);

  // Finish by binding the Inventory middleware
  app.param('inventoryId', inventories.inventoryByID);
};

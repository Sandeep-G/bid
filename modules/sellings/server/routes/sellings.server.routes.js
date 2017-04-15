'use strict';

/**
 * Module dependencies
 */
var sellingsPolicy = require('../policies/sellings.server.policy'),
  sellings = require('../controllers/sellings.server.controller');

module.exports = function(app) {
  // Sellings Routes
  app.route('/api/sellings').all(sellingsPolicy.isAllowed)
    .get(sellings.list)
    .post(sellings.create);

  app.route('/api/sellings/:sellingId').all(sellingsPolicy.isAllowed)
    .get(sellings.read)
    .put(sellings.update)
    .delete(sellings.delete);

  app.route('/api/sellings/sellItem').all(sellingsPolicy.isAllowed)
    .put(sellings.sellItem);

  // TODO Resolve client side API call
  // Temporary fix
  app.route('/sellings/api/sellings').all(sellingsPolicy.isAllowed)
    .get(sellings.list)
    .post(sellings.create);

  app.route('/sellings/api/sellings/:sellingId').all(sellingsPolicy.isAllowed)
    .get(sellings.read)
    .put(sellings.update)
    .delete(sellings.delete);

  app.route('/sellings/api/sellings/sellItem').all(sellingsPolicy.isAllowed)
    .put(sellings.sellItem);

  // Finish by binding the Selling middleware
  app.param('sellingId', sellings.sellingByID);
};

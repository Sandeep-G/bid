'use strict';

/**
 * Module dependencies
 */
var sellingsPolicy = require('../policies/sellings.server.policy'),
  sellings = require('../controllers/sellings.server.controller');

module.exports = function(app) {
  // Sellings Routes
  app.route('/api/sellings/sellItem').all(sellingsPolicy.isAllowed)
    .put(sellings.sellItem);

  // TODO Resolve client side API call
  // Temporary fix
  app.route('/sellings/api/sellings/sellItem').all(sellingsPolicy.isAllowed)
    .put(sellings.sellItem);

};

'use strict';

/**
 * Module dependencies
 */
var buyingsPolicy = require('../policies/buyings.server.policy'),
  buyings = require('../controllers/buyings.server.controller');

module.exports = function(app) {
  // Buyings Routes
  app.route('/api/buyings').all(buyingsPolicy.isAllowed)
    .get(buyings.list)
    .post(buyings.create);

  app.route('/api/buyings/listWinning').all(buyingsPolicy.isAllowed)
    .get(buyings.listWinning);

  app.route('/api/buyings/listLosing').all(buyingsPolicy.isAllowed)
    .get(buyings.listLosing);

  app.route('/api/buyings/listWon').all(buyingsPolicy.isAllowed)
    .get(buyings.listWon);

  app.route('/api/buyings/listPurchased').all(buyingsPolicy.isAllowed)
    .get(buyings.listPurchased);

  app.route('/api/buyings/:buyingId').all(buyingsPolicy.isAllowed)
    .get(buyings.read)
    .put(buyings.update)
    .delete(buyings.delete);

  // Finish by binding the Buying middleware
  app.param('buyingId', buyings.buyingByID);
};

'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Sellings Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/sellings',
      permissions: '*'
    }, {
      resources: '/api/sellings/:sellingId',
      permissions: '*'
    }, {
      resources: '/api/sellings/sellItem',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/sellings',
      permissions: ['get', 'post']
    }, {
      resources: '/api/sellings/:sellingId',
      permissions: ['get']
    }, {
      resources: '/api/sellings/sellItem',
      permissions: ['put']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/sellings',
      permissions: ['get']
    }, {
      resources: '/api/sellings/:sellingId',
      permissions: ['get']
    }]
  },
  {
    roles: ['admin'],
    allows: [{
      resources: '/sellings/api/sellings',
      permissions: '*'
    }, {
      resources: '/sellings/api/sellings/:sellingId',
      permissions: '*'
    }, {
      resources: '/sellings/api/sellings/sellItem',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/sellings/api/sellings',
      permissions: ['get', 'post']
    }, {
      resources: '/sellings/api/sellings/:sellingId',
      permissions: ['get']
    }, {
      resources: '/sellings/api/sellings/sellItem',
      permissions: ['put']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/sellings/api/sellings',
      permissions: ['get']
    }, {
      resources: '/sellings/api/sellings/:sellingId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Sellings Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Selling is being processed and the current user created it then allow any manipulation
  if (req.selling && req.user && req.selling.user && req.selling.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
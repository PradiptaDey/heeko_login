/**
 * @namespace features.user
 */

const userApi = require('./userApi');

module.exports = function initializeRoutes(app) {
  userApi.register(app);
};

const UserController = require('./userController');
const ApiSchema = require('../../base/apiSchema');

/**
 * Fetches the loggedin user details.
 * @kind endpoint
 * @memberof features.user
 */
const getLoggedInUser = {
    path: '/loggedInUser',
    verb: 'get',
    handler: {
        controller: UserController,
        method: 'getLoggedInUser'
    }
};

/**
 * Sends link to reset password if the email exist.
 * @kind endpoint
 * @memberof features.user
 */
const forgotpw = {
  path: '/forgotpw',
  verb: 'get',
  handler: {
      controller: UserController,
      method: 'forgotpw',
      arguments: ['?email']
  }
};

/**
 * Checks if the token expiry of reset pw.
 * @kind endpoint
 * @memberof features.user
 */
const checkToken = {
  path: '/checkToken',
  verb: 'get',
  handler: {
      controller: UserController,
      method: 'checkToken',
      arguments: ['?userId']
  }
};

/**
 * Changes the password of the user.
 * @kind endpoint
 * @memberof features.user
 */
const changePassword = {
  path: '/changePass',
  verb: 'get',
  handler: {
      controller: UserController,
      method: 'changePassword',
      arguments: ['?password', '?userId']
  }
};

/**
 * Defines the User API.
 * @kind schema
 * @type {ApiSchema}
 * @memberof features.user
 */
const UserApi = {
  name: 'User',
  url: '/api/user',
  endpoints: [
    getLoggedInUser,
    forgotpw,
    checkToken,
    changePassword
  ]
};

module.exports = new ApiSchema(UserApi);

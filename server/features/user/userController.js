const ApiController = require('../../base/apiController');
const ApplicationError = require('../../base/applicationError');
const UserService = require('./userService');

/**
 * Provides a controller for user API.
 * @extends base.ApiController
 * @memberof features.user
 */
class UserController extends ApiController {
  /**
   * Initializes a new instance of `UserController` class
   * @param {ApiContext} context
   */
  constructor(context) {
    super(context);

    this.request = context.request;

    this.userService = new UserService(context);
  }

  /**
   * Gets the logged in user details
   */
  async getLoggedInUser() {
    if(this.request.isAuthenticated()) {
      return this.respondOk({ userName: this.request.user.UserName });
    }

    throw ApplicationError.create('No User Logged In');
  }

  /**
   * Checks if the email exist
   * @param {string} email of the user
   */
  async forgotpw(email) {
    const userData = await this.userService.sendResetPwLink(email);
    return this.respondOk(userData);
  }

  /**
   * Checks the token expiry
   * @param {number} id of the user
   */
  async checkToken(userId) {
    const { isExpired, tokenExist } = await this.userService.checkToken(userId);
    return this.respondOk({ isExpired, tokenExist });
  }

  /**
   * Changes the pw of an user
   * @param {string} pw of the user
   */
  async changePassword(password, userId) {
    await this.userService.changePassword(password, userId);
    return this.respondOk("Password Changed Successfully");
  }
}

module.exports = UserController;

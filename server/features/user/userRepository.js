const BaseRepository = require('../../base/baseRepository');

/**
 * Provides a repository for to user.
 * @extends base.BaseRepository
 * @memberof features.user
 */
class UserRepository extends BaseRepository {
  /**
   * Initializes a new instance of `UserRepository`, using the specified `context`.
   * @param {ApiContext} context The current context.
   */
  constructor(context) {
    super(context);
  }

  /**
   * Check if the data exist with the associated column
   */
  async checkIfExist(data, column) {
    const queryString = `Select UserId, Email from Users where ${column} = '${data}'`;
    return await this.runQueryPromised(queryString);
  }

  async updateToken(email, token) {
    const queryString = `UPDATE Users SET ResetToken = '${token}' where Email = '${email}'`;
    return await this.runQueryPromised(queryString);
  }

  async getToken(userId) {
    console.log(userId);
    const queryString = `select ResetToken from Users where UserId = ${userId}`;
    return await this.runQueryPromised(queryString);
  }

  async updatePassword(hash, userId) {
    const queryString = `UPDATE Users SET hash = '${hash}' where UserId = '${userId}'`;
    return await this.runQueryPromised(queryString);
  }

}

module.exports = UserRepository;
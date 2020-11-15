/**
 * Defines the options that specify how a query should be executed.
 */
const promise = require('bluebird');
const ApiContext = require('./apiContext');

/**
 * Provides a data access layer for working with database.
 * @memberof base
 */
class BaseRepository {

  /**
   * Initializes a new instance of Repository
   *
   * @param {ApiContext} context The context to use with this repository.
   * @throws {Error} If the `context` is undefined, or not an instance of `ApiContext`.
   */
  constructor(context) {

      if (context === null || !(context instanceof ApiContext)) {
          throw new Error('The context argument needs to be an instance of ApiContext');
      }

      /**
       * The context under which the repository is executing.
       * @type {ApiContext}
       */
      this.context = context;

      /**
       * @type {Object}
       */
      this.connection = context.connection;
  }

  async runQueryPromised(queryString) {
    return await new promise((resolve, reject) => {
      this.connection.query(queryString, function(err, data) {
        if(err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  }
}

module.exports = BaseRepository;

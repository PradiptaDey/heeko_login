/**
 * Provides access to the execution context within an HTTP request.
 * @class
 * @memberof base
 */
class ApiContext {

  /**
   * Initializes a new instance of `ApiContext`.
   * @param {IncomingMessage} request The request instance to initialize the context with.
   * @param {base.db.DbDriver} connection The user connection to use with this context.
   */
  constructor(request, response, connection) {

      /**
       * The current request object
       * @type {IncomingMessage}
       */
      this.request = request;

      /**
       * The current response object
       * @type {ServerResponse}
       */
      this.response = response;

      /**
       * The db connection object
       * @type {Object}
       */
      this.connection = connection;
  }
}

module.exports = ApiContext;

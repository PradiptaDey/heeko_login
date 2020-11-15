const ApiContext = require('./apiContext');

/**
 * Provides a base class for other API controllers
 * @memberOf base
 */
class ApiController {

    /**
     * Initializes a new instance of ApiController
     * @param {ApiContext} context The context to use with this controller.
     * @throws {Error} If the `context` is undefined, or not an instance of `ApiContext`.
     */
    constructor(context) {

        if (context === null || !(context instanceof ApiContext)) {
            throw new Error('The context argument needs to be an instance of ApiContext');
        }

        /**
         * The context under which the controller is executing.
         * @type {ApiContext}
         */
        this.context = context;
    }

    /**
     * Sets the response code to 200 (Ok) and outputs the specified result as JSON.
     * @param {Object} result The object to output.
     */
    respondOk(result = {}) {
        this.respondJson(result, 200);
    }

    /**
     * Sets the response code to the specified `errorCode`, and outputs the specified result.
     * @param {Object} result The object to output.
     * @param {Number} [errorCode] The error code to use.
     */
    respondError(result = {}, errorCode = 500) {
        if (errorCode === 500) {
            const request = this.context.request;
            const properties = {
                stack: result.stack ? result.stack : result
            };
            if (request && request.user) {
                properties.userId = request.user.ID;
                properties.username = request.user.name;
                properties.client = request.user.client;
            }
            if (request && request.method) {
                properties.url = `${request.method.toUpperCase()} ${request.url}`;
            }
        }
        this.respondJson(result, errorCode);
    }

    /**
     * Sets the response code to 404 (NotFound) and outputs the specified result as JSON.
     * @param {Object} result The object to output.
     */
    respondNotFound(result = {}) {
        this.respondJson(result, 404);
    }

    /**
     * Sets the specified response `statusCode` and outputs the specified result as JSON.
     * @param {Object} result The object to output.
     * @param {Number} [statusCode] The HTTP status code to set.
     * @private
     */
    respondJson(result = {}, statusCode = 200) {
        const response = this.context.response;
        response.status(statusCode).json(result);
    }

    /**
     * Sets the specified response `statusCode` and outputs the specified result.
     * @param {Object} result The object to output.
     * @param {Number} [statusCode] The HTTP status code to set.
     * @private
     */
    sendResponse(result = {}, statusCode = 200) {
        const response = this.context.response;
        response.status(statusCode).send(result);
    }
}

module.exports = ApiController;

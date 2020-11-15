const ApiContext = require('./apiContext');
const ApplicationError = require('./applicationError');
/**
 * Provides a class that routes express requests to a controller type
 * @memberof base
 */
class ControllerFactory {

    /**
     * Initializes a new instance of `ControllerFactory`, using the specified `controllerType`.
     * @param {class} controllerType The controller type that this factory creates.
     */
    constructor(controllerType) {
        /**
         * The controller type that this factory creates.
         * @type {class}
         */
        this.controllerType = controllerType;

        this.route = this.route.bind(this);
    }

    /**
     * Selects a property from `context` as specified with `expression`.
     * @param {ApiContext} context The context from which to select the value.
     * @param {string} expression The expression that specifies what to select.
     * @return {Object} The selected context property, or `undefined` if the property doesn't exist.
     * @example
     * ```
     * // given this context:
     * context = {
     *     request: {
     *         param: { Id: 45, pageNum: 17 }
     *         query: { filter: 'unique1' }
     *         cookies: { user: { name: 'Michael' } }
     *         body: {
     *             firstName: 'Michael',
     *             lastName: 'Corleone',
     *             occupation: 'Godfather'
     *         }
     *     }
     * }
     *
     * // the results for these expressions will be:
     * parseArgument(context, ':Id');                       // 45
     * parseArgument(context, '?filter');                   // 'unique1'
     * parseArgument(context, 'request:cookies');           // { user: { name: 'Michael' } }
     * parseArgument(context, 'request:cookies:user');      // { name: 'Michael' }
     * parseArgument(context, 'request:cookies:user:name'); // 'Michael'
     * ```
     */
    static parseArgument(context, expression) {

        let name = expression;
        let object;
        let value;

        if (name[0] === ':') {
            object = context.request.params;
            name = name.substring(1);
            value = object[name];
        } else if (name[0] === '?') {
            object = context.request.query;
            name = name.substring(1);
            value = object[name];
        } else if (name.includes(':')) {
            const parts = name.split(':');
            let current = context;

            for (let i = 0; i < parts.length; i++) {
                current = value = current[parts[i]];
                if (current === undefined || current === null) {
                    break;
                }
            }
        } else if (context[name] !== undefined) {
            value = context[name];
        }

        return value;
    }

    /**
     * Creates a new `ApiContext` initialized around the specified `request`.
     * @param {IncomingMessage} request The current HTTP request.
     * @return {ApiContext} A new instnce of `ApiContext`, initialized around the specified `request`.
     */
    createContext(request, response) {
        let connection = null;
        try {
            connection = require('../dbConnection');
        } catch (err) {
            // Can not get connection
            console.warn('Unable to fetch current user connection', err);
        }
        return new ApiContext(request, response, connection);
    }

    /**
     * Creates a function that handles an express route.
     * @param {string} method The name of the controller method to execute.
     * @param {string[]} argumentExpressions List of expressions that specify how to map the
     *     express request object to method arguments.
     * @return {Function} An express route (`(req, res, next) => { ... }`).
     */
    route(method, ...argumentExpressions) {

        return async (request, response, next = () => { }) => {

            const context = this.createContext(request, response);
            let controller;
            try {
                controller = new this.controllerType(context);
                const methodArguments = argumentExpressions.map(expression =>
                    ControllerFactory.parseArgument(context, expression));

                await controller[method].apply(controller, methodArguments);
            } catch (error) {

              if (controller && error instanceof ApplicationError) {
                controller.respondError(error, error.code);
              } else {
                next(error);
              }
            }
        };
    }
}

module.exports = ControllerFactory;

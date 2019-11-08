export = Application;
/**
 * Obsidian Application.
 *
 * @typedef {import('./modules-loader/modules-loader')} ModulesLoader
 * @typedef {import('./config')} Config
 * @typedef {import('./events/events')} Events
 * @typedef {import('./logging')} Logging
 */
declare class Application {
    /**
     * @constructor
     * @param {string} [name] The name of the application (default: ``"obsidian"``).
     * @param {string} [namespace] The namespace, generally the
     *        module name (default: ``"obsidian"``).
     * @param {Object} [dependencies={}] Application dependencies.
     * @param {ModulesLoader=} dependencies.modulesLoader An instance of the module loader.
     * @param {Config=} dependencies.config An instance of the config handler.
     * @param {Events=} dependencies.events An instance of the event dispatcher.
     * @param {Logging=} dependencies.log An instance of the logger.
     * @param {Application} [dependencies.rootApp=null] (optional) An instance
     *        of the root application, if any.
     * @param {Object} [modules={}] (optional) The modules that should be accessible
     *        through this application.
     */
    constructor(name?: string | undefined, namespace?: string | undefined, dependencies?: {
        modulesLoader?: import("./modules-loader/modules-loader") | undefined;
        config?: import("./config") | undefined;
        events?: import("./events/events") | undefined;
        log?: import("./logging") | undefined;
        rootApp?: import("./application");
    } | undefined, modules?: Object | undefined);
    /**
     * Indicate whether the application is started or not.
     *
     * @public
     * @type {boolean}
     */
    get isStarted(): boolean;
    /**
     * The application name.
     *
     * @public
     * @type {string}
     */
    get name(): string;
    /**
     * The current namespace (usually, the current module name).
     *
     * @public
     * @type {string}
     */
    get namespace(): string;
    /**
     * Handles application configuration. See :doc:`config`.
     *
     * @public
     * @type {Config}
     */
    get config(): import("./config");
    /**
     * Handles application events. See :doc:`events`.
     *
     * @public
     * @type {Events}
     */
    get events(): import("./events/events");
    /**
     * Handles application logging. See :doc:`logging`.
     *
     * @public
     * @type {Logging}
     */
    get log(): import("./logging");
    /**
     * Access to loaded modules.
     *
     * If you access this property from inside a module, you will only access
     * the modules you required. See :doc:`module`.
     *
     * @public
     */
    get modules(): any;
    /**
     * Add a module to the current application.
     *
     * @param {Object} module The module to add (see :doc:`module`).
     * @param {Object} [params={}] (optional) Additional parameters for the module
     */
    use(module: Object, params?: Object | undefined): void;
    /**
     * Unload a module.
     *
     * @public
     * @param {string|Object} module The module (object or name) to unload.
     */
    unload(module: string | Object): void;
    /**
     * Start the application.
     *
     * @param {Object} config Application's confguration
     * @return {Promise.<undefined>} This promise can be usually left unhandled.
     */
    start(config?: Object): Promise<undefined>;
    /**
     * A factory to create a sub-application from the current one.
     *
     * @private
     * @param {string} namespace The namespaceof the sub-application, generally
     *        the name module that will receive the application.
     * @param {Object} modules The modules that will be accessible through this application.
     * @return {Application} A new Obsidian application.
     */
    _createSubApplication(namespace: string, modules: Object): import("./application");
}
declare namespace Application {
    export { ModulesLoader, Config, Events, Logging };
}
/**
 * Obsidian Application.
 */
type ModulesLoader = import("./modules-loader/modules-loader");
/**
 * Obsidian Application.
 */
type Config = import("./config");
/**
 * Obsidian Application.
 */
type Events = import("./events/events");
/**
 * Obsidian Application.
 */
type Logging = import("./logging");

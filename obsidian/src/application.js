const helpers = require("./helpers.js");

const NAME = Symbol("name");
const NAMESPACE = Symbol("moduleName");
const MODULES_LOADER = Symbol("modulesLoader");
const CONFIG = Symbol("config");
const EVENTS = Symbol("events");
const LOG = Symbol("log");
const ROOT_APP = Symbol("rootApp");

const MODULES = Symbol("modules");
const IS_STARTED = Symbol("isStarted");

/**
 * Obsidian Application.
 */
class Application {

    /**
     * @constructor
     * @param {string} [name="obsidian"] The name of the application (default: ``"obsidian"``).
     * @param {string} [namespace="obsidian"] The namespace, generally the
     *        module name (default: ``"obsidian"``).
     * @param {Object} [dependencies={}] Application dependencies.
     * @param {ModulesLoader} dependencies.modulesLoader An instance of the module loader.
     * @param {Config} dependencies.config An instance of the config handler.
     * @param {Events} dependencies.events An instance of the event dispatcher.
     * @param {Logging} dependencies.log An instance of the logger.
     * @param {Application} [dependencies.rootApp=null] (optional) An instance
     *        of the root application, if any.
     * @param {Object} [modules={}] (optional) The modules that should be accessible
     *        through this application.
     */
    constructor(name = "obsidian", namespace = "obsidian", dependencies = {}, modules = {}) {
        Object.assign(this, {
            [NAME]: name,
            [NAMESPACE]: namespace,

            [MODULES_LOADER]: dependencies.modulesLoader,
            [CONFIG]: dependencies.config,
            [EVENTS]: dependencies.events,
            [LOG]: dependencies.log,
            [ROOT_APP]: dependencies.rootApp || null,

            [MODULES]: modules,
            [IS_STARTED]: false,
        });

        if (this[MODULES_LOADER]) this[MODULES_LOADER].setApp(this);
        if (this[CONFIG]) this[CONFIG].setApp(this);
        if (this[EVENTS]) this[EVENTS].setApp(this);
        if (this[LOG]) this[LOG].setApp(this);
    }

    /**
     * Indicate whether the application is started or not.
     *
     * @public
     * @type {boolean}
     */
    get isStarted() {
        if (this[ROOT_APP]) return this[ROOT_APP].isStarted;
        return this[IS_STARTED];
    }

    /**
     * The application name.
     *
     * @public
     * @type {string}
     */
    get name() {
        return this[NAME];
    }

    /**
     * The current namespace (usually, the current module name).
     *
     * @public
     * @type {string}
     */
    get namespace() {
        return this[NAMESPACE];
    }

    /**
     * Handles application configuration. See :doc:`config`.
     *
     * @public
     * @type {Config}
     */
    get config() {
        return this[CONFIG];
    }

    /**
     * Handles application events. See :doc:`events`.
     *
     * @public
     * @type {Events}
     */
    get events() {
        return this[EVENTS];
    }

    /**
     * Handles application logging. See :doc:`logging`.
     *
     * @public
     * @type {Logging}
     */
    get log() {
        return this[LOG];
    }

    /**
     * Access to loaded modules.
     *
     * If you access this property from inside a module, you will only access
     * the modules you required. See :doc:`module`.
     *
     * @public
     */
    get modules() {
        if (this[ROOT_APP]) {
            return this[MODULES];
        }
        return this[MODULES_LOADER].modules;
    }

    /**
     * Load a module.
     *
     * @public
     * @param {Object} module The module to load (see :doc:`module`).
     * @param {Object} [params={}] (optional) Additional parameters for the module
     */
    load(module, params = {}) {
        if (this[ROOT_APP]) throw new Error("ContextError: you cannot load modules from a module.");
        if (this[IS_STARTED]) throw new Error("ApplicationAlreadyStarted: you cannot load modules once application started.");

        this[MODULES_LOADER].register(module, params);
    }

    /**
     * Unload a module.
     *
     * @public
     * @param {string|Object} module The module (object or name) to unload.
     */
    unload(module) {
        throw new Error("NotImplementedError");  // TODO
    }

    /**
     * Start the application.
     *
     * @public
     */
    start() {
        if (this[ROOT_APP]) throw new Error("ContextError: you cannot start the application from a module.");
        if (this[IS_STARTED]) throw new Error("ApplicationAlreadyStarted: you cannot start application twice.");
        this[IS_STARTED] = true;
        this[MODULES_LOADER].loadAll();
        // TODO .then fire event
    }

    /**
     * A factory to create a sub-application from the current one.
     *
     * @private
     * @param {string} namespace The namespaceof the sub-application, generally
     *        the name module that will receive the application.
     * @param {Object} modules The modules that will be accessible through this application.
     * @return {Application} A new Obsidian application.
     */
    _createSubApplication(namespace, modules) {
        return new Application(this.name, namespace, {
            modulesLoader: this[MODULES_LOADER],
            // config: this.config._getnamespaced(namespace),
            // events: this.events._getnamespaced(namespace),
            // log: this.log._getnamespaced(namespace),
            rootApp: this,
        }, modules);
    }

}

module.exports = Application;

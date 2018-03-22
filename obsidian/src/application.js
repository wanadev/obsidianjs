const NAME = Symbol("name");
const NAMESPACE = Symbol("moduleName");
const MODULES_LOADER = Symbol("modulesLoader");
const CONFIG = Symbol("config");
const EVENTS = Symbol("events");
const LOG = Symbol("log");
const ROOT_APP = Symbol("rootApp");

const MODULES = Symbol("modules");

/**
 * Obsidian Application.
 */
class Application {

    /**
     * @constructor
     * @param {string} [name="obsidian"] The name of the application (default: ``"obsidian"``).
     * @param {string} [namespace="obsidian"] The namespace, generally the
     *        module name (default: ``"obsidian"``).
     * @param {Object} dependencies Application dependencies.
     * @param {ModulesLoader} dependencies.modulesLoader An instance of the module loader.
     * @param {Config} dependencies.config An instance of the config handler.
     * @param {Events} dependencies.events An instance of the event dispatcher.
     * @param {Logging} dependencies.log An instance of the logger.
     * @param {Application} [dependencies.rootApp=null] (optional) An instance
     *        of the root application, if any.
     * @param {Object} modules (optional) The modules that should be accessible
     *        through this application.
     */
    constructor(name = "obsidian", namespace = "obsidian", dependencies = {}, modules = {}) {
        this[NAME] = name;
        this[NAMESPACE] = namespace;

        this[MODULES_LOADER] = dependencies.modulesLoader;
        this[CONFIG] = dependencies.config;
        this[EVENTS] = dependencies.config;
        this[LOG] = dependencies.log;
        this[ROOT_APP] = dependencies.rootApp || null;

        this[MODULES] = modules;
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
        return this[MODULES];
    }

    /**
     * Load a module.
     *
     * @public
     * @param {Object} module The module to load (see :doc:`module`).
     * @param {Object} params Additional parameters for the module
     */
    load(module, params) {
        throw new Error("NotImplementedError");  // TODO
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
        throw new Error("NotImplementedError");  // TODO
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
            // config: this.config._getnamespaced(),
            // events: this.events._getnamespaced(),
            // log: this.log._getnamespaced(),
            rootApp: this,
        }, modules);
    }

}

module.exports = Application;

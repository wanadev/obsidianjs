"use strict";

const ROOT_APP = Symbol("rootApp");
const NAME = Symbol("name");
const MODULE_NAME = Symbol("moduleName");
const MODULES = Symbol("modules");
const EVENTS = Symbol("events");
const CONFIG = Symbol("config");
const LOG = Symbol("log");

/**
 * Obsidian Application.
 */
class Application {

    /**
     * @constructor
     * @param {String} [name="obsidian"] The name of the application (default:
     *                                   ``"obsidian"``).
     */
    constructor(name="obsidian", _params={}) {
        this[ROOT_APP] = _params[ROOT_APP] || null;
        this[name] = name;
        this[MODULE_NAME] = _params[MODULE_NAME] || "core";
        this[MODULES] = _params[MODULES] || {};
    }

    /**
     * The application name.
     *
     * @public
     */
    get name() {
        return this[NAME];
    }

    /**
     * The current module's name.
     *
     * @public
     */
    get moduleName() {
        return this[MODULE_NAME];
    }

    /**
     * Handles application's events. See :doc:`events`.
     *
     * @public
     */
    get events() {
        throw new Error("NotImplementedError");  // TODO
    }

    /**
     * Handles application's configuration. See :doc:`config`.
     *
     * @public
     */
    get config() {
        throw new Error("NotImplementedError");  // TODO
    }

    /**
     * Handles application's logging. See :doc:`logging`.
     *
     * @public
     */
    get log() {
        throw new Error("NotImplementedError");  // TODO
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
        throw new Error("NotImplementedError");  // TODO
    }

    /**
     * Load a module.
     *
     * @public
     * @param {Object} module The module to load (see :doc:`module`).
     * @param {Object} param Additional parameters for the module
     */
    load(module, param) {
        throw new Error("NotImplementedError");  // TODO
    }

    /**
     * Unload a module.
     *
     * @public
     * @param {String|Object} module The module (object or name) to unload.
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
     * @param {String} moduleName The name of the module that will receive this application.
     * @param {Object} modules The modules that will be accessible from this application.
     * @return {Application} A new Obsidian application.
     */
    _createSubApplication(moduleName, modules) {
        return new Application(this.name, {
            [ROOT_APP]: this,
            [MODULE_NAME]: moduleName,
            [MODULES]: modules,
        });
    }
}

module.exports = Application;

const MODULES_LIST = Symbol("modules-list");
const MODULES = Symbol("modules");

/**
 * Loads Obsidian modules, resolving and injecting dependencies.
 */
class ModulesLoader {

    /**
     * @constructor
     */
    constructor() {
        this[MODULES_LIST] = {};
        this[MODULES] = {};
    }

    /**
     * Access to loaded modules.
     *
     * ::
     *
     *     {
     *         module1: ...,
     *         module2: ...,
     *         ...
     *     }
     *
     * @public
     */
    get modules() {
        return this[MODULES];
    }

    /**
     * Register a new module (it will not be loaded, only registered).
     *
     * ::
     *
     *     const myModule1 = require("my-module-1");
     *     const myModule2 = require("my-module-2");
     *     const fakeFoobarModule = require("fake-foobar-module");
     *
     *     modules.register(myModule1);
     *
     *     modules.register(myModule2, {
     *         name: "new-module",            // renames the module
     *         modules: {
     *             myModule: "myModule1",     // inject the previously loaded myModule1 as myModule
     *             foobar: fakeFoobarModule,  // inject fakeFoobarModule as foobar
     *         },
     *         config: {
     *             option: "value",
     *         }
     *     });
     *
     * .. NOTE::
     *
     *    You not need to specify modules to inject, Obsidian resolves them
     *    automatically. The ``modules`` option is only useful when you want to
     *    substitute a dependency by an other one.
     *
     * @param {Object} module_ The module to load (see :doc:`module`)
     * @param {Object} params (optional)
     * @param {String} params.name A name that will be used instead of ``module_.name`` (optional)
     * @param {Object} params.modules Modules objects or names that will be injected (optional)
     * @param {Object} params.config Configuration that will be passed to the module at
     *                               load time (optional)
     *
     */
    register(module_, {
        name = null,
        modules = {},
        config = {},
    } = {}) {
        if (!module_.name) throw new Error("InvalidObsidianModule: missing 'name' property");
        if (!module_.requires) throw new Error("InvalidObsidianModule: missing 'requires' property");
        if (!Array.isArray(module_.requires)) throw new Error("InvalidObsidianModule: 'requires' property must be an array");
        if (!module_.load) throw new Error("InvalidObsidianModule: missing 'load' property");
        if (typeof module_.load !== "function") throw new Error("InvalidObsidianModule: 'load' property must be a function");
        if (!module_.unload) throw new Error("InvalidObsidianModule: missing 'unload' property");
        if (typeof module_.unload !== "function") throw new Error("InvalidObsidianModule: 'unload' property must be a function");

        const moduleData = {
            name: name || module_.name,
            loaded: false,
            requires: module_.requires,
            moduleOverride: modules,
            modules: {},
            config,
            load: module_.load,
            unload: module_.unload,
        };

        this[MODULES_LIST][moduleData.name] = moduleData;
    }

    /**
     * Load a module (the module must be registered first).
     *
     * ::
     *
     *     modules.load("my-module")
     *         .then(myModule => {
     *             // do stuff with the module
     *         })
     *         .catch(error => {
     *             console.error("Unable to load 'my-module':", error);
     *         });
     *
     * @public
     * @param {String} moduleName The module name.
     * @return A promise that returns the loaded module.
     */
    load(moduleName) {
        throw new Error("NotImpelemntedError");  // return (promise) module
    }

    /**
     * Unload a module
     *
     * ::
     *
     *     modules.unload("my-module")
     *         .catch(error => {
     *             console.error("Unable to unload 'my-module':", error);
     *         });
     *
     * @public
     * @param {String} moduleName The module name.
     * @return A promise.
     */
    unload(moduleName) {
        throw new Error("NotImpelemntedError");  // return (promise)
    }

    /**
     * Load all registered modules that are not already loaded.
     *
     * ::
     *
     *     modules.register(module1);
     *     modules.register(module2);
     *
     *     modules.loadAll()
     *         .then(loadedModules => {
     *             // {
     *             //     module1: ...,
     *             //     module2: ...,
     *             // }
     *         })
     *         .catch(error => {
     *             console.error("An error occurred when loading modules:", error);
     *         });
     *
     * @public
     * @return A promise that returns an object containing the loaded modules.
     */
    loadAll() {
        throw new Error("NotImpelemntedError");  // return (promise) {moduleName: module, foo: ...}
    }

}

module.exports = ModulesLoader;

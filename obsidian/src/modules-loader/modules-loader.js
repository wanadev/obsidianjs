const helpers = require("../helpers");
const { getLoadingOrder } = require("./dependencies.js");

const MODULES_LIST = Symbol("modules-list");
const MODULES = Symbol("modules");
const APP = Symbol("app");

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
     * Define the (sub)application this module will work with.
     *
     * @public
     * @param {Application} app The application or sub-application.
     */
    setApp(app) {
        this[APP] = app;
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
     * @param {Object} module The module to load (see :doc:`module`).
     * @param {Object} params (optional).
     * @param {string} params.name A name that will be used instead of ``module.name`` (optional).
     * @param {Object} params.modules Modules objects or names that will be injected (optional).
     * @param {Object} params.config Configuration that will be passed to the module at
     *                               load time (optional).
     *
     */
    register(module, {
        name = null,
        modules = {},
        config = null,
    } = {}) {
        if (!module.name) throw new Error("InvalidObsidianModule: missing 'name' property");
        if (!module.requires) throw new Error("InvalidObsidianModule: missing 'requires' property");
        if (!Array.isArray(module.requires)) throw new Error("InvalidObsidianModule: 'requires' property must be an array");
        if (!module.load) throw new Error("InvalidObsidianModule: missing 'load' property");
        if (typeof module.load !== "function") throw new Error("InvalidObsidianModule: 'load' property must be a function");
        if (!module.unload) throw new Error("InvalidObsidianModule: missing 'unload' property");
        if (typeof module.unload !== "function") throw new Error("InvalidObsidianModule: 'unload' property must be a function");

        const moduleData = {
            name: name || module.name,
            requires: module.requires,
            moduleOverride: modules,
            modules: {},
            config,
            module,
        };

        if (module.config) {
            this[APP].config.load({
                modules: {
                    [helpers.toCamelCase(moduleData.name)]: module.config,
                },
            });
        }

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
     * @param {string} moduleName The module name.
     * @return A promise that returns the loaded module.
     */
    load(moduleName) {
        if (!this[MODULES_LIST][moduleName]) {
            return Promise.reject(new Error(`UnknownModule: unable to find the '${moduleName}' module. Maybe someone forget to register it?`));
        }

        const moduleJavascriptName = helpers.toCamelCase(moduleName);

        // The module is already loaded... return it.
        if (this[MODULES][moduleJavascriptName] !== undefined) {
            return Promise.resolve(this[MODULES][moduleJavascriptName]);
        }

        // Get module's dependencies
        const dependencies = {};
        const unmetDependency = this[MODULES_LIST][moduleName].requires
            .some((dependencyName) => {
                const dependencyJavascriptName = helpers.toCamelCase(dependencyName);
                const dependency = this[MODULES][dependencyJavascriptName];

                if (dependency === undefined) {
                    return dependencyName;
                }

                dependencies[dependencyJavascriptName] = dependency;

                return false;
            });

        if (unmetDependency) {
            return Promise.reject(new Error(`UnmetDependency: "${moduleName}" requires "${unmetDependency}" but it cannot be found.`));
        }

        // Create the module's app
        const app = this[APP]._createSubApplication(moduleName, dependencies);  // eslint-disable-line no-underscore-dangle,max-len
        this[MODULES_LIST][moduleName].module.app = app;

        // Set the module's additional config
        if (this[MODULES_LIST][moduleName].config) {
            this[APP].config.load({
                modules: {
                    [moduleJavascriptName]: this[MODULES_LIST][moduleName].config,
                },
            });
        }

        // Load the module
        return Promise.resolve()
            .then(() => this[MODULES_LIST][moduleName].module.load(app))
            .catch((error) => {
                if (error instanceof Error) {
                    error.message = `ModuleLoadingError: ${error.message}`;  // eslint-disable-line no-param-reassign
                    throw error;
                } else {
                    throw new Error(`ModuleLoadingError: ${error}`);
                }
            })
            .then((module) => {
                this[MODULES][moduleJavascriptName] = module || null;
                return module || null;
            });
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
     * @param {string} moduleName The module name.
     * @return A promise.
     */
    unload(moduleName) {  // eslint-disable-line
        throw new Error("NotImplementedError");  // return (promise)
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
        return getLoadingOrder(this[MODULES_LIST])
            .reduce(
                (promise, moduleName) => promise.then(this.load.bind(this, moduleName)),
                Promise.resolve(),
            )
            .then(() => this.modules);
    }

}

module.exports = ModulesLoader;

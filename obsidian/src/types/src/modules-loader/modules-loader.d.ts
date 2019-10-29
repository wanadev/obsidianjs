export = ModulesLoader;
/**
 * Loads Obsidian modules, resolving and injecting dependencies.
 */
declare class ModulesLoader {
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
    get modules(): {};
    /**
     * Define the (sub)application this module will work with.
     *
     * @public
     * @param {Application} app The application or sub-application.
     */
    setApp(app: any): void;
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
    register(module: Object, { name, modules, config, }?: {
        name: string;
        modules: Object;
        config: Object;
    }): void;
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
    load(moduleName: string): Promise<any>;
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
    unload(moduleName: string): void;
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
    loadAll(): Promise<{}>;
    [MODULES_LIST]: {};
    [MODULES]: {};
    [APP]: any;
}
declare const MODULES_LIST: unique symbol;
declare const MODULES: unique symbol;
declare const APP: unique symbol;

const MODULES = Symbol("modules");

class ModulesLoader {

    constructor() {
        this[MODULES] = {};
    }

    get modules() {
        return this[MODULES];
    }

    register(module_, {
        name = null,
        modules = {},
        config = {},
        permissions = {},  // eslint-disable-line no-unused-vars
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

        this[MODULES][moduleData.name] = moduleData;
    }

    load(moduleName) {
        throw new Error("NotImpelemntedError");  // return (promise) module
    }

    unload(moduleName) {
        throw new Error("NotImpelemntedError");  // return (promise)
    }

    loadAll() {
        throw new Error("NotImpelemntedError");  // return (promise) {moduleName: module, foo: ...}
    }

}

module.exports = ModulesLoader;

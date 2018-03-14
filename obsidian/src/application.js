"use strict";

const ROOT_APP = Symbol("rootApp");
const NAME = Symbol("name");
const MODULE_NAME = Symbol("moduleName");
const MODULES = Symbol("modules");
const EVENTS = Symbol("events");
const CONFIG = Symbol("config");
const LOG = Symbol("log");

/**
 * Obsidian Application
 * @public
 */
class Application {

    constructor(name="obsidian", _params={}}) {
        this[ROOT_APP] = _params[ROOT_APP] || null;
        this[name] = name;
        this[MODULE_NAME] = _params[MODULE_NAME] || "core";
        this[MODULES] = _params[MODULES] || {};
    }

    get name() {
        return this[NAME];
    }

    get moduleName() {
        return this[MODULE_NAME];
    }

    get events() {
        throw new Error("NotImplementedError");  // TODO
    }

    get config() {
        throw new Error("NotImplementedError");  // TODO
    }

    get log() {
        throw new Error("NotImplementedError");  // TODO
    }

    get modules() {
        throw new Error("NotImplementedError");  // TODO
    }

    load(module, param) {
        throw new Error("NotImplementedError");  // TODO
    }

    unload(module) {
        throw new Error("NotImplementedError");  // TODO
    }

    start() {
        throw new Error("NotImplementedError");  // TODO
    }

    _createSubApplication(moduleName, modules) {
        return new Application(this.name, {
            [ROOT_APP]: this,
            [MODULE_NAME]: moduleName,
            [MODULES]: modules,
        });
    }
}

module.exports = Application;

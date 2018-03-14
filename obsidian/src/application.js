"use strict";

const rootApp = Symbol("rootApp");
const name = Symbol("name");
const moduleName = Symbol("moduleName");
const modules = Symbol("modules");
const events = Symbol("events");
const config = Symbol("config");
const log = Symbol("log");

/**
 * Obsidian Application
 * @public
 */
class Application {

    constructor(name="obsidian", _params={}}) {
        this[rootApp] = _params[rootApp] || null;
        this[name] = name;
        this[moduleName] = _params[moduleName] || "core";
        this[modules] = _params[modules] || {};
    }

    get name() {
        return this[name];
    }

    get moduleName() {
        return this[moduleName];
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
            [rootApp]: this,
            [moduleName]: moduleName,
            [modules]: modules,
        });
    }
}

module.exports = Application;

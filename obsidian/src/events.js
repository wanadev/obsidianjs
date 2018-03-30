const ROOT = Symbol("root");
const LISTENERS = Symbol("events");
const NAMESPACE = Symbol("namespace");

/**
 * Handle Obsidian application events.
 */
class Events {

    constructor(namespace = "obsidian", dependencies = {}) {
        this[ROOT] = dependencies.rootEvents || null;
        this[NAMESPACE] = namespace;
        this[LISTENERS] = dependencies.rootEvents
            ? dependencies.rootEvents[LISTENERS]
            : {};

        this[LISTENERS][namespace] = {};
    }

    on(eventName, listener) {
        const namespace = /* eventName.split() || */ this[NAMESPACE]; // TODO

        if (!this[LISTENERS][namespace][eventName]) {
            this[LISTENERS][namespace][eventName] = [];
        } else if (this[LISTENERS][namespace][eventName].indexOf(listener) > -1) {
            return;
        }

        this[LISTENERS][namespace][eventName].push(listener);
    }

    once(eventName, listener) {
        // TODO
    }

    emit(eventName, ...args) {
        if (!this[LISTENERS][this[NAMESPACE]][eventName]) {
            return;
        }

        this[LISTENERS][this[NAMESPACE]][eventName].forEach(listener => listener(...args));
    }

    removeListener(eventName, listener) {
        const namespace = /* eventName.split() || */ this[NAMESPACE]; // TODO

        if (!this[LISTENERS][namespace][eventName]) {
            return;
        }

        const listenerIndex = this[LISTENERS][namespace][eventName].indexOf(listener);

        if (listenerIndex === -1) {
            return;
        }

        this[LISTENERS][namespace][eventName].splice(listenerIndex, 1);
    }

    /**
     * Returns a namespaced instance or proxy object of this class.
     *
     * @private
     * @param {string} namespace
     * @return {Events|Object} The namespaced version of the class.
     */
    _getNamespaced(namespace) {
        throw new Error("NotImplementedError");
    }

}

module.exports = Events;

const LISTENERS = Symbol("events");
const ON = Symbol("on");
const EMIT = Symbol("emit");
const ONCE = Symbol("once");
const REMOVE_LISTENER = Symbol("removeListener");

const ROOT_NAMESPACE = "obsidian";

const resolveEventPath = (eventPath, namespace) => (eventPath[0] === "@"
    ? eventPath.slice(1)
    : `${namespace}.${eventPath}`);

/**
 * Handle Obsidian application events.
 */
class Events {

    constructor() {
        this[LISTENERS] = {};
    }

    on(eventPath, listener) {
        this[ON](ROOT_NAMESPACE, eventPath, listener);
    }

    once(eventPath, listener) {
        this[ONCE](ROOT_NAMESPACE, eventPath, listener);
    }

    removeListener(eventPath, listener) {
        this[REMOVE_LISTENER](ROOT_NAMESPACE, eventPath, listener);
    }

    emit(eventPath, ...args) {
        this[EMIT](ROOT_NAMESPACE, eventPath, ...args);
    }

    [ON](namespace, eventPath, listener) {
        const eventId = resolveEventPath(eventPath, namespace);

        if (!this[LISTENERS][eventId]) {
            this[LISTENERS][eventId] = [];
        } else if (this[LISTENERS][eventId].indexOf(listener) > -1) {
            return;
        }
        this[LISTENERS][eventId].push(listener);
    }

    [ONCE](namespace, eventPath, listener) {
        throw new Error("NotImplementedError");
    }

    [REMOVE_LISTENER](namespace, eventPath, listener) {
        const eventId = resolveEventPath(eventPath, namespace);

        if (!this[LISTENERS][eventId]) {
            return;
        }

        const listenerIndex = this[LISTENERS][eventId].indexOf(listener);

        if (listenerIndex === -1) {
            return;
        }

        this[LISTENERS][eventId].splice(listenerIndex, 1);
    }

    [EMIT](namespace, eventPath, ...args) {
        const eventId = `${namespace}.${eventPath}`;

        if (!this[LISTENERS][eventId]) {
            return;
        }
        this[LISTENERS][eventId].forEach(listener => listener(...args));
    }

    /**
     * Returns a namespaced instance or proxy object of this class.
     *
     * @private
     * @param {string} namespace
     * @return {Events|Object} The namespaced version of the class.
     */
    _getNamespaced(namespace) {
        const namespacedEvents = {
            on: this[ON].bind(this, namespace),
            once: this[ONCE].bind(this, namespace),
            removeListener: this[REMOVE_LISTENER].bind(this, namespace),
            emit: this[EMIT].bind(this, namespace),
        };

        return namespacedEvents;
    }

}

module.exports = Events;

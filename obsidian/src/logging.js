const APP = Symbol("app");
const ROOT = Symbol("root");
const LOG = Symbol("log");

/**
 * Handle Obsidian application logging.
 */
class Logging {

    /**
     * @constructor
     */
    constructor(rootLogging = null) {
        this[ROOT] = rootLogging;
    }

    /**
     * Define the (sub)application this module will work with.
     *
     * @param {Application} app The application or sub-application.
     */
    setApp(app) {
        this[APP] = app;
    }

    /**
     * Logs an information.
     *
     * @param {*} ...args Stuff to log.
     */
    info(...args) {
        this[LOG]("info", this[APP].namespace, ...args);
    }

    /**
     * Logs a warning.
     *
     * @param {*} ...args Stuff to log.
     */
    warn(...args) {
        this[LOG]("warn", this[APP].namespace, ...args);
    }

    /**
     * Logs an error.
     *
     * @param {*} ...args Stuff to log.
     */
    error(...args) {
        this[LOG]("error", this[APP].namespace, ...args);
    }

    /**
     * Function that effectively logs.
     *
     * @private
     * @param {string} level Logging level (``info``, ``warn``, ``error``).
     * @param {string} namespace The namespace from where the log was emited.
     * @param {*} ...args Stuff to log.
     */
    [LOG](level, namespace, ...args) {
        if (this[ROOT]) {
            this[ROOT][LOG](level, namespace, ...args);
            return;
        }
        // TODO disable console on production (needs config module)
        console[level](`[${this[APP].name}][${namespace}]`, ...args);  // eslint-disable-line no-console
        this[APP].events.emit("log", level, namespace, args);
    }

    /**
     * Returns a namespaced instance or proxy object of this class.
     *
     * @private
     * @return {Logging} The namespaced version of the class.
     */
    _getNamespaced() {
        return new Logging(this);
    }

}

module.exports = Logging;

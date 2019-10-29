export = Logging;
/**
 * Handle Obsidian application logging.
 */
declare class Logging {
    constructor(rootLogging?: any);
    /**
     * Define the (sub)application this module will work with.
     *
     * @param {Application} app The application or sub-application.
     */
    setApp(app: any): void;
    /**
     * Logs an information.
     *
     * @param {*} ...args Stuff to log.
     */
    info(...args: any[]): void;
    /**
     * Logs a warning.
     *
     * @param {*} ...args Stuff to log.
     */
    warn(...args: any[]): void;
    /**
     * Logs an error.
     *
     * @param {*} ...args Stuff to log.
     */
    error(...args: any[]): void;
    /**
     * Returns a namespaced instance or proxy object of this class.
     *
     * @private
     * @return {Logging} The namespaced version of the class.
     */
    _getNamespaced(): Logging;
    /**
     * Function that effectively logs.
     *
     * @private
     * @param {string} level Logging level (``info``, ``warn``, ``error``).
     * @param {string} namespace The namespace from where the log was emited.
     * @param {*} ...args Stuff to log.
     */
    [LOG](level: string, namespace: string, ...args: any[]): void;
    [ROOT]: any;
    [APP]: any;
}
declare const LOG: unique symbol;
declare const ROOT: unique symbol;
declare const APP: unique symbol;

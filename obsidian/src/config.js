const APP = Symbol("app");

/**
 * Handle Obsidian application and modules configuration.
 */
class Config {

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
     * Returns a namespaced instance or proxy object of this class.
     *
     * @private
     * @param {string} namespace
     * @return {Config|Object} The namespaced version of the class.
     */
    _getNamespaced(namespace) {
        throw new Error("NotImplementedError");
    }

}

module.exports = Config;

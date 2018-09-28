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
     * Get config located at given path.
     *
     * @param {string} [path=""] The path of the wanted config (default ``""``)
     * @param [default_=undefined] The default value returned if the path does
     *                             not exists (default: ``undefined``)
     * @return the requested config
     */
    get(path = "", default_ = undefined) {
    }

    /**
     * Set config located at given path.
     *
     * @param {string} path The path of the wanted config
     * @param value The value to set
     */
    set(path, value) {
    }

    /**
     * Dump the config.
     *
     * @param {boolean} [onlyCustom=false] Set it to ``true`` to only dump
     *                                     custom configuration (configuration
     *                                     setted manualy using the
     *                                     :js:meth:`set` method, default =
     *                                     ``false``)
     * @return {Object} The dumped config
     */
    dump(onlyCustom = false) {
    }

    /**
     * Load the config from the given object.
     *
     * @param {Object} config The config to load
     * @param {boolean} [custom=false] Mark loaded configuration as custom
     *                                 (default = ``false``)
     */
    load(config, custom = false) {
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

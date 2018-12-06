const helpers = require("./helpers.js");

const APP = Symbol("app");
const ROOT = Symbol("root");
const CUSTOM_CONFIG = Symbol("customConfig");
const BASE_CONFIG = Symbol("baseConfig");

/**
 * Handle Obsidian application and modules configuration.
 */
class Config {

    constructor(rootConfig = null) {
        this[APP] = null;
        this[ROOT] = rootConfig;
        this[BASE_CONFIG] = {
            obsidian: {
                debug: false,
            },
            app: {},
            modules: {},
        };
        this[CUSTOM_CONFIG] = {
            obsidian: {},
            app: {},
            modules: {},
        };
    }

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
        const root = this[ROOT] || this;
        const absPath = this._resolvePath(path);  // eslint-disable-line no-underscore-dangle
        const marker = Symbol("marker");
        let value = helpers.objectGet(root[CUSTOM_CONFIG], absPath, marker);
        if (value === marker) {
            value = helpers.objectGet(root[BASE_CONFIG], absPath, marker);
        }
        if (value === marker) {
            value = default_;
        }
        return value;
    }

    /**
     * Set config located at given path.
     *
     * @param {string} path The path of the wanted config
     * @param value The value to set
     */
    set(path, value) {
        const root = this[ROOT] || this;
        const absPath = this._resolvePath(path);  // eslint-disable-line no-underscore-dangle
        helpers.objectSet(root[CUSTOM_CONFIG], absPath, value);
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
        const root = this[ROOT] || this;
        if (onlyCustom) {
            return helpers.cloneDeep(root[CUSTOM_CONFIG]);
        }
        return helpers.mergeDeep(
            helpers.cloneDeep(root[BASE_CONFIG]),
            helpers.cloneDeep(root[CUSTOM_CONFIG]),
        );
    }

    /**
     * Load the config from the given object.
     *
     * @param {Object} config The config to load
     * @param {boolean} [custom=false] Mark loaded configuration as custom
     *                                 (default = ``false``)
     */
    load(config, custom = false) {
        const root = this[ROOT] || this;
        if (custom) {
            root[CUSTOM_CONFIG] = helpers.mergeDeep(root[CUSTOM_CONFIG], config);
        } else {
            root[BASE_CONFIG] = helpers.mergeDeep(root[BASE_CONFIG], config);
        }
    }

    /**
     * Resolve the given path.
     *
     * @private
     * @param {string} path The path to resolve
     * @return {string} the resolved path
     */
    _resolvePath(path) {
        // Absolute app or obsidian config
        if (helpers.startsWith(path, "@obsidian") || helpers.startsWith(path, "@app")) {
            return path.slice(1);

        // Absolute module
        } else if (path.startsWith("@")) {
            const p = path.slice(1).split(".");
            p[0] = helpers.toCamelCase(p[0]);
            p.unshift("modules");
            return p.join(".");
        }

        // Relative module
        const p = path.split(".");
        p.unshift(helpers.toCamelCase(this[APP].namespace));
        p.unshift("modules");
        return p.join(".");
    }

    /**
     * Returns a namespaced instance or proxy object of this class.
     *
     * @private
     * @return {Config|Object} The namespaced version of the class.
     */
    _getNamespaced() {
        return new Config(this);
    }

}

module.exports = Config;

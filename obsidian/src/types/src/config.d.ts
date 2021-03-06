export = Config;
/**
 * Handle Obsidian application and modules configuration.
 */
declare class Config {
    constructor(rootConfig?: any);
    /**
     * Define the (sub)application this module will work with.
     *
     * @public
     * @param {Application} app The application or sub-application.
     */
    setApp(app: any): void;
    /**
     * Get config located at given path.
     *
     * @param {string} [path=""] The path of the wanted config (default ``""``)
     * @param [default_=undefined] The default value returned if the path does
     *                             not exists (default: ``undefined``)
     * @return the requested config
     */
    get(path?: string | undefined, default_?: any): any;
    /**
     * Set config located at given path.
     *
     * @param {string} path The path of the wanted config
     * @param value The value to set
     */
    set(path: string, value: any): void;
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
    dump(onlyCustom?: boolean | undefined): Object;
    /**
     * Load the config from the given object.
     *
     * @param {Object} config The config to load
     * @param {boolean} [custom=false] Mark loaded configuration as custom
     *                                 (default = ``false``)
     */
    load(config: Object, custom?: boolean | undefined): void;
    /**
     * Resolve the given path.
     *
     * @private
     * @param {string} path The path to resolve
     * @return {string} the resolved path
     */
    _resolvePath(path: string): string;
    /**
     * Returns a namespaced instance or proxy object of this class.
     *
     * @private
     * @return {Config|Object} The namespaced version of the class.
     */
    _getNamespaced(): Object | Config;
    [APP]: any;
    [ROOT]: any;
    [BASE_CONFIG]: {
        obsidian: {
            debug: boolean;
        };
        app: {};
        modules: {};
    };
    [CUSTOM_CONFIG]: {
        obsidian: {};
        app: {};
        modules: {};
    };
}
declare const APP: unique symbol;
declare const ROOT: unique symbol;
declare const BASE_CONFIG: unique symbol;
declare const CUSTOM_CONFIG: unique symbol;

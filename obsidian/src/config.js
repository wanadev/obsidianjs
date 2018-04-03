/**
 * Handle Obsidian application and modules configuration.
 */
class Config {

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

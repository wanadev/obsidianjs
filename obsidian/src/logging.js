/**
 * Handle Obsidian application logging.
 */
class Logging {

    /**
     * Returns a namespaced instance or proxy object of this class.
     *
     * @private
     * @param {string} namespace
     * @return {Logging|Object} The namespaced version of the class.
     */
    _getNamespaced(namespace) {
        throw new Error("NotImplementedError");
    }

}

module.exports = Logging;

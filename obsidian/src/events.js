/**
 * Handle Obsidian application events.
 */
class Events {

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

/**
 * Resolves dependencies between modules and returns the best order of loading
 * for modules.
 *
 * @public
 * @param {Object[]} modules List of module on which the resolution will be
 *                           done (``[{name: string, dependencies: [string]}]``).
 * @return {string[]}
 */
function getLoadingOrder(modules) {
    return [];  // TODO
}

module.exports = {
    getLoadingOrder,
};

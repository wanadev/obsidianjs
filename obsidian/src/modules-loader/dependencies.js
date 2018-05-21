/**
 * Generate dependency tree for the requested module.
 *
 * @param {string} moduleName The name of the module for which the dependency
 *                            tree will be generated.
 * @param {Object} modules Catalog of modules on which the resolution will be
 *                         done (``{ name: {name: string, requires: [string]} }``).
 * @return {Object} The dependency tree of the given module.
 */
function generateDependencyTree(moduleName, modules) {
}

/**
 * Transformes a dependency tree into an ordered list of module.
 *
 * @public
 * @param {Object} tree The tree to flatten
 * @return {string[]} An ordered module list.
 */
function flattenDependencyTree(tree) {
}

/**
 * Resolves dependencies between modules and returns the best order of loading
 * for modules.
 *
 * @public
 * @param {Object} modules Catalog of modules on which the resolution will be
 *                         done (``{ name: {name: string, requires: [string]} }``).
 * @return {string[]}
 */
function getLoadingOrder(modules) {
    let order = [];
    let stack = Object.keys(modules);

    while (stack.length) {
        const moduleName = stack.pop();

        // Unlisted module -> skip
        if (!modules[moduleName]) continue;

        order.push(moduleName);
        stack = stack.concat(modules[moduleName].requires);
    }

    order.reverse();
    order = order.reduce((acc, item) => (acc.includes(item) ? acc : acc.concat(item)), []);  // uniq

    return order;
}

module.exports = {
    generateDependencyTree,
    flattenDependencyTree,
    getLoadingOrder,
};

const { appendChild, isCircular, printCircularPath } = require("./helpers.js");
const { uniq } = require("../helpers.js");

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
    const tree = appendChild(null, moduleName);
    let stack = modules[moduleName].requires.map(item => [tree, item]);

    while (stack.length) {
        const [node, childName] = stack.pop();
        if (isCircular(node, childName)) {
            throw new Error(`CircularDependencyError: "${childName}" module has circular dependency: ${printCircularPath(node, childName)}`);
        } else {
            const childNode = appendChild(node, childName);
            if (modules[childName]) {
                stack = stack.concat(modules[childName].requires.map(item => [childNode, item]));
            }
        }
    }

    return tree;
}

/**
 * Transformes a dependency tree into an ordered list of module.
 *
 * @param {Object} tree The tree to flatten
 * @return {string[]} An ordered module list.
 */
function flattenDependencyTree(tree) {
    let order = [];
    let stack = [tree];

    while (stack.length) {
        const node = stack.pop();
        order.push(node.name);
        stack = stack.concat(node.children);
    }

    order.reverse();
    return order;
}

/**
 * Resolves dependencies between modules and returns the best order of loading
 * for modules.
 *
 * @param {Object} modules Catalog of modules on which the resolution will be
 *                         done (``{ name: {name: string, requires: [string]} }``).
 * @return {string[]}
 */
function getLoadingOrder(modules) {

    const modulesList = Object.keys(modules);
    let order = [];

    modulesList.forEach((moduleName) => {
        if (order.includes(moduleName)) return;  // Already resolved as an other module dependency
        const moduleDependencyTree = generateDependencyTree(moduleName, modules);
        const moduleDependencyOrder = flattenDependencyTree(moduleDependencyTree);
        order = order.concat(moduleDependencyOrder);
    });

    order = uniq(order);
    order = order.filter(moduleName => modulesList.includes(moduleName));

    return order;
}

module.exports = {
    generateDependencyTree,
    flattenDependencyTree,
    getLoadingOrder,
};

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

    function _appendChild(node, childName) {
        const childNode = {
            name: childName,
            parent: node,
            children: [],
        };
        if (node) node.children.push(childNode);
        return childNode;
    }

    function _isCircular(node, childName) {
        let currentNode = node;
        while (currentNode) {
            if (currentNode.name === childName) return true;
            currentNode = currentNode.parent;
        }
        return false;
    }

    function _printCircularPath(node, childName) {
        let path = `[${childName}]`;
        let currentNode = node;
        while (currentNode) {
            path = `${currentNode.name} -> ${path}`;
            if (currentNode.name === childName) break;
            currentNode = currentNode.parent;
        }
        return path;
    }

    const tree = _appendChild(null, moduleName);
    let stack = modules[moduleName].requires.map(item => [tree, item]);

    while (stack.length) {
        const [node, childName] = stack.pop();
        if (_isCircular(node, childName)) {
            throw new Error(`CircularDependencyError: "${childName}" module has circular dependency: ${_printCircularPath(node, childName)}`);
        } else {
            const childNode = _appendChild(node, childName);
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

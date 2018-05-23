/**
 * Creates and appends a child node on the given node.
 *
 * @param {Object} node The parent node where the child will be appended
 *                      (`{ name: string, parent: Object|null, children: [] }`).
 * @param {string} childName The name of the child.
 * @return {Object} The new child node (`{ name: string, parent: Object|null, children: [] }`).
 */
function appendChild(node, childName) {
    const childNode = {
        name: childName,
        parent: node,
        children: [],
    };
    if (node) node.children.push(childNode);
    return childNode;
}

/**
 * Checks if a node with the given name is already a parent of the given node.
 *
 * @param {Object} node The node to check (`{ name: string, parent: Object|null, children: [] }`).
 * @param {string} childName the name to check
 * @return {boolean}
 */
function isCircular(node, childName) {
    let currentNode = node;
    while (currentNode) {
        if (currentNode.name === childName) return true;
        currentNode = currentNode.parent;
    }
    return false;
}

/**
 * Generates a readable version of the circular path.
 *
 * @param {Object} node The parent node of the module that have a circular dependency
 *                      (`{ name: string, parent: Object|null, children: [] }`).
 * @param {string} childName the name of the module that have a circular dependency
 * @return {string} the circular path (e.g. `"mod1 -> mod2 -> mod3 -> [mod1]"`)
 */
function printCircularPath(node, childName) {
    let path = `[${childName}]`;
    let currentNode = node;
    while (currentNode) {
        path = `${currentNode.name} -> ${path}`;
        if (currentNode.name === childName) break;
        currentNode = currentNode.parent;
    }
    return path;
}

module.exports = {
    appendChild,
    isCircular,
    printCircularPath,
};

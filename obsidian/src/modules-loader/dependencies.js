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
    getLoadingOrder,
};

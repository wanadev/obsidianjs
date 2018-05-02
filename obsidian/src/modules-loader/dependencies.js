/**
 * Resolves dependencies between modules and returns the best order of loading
 * for modules.
 *
 * @public
 * @param {Object[]} modules List of module on which the resolution will be
 *                           done (``[{name: string, requires: [string]}]``).
 * @return {string[]}
 */
function getLoadingOrder(modules) {
    let order = [];
    const modulesIndex = modules.reduce((acc, item) => {
        acc[item.name] = item;
        return acc;
    }, {});
    let stack = modules
        .reduce((acc, item) => (acc.includes(item.name) ? acc : acc.concat(item.name)), []);  // map + uniq

    while (stack.length) {
        const moduleName = stack.pop();

        // Unlisted module -> skip
        if (!modulesIndex[moduleName]) continue;

        order.push(moduleName);
        stack = stack.concat(modulesIndex[moduleName].requires);
    }

    order.reverse();
    order = order.reduce((acc, item) => (acc.includes(item) ? acc : acc.concat(item)), []);  // uniq

    return order;
}

module.exports = {
    getLoadingOrder,
};

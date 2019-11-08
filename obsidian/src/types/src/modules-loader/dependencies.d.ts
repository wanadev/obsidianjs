/**
 * Generates the dependency tree of a given module.
 *
 * @param {string} moduleName The name of the module for which the dependency
 *                            tree will be generated.
 * @param {Object} modules Catalog of modules on which the resolution will be
 *                         done (``{ name: {name: string, requires: [string]} }``).
 * @return {Object} The dependency tree of the given module.
 */
export function generateDependencyTree(moduleName: string, modules: Object): Object;
/**
 * Transforms a dependency tree into an ordered list of modules.
 *
 * @param {Object} tree The tree to flatten
 * @return {string[]} An ordered module list.
 */
export function flattenDependencyTree(tree: Object): string[];
/**
 * Resolves dependencies between modules and returns the best order of loading
 * for modules.
 *
 * @param {Object} modules Catalog of modules on which the resolution will be
 *                         done (``{ name: {name: string, requires: [string]} }``).
 * @return {string[]}
 */
export function getLoadingOrder(modules: Object): string[];

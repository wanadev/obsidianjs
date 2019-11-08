/**
 * Transforms the given string to camelCase. The output string is a valid
 * Javascript identifier.
 *
 * @public
 * @param {string} string The kebab-case string to tranform.
 * @return {string} The transformed string.
 */
export declare function toCamelCase(string: string): string;
/**
 * Returns a duplicate-free copy of the given array.
 *
 * @param {Array} list The array to deduplicate.
 * @return {Array} The duplicate-free array.
 */
export declare function uniq(list: any[]): any[];
/**
 * Returns the value at hte given path of an object.
 *
 * @param {Object} object The object from where the value will be returned.
 * @param {string} path The path to search in the object (e.g. "foo",
 *                      "foo.bar.baz",...)
 * @param [default_=undefined] The default value to return if the path does
 *                             not exist
 * @return The value at the given path or the default value.
 */
export declare function objectGet(object: Object, path: string, default_?: any): any;
/**
 * Set the value at the given path. Creates all required parent objects.
 *
 * @param {Object} object The object where the value will be set.
 * @param {string} path The path where to set the value (e.g. "foo",
 *                      "foo.bar.baz")
 * @param value The value to set.
 */
export declare function objectSet(object: Object, path: string, value: any): void;
/**
 * Returns true if the string starts with prefix, false otherwise.
 *
 * @param {string} string The string to check
 * @param {string} prefix
 *
 * @return {boolean}
 */
export declare function startsWith(string: string, prefix: string): boolean;
/**
 * Merges object2 into object1.
 *
 * @param {Object} object1 The destination object (will be modified)
 * @param {Object} object2 The object to merge.
 *
 * @return {Object} object1
 */
export declare function mergeDeep(object1: Object, object2: Object): Object;
/**
 * Clone an object.
 *
 * @param {Object} object The object to clone
 * @return {Object} the cloned object
 */
export declare function cloneDeep(object: Object): Object;

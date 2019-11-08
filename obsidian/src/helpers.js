/**
 * Obsidian helper functions.
 */
const helpers = {

    /**
     * Transforms the given string to camelCase. The output string is a valid
     * Javascript identifier.
     *
     * @public
     * @param {string} string The kebab-case string to tranform.
     * @return {string} The transformed string.
     */
    toCamelCase(string) {
        let result = "";
        const words = string.match(/([A-Za-z][a-z0-9]+|[A-Z]{2}[A-Z0-9]*(?![a-z])|[a-zA-Z0-9])/g);

        for (let i = 0; i < words.length; i += 1) {
            const word = words[i];
            result += (i === 0) ? word[0].toLowerCase() : word[0].toUpperCase();
            result += word.slice(1, word.length).toLowerCase();
        }

        return result;
    },

    /**
     * Returns a duplicate-free copy of the given array.
     *
     * @param {Array} list The array to deduplicate.
     * @return {Array} The duplicate-free array.
     */
    uniq(list) {
        return list.filter((item, index, array) => index === array.indexOf(item));
    },

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
    objectGet(object, path, default_ = undefined) {
        const keys = path.split(".");
        let currentObj = object;
        for (let i = 0; i < keys.length; i += 1) {
            const key = keys[i];
            if (!(key in currentObj)) {
                return default_;
            }
            currentObj = currentObj[key];
        }
        return currentObj;
    },

    /**
     * Set the value at the given path. Creates all required parent objects.
     *
     * @param {Object} object The object where the value will be set.
     * @param {string} path The path where to set the value (e.g. "foo",
     *                      "foo.bar.baz")
     * @param value The value to set.
     */
    objectSet(object, path, value) {
        const keys = path.split(".");
        const lastKey = keys.pop();
        let currentObj = object;
        for (let i = 0; i < keys.length; i += 1) {
            const key = keys[i];
            if (!(key in currentObj)) {
                currentObj[key] = {};
            }
            currentObj = currentObj[key];
        }
        currentObj[lastKey] = value;
    },

    /**
     * Returns true if the string starts with prefix, false otherwise.
     *
     * @param {string} string The string to check
     * @param {string} prefix
     *
     * @return {boolean}
     */
    startsWith(string, prefix) {
        return string.indexOf(prefix) === 0;
    },

    /**
     * Merges object2 into object1.
     *
     * @param {Object} object1 The destination object (will be modified)
     * @param {Object} object2 The object to merge.
     *
     * @return {Object} object1
     */
    mergeDeep(object1, object2) {

        function _isObject(obj) {  // eslint-disable-line no-underscore-dangle
            return typeof obj === "object"
                   && obj !== null
                   && !Array.isArray(obj)
                   && !(obj instanceof Date)
                   && !(obj instanceof RegExp);
        }

        Object.keys(object2).forEach((key) => {
            if (_isObject(object2[key])) {
                if (!_isObject(object1[key])) {
                    object1[key] = {};  // eslint-disable-line no-param-reassign
                }
                helpers.mergeDeep(object1[key], object2[key]);
            } else {
                object1[key] = object2[key];  // eslint-disable-line no-param-reassign
            }
        });

        return object1;
    },

    /**
     * Clone an object.
     *
     * @param {Object} object The object to clone
     * @return {Object} the cloned object
     */
    cloneDeep(object) {
        return JSON.parse(JSON.stringify(object));
    },

};

module.exports = helpers;

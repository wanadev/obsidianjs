/**
 * Obsidian helper functions.
 */
const helpers = {

    /**
     * Transforms the given string to camelCase. The output string is a valid
     * Javascript identifier.
     *
     * @public
     * @param {String} string The kebab-case string to tranform.
     * @return {String} The transformed string.
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
        return list.reduce((acc, item) => (acc.includes(item) ? acc : acc.concat(item)), []);
    },

};

module.exports = helpers;

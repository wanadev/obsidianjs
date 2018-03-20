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
        const words = string.match(/[a-z]+[0-9]*/gi);

        for (let i = 0; i < words.length; i += 1) {
            const word = words[i];
            result += (i === 0) ? word[0].toLowerCase() : word[0].toUpperCase();
            result += word.slice(1, word.length).toLowerCase();
        }

        return result;
    },

};

module.exports = helpers;

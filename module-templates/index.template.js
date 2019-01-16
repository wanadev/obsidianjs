module.exports = {

    name: "{{dashCase name}}",
    requires: [],

    load() {
        const {{camelCase name}} = require("./src/{{dashCase name}}.js");  // eslint-disable-line global-require
        return new {{camelCase name}}();
    },

    unload() {
        // pass
    },

};

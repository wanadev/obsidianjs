module.exports = {

    name: "sentry",
    requires: [],

    load() {
        const Sentry = require("./src/sentry.js");  // eslint-disable-line global-require
        return new Sentry();
    },

    unload() {
        // pass
    },

};

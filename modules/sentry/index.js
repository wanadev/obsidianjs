module.exports = {

    name: "sentry",
    requires: [],

    config: {
        dsnKey: null,
        capturedLevels: ["error"],
        userInfos: {},
    },

    load() {
        const Sentry = require("./src/sentry.js").default;  // eslint-disable-line global-require
        return new Sentry();
    },

    unload() {
        // pass
    },

};

module.exports = {

    name: "sentry",
    requires: [],

    config: {
        dsnKey: null,
        capturedLevels: ["fatal"],
        userInfos: {},
    },

    load() {
        const Sentry = require("./src/sentry.js");  // eslint-disable-line global-require
        return new Sentry();
    },

    unload() {
        // pass
    },

};

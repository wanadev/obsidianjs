module.exports = {

    name: "history",
    requires: ["data-store"],

    load() {
        const History = require("./src/history").default; // eslint-disable-line global-require
        return new History();
    },

    unload() {
        // pass
    },

};

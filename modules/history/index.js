module.exports = {

    name: "history",
    requires: ["data-store"],

    config: {
        maxLength: 50,
    },


    load() {
        const History = require("./src/history"); // eslint-disable-line global-require
        return new History();
    },

    unload() {
        // pass
    },

};

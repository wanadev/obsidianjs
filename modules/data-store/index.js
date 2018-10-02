module.exports = {

    name: "data-store",
    requires: [],

    load() {
        const DataStore = require("./src/data-store").default; // eslint-disable-line global-require
        return new DataStore();
    },

    unload() {
        // pass
    },

};

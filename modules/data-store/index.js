const DataStore = require("./src/data-store");

export default {

    name: "data-store",
    requires: [],

    load() {
        return new DataStore();
    },

    unload() {
        // pass
    },

};

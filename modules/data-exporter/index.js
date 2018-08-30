module.exports = {

    name: "data-exporter",
    requires: ["data-store"],

    load() {
        const DataExporter = require("./src/data-exporter.js");  // eslint-disable-line global-require
        return new DataExporter();
    },

    unload() {
        // pass
    },

};

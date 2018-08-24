const DataExporter = require("./data-exporter.js");

module.exports = {

    name: "data-exporter",
    requires: ["data-store"],

    load() {
        return new DataExporter();
    },

    unload() {
        // pass
    },

};

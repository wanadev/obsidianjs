const ObisidianProjectFile = require("obsidian-file");

module.exports = {

    name: "data-exporter",
    requires: ["data-store"],

    config: {
        type: "GENERIC",
        metadataFormat: ObisidianProjectFile.FORMAT_JSON_DEFLATE,
        projectFormat: ObisidianProjectFile.FORMAT_JSON_DEFLATE,
        blobIndexFormat: ObisidianProjectFile.FORMAT_JSON_DEFLATE,
    },

    load() {
        const DataExporter = require("./src/data-exporter.js");  // eslint-disable-line global-require
        return new DataExporter();
    },

    unload() {
        // pass
    },

};

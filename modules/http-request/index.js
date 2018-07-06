const httpRequest = require("obsidian-http-request");

module.exports = {

    name: "http-request",
    requires: [],

    load() {
        // TODO Make proxy route configurable when config available
        return httpRequest;
    },

    unload() {
        // pass
    },

};

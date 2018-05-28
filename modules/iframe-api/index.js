const ObsidianApi = require("obsidian-api");

let api = null;

module.exports = {

    name: "iframe-api",
    requires: [],

    load(app) {
        if (api) return api;

        api = new ObsidianApi();

        if (app.isStarted) {
            setTimeout(api.ready, 1);  // deferred
        } else {
            app.events.on("ready", api.ready);
        }

        return api;
    },

    unload() {
        // pass
    },

};

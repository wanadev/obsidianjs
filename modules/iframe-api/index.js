const ObsidianApi = require("obsidian-api");

let api = null;

module.exports = {

    name: "iframe-api",
    requires: [],

    load(app) {
        if (api) {
            app.log.warn("Iframe API should be loaded only once!");
            return api;
        }

        api = new ObsidianApi();

        if (app.isStarted) {
            app.log.warn("Iframe API may not be loaded after the application started!");
            setTimeout(api.ready, 1);  // deferred
        } else {
            app.events.on("@obsidian.ready", api.ready);
        }

        return api;
    },

    unload() {
        // pass
    },

};

const stonejs = require("stonejs");

module.exports = {

    name: "stonejs",
    requires: [],

    config: {
        initialLang: "C",
    },

    load(app) {
        stonejs.setLocale(app.config.get("initialLang"));
        document.addEventListener("stonejs-locale-changed", () => {
            app.events.emit("locale-changed", stonejs.getLocale());
        });
        return stonejs;
    },

    unload() {
        // pass
    },

};

const stonejs = require("stonejs");

module.exports = {
    app: {
        config: {
            get() {
                return "C";
            },
        },
        events: {
            emit: jest.fn(),
        },
    },
    load(app) {
        stonejs.setLocale(app.config.get("initialLang"));
        document.addEventListener("stonejs-locale-changed", () => {
            app.events.emit("locale-changed", stonejs.getLocale());
        });
        return stonejs;
    },
};

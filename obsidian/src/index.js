const Application = require("./application.js");
const ModulesLoader = require("./modules-loader.js");
const Config = require("./config.js");
const Events = require("./events.js");
const Logging = require("./logging.js");

/**
 * Obsidian application factory.
 *
 * @param {string} [name=obsidian] The name of the application (default: ``"obsidian"``).
 * @return {Application} A new Obsidian application.
 */
function obsidian(name) {
    return new Application(name, undefined, {
        modulesLoader: new ModulesLoader(),
        config: new Config(),
        events: new Events(),
        log: new Logging(),
    });
}

module.exports = obsidian;

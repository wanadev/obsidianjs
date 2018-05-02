const Application = require("./application");
const { ModulesLoader } = require("./modules-loader");
const Config = require("./config");
const { Events } = require("./events");
const Logging = require("./logging");

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

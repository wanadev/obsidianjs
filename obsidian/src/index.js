const Application = require("./application.js");
const ModulesLoader = require("./modules-loader.js");

/**
 * Obsidian application factory.
 *
 * @param {String} [name="obsidian"] The name of the application (default: ``"obsidian"``).
 * @return {Application} A new Obsidian application.
 */
function obsidian(name = "obsidian") {
    return new Application(name, undefined, {
        modulesLoader: new ModulesLoader(),
        // config: ,
        // events: ,
        // log: ,
    });
}

module.exports = obsidian;

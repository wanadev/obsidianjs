const Application = require("./application.js");

/**
 * Obsidian application factory.
 *
 * @param {String} [name="obsidian"] The name of the application (default: ``"obsidian"``).
 * @return {Application} A new Obsidian application.
 */
function obsidian(name = "obsidian") {
    return new Application(name);
}

module.exports = obsidian;

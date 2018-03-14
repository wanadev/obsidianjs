"use strict";

const Application = require("./application.js");

/**
 * Obsidian application factory
 *
 * @public
 * @param {String} [name="obsidian"]
 * @return {Application}
 */
function obsidian(name="obsidian") {
    return new Application(name)
}

module.exports = obsidian;

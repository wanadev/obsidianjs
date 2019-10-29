export = obsidian;
/**
 * Obsidian application factory.
 *
 * @public
 * @param {string} [name=obsidian] The name of the application (default: ``"obsidian"``).
 * @return {Application} A new Obsidian application.
 */
declare function obsidian(name?: string | undefined): import("./application");

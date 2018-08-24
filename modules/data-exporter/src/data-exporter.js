const ObisidianProjectFile = require("obsidian-file");

const DEFAULT_CONFIG = {
    projectType: "GENERIC",
    metadataFormat: ObisidianProjectFile.FORMAT_JSON_DEFLATE,
    projectFormat: ObisidianProjectFile.FORMAT_JSON_DEFLATE,
    blobIndexFormat: ObisidianProjectFile.FORMAT_JSON_DEFLATE,
};

/**
 * Export (and import) data from the data-store module as an Obsidian Project
 * File.
 */
class DataExporter {

    /**
     * Exports data from the data-store module as an Obsidian Project File.
     *
     * @param {object} [metadata={}] Metadata that will be stored in the Obsidian Project File.
     * @param {object} [options={}] Options related to the Obsidian Project File generation.
     * @param {string} [options.projectType="GENERIC"] The type of the project
     *                 (see Obsidian Project File spec).
     * @param {number} [options.metadataFormat=ObisidianProjectFile.FORMAT_JSON_DEFLATE] The
     *                 format of the ``metadata`` section (see Obsidian Project File spec).
     * @param {number} [options.projectFormat=ObisidianProjectFile.FORMAT_JSON_DEFLATE] The
     *                 format of the ``project`` section (see Obsidian Project File spec).
     * @param {number} [options.blobIndexFormat=ObisidianProjectFile.FORMAT_JSON_DEFLATE] The
     *                 format of the ``blobIndex`` section (see Obsidian Project File spec).
     * @return {Buffer} The Obsidian Project File as a Node.js Buffer.
     */
    export(metadata = {}, options = {}) {
        // TODO Also merge options from config when available
        const mergedOptions = Object.assign({}, DEFAULT_CONFIG, options);
        // TODO
    }

    /**
     * Same as the :js:meth:`export` method but returns a Blob.
     */
    exportAsBlob(metadata = {}, options = {}) {
        // TODO
    }

    /**
     * Same as the :js:meth:`export` method but returns a data64-encoded string.
     */
    exportAsData64(metadata = {}, options = {}) {
        // TODO
    }

    /**
     * Imports data from an Obsidian Project file to the data-store module.
     *
     * @param {Buffer} obsidianProjectFile The Obsidian Project File as a Node.js Buffer.
     */
    import(obsidianProjectFile) {
        // TODO
    }

    /**
     * Same as the :js:meth:`import` method but takes a Blob.
     */
    importFromBlob(obsidianProjectFile) {
        // TODO
    }

    /**
     * Same as the :js:meth:`import` method but takes a data64-encoded string.
     */
    importFromData64(obsidianProjectFile) {
        // TODO
    }

}

module.exports = DataExporter;

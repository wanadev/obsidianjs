const ObisidianProjectFile = require("obsidian-file");

const self = require("../index.js");

const DEFAULT_CONFIG = {
    type: "GENERIC",
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
    export(metadata = {}, options = {}) {  // eslint-disable-line class-methods-use-this
        const { dataStore } = self.app.modules;
        const mergedOptions = Object.assign({}, DEFAULT_CONFIG, options);
        // TODO Also merge options from config when available
        // TODO Also merge metadata when data-store implement them
        const project = new ObisidianProjectFile();
        project.type = mergedOptions.type;
        project.metadata = metadata;
        project.project = dataStore.serializeEntities();
        return project.exportAsBlob(mergedOptions);
    }

    /**
     * Same as the :js:meth:`export` method but returns a Blob.
     */
    exportAsBlob(metadata = {}, options = {}) {
        const projectBuffer = this.export(metadata, options);
        const projectBlob = new Blob([projectBuffer], { type: ObisidianProjectFile.MIMETYPE });
        return projectBlob;
    }

    /**
     * Same as the :js:meth:`export` method but returns a data64-encoded string.
     */
    exportAsData64(metadata = {}, options = {}) {
        const projectBuffer = this.export(metadata, options);
        const projctData64 = projectBuffer.toString("base64");
        return projctData64;
    }

    /**
     * Imports data from an Obsidian Project file to the data-store module.
     *
     * @param {Buffer} obsidianProjectFile The Obsidian Project File as a Node.js Buffer.
     */
    import(obsidianProjectFile) {  // eslint-disable-line class-methods-use-this
        const { dataStore } = self.app.modules;

        const project = new ObisidianProjectFile(obsidianProjectFile);

        dataStore.clear();
        dataStore.unserializeEntities(project.project);
    }

    /**
     * Same as the :js:meth:`import` method but takes a Blob.
     *
     * .. WARNING::
     *
     *    Reading Blobs is an asynchronous operation, so this method is
     *    asynchronous and returns a promise.
     *
     * @return {Promise.<undefined>}
     */
    importFromBlob(obsidianProjectFile) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onloadend = () => {
                if (reader.readyState !== 2) {  // 2 -> DONE
                    return;
                }
                const projectBuffer = Buffer.from(reader.result);
                this.import(projectBuffer);
                resolve();
            };
            reader.readAsArrayBuffer(obsidianProjectFile);
        });
    }

    /**
     * Same as the :js:meth:`import` method but takes a data64-encoded string.
     */
    importFromData64(obsidianProjectFile) {
        const projectBuffer = Buffer.from(obsidianProjectFile, "base64");
        this.import(projectBuffer);
    }

}

module.exports = DataExporter;

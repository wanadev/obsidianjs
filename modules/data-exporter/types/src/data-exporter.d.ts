export = DataExporter;
/**
 * Export (and import) data from the data-store module as an Obsidian Project
 * File.
 */
declare class DataExporter {
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
    export(metadata?: any, options?: {
        projectType?: string;
        metadataFormat?: number;
        projectFormat?: number;
        blobIndexFormat?: number;
    } | undefined): any;
    /**
     * Same as the :js:meth:`export` method but returns a Blob.
     */
    exportAsBlob(metadata?: {}, options?: {}): Blob;
    /**
     * Same as the :js:meth:`export` method but returns a data64-encoded string.
     */
    exportAsData64(metadata?: {}, options?: {}): any;
    /**
     * Imports data from an Obsidian Project file to the data-store module.
     *
     * @param {Buffer} obsidianProjectFile The Obsidian Project File as a Node.js Buffer.
     */
    import(obsidianProjectFile: any): void;
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
    importFromBlob(obsidianProjectFile: any): Promise<undefined>;
    /**
     * Same as the :js:meth:`import` method but takes a data64-encoded string.
     */
    importFromData64(obsidianProjectFile: any): void;
}

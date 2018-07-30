const SerializableClass = require("abitbol-serializable");

/**
 * A structure that can be added to a ProjectManager.
 *
 * @class obsidian-project.lib.structure
 * @extends abitbol-serializable
 */
const Structure = SerializableClass.$extend({
    __name__: "Structure",

    /**
     * @property store
     * @readOnly
     */
    getStore() {
        return this.$data._store; // eslint-disable-line
    },

    /**
     * @property layer
     * @readOnly
     * @type obsidian-project.lib.structure[]
     */
    getPath() {
        return this.$data._path; // eslint-disable-line
    },

    /**
     * @method destroy
     */
    destroy() {
        if (this.project) {
            this.project.removeStructure(this);
        }
    },
});

SerializableClass.$register(Structure);

module.exports = Structure;

const SerializableClass = require("abitbol-serializable");

/**
 * A structure that can be added to a ProjectManager.
 *
 * @class obsidian-project.lib.structure
 * @extends abitbol-serializable
 */
const Entity = SerializableClass.$extend({
    __name__: "Entity",

    __init__(params) {
        this.$data._store = null; // eslint-disable-line
        this.$data._path = null; // eslint-disable-line
        this.$super(params);
    },

    /**
     * @property store
     * @readOnly
     */
    getStore() {
        return this.$data._store; // eslint-disable-line
    },

    /**
     * @property path
     * @readOnly
     * @type string
     */
    getPath() {
        return this.$data._path; // eslint-disable-line
    },

    /**
     * Destroys the entity from the project
     *
     * @method destroy
     */
    destroy() {
        // TODO
    },

});

SerializableClass.$register(Entity);

module.exports = Entity;

import { DATA_STORE, ENTITY_PATH } from "./symbols";

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
        this.$data[DATA_STORE] = null;
        this.$data[ENTITY_PATH] = null;
        this.$super(params);
    },

    /**
     * @property store
     * @readOnly
     */
    getStore() {
        return this.$data[DATA_STORE];
    },

    /**
     * @property path
     * @readOnly
     * @type string
     */
    getPath() {
        return this.$data[ENTITY_PATH];
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

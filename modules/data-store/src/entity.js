import STORE_SYMBOLS from "./symbols";

const SerializableClass = require("abitbol-serializable");

const STORE = STORE_SYMBOLS.STORE; // eslint-disable-line prefer-destructuring
const PATH = STORE_SYMBOLS.PATH; // eslint-disable-line prefer-destructuring

/**
 * A structure that can be added to a ProjectManager.
 *
 * @class obsidian-project.lib.structure
 * @extends abitbol-serializable
 */
const Entity = SerializableClass.$extend({
    __name__: "Entity",

    __init__(params) {
        this.$data[STORE] = null;
        this.$data[PATH] = null;
        this.$super(params);
    },

    /**
     * @property store
     * @readOnly
     */
    getStore() {
        return this.$data[STORE];
    },

    /**
     * @property path
     * @readOnly
     * @type string
     */
    getPath() {
        return this.$data[PATH];
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

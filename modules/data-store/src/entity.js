import { DATA_STORE, ENTITY_PATH } from "./symbols";

const SerializableClass = require("abitbol-serializable");

/**
 * A structure that can be added to a DataStore.
 *
 * @class Entity
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
     * The data-store instance where the entity is stored
     * @member store
     * @readOnly
     * @type DataStore
     */
    getStore() {
        return this.$data[DATA_STORE];
    },

    /**
     * Returns the path where the entity must be stored
     * @member path
     * @readOnly
     * @type string
     */
    getPath() {
        return this.$data[ENTITY_PATH];
    },

    /**
     * Destroys the entity and removes it from the project
     */
    destroy() {
        // TODO
    },

});

SerializableClass.$register(Entity);

module.exports = Entity;

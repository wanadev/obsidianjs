
/**
 * Stores project's entities and blobs.
 */
class DataStore {

    /**
     * Add an entity to the store.
     *
     * @param {SerializableClass} entity The entity
     * @param {string} path Path where the entity will be stored
     *                      (default=``"/"``)
     * @return {undefined}
     */
    addEntity(entity, path = "/") {
        // TODO emit an event ("entity-added" with the entity in param)
    }

    /**
     * Remove an entity to the store.
     *
     * @param {SerializableClass|string} entity The entity or its id
     * @return {undefined}
     */
    removeEntity(entity) {
        // TODO emit an event ("entity-removed" with the entity in param)
    }

    /**
     * Get an entity
     *
     * @param {string} id The entity ID.
     */
    getEntity(id) {
        // TODO
    }

    /**
     * List entities that matches the given path. (e.g.: ``"/"``, ``"/*"``
     * ``"/models/*"``).
     *
     * @param {string} path The path to list (accepts globing).
     * @return {array[string]} The ID of the mathing entities.
     */
    listEntities(path = "/") {
        // TODO
    }

    /**
     * Clear the store (remove all entities and blobs stored in the data
     * store).
     *
     * @return {undefined}
     */
    clear() {
        // TODO emit an event ("store-cleared")
    }

    /**
     * Serialize all stored entities.
     *
     * @return {string} The entities serialized as JSON.
     */
    serializeEntities() {  // → string (JSON)
        // TODO
    }

    /**
     * Unserialize entities from given JSON (the unserialized entities are
     * added to the store).
     *
     * @param {string} serializedEntities The entities serialized as JSON
     * @return {undefined}
     */
    unserializeEntities(serializeEntities) {
        // TODO
    }

    // TODO blob parts...

}

module.exports = DataStore;


import serializer from "abitbol-serializable/lib/serializer";
import minimatch from "minimatch";


/**
 * Stores project's entities and blobs.
 */
class DataStore {

    constructor() {
        this.entitiesByPath = {};
        this.entitiesByUuid = {};
    }

    /**
     * Add an entity to the store.
     *
     * @param {Entity} entity The entity
     * @param {string} path Path where the entity will be stored
     *                      (default=``"/"``)
     * @return {undefined}
     */
    addEntity(entity, path = "/") {
        if (!this.entitiesByPath[path]) {
            this.entitiesByPath[path] = [];
        }
        entity.$data._path = path; // eslint-disable-line
        this.entitiesByPath[path].push(entity);
        this.entitiesByUuid[entity.id] = entity;
        // TODO add "path" property to entity and assign the path value
        // TODO emit an event ("entity-added" with the entity in param)
    }


    /**
     * Remove an entity from the store.
     *
     * @param {Entity|string} entity The entity or its id
     * @return {undefined}
     */
    removeEntity(entity) {
        let id;
        let realEntity;
        if ((typeof entity) === "string") {
            id = entity;
            realEntity = this.entitiesByUuid[id];
        } else {
            id = entity.id; // eslint-disable-line prefer-destructuring
            realEntity = entity;
        }
        const path = this.entitiesByUuid[id].getPath();
        delete this.entitiesByUuid[id];
        const index = this.entitiesByPath[path].indexOf(realEntity);
        this.entitiesByPath[path].splice(index, 1);
        if (this.entitiesByPath[path].length === 0) {
            delete this.entitiesByPath[path];
        }
        delete realEntity.$data._path; // eslint-disable-line
        // TODO emit an event ("entity-removed" with the entity in param)
    }

    /**
     * Get an entity
     *
     * @param {string} id The entity ID.
     */
    getEntity(id) {
        return this.entitiesByUuid[id];
    }

    /**
     * List entities that matches the given path. (e.g.: ``"/"``, ``"/*"``
     * ``"/models/*"``).
     *
     * @param {string} path The path to list (accepts globing).
     * @return {array[string]} The ID of the mathing entities.
     */
    listEntities(path = "/**") {
        const list = Object.keys(this.entitiesByPath);
        const filteredList = minimatch.match(list, path);
        const entityList = [];
        filteredList.forEach(
            (keyPath) => {
                this.entitiesByPath[keyPath].forEach(
                    (entity) => {
                        entityList.push(entity);
                    },
                );
            },
        );
        return entityList;
        // TODO find a way to glob "/tata" and "/tata/toto"
    }

    /**
     * Clear the store (remove all entities and blobs stored in the data
     * store).
     *
     * @return {undefined}
     */
    clear() {
        const uuids = Object.keys(this.entitiesByUuid);
        uuids.forEach(
            this.removeEntity.bind(this),
        );
    }

    /**
     * Serialize all stored entities.
     *
     * @return {string} The entities serialized as JSON.
     */
    serializeEntities() {  // → string (JSON)
        return JSON.stringify(serializer.objectSerializer(this.entitiesByPath));
    }

    /**
     * Unserialize entities from given JSON (the unserialized entities are
     * added to the store).
     *
     * @param {string} serializedEntities The entities serialized as JSON
     * @return {undefined}
     */
    unserializeEntities(serializedEntities) {
        const unserialized = serializer.objectUnserializer(JSON.parse(serializedEntities));
        Object.keys(unserialized).forEach((path) => {
            unserialized[path].forEach((entity) => {
                this.addEntity(entity, path);
            });
        });
    }

    // TODO blob parts...

}

module.exports = DataStore;

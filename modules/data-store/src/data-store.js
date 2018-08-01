import serializer from "abitbol-serializable/lib/serializer";
import minimatch from "minimatch";

import { ENTITIES_BY_PATH, ENTITIES_BY_UUID, ENTITY_PATH } from "./symbols";

/**
 * Stores project's entities and blobs.
 */
class DataStore {

    constructor() {
        this[ENTITIES_BY_PATH] = {};
        this[ENTITIES_BY_UUID] = {};
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
        if (!this[ENTITIES_BY_PATH][path]) {
            this[ENTITIES_BY_PATH][path] = [];
        }
        entity.$data[ENTITY_PATH] = path; // eslint-disable-line
        this[ENTITIES_BY_PATH][path].push(entity);
        this[ENTITIES_BY_UUID][entity.id] = entity;
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
            realEntity = this[ENTITIES_BY_UUID][id];
        } else {
            id = entity.id; // eslint-disable-line prefer-destructuring
            realEntity = entity;
        }
        const path = this[ENTITIES_BY_UUID][id].getPath();
        delete this[ENTITIES_BY_UUID][id];
        const index = this[ENTITIES_BY_PATH][path].indexOf(realEntity);
        this[ENTITIES_BY_PATH][path].splice(index, 1);
        if (this[ENTITIES_BY_PATH][path].length === 0) {
            delete this[ENTITIES_BY_PATH][path];
        }
        delete realEntity.$data[ENTITY_PATH]; // eslint-disable-line
        // TODO emit an event ("entity-removed" with the entity in param)
    }

    /**
     * Get an entity
     *
     * @param {string} id The entity ID.
     */
    getEntity(id) {
        return this[ENTITIES_BY_UUID][id];
    }

    /**
     * List entities that matches the given path. (e.g.: ``"/"``, ``"/*"``
     * ``"/models/*"``).
     *
     * @param {string} path The path to list (accepts globing).
     * @return {array[string]} The ID of the mathing entities.
     */
    listEntities(path = "/**") {
        const list = Object.keys(this[ENTITIES_BY_PATH]);
        const filteredList = minimatch.match(list, path);
        const entityList = [];
        filteredList.forEach(
            (keyPath) => {
                this[ENTITIES_BY_PATH][keyPath].forEach(
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
        const uuids = Object.keys(this[ENTITIES_BY_UUID]);
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
        return JSON.stringify(serializer.objectSerializer(this[ENTITIES_BY_PATH]));
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

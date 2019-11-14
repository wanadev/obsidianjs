const uuidv4 = require("uuid/v4");
const serializer = require("abitbol-serializable/lib/serializer");
const SerializableClass = require("abitbol-serializable");
const minimatch = require("minimatch");
const nativeSerializer = require("./simple-serializer").default;
const self = require("../index.js");

const Entity = require("./entity");

const {
    ENTITIES_BY_PATH, ENTITIES_BY_UUID, ENTITY_PATH, ENTITY_STORE,
} = require("./symbols");

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
        if (!entity.$data) {
            entity.$data = {}; // eslint-disable-line no-param-reassign
        }
        entity.$data[ENTITY_PATH] = path; // eslint-disable-line no-param-reassign
        entity.$data[ENTITY_STORE] = this; // eslint-disable-line no-param-reassign
        if (!entity.id) {
            entity.id = uuidv4(); // eslint-disable-line no-param-reassign
        }
        this[ENTITIES_BY_PATH][path].push(entity);
        this[ENTITIES_BY_UUID][entity.id] = entity;
        self.app.events.emit("entity-added", entity);
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
        // eslint-disable-next-line prefer-destructuring
        const path = this[ENTITIES_BY_UUID][id].$data[ENTITY_PATH];
        delete this[ENTITIES_BY_UUID][id];
        const index = this[ENTITIES_BY_PATH][path].indexOf(realEntity);
        this[ENTITIES_BY_PATH][path].splice(index, 1);
        if (this[ENTITIES_BY_PATH][path].length === 0) {
            delete this[ENTITIES_BY_PATH][path];
        }
        realEntity.$data[ENTITY_PATH] = null;
        realEntity.$data[ENTITY_STORE] = null;
        self.app.events.emit("entity-removed", realEntity);
    }

    /**
     * Get an entity
     *
     * @param {string} id The entity ID.
     * @return {Entity|undefined}
     */
    getEntity(id) {
        return this[ENTITIES_BY_UUID][id];
    }

    /**
     * List entities that matches the given path. (e.g.: ``"/"``, ``"/*"``
     * ``"/models/*"``).
     *
     * @param {string} path The path to list (accepts globing).
     * @return {Entity[]} An array of the matching entities.
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
     * @return {Object} The serialized entities.
     */
    serializeEntities() {  // → string (JSON)
        const { nativeEntities, otherEntities } = nativeSerializer.extractNativeEntities(
            this[ENTITIES_BY_PATH],
        );
        return {
            ...nativeSerializer.objectSerializer(nativeEntities),
            ...serializer.objectSerializer(otherEntities),
        };
    }

    /**
     * Unserialize entities from given JSON (the unserialized entities are
     * added to the store).
     *
     * @param {string} serializedEntities The entities serialized as JSON
     * @return {undefined}
     */
    unserializeEntities(serializedEntities) {
        const { nativeEntities, otherEntities } = nativeSerializer.extractNativeEntities(
            serializedEntities,
        );
        const unserialized = {
            ...nativeSerializer.objectUnserializer(nativeEntities),
            ...serializer.objectUnserializer(otherEntities),
        };
        Object.keys(unserialized).forEach((path) => {
            unserialized[path].forEach((entity) => {
                this.addEntity(entity, path);
            });
        });
    }

    unserializeEntity(serializedEntity) { // eslint-disable-line class-methods-use-this
        const NativeClass = nativeSerializer.isSerializedNative(serializedEntity);
        if (NativeClass) {
            return nativeSerializer.unserializeEntity(serializedEntity, NativeClass);
        }
        return SerializableClass.$unserialize(serializedEntity);
    }


    /**
     * Returns the Entity abitbol-class used in the data-store
     * @return {Entity}
     */
    get Entity() {  // eslint-disable-line class-methods-use-this
        return Entity;
    }

    isSerializedNative(serializedEntity) {
        return nativeSerializer.isSerializedNative(serializedEntity);
    }

}

export default DataStore;

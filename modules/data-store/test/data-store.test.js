import { ENTITIES_BY_PATH, ENTITIES_BY_UUID, ENTITY_STORE } from "../src/symbols";

const DataStore = require("../src/data-store.js");
const Entity = require("../src/entity");

describe("DataStore.addEntity", () => {

    test("stores entity into an object", () => {
        const dataStore = new DataStore();
        const entity = new Entity({ id: "entity-0" });
        dataStore.addEntity(entity, "/tata");
        const object = {
            "/tata": [entity],
        };
        expect(dataStore[ENTITIES_BY_PATH]).toEqual(object);
    });

    test("can add many entities in same path", () => {
        const dataStore = new DataStore();
        const entity = new Entity({ id: "entity-0" });
        const entity1 = new Entity({ id: "entity-1" });
        const entity2 = new Entity({ id: "entity-2" });
        const entity3 = new Entity({ id: "entity-3" });
        dataStore.addEntity(entity, "/tata");
        dataStore.addEntity(entity1, "/tata");
        dataStore.addEntity(entity3, "/toto");
        dataStore.addEntity(entity2, "/tata/titi");
        const object = {
            "/tata": [entity, entity1],
            "/tata/titi": [entity2],
            "/toto": [entity3],
        };
        expect(dataStore[ENTITIES_BY_PATH]).toEqual(object);
    });

    test("stores entities by UUID", () => {
        const dataStore = new DataStore();
        const entity = new Entity({ id: "entity-0" });
        dataStore.addEntity(entity, "/tata");
        expect(dataStore[ENTITIES_BY_UUID][entity.id]).toBe(entity);
    });

    test("stores entities by path", () => {
        const dataStore = new DataStore();
        const entity = new Entity({ id: "entity-0" });
        dataStore.addEntity(entity, "/tata");
        const index = dataStore[ENTITIES_BY_PATH]["/tata"].indexOf(entity);
        expect(dataStore[ENTITIES_BY_UUID][entity.id]).toBe(dataStore[ENTITIES_BY_PATH]["/tata"][index]);
        expect(dataStore[ENTITIES_BY_PATH]["/tata"][index]).toBe(entity);
    });

    test("updates entity path", () => {
        const dataStore = new DataStore();
        const entity = new Entity({ id: "entity-0" });
        dataStore.addEntity(entity, "/tata");
        expect(entity.getPath()).toBe("/tata");
    });

    test("updates store reference in entities", () => {
        const dataStore = new DataStore();
        const entity = new Entity({ id: "entity-0" });
        dataStore.addEntity(entity, "/tata");
        expect(entity.$data[ENTITY_STORE]).toEqual(dataStore);
    });

});

describe("DataStore.removeEntity", () => {

    test("removes entities from store", () => {
        const dataStore = new DataStore();
        const entity = new Entity({ id: "entity-0" });
        const entity1 = new Entity({ id: "entity-1" });
        dataStore.addEntity(entity, "/tata");
        dataStore.addEntity(entity1, "/tata");
        dataStore.removeEntity(entity.id);
        expect(dataStore[ENTITIES_BY_PATH]["/tata"]).not.toContain(entity);
    });

    test("removes path array when empty", () => {
        const dataStore = new DataStore();
        const entity = new Entity({ id: "entity-0" });
        const entity1 = new Entity({ id: "entity-1" });
        dataStore.addEntity(entity, "/tata");
        dataStore.addEntity(entity1, "/tata");
        dataStore.removeEntity(entity.id);
        dataStore.removeEntity(entity1.id);
        expect(dataStore[ENTITIES_BY_PATH]["/tata"]).toBeUndefined();
    });

    test("removes entity reference from 'by-UUID' object", () => {
        const dataStore = new DataStore();
        const entity = new Entity({ id: "entity-0" });
        dataStore.addEntity(entity, "/tata");
        dataStore.removeEntity(entity.id);
        expect(dataStore[ENTITIES_BY_UUID][entity.id]).toBeUndefined();
    });

    test("removes entity path", () => {
        const dataStore = new DataStore();
        const entity = new Entity({ id: "entity-0" });
        dataStore.addEntity(entity, "/tata");
        dataStore.removeEntity(entity.id);
        expect(entity.getPath()).toBeNull();
    });

    test("removes store reference from entities", () => {
        const dataStore = new DataStore();
        const entity = new Entity({ id: "entity-0" });
        dataStore.addEntity(entity, "/tata");
        dataStore.removeEntity(entity.id);
        expect(entity.$data[ENTITY_STORE]).toBeNull();
    });

    test("can remove entity by giving the entity itself in parameter", () => {
        const dataStore = new DataStore();
        const entity = new Entity({ id: "entity-0" });
        const entity1 = new Entity({ id: "entity-1" });
        dataStore.addEntity(entity, "/tata");
        dataStore.addEntity(entity1, "/tata");
        dataStore.removeEntity(entity);
        expect(dataStore[ENTITIES_BY_PATH]["/tata"]).not.toContain(entity);
        expect(dataStore[ENTITIES_BY_UUID][entity.id]).toBeUndefined();
        dataStore.removeEntity(entity1);
        expect(dataStore[ENTITIES_BY_PATH]["/tata"]).toBeUndefined();
    });

});

describe("DataStore.getEntity", () => {

    test("returns the requested entity if it is in the store", () => {
        const dataStore = new DataStore();
        const entity = new Entity({ id: "entity-0" });
        dataStore.addEntity(entity);
        expect(dataStore.getEntity(entity.id)).toBe(entity);
    });

    test("returns undefined if the entity does not exist", () => {
        const dataStore = new DataStore();
        const entity = new Entity({ id: "entity-0" });
        expect(dataStore.getEntity(entity.id)).toBeUndefined();
    });

});

describe("DataStore.listEntities", () => {

    test("returns all entities by default", () => {
        const dataStore = new DataStore();
        const entity = new Entity({ id: "entity-0" });
        const entity1 = new Entity({ id: "entity-1" });
        const entity2 = new Entity({ id: "entity-2" });
        dataStore.addEntity(entity, "/tata");
        dataStore.addEntity(entity1, "/titi/toto");
        dataStore.addEntity(entity2, "/tata/titi/tutu");
        const expected = [entity, entity1, entity2];
        expect(dataStore.listEntities()).toEqual(expect.arrayContaining(expected));
    });

    test("returns entities matching that matche the given path", () => {
        const dataStore = new DataStore();
        const entity = new Entity({ id: "entity-0" });
        const entity1 = new Entity({ id: "entity-1" });
        dataStore.addEntity(entity, "/tata");
        dataStore.addEntity(entity1, "/tata/toto");
        const expected = [entity];
        expect(dataStore.listEntities("/tata")).toEqual(expect.arrayContaining(expected));
        expect(dataStore.listEntities("/tata")).toHaveLength(expected.length);
    });

    // TODO find a way to glob "/tata" and "/tata/toto"

    // test("match complex globing", () => {
    //     const dataStore = new DataStore();
    //     const entity = new Entity({ id: "entity-0" });
    //     const entity1 = new Entity({ id: "entity-1" });
    //     const entity2 = new Entity({ id: "entity-2" });
    //     dataStore.addEntity(entity, "/tata");
    //     dataStore.addEntity(entity1, "/tata/toto");
    //     dataStore.addEntity(entity2, "/titi");
    //     const expected = [entity, entity1];
    //     expect(dataStore.listEntities("/tata/**")).toEqual(expect.arrayContaining(expected));
    //     expect(dataStore.listEntities("/tata/**")).toHaveLength(expected.length);
    // });

});

describe("DataStore.clear", () => {

    test("removes everything from the store", () => {
        const dataStore = new DataStore();
        const entity = new Entity({ id: "entity-0" });
        const entity1 = new Entity({ id: "entity-1" });
        const entity2 = new Entity({ id: "entity-2" });
        dataStore.addEntity(entity, "/tata");
        dataStore.addEntity(entity1, "/titi/toto");
        dataStore.addEntity(entity2, "/tata/titi");
        dataStore.clear();
        expect(dataStore.listEntities()).toHaveLength(0);
    });

});

describe("DataStore.serializeEntities", () => {

    test("returns a JSON string", () => {
        const dataStore = new DataStore();
        const entity = new Entity({ id: "entity-0" });
        const entity1 = new Entity({ id: "entity-1" });
        dataStore.addEntity(entity, "/tata");
        dataStore.addEntity(entity1, "/tata/toto");
        const serialized = dataStore.serializeEntities();
        expect(typeof serialized).toBe("string");
        expect(typeof JSON.parse(serialized)).toBe("object");
    });

});

describe("DataStore.unserializeEntities", () => {

    test("unserializes and add all entity from serialized JSON to the store", () => {
        const dataStoreSerializer = new DataStore();
        const dataStoreUnserializer = new DataStore();
        const entity = new Entity({ id: "entity-0" });
        const entity1 = new Entity({ id: "entity-1" });
        const entity2 = new Entity({ id: "entity-2" });
        const entity3 = new Entity({ id: "entity-3" });
        dataStoreSerializer.addEntity(entity, "/tata");
        dataStoreSerializer.addEntity(entity1, "/tata");
        dataStoreSerializer.addEntity(entity3, "/toto");
        dataStoreSerializer.addEntity(entity2, "/tata/titi");
        const object = [
            "/tata",
            "/tata/titi",
            "/toto",
        ];
        const serializedData = dataStoreSerializer.serializeEntities();
        dataStoreUnserializer.unserializeEntities(serializedData);
        const keys = Object.keys(dataStoreUnserializer[ENTITIES_BY_PATH]);
        expect(keys).toEqual(expect.arrayContaining(object));
        expect(keys.length).toEqual(object.length);
        expect(dataStoreUnserializer[ENTITIES_BY_PATH]["/tata"]).toHaveLength(2);
        expect(dataStoreUnserializer[ENTITIES_BY_PATH]["/tata/titi"]).toHaveLength(1);
        expect(dataStoreUnserializer[ENTITIES_BY_PATH]["/toto"]).toHaveLength(1);
    });

});

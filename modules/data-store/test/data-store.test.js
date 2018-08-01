import STORE_SYMBOLS from "../src/symbols";

const DataStore = require("../src/data-store.js");
const Entity = require("../src/entity");

const ENTITIES_BY_PATH = STORE_SYMBOLS.ENTITIES_BY_PATH; // eslint-disable-line prefer-destructuring
const ENTITIES_BY_UUID = STORE_SYMBOLS.ENTITIES_BY_UUID; // eslint-disable-line prefer-destructuring

describe("DataStore.addEntity", () => {

    test("entity is stored into an object", () => {
        const dataStore = new DataStore();
        const entity = new Entity({ id: "entity-0" });
        dataStore.addEntity(entity, "/tata");
        const object = {
            "/tata": [entity],
        };
        const object2 = {
            "/toto": [entity],
        };
        expect(dataStore[ENTITIES_BY_PATH]).toEqual(object);
        expect(dataStore[ENTITIES_BY_PATH]).not.toEqual(object2);
    });

    test("many entities in same path", () => {
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

    test("entity stored in uuid array and with right id", () => {
        const dataStore = new DataStore();
        const entity = new Entity({ id: "entity-0" });
        dataStore.addEntity(entity, "/tata");
        expect(dataStore[ENTITIES_BY_UUID][entity.id]).toBe(entity);
    });

    test("entity in path array and in uuid array are the same", () => {
        const dataStore = new DataStore();
        const entity = new Entity({ id: "entity-0" });
        dataStore.addEntity(entity, "/tata");
        const index = dataStore[ENTITIES_BY_PATH]["/tata"].indexOf(entity);
        expect(dataStore[ENTITIES_BY_UUID][entity.id]).toBe(dataStore[ENTITIES_BY_PATH]["/tata"][index]);
        expect(dataStore[ENTITIES_BY_PATH]["/tata"][index]).toBe(entity);
    });

    test("entity path is correct", () => {
        const dataStore = new DataStore();
        const entity = new Entity({ id: "entity-0" });
        dataStore.addEntity(entity, "/tata");
        expect(entity.getPath()).toBe("/tata");
    });

});

describe("DataStore.removeEntity", () => {

    test("entity is removed from store", () => {
        const dataStore = new DataStore();
        const entity = new Entity({ id: "entity-0" });
        const entity1 = new Entity({ id: "entity-1" });
        dataStore.addEntity(entity, "/tata");
        dataStore.addEntity(entity1, "/tata");
        dataStore.removeEntity(entity.id);
        expect(dataStore[ENTITIES_BY_PATH]["/tata"].indexOf(entity)).toEqual(-1);
    });

    test("path is removed if empty", () => {
        const dataStore = new DataStore();
        const entity = new Entity({ id: "entity-0" });
        const entity1 = new Entity({ id: "entity-1" });
        dataStore.addEntity(entity, "/tata");
        dataStore.addEntity(entity1, "/tata");
        dataStore.removeEntity(entity.id);
        dataStore.removeEntity(entity1.id);
        expect(dataStore[ENTITIES_BY_PATH]["/tata"]).toBeUndefined();
    });

    test("uuid is removed", () => {
        const dataStore = new DataStore();
        const entity = new Entity({ id: "entity-0" });
        dataStore.addEntity(entity, "/tata");
        dataStore.removeEntity(entity.id);
        expect(dataStore[ENTITIES_BY_UUID][entity.id]).toBeUndefined();
    });

    test("entity path is removed", () => {
        const dataStore = new DataStore();
        const entity = new Entity({ id: "entity-0" });
        dataStore.addEntity(entity, "/tata");
        dataStore.removeEntity(entity.id);
        expect(entity.getPath()).toBeUndefined();
    });

    test("can remove entity by giving entity in parameters", () => {
        const dataStore = new DataStore();
        const entity = new Entity({ id: "entity-0" });
        const entity1 = new Entity({ id: "entity-1" });
        dataStore.addEntity(entity, "/tata");
        dataStore.addEntity(entity1, "/tata");
        dataStore.removeEntity(entity);
        expect(dataStore[ENTITIES_BY_PATH]["/tata"].indexOf(entity)).toEqual(-1);
        expect(dataStore[ENTITIES_BY_UUID][entity.id]).toBeUndefined();
        dataStore.removeEntity(entity1);
        expect(dataStore[ENTITIES_BY_PATH]["/tata"]).toBeUndefined();
    });

});

describe("DataStore.getEntity", () => {

    test("entity exists", () => {
        const dataStore = new DataStore();
        const entity = new Entity({ id: "entity-0" });
        dataStore.addEntity(entity);
        expect(dataStore.getEntity(entity.id)).toBe(entity);
    });

    test("path is correct", () => {
        const dataStore = new DataStore();
        const entity = new Entity({ id: "entity-0" });
        dataStore.addEntity(entity, "/tata");
        expect(dataStore.getEntity(entity.id).getPath()).toBe("/tata");
    });

});

describe("DataStore.listEntities", () => {

    test("returns all entities", () => {
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

    test("match path given", () => {
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

    test("everything is cleared", () => {
        const dataStore = new DataStore();
        const entity = new Entity({ id: "entity-0" });
        const entity1 = new Entity({ id: "entity-1" });
        const entity2 = new Entity({ id: "entity-2" });
        dataStore.addEntity(entity, "/tata");
        dataStore.addEntity(entity1, "/titi/toto");
        dataStore.addEntity(entity2, "/tata/titi");
        dataStore.clear();
        expect(dataStore.listEntities()).toEqual([]);
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

describe("DataStore.UnserializeEntities", () => {

    test("stores all entity from serialized project", () => {
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
        expect(dataStoreUnserializer[ENTITIES_BY_PATH]["/tata"].length).toEqual(2);
        expect(dataStoreUnserializer[ENTITIES_BY_PATH]["/tata/titi"].length).toEqual(1);
        expect(dataStoreUnserializer[ENTITIES_BY_PATH]["/toto"].length).toEqual(1);
    });

});

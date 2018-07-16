const DataStore = require("../src/data-store.js");

describe("DataStore.serializeEntities", () => {

    test("returns a JSON string", () => {
        const dataStore = new DataStore();
        const serialized = dataStore.serializeEntities();
        expect(typeof serialized).toBe("string");
        expect(typeof JSON.parse(serialized)).toBe("object");
    });

});

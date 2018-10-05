jest.mock("../index.js");

const History = require("./history.js").default;
// const DataStore = require("../../data-store/data-store.js");
// const Entity = require("../../data-store/entity.js");

// const ObisidianProjectFile = require("obsidian-file/lib/ObsidianProjectFile.js");

// const self = require("../index.js");
// self.app.modules.dataStore.unserializeEntities.mockClear();

describe("history/history.getLength", () => {
    test("history initialisation", () => {
        const history = new History();
        expect(history.getLength()).toBe(0);
    });

    test("return basic history length", () => {
        const history = new History();
        history.snapshot();
        expect(history.getLength()).toBe(1);
        history.snapshot();
        expect(history.getLength()).toBe(2);
    });

});

describe("history/history.clear", () => {
    test("empty history", () => {
        const history = new History();
        history.snapshot();
        history.snapshot();
        history.clear();
        expect(history.getLength()).toBe(0);
    });
});

describe("history/history.maxLength", () => {
    test("maxLength initialisation", () => {
        const history = new History();
        const maxLength = 3;
        history.maxLength = maxLength;
        expect(history.getMaxLength()).toBe(maxLength);
    });

    test("Check history max stack size is well croped", () => {
        const history = new History();
        const maxLength = 3;
        history.maxLength = maxLength;
        for (let i = 0; i < maxLength + 2; i++) {
            history.snapshot();
        }
        expect(history.getLength()).toBe(maxLength);
    });
});

describe("history/history.position", () => {
    test("History isFirst method", () => {
        const history = new History();
        expect(history.isFirst()).toBe(true);
        const maxLength = 3;
        history.maxLength = maxLength;
        for (let i = 0; i < maxLength; i++) {
            history.snapshot();
        }
        history.go(-maxLength);
        expect(history.isFirst()).toBe(false);
    });

    test("History isLast method", () => {
        const history = new History();
        expect(history.isLast()).toBe(false);
        const maxLength = 3;
        history.maxLength = maxLength;
        for (let i = 0; i < maxLength; i++) {
            history.snapshot();
        }
        history.go(-maxLength);
        expect(history.isLast()).toBe(true);
    });
});


describe("history/history.snapshot", () => {
    // const serializedData = {
    //     "/tata": [{
    //         __name__: "Entity",
    //         id: "entity-0",
    //     }, {
    //         __name__: "Entity",
    //         id: "entity-1",
    //     }],
    //     "/toto": [{
    //         __name__: "Entity",
    //         id: "entity-3",
    //     }],
    //     "/tata/titi": [{
    //         __name__: "Entity",
    //         id: "entity-2",
    //     }],
    // };
    // const projectData = {
    //     "/a": [{
    //         __name__: "Entity",
    //         id: "1",
    //     }],
    // };
    // const project = new ObisidianProjectFile();
    // project.project = projectData;
    // const projectBuffer = project.exportAsBlob();
    // const dataExpoter = new DataExporter();
    // dataExpoter.import(projectBuffer);

    // expect(self.app.modules.dataStore.unserializeEntities).lastCalledWith(projectData);
    test("Snapshot after adding object", () => {
        // const history = new History();
        // const entity = new Entity({
        //     id: "entity-0"
        // });
        // const datastore = new DataStore();

        // dataStore.addEntity(entity);
        // expect(dataStore.getEntity(entity.id)).toBe(entity);
        // history.snapshot();
        // const datastoreUnserialize = new DataStore();
        // datastoreUnserialize.unserializeEntities(history.go(-1));
    });

    test("Snapshot become new head", () => {
        // Test if structure before being snapshot is equal to ahead project after being snapshotted
        // a = project;
        // history.snapshot();
        // b = history.go(-1);
        // a == b ?
    });

    test("Handle after being back in history, new snapshot take new head", () => {
        // If we have a stack of 5 history, when we get back to -3 and we take a new snapshot, make sure old -2 and -1 are deleted
        // a = project;
        // history.snapshot();
        // change project
        // history.snapshot();
        // TRUC = change project
        // history.snapshot();
        // change project
        // history.snapshot();
        // change project
        // history.snapshot();
        // b = history.go(-3);
        // history.snapshot();
        // history.length ?
        // history.go(-1) == TRUC ?
    });

    test("Snapshot cropLength", () => {
        // Test when we reached maxLength if old one is well deleted
        // a = project;
        // history.maxLength = 2;
        // history.snapshot();
        // change project
        // history.snapshot();
        // change project
        // history.snapshot();
        // b = history.go(-1);
        // a == b ?
    });

});


describe("history/history.go", () => {

    test("Handle if go do nothing when asking for +1 when we are on first position", () => {
        // Handle if go do nothing when asking for +1 when we are on first position
    });

    test("Handle if go do nothing when asking for -1 when we are on last position", () => {
        // Handle if go do nothing when asking for -1 when we are on last position
    });

    test("Handle undo/redo", () => {
        // Test equality between project before and after history.go(-1) history.go(1)
    });
});

describe("history/history.back", () => {
    test("Back method is a shortcut for go(-1)", () => {
        // Test equality between history.back() and history.go(-1);
        // const history = new History();
        // history.back();
    });
});

describe("history/history.forward", () => {
    test("Forward method is a shortcut for go(1)", () => {
        // Test equality between history.forward() and history.go(1);
        // const history = new History();
        // history.forward();
    });
});

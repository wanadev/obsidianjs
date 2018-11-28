jest.mock("../index.js");

const History = require("./history.js");
const self = require("../index.js");

function getEntity(id = Math.floor(Math.random() * 1000)) {
    return {
        __name__: "Entity",
        id,
    };
}

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

    test("maxLength setter of negative number", () => {
        const history = new History();
        expect(() => history.setMaxLength(-1)).toThrowError("Setter");
    });

    test("maxLength setter of zero", () => {
        const history = new History();
        // expect(() => app.use({})).toThrow(/ApplicationAlreadyStarted/);
        expect(() => history.setMaxLength(0)).toThrowError("Setter");
    });

    test("maxLength setter of NaN", () => {
        const history = new History();
        expect(() => history.setMaxLength("a")).toThrowError("Setter");
    });

    test("maxLength setter of 3", () => {
        const history = new History();
        const maxLength = 3;
        expect(() => history.setMaxLength(maxLength)).not.toThrow();
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
        history.go(maxLength);
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

describe("history/history.back", () => {
    test("Back method is a shortcut for go(1)", () => {
        // Test equality between history.back() and history.go(-1);
        const history = new History();
        history.snapshot();
        history.back();

        const history2 = new History();
        history2.snapshot();
        history2.go(1);
        expect(history).toEqual(history2);
    });
});

describe("history/history.forward", () => {
    test("Forward method is a shortcut for go(-1)", () => {
        // Test equality between history.forward() and history.go(1);
        const history = new History();
        history.snapshot();
        history.go(1);
        history.forward();

        const history2 = new History();
        history2.snapshot();
        history2.go(1);
        history2.go(-1);
        expect(history).toEqual(history2);
    });
});

describe("history/history.simulate", () => {
    test("Simulate big number to fit length", () => {
        const history = new History();
        expect(history.simulate(Number.MIN_SAFE_INTEGER)).toBe(history.getLength());
    });

    test("Simulate big negative number to return last position", () => {
        const history = new History();
        history.snapshot();
        history.snapshot();
        expect(history.simulate(Number.MIN_SAFE_INTEGER)).toBe(-1);
    });

    test("Simulate big number to return first position when pointer is in middle", () => {
        const history = new History();
        history.snapshot();
        history.snapshot();
        history.go(1);
        expect(history.simulate(Number.MAX_SAFE_INTEGER)).toBe(0);
    });

    test("Simulate with no delta", () => {
        const history = new History();
        expect(history.simulate()).toBe(0);
    });

});

describe("history/history.snapshot", () => {

    test("Snapshot does not throw error", () => {
        const history = new History();
        expect(history.snapshot()).toBeUndefined();
    });

    test("Snapshot set pointer position to 0", () => {
        const history = new History();
        history.snapshot();
        expect(history.pointer).toBe(0);
        history.go(-1);
        history.snapshot();
        expect(history.pointer).toBe(0);
    });

    test("Test if snapshot does not change integrity of data", () => {
        const history = new History();
        const projectData = {
            "/a": [{
                __name__: "Entity",
                id: "1",
            }],
        };
        self.app.modules.dataStore.unserializeEntities(projectData);
        const dataBefore = self.app.modules.dataStore.serializeEntities();
        history.snapshot();
        const dataAfter = self.app.modules.dataStore.serializeEntities();
        expect(dataBefore).toEqual(dataAfter);
    });

    test("Snapshot extract current project as expected", () => {
        const history = new History();
        const projectData = {
            "/a": [{
                __name__: "Entity",
                id: "1",
            }],
        };
        history.snapshot();
        expect(history.snapshots[history.pointer].layers).toEqual(projectData);
    });

    test("Snapshot call dataStore serialization", () => {
        self.app.modules.dataStore.serializeEntities.mockClear();
        const history = new History();
        history.snapshot();
        expect(self.app.modules.dataStore.serializeEntities).toHaveBeenCalledTimes(1);
    });

    test("New snapshot take new head", () => {
        const objectA = {};
        objectA["/a"] = getEntity(1);
        objectA["/b"] = getEntity(2);

        const objectB = {};
        objectB["/a"] = getEntity(1);
        objectB["/c"] = getEntity(3);

        self.app.modules.dataStore.serializeEntities = jest.fn()
            .mockReturnValueOnce(objectA)
            .mockReturnValueOnce(objectB);

        const history = new History();
        history.snapshot();
        expect(history.snapshots[0].layers).toEqual(objectA);
        history.snapshot();
        expect(history.snapshots[0].layers).toEqual(objectB);
        expect(history.snapshots[1].layers).toEqual(objectA);
    });

    test("Emit 'history-snapshot' event", () => {
        self.app.events.emit.mockClear();

        const history = new History();
        history.snapshot();
        expect(self.app.events.emit).lastCalledWith("history-snapshot", 0, 1, 50);
    });

    test("Handle after being back in history, new snapshot take new head", () => {
        // If we have a stack of 5 history, when we get back to -3 and we take a new snapshot,
        // make sure old -2 and -1 are deleted
        const objectA = {};
        objectA["/a"] = getEntity(1);
        objectA["/b"] = getEntity(2);

        const objectB = {};
        objectB["/a"] = getEntity(1);
        objectB["/c"] = getEntity(3);

        const objectC = {};
        objectC["/c"] = getEntity(3);
        objectC["/c/a"] = getEntity(31);

        const objectD = {};
        objectD["/d"] = getEntity(4);

        const objectE = {};
        objectE["/e"] = getEntity(5);

        const objectF = {};
        objectF["/f"] = getEntity(6);

        const objectG = {};
        objectG["/g"] = getEntity(7);

        self.app.modules.dataStore.serializeEntities = jest.fn()
            .mockReturnValueOnce(objectA)
            .mockReturnValueOnce(objectB)
            .mockReturnValueOnce(objectC)
            .mockReturnValueOnce(objectD)
            .mockReturnValueOnce(objectE)
            .mockReturnValueOnce(objectF)
            .mockReturnValueOnce(objectG);

        const history = new History();
        history.snapshot(); // a
        history.snapshot(); // b
        history.snapshot(); // c
        history.snapshot(); // d
        history.snapshot(); // e
        history.go(-3); // here it calls f which is a side effect of the test
        history.snapshot(); // g
        expect(history.snapshots[0].layers).toEqual(objectG);
        expect(history.snapshots[1].layers).toEqual(objectB);
    });

    test("Snapshot cropLength", () => {
        // Test when we reached maxLength if old one is well deleted
        const objectA = {};
        objectA["/a"] = getEntity(1);
        objectA["/b"] = getEntity(2);

        const objectB = {};
        objectB["/a"] = getEntity(1);
        objectB["/c"] = getEntity(3);

        const objectC = {};
        objectC["/c"] = getEntity(3);
        objectC["/c/a"] = getEntity(31);


        self.app.modules.dataStore.serializeEntities = jest.fn()
            .mockReturnValueOnce(objectA)
            .mockReturnValueOnce(objectB)
            .mockReturnValueOnce(objectC);

        const history = new History();
        history.maxLength = 2;
        history.snapshot(); // a
        history.snapshot(); // b
        history.snapshot(); // c
        // a have been croped
        expect(history.snapshots[history.maxLength - 1].layers).toEqual(objectB);
    });

});

describe("history/history._applyCurrentSnapshotInObject", () => {
    test("Handle delete property", () => {
        const objectA = {};
        objectA["/a"] = getEntity(1);
        objectA["/b"] = getEntity(2);

        const objectB = {};
        objectB["/a"] = getEntity(1);

        const history = new History();
        expect(history._applyCurrentSnapshotInObject(objectA, objectB)).toEqual(objectB);
    });

    test("Handle add property", () => {
        const objectA = {};
        objectA["/a"] = getEntity(1);

        const objectB = {};
        objectB["/a"] = getEntity(1);
        objectB["/b"] = getEntity(2);

        const history = new History();
        // console.log(history._applyCurrentSnapshotInObject(objectA, objectB));
        expect(history._applyCurrentSnapshotInObject(objectA, objectB)).toEqual(objectB);
    });

    test("Handle delete child property", () => {
        const objectA = {};
        objectA["/a"] = getEntity(1);
        objectA["/a/a"] = getEntity(2);
        objectA["/a/b"] = getEntity(3);

        const objectB = {};
        objectB["/a"] = getEntity(1);
        objectB["/a/a"] = getEntity(2);

        const history = new History();
        expect(history._applyCurrentSnapshotInObject(objectA, objectB)).toEqual(objectB);
    });

    test("Handle add child property", () => {
        const objectA = {};
        objectA["/a"] = getEntity(1);
        objectA["/a/a"] = getEntity(2);

        const objectB = {};
        objectB["/a"] = getEntity(1);
        objectB["/a/a"] = getEntity(2);
        objectB["/a/b"] = getEntity(3);

        const history = new History();
        expect(history._applyCurrentSnapshotInObject(objectA, objectB)).toEqual(objectB);
    });

    test("Handle modify property", () => {
        const objectA = {};
        objectA["/a"] = getEntity(1);

        const objectB = {};
        objectB["/a"] = getEntity(2);

        const history = new History();
        expect(history._applyCurrentSnapshotInObject(objectA, objectB)).toEqual(objectB);
    });

    test("Handle modify children property", () => {
        const objectA = {};
        objectA["/a"] = getEntity(1);
        objectA["/a/a"] = getEntity(2);

        const objectB = {};
        objectB["/a"] = getEntity(1);
        objectB["/a/a"] = getEntity(1);

        const history = new History();
        expect(history._applyCurrentSnapshotInObject(objectA, objectB)).toEqual(objectB);
    });

    test("Handle apply current snapshot functionnal test", () => {
        const objectA = {};
        objectA["/a"] = getEntity(1);
        objectA["/a/e"] = getEntity(1);
        objectA["/b"] = getEntity(2);
        objectA["/b/a"] = getEntity(1);

        const objectB = {};
        objectB["/a"] = getEntity(1);
        objectB["/a/e"] = getEntity(11);
        objectB["/a/d"] = getEntity(2);
        objectB["/c"] = getEntity(3);

        const history = new History();
        expect(history._applyCurrentSnapshotInObject(objectA, objectB)).toEqual(objectB);
    });
});

describe("history/history.applyCurrentSnapshot", () => {
    test("Prevent applyCurrentSnapshot on negative pointer", () => {
        self.app.modules.dataStore.serializeEntities.mockClear();
        const history = new History();
        history.pointer = -1;
        history.applyCurrentSnapshot();
        expect(self.app.modules.dataStore.serializeEntities).toHaveBeenCalledTimes(0);
    });

    test("Apply snapshot on current object do not modify it", () => {
        const objectA = {};
        objectA["/a"] = getEntity(1);
        objectA["/a/e"] = getEntity(1);
        objectA["/b"] = getEntity(2);
        objectA["/b/a"] = getEntity(1);

        self.app.modules.dataStore.serializeEntities = jest.fn()
            .mockReturnValueOnce(objectA);

        const history = new History();
        history.snapshot(); // a
        history.pointer = 0;
        history.applyCurrentSnapshot();
        expect(history.snapshots[0].layers).toEqual(objectA);
    });

});

describe("history/history.go", () => {
    test("Check Go zero do nothing", () => {
        const history = new History();
        history.snapshot();
        const { pointer } = history; // not lisible
        history.go(0);
        expect(history.pointer).toEqual(pointer);
    });

    test("Emit 'history-go' event", () => {
        self.app.events.emit.mockClear();
        const history = new History();
        history.snapshot();
        history.snapshot();
        history.go(-1);
        expect(self.app.events.emit).lastCalledWith("history-go", 1, 50);
    });

    // test("Handle if go do nothing when asking for +1 when we are on first position", () => {
    //     // Handle if go do nothing when asking for +1 when we are on first position
    // });

    // test("Handle if go do nothing when asking for -1 when we are on last position", () => {
    //     // Handle if go do nothing when asking for -1 when we are on last position
    // });

    test("Handle undo/redo", () => {
        // Test equality between project before and after history.go(-1) history.go(1)
        const objectA = {};
        objectA["/a"] = getEntity(1);
        objectA["/b"] = getEntity(2);

        const objectB = {};
        objectB["/a"] = getEntity(1);
        objectB["/c"] = getEntity(3);

        self.app.modules.dataStore.serializeEntities = jest.fn()
            .mockReturnValueOnce(objectA)
            .mockReturnValueOnce(objectB);

        const history = new History();
        history.snapshot();
        history.snapshot();
        const objBBefore = history.snapshots[0].layers;
        const objABefore = history.snapshots[1].layers;
        history.go(-1);
        history.go(1);
        const objBAfter = history.snapshots[0].layers;
        const objAAfter = history.snapshots[1].layers;
        expect(objBBefore).toEqual(objBAfter);
        expect(objABefore).toEqual(objAAfter);
    });
});

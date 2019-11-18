jest.mock("../index.js");

const SerializableClass = require("abitbol-serializable");
const History = require("./history.js");
const HistoryHelper = require("./history-helper.js");
const self = require("../index.js");

const Entity = SerializableClass.$extend({
    __name__: "Entity",
    getProp1: jest.fn(),
    setProp1: jest.fn(),
});

class NativeEntity {

    serialize() {
        return {
            id: this.id,
            prop1: this.prop1,
        };
    }

    unserialize(serialized) {
        Object.assign(this, serialized);
    }

    get prop1() {
        return this.getter();
    }

    set prop1(p) {
        this.setter(p);
    }

}

NativeEntity.prototype.setter = jest.fn();
NativeEntity.prototype.getter = jest.fn();

const EntityDeepProperty = SerializableClass.$extend({
    __name__: "EntityDeepProperty",
    getDeepProp1: jest.fn().mockReturnValue(
        { x: 0, y: 0, z: 0 },
    ),
    setDeepProp1: jest.fn(),
});

class NativeEntityDeepProperty {

    serialize() {
        return {
            id: this.id,
            deepProp1: this.deepProp1,
        }

    }

    unserialize(serialized) {
        Object.assign(this, serialized);
    }

    get deepProp1() {
        return this.getter;
    }

    set deepProp1(p) {
        this.setter(p);
    }

}
NativeEntityDeepProperty.prototype.getter = jest.fn().mockReturnValue(
    { x: 0, y: 0, z: 0 },
);
NativeEntityDeepProperty.prototype.setter = jest.fn();

const EntityArray = SerializableClass.$extend({
    __name__: "EntityArray",
    getProp1: jest.fn(),
    setProp1: jest.fn(),

    getArrayProp: jest.fn().mockReturnValue([
        "blinh",
        "phong",
        "fire",
        "poulpy",
    ]),
    setArrayProp: jest.fn(),
});

function getEntity(id = Math.floor(Math.random() * 1000), prop1 = "toto") {
    const newEntity = {
        __name__: "Entity",
        id,
        prop1,
    };
    return newEntity;
}

function getNativeEntity(id = Math.floor(Math.random() * 1000), prop1 = "toto") {
    const newEntity = {
        __name__: "NativeEntity",
        id,
        prop1,
    };
    return newEntity;
}

function getEntityArray(id = Math.floor(Math.random() * 1000), prop1 = "toto", array = []) {
    let arrayProp;
    if (!array.length) {
        arrayProp = [
            "blinh",
            "phong",
            "fire",
            "poulpy",
        ];
    } else {
        arrayProp = array;
    }
    const newEntity = {
        __name__: "EntityArray",
        id,
        prop1,
        arrayProp,
    };
    return newEntity;
}

function getDeepEntity(id = Math.floor(Math.random() * 1000), deepProp1 = { x: 0, y: 0, z: 0 }) {
    const newEntity = {
        __name__: "EntityDeepProperty",
        id,
        deepProp1,
    };
    return newEntity;
}

function getDeepNativeEntity(id = Math.floor(Math.random() * 1000), deepProp1 = { x: 0, y: 0, z: 0 }) {
    const newEntity = {
        __name__: "NativeEntityDeepProperty",
        id,
        deepProp1,
    };
    return newEntity;
}

beforeAll(() => {
    SerializableClass.$register(Entity);
    SerializableClass.$register(EntityArray);
    SerializableClass.$register(EntityDeepProperty);
    self.app.modules.dataStore.registerClass(NativeEntity);
    self.app.modules.dataStore.registerClass(NativeEntityDeepProperty);
});

beforeEach(() => {
    self.app.modules.dataStore.serializeEntities.mockClear();
    self.app.modules.dataStore.getEntity.mockClear();
    self.app.modules.dataStore.addEntity.mockClear();
    self.app.modules.dataStore.removeEntity.mockClear();
    self.app.events.emit.mockClear();
    Entity.prototype.getProp1.mockClear();
    Entity.prototype.setProp1.mockClear();

    EntityArray.prototype.getProp1.mockClear();
    EntityArray.prototype.setProp1.mockClear();
    EntityArray.prototype.getArrayProp.mockClear();
    EntityArray.prototype.setArrayProp.mockClear();

    EntityDeepProperty.prototype.getDeepProp1.mockClear();
    EntityDeepProperty.prototype.setDeepProp1.mockClear();

    self.app.modules.dataStore.getEntity.mockReturnValue(new Entity());
    Entity.prototype.getProp1.mockReturnValue(
        "toto",
    );
    EntityArray.prototype.getArrayProp.mockReturnValue(
        [
            "blinh",
            "phong",
            "fire",
            "poulpy",
        ],
    );

});

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
    test("No snapshot means pointer is not first and is not last", () => {
        const history = new History();
        expect(history.isFirst()).toBe(false);
        expect(history.isLast()).toBe(false);
    });

    test("Only one snapshot means pointer is first and is last", () => {
        const history = new History();
        history.snapshot();
        expect(history.isFirst()).toBe(true);
        expect(history.isLast()).toBe(true);
    });

    test("History isFirst method does not get impacted by new snapshot", () => {
        const history = new History();
        history.snapshot();
        history.snapshot();
        expect(history.isFirst()).toBe(true);
    });

    test("History isFirst method", () => {
        const history = new History();
        const maxLength = 3;
        history.maxLength = maxLength;
        for (let i = 0; i < maxLength; i++) {
            history.snapshot();
        }
        history.go(maxLength - 1);
        expect(history.isFirst()).toBe(false);
    });

    test("History isLast method", () => {
        const history = new History();
        const maxLength = 3;
        history.maxLength = maxLength;
        for (let i = 0; i < maxLength; i++) {
            history.snapshot();
        }
        history.go(maxLength - 1);
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
        expect(history.simulate(Number.MIN_SAFE_INTEGER)).toBe(0);
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
            "/a": [
                getEntity(1),
            ],
        };
        self.app.modules.dataStore.unserializeEntities(projectData);
        const dataBefore = self.app.modules.dataStore.serializeEntities();
        history.snapshot();
        const dataAfter = self.app.modules.dataStore.serializeEntities();
        expect(dataBefore).toEqual(dataAfter);
    });

    test("Test if snapshot does not change integrity of native data", () => {
        const history = new History();
        const projectData = {
            "/a": [
                getNativeEntity(1),
            ],
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
            "/a": [
                getEntity(1),
            ],
        };
        self.app.modules.dataStore.serializeEntities.mockReturnValueOnce(
            projectData,
        );
        history.snapshot();
        expect(history.snapshots[history.pointer].layers).toEqual(projectData);
    });

    test("Snapshot extract current project as expected (Native)", () => {
        const history = new History();
        const projectData = {
            "/a": [
                getNativeEntity(1),
            ],
        };
        self.app.modules.dataStore.serializeEntities.mockReturnValueOnce(
            projectData,
        );
        history.snapshot();
        expect(history.snapshots[history.pointer].layers).toEqual(projectData);
    });

    test("Snapshot call dataStore serialization", () => {
        const history = new History();
        history.snapshot();
        expect(self.app.modules.dataStore.serializeEntities).toHaveBeenCalledTimes(1);
    });

    test("New snapshot take new head", () => {
        const objectA = {
            "/a": [
                getEntity(1),
            ],
            "/b": [
                getEntity(2),
            ],
        };

        const objectB = {
            "/a": [
                getEntity(1),
            ],
            "/c": [
                getEntity(3),
            ],
        };

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

    test("New snapshot take new head (Native)", () => {

        const objectA = {
            "/a": [
                getNativeEntity(1),
            ],
            "/b": [
                getNativeEntity(2),
            ],
        };

        const objectB = {
            "/a": [
                getNativeEntity(1),
            ],
            "/c": [
                getNativeEntity(3),
            ],
        };

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
        expect(self.app.events.emit).lastCalledWith("history-snapshot", 0, 1, history.maxLength);
    });

    test("Handle after being back in history, new snapshot take new head", () => {
        // If we have a stack of 5 history, when we get back to -3 and we take a new snapshot,
        // make sure old -2 and -1 are deleted

        const objectA = {
            "/a": [
                getEntity(1),
            ],
            "/b": [
                getEntity(2),
            ],
        };

        const objectB = {
            "/a": [
                getEntity(1),
            ],
            "/c": [
                getEntity(3),
            ],
        };

        const objectC = {
            "/c": [
                getEntity(3),
            ],
            "/c/a": [
                getEntity(31),
            ],
        };

        const objectD = {
            "/d": [
                getEntity(4),
            ],
        };

        const objectE = {
            "/e": [
                getEntity(5),
            ],
        };

        const objectF = {
            "/f": [
                getEntity(6),
            ],
        };

        const objectG = {
            "/g": [
                getEntity(7),
            ],
        };

        self.app.modules.dataStore.serializeEntities
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
        history.go(3); // here it calls f which is a side effect of the test
        history.snapshot(); // g
        expect(history.snapshots[0].layers).toEqual(objectG);
        expect(history.snapshots[1].layers).toEqual(objectB);
    });

    test("Handle after being back in history, new snapshot take new head (Native)", () => {
        // If we have a stack of 5 history, when we get back to -3 and we take a new snapshot,
        // make sure old -2 and -1 are deleted

        const objectA = {
            "/a": [
                getNativeEntity(1),
            ],
            "/b": [
                getNativeEntity(2),
            ],
        };

        const objectB = {
            "/a": [
                getNativeEntity(1),
            ],
            "/c": [
                getNativeEntity(3),
            ],
        };

        const objectC = {
            "/c": [
                getNativeEntity(3),
            ],
            "/c/a": [
                getNativeEntity(31),
            ],
        };

        const objectD = {
            "/d": [
                getNativeEntity(4),
            ],
        };

        const objectE = {
            "/e": [
                getNativeEntity(5),
            ],
        };

        const objectF = {
            "/f": [
                getNativeEntity(6),
            ],
        };

        const objectG = {
            "/g": [
                getNativeEntity(7),
            ],
        };

        self.app.modules.dataStore.serializeEntities
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
        history.go(3); // here it calls f which is a side effect of the test
        history.snapshot(); // g
        expect(history.snapshots[0].layers).toEqual(objectG);
        expect(history.snapshots[1].layers).toEqual(objectB);
    });
    test("Snapshot cropLength", () => {
        // Test when we reached maxLength if old one is well deleted
        const objectA = {
            "/a": [
                getEntity(1),
            ],
            "/b": [
                getEntity(2),
            ],
        };
        const objectB = {
            "/a": [
                getEntity(1),
            ],
            "/c": [
                getEntity(3),
            ],
        };

        const objectC = {
            "/c": [
                getEntity(3),
            ],
            "/c/a": [
                getEntity(31),
            ],
        };

        self.app.modules.dataStore.serializeEntities
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
        expect(history.snapshots.length).toEqual(history.maxLength);
    });
    test("Snapshot cropLength (Native)", () => {
        // Test when we reached maxLength if old one is well deleted
        const objectA = {
            "/a": [
                getNativeEntity(1),
            ],
            "/b": [
                getNativeEntity(2),
            ],
        };
        const objectB = {
            "/a": [
                getNativeEntity(1),
            ],
            "/c": [
                getNativeEntity(3),
            ],
        };

        const objectC = {
            "/c": [
                getNativeEntity(3),
            ],
            "/c/a": [
                getNativeEntity(31),
            ],
        };

        self.app.modules.dataStore.serializeEntities
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
        expect(history.snapshots.length).toEqual(history.maxLength);
    });

});

describe("history/history-helper.applySnapshotDifference", () => {
    test("Handle delete entity", () => {
        const objectA = {
            "/a": [
                getEntity(1),
            ],
            "/b": [
                getEntity(2),
            ],
        };

        const objectB = {
            "/a": [
                getEntity(1),
            ],
        };

        HistoryHelper.applySnapshotDifference(objectA, objectB);
        expect(self.app.modules.dataStore.removeEntity).lastCalledWith("2");
    });

    test("Handle delete native entity", () => {
        const objectA = {
            "/a": [
                getNativeEntity(1),
            ],
            "/b": [
                getNativeEntity(2),
            ],
        };

        const objectB = {
            "/a": [
                getNativeEntity(1),
            ],
        };

        HistoryHelper.applySnapshotDifference(objectA, objectB);
        expect(self.app.modules.dataStore.removeEntity).lastCalledWith("2");
    });

    test("Handle add entity", () => {
        const objectA = {
            "/a": [
                getEntity(1),
            ],
        };

        const objectB = {
            "/a": [
                getEntity(1),
            ],
            "/b": [
                getEntity(2),
            ],
        };

        HistoryHelper.applySnapshotDifference(objectA, objectB);
        const lastCall = self.app.modules.dataStore.addEntity.mock.calls[
            self.app.modules.dataStore.addEntity.mock.calls.length - 1];
        expect(lastCall[0].id).toEqual(objectB["/b"][0].id);
        expect(lastCall[1]).toEqual("/b");
    });

    test("Handle add native entity", () => {
        const objectA = {
            "/a": [
                getNativeEntity(1),
            ],
        };

        const objectB = {
            "/a": [
                getNativeEntity(1),
            ],
            "/b": [
                getNativeEntity(2),
            ],
        };

        HistoryHelper.applySnapshotDifference(objectA, objectB);
        const lastCall = self.app.modules.dataStore.addEntity.mock.calls[
            self.app.modules.dataStore.addEntity.mock.calls.length - 1];
        expect(lastCall[0].id).toEqual(objectB["/b"][0].id);
        expect(lastCall[1]).toEqual("/b");
    });
    test("Handle add property", () => {
        const objectA = {
            "/a": [
                {
                    __name__: "Entity",
                    id: 1,
                },
            ],
        };

        const objectB = {
            "/a": [
                getEntity(1, "tata"),
            ],
        };
        Entity.prototype.setProp1.mockClear();
        HistoryHelper.applySnapshotDifference(objectA, objectB);

        expect(Entity.prototype.setProp1).toHaveBeenNthCalledWith(1, "tata");
    });
    test("Handle add property (Native)", () => {
        const objectA = {
            "/a": [
                {
                    __name__: "Entity",
                    id: 1,
                },
            ],
        };

        const objectB = {
            "/a": [
                getNativeEntity(1, "tata"),
            ],
        };
        NativeEntity.prototype.setter.mockClear();
        HistoryHelper.applySnapshotDifference(objectA, objectB);

        expect(NativeEntity.prototype.setter).toHaveBeenNthCalledWith(1, "tata");
    });

    test("Handle delete property", () => {
        const objectA = {
            "/a": [
                {
                    __name__: "Entity",
                    id: 1,
                    prop1: "toto",
                    prop2: "tata",
                },
            ],
            "/a/a": [
                getEntity(2),
            ],
        };

        const objectB = {
            "/a": [
                getEntity(1),
            ],
            "/a/a": [
                getEntity(2),
            ],
        };
        HistoryHelper.applySnapshotDifference(objectA, objectB);
        expect(self.app.log.warn).lastCalledWith("You are removing a property between two entities, which should never happen");
    });

    test("Handle delete property (native)", () => {
        const objectA = {
            "/a": [
                {
                    __name__: "Entity",
                    id: 1,
                    prop1: "toto",
                    prop2: "tata",
                },
            ],
            "/a/a": [
                getEntity(2),
            ],
        };

        const objectB = {
            "/a": [
                getNativeEntity(1),
            ],
            "/a/a": [
                getNativeEntity(2),
            ],
        };
        HistoryHelper.applySnapshotDifference(objectA, objectB);
        expect(self.app.log.warn).lastCalledWith("You are removing a property between two entities, which should never happen");
    });
    test("Handle modify property", () => {
        const objectA = {
            "/a": [
                getEntity(1),
            ],
        };

        const objectB = {
            "/a": [
                getEntity(1, "tata"),
            ],
        };
        HistoryHelper.applySnapshotDifference(objectA, objectB);

        expect(Entity.prototype.setProp1).toHaveBeenNthCalledWith(1, "tata");
    });
    test("Handle modify property (native)", () => {
        const objectA = {
            "/a": [
                getNativeEntity(1),
            ],
        };

        const objectB = {
            "/a": [
                getNativeEntity(1, "tata"),
            ],
        };
        HistoryHelper.applySnapshotDifference(objectA, objectB);

        expect(NativeEntity.prototype.setter).toHaveBeenNthCalledWith(1, "tata");
    });

    test("Handle child property difference", () => {
        const objectA = {
            "/a": [
                getDeepEntity(1),
            ],
        };
        const deepObject = { x: 0, y: 1, z: 1 };
        const objectB = {
            "/a": [
                getDeepEntity(1, deepObject),
            ],
        };
        self.app.modules.dataStore.getEntity.mockClear();
        self.app.modules.dataStore.getEntity.mockReturnValueOnce(
            new EntityDeepProperty(),
        );
        HistoryHelper.applySnapshotDifference(objectA, objectB);

        expect(EntityDeepProperty.prototype.setDeepProp1).toHaveBeenNthCalledWith(1, deepObject);
    });

    test("Handle child property difference (native)", () => {
        const objectA = {
            "/a": [
                getDeepNativeEntity(1),
            ],
        };
        const deepObject = { x: 0, y: 1, z: 1 };
        const objectB = {
            "/a": [
                getDeepNativeEntity(1, deepObject),
            ],
        };
        self.app.modules.dataStore.getEntity.mockClear();
        self.app.modules.dataStore.getEntity.mockReturnValueOnce(
            new NativeEntityDeepProperty(),
        );
        HistoryHelper.applySnapshotDifference(objectA, objectB);

        expect(NativeEntityDeepProperty.prototype.setter).toHaveBeenNthCalledWith(1, deepObject);
    });

    test("Handle array modification", () => {
        const objectA = {
            "/a": [
                getEntity(1),
                getEntityArray(2),
            ],
        };
        const arrayModified = [
            "blinh",
            "phong",
            "tomorrow",
            "darkness",
        ];
        const objectB = {
            "/a": [
                getEntity(1),
                getEntityArray(2, "toto", arrayModified),
            ],
        };
        self.app.modules.dataStore.getEntity.mockClear();
        self.app.modules.dataStore.getEntity.mockReturnValueOnce(
            new Entity(),
        );
        self.app.modules.dataStore.getEntity.mockReturnValueOnce(
            new EntityArray(),
        );
        HistoryHelper.applySnapshotDifference(objectA, objectB);
        const firstCall = EntityArray.prototype.setArrayProp.mock.calls[0][0];

        expect(firstCall).toEqual(arrayModified);
    });

    test("Handle same arrays but not ordered in the same way", () => {
        const objectA = {
            "/a": [
                getEntity(1),
                getEntityArray(2),
            ],
        };
        const arrayModified = [
            "blinh",
            "phong",
            "poulpy",
            "fire",
        ];
        const objectB = {
            "/a": [
                getEntity(1),
                getEntityArray(2, "toto", arrayModified),
            ],
        };
        self.app.modules.dataStore.getEntity.mockClear();
        self.app.modules.dataStore.getEntity.mockReturnValueOnce(
            new Entity(),
        );
        self.app.modules.dataStore.getEntity.mockReturnValueOnce(
            new EntityArray(),
        );
        HistoryHelper.applySnapshotDifference(objectA, objectB);
        const firstCall = EntityArray.prototype.setArrayProp.mock.calls[0][0];
        expect(firstCall).toEqual(arrayModified);
    });

    test("Handle when no difference in arrays", () => {
        const arrayObject = getEntityArray(2);
        const objectA = {
            "/a": [
                getEntity(1),
                arrayObject,
            ],
        };
        const objectB = objectA;
        self.app.modules.dataStore.getEntity.mockClear();
        self.app.modules.dataStore.getEntity.mockReturnValueOnce(
            new Entity(),
        );
        self.app.modules.dataStore.getEntity.mockReturnValueOnce(
            new EntityArray(),
        );
        EntityArray.prototype.setArrayProp.mockClear();
        HistoryHelper.applySnapshotDifference(objectA, objectB);
        expect(self.app.modules.dataStore.removeEntity).toHaveBeenCalledTimes(0);
        expect(self.app.modules.dataStore.addEntity).toHaveBeenCalledTimes(0);
        expect(EntityArray.prototype.setArrayProp).toHaveBeenCalledTimes(1);
        expect(arrayObject.arrayProp).toEqual(EntityArray.prototype
            .setArrayProp.mock.calls[0][0]);
    });

    test("Handle apply snapshot difference functionnal test", () => {
        const objectA = {
            "/a": [
                getEntity(1),
            ],
            "/a/e": [
                getEntity(3),
            ],
            "/b": [
                getEntity(2),
            ],
            "/b/a": [
                getEntity(4),
            ],
        };
        const objectB = {
            "/a": [
                getEntity(1),
            ],
            "/a/e": [
                getEntity(11),
            ],
            "/b": [
                getEntity(2),
            ],
            "/b/a": [
                getEntity(3),
            ],
        };
        HistoryHelper.applySnapshotDifference(objectA, objectB);
        const nbCallsAddEntity = self.app.modules.dataStore.addEntity.mock.calls.length;
        const addEntityFirstCall = self.app.modules.dataStore.addEntity.mock.calls[0];
        const addEntityLastCall = self.app.modules.dataStore
            .addEntity.mock.calls[nbCallsAddEntity - 1];

        expect(self.app.modules.dataStore.removeEntity).toHaveBeenCalledTimes(2);
        expect(self.app.modules.dataStore.addEntity).toHaveBeenCalledTimes(3);

        expect(addEntityFirstCall[0].id).toEqual(11);
        expect(addEntityFirstCall[1]).toEqual("/a/e");
        expect(addEntityLastCall[0].id).toEqual(3);
        expect(addEntityLastCall[1]).toEqual("/b/a");

        expect(self.app.modules.dataStore.removeEntity).toHaveBeenNthCalledWith(1, "4");
        expect(self.app.modules.dataStore.removeEntity).lastCalledWith(3);
    });
});

describe("history/history-helper.checkDiff", () => {
    test("Check difference between two property", () => {
        const objA = { prop1: "a" };
        const objB = { prop1: "b" };
        expect(HistoryHelper.checkDiff(objA, objB)).toBe(true);
    });

    test("Check difference between object and primitive value", () => {
        expect(HistoryHelper.checkDiff({ propriete: "oui" }, 4)).toBe(true);
    });

    test("Check difference between false and falsy", () => {
        expect(HistoryHelper.checkDiff(false, 0)).toBe(true);
    });

    test("Check difference between two numbers", () => {
        expect(HistoryHelper.checkDiff(8, 0)).toBe(true);
    });

    test("Check difference between two strings", () => {
        expect(HistoryHelper.checkDiff("jb", "")).toBe(true);
    });

    test("Check difference between two booleans", () => {
        expect(HistoryHelper.checkDiff(true, false)).toBe(true);
    });

    test("Check difference between two different types", () => {
        expect(HistoryHelper.checkDiff([], 4)).toBe(true);
    });

    test("Check difference between string and number", () => {
        expect(HistoryHelper.checkDiff("8465.789", 8465.789)).toBe(true);
    });

    test("Check difference between array and string", () => {
        expect(HistoryHelper.checkDiff(["a", "e", "i"], "aei")).toBe(true);
    });

    test("handle when no differences", () => {
        const objA = { prop1: "a" };
        const objB = { prop1: "a" };
        expect(HistoryHelper.checkDiff(objA, objB)).toBe(false);
    });

    test("handle array diff", () => {
        const objA = [
            "blinh",
            "phong",
            "poulpy",
            "fire",
        ];
        const objB = [
            "blinh",
            "phong",
            "jason",
            "poulpy",
        ];
        expect(HistoryHelper.checkDiff(objA, objB)).toBe(true);
    });

    test("handle array order", () => {
        const objA = [
            "blinh",
            "phong",
            "poulpy",
            "fire",
        ];
        const objB = [
            "blinh",
            "phong",
            "fire",
            "poulpy",
        ];
        expect(HistoryHelper.checkDiff(objA, objB)).toBe(true);
    });
});

describe("history/history.applyCurrentSnapshot", () => {
    test("Prevent applyCurrentSnapshot on negative pointer", () => {
        const history = new History();
        history.pointer = -1;
        history.applyCurrentSnapshot();
        expect(self.app.modules.dataStore.serializeEntities).toHaveBeenCalledTimes(0);
    });

    test("Apply snapshot on current object do not modify it", () => {
        const objectA = {
            "/a": [
                getEntity(1),
            ],
            "/a/e": [
                getEntity(3),
            ],
            "/b": [
                getEntity(2),
            ],
            "/b/a": [
                getEntity(4),
            ],
        };

        self.app.modules.dataStore.serializeEntities
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
        const {
            pointer,
        } = history; // not lisible
        history.go(0);
        expect(history.pointer).toEqual(pointer);
    });

    test("Emit 'history-go' event", () => {
        const objectA = {
            "/a": [
                getEntity(1),
            ],
            "/b/a": [
                getEntity(4),
            ],
        };
        const objectB = {
            "/a": [
                getEntity(1),
            ],
            "/b/a": [
                getEntity(3),
            ],
        };
        self.app.modules.dataStore.serializeEntities
            .mockReturnValueOnce(objectA)
            .mockReturnValueOnce(objectB);
        const history = new History();
        history.snapshot();
        history.snapshot();
        history.go(1);
        expect(self.app.events.emit).lastCalledWith("history-go", 1, history.maxLength);
    });

    test("Handle if 'go' function do nothing when asking for -1 when we are on first position", () => {
        const objectA = {
            "/a": [
                getEntity(1),
            ],
            "/b/a": [
                getEntity(4),
            ],
        };
        self.app.modules.dataStore.serializeEntities
            .mockReturnValueOnce(objectA);
        const history = new History();
        history.snapshot();
        history.go(-1);
        expect(history.pointer).toBe(0);
    });

    test("Handle if 'go' function do nothing when asking for +1 when we are on last position", () => {
        const objectA = {
            "/a": [
                getEntity(1),
            ],
            "/b/a": [
                getEntity(4),
            ],
        };
        const objectB = {
            "/a": [
                getEntity(1),
            ],
            "/b/a": [
                getEntity(3),
            ],
        };
        self.app.modules.dataStore.serializeEntities
            .mockReturnValueOnce(objectA)
            .mockReturnValueOnce(objectB);
        const history = new History();
        history.snapshot();
        history.snapshot();
        history.go(1); // Go to last positon after one snapshot
        expect(history.pointer).toBe(1);
        history.go(1); // Must do nothing
        expect(history.pointer).toBe(1);
    });

    test("Handle undo/redo", () => {
        // Test equality between project before and after history.go(-1) history.go(1)
        const objectA = {
            "/a": [
                getEntity(1),
            ],
            "/b": [
                getEntity(2),
            ],
        };
        const objectB = {
            "/a": [
                getEntity(1),
            ],
            "/c": [
                getEntity(3),
            ],
        };

        self.app.modules.dataStore.serializeEntities = jest.fn()
            .mockReturnValueOnce(objectA)
            .mockReturnValueOnce(objectB);

        const history = new History();
        history.snapshot();
        history.snapshot();
        const objBBefore = history.snapshots[0].layers;
        const objABefore = history.snapshots[1].layers;
        history.go(1);
        history.go(-1);
        const objBAfter = history.snapshots[0].layers;
        const objAAfter = history.snapshots[1].layers;
        expect(objBBefore).toEqual(objBAfter);
        expect(objABefore).toEqual(objAAfter);
    });
});

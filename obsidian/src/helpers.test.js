const helpers = require("../src/helpers");

describe("helpers.toCamelCase", () => {

    test("transforms a kebab-case string to camelCase", () => {
        expect(helpers.toCamelCase("foobar")).toBe("foobar");
        expect(helpers.toCamelCase("some-module-name")).toBe("someModuleName");
        expect(helpers.toCamelCase("some_module.name with:some--random#chars")).toBe("someModuleNameWithSomeRandomChars");
        expect(helpers.toCamelCase("foo0barBaz")).toBe("foo0barBaz");
        expect(helpers.toCamelCase("helloWorld")).toBe("helloWorld");
        expect(helpers.toCamelCase("HelloWorld")).toBe("helloWorld");
        expect(helpers.toCamelCase("HelloWORLD")).toBe("helloWorld");
        expect(helpers.toCamelCase("XYZController")).toBe("xyzController");
        expect(helpers.toCamelCase("Engine3dHelper")).toBe("engine3dHelper");
        expect(helpers.toCamelCase("Engine3DHelper")).toBe("engine3DHelper");
        expect(helpers.toCamelCase("fooBARFoobarFOOBAZ")).toBe("fooBarFoobarFoobaz");
        expect(helpers.toCamelCase("vector3d")).toBe("vector3d");
        expect(helpers.toCamelCase("vector3D")).toBe("vector3D");
        expect(helpers.toCamelCase("3dVector")).toBe("3DVector");
        expect(helpers.toCamelCase("A")).toBe("a");
        expect(helpers.toCamelCase("4")).toBe("4");
    });

});

describe("helpers.uniq", () => {

    test("removes duplicated entries of the list", () => {
        const list = ["mod1", "mod2", "mod1", "mod1", "mod3"];
        const uniqList = helpers.uniq(list);
        expect(uniqList).toEqual(["mod1", "mod2", "mod3"]);
    });

});

describe("helpers.objectGet", () => {

    const obj = {
        foo: 42,
        bar: {
            baz: {
                val: 1337,
            },
        },
        undef: undefined,
    };

    test("can get a simple path", () => {
        expect(helpers.objectGet(obj, "foo")).toEqual(42);
    });

    test("returns undefined if the path does not exist", () => {
        expect(helpers.objectGet(obj, "fizz")).toBe(undefined);
    });

    test("returns the default value if the path does not exist", () => {
        const marker = {};
        expect(helpers.objectGet(obj, "fizz", marker)).toBe(marker);
    });

    test("returns the value even if it is set to undefined", () => {
        expect(helpers.objectGet(obj, "undef", 13)).toBe(undefined);
    });

    test("can get a more complicated path", () => {
        expect(helpers.objectGet(obj, "bar.baz.val")).toEqual(1337);
    });

    test("returns undefined if the path does not exist (with a more complicated path)", () => {
        expect(helpers.objectGet(obj, "fizz.buzz")).toBe(undefined);
    });

});

describe("helpers.objectSet", () => {

    test("can set a simple path", () => {
        const obj = {};
        helpers.objectSet(obj, "foo", 42);
        expect(obj).toEqual({ foo: 42 });
    });

    test("can set a more complicated path", () => {
        const obj = { foo: {} };
        helpers.objectSet(obj, "foo.bar", 42);
        expect(obj).toEqual({ foo: { bar: 42 } });
    });

    test("creates missing parent objects", () => {
        const obj = {};
        helpers.objectSet(obj, "foo.bar.baz", 42);
        expect(obj).toEqual({ foo: { bar: { baz: 42 } } });
    });

});

describe("helpers.startsWith", () => {

    test("returns true if the string starts with the given prefix", () => {
        expect(helpers.startsWith("foobarbaz", "foo")).toBeTruthy();
    });

    test("returns false if the string does not start with the given prefix", () => {
        expect(helpers.startsWith("foobarbaz", "bar")).toBeFalsy();
    });

});

describe("helpers.mergeDeep", () => {

    test("merges two simple objects", () => {
        const object1 = {
            a: 1,
            b: 2,
        };
        const object2 = {
            b: 4,
            c: 3,
        };

        helpers.mergeDeep(object1, object2);

        expect(object1).toEqual({
            a: 1,
            b: 4,
            c: 3,
        });
    });

    test("merges recursively objects", () => {
        const object1 = {
            a: {
                foo: 1,
                b: {
                    bar: 2,
                },
            },
        };
        const object2 = {
            a: {
                b: {
                    baz: 3,
                },
            },
        };

        helpers.mergeDeep(object1, object2);

        expect(object1).toEqual({
            a: {
                foo: 1,
                b: {
                    bar: 2,
                    baz: 3,
                },
            },
        });
    });

    test("returns object1", () => {
        const object1 = {};
        const result = helpers.mergeDeep(object1, {});
        expect(result).toBe(object1);
    });

    test("does not merge arrays (replace them)", () => {
        const object1 = {
            a: [1, 2],
        };
        const object2 = {
            a: [3, 4],
        };

        helpers.mergeDeep(object1, object2);

        expect(object1).toEqual(object2);
    });

    test("can override non object properties with object", () => {
        const object1 = {
            a: 1,
        };
        const object2 = {
            a: {
                b: 2,
            },
        };

        helpers.mergeDeep(object1, object2);

        expect(object1).toEqual(object2);
    });

    test("handles dates", () => {
        const object1 = {
            date: new Date(),
        };

        const object2 = {
            date: {
                now: new Date(),
            },
        };

        helpers.mergeDeep(object1, object2);

        expect(object1).toEqual(object2);
    });

    test("handles regexp", () => {
        const object1 = {
            re: new RegExp("^foo$"),
        };

        const object2 = {
            re: {
                re: new RegExp("^bar"),
            },
        };

        helpers.mergeDeep(object1, object2);

        expect(object1).toEqual(object2);
    });

});

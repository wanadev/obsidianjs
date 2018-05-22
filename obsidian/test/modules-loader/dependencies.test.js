const each = require("jest-each");  // eslint-disable-line import/no-extraneous-dependencies

const dependencies = require("../../src/modules-loader/dependencies.js");

describe("modules-loader/dependencies.generateDependencyTree", () => {

    each([

        // ----------------------------------------------------

        //   2
        //   |
        //   1

        [
            "simple case 1",

            "mod2",

            {
                mod1: { name: "mod1", requires: [] },
                mod2: { name: "mod2", requires: ["mod1"] },
            },

            {
                name: "mod2",
                children: [{
                    name: "mod1",
                    children: [],
                }],
            },

        ],

        // ----------------------------------------------------

        //   1
        //  / \
        // 2   3
        //  \ /
        //   4

        [
            "losange",

            "mod1",

            {
                mod1: { name: "mod1", requires: ["mod2", "mod3"] },
                mod2: { name: "mod2", requires: ["mod4"] },
                mod3: { name: "mod3", requires: ["mod4"] },
                mod4: { name: "mod4", requires: [] },
            },

            {
                name: "mod1",
                children: [
                    {
                        name: "mod3",
                        children: [{
                            name: "mod4",
                            children: [],
                        }],
                    }, {
                        name: "mod2",
                        children: [{
                            name: "mod4",
                            children: [],
                        }],
                    },
                ],
            },

        ],

        // ----------------------------------------------------

        [
            "dependency not in catalog",

            "mod1",

            {
                mod1: { name: "mod1", requires: ["mod2"] },
            },

            {
                name: "mod1",
                children: [
                    {
                        name: "mod2",
                        children: [],
                    },
                ],
            },

        ],

    ]).test("can generate dependency tree (%s)", (label, moduleName, modules, expectedTree) => {
        expect(dependencies.generateDependencyTree(moduleName, modules))
            .toMatchObject(expectedTree);
    });

    test("Throw an error on circular dependencies", () => {
        // 1--> 2 --> 3
        // ^          |
        // |          |
        // +----------+
        const modules = {
            mod1: { name: "mod1", requires: ["mod2"] },
            mod2: { name: "mod2", requires: ["mod3"] },
            mod3: { name: "mod3", requires: ["mod1"] },
        };

        expect(() => dependencies.generateDependencyTree("mod1", modules))
            .toThrow(/CircularDependencyError/);
        expect(() => dependencies.generateDependencyTree("mod1", modules))
            .toThrow(/mod1/);
        expect(() => dependencies.generateDependencyTree("mod1", modules))
            .toThrow(/mod3/);
    });

});

describe("modules-loader/dependencies.flattenDependencyTree", () => {

    each([

        // ----------------------------------------------------

        //   2
        //   |
        //   1

        [
            "simple case 1",

            {
                name: "mod2",
                children: [{
                    name: "mod1",
                    children: [],
                }],
            },

            2,

            [
                ["mod1", "mod2"],
            ],

        ],

        // ----------------------------------------------------

        //   1
        //  / \
        // 2   3
        //  \ /
        //   4

        [
            "losange",

            {
                name: "mod1",
                children: [
                    {
                        name: "mod3",
                        children: [{
                            name: "mod4",
                            children: [],
                        }],
                    }, {
                        name: "mod2",
                        children: [{
                            name: "mod4",
                            children: [],
                        }],
                    },
                ],
            },

            4,

            [
                ["mod4", "mod2"],
                ["mod4", "mod3"],
                ["mod3", "mod1"],
                ["mod2", "mod1"],
            ],

        ],

    ]).test("can flatten dependency tree (%s)", (label, tree, length, constraints) => {
        const order = dependencies.flattenDependencyTree(tree);
        expect(order).toHaveLength(length);
        constraints.forEach(([a, b]) => expect(order.indexOf(a)).toBeLessThan(order.indexOf(b)));
    });

});

describe("modules-loader/dependencies.getLoadingOrder", () => {

    each([

        // ----------------------------------------------------

        //   2
        //   |
        //   1

        [
            "simple case 1",

            {
                mod1: { name: "mod1", requires: [] },
                mod2: { name: "mod2", requires: ["mod1"] },
            },

            [
                ["mod1", "mod2"],
            ],
        ],

        // ----------------------------------------------------

        //   1
        //   |
        //   2

        [
            "simple case 2",

            {
                mod1: { name: "mod1", requires: ["mod2"] },
                mod2: { name: "mod2", requires: [] },
            },

            [
                ["mod2", "mod1"],
            ],
        ],

        // ----------------------------------------------------

        //   1
        //  / \
        // 2   3
        //  \ /
        //   4

        [
            "losange",

            {
                mod1: { name: "mod1", requires: ["mod2", "mod3"] },
                mod2: { name: "mod2", requires: ["mod4"] },
                mod3: { name: "mod3", requires: ["mod4"] },
                mod4: { name: "mod4", requires: [] },
            },

            [
                ["mod4", "mod2"],
                ["mod4", "mod3"],
                ["mod2", "mod1"],
                ["mod3", "mod1"],
            ],
        ],

        // ----------------------------------------------------

        //   1
        //  /|
        // 2 |
        // | |
        // 4 |
        //  \|
        //   3
        //   |
        //   5

        [
            "branch",

            {
                mod1: { name: "mod1", requires: ["mod2", "mod3"] },
                mod2: { name: "mod2", requires: ["mod4"] },
                mod3: { name: "mod3", requires: ["mod5"] },
                mod4: { name: "mod4", requires: ["mod3"] },
                mod5: { name: "mod5", requires: [] },
            },

            [
                ["mod5", "mod3"],
                ["mod3", "mod4"],
                ["mod4", "mod2"],
                ["mod3", "mod1"],
                ["mod2", "mod1"],
            ],
        ],

        // ----------------------------------------------------

        //   1
        //  / \
        // 2   3
        // |\ /|
        // | X |
        // |/ \|
        // 4   5

        [
            "cross",

            {
                mod1: { name: "mod1", requires: ["mod2", "mod3"] },
                mod2: { name: "mod2", requires: ["mod4", "mod5"] },
                mod3: { name: "mod3", requires: ["mod4", "mod5"] },
                mod4: { name: "mod4", requires: [] },
                mod5: { name: "mod5", requires: [] },
            },

            [
                ["mod5", "mod3"],
                ["mod5", "mod2"],
                ["mod4", "mod3"],
                ["mod4", "mod2"],
                ["mod3", "mod1"],
                ["mod2", "mod1"],
            ],
        ],

        // ----------------------------------------------------

        //   1
        //  / \
        // 2   3
        // |\ /|
        // | 4 |
        //  \|/
        //   5

        [
            "cube",

            {
                mod1: { name: "mod1", requires: ["mod2", "mod3"] },
                mod2: { name: "mod2", requires: ["mod4", "mod5"] },
                mod3: { name: "mod3", requires: ["mod4", "mod5"] },
                mod4: { name: "mod4", requires: ["mod5"] },
                mod5: { name: "mod5", requires: [] },
            },

            [
                ["mod5", "mod4"],
                ["mod5", "mod3"],
                ["mod5", "mod2"],
                ["mod4", "mod3"],
                ["mod4", "mod2"],
                ["mod3", "mod1"],
                ["mod2", "mod1"],
            ],
        ],

        // ----------------------------------------------------

        // 1   2
        //  \ /
        //   3

        [
            "V",

            {
                mod1: { name: "mod1", requires: ["mod3"] },
                mod2: { name: "mod2", requires: ["mod3"] },
                mod3: { name: "mod3", requires: [] },
            },

            [
                ["mod3", "mod2"],
                ["mod3", "mod1"],
            ],
        ],

        // ----------------------------------------------------

        //   1     4
        //  / \    |
        // 2   3   5

        [
            "multi tree",

            {
                mod1: { name: "mod1", requires: ["mod2", "mod3"] },
                mod2: { name: "mod2", requires: [] },
                mod3: { name: "mod3", requires: [] },
                mod4: { name: "mod4", requires: ["mod5"] },
                mod5: { name: "mod5", requires: [] },
            },

            [
                ["mod5", "mod4"],
                ["mod3", "mod1"],
                ["mod2", "mod1"],
            ],
        ],

    ]).test("can resolve dependencies (%s)", (label, modules, constraints) => {
        const modulesList = Object.keys(modules);
        const order = dependencies.getLoadingOrder(modules);
        expect(order).toHaveLength(modulesList.length);
        modulesList.forEach(moduleName => expect(order).toContain(moduleName));
        constraints.forEach(([a, b]) => expect(order.indexOf(a)).toBeLessThan(order.indexOf(b)));
    });

    test("ignores required modules that are not listed", () => {
        const modules = {
            mod1: { name: "mod1", requires: ["mod2"] },
        };

        expect(dependencies.getLoadingOrder(modules)).toEqual(["mod1"]);
    });

    // TODO circular

});

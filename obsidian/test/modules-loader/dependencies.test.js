const each = require("jest-each");

const dependencies = require("../../src/modules-loader/dependencies.js");

describe("dependencies.getLoadingOrder", () => {

    each([

        // ----------------------------------------------------

        //   2
        //   |
        //   1

        [
            "simple case 1",

            [
                { name: "mod1", requires: [] },
                { name: "mod2", requires: ["mod1"] },
            ],

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

            [
                { name: "mod1", requires: ["mod2"] },
                { name: "mod2", requires: [] },
            ],

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

            [
                { name: "mod1", requires: ["mod2", "mod3"] },
                { name: "mod2", requires: ["mod4"] },
                { name: "mod3", requires: ["mod4"] },
                { name: "mod4", requires: [] },
            ],

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

            [
                { name: "mod1", requires: ["mod2", "mod3"] },
                { name: "mod2", requires: ["mod4"] },
                { name: "mod3", requires: ["mod5"] },
                { name: "mod4", requires: ["mod3"] },
                { name: "mod5", requires: [] },
            ],

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
            "cross 1",

            [
                { name: "mod1", requires: ["mod2", "mod3"] },
                { name: "mod2", requires: ["mod4", "mod5"] },
                { name: "mod3", requires: ["mod4", "mod5"] },
                { name: "mod4", requires: [] },
                { name: "mod5", requires: [] },
            ],

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
            "cross 2",

            [
                { name: "mod1", requires: ["mod2", "mod3"] },
                { name: "mod2", requires: ["mod4", "mod5"] },
                { name: "mod3", requires: ["mod4", "mod5"] },
                { name: "mod4", requires: ["mod5"] },
                { name: "mod5", requires: [] },
            ],

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
            "multi in",

            [
                { name: "mod1", requires: ["mod3"] },
                { name: "mod2", requires: ["mod3"] },
                { name: "mod3", requires: [] },
            ],

            [
                ["mod3", "mod2"],
                ["mod3", "mod1"],
            ],
        ],

        // ----------------------------------------------------

        //   1     4
        //  / \    |
        // 2  3    5

        [
            "multi tree",

            [
                { name: "mod1", requires: ["mod2", "mod3"] },
                { name: "mod2", requires: [] },
                { name: "mod3", requires: [] },
                { name: "mod4", requires: ["mod5"] },
                { name: "mod5", requires: [] },
            ],

            [
                ["mod5", "mod4"],
                ["mod3", "mod1"],
                ["mod2", "mod1"],
            ],
        ],

    ]).test("can resolve dependencies (%s)", (label, modules, constraints) => {
        const order = dependencies.getLoadingOrder(modules);
        expect(order).toHaveLength(modules.length);
        modules.forEach(m => expect(order).toContain(m.name));
        constraints.forEach(c => expect(order.indexOf(c[0])).toBeLessThan(order.indexOf(c[1])));
    });

    test("ignores required modules that are not listed", () => {
        const modules = [
            { name: "mod1", requires: ["mod2"] },
        ];

        expect(dependencies.getLoadingOrder(modules)).toEqual(["mod1"]);
    });

    // TODO circular

});

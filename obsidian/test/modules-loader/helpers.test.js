const helpers = require("../../src/modules-loader/helpers.js");

describe("modules-loader/helpers.appendChild", () => {

    test("handles call with null parent node", () => {
        helpers.appendChild(null, "test");  // should not crash
    });

    test("returns the newly created node", () => {
        const childNode = helpers.appendChild(null, "test");

        expect(childNode).toMatchObject({
            name: "test",
            parent: null,
            children: [],
        });
    });

    test("appends child to the parent node", () => {
        const rootNode = helpers.appendChild(null, "root");
        const childNode = helpers.appendChild(rootNode, "child");

        expect(rootNode).toMatchObject({
            name: "root",
            parent: null,
            children: [{
                name: "child",
                children: [],
            }],
        });
        expect(rootNode.children[0]).toBe(childNode);
        expect(childNode.parent).toBe(rootNode);
    });

});

describe("modules-loader/helpers.isCircular", () => {

    test("returns false if there is no circular references", () => {
        const mod1 = helpers.appendChild(null, "mod1");
        const mod2 = helpers.appendChild(mod1, "mod2");
        const mod3 = helpers.appendChild(mod2, "mod3");

        expect(helpers.isCircular(mod3, "mod4")).toBeFalsy();
        expect(helpers.isCircular(mod2, "mod4")).toBeFalsy();
        expect(helpers.isCircular(mod1, "mod2")).toBeFalsy();
    });

    test("returns true if there is a circular reference", () => {
        const mod1 = helpers.appendChild(null, "mod1");
        const mod2 = helpers.appendChild(mod1, "mod2");
        const mod3 = helpers.appendChild(mod2, "mod3");

        expect(helpers.isCircular(mod3, "mod1")).toBeTruthy();
        expect(helpers.isCircular(mod2, "mod1")).toBeTruthy();
    });

});

describe("modules-loader/helpers.printCircularPath", () => {

    test("returns the circular path", () => {
        const mod1 = helpers.appendChild(null, "mod1");
        const mod2 = helpers.appendChild(mod1, "mod2");
        const mod3 = helpers.appendChild(mod2, "mod3");

        const path = helpers.printCircularPath(mod3, "mod1");

        expect(path).toMatch(/mod1.+mod2.+mod3.+mod1/);
    });

});

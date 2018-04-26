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

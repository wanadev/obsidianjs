const helpers = require("../src/helpers.js");

describe("helpers.toCamelCase", () => {

    test("transforms a kebab-case string to camelCase", () => {
        expect(helpers.toCamelCase("foobar")).toBe("foobar");
        expect(helpers.toCamelCase("some-module-name")).toBe("someModuleName");
        expect(helpers.toCamelCase("some_module.name with:some--random#chars")).toBe("someModuleNameWithSomeRandomChars");
        expect(helpers.toCamelCase("foo0barBaz")).toBe("foo0Barbaz");
    });

});

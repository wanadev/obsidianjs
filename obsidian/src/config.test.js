const Config = require("./config.js");

describe("Config.get", () => {

    // TODO

});

describe("Config.set", () => {

    // TODO

});

describe("Config.dump", () => {

    // TODO

});

describe("Config.load", () => {

    // TODO

});

describe("Config._resolvePath", () => {

    test("An absolute path to @obsidian", () => {
        const config = new Config();
        expect(config._resolvePath("@obsidian.foo.bar")).toEqual("obsidian.foo.bar");  // eslint-disable-line no-underscore-dangle
    });

    test("An absolute path to @app", () => {
        const config = new Config();
        expect(config._resolvePath("@app.foo.bar")).toEqual("app.foo.bar");  // eslint-disable-line no-underscore-dangle
    });

    test("An absolute path to a module config", () => {
        const config = new Config();
        expect(config._resolvePath("@fooModule.foo.bar")).toEqual("modules.fooModule.foo.bar");  // eslint-disable-line no-underscore-dangle
    });

    test("An absolute path to a module config using kebab case", () => {
        const config = new Config();
        expect(config._resolvePath("@foo-module.foo.bar")).toEqual("modules.fooModule.foo.bar");  // eslint-disable-line no-underscore-dangle
    });

    test("A relative path", () => {
        const config = new Config();
        config.setApp({
            namespace: "foo-module",
        });
        expect(config._resolvePath("foo.bar")).toEqual("modules.fooModule.foo.bar");  // eslint-disable-line no-underscore-dangle
    });

});

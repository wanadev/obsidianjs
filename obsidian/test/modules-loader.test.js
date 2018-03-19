const ModulesLoader = require("../src/modules-loader.js");

describe("ModulesLoader.register", () => {

    test("can register a module that looks valide", () => {
        const modules = new ModulesLoader();

        expect(() => {
            modules.register({
                name: "foo",
                requires: [],
                load: () => {},
                unload: () => {},
            });
        }).not.toThrow();
    });

    test("throws an error if the module has no 'name' property", () => {
        const modules = new ModulesLoader();

        expect(() => {
            modules.register({
                requires: [],
                load: () => {},
                unload: () => {},
            });
        }).toThrow(/InvalidObsidianModule/);
    });

    test("throws an error if the module has no 'requires' property", () => {
        const modules = new ModulesLoader();

        expect(() => {
            modules.register({
                name: "foo",
                load: () => {},
                unload: () => {},
            });
        }).toThrow(/InvalidObsidianModule/);
    });

    test("throws an error if the module 'requires' property is not an array", () => {
        const modules = new ModulesLoader();

        expect(() => {
            modules.register({
                name: "foo",
                requires: null,
                load: () => {},
                unload: () => {},
            });
        }).toThrow(/InvalidObsidianModule/);
    });

    test("throws an error if the module has no 'load' function", () => {
        const modules = new ModulesLoader();

        expect(() => {
            modules.register({
                name: "foo",
                requires: [],
                unload: () => {},
            });
        }).toThrow(/InvalidObsidianModule/);
    });

    test("throws an error if the module 'load' property is not a function", () => {
        const modules = new ModulesLoader();

        expect(() => {
            modules.register({
                name: "foo",
                requires: [],
                load: null,
                unload: () => {},
            });
        }).toThrow(/InvalidObsidianModule/);
    });

    test("throws an error if the module has no 'unload' function", () => {
        const modules = new ModulesLoader();

        expect(() => {
            modules.register({
                name: "foo",
                requires: [],
                load: () => {},
            });
        }).toThrow(/InvalidObsidianModule/);
    });

    test("throws an error if the module 'unload' property is not a function", () => {
        const modules = new ModulesLoader();

        expect(() => {
            modules.register({
                name: "foo",
                requires: [],
                load: () => {},
                unload: null,
            });
        }).toThrow(/InvalidObsidianModule/);
    });

});

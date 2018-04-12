const ModulesLoader = require("../src/modules-loader.js");

describe("ModulesLoader.setApp", () => {

    test("can be used to set an application instance to work with", () => {
        const modules = new ModulesLoader();
        modules.setApp({});
    });

});

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

describe("ModulesLoader.load", () => {

    test("can load a registered module", () => {
        const testModuleLoadFn = jest.fn();
        const testModuleUnloadFn = jest.fn();
        const testModule = {
            name: "test-module",
            requires: [],
            load: testModuleLoadFn,
            unload: testModuleUnloadFn,
        };

        const modules = new ModulesLoader();
        modules.setApp({ _createSubApplication: () => ({}) });

        modules.register(testModule);

        return modules.load("test-module")
            .then(() => {
                expect(testModuleLoadFn.mock.calls.length).toBe(1);
                expect(testModuleUnloadFn.mock.calls.length).toBe(0);
            });
    });

    test("can load a renamed module", () => {
        const testModuleLoadFn = jest.fn();
        const testModuleUnloadFn = jest.fn();
        const testModule = {
            name: "test-module",
            requires: [],
            load: testModuleLoadFn,
            unload: testModuleUnloadFn,
        };

        const modules = new ModulesLoader();
        modules.setApp({ _createSubApplication: () => ({}) });

        modules.register(testModule, {
            name: "new-test-module",
        });

        return modules.load("new-test-module")
            .then(() => {
                expect(testModuleLoadFn.mock.calls.length).toBe(1);
                expect(testModuleUnloadFn.mock.calls.length).toBe(0);
            });
    });

    test("does not reload a module that is already loaded (load() method is called only once)", () => {
        const testModuleLoadFn = jest.fn();
        const testModuleUnloadFn = jest.fn();
        const testModule = {
            name: "test-module",
            requires: [],
            load: testModuleLoadFn,
            unload: testModuleUnloadFn,
        };

        const modules = new ModulesLoader();
        modules.setApp({ _createSubApplication: () => ({}) });

        modules.register(testModule);

        return modules.load("test-module")
            .then(() => modules.load("test-module"))
            .then(() => {
                expect(testModuleLoadFn.mock.calls.length).toBe(1);
                expect(testModuleUnloadFn.mock.calls.length).toBe(0);
            });
    });

    test("returns an error if the module is not registered", () => {
        expect.assertions(1);

        const modules = new ModulesLoader();

        return modules.load("foobar")
            .catch((error) => {
                expect(error.toString()).toMatch("UnknownModule");
            });
    });

    test("returns an error if the load() function of the module fails", () => {
        expect.assertions(1);

        const testModule = {
            name: "test-module",
            requires: [],
            load: () => {
                throw new Error("TestError");
            },
            unload: () => {},
        };

        const modules = new ModulesLoader();
        modules.setApp({ _createSubApplication: () => ({}) });

        modules.register(testModule);

        return modules.load("test-module")
            .catch((error) => {
                expect(error.toString()).toMatch("ModuleLoadingError");
            });
    });

});

describe("ModulesLoader.modules", () => {

    test("contains loaded modules", () => {
        expect.assertions(1);

        const testModule = {
            name: "test-module",
            requires: [],
            load: () => "my-test-module",
            unload: () => {},
        };

        const modules = new ModulesLoader();
        modules.setApp({ _createSubApplication: () => ({}) });

        modules.register(testModule);

        return modules.load("test-module")
            .then(() => {
                expect(modules.modules).toHaveProperty("testModule", "my-test-module");
            });
    });

});

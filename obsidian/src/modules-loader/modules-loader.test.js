const { ModulesLoader } = require("../../src/modules-loader");

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

    test("Load the module default's config if available", () => {
        const app = {
            config: {
                load: jest.fn(),
            },
        };

        const modules = new ModulesLoader();
        modules.setApp(app);

        const module1 = {
            name: "module1",
            requires: [],
            config: {
                foo: "bar",
                fizz: "buzz",
            },
            load: () => {},
            unload: () => {},
        };

        modules.register(module1);

        expect(app.config.load).toHaveBeenCalledTimes(1);
        expect(app.config.load).toHaveBeenCalledWith({
            modules: {
                module1: {
                    foo: "bar",
                    fizz: "buzz",
                },
            },
        });
    });

});

describe("ModulesLoader.load", () => {

    test("can load a registered module", () => {
        const testModule = {
            name: "test-module",
            requires: [],
            load: jest.fn(),
            unload: jest.fn(),
        };

        const modules = new ModulesLoader();
        modules.setApp({ _createSubApplication: () => ({}) });

        modules.register(testModule);

        return modules.load("test-module")
            .then(() => {
                expect(testModule.load).toHaveBeenCalledTimes(1);
                expect(testModule.unload).toHaveBeenCalledTimes(0);
            });
    });

    test("provides the namespaced app to the module when loading it", () => {
        const testModule = {
            name: "test-module",
            requires: [],
            load: jest.fn(),
            unload: jest.fn(),
        };

        const subApp = {};
        const modules = new ModulesLoader();
        modules.setApp({ _createSubApplication: () => subApp });

        modules.register(testModule);

        return modules.load("test-module")
            .then(() => {
                expect(testModule.app).toBe(subApp);
            });
    });

    test("can load a renamed module", () => {
        const testModule = {
            name: "test-module",
            requires: [],
            load: jest.fn(),
            unload: jest.fn(),
        };

        const modules = new ModulesLoader();
        modules.setApp({ _createSubApplication: () => ({}) });

        modules.register(testModule, {
            name: "new-test-module",
        });

        return modules.load("new-test-module")
            .then(() => {
                expect(testModule.load).toHaveBeenCalledTimes(1);
                expect(testModule.unload).toHaveBeenCalledTimes(0);
            });
    });

    test("does not reload a module that is already loaded (load() method is called only once)", () => {
        const testModule = {
            name: "test-module",
            requires: [],
            load: jest.fn(),
            unload: jest.fn(),
        };

        const modules = new ModulesLoader();
        modules.setApp({ _createSubApplication: () => ({}) });

        modules.register(testModule);

        return modules.load("test-module")
            .then(() => modules.load("test-module"))
            .then(() => {
                expect(testModule.load).toHaveBeenCalledTimes(1);
                expect(testModule.unload).toHaveBeenCalledTimes(0);
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

    test("gets required modules injected", () => {
        const module1 = {
            name: "module-1",
            requires: [],
            load: jest.fn().mockReturnValue("module1-controller"),
            unload: () => {},
        };

        const module2 = {
            name: "module-2",
            requires: ["module1-"],
            load: jest.fn(),
            unload: () => {},
        };

        const modules = new ModulesLoader();
        modules.setApp({
            _createSubApplication: (ns, m) => ({
                modules: m,
            }),
        });

        modules.register(module1);
        modules.register(module2);

        expect.assertions(5);

        return modules.load("module-1")
            .then(() => modules.load("module-2"))
            .then(() => {
                expect(module1.load).toHaveBeenCalledTimes(1);
                expect(Object.keys(module1.load.mock.calls[0][0].modules)).toHaveLength(0);

                expect(module2.load).toHaveBeenCalledTimes(1);
                expect(Object.keys(module2.load.mock.calls[0][0].modules)).toHaveLength(1);
                expect(module2.load.mock.calls[0][0]).toHaveProperty("modules.module1", "module1-controller");
            });
    });

    test("throws an error if a required module is not loaded", () => {
        const module2 = {
            name: "module-2",
            requires: ["module-1"],
            load: jest.fn(),
            unload: () => {},
        };

        const modules = new ModulesLoader();
        modules.setApp({
            _createSubApplication: () => ({}),
        });

        modules.register(module2);

        expect.assertions(1);

        return modules.load("module-2")
            .catch((error) => {
                expect(error.toString()).toMatch(/UnmetDependency/);
            });
    });

    test("has the right context", () => {
        expect.assertions(1);

        const testModule = {
            name: "test-module",
            requires: [],
            load() {
                expect(this).toBe(testModule);
            },
            unload: jest.fn(),
        };

        const modules = new ModulesLoader();
        modules.setApp({ _createSubApplication: () => ({}) });

        modules.register(testModule);

        return modules.load("test-module");
    });

});

describe("ModulesLoader.loadAll", () => {

    test("can load all registered modules", () => {
        const module1 = {
            name: "module1",
            requires: [],
            load: jest.fn(),
            unload: jest.fn(),
        };

        const module2 = {
            name: "module2",
            requires: [],
            load: jest.fn(),
            unload: jest.fn(),
        };

        const modules = new ModulesLoader();
        modules.setApp({ _createSubApplication: () => ({}) });

        modules.register(module1);
        modules.register(module2);

        return modules.loadAll()
            .then(() => {
                expect(module1.load).toHaveBeenCalledTimes(1);
                expect(module1.unload).toHaveBeenCalledTimes(0);
                expect(module2.load).toHaveBeenCalledTimes(1);
                expect(module2.unload).toHaveBeenCalledTimes(0);
            });
    });

    test("returns loaded modules", () => {
        const module1 = {
            name: "module1",
            requires: [],
            load: () => "module1",
            unload: () => {},
        };

        const module2 = {
            name: "module2",
            requires: [],
            load: () => "module2",
            unload: () => {},
        };

        const modules = new ModulesLoader();
        modules.setApp({ _createSubApplication: () => ({}) });

        modules.register(module1);
        modules.register(module2);

        return modules.loadAll()
            .then((loadedModules) => {
                expect(loadedModules).toEqual({
                    module1: "module1",
                    module2: "module2",
                });
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

const Application = require("../src/application");

describe("application.load", () => {

    test("registers the given module but do not load it if application have not been started yet", () => {
        const modulesLoader = {
            register: jest.fn(),
            load: jest.fn(),
        };

        const module = {
            name: "test-module",
            requires: [],
            load: () => {},
            unload: () => {},
        };

        const app = new Application("test", undefined, {
            modulesLoader,
        });

        app.load(module);

        expect(modulesLoader.register).toHaveBeenCalledTimes(1);
        expect(modulesLoader.register).toHaveBeenCalledWith(module, {});
        expect(modulesLoader.load).toHaveBeenCalledTimes(0);
    });

    test("passes params to the module loader register function", () => {
        const modulesLoader = {
            register: jest.fn(),
            load: jest.fn(),
        };

        const module = {
            name: "test-module",
            requires: [],
            load: () => {},
            unload: () => {},
        };

        const params = {};

        const app = new Application("test", undefined, {
            modulesLoader,
        });

        app.load(module, params);

        expect(modulesLoader.register).toHaveBeenCalledTimes(1);
        expect(modulesLoader.register).toHaveBeenCalledWith(module, params);
    });

    test("throws an error if called from a sub-application (inside a module)", () => {
        const app = new Application("test", "sub-application", {
            rootApp: {},
        });

        expect(() => app.load({})).toThrow(/ContextError/);
    });

    test("throw an error when trying to load a module when applicaiton already started", () => {
        const app = new Application("test", undefined, {
            modulesLoader: {
                loadAll: () => {},
            },
        });

        app.start();

        expect(() => app.load({})).toThrow(/ApplicationAlreadyStarted/);
    });

});

describe("application.start", () => {

    test("load all modules registered before application start", () => {
        const modulesLoader = {
            register: jest.fn(),
            load: jest.fn(),
            loadAll: jest.fn(),
        };

        const module1 = {
            name: "test-module-1",
            requires: [],
            load: () => {},
            unload: () => {},
        };

        const module2 = {
            name: "test-module-2",
            requires: [],
            load: () => {},
            unload: () => {},
        };

        const app = new Application("test", undefined, {
            modulesLoader,
        });

        app.load(module1);
        app.load(module2);

        app.start();

        expect(modulesLoader.register).toHaveBeenCalledTimes(2);
        expect(modulesLoader.register.mock.calls[0][0]).toBe(module1);
        expect(modulesLoader.register.mock.calls[1][0]).toBe(module2);
        expect(modulesLoader.loadAll).toHaveBeenCalledTimes(1);
    });

    test("thows an error if called twice", () => {
        const modulesLoader = {
            loadAll: jest.fn(),
        };

        const app = new Application("test", undefined, {
            modulesLoader,
        });

        app.start();

        expect(() => app.start()).toThrow(/ApplicationAlreadyStarted/);

        expect(modulesLoader.loadAll.mock.calls.length).toBe(1);

    });

});

describe("application.modules", () => {

    test("returns the module loader modules on root application", () => {
        const modulesLoader = {
            modules: {
                foo: "bar",
            },
        };

        const app = new Application("test", undefined, {
            modulesLoader,
        });

        expect(app.modules).toBe(modulesLoader.modules);
    });

    test("returns the application local modules on sub-applications", () => {
        const modulesLoader = {
            modules: {
                foo: "bar",
            },
        };

        const localModules = {
            x: "y",
        };

        const app = new Application("test", undefined, {
            modulesLoader,
            rootApp: {},
        }, localModules);

        expect(app.modules).toBe(localModules);
    });

});

describe("application._createSubApplication", () => {

    // TODO

});

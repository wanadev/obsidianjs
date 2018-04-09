const Application = require("../src/application.js");

describe("Application.constructor", () => {

    test("sets the application to the given modules", () => {
        const dependencies = {
            modulesLoader: { setApp: jest.fn() },
            config: { setApp: jest.fn() },
            events: { setApp: jest.fn() },
            log: { setApp: jest.fn() },
        };

        const app = new Application("test", undefined, dependencies, undefined)

        expect(dependencies.modulesLoader.setApp).toHaveBeenCalledTimes(1);
        expect(dependencies.modulesLoader.setApp).toHaveBeenCalledWith(app);

        expect(dependencies.config.setApp).toHaveBeenCalledTimes(1);
        expect(dependencies.config.setApp).toHaveBeenCalledWith(app);

        expect(dependencies.events.setApp).toHaveBeenCalledTimes(1);
        expect(dependencies.events.setApp).toHaveBeenCalledWith(app);

        expect(dependencies.log.setApp).toHaveBeenCalledTimes(1);
        expect(dependencies.log.setApp).toHaveBeenCalledWith(app);
    });

});

describe("Application.load", () => {

    test("registers the given module but do not load it if application have not been started yet", () => {
        const modulesLoader = {
            setApp: () => {},
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
            setApp: () => {},
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
                setApp: () => {},
                loadAll: () => {},
            },
        });

        app.start();

        expect(() => app.load({})).toThrow(/ApplicationAlreadyStarted/);
    });

});

describe("Application.start", () => {

    test("load all modules registered before application start", () => {
        const modulesLoader = {
            setApp: () => {},
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
            setApp: () => {},
            loadAll: jest.fn(),
        };

        const app = new Application("test", undefined, {
            modulesLoader,
        });

        app.start();

        expect(() => app.start()).toThrow(/ApplicationAlreadyStarted/);

        expect(modulesLoader.loadAll.mock.calls.length).toBe(1);

    });

    test("not allows to be called from sub-application", () => {
        const modulesLoader = {
            setApp: () => {},
            loadAll: () => {},
            _getNamespaced: () => ({}),
        };

        const module = {
            setApp: () => {},
            _getNamespaced: () => ({}),
        };

        const app = new Application("test", undefined, {
            modulesLoader,
            config: module,
            events: module,
            log: module,
        });

        const subApp = app._createSubApplication("sub");  // eslint-disable-line no-underscore-dangle

        expect(() => subApp.start()).toThrow(/ContextError/);
    });

});

describe("Application.isStarted", () => {

    test("indicates that application started (from root application)", () => {
        const modulesLoader = {
            setApp: () => {},
            loadAll: () => {},
            _getNamespaced: () => ({}),
        };

        const app = new Application("test", undefined, {
            modulesLoader,
        });

        expect(app.isStarted).toBe(false);

        app.start();

        expect(app.isStarted).toBe(true);
    });

    test("indicates that application started (from sub application)", () => {
        const modulesLoader = {
            setApp: () => {},
            loadAll: () => {},
            _getNamespaced: () => ({}),
        };

        const module = {
            setApp: () => {},
            _getNamespaced: () => ({}),
        };

        const app = new Application("test", undefined, {
            modulesLoader,
            config: module,
            events: module,
            log: module,
        });

        const subApp = app._createSubApplication("sub");  // eslint-disable-line no-underscore-dangle

        expect(subApp.isStarted).toBe(false);

        app.start();

        expect(subApp.isStarted).toBe(true);
    });

});

describe("Application.modules", () => {

    test("returns the module loader modules on root application", () => {
        const modulesLoader = {
            setApp: () => {},
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
            setApp: () => {},
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

describe("Application._createSubApplication", () => {

    // TODO

});

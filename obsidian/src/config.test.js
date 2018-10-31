const Config = require("./config.js");

describe("Config.set / Config.get", () => {

    test("can set and get a value", () => {
        const config = new Config();
        config.set("@app.testValue", 42);
        expect(config.get("@app.testValue")).toEqual(42);
    });

    test("can set and get a value in sub objects", () => {
        const config = new Config();
        config.set("@app.obj1.obj2.testValue", 42);
        expect(config.get("@app.obj1.obj2.testValue")).toEqual(42);
    });

    test("returns undefined if the did not exist", () => {
        const config = new Config();
        expect(config.get("@app.foo")).toBe(undefined);
    });

    test("returns the provided default value if the path did not exist", () => {
        const config = new Config();
        expect(config.get("@app.foo", "default")).toEqual("default");
    });

    test("(.get) returns values from base config", () => {
        const config = new Config();
        config.load({
            app: {
                foo: "bar",
            },
        });
        expect(config.get("@app.foo")).toEqual("bar");
    });

    test("(.get) returns values from custom config in priority", () => {
        const config = new Config();
        config.set("@app.foo", "baz!");
        config.load({
            app: {
                foo: "bar",
            },
        });
        expect(config.get("@app.foo")).toEqual("baz!");
    });

});

describe("Config.load / Config.dump", () => {

    test("can load and dump base config", () => {
        const cfg = {
            app: {
                foo: "bar",
            },
        };

        const config = new Config();
        config.load(cfg);

        expect(config.dump().app).toEqual(cfg.app);
        expect(config.dump().app).not.toBe(cfg.app);
        expect(config.dump(true)).not.toEqual(cfg.app);
    });

    test("can load and dump a custom config", () => {
        const cfg = {
            app: {
                foo: "bar",
            },
        };

        const config = new Config();
        config.load(cfg, true);

        expect(config.dump().app).toEqual(cfg.app);
        expect(config.dump().app).not.toBe(cfg.app);
        expect(config.dump(true).app).toEqual(cfg.app);
    });

    test("merge new base config with the existing one", () => {
        const cfg1 = {
            app: {
                hello: "world",
                foo: "bar",
            },
        };

        const cfg2 = {
            app: {
                foo: "baz!",
                fizz: "buzz",
            },
        };

        const config = new Config();
        config.load(cfg1);
        config.load(cfg2);

        expect(config.dump().app).toEqual({
            hello: "world",
            foo: "baz!",
            fizz: "buzz",
        });
    });

    test("merge new custom config with the existing one", () => {
        const cfg1 = {
            app: {
                hello: "world",
                foo: "bar",
            },
        };

        const cfg2 = {
            app: {
                foo: "baz!",
                fizz: "buzz",
            },
        };

        const config = new Config();
        config.load(cfg1, true);
        config.load(cfg2, true);

        expect(config.dump(true).app).toEqual({
            hello: "world",
            foo: "baz!",
            fizz: "buzz",
        });
    });

    test("can merge base and custom config when dumping", () => {
        const baseCfg = {
            app: {
                hello: "world",
                foo: "bar",
            },
        };

        const customCfg = {
            app: {
                foo: "baz!",
                fizz: "buzz",
            },
        };

        const config = new Config();
        config.load(customCfg, true);
        config.load(baseCfg);

        expect(config.dump().app).toEqual({
            hello: "world",
            foo: "baz!",
            fizz: "buzz",
        });
    });

});

describe("Config._resolvePath", () => {

    test("resolves an absolute path to @obsidian", () => {
        const config = new Config();
        expect(config._resolvePath("@obsidian.foo.bar")).toEqual("obsidian.foo.bar");  // eslint-disable-line no-underscore-dangle
    });

    test("resolves an absolute path to @app", () => {
        const config = new Config();
        expect(config._resolvePath("@app.foo.bar")).toEqual("app.foo.bar");  // eslint-disable-line no-underscore-dangle
    });

    test("resolves an absolute path to a module config", () => {
        const config = new Config();
        expect(config._resolvePath("@fooModule.foo.bar")).toEqual("modules.fooModule.foo.bar");  // eslint-disable-line no-underscore-dangle
    });

    test("resolves an absolute path to a module config using kebab case", () => {
        const config = new Config();
        expect(config._resolvePath("@foo-module.foo.bar")).toEqual("modules.fooModule.foo.bar");  // eslint-disable-line no-underscore-dangle
    });

    test("resolves a relative path", () => {
        const config = new Config();
        config.setApp({
            namespace: "foo-module",
        });
        expect(config._resolvePath("foo.bar")).toEqual("modules.fooModule.foo.bar");  // eslint-disable-line no-underscore-dangle
    });

});

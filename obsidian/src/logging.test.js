const Logging = require("../src/logging.js");

describe("Logging.info", () => {

    test("Emit a 'log' event with right level and namespace when called from application", () => {
        const app = {
            name: "test-app",
            namespace: "obsidian",  // ROOT
            events: {
                emit: jest.fn(),
            },
        };

        const log = new Logging();
        log.setApp(app);

        log.info("hello", "world", 42);

        expect(app.events.emit).toHaveBeenCalledWith("log", "info", "obsidian", ["hello", "world", 42]);
    });

    test("Emit a 'log' event with right level and namespace when called from a sub-application", () => {
        const app = {
            name: "test-app",
            namespace: "obsidian",  // ROOT
            events: {
                emit: jest.fn(),
            },
        };

        const subApp = {
            name: "test-app",
            namespace: "test-module",
        };

        const log = new Logging();
        log.setApp(app);
        const subLog = new Logging(log);
        subLog.setApp(subApp);

        subLog.info("hello", "world", 42);

        expect(app.events.emit).toHaveBeenCalledWith("log", "info", "test-module", ["hello", "world", 42]);
    });

});

describe("Logging.warn", () => {

    test("Emit a 'log' event with right level and namespace when called from application", () => {
        const app = {
            name: "test-app",
            namespace: "obsidian",  // ROOT
            events: {
                emit: jest.fn(),
            },
        };

        const log = new Logging();
        log.setApp(app);

        log.warn("hello", "world", 42);

        expect(app.events.emit).toHaveBeenCalledWith("log", "warn", "obsidian", ["hello", "world", 42]);
    });

    test("Emit a 'log' event with right level and namespace when called from a sub-application", () => {
        const app = {
            name: "test-app",
            namespace: "obsidian",  // ROOT
            events: {
                emit: jest.fn(),
            },
        };

        const subApp = {
            name: "test-app",
            namespace: "test-module",
        };

        const log = new Logging();
        log.setApp(app);
        const subLog = new Logging(log);
        subLog.setApp(subApp);

        subLog.warn("hello", "world", 42);

        expect(app.events.emit).toHaveBeenCalledWith("log", "warn", "test-module", ["hello", "world", 42]);
    });

});

describe("Logging.error", () => {

    test("Emit a 'log' event with right level and namespace when called from application", () => {
        const app = {
            name: "test-app",
            namespace: "obsidian",  // ROOT
            events: {
                emit: jest.fn(),
            },
        };

        const log = new Logging();
        log.setApp(app);

        log.error("hello", "world", 42);

        expect(app.events.emit).toHaveBeenCalledWith("log", "error", "obsidian", ["hello", "world", 42]);
    });

    test("Emit a 'log' event with right level and namespace when called from a sub-application", () => {
        const app = {
            name: "test-app",
            namespace: "obsidian",  // ROOT
            events: {
                emit: jest.fn(),
            },
        };

        const subApp = {
            name: "test-app",
            namespace: "test-module",
        };

        const log = new Logging();
        log.setApp(app);
        const subLog = new Logging(log);
        subLog.setApp(subApp);

        subLog.error("hello", "world", 42);

        expect(app.events.emit).toHaveBeenCalledWith("log", "error", "test-module", ["hello", "world", 42]);
    });

});

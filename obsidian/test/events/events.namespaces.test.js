const { Events } = require("../../src/events");

describe("namespaced events", () => {
    test("can register events within a namespace using full path", () => {
        const events = new Events();

        const myModuleEvents = events._getNamespaced("my-module");

        const listener = jest.fn();

        myModuleEvents.on("my-module.my-event", listener);
        myModuleEvents.emit("my-event", listener);

        expect(listener).toHaveBeenCalledTimes(1);
    });

    test("can register events within a namespace using tilde shortcut", () => {
        const events = new Events();

        const myModuleEvents = events._getNamespaced("my-module");

        const listener = jest.fn();

        myModuleEvents.on("~.my-event", listener);
        myModuleEvents.emit("my-event", listener);

        expect(listener).toHaveBeenCalledTimes(1);
    });

    test("can register events from a namespace to another namespace", () => {
        const events = new Events();

        const myModule1Events = events._getNamespaced("my-module-1");
        const myModule2Events = events._getNamespaced("my-module-2");

        const listener = jest.fn();

        myModule2Events.on("my-module-1.my-event", listener);
        myModule1Events.emit("my-event", listener);

        expect(listener).toHaveBeenCalledTimes(1);
    });

    test("can register global (obsidian) events within a namespace", () => {
        const events = new Events();

        const myModuleEvents = events._getNamespaced("my-module");

        const listener = jest.fn();

        myModuleEvents.on("obsidian.my-event", listener);
        events.emit("my-event", listener);

        expect(listener).toHaveBeenCalledTimes(1);
    });
});

const { Events } = require("../../src/events");

describe("namespaced events", () => {
    test("can register events from a namespace to another namespace", () => {
        const events = new Events();

        const myModule1Events = events._getNamespaced("my-module-1");
        const myModule2Events = events._getNamespaced("my-module-2");

        const listener1 = jest.fn();
        const listener2 = jest.fn();

        myModule2Events.on("my-module-1.my-event", listener1);
        myModule1Events.emit("my-event", listener1);

        myModule1Events.on("my-module-2.my-event", listener2);
        myModule2Events.emit("my-event", listener2);

        expect(listener1).toHaveBeenCalledTimes(1);
        expect(listener2).toHaveBeenCalledTimes(1);
    });
});

const { Events } = require("../../src/events");

const makeBasicTests = (events) => {
    test("calls the registered listener when emitting an event", () => {
        const listener = jest.fn();

        events.on("~.my-event", listener);
        events.emit("my-event");

        expect(listener).toHaveBeenCalledTimes(1);
    });

    test("calls the registered listener with given arguments when emitting an event", () => {
        const listener = jest.fn();
        const args = ["hello", "world", 12];

        events.on("~.my-event", listener);
        events.emit("my-event", ...args);

        expect(listener).toHaveBeenCalledWith(...args);
    });

    test("calls the registered listener each time the event is emitted", () => {
        const listener = jest.fn();

        events.on("~.my-event", listener);

        events.emit("my-event");
        events.emit("my-event");
        events.emit("my-event");

        expect(listener).toHaveBeenCalledTimes(3);
    });

    test("can register multiple listeners on a single event", () => {
        const listeners = [jest.fn(), jest.fn(), jest.fn()];
        const args = ["hello", "world", 12];

        listeners.forEach(listener => events.on("~.my-event", listener));
        events.emit("my-event", ...args);

        listeners.forEach(listener =>
            expect(listener).toHaveBeenCalledTimes(1));
    });

    test("calls the registered listener only once if registered multiple times to the same event", () => {
        const listener = jest.fn();

        events.on("~.my-event", listener);
        events.on("~.my-event", listener);

        events.emit("my-event");

        expect(listener).toHaveBeenCalledTimes(1);
    });

    test("can remove a listener to an event", () => {
        const listener = jest.fn();

        events.on("~.my-event", listener);
        events.removeListener("~.my-event", listener);
        events.emit("my-event");

        expect(listener).not.toHaveBeenCalled();
    });
};

describe("basic event emitting", () => {
    describe("events", () => {
        const events = new Events();
        makeBasicTests(events);
    });

    describe("namespaced events", () => {
        const namespacedEvents = new Events()._getNamespaced("my-module");
        makeBasicTests(namespacedEvents);
    });
});

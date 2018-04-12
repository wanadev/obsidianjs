const { Events } = require("../../src/events");

describe("basic event emitting", () => {
    describe("events", () => {
        test("calls the registered listener when emitting an event", () => {
            const events = new Events();
            const listener = jest.fn();

            events.on("obsidian.my-event", listener);
            events.emit("my-event");

            expect(listener).toHaveBeenCalledTimes(1);
        });

        test("calls the registered listener with given arguments when emitting an event", () => {
            const events = new Events();
            const listener = jest.fn();
            const args = ["hello", "world", 12];

            events.on("obsidian.my-event", listener);
            events.emit("my-event", ...args);

            expect(listener).toHaveBeenCalledWith(...args);
        });

        test("calls the registered listener each time the event is emitted", () => {
            const events = new Events();
            const listener = jest.fn();

            events.on("obsidian.my-event", listener);

            events.emit("my-event");
            events.emit("my-event");
            events.emit("my-event");

            expect(listener).toHaveBeenCalledTimes(3);
        });

        test("can register multiple listeners on a single event", () => {
            const events = new Events();
            const listeners = [jest.fn(), jest.fn(), jest.fn()];
            const args = ["hello", "world", 12];

            listeners.forEach(listener =>
                events.on("obsidian.my-event", listener));

            events.emit("my-event", ...args);

            listeners.forEach(listener =>
                expect(listener).toHaveBeenCalledTimes(1));
        });

        test("calls the registered listener only once if registered multiple times to the same event", () => {
            const events = new Events();
            const listener = jest.fn();

            events.on("obsidian.my-event", listener);
            events.on("obsidian.my-event", listener);

            events.emit("my-event");

            expect(listener).toHaveBeenCalledTimes(1);
        });

        test("can remove a listener to an event", () => {
            const events = new Events();
            const listener = jest.fn();

            events.on("obsidian.my-event", listener);
            events.removeListener("obsidian.my-event", listener);
            events.emit("my-event");

            expect(listener).not.toHaveBeenCalled();
        });

        test("can emit an event without listeners", () => {
            const events = new Events();
            const listener = jest.fn();

            events.emit("my-event");

            expect(listener).not.toHaveBeenCalled();
        });

        test("can remove a listener to an unregistered event", () => {
            const events = new Events();
            const listener = jest.fn();

            events.on("obsidian.my-event", listener);
            events.removeListener("obsidian.my-unregistered-event", listener);
            events.emit("my-event");

            expect(listener).toHaveBeenCalledTimes(1);
        });

        test("can remove a unregistered listener to an event", () => {
            const events = new Events();
            const listener = jest.fn();
            const unregisteredListener = jest.fn();

            events.on("obsidian.my-event", listener);
            events.removeListener("obsidian.my-event", unregisteredListener);
            events.emit("my-event");

            expect(listener).toHaveBeenCalledTimes(1);
        });
    });
});

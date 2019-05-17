const Events = require("./events");

describe("Events.once", () => {

    test("calls a listener only once", () => {
        const events = new Events();
        const listener = jest.fn();

        events.once("my-event", listener);
        events.emit("my-event");
        events.emit("my-event");
        events.emit("my-event");

        expect(listener).toHaveBeenCalledTimes(1);
    });

    test("can register many times a listener once", () => {
        const events = new Events();
        const listener = jest.fn();

        events.once("my-event", listener);
        events.emit("my-event");
        events.once("my-event", listener);
        events.emit("my-event");

        expect(listener).toHaveBeenCalledTimes(2);
    });

    test("can register a listener that take one argument", () => {
        const events = new Events();
        const arg = "yes";
        const listener = jest.fn();

        events.once("my-event", listener);
        events.emit("my-event", arg);

        expect(listener).toHaveBeenLastCalledWith(arg);
    });

    test("can register a listener with many arguments", () => {
        const events = new Events();
        const arg1 = "yes";
        const arg2 = 15005;
        const arg3 = false;
        const listener = jest.fn();

        events.once("my-event", listener);
        events.emit("my-event", arg1, arg2, arg3);

        expect(listener).toHaveBeenLastCalledWith(arg1, arg2, arg3);
    });
});

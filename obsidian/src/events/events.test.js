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

});

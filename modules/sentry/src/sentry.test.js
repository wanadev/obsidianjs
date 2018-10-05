// const Raven = require("raven-js");

// jest.mock("../__mocks__/raven-js.js");


describe("Sentry forward log", () => {

    test("sentry capture unquotes errors", () => {
        throw new Error("test uncaught error");

        // expect(Raven.captureException).toHaveBeenCalledTimes(1);
    });
});

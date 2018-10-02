const Raven = require("raven-js");

// jest.mock("../index.js");
jest.mock("../__mocks__/raven-js.js");


describe("Sentry forward log", () => {

    test("send the error to the sentry server", () => {
        Raven.captureException("bla");

        expect(Raven.captureException).toHaveBeenCalledTimes(1);
    });
});

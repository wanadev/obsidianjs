jest.mock("../index.js");

const self = require("../index.js");
const Sentry = require("./sentry");

describe("Sentry forward log", () => {

    test("send the error to the sentry server", () => {
        const sentry = new Sentry();

        self.app.log.error("My test error !");
    });
})

const Raven = require("raven-js");
const Sentry = require("./sentry").default;

jest.mock("../index.js");
jest.mock("../__mocks__/raven-js.js");


describe("Sentry forward log", () => {
    test("sentry don't capture logs by default", () => {
        const sentryInstance = new Sentry("", { disable: true });
        sentryInstance.forwardLog("warn", "test", "logs", "warn");
        sentryInstance.forwardLog("info", "test", "logs", "info");
        sentryInstance.forwardLog("fatal", "test", "logs", "fatal");

        expect(sentryInstance.options.capturedLevels).toEqual([]);
        expect(Raven.captureException).toHaveBeenCalledTimes(0);
    });

    test("sentry capture correct levels of logs", () => {
        const sentryInstance = new Sentry("", { disable: true, capturedLevels: ["warn", "fatal"] });
        sentryInstance.forwardLog("warn", "test", "logs", "warn");
        sentryInstance.forwardLog("info", "test", "logs", "info");
        sentryInstance.forwardLog("fatal", "test", "logs", "fatal");

        expect(sentryInstance.options.capturedLevels).toEqual(["warn", "fatal"]);
        expect(Raven.captureException).toHaveBeenCalledTimes(2);
    });
});

describe("Sentry user UUID", () => {
    test("sentry create UUID", () => {
        const sentryInstance = new Sentry("", { disable: true });

        sentryInstance.getUserUUID();

        expect(sentryInstance.userUUID).toBeUndefined();
    });
});

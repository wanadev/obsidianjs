const Raven = require("raven-js");
const Sentry = require("./sentry").default;

jest.mock("../index.js");
jest.mock("../__mocks__/raven-js.js");


describe("Sentry forward log", () => {
    test("sentry don't capture logs by default", () => {
        const sentryInstance = new Sentry();
        sentryInstance.forwardLog("warn", "test", "logs", "warn");
        sentryInstance.forwardLog("info", "test", "logs", "info");
        sentryInstance.forwardLog("fatal", "test", "logs", "fatal");

        expect(sentryInstance.options.capturedLevels).toEqual(["fatal"]);
        expect(Raven.captureException).toHaveBeenCalledTimes(1);
    });

    test("sentry capture correct levels of logs", () => {
        const sentryInstance = new Sentry({ capturedLevels: ["warn", "fatal"] });
        sentryInstance.forwardLog("warn", "test", "logs", "warn");
        sentryInstance.forwardLog("info", "test", "logs", "info");
        sentryInstance.forwardLog("fatal", "test", "logs", "fatal");

        expect(sentryInstance.options.capturedLevels).toEqual(["warn", "fatal"]);
        expect(Raven.captureException).toHaveBeenCalledTimes(3);
    });
});

describe("Sentry user infos", () => {
    test("Init sentry user infos", () => {
        const sentryInstance = new Sentry({
            capturedLevels: ["warn"],
            userInfos: {
                cg: "GTX 1080",
            },
        });

        expect(sentryInstance.options).toEqual({
            capturedLevels: ["warn"],
            userInfos: {
                userUUID: Sentry.getUserUUID(),
                cg: "GTX 1080",
            },
        });
        expect(sentryInstance.getUserInfos()).toEqual({
            userUUID: Sentry.getUserUUID(),
            cg: "GTX 1080",
        });
    });

    test("Change sentry user infos", () => {
        const sentryInstance = new Sentry({
            capturedLevels: ["warn"],
            userInfos: {
                cg: "GTX 1080",
            },
        });

        sentryInstance.setUserInfos({
            os: "Windows",
            cg: "GTX 1070",
        });

        expect(sentryInstance.getUserInfos()).not.toEqual({
            userInfos: {
                cg: "GTX 1080",
                userUUID: Sentry.getUserUUID(),
            },
        });
        expect(sentryInstance.options).toEqual({
            capturedLevels: ["warn"],
            userInfos: {
                os: "Windows",
                cg: "GTX 1070",
                userUUID: Sentry.getUserUUID(),
            },
        });
        expect(sentryInstance.getUserInfos()).toEqual({
            os: "Windows",
            cg: "GTX 1070",
            userUUID: Sentry.getUserUUID(),
        });
    });

    test("Add user infos", () => {
        const sentryInstance = new Sentry({
            capturedLevels: ["warn"],
            userInfos: {
                cg: "GTX 1080",
            },
        });

        sentryInstance.addUserInfos({
            os: "Windows",
        });

        expect(sentryInstance.getUserInfos()).not.toEqual({
            userInfos: {
                cg: "GTX 1080",
                userUUID: Sentry.getUserUUID(),
            },
        });
        expect(sentryInstance.getUserInfos()).toEqual({
            os: "Windows",
            cg: "GTX 1080",
            userUUID: Sentry.getUserUUID(),
        });
    });
});

describe("Sentry user infos", () => {
    test("Init sentry default levels of logs", () => {
        const sentryInstance = new Sentry();
        expect(sentryInstance.getLogLevels()).toEqual(["fatal"]);
    });

    test("Init sentry levels of logs", () => {
        const sentryInstance = new Sentry({
            capturedLevels: ["warn"],
        });

        expect(sentryInstance.getLogLevels()).toEqual(["warn"]);
    });

    test("Set sentry levels of logs", () => {
        const sentryInstance = new Sentry({
            capturedLevels: ["warn"],
        });

        sentryInstance.setLogLevels(["warn", "errors"]);

        expect(sentryInstance.getLogLevels()).not.toEqual(["warn"]);
        expect(sentryInstance.getLogLevels()).toEqual(["warn", "errors"]);
    });

    test("Add a level of log", () => {
        const sentryInstance = new Sentry({
            capturedLevels: ["warn"],
        });

        sentryInstance.addLogLevels(["errors"]);

        expect(sentryInstance.getLogLevels()).not.toEqual(["warn"]);
        expect(sentryInstance.getLogLevels()).toEqual(["warn", "errors"]);
    });
});

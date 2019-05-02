jest.mock("../index.js");
jest.mock("../__mocks__/raven-js.js");

const Raven = require("raven-js");
const Sentry = require("./sentry").default;


describe("Sentry.constructor", () => {
    test("Constructor correctly initialize member variables", () => {
        const sentryInstance = new Sentry();

        expect(Raven.config).toHaveBeenCalled();
        expect(sentryInstance.userUUID).toEqual(sentryInstance.getUserUUID());
        expect(sentryInstance.capturedLevels).toEqual(["fatal"]);
    });
});

describe("Sentry.getUserInfos", () => {
    test("Sentry.getUserInfos return Sentry.userInfos", () => {
        const sentryInstance = new Sentry();
        sentryInstance.userInfos = {
            version: "0.1.0",
        };

        expect(sentryInstance.userInfos).toEqual({ version: "0.1.0" });
        expect(sentryInstance.getUserInfos()).toEqual(sentryInstance.userInfos);
    });
});

describe("Sentry.setUserInfos", () => {
    test("Setting userInfos change the Sentry.userInfos and add userUUID to it", () => {
        const sentryInstance = new Sentry();
        sentryInstance.userInfos = {
            cg: "GTX 1080",
        };

        sentryInstance.setUserInfos({
            version: "0.1.0",
        });

        expect(sentryInstance.userInfos).not.toEqual({
            cg: "GTX 1080",
        });
        expect(sentryInstance.userInfos).toEqual({
            version: "0.1.0",
            userUUID: sentryInstance.getUserUUID(),
        });
    });
});

describe("Sentry.addUserInfos", () => {
    test("Adding properties to Sentry.userInfos doesn't remove original properties and add userUUID", () => {
        const sentryInstance = new Sentry();

        sentryInstance.setUserInfos({
            version: "0.1.0",
        });

        sentryInstance.addUserInfos({
            os: "Windows",
        });

        expect(sentryInstance.userInfos).toEqual({
            os: "Windows",
            version: "0.1.0",
            userUUID: sentryInstance.getUserUUID(),
        });
    });
});

describe("Sentry.getLogsLevels", () => {
    test("Sentry.getLogsLevels return sentry.capturedLevels", () => {
        const sentryInstance = new Sentry();
        sentryInstance.capturedLevels = ["warn", "info"];
        expect(sentryInstance.capturedLevels).toEqual(["warn", "info"]);
        expect(sentryInstance.capturedLevels).toEqual(sentryInstance.getLogLevels());
    });
});

describe("Sentry.setLogsLevels", () => {
    test("Setting levels of logs, override the preceding levels of logs", () => {
        const sentryInstance = new Sentry();
        expect(sentryInstance.capturedLevels).toEqual(["fatal"]);

        sentryInstance.setLogLevels(["warn", "info"]);
        expect(sentryInstance.capturedLevels).toEqual(["warn", "info"]);
    });

    test("Setting levels of logs using the same level multiple times add it once to Sentry.capturedLevels", () => {
        const sentryInstance = new Sentry();
        expect(sentryInstance.capturedLevels).toEqual(["fatal"]);

        sentryInstance.setLogLevels(["warn", "warn"]);
        expect(sentryInstance.capturedLevels).toEqual(["warn"]);
    });
});

describe("Sentry.addLogsLevels", () => {
    test("Adding levels of logs don't override basic level of log", () => {
        const sentryInstance = new Sentry();
        expect(sentryInstance.capturedLevels).toEqual(["fatal"]);

        sentryInstance.addLogLevels(["warn", "info"]);
        expect(sentryInstance.capturedLevels).toEqual(["fatal", "warn", "info"]);
    });

    test("Adding again the same level of log don't change the array", () => {
        const sentryInstance = new Sentry();
        expect(sentryInstance.capturedLevels).toEqual(["fatal"]);

        sentryInstance.addLogLevels(["fatal", "fatal"]);
        expect(sentryInstance.capturedLevels).toEqual(["fatal"]);
    });
});

describe("Sentry.forwardLog", () => {
    test("Sentry captures fatal only by default", () => {
        const sentryInstance = new Sentry();
        expect(sentryInstance.capturedLevels).toEqual(["fatal"]);
    });

    test("Sentry capture correct levels of logs", () => {
        const sentryInstance = new Sentry();
        sentryInstance.capturedLevels = ["warn", "info"];
        sentryInstance.forwardLog("warn", "test", "logs", "warn");
        sentryInstance.forwardLog("info", "test", "logs", "info");
        sentryInstance.forwardLog("fatal", "test", "logs", "fatal");

        expect(sentryInstance.capturedLevels).toEqual(["warn", "info"]);
        expect(Raven.captureException).toHaveBeenCalledTimes(2);
    });
});

describe("Sentry.getUserUUID", () => {
    test("When there is no user uuid in the local storage, Sentry.getUserUUID generate one and put it in userUUID", () => {
        // To be sure there is no userUUID stored
        try {
            window.localStorage.sentryUUID = undefined;
        } catch (e) {
            console.warn("Local sotrage disabled");
            return;
        }

        const sentryInstance = new Sentry();

        expect(sentryInstance.userUUID).not.toBeUndefined();
        expect(sentryInstance.userUUID).toEqual(sentryInstance.getUserUUID());
    });

    test("If there is a Sentry.userUUID in the local storage, Sentry.getUserUUID put it in userUUID", () => {
        const uuid = "6cdc6e4d-fe23-48c0-9a1d-40f0960dc284";
        try {
            window.localStorage.sentryUUID = uuid;
        } catch (e) {
            console.warn("Local sotrage disabled");
            return;
        }

        const sentryInstance = new Sentry();
        expect(sentryInstance.userUUID).not.toBeUndefined();
        expect(sentryInstance.userUUID).toEqual(sentryInstance.getUserUUID());
        expect(sentryInstance.userUUID).toEqual(uuid);
    });

    test("If local storage is not supported, Sentry.getUserUUID generate one", () => {
        // We need a  way to disable local storage in order to test the localstorage fallback code
        const sentryInstance = new Sentry();

        expect(sentryInstance.userUUID).not.toBeUndefined();
        expect(sentryInstance.userUUID).toEqual(sentryInstance.getUserUUID());
    });
});

jest.mock("../index.js");

const Sentry = require("@sentry/browser");
const SentryController = require("./sentry").default;


describe("SentryController.constructor", () => {
    test("Constructor correctly initialize member variables", () => {
        const sentryInstance = new SentryController();

        expect(sentryInstance.userUUID).toEqual(sentryInstance.getUserUUID());
        expect(sentryInstance.capturedLevels).toEqual(["fatal"]);
    });
    test("Constructor correctly initialize sentry", () => {
        new SentryController();  // eslint-disable-line no-new

        expect(Sentry.init).toHaveBeenCalled();
    });
});

describe("SentryController.getUserInfos", () => {
    test("SentryController.getUserInfos return SentryController.userInfos", () => {
        const sentryInstance = new SentryController();
        sentryInstance.userInfos = {
            version: "0.1.0",
        };

        expect(sentryInstance.userInfos).toEqual({ version: "0.1.0" });
        expect(sentryInstance.getUserInfos()).toEqual(sentryInstance.userInfos);
    });
});

describe("SentryController.setUserInfos", () => {
    test("Setting userInfos change the SentryController.userInfos and add userUUID to it", () => {
        const sentryInstance = new SentryController();
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

describe("SentryController.addUserInfos", () => {
    test("Adding properties to SentryController.userInfos doesn't remove original properties and add userUUID", () => {
        const sentryInstance = new SentryController();

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

describe("SentryController.getLogsLevels", () => {
    test("SentryController.getLogsLevels return sentryController.capturedLevels", () => {
        const sentryInstance = new SentryController();
        sentryInstance.capturedLevels = ["warn", "info"];
        expect(sentryInstance.capturedLevels).toEqual(["warn", "info"]);
        expect(sentryInstance.capturedLevels).toEqual(sentryInstance.getLogLevels());
    });
});

describe("SentryController.setLogsLevels", () => {
    test("Setting levels of logs, override the preceding levels of logs", () => {
        const sentryInstance = new SentryController();
        expect(sentryInstance.capturedLevels).toEqual(["fatal"]);

        sentryInstance.setLogLevels(["warn", "info"]);
        expect(sentryInstance.capturedLevels).toEqual(["warn", "info"]);
    });

    test("Setting levels of logs using the same level multiple times add it once to SentryController.capturedLevels", () => {
        const sentryInstance = new SentryController();
        expect(sentryInstance.capturedLevels).toEqual(["fatal"]);

        sentryInstance.setLogLevels(["warn", "warn"]);
        expect(sentryInstance.capturedLevels).toEqual(["warn"]);
    });
});

describe("SentryController.addLogsLevels", () => {
    test("Adding levels of logs don't override basic level of log", () => {
        const sentryInstance = new SentryController();
        expect(sentryInstance.capturedLevels).toEqual(["fatal"]);

        sentryInstance.addLogLevels(["warn", "info"]);
        expect(sentryInstance.capturedLevels).toEqual(["fatal", "warn", "info"]);
    });

    test("Adding again the same level of log don't change the array", () => {
        const sentryInstance = new SentryController();
        expect(sentryInstance.capturedLevels).toEqual(["fatal"]);

        sentryInstance.addLogLevels(["fatal", "fatal"]);
        expect(sentryInstance.capturedLevels).toEqual(["fatal"]);
    });
});

describe("SentryController.forwardLog", () => {
    test("SentryController captures fatal only by default", () => {
        const sentryInstance = new SentryController();
        expect(sentryInstance.capturedLevels).toEqual(["fatal"]);
    });

    test("SentryController capture correct levels of logs", () => {
        const sentryInstance = new SentryController();
        sentryInstance.capturedLevels = ["warn", "info"];
        sentryInstance.forwardLog("warn", "test", "logs", "warn");
        sentryInstance.forwardLog("info", "test", "logs", "info");
        sentryInstance.forwardLog("fatal", "test", "logs", "fatal");

        expect(sentryInstance.capturedLevels).toEqual(["warn", "info"]);
        expect(Sentry.captureException).toHaveBeenCalledTimes(2);
    });
});

describe("SentryController.getUserUUID", () => {
    test("When there is no user uuid in the local storage, SentryController.getUserUUID generate one and put it in userUUID", () => {
        Object.defineProperty(window, "localStorage", {
            value: {
            },
            writable: true,
        });

        const sentryInstance = new SentryController();

        expect(sentryInstance.userUUID).not.toBeUndefined();
        expect(sentryInstance.userUUID).toEqual(sentryInstance.getUserUUID());
    });

    test("If there is a SentryController.userUUID in the local storage, SentryController.getUserUUID put it in userUUID", () => {
        const uuid = "6cdc6e4d-fe23-48c0-9a1d-40f0960dc284";
        Object.defineProperty(window, "localStorage", {
            value: {},
            writable: true,
        });
        window.localStorage.sentryUUID = uuid;

        const sentryInstance = new SentryController();
        expect(sentryInstance.userUUID).not.toBeUndefined();
        expect(sentryInstance.userUUID).toEqual(sentryInstance.getUserUUID());
        expect(sentryInstance.userUUID).toEqual(uuid);
    });

    test("If local storage is not supported, SentryController.getUserUUID generate one", () => {
        // We need a  way to disable local storage in order to test the localstorage fallback code
        Object.defineProperty(window, "localStorage", {
            value: null,
            writable: true,
        });
        const sentryInstance = new SentryController();

        expect(sentryInstance.userUUID).not.toBeUndefined();
        expect(sentryInstance.userUUID).toEqual(sentryInstance.getUserUUID());
    });
});

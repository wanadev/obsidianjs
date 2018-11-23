const Raven = require("raven-js");
const uuidv4 = require("uuid/v4");

const self = require("../index.js");


export default class Sentry {

    /**
     * Initialize the sentry module
     * @param {Object} options
     * @param {string[]} options.capturedLevels levels of logs captured by sentry
     * @param {Object} options.userInfos additionnals info about the user app version,
     * branch, graphics card, ...
     * @param {string} options.userInfo.appVersion
     */
    constructor(options = {
        capturedLevels: ["fatal"],
        userInfos: {
            appVersion: null,
        },
    }) {
        this.initializeOptions(options);

        if (!self.app.config.get("@obsidian.debug")) {
            this.setupSentry();
        }
    }

    /**
     * Initialize the modules options
     * Set the user UUID
     * @param {*} options
     */
    initializeOptions(options) {
        this.options = options;
        if (!this.options.capturedLevels
            || this.options.capturedLevels.length === 0) {
            this.options.capturedLevels = ["fatal"];
        }
        if (!this.options.userInfos) {
            this.options.userInfos = {};
        }
        this.options.userInfos.userUUID = Sentry.getUserUUID();
    }

    /**
     * Connect to the sentry server
     */
    setupSentry() {
        this.ravenClient = Raven
            .config(self.app.config.get("dsnKey"),
                {
                    autoBreadcrumbs: true,
                    logger: "obsidianjs/sentry",
                })
            .install();

        this.setUserInfos(this.options.userInfos);

        self.app.events.on("log", (level, namespace, args) => {
            this.forwardLog(level, namespace, args);
        });
    }


    /**
    * Get the info that would be send to the sentry server when logging something
    */
    getUserInfos() {
        return this.options.userInfos;
    }

    /**
    * Set the info send to the sentry server when logging something
    * @param {*} newUserInfos
    */
    setUserInfos(newUserInfos) {
        this.options.userInfos = newUserInfos;
        this.options.userInfos.userUUID = Sentry.getUserUUID();

        this.setSentryUserContext();
    }


    /**
     * Add properties to the userInfos
     * @param {*} additionalUserInfos
     */
    addUserInfos(additionalUserInfos) {
        Object.assign(this.options.userInfos, additionalUserInfos);

        this.setSentryUserContext();
    }


    /**
     * Get the levels of logs sent to the sentry server
     */
    getLogLevels() {
        return this.options.capturedLevels;
    }

    /**
     * Change the levels of logs that are sent to the sentry server
     * @param {string[]} logLevels
     */
    setLogLevels(logLevels) {
        this.options.capturedLevels = logLevels;
    }

    /**
     * Add levels of logs that are sent to the sentry server
     * @param {string[]} logLevels
     */
    addLogLevels(logLevels) {
        logLevels.forEach((level) => {
            if (!this.options.capturedLevels.includes(level)) {
                this.options.capturedLevels.push(level);
            }
        });
    }

    /**
     * Forward the log of obsidian core the a sentry server
     * @param {string} level
     * @param {string} namespace
     * @param {*[]} args
     */
    forwardLog(level, namespace, args) {
        if (this.options.capturedLevels.includes(level)) {
            Raven.captureException(new Error(`[${self.app.name}][${namespace}]`.concat(...args)),
                {
                    level,
                    tags: [namespace],
                });
        }
    }

    /**
     * set additional infos sent through errors to the sentry server
     */
    setSentryUserContext() {
        if (!self.app.config.get("@obsidian.debug")) {
            Raven.setUserContext(this.options.userInfos);
        }
    }

    /**
     * Access the user UUID on the localStorage or create one
     */
    static getUserUUID() {
        try {
            if (window.localStorage.sentryUUID) {
                return window.localStorage.sentryUUID;
            }

            window.localStorage.sentryUUID = uuidv4();
            return window.localStorage.sentryUUID;
        } catch (e) {
            self.app.log.error(e);
            return Error("Cannot access the UUID of this user, there was an error while trying to access local storage !");
        }
    }

}

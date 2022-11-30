const Sentry = require("@sentry/browser");
const uuidv4 = require("uuid/v4");

const self = require("../index.js");


/**
 * The sentry module controller.
 *
 * .. WARNING::
 *
 *    You do not need to use this API most of time: once this module is loaded
 *    with proper configuration, it will just work and you do not need to
 *    access it.
 */
class SentryController {

    /**
     * @constructor
     */
    constructor() {
        this.getUserUUID();
        this.setLogLevels(self.app.config.get("capturedLevels"));

        if (!self.app.config.get("@obsidian.debug")) {
            Sentry.init({
                dsn: self.app.config.get("dsnKey"),
            });
            this.setUserInfos(self.app.config.get("userInfos"));

            self.app.events.on("@obsidian.log", (level, namespace, args) => {
                this.forwardLog(level, namespace, args);
            });
        }
    }

    /**
     * Get the :data:`userInfos` object.
     *
     * @returns {Object} The userInfo object.
     */
    getUserInfos() {
        return this.userInfos;
    }

    /**
     * Set the :data:`userInfos` object.
     *
     * @param {Object} newUserInfos
     */
    setUserInfos(newUserInfos) {
        this.userInfos = newUserInfos;
        this.userInfos.userUUID = this.userUUID;

        this.setSentryUserContext();
    }

    /**
     * Add properties to the :data:`userInfos` object.
     *
     * @param {Object} additionalUserInfos
     */
    addUserInfos(additionalUserInfos) {
        Object.assign(this.userInfos, additionalUserInfos);

        this.setSentryUserContext();
    }


    /**
     * Get the levels of logs sent to the Sentry server (see :data:`capturedLevels`).
     *
     * @returns {string[]}
     */
    getLogLevels() {
        return this.capturedLevels;
    }

    /**
     * Change the levels of logs that are sent to the Sentry server (see :data:`capturedLevels`).
     *
     * @param {string[]} logLevels
     */
    setLogLevels(logLevels) {
        this.capturedLevels = [];
        this.addLogLevels(logLevels);
    }

    /**
     * Add levels of logs that are sent to the sentry server (see :data:`capturedLevels`).
     *
     * @param {string[]} logLevels
     */
    addLogLevels(logLevels) {
        logLevels.forEach((level) => {
            if (!this.capturedLevels.includes(level)) {
                this.capturedLevels.push(level);
            }
        });
    }

    /**
     * Forward the log of obsidian core the a sentry server
     *
     * @private
     * @param {string} level
     * @param {string} namespace
     * @param {array} args
     */
    forwardLog(level, namespace, args) {
        if (this.capturedLevels.includes(level)) {
            Sentry.withScope((scope) => {
                scope.setLevel(level);
                scope.setTag("namespace", namespace);
                Sentry.captureException(new Error(`[${self.app.name}][${namespace}]`.concat(...args)));
            });
        }
    }

    /**
     * Update the sentry user context
     *
     * @private
     */
    setSentryUserContext() {
        Sentry.configureScope((scope) => {
            scope.setUser(this.userInfos);
        });
    }

    /**
     * Get the user UUID from local storage otherwise we generate one
     *
     * @returns {string} The user UUID.
     */
    getUserUUID() {
        if (!this.userUUID) {
            try {
                if (window.localStorage.sentryUUID) {
                    this.userUUID = window.localStorage.sentryUUID;
                } else {
                    this.userUUID = uuidv4();
                    window.localStorage.sentryUUID = this.userUUID;
                }
            } catch (e) {
                this.userUUID = uuidv4();
            }
        }

        return this.userUUID;
    }

}

export default SentryController;

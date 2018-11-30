const Raven = require("raven-js");
const uuidv4 = require("uuid/v4");

const self = require("../index.js");


class Sentry {

    /**
     * Initialize the sentry module
     */
    constructor() {
        this.userUUID = this.getUserUUID();
        this.setLogLevels(self.app.config.get("capturedLevels"));

        if (!self.app.config.get("@obsidian.debug")) {
            this.ravenClient = Raven
                .config(self.app.config.get("dsnKey"),
                    {
                        autoBreadcrumbs: true,
                        logger: "obsidianjs/sentry",
                    });

            if (this.ravenClient) {
                this.ravenClient.install();
                this.setUserInfos(self.app.config.get("userInfos"));

                self.app.events.on("log", (level, namespace, args) => {
                    this.forwardLog(level, namespace, args);
                });
            }
        }
    }

    /**
    * Get the info that would be send to the sentry server when logging something
    * @returns {*} return options.userInfos
    */
    getUserInfos() {
        return this.userInfos;
    }

    /**
    * Set the info send to the sentry server when logging something
    * @param {*} newUserInfos
    */
    setUserInfos(newUserInfos) {
        this.userInfos = newUserInfos;
        this.userInfos.userUUID = this.userUUID;

        this.setSentryUserContext();
    }


    /**
     * Add properties to the userInfos
     * @param {*} additionalUserInfos
     */
    addUserInfos(additionalUserInfos) {
        Object.assign(this.userInfos, additionalUserInfos);

        this.setSentryUserContext();
    }


    /**
     * Get the levels of logs sent to the sentry server
     * @returns {string[]} return options.capturedLevels
     */
    getLogLevels() {
        return this.capturedLevels;
    }

    /**
     * Change the levels of logs that are sent to the sentry server
     * @param {string[]} logLevels
     */
    setLogLevels(logLevels) {
        this.capturedLevels = [];
        this.addLogLevels(logLevels);
    }

    /**
     * Add levels of logs that are sent to the sentry server
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
     * @param {string} level
     * @param {string} namespace
     * @param {*[]} args
     */
    forwardLog(level, namespace, args) {
        if (this.capturedLevels.includes(level)) {
            Raven.captureException(new Error(`[${self.app.name}][${namespace}]`.concat(...args)),
                {
                    level,
                    tags: [namespace],
                });
        }
    }

    /**
     * Set additional infos sent through errors to the sentry server
     */
    setSentryUserContext() {
        Raven.setUserContext(this.userInfos);
    }

    /**
     * Access the user UUID on the localStorage or create one
     * @returns {string} A string containing the past user UUID or a newly generated one
     */
    getUserUUID() {
        let uuid = this.userUUID;

        if (!this.userUUID) {
            try {
                if (window.localStorage.sentryUUID) {
                    uuid = window.localStorage.sentryUUID;
                } else {
                    uuid = uuidv4();
                    window.localStorage.sentryUUID = uuid;
                }
            } catch (e) {
                uuid = uuidv4();
            }
        }

        return uuid;
    }

}

export default Sentry;

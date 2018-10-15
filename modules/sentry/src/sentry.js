const Raven = require("raven-js");
const uuidv4 = require("uuid/v4");

const self = require("../index.js");


export default class Sentry {

    /**
     * Initialize the sentry module
     * @param {string} sentryKey DSN of the sentry project
     * @param {Object} options
     * @param {boolean} options.disable disable sentry
     * @param {string[]} options.capturedLevels levels of logs captured by sentry
     * @param {Object} options.userInfo additionnals info about the user app version,
     * branch, graphics card, ...
     * @param {string} options.userInfo.appVersion
     */
    constructor(sentryKey, options = {
        disable: false,
        capturedLevels: [],
        userInfo: {
            appVersion: null,
        },
    }) {
        this.options = options;

        if (!this.options.capturedLevels) {
            this.options.capturedLevels = [];
        }

        if (!this.options.disable) {
            this.ravenClient = Raven
                .config(sentryKey,
                    {
                        autoBreadcrumbs: true,
                        logger: "obsidianjs/sentry",
                    })
                .install();
            this.getUserUUID();
            this.options.userInfo.userUUID = this.userUUID;

            // set additional infos sent through errors to the sentry server
            Raven.setUserContext(this.options.userInfo);

            self.app.events.on("log", (level, namespace, args) => this.forwardLog(level, namespace, args));
        }
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
     * Access the user UUID on the localStorage or create one
     */
    getUserUUID() {
        try {
            if (window.localStorage.sentryUUID) {
                this.userUUID = window.localStorage.sentryUUID;
            }

            window.localStorage.sentryUUID = uuidv4();
            this.userUUID = window.localStorage.sentryUUID;
        } catch (e) {
            self.app.log.error(e);
        }
    }

}

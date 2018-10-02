const Raven = require("raven-js");

const self = require("../index.js");


export default class Sentry {

    constructor(sentryKey) {
        this.ravenClient = Raven
            .config(sentryKey,
                {
                    autoBreadcrumbs: true,
                })
            .install();

        self.app.events.on("log", (level, namespace, args) => this.forwardLog(level, namespace, args));
    }

    static forwardLog(level, namespace, args) {
        if (level === "error"
            || level === "fatal") {
            Raven.captureException(new Error(`[${self.app.name}][${namespace}]`.concat(...args)),
                {
                    level,
                });
        }
    }

}

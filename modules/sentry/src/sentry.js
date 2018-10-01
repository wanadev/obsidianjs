import raven from "raven-js";

const self = require("../index.js");


export default class Sentry {

    constructor(sentryKey) {
        this.ravenClient = raven
            .config(sentryKey,
                {
                    autoBreadcrumbs: true,
                })
            .install();
    }

    forwardLog() {
        self.app.events.on("log", (level, namespace, args) => {
            if (level === "error"
                || level === "fatal") {
                this.ravenClient.captureException(new Error(`[${self.app.name}][${namespace}]`.concat(...args)),
                    {
                        level,
                    });
            }
        });
    }

}

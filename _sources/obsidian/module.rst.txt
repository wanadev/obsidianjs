Obsidian Module Definition
==========================

TODO

::

    module.exports = {

        name: "my-module",
        requires: ["my-other-module"],

        config: {},  // Module's default config

        load(app) {
            return {};  // return the Controller / API of the module
        },

        unload(app) {
            // Clean stuff here
        }

    };

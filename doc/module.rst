Module
======

TODO

::

    module.exports = {

        name: "my-module",
        requires: ["my-other-module"],

        load(app) {
            return {};  // return the Controller/API ok the module
        },

        unload(app) {
            // Clean stuff here
        }

    };

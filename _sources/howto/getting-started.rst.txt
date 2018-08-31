Getting Started
===============

::

    const obsidian = require("@obsidian/obsidian");
    const hello = require("my-hello-module");

    const app = obsidian("my-application");
    app.use(hello);
    app.start();

TODO

Getting Started
===============

::

    const obsidian = require("@obsidian/obsidian");
    const hello = require("my-hello-module");

    const app = obsidian("my-application");
    app.load(hello);
    app.start();

TODO

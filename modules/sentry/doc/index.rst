sentry
=============

 This module

 * exports data from the sentry_ module as an `Obsidian Project File`_,
 * and imports data from an `Obsidian Project File`_ to the sentry_ module.


Using This Module
-----------------

First add the module to your project::

    npm install --save @obsidianjs/sentry

Then use it in your application (in your main ``index.js``)::

   const obsidian = require("@obsidianjs/obsidian");
   const sentry = require("@obsidianjs/sentry");

   const app = obsidian("my-application");
   app.use(sentry);
   app.start();

Finally require it in modules that need it::

   {
       name: "my-module",
       requires: ["sentry"],

       load(app) {
           const {sentry} = app.modules;
           // ...
       },

       // ...

   }


Config
---------

* ``apiKey`` The DNS key brought by sentry on project base
* ``logLevels`` The levels of logs the application will forward to the sentry server
* ``options.userInfos`` An object with what you inside it. This object will be added to informations sent to the sentry server.


Module API
----------

.. js:autoclass:: modules/sentry/src/sentry.Sentry
   :members:
   :short-name:




.. _Obsidian Project File: https://github.com/wanadev/obsidian-file
.. _sentry: ../sentry/index.html

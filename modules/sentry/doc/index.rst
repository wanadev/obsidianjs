sentry
======

The **sentry** module purpose is to forward log to sentry server. You can
choose which level of logs are forwarded to sentry, and add info to every logs
using the config.

Each user is uniquely identified with a UUID to help track issues related to
each other.


Using This Module
-----------------

First add the module to your project::

    npm install --save @obsidianjs/sentry

Then use it in your application (in your main ``index.js``)::

   const obsidian = require("@obsidianjs/obsidian");
   const sentry = require("@obsidianjs/sentry");

   const app = obsidian("my-application");
   app.use(sentry, {
       config: {
           dsnKey: "https://<key>@<server>/<project>",
           capturedLevels: [
               "fatal",
               "error",
               "warning",
           ],
           // ...
       },
   });
   app.start();


Config
------

.. data:: dnsKey

   The DSN Key of the project on Sentry

   E.g.::

      "https://5d41402abc4b2a76b9719d911017c592@sentry.io/myproject"

.. data:: capturedLevels

   List of log level that will be sent to the Sentry server.

   Available levels:

   * ``"error"``
   * ``"warn"``
   * ``"info"``

   E.g.::

       ["error", "warn"]

   .. NOTE::

      Uncaught error are not considered as a "log level" and are always
      forwared to the Sentry server.

.. data:: userInfos

   An object with any additional information you want. It will be added to each
   log sent to the sentry server.


Module API
----------

.. js:autoclass:: modules/sentry/src/sentry.Sentry
   :members:
   :short-name:

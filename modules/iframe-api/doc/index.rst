iframe-api
==========

This modules integrates the obsidian-api_ library to the ObsidianJS
framework.

**iframe-api** allows to integrate an ObsidianJS application in a web page
through ``<iframe>``. It provides an integration script and an API that allows
the integration page and the application to communicate via remote function
calls and events. See the obsidian-api_ documentation for more information.


Using This Module
-----------------

First add the module to your project::

    npm install --save @obsidianjs/iframe-api

Then use it in your application (in your main ``index.js``):

.. code-block:: javascript

   const obsidian = require("@obsidian/obsidian");
   const iframeApi = require("@obsidianjs/iframe-api");

   const app = obsidian("my-application");
   app.use(iframeApi);
   app.start();

Finally require it in modules that need it:

.. code-block:: javascript

   {
       name: "my-module",
       requires: ["iframe-api"],

       load(app) {
           const {iframeApi} = app.modules;
           // ...
       },

       // ...

   }


Module API
----------

Here are documented the methods from ``obsidian-api`` that can be used from the
``iframe-api`` module. For more information and examples using those methods,
see the obsidian-api_ documentation.

.. class:: IframeApi

   Iframe API

   .. method:: addApiMethod(name, callback)

      Add a new method to the API. This method will be accessible to the
      integration page (outside of the application ``<iframe>``).

      :param string name: The method name.
      :param function callback: The callback function that will be called when
                                the integration page calls the method.

   .. method:: sendEvent(eventName, ...args)

      Send an event to the integration page (outside of the application
      ``<iframe>``).

      :param string eventName: The name of the event.
      :param * ...args: Arguments that will be passed to the callbacks that are
                        registered to the event.

      .. WARNING::

         The arguments that are passed along the events must be serializable
         (no functions, classes, HTML elements,...).

.. function:: IframeApi.$class.$getConfig()

   This static method allows to access the configuration given by the
   integration page. This will later be integrated with the build-in ``config``
   module.

   :returns Object: The configuration from the integration page.


.. _obsidian-api: https://wanadev.github.io/obsidian-api/

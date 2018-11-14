Use Obsidian Configuration
==========================

The Obsidian framework provides a centralized configuration. You can set this
configuration from various place in your application and access it from
everywhere.


Configuration Topology
----------------------

Obsidian configuration is splitted in 3 categories:

* ``obsidian``: this is the framework configuration itself,
* ``app``: this is your application global configuration,
* ``modules``: module-specific configuration.

When you export the obsidian configuration, you will obtain a object that
contains those 3 categories:

.. code-block:: json

   {
       "obsidian": {},
       "app": {},
       "modules": {
           "module1": {},
           "module2": {}
       }
   }


Setting Application Base Configuration
--------------------------------------

You can set the base configuration of the application by passing it to the
start method::

   const obsidian = require("@obsidian/obsidian");

   const app = obsidian("my-application");
   // ... load modules ...
   app.start({
       obsidian: {
           debug: true,
       },
       app: {
          lang: "en_US",
       },
   });


Defining Module's Default Configuration
---------------------------------------

When you declare an Obsidian module, you can define its default configuration::

   module.exports = {

       name: "my-module",
       requires: [],

       config: {},  // Module's default config

       load(app) {},
       unload(app) {}

   };


Overriding Module's Configuration
---------------------------------

It is possible to override a module's configuration when you declare it in your
application::

   const obsidian = require("@obsidian/obsidian");
   const hello = require("my-hello-module");

   const app = obsidian("my-application");

   app.use(hello, {
       config: {         // <- module specific configuration
           foo: "bar",
       }
   });

   app.start();


Accessing Configuration
-----------------------

You can access the configuration from everywhere in you application via
``app.config``.

For example, to access the ``debug`` key in the ``obsidian`` part of the
configuration, you can use the following code::

   app.config.get("@obsidian.debug");

The parameter we gave to the ``get()`` method is the path of the configuration.
The path can be absolute (when starting with ``@``) or relative.


Absolute Paths
~~~~~~~~~~~~~~

Absolute paths always starts with ``@`` followed with the category of
configuration or a module name:

* ``@obsidian.`` to access the framework configuration,
* ``@app.`` to access the application global configuration,
* ``@myModule.`` to access to the configuration of the ``my-module`` module.

E.g::

    app.config.get("@obsidian.debug");
    app.config.get("@app.lang");
    app.config.get("@dataStore.foo");


Relative Paths
~~~~~~~~~~~~~~

Relative path can be used inside modules to access to the module's own
configuration. For example, if you are in the ``my-module`` module, you can
access any configuration of the module like this::

    app.config.get("foo");

This is equivalent to::

    app.config.get("@myModule.foo");


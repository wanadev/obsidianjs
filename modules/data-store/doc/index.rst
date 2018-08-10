data-store
==========

The **data-store** module allows you to manage entities which are serializable classes.
It can store them and generate a final JSON file which contains all serializable
information from the stored entities. You can also provide a JSON to the data-store
and it will unserialize it and create the entities corresponding.

Using This Module
-----------------

First add the module to your project::

    npm install --save @obsidianjs/data-store

Then use it in your application (in your main ``index.js``)::

   const obsidian = require("@obsidianjs/obsidian");
   const httpRequest = require("@obsidianjs/data-store");

   const app = obsidian("my-application");
   app.use(dataStore);
   app.start();

Finally require it in modules that need it::

   {
       name: "my-module",
       requires: ["data-store"],

       load(app) {
           const {dataStore} = app.modules;
           // ...
       },

       // ...

   }


DataStore API
-------------

.. js:autoclass:: modules/data-store/src/data-store.DataStore
   :short-name:
   :members:

Entity Class API
----------------

.. js:autoclass:: modules/data-store/src/entity.Entity
   :short-name:
   :members:

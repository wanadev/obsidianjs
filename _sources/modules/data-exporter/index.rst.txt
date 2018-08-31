data-exporter
=============

 This module

 * exports data from the data-store_ module as an `Obsidian Project File`_,
 * and imports data from an `Obsidian Project File`_ to the data-store_ module.


Using This Module
-----------------

First add the module to your project::

    npm install --save @obsidianjs/data-exporter

Then use it in your application (in your main ``index.js``)::

   const obsidian = require("@obsidianjs/obsidian");
   const dataExporter = require("@obsidianjs/data-exporter");

   const app = obsidian("my-application");
   app.use(dataExporter);
   app.start();

Finally require it in modules that need it::

   {
       name: "my-module",
       requires: ["data-exporter"],

       load(app) {
           const {dataExporter} = app.modules;
           // ...
       },

       // ...

   }


Module API
----------

.. js:autoclass:: modules/data-exporter/src/data-exporter.DataExporter
   :members:
   :short-name:




.. _Obsidian Project File: https://github.com/wanadev/obsidian-file
.. _data-store: ../data-store/index.html

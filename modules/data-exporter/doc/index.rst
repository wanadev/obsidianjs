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
   const ObisidianProjectFile = require("obsidian-file");

   const app = obsidian("my-application");
   app.use(dataExporter, {
       config: {
           // A string to identify the type of the prohect (uppercase, 10
           // characters maximum)
           type: "GENERIC",

           // Format of the Metadata section (0x00: JSON, 0x01: JSON+deflate)
           metadataFormat: ObisidianProjectFile.FORMAT_JSON_DEFLATE,

           // Format of the Project section (0x00: JSON, 0x01: JSON+deflate)
           projectFormat: ObisidianProjectFile.FORMAT_JSON_DEFLATE,

           // Format of the BlobIndex section (0x00: JSON, 0x01: JSON+deflate)
           blobIndexFormat: ObisidianProjectFile.FORMAT_JSON_DEFLATE,
       },
   });
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

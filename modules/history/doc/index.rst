history
=======

The **History** module allows you to manage an historic for your project.
It use data-store module to stack entities on 'snapshot' method
and restore them using 'go' method
History module can be use to implement system like Undo/Redo, Ctrl+Z / Ctrl+Y


Using This Module
-----------------

First add the module to your project::

    npm install --save @obsidianjs/history

Then use it in your application (in your main ``index.js``)::

   const obsidian = require("@obsidianjs/obsidian");
   const history = require("@obsidianjs/history");

   const app = obsidian("my-application");
   app.use(history);
   app.start();

Finally require it in modules that need it::

   {
       name: "my-module",
       requires: ["history"],

       load(app) {
           const {history} = app.modules;
           // ...
       },

       // ...

   }

Module API
-------------

.. js:autoclass:: modules/history/src/history.History
   :short-name:
   :members: snapshot, go, back, forward, isFirst, isLast, clear, getLength, getMaxLength, *

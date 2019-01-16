{{dashCase name}}
=============


Using This Module
-----------------

First add the module to your project::

    npm install --save @obsidianjs/{{dashCase name}}

Then use it in your application (in your main ``index.js``)::

   const obsidian = require("@obsidianjs/obsidian");
   const {{camelCase name}} = require("@obsidianjs/{{dashCase name}}");

   const app = obsidian("my-application");
   app.use({{camelCase name}});
   app.start();

Finally require it in modules that need it::

   {
       name: "my-module",
       requires: ["{{dashCase name}}"],

       load(app) {
           const {{{pascalCase name}}} = app.modules;
           // ...
       },

       // ...

   }


Module API
----------

.. js:autoclass:: modules/{{dashCase name}}/src/{{dashCase name}}.{{pascalCase name}}
   :members:
   :short-name:




.. _Obsidian Project File: https://github.com/wanadev/obsidian-file

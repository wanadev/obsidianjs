Application
===========

.. _obsidian:

Obsidian Factory Function
-------------------------

To get a new Obsidian application, you must use the Obsidian application
factory function.

.. js:autofunction:: obsidian/src/index.obsidian
   :short-name:

E.g.::

    const obsidian = require("@obsidianjs/obsidian");
    const app = obsidian("my-application");


Application Class Reference
---------------------------

.. WARNING::

   Do not instanciate the ``Application`` class yourself, use the
   :ref:`obsidian` instead.

.. js:autoclass:: obsidian/src/application.Application
   :short-name:
   :members: name, namespace, modules, load, unload, start, *

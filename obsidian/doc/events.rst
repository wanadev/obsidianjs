Events
======

Obsidian events are used to send and receive messages within a module or from a
module to another.


Usage
-----

The ``Application`` instance provides an access to a scoped bus of events:
``app.events``, which is automatically scoped to the namespace of the current
module.


Emitting an event
~~~~~~~~~~~~~~~~~

To emit an event, use ``events.emit()`` as follows:

.. code-block:: javascript

    app.events.emit("my-event.path", "hello", "world", 42);

Every argument passed after the event path (here, ``"hello"``, ``"world"``,
``42``) will be passed to the listeners of the event.


Subscribing to an event
~~~~~~~~~~~~~~~~~~~~~~~

To subscribe to an event, you may use ``events.on()``:

.. code-block:: javascript

    app.events.on("my-event.path", handler);

You may also use ``events.once`` to subscribe to a one-time event.


Events paths
~~~~~~~~~~~~

An event path is defined with an unique (in its namespace) string identifier,
which may be composed by one or many parts, separated by points.

Example:

.. code-block:: javascript

    app.events.emit("ready");
    app.events.emit("my-model.value-change");
    app.events.emit("my-controller.scene.update");

To subscribe to an event of a different module, you have to prefix the event
path with the namespace of the module (``@my-module.my-event-path``).

Example:

.. code-block:: javascript

    // myModule1/index.js
    app.events.emit("ready");

    // myModule1/someOtherFile.js
    app.events.on("ready", handler); // In the same module, we can register without prefix

    // myModule2/index.js
    app.events.on("@my-module-1.ready", handler); // Here, we have to add the namespace


API Reference
-------------

Events
~~~~~~
.. js:autoclass:: obsidian/src/events/events.Events
   :short-name:
   :members:


Bus
~~~

.. js:autoclass:: obsidian/src/events/bus.Bus
   :short-name:
   :members:

data-store
==========

The **data-store** module allows you to manage entities which are serializable classes.
It can store them and generate a final JSON file which contains all serializable
information from the stored entities. You can also provide a JSON to the data-store
and it will unserialize it and create the entities corresponding.


Documentation
-------------

* https://wanadev.github.io/obsidianjs/modules/data-store/


Changelog
---------

* **0.3.0:** Do not send the "entity-removed" when the item was not in the data store (#57)
* **0.2.2:** Expose the Entity class through the data-store module API
* **0.2.1:** Fixes wrong export
* **0.2.0:** Send events when adding and removing an Entity from the store
* **0.1.0:** Initial release.

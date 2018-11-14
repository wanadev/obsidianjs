const self = require("../index.js");

/**
 * History module allows you to manage an historic.
 * It use data-store module to stack entities on 'snapshot' method
 * and restore them using 'go' method
 * History module can be use to implement system like Undo/Redo, Ctrl+Z / Ctrl+Y
 */
class History {

    constructor(options = {}) {
         // max Length of historic, above that oldest snapshots are deleted
        this.maxLength = options.maxLength || 50;
        this._pointer = -1;
        this._snapshots = [];
    }

    /**
     * Max amount of snapshots stored by the history.
     *
     * @readOnly
     * @return {Number} max Length of historic, above that oldest snapshots are deleted
     */
    getMaxLength() {
        return this.maxLength;
    }

    /**
     * Currently stored snapshots count.
     *
     * @readOnly
     * @return {Number} current history length
     */
    getLength() {
        return this._snapshots.length;
    }

    /**
     * Tell if current pointed element is first in historic
     * It means we can't go any forward
     *
     * @readOnly
     * @return {Boolean}
     */
    isFirst() {
        return (this._pointer === -1);
    }

    /**
     * Tell if current pointed element is last in historic.
     * It means we can't go any backward
     *
     * @readOnly
     * @return {Boolean}
     */
    isLast() {
        return (this._pointer === this.maxLength - 1);
    }

    /**
     * Remove all snapshots from history.
     * @return {undefined}
     */
    clear() {
        this._snapshots.length = 0;
        this._pointer = -1;
    }

    /**
     * Take a snapshot of the current state of the project and put it into the history.
     * This snapshot will become the new head, all upbranch ones will be removed.
     * @return {undefined}
     *
     */
    snapshot() {
        let snapshot = {};
        const dataExporter = self.app.modules.dataExporter;
        snapshot = dataExporter.export();
        this._snapshots.splice(0, this._pointer, snapshot);
        this._pointer = 0;
        this._cropLength();
    }

    /**
     * Go backwards or forwards in history.
     * Positive delta is forwards, negative one is backwards.
     * This will change the current project to the saved version.
     *
     * @param {Number} delta state you want to reach, can be negative or positive
     *                       (will be croped by history length)
     * @return {undefined}
     */
    go(delta) {
        delta = this.simulate(delta);
        if (delta === 0) {
            return;
        }

        this._pointer -= delta;
        this.applyCurrentSnapshot();
        self.app.events.emit("go", this._pointer, this.maxLength);
    }

    /**
     * Go backwards in history.
     * @return {undefined}
     */
    back() {
        return this.go(-1);
    }

    /**
     * Go forwards in history.
     * @return {undefined}
     */
    forward() {
        return this.go(1);
    }

    /**
     * Test the delta reachability with go.
     * Returns the effective delta that will occur.
     * Therefore, a return value of 0 means nothing will change.
     *
     * @param {Number} delta
     * @return {Number} Effective delta that will occur.
     */
    simulate(delta) {
        delta = (delta !== undefined) ? delta : -1;
        if (this._pointer < 0) {
            return 0;
        }

        if (delta > 0) {
            if (delta > this._pointer) {
                delta = this._pointer;
            }
        } else if (-delta > (this._snapshots.length - this._pointer - 1)) {
            delta = -(this._snapshots.length - this._pointer - 1);
        }

        return delta;
    }

    /**
     * Reapply the currently pointed snapshot over the project.
     * @return {undefined}
     */
    applyCurrentSnapshot() {
        if (this._pointer < 0) {
            return;
        }

        let snapshot = this._snapshots[this._pointer];

        const dataExporter = self.app.modules.dataExporter;
        snapshot = dataExporter.import(snapshot);

        // Remove all structures that should not exist
        // for (var id in structuresCache) {
        //     if (!snapshotStructuresCache[id]) {
        //         structuresCache[id].destroy();
        //     }
        // }

        // Add all structures that should exist
        // for (id in snapshotStructuresCache) {
        //     if (!structuresCache[id]) {
        //         var cachedStructure = snapshotStructuresCache[id];
        //         this._pm.addStructure(serializer.objectUnserializer(cachedStructure.structure), cachedStructure.layerName);
        //     }
        // }

        // Move structure to the layer they belong to and apply unserialized data
        // for (var layerName in snapshot.layers) {
        //     var snapshotLayer = snapshot.layers[layerName];
        //     for (var i = 0; i < snapshotLayer.length; i++) {
        //         var snapshotStructure = snapshotLayer[i];
        //         var structure = structuresCache[snapshotStructure.id];

        //         // Change the layer if moved and reorder it anyway
        //         this._pm.setStructureLayer(snapshotStructure.id, layerName);
        //         this._pm.setStructureIndex(snapshotStructure.id, i);

        //         // Apply structure data for properties that have changed
        //         for (var propName in snapshotStructure) {
        //             var snapshotProp = snapshotStructure[propName];
        //             var prop = serializer.objectSerializer(structure[propName]);
        //             if (!lodash.isEqual(snapshotProp, prop)) {
        //                 structure[propName] = serializer.objectUnserializer(snapshotProp);
        //             }
        //         }
        //     }
        // }
    }

    /**
     * Crop the snapshots array to the max length.
     *
     * @private
     * @return {undefined}
     */
    _cropLength() {
        if (this._snapshots.length <= this.maxLength) {
            return;
        }
        this._snapshots.length = this.maxLength;
    }

}

module.exports = History;

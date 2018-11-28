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
        this.pointer = -1;
        this.snapshots = [];
    }

    /**
     * Set Max amount of snapshots stored by the history.
     *
     * @param {Number} max Length of historic, above that oldest snapshots are deleted
     */
    setMaxLength(maxLength) {
        if (Number.isNaN(Number(maxLength)) || maxLength <= 0) {
            throw new Error("Setter: History.setMaxLength parameters is not a number.");
        }
        this.maxLength = maxLength;
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
        return this.snapshots.length;
    }

    /**
     * Tell if current pointed element is first in historic
     * It means we can't go any forward
     *
     * @readOnly
     * @return {Boolean}
     */
    isFirst() {
        return (this.pointer === -1);
    }

    /**
     * Tell if current pointed element is last in historic.
     * It means we can't go any backward
     *
     * @readOnly
     * @return {Boolean}
     */
    isLast() {
        return (this.pointer === this.maxLength - 1);
    }

    /**
     * Remove all snapshots from history.
     * @return {undefined}
     */
    clear() {
        this.snapshots.length = 0;
        this.pointer = -1;
    }

    /**
     * Take a snapshot of the current state of the project and put it into the history.
     * This snapshot will become the new head, all upbranch ones will be removed.
     * @return {undefined}
     *
     */
    snapshot() {
        const snapshot = {};
        const {
            dataStore,
        } = self.app.modules;
        snapshot.layers = dataStore.serializeEntities();
        this.snapshots.splice(0, this.pointer, snapshot);
        this.pointer = 0;
        this.cropLength();
        self.app.events.emit("history-snapshot", this.pointer, this.snapshots.length, this.maxLength);
    }

    /**
     * Go backwards or forwards in history.
     * Positive delta is backwards, negative one is forwards.
     * This will change the current project to the saved version.
     *
     * @param {Number} delta state you want to reach, can be negative or positive
     *                       (will be croped by history length)
     * @return {undefined}
     */
    go(delta) {
        const effectiveDelta = this.simulate(delta);
        if (effectiveDelta === 0) {
            return;
        }

        this.pointer -= effectiveDelta;
        this.applyCurrentSnapshot();
        self.app.events.emit("history-go", this.pointer, this.maxLength);
    }

    /**
     * Go backwards in history.
     * @return {undefined}
     */
    back() {
        return this.go(1);
    }

    /**
     * Go forwards in history.
     * @return {undefined}
     */
    forward() {
        return this.go(-1);
    }

    /**
     * Test the delta reachability with go.
     * Returns the effective delta that will occur.
     * Therefore, a return value of 0 means nothing will change.
     *
     * @param {Number} delta
     * @return {Number} Effective delta that will occur.
     */
    simulate(testedDelta) {
        let delta = testedDelta;
        delta = (delta !== undefined) ? delta : -1;
        if (this.pointer < 0) {
            return 0;
        }

        if (delta > 0) {
            if (delta > this.pointer) {
                delta = this.pointer;
            }
        } else if (-delta > (this.snapshots.length - this.pointer - 1)) {
            delta = -(this.snapshots.length - this.pointer - 1);
        }

        return delta;
    }

    /**
     * Reapply the currently pointed snapshot over the project.
     * @return {undefined}
     */
    applyCurrentSnapshot() {
        if (this.pointer < 0) {
            return;
        }

        const snapshot = this.snapshots[this.pointer];

        const {
            dataStore,
        } = self.app.modules;
        // current state
        let structuresCache = dataStore.serializeEntities() || {};
        structuresCache = this.applyCurrentSnapshotInObject(structuresCache, snapshot.layers);
        dataStore.unserializeEntities(structuresCache);
    }

    /**
     * Intern function which compares and apply change recursively on 2 structures.
     * Adding/deleting/modifying properties on current structure to match with snapshot structure.
     * Only structureCurrent will be changed.
     * @param  {Object} structureCurrent  Structure of the current project exported by data-store
     * @param  {Object} structureSnapshot Structure of the snapshot project that you want to apply
     * @return {Object} structureCurrent
     */
    applyCurrentSnapshotInObject(structureCurrent, structureSnapshot) {
        if (structureCurrent) {
            // Remove all properties that should not exist
            Object.keys(structureCurrent).forEach((keyStructureCurrent) => {
                // Case property exist only in current structure and not in snapshot
                if (!structureSnapshot[keyStructureCurrent]) {
                    delete structureCurrent[keyStructureCurrent]; // eslint-disable-line no-param-reassign, max-len
                }
            });
        }

        if (structureSnapshot) {
            Object.keys(structureSnapshot).forEach((keySnapshot) => {
                if (typeof structureCurrent[keySnapshot] === "undefined") {
                    // Case property exist only in snapshot
                    // Add all properties that should exist
                    structureCurrent[keySnapshot] = structureSnapshot[keySnapshot]; // eslint-disable-line no-param-reassign, max-len
                    return structureCurrent;
                }
                // Case property exist in both current structure and snapshot structure
                if (typeof structureSnapshot[keySnapshot] !== "object" || Object.keys(structureSnapshot[keySnapshot]).length === 0) {
                    // Modify properties that have changed and that does not contain any child
                    structureCurrent[keySnapshot] = structureSnapshot[keySnapshot]; // eslint-disable-line no-param-reassign, max-len
                    return structureCurrent;
                }
                // Else property exist in both structure and the property have children
                // then we look recursively for their child
                return this.applyCurrentSnapshotInObject(structureCurrent[keySnapshot], structureSnapshot[keySnapshot]); // eslint-disable-line max-len

            });
        }

        return structureCurrent;
    }

    /**
     * Intern function
     * Crop the snapshots array to the max length.
     *
     * @private
     * @return {undefined}
     */
    cropLength() {
        if (this.snapshots.length <= this.maxLength) {
            return;
        }
        this.snapshots.length = this.maxLength;
    }

}

module.exports = History;

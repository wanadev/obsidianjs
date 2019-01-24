const self = require("../index.js");
const historyHelper = require("./history-helper.js");

/**
 * History module allows you to manage an history for your project.
 * It use data-store module to stack entities on 'snapshot' method
 * and restore them using 'go' method
 * History module can be use to implement system like Undo/Redo, Ctrl+Z / Ctrl+Y
 */
class History {

    constructor() {
        // max Length of history, above that oldest snapshots are deleted
        this.maxLength = (self.app.config) ? self.app.config.get("maxLength") : 50;
        this.pointer = -1;
        this.snapshots = [];
    }

    /**
     * Set Max amount of snapshots stored by the history.
     *
     * @param {Number} max Length of history, above that oldest snapshots are deleted
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
     * @return {Number} max Length of history, above that oldest snapshots are deleted
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
     * Tell if current pointed element is first in history
     * It means we can't go any further forward
     * It means pointer is on last snapshot taken
     *
     * @readOnly
     * @return {Boolean}
     */
    isFirst() {
        return (this.pointer === 0);
    }

    /**
     * Tell if current pointed element is last in history.
     * It means we can't go any further backward
     * It means pointer is on first snapshot taken
     *
     * @readOnly
     * @return {Boolean}
     */
    isLast() {
        return (this.pointer === this.snapshots.length - 1 && this.snapshots.length > 0);
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
     */
    go(delta) {
        const effectiveDelta = this.simulate(delta);
        if (!effectiveDelta) { // Nothing happens
            return;
        }
        this.pointer += effectiveDelta;
        this.applyCurrentSnapshot();
        self.app.events.emit("history-go", this.pointer, this.maxLength);
    }

    /**
     * Go backwards in history.
     */
    back() {
        this.go(1);
    }

    /**
     * Go forwards in history.
     */
    forward() {
        this.go(-1);
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
        const delta = testedDelta;
        if (this.pointer < 0 || !delta) {
            return 0;
        }
        if (delta > 0) { // Means we go back in history
            if (delta > (this.snapshots.length - this.pointer - 1)) {
                return 0; // means that we go out of major bound so we should not move
            }
        } else if (this.pointer + delta < 0) {
            // Means that we go out of minor bound so we should not move
            return 0;
        }
        return delta;
    }

    /**
     * Reapply the currently pointed snapshot over the project.
     * @return {undefined}
     */
    applyCurrentSnapshot() {
        if (this.pointer < 0) {
            self.app.log.warn("You want to apply screenshot on a negative pointer");
            return;
        }
        const snapshot = this.snapshots[this.pointer];
        const {
            dataStore,
        } = self.app.modules;
        // current state
        const structuresCache = dataStore.serializeEntities() || {};
        const clonedStructuresCache = historyHelper.cloneObject(structuresCache);
        const structureSnapshot = historyHelper.cloneObject(snapshot.layers);
        historyHelper.applySnapshotDifference(clonedStructuresCache, structureSnapshot);
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

    getPointer() {
        return this.pointer;
    }

    setPointer(val) {
        this.pointer = val;
    }

}

module.exports = History;

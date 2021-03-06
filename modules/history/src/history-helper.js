const SerializableClass = require("abitbol-serializable");
const self = require("../index.js");

const historyHelper = {

    /**
     * Check the differences between two state and apply the changes of snapshotState
     * to currentState
     * @param  {Object} currentState - The current state of the history
     * @param  {Object} snapshotState - The new state of the history
     */
    applySnapshotDifference: (currentState, snapshotState) => { // eslint-disable-line
        const {
            dataStore,
        } = self.app.modules;
        // We make a flat object list for each object
        const currentEntities = historyHelper.flattenSnapshot(currentState);
        const snapshotEntities = historyHelper.flattenSnapshot(snapshotState);

        Object.keys(currentEntities).forEach(
            (currentEntityKey) => {
                const currentEntity = currentEntities[currentEntityKey];
                const snapshotEntity = snapshotEntities[currentEntityKey];
                if (typeof snapshotEntity !== "undefined") {
                    const entity = dataStore.getEntity(currentEntityKey);
                    // Property is different or doesn't exist
                    const unserializedEntity = SerializableClass
                        .$unserialize(snapshotEntity);
                    Object.keys(snapshotEntity).forEach(
                        (property) => {
                            if ((typeof currentEntity[property] !== "undefined"
                                && historyHelper.checkDiff(currentEntity[property],
                                    snapshotEntity[property]))) {
                                // Found differences
                                entity[property] = unserializedEntity[property];
                            } else if (typeof currentEntity[property] === "undefined") {
                                self.app.log.warn("You have an additional property in the snapshot "
                                + "state, which should never happen");
                            }
                        },
                    );
                    // Check if we don't need to remove a property in entities
                    // Should never happen
                    Object.keys(currentEntity).forEach(
                        (property) => {
                            if (typeof snapshotEntity[property] === "undefined") {
                                self.app.log.warn("You are removing a property between two entities"
                                + ", which should never happen");
                                delete entity[property];
                            }
                        },
                    );
                    // delete to decrease the length of snapshotEntities loop
                    delete snapshotEntities[currentEntityKey];
                } else if (dataStore.getEntity(currentEntityKey)) {
                    // Entity doesn't exist in snapshot
                    dataStore.removeEntity(currentEntityKey);
                }
            },
        );

        Object.keys(snapshotState).forEach(
            // We add the absent entity in the currentState to the store
            (path) => {
                const snapshotPath = snapshotState[path];
                if (typeof currentState[path] !== "undefined") {
                    snapshotPath.forEach(
                        (snapshotEntity) => {
                            const entityFound = currentState[path].some(
                                currentEntity => (snapshotEntity.id === currentEntity.id),
                            );
                            if (!entityFound) {
                                const cloneObject = JSON.parse(JSON.stringify(snapshotEntity));
                                const entity = SerializableClass.$unserialize(cloneObject);
                                dataStore.addEntity(entity, path);
                                currentState[path].push(cloneObject);
                            }
                        },
                    );
                } else {
                    currentState[path] = []; // eslint-disable-line no-param-reassign
                    snapshotPath.forEach(
                        (snapshotEntity) => {
                            const entity = SerializableClass.$unserialize(snapshotEntity);
                            dataStore.addEntity(entity, path);
                            currentState[path].push(snapshotEntity);
                        },
                    );
                }
            },
        );

        // Replace entity in correct path
        Object.keys(snapshotState).forEach(
            (snapshotPathKey) => {
                const snapshotPath = snapshotState[snapshotPathKey];
                snapshotPath.forEach(
                    (snapshotEntity) => {
                        Object.keys(currentState).forEach(
                            (currentPathKey) => {
                                const currentPath = currentState[currentPathKey];
                                currentPath.forEach(
                                    (currentEntity) => {
                                        if ((currentEntity.id === snapshotEntity.id)
                                        && (snapshotPathKey !== currentPathKey)) {
                                            dataStore.removeEntity(currentEntity.id);
                                            const entity = SerializableClass
                                                .$unserialize(snapshotEntity);
                                            dataStore.addEntity(entity, snapshotPathKey);
                                        }
                                    },
                                );
                            },
                        );
                    },
                );
            },
        );
    },

    /**
     * Take a snapshot and returns an object with entity.id
     * as keys and entity as values
     * @param {object} snapshotState
     * @return {object} The flattened object
     */
    flattenSnapshot: (snapshotState) => {
        const flattenSnapshotObject = {};
        Object.keys(snapshotState).forEach(
            (path) => {
                snapshotState[path].forEach(
                    (entity) => {
                        flattenSnapshotObject[entity.id] = entity;
                    },
                );
            },
        );
        return flattenSnapshotObject;
    },

    /**
     * Check the difference between two properties of object
     */
    checkDiff: (property1, property2) => {
        if (property1 === null || property2 === null
            || typeof property1 !== "object"
            || Object.keys(property1).length === 0
        ) {
            return (property1 !== property2);
        }
        if (Array.isArray(property1)) {
            if (!Array.isArray(property2)) {
                return true;
            }
            return historyHelper.checkDiffInArray(property1, property2);
        }
        if (typeof property2 !== "object") {
            return true;
        }
        return Object.keys(property1).some(
            propertyKey => historyHelper.checkDiff(property1[propertyKey], property2[propertyKey]),
        );
    },

    /**
     * Check the difference between two arrays
     * @param {array} array1
     * @param {array} array2
     */
    checkDiffInArray(array1, array2) {
        return (array1.length !== array2.length || array1.some(
            (value, index) => historyHelper.checkDiff(value, array2[index]),
        ));
    },

};
module.exports = historyHelper;

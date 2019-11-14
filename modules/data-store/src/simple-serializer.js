const SimpleSerializer = {

    classes: [],

    classParameter: "__name__",

    registerClass(cl) {
        if (cl.prototype && cl.prototype.unserialize && cl.prototype.serialize) {
            this.classes.push(cl);
        } else {
            throw new Error("To be serialized, an object must implement the serialize and unserialize methods");
        }
    },

    objectSerializer(entitiesByPath) {
        const serializedEntities = {};
        Object.keys(entitiesByPath).forEach((path) => {
            serializedEntities[path] = [];
            const entities = entitiesByPath[path];
            entities.forEach((entity) => {
                const serialized = this.serializeEntity(entity);
                if (serialized) {
                    serializedEntities[path].push(serialized);
                } else {
                    throw new Error(`Entity ${entity} doesn't have a serialize method !`);
                }
            });
        });
        return serializedEntities;
    },

    objectUnserializer(serializedEntities) {
        const unserializedEntities = {};
        Object.keys(serializedEntities).forEach((k) => {
            unserializedEntities[k] = [];
            const serializedData = serializedEntities[k];
            serializedData.forEach((serializedEntity) => {
                const unserialized = this.unserializeEntity(serializedEntity);
                if (unserialized) {
                    unserializedEntities[k].push(unserialized);
                } else {
                    throw new Error(`The serialized object ${serializedData} doesn't have a registered class parameter.`);
                }

            });
        });
        return unserializedEntities;
    },

    unserializeEntity(serializedEntity, Class = null) {
        const ActualClass = Class || this.isSerializedNative(serializedEntity);
        if (ActualClass) {
            const ent = new ActualClass();
            ent.unserialize(serializedEntity);
            return ent;
        }
        return null;
    },

    serializeEntity(entity) {
        if (typeof (entity.serialize) === "function") {
            const s = entity.serialize();
            s.$data = entity.$data;
            s[this.classParameter] = entity.constructor.name;
            return s;
        }
        return null;
    },

    isSerializedNative(serializedObject) {
        return serializedObject.__name__ ? this.classes.find(c => c.name === serializedObject[this.classParameter]) : false;
    },

    extractNativeEntities(entitiesByPath) {
        const nativeEntities = {};
        const otherEntities = {};
        Object.keys(entitiesByPath).forEach((path) => {
            const entities = entitiesByPath[path];
            entities.forEach((entity) => {
                if (this.isSerializedNative(entity)) {
                    if (!nativeEntities[path]) {
                        nativeEntities[path] = [];
                    }
                    nativeEntities[path].push(entity);
                } else {
                    if (!otherEntities[path]) {
                        otherEntities[path] = [];
                    }
                    otherEntities[path].push(entity);
                }
            });

        });
        return {
            nativeEntities,
            otherEntities,
        };
    },


};
export default SimpleSerializer;

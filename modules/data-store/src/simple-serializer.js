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
                if (typeof (entity.serialize) === "function") {
                    const s = entity.serialize();
                    s.$data = entity.$data;
                    s[this.classParameter] = entity.constructor.name;
                    serializedEntities[path].push(s);
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
                const cl = serializedEntity[this.classParameter];
                if (cl) {
                    const Class = this.classes.find(
                        c => c.name === cl,
                    );
                    if (Class) {
                        const obj = new Class();
                        obj.unserialize(serializedEntity);
                        unserializedEntities[k].push(obj);
                    } else {
                        throw new Error(`class ${cl} not registered for unserialization`);
                    }
                } else {
                    throw new Error(`The serialized object ${serializedData} doesn't have a serialized class !`);
                }

            });
        });
        return unserializedEntities;
    },

    extractNativeEntities(entitiesByPath) {
        const nativeEntities = {};
        const otherEntities = {};
        Object.keys(entitiesByPath).forEach((path) => {
            const entities = entitiesByPath[path];
            entities.forEach((entity) => {
                if (this.classes.find(c => c.name === entity.__name__)) {
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

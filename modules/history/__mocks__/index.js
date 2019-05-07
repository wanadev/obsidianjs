

module.exports = {
    app: {
        events: {
            emit: jest.fn(),
        },
        log: {
            warn: jest.fn(),
        },
        config: {
            get: (seekedValue) => {
                if (seekedValue === "maxLength") {
                    return 50;
                }
                return undefined;
            },
        },
        modules: {
            dataStore: {
                addEntity: jest.fn(entity => entity.id),
                getEntity: jest.fn().mockReturnValue({
                    "/a": [{
                        __name__: "Entity",
                        id: "1",
                        prop1: "toto",
                    }],
                }),
                removeEntity: jest.fn(),
                serializeEntities: jest.fn()
                    .mockReturnValue({
                        "/a": [{
                            __name__: "Entity",
                            id: "1",
                        }],
                    }),

                unserializeEntities: jest.fn()
                    .mockReturnValue({
                        "/a": [{
                            __name__: "Entity",
                            id: "1",
                        }],
                    }).mockReturnValueOnce({
                        "/a": [{
                            __name__: "Entity",
                            id: "1",
                        }],
                        "/b": {
                            __name__: "Entity",
                            id: "2",
                        },
                    }).mockReturnValueOnce({
                        "/a": [{
                            __name__: "Entity",
                            id: "1",
                        }],
                        "/c": {
                            __name__: "Entity",
                            id: "3",
                        },
                    }),
            },
        },
    },
};

module.exports = {
    app: {
        events: {
            emit: jest.fn(),
        },
        modules: {
            dataStore: {
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

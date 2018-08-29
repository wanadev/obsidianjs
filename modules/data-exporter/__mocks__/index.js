module.exports = {
    app: {
        modules: {
            dataStore: {
                clear: jest.fn(),
                serializeEntities: jest.fn().mockReturnValue({
                    "/a": [{
                        __name__: "Entity",
                        id: "1",
                    }],
                }),
                unserializeEntities: jest.fn(),
            },
        },
    },
};

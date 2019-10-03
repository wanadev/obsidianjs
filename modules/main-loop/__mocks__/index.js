module.exports = {
    app: {
        events: {
            emit: jest.fn(),
        },
        config: {
            get: () => null,
        },
    },
};

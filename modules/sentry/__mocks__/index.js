module.exports = {
    app: {
        name: "Test app",
        log: {
            error: jest.fn(),
        },
        config: {
            get: () => true,
        },
    },
};

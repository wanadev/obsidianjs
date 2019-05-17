const Raven = jest.genMockFromModule("raven-js");

Raven.config.mockReturnValue({
    install: jest.fn(),
});

module.exports = Raven;

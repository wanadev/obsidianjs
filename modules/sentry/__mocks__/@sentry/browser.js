const Sentry = jest.genMockFromModule("@sentry/browser");

Sentry.withScope.mockImplementation((scopeCallback) => {
    scopeCallback(new Sentry.Scope());
});

Sentry.init.mockImplementation(() => {});

module.exports = Sentry;

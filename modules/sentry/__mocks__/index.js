module.exports = {
    app: {
        name: "Test app",
        log: {
            error: jest.fn(),
        },
        config: {
            get: (seekedValue) => {
                if (seekedValue === "@obsidian.debug") {
                    return false;
                } if (seekedValue === "capturedLevels") {
                    return ["fatal"];
                } if (seekedValue === "userInfos") {
                    return {};
                }
                return null;
            },
        },
        events: {
            on: jest.fn(),
        },
    },
};

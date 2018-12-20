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
                } else if (seekedValue === "capturedLevels") {
                    return ["fatal"];
                } else if (seekedValue === "userInfos") {
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

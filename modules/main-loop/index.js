export default {
    name: "main-loop",
    requires: [],
    load() {
        const MainLoop = require("./src/main-loop").default;
        return new MainLoop();
    },
    unload() {},
    config: {
        activeFps: -1,
        idleFps: 0,
        debug: false,
    },
};

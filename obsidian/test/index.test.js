const obsidian = require("../src/index");
const Application = require("../src/application");

test("Factory function returns an Application instance", () => {
    expect(obsidian()).toBeInstanceOf(Application);
});

test("Default application name should be 'obsidian'", () => {
    expect(obsidian().name).toBe("obsidian");
});

test("Factory function can set the application name", () => {
    expect(obsidian("foobar").name).toBe("foobar");
});

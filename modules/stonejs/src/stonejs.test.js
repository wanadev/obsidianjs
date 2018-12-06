jest.mock("../index.js");

const self = require("../index.js");

describe("self.app.events.emit('locale-changed', currentLocale)", () => {
    test("Emits an event when we are changing the the locale", () => {
        const stone = self.load(self.app);
        stone.setLocale("C");

        expect(self.app.events.emit).toHaveBeenCalledWith("locale-changed", "C");
    });
});

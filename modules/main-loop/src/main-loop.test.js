import MainLoop from "./main-loop";

jest.mock("../index.js");
jest.useFakeTimers();

const self = require("../index");

const mockedScreenFps = 120;
const frameTime = 1000 / mockedScreenFps;
let currentTime = window.performance.now();

// mock performance
global.performance = {
    now: () => currentTime,
};

// mock  request animation frame so it's limited by mockedScreenFps
global.requestAnimationFrame = (cb) => {
    currentTime += frameTime;
    setTimeout(() => {
        cb(currentTime);
    }, frameTime);
};


beforeEach(() => {
    currentTime = window.performance.now();
    jest.clearAllTimers();
    jest.clearAllMocks();
});


describe("MainLoop._update", () => {
    test("call callbaks and emit event", () => {
        const mainLoop = new MainLoop();
        const fun1 = jest.fn();
        const fun2 = jest.fn();
        mainLoop.addCallback(fun1);
        mainLoop.addCallback(fun2);
        mainLoop._update(window.performance.now());
        expect(fun1).toHaveBeenCalledTimes(1);
        expect(fun2).toHaveBeenCalledTimes(1);

        // 1 time for initialize, 1 time for update
        expect(self.app.events.emit).toHaveBeenCalledTimes(2);
        expect(self.app.events.emit.mock.calls[1][0]).toBe("update");
    });
});
describe("events cast", () => {
    test("events", () => {
        const mainLoop = new MainLoop();
        mainLoop.start();
        mainLoop.stop();
        expect(self.app.events.emit.mock.calls[0][0]).toBe("initialize");
        expect(self.app.events.emit.mock.calls[1][0]).toBe("start");
        expect(self.app.events.emit.mock.calls[2][0]).toBe("update");
        expect(self.app.events.emit.mock.calls[3][0]).toBe("stop");
        expect(self.app.events.emit.mock.calls.length).toBe(4);
    });
});
describe("fps check", () => {
    test("unlimited fps, 1sec", () => {
        const mainLoop = new MainLoop();
        const countFun = jest.fn();
        const maxApproximation = mockedScreenFps / 20;
        mainLoop.addCallback(countFun);
        mainLoop.start();
        jest.advanceTimersByTime(1000);
        const deltaFps = Math.abs(countFun.mock.calls.length - mockedScreenFps);
        expect(deltaFps <= maxApproximation).toBe(true);
    });
    test("unlimited fps, 10sec", () => {
        const mainLoop = new MainLoop();
        const countFun = jest.fn();
        const maxApproximation = mockedScreenFps / 2;
        mainLoop.addCallback(countFun);
        mainLoop.start();
        jest.advanceTimersByTime(10000);
        const deltaFps = Math.abs(countFun.mock.calls.length - 10 * mockedScreenFps);
        expect(deltaFps <= maxApproximation).toBe(true);
    });
});
/* describe("fps check 2", () => {
    test("fps count", () => {
        MockDate.set(0);
        expect(self.app.events.emit.mock.calls.length).toBe(0);
        // console.log(" calls before", self.app.events.emit.mock.calls);

        const mainLoop = new MainLoop();
        mainLoop.start();
        const emitCallsOffset = 2;

        global.timeTravel(2000);

        // console.log("calls 50", self.app.events.emit.mock.calls);
        expect(self.app.events.emit.mock.calls.length).toBe(50 + emitCallsOffset);
    });

}); */

import MainLoop from "./main-loop";

jest.mock("../index.js");
jest.useFakeTimers();

const self = require("../index");

const mockedScreenFps = 120;
const frameTime = 1000 / mockedScreenFps;
let currentTime = 0.0;


// mock  request animation frame so it's limited by mockedScreenFps
global.requestAnimationFrame = (cb) => {
    currentTime += frameTime;
    setTimeout(() => {
        cb(currentTime);
    }, frameTime);
};

// clean timers and mocks before each test
beforeEach(() => {
    currentTime = window.performance.now();
    jest.clearAllTimers();
    jest.clearAllMocks();
});


describe("MainLoop.update", () => {
    test("call callbaks and emit event", () => {
        const mainLoop = new MainLoop();
        const fun1 = jest.fn();
        const fun2 = jest.fn();
        mainLoop.addCallback(fun1);
        mainLoop.addCallback(fun2);
        mainLoop.update(window.performance.now());
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
        mainLoop.addCallback(countFun);
        mainLoop.start();
        jest.advanceTimersByTime(1000);

        // -- frame count --
        const deltaFrameCount = Math.abs(countFun.mock.calls.length - mockedScreenFps);
        const maxApproximation = mockedScreenFps / 20;
        expect(deltaFrameCount).toBeLessThanOrEqual(maxApproximation);

        // -- data sent to the callback --

        // first frame infos : no time elapsed, fps is infinity
        const firstInfos = countFun.mock.calls[0][0];
        expect(firstInfos.timeSinceLastCall).toBe(0);
        expect(firstInfos.fps).toBe(Infinity);
        expect(firstInfos.idle).toBe(false);


        // fps and time elapsed check for other frames
        for (let i = 1; i < countFun.mock.calls.length; i++) {
            // epsilons bigger for the first frame which do get less accurate infos
            const epsilonFps = i === 1 ? 2 : 0.2;
            const epsilonTime = i === 1 ? 0.2 : 0.02;
            const loopInfos = countFun.mock.calls[i][0];
            expect(Math.abs(loopInfos.fps - mockedScreenFps)).toBeLessThan(epsilonFps);
            expect(Math.abs(loopInfos.timeSinceLastCall - frameTime)).toBeLessThan(epsilonTime);
            expect(loopInfos.idle).toBe(false);
        }

    });
});

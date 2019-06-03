import MainLoop from "./main-loop";

jest.mock("../index.js");
jest.useFakeTimers();
const self = require("../index");

const GLOBALS = {
    // mocked screen fps for requestAnimationFrame and its corresponding frame time
    mockedScreenFps: 120,
    frameTime: 1000 / 120,
    // mocked current time
    currentTime: 0.0,
};


// mock  request animation frame so it's limited by mockedScreenFps
global.requestAnimationFrame = (cb) => {
    GLOBALS.currentTime += GLOBALS.frameTime;
    setTimeout(() => {
        cb(GLOBALS.currentTime);
    }, GLOBALS.frameTime);
};

// clean timers and mocks before each test
beforeEach(() => {
    GLOBALS.currentTime = window.performance.now();
    jest.clearAllTimers();
    jest.clearAllMocks();
});

/**
 * Run the loop for a period of time and check the number of callbacks called and
 * their received parameters
 * @param mainLoop
 * @param time
 * @param expectedFps
 * @param expectedIdle=false
 * @param autostart=true
 * @param debug={}
 */
function TestFps(mainLoop, time, expectedFps, expectedIdle = false, autostart = true, debug = {}) {
    self.app.events.emit.mock.calls.length = 0;

    const countFun = jest.fn();
    mainLoop.addCallback(countFun);

    if (autostart) {
        mainLoop.start();
    }

    jest.advanceTimersByTime(time);
    const expectedFrameTime = 1000 / expectedFps;

    // -- frame count by counting callbacks--
    const deltaFrameCount = Math.abs(countFun.mock.calls.length - time * expectedFps / 1000);
    const maxApproximation = Math.round(expectedFps * 0.05 * time / 1000); // 5% margin
    expect(deltaFrameCount).toBeLessThanOrEqual(maxApproximation);

    // -- frame count by counting events
    const deltaEventCount = Math.abs(
        self.app.events.emit.mock.calls.length - 1
            - time * expectedFps / 1000,
    );
    expect(deltaEventCount).toBeLessThanOrEqual(maxApproximation);

    // -- data sent to the callback and events --
    let badFrameInfos = 0;

    // fetch all the info received by callbasks and events
    const filteredEvents = self.app.events.emit.mock.calls.filter(call => call[0] === "update");
    const allInfos = filteredEvents.map(call => call[1])
        .concat(countFun.mock.calls.map(call => call[0]));


    // fps and time elapsed check for other frames
    for (let i = 0; i < allInfos.length; i++) {
        // epsilons bigger for the first frame which do get less accurate infos
        const epsilonFps = i === 1 ? 2 : 0.2;
        const epsilonTime = i === 1 ? 0.2 : 0.02;
        const loopInfos = allInfos[i];
        if (debug.loopInfos) {
            console.log("loop info", loopInfos);
        }
        if (Math.abs(loopInfos.fps - expectedFps) > epsilonFps
            || Math.abs(loopInfos.timeSinceLastCall - expectedFrameTime) > epsilonTime) {
            badFrameInfos += 1;
        }
        expect(loopInfos.idle).toBe(expectedIdle);
    }
    expect(badFrameInfos).toBeLessThan(5);

}

describe("MainLoop.update", () => {
    test("call callbaks and emit event", () => {
        const mainLoop = new MainLoop();
        const fun1 = jest.fn();
        const fun2 = jest.fn();
        const fun3 = jest.fn();
        mainLoop.addCallback(fun1);
        mainLoop.addCallback(fun2);
        mainLoop.removeCallback(fun3);
        mainLoop.update(window.performance.now());
        expect(fun1).toHaveBeenCalledTimes(1);
        expect(fun2).toHaveBeenCalledTimes(1);
        expect(fun3).toHaveBeenCalledTimes(0);

        // 1 time for initialize, 1 time for update
        expect(self.app.events.emit).toHaveBeenCalledTimes(2);
        expect(self.app.events.emit.mock.calls[1][0]).toBe("update");
    });
});

describe("events cast", () => {
    test("events and enabled state", () => {
        const mainLoop = new MainLoop();
        mainLoop.start();
        expect(mainLoop.enabled).toBe(true);
        mainLoop.stop();
        expect(mainLoop.enabled).toBe(false);
        expect(self.app.events.emit.mock.calls[0][0]).toBe("initialize");
        expect(self.app.events.emit.mock.calls[1][0]).toBe("start");
        expect(self.app.events.emit.mock.calls[2][0]).toBe("update");
        expect(self.app.events.emit.mock.calls[3][0]).toBe("stop");
        expect(self.app.events.emit.mock.calls.length).toBe(4);
    });
});

describe("Interval calculation", () => {
    test("interval for active state, unlimited fps", () => {
        const mainLoop = new MainLoop();
        mainLoop.refreshIntervalValue();
        expect(mainLoop.$data.interval).toBeCloseTo(-1);
    });
    test("interval for active state, 60 fps", () => {
        const mainLoop = new MainLoop();
        const epsilon = 0.01;
        mainLoop.$data.activeFps = 60;
        mainLoop.refreshIntervalValue();
        expect(mainLoop.$data.interval).toBeCloseTo(1000 / 60 - epsilon);
    });
    test("interval for idle state, 5 fps", () => {
        const mainLoop = new MainLoop();
        const epsilon = 0.01;
        mainLoop.$data.idle = true;
        mainLoop.$data.idleFps = 5;
        mainLoop.refreshIntervalValue();
        expect(mainLoop.$data.interval).toBeCloseTo(1000 / 5 - epsilon);
    });
});

describe("window events", () => {
    test("window blur => idle, window focus => active", () => {

        const mainLoop = new MainLoop();

        // active on creation
        expect(mainLoop.idle).toBe(false);

        // idle after blur
        window.dispatchEvent(new Event("blur"));
        expect(mainLoop.idle).toBe(true);

        // active after focus
        window.dispatchEvent(new Event("focus"));
        expect(mainLoop.idle).toBe(false);

        // blur again
        window.dispatchEvent(new Event("blur"));
        expect(mainLoop.idle).toBe(true);

        // mainloop not enabled by default : shouldn't update
        expect(self.app.events.emit.mock.calls.filter(c => c[0] === "update").length).toBe(0);
    });

});

describe("fps check", () => {
    test("unlimited fps, 1sec", () => {
        const mainLoop = new MainLoop();
        TestFps(mainLoop, 1000, GLOBALS.mockedScreenFps);
    });
    test("unlimited fps, 10sec", () => {
        const mainLoop = new MainLoop();
        TestFps(mainLoop, 10000, GLOBALS.mockedScreenFps);
    });
    test("60 fps, 1sec", () => {
        const mainLoop = new MainLoop();
        mainLoop.activeFps = 60;
        TestFps(mainLoop, 1000, 60);
    });
    test("30 fps, 1sec", () => {
        const mainLoop = new MainLoop();
        mainLoop.activeFps = 30;
        TestFps(mainLoop, 1000, 30);
    });
    test("idle, 5fps, 1sec", () => {
        const mainLoop = new MainLoop();
        mainLoop.idleFps = 5;
        mainLoop.idle = true;
        TestFps(mainLoop, 1000, 5, true);
    });
    test("idle, 0fps, 1sec", () => {
        const mainLoop = new MainLoop();
        mainLoop.idleFps = 0;
        mainLoop.idle = true;
        TestFps(mainLoop, 1000, 0, true);
    });
    test("activeFps variation", () => {
        const mainLoop = new MainLoop();
        TestFps(mainLoop, 1000, GLOBALS.mockedScreenFps);
        mainLoop.activeFps = 60;
        TestFps(mainLoop, 1000, 60, false, false);
        mainLoop.activeFps = 30;
        TestFps(mainLoop, 1000, 30, false, false);
        mainLoop.activeFps = 15;
        TestFps(mainLoop, 1000, 15, false, false);
    });
});

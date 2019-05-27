jest.mock("../index.js");

import MainLoop from "./main-loop";
const self = require("../index");


const MockDate = require('mockdate')
const frameTime = 10

global.requestAnimationFrame = (cb) => {
    // Default implementation of requestAnimationFrame calls setTimeout(cb, 0),
    // which will result in a cascade of timers - this generally pisses off test runners
    // like Jest who watch the number of timers created and assume an infinite recursion situation
    // if the number gets too large.
    //
    // Setting the timeout simulates a frame every 1/100th of a second
    setTimeout(cb, frameTime)
}
global.timeTravel = (time = frameTime) => {
    const tickTravel = () => {
        // The React Animations module looks at the elapsed time for each frame to calculate its
        // new position
        const now = Date.now()
        MockDate.set(new Date(now + frameTime))
        // Run the timers forward
        jest.advanceTimersByTime(frameTime)
    }
    // Step through each of the frames
    const frames = time / frameTime
    let framesEllapsed
    for (framesEllapsed = 0; framesEllapsed < frames; framesEllapsed++) {
        tickTravel()
    }
}

beforeEach(() => {
    
    jest.clearAllMocks();
    // As part of constructing the Animation, it will grab the
    // current time. Mocking the date right away ensures everyone
    // is starting from the same time
    MockDate.set(0)

    // Need to fake the timers for timeTravel to work
    jest.useFakeTimers()
    
})


describe("MainLoop._update", ()=>{
    
    test("call callbaks and emit event", () =>{
        const mainLoop = new MainLoop();
        const fun1 = jest.fn();
        const fun2 = jest.fn();
        const eventFun = self.app.events.emit;
        mainLoop.addCallback(fun1);
        mainLoop.addCallback(fun2);
        mainLoop._update(window.performance.now());
        expect(fun1.mock.calls.length).toBe(1);
        expect(fun2.mock.calls.length).toBe(1);
        expect(self.app.events.emit.mock.calls[1][0]).toBe("update");
    })
});
/*
describe("fps check", () =>{
    test("fps count", () =>{ 
        MockDate.set(0)
        expect(self.app.events.emit.mock.calls.length).toBe(0);

        const mainLoop = new MainLoop();
        mainLoop.start();
        const emitCallsOffset = 2;

        global.timeTravel(1000);
        console.log("calls 100", self.app.events.emit.mock.calls)
        expect(self.app.events.emit.mock.calls.length).toBe(100 + emitCallsOffset);
    });

})*/
describe("fps check 2", () =>{
    test("fps count", () =>{ 
        MockDate.set(0)
        expect(self.app.events.emit.mock.calls.length).toBe(0);
        console.log(" calls before",self.app.events.emit.mock.calls )

        const mainLoop = new MainLoop();
        mainLoop.start();
        const emitCallsOffset = 2;

        global.timeTravel(2000);

        console.log("calls 50", self.app.events.emit.mock.calls)
        expect(self.app.events.emit.mock.calls.length).toBe(50 + emitCallsOffset);
    });

})
describe("events cast", ()=>{
    test("events", () => {
        const mainLoop = new MainLoop();
        mainLoop.start();
        mainLoop.stop();
        console.log(self.app.events.emit.mock.calls);
        expect(self.app.events.emit.mock.calls[0][0]).toBe("initialize");
        expect(self.app.events.emit.mock.calls[1][0]).toBe("start");
        expect(self.app.events.emit.mock.calls[2][0]).toBe("update");
        expect(self.app.events.emit.mock.calls[3][0]).toBe("stop");
    });
})

    



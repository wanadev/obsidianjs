import self from "../index";

/**
 * A loop...
 * Can be used to render 2d or 3d, or to do anything at a rather fixed time interval
 * It's using RequestAnimationFrame, so to get a constant time interval,
 * 60 must be a multiple of your desired fps
 */
class MainLoop {

    constructor() {
        const config = MainLoop.FetchConfig();

        // Private parameters
        this._interval = 0;
        this._currentRequestId = null;
        this._lastLoopCorrectedTime = window.performance.now();
        this._lastLoopTime = this._lastLoopCorrectedTime;

        // Public parameters with getter-setters
        this._activeFps = config.get("activeFps") || 60;
        this._idleFps = config.get("idleFps") || 0;
        this._idle = false;
        this._enabled = false;

        // Public parameters

        /**
         * Registered callbacks
         * @type {Array}
         */
        this.callbacks = [];

        /**
         * current fps
         * @type {Number}
         */
        this.fps = this.activeFps;

        // Initialization
        this.initListeners();
        this.refreshIntervalValue();
        if (config.debug) {
            this.initDebug();
        }
        self.app.events.emit("initialize");
    }

    /**
     * Refresh the wanted time _interval between callbacks
     */
    refreshIntervalValue() {
        if (this._idle) {
            if (this.idleFps > 0) {
                this._interval = 1000 / this.idleFps;
            } else {
                this._interval = -1;
            }
        } else {
            this._interval = 1000 / this.activeFps;
        }
    }

    /**
     * Launch window listeners : lost of focus management
     */
    initListeners() {
        window.addEventListener("focus", () => {
            if (this._currentRequestId) {
                window.cancelAnimationFrame(this._currentRequestId);
            }
            this._loop();
            this.idle = false;
        }, true);
        window.addEventListener("blur", () => {
            this.idle = true;
        }, true);
    }

    /**
     * Add Debug callback to log loop info
     * @return {[type]} [description]
     */
    initDebug() {
        this.addCallback((loopInfo) => {
            console.log("LoopInfos", JSON.stringify(loopInfo));
        });
    }


    /**
     * Start the loop.
     */
    start() {
        this._enabled = true;
        if (this._currentRequestId) {
            window.cancelAnimationFrame(this._currentRequestId);
        }
        this._loop();
        self.app.events.emit("start");
    }

    /**
     * Stop the loop.
     */
    stop() {
        this._enabled = false;
        if (this._currentRequestId) {
            window.cancelAnimationFrame(this._currentRequestId);
        }
        self.app.events.emit("stop");
    }

    /**
     * Add a callback.
     * @param {Function} callback
     */
    addCallback(callback) {
        this.callbacks.push(callback);
    }

    /**
     * Remove a callback.
     * @param {Function} callback
     */
    removeCallback(callback) {
        const index = this.callbacks.indexOf(callback);
        if (index !== -1) {
            this.callbacks.splice(index, 1);
        }
    }

    /**
     * The loop
     * Inspired by
     * https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe
     * @method _loop
     * @private
     * @param {Number} timestamp
     */
    _loop(now) {
        if (this._interval < 0) {
            return;
        }
        // Request animation frame => _loop executed every screen refresh
        this._currentRequestId = requestAnimationFrame(t => this._loop(t));

        // We execute the callbacks only if enough time has passed
        const correctedTimeSinceLastCall = now - this._lastLoopCorrectedTime;
        if (correctedTimeSinceLastCall > this._interval) {
            // Get ready for next frame by setting lastTime=now, but...
            // Also, adjust for interval not being multiple of 16.67
            this._lastLoopCorrectedTime = now - (correctedTimeSinceLastCall % this._interval);

            // actual time, for fps and deltaTime measurement
            const timeSinceLastCall = now - this.lastLoopTime;
            this.fps = 1000 / timeSinceLastCall;
            this.lastLoopTime = now;

            const loopInfo = {
                deltaTime: correctedTimeSinceLastCall,
                fps: this.fps,
                idle: this.idle,
            };

            // loop events
            self.app.events.emit("update", loopInfo);

            // loop callbacks
            for (let i = 0; i < this.callbacks.length; i++) {
                try {
                    this.callbacks[i](loopInfo);
                } catch (error) {
                    throw Error(error);
                }
            }
        }
    }


    // -- GETTERS SETTERS ---
    /**
     * Fps when the app is considered as active
     * To get a constant time interval between frames,
     * 60 must be a multiple of the fps
     * @param  {Number} activeFps
     */
    set activeFps(activeFps) {
        this._activeFps = activeFps;
        this.refreshIntervalValue();
    }

    get activeFps() {
        return this._activeFps;
    }

    /**
     * Fps when the app is considered as idle (no focus on windows)
     * @param  {Number} idleFps
     */
    set idleFps(idleFps) {
        this._idleFps = idleFps;
        this.refreshIntervalValue();
    }

    get idleFps() {
        return this._idleFps;
    }

    /**
     * Is the app considered as idle
     * @param  {Boolean} isIdle
     */
    set idle(isIdle) {
        this._idle = isIdle;
        this.refreshIntervalValue();
    }

    get idle() {
        return this._idle;
    }

    /**
     * Is the loop running
     * @return {Boolean}
     */
    get enabled() {
        return this._enabled;
    }
    //---------------------

    static FetchConfig() {
        return self.app.config;
    }

}
export default MainLoop;

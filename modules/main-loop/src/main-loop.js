import self from "../index";

/**
 * A loop...
 * Can be used to render 2d or 3d, or to do anything at a rather fixed time interval
 * It's using RequestAnimationFrame, so to get a constant time interval,
 * 60 must be a multiple of your desired fps
 */
class MainLoop {

    /**
     * @constructor
     */
    constructor() {
        const config = MainLoop.FetchConfig();

        // --- Internal parameters
        this.$data = {
            interval: 0,
            currentRequestId: null,
            lastLoopCorrectedTime: window.performance.now(),
            lastLoopTime: window.performance.now(),

            // with corresponding getters-setters or getters only :
            activeFps: config.get("activeFps") || -1,
            idleFps: config.get("idleFps") || 0,
            idle: false,
            enabled: false,
        };


        // --- Public parameters
        /**
         * Registered callbacks
         * @type {Array}
         */
        this.callbacks = [];

        /**
         * Current fps
         * @type {Number}
         */
        this.fps = this.activeFps;

        // Initialization
        this.initListeners();
        this.refreshIntervalValue();
        if (config.get("debug")) {
            this.initDebug();
        }
        self.app.events.emit("initialize");
    }

    /**
     * Refresh the wanted time interval between callbacks
     */
    refreshIntervalValue() {
        const epsilon = 0.01;
        if (this.$data.idle) {
            if (this.idleFps > 0) {
                this.$data.interval = (1000 / this.idleFps) - epsilon;
            } else if (this.idleFps === 0) {
                if (this.$data.currentRequestId) {
                    window.cancelAnimationFrame(this.$data.currentRequestId);
                }
            } else {
                this.$data.interval = -1;
            }
        } else if (this.activeFps > 0) {
            this.$data.interval = (1000 / this.activeFps) - epsilon;
        } else if (this.activeFps === 0) {
            if (this.$data.currentRequestId) {
                window.cancelAnimationFrame(this.$data.currentRequestId);
            }
        } else {
            this.$data.interval = -1;
        }
    }

    /**
     * Launch window listeners : lost of focus management
     */
    initListeners() {
        window.addEventListener("focus", () => {
            if (this.$data.currentRequestId) {
                window.cancelAnimationFrame(this.$data.currentRequestId);
            }
            if (this.enabled) {
                this.loop();
            }
            this.idle = false;
        });
        window.addEventListener("blur", () => {
            this.idle = true;
        });
    }

    /**
     * Add Debug callback to log loop info
     */
    initDebug() {
        this.addCallback((loopInfo) => {
            self.app.log("LoopInfos", JSON.stringify(loopInfo));
        });
    }


    /**
     * Start the loop.
     */
    start() {
        this.$data.enabled = true;
        if (this.$data.currentRequestId) {
            window.cancelAnimationFrame(this.$data.currentRequestId);
        }
        self.app.events.emit("start");
        if (!(this.idle && this.idleFps === 0)) {
            this.loop();
        }
    }

    /**
     * Stop the loop.
     */
    stop() {
        this.$data.enabled = false;
        if (this.$data.currentRequestId) {
            window.cancelAnimationFrame(this.$data.currentRequestId);
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
     * @method $data.loop
     * @private
     * @param {Number} timestamp
     */
    loop(now = this.$data.lastLoopTime) {
        // Request animation frame => $data.loop executed every screen refresh
        this.$data.currentRequestId = requestAnimationFrame(t => this.loop(t));

        // No limitation, the loop goes as fast as the screen refresh rate (if it can)
        if (this.$data.interval === -1) {
            this.update(now);
        } else {
            // Fps throttling :
            // We execute the callbacks only if enough time has passed
            const correctedTimeSinceLastCall = now - this.$data.lastLoopCorrectedTime;
            if (correctedTimeSinceLastCall >= this.$data.interval) {
                // Get ready for next frame by setting lastTime=now, but...
                // Also, adjust for interval not being multiple of 16.67
                this.$data.lastLoopCorrectedTime = now
                    - (correctedTimeSinceLastCall % this.$data.interval);
                this.update(now);
            }
        }
    }

    /**
     * Update function called in the loop :
     * - refresh fps and deltaTime values
     * - call the callback functions
     * - emit the update events
     * @param  {Object} loopInfo loop informations transmitted to the callbacks and by the event
     */
    update(now) {
        //  Fps
        const timeSinceLastCall = now - this.$data.lastLoopTime;
        this.fps = 1000 / timeSinceLastCall;
        this.$data.lastLoopTime = now;
        const loopInfo = {
            timeSinceLastCall,
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
                self.app.log.error(error);
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
        this.$data.activeFps = activeFps;
        this.refreshIntervalValue();
    }

    get activeFps() {
        return this.$data.activeFps;
    }

    /**
     * Fps when the app is considered as idle (no focus on windows)
     * @param  {Number} idleFps
     */
    set idleFps(idleFps) {
        this.$data.idleFps = idleFps;
        this.refreshIntervalValue();
    }

    get idleFps() {
        return this.$data.idleFps;
    }

    /**
     * Is the app considered as idle
     * @param  {Boolean} isIdle
     */
    set idle(isIdle) {
        this.$data.idle = isIdle;
        this.refreshIntervalValue();
    }

    get idle() {
        return this.$data.idle;
    }

    /**
     * Is the loop running
     * @return {Boolean}
     */
    get enabled() {
        return this.$data.enabled;
    }
    //---------------------

    static FetchConfig() {
        return self.app.config;
    }

}
export default MainLoop;

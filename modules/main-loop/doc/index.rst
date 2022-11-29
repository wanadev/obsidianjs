main-loop
==========

The **main-loop**  * module can be used to render 2d or 3d, or to do anything at a rather fixed time interval.
It's using RequestAnimationFrame, so to get a constant time interval, 60 must be a multiple of your desired fps.
Also, the fps cannot exceed the screen refresh rate for now.


Using This Module
-----------------

First add the module to your project::

    npm install --save @obsidianjs/main-loop

Then use it in your application (in your main ``index.js``)::

   const obsidian = require("@obsidianjs/obsidian");
   const mainLoop = require("@obsidianjs/main-loop");

   const app = obsidian("my-application");
   app.use(mainLoop);
   app.start();

You can add the idleFps, activeFps and debug config parameters to change this module behavior ::

    app.use(mainLoop, {
        config : {
            // The target fps when the loop is running normally (-1 by default => fps = screen refresh rate)
            activeFps: 30,

            // The target fps when the window is not focused (0 by default)
            idleFps: 5,

            // show loop information in the console (false by default)
            debug: true,
        }
    });

Require it in modules that need it::

   {
       name: "my-module",
       requires: ["main-loop"],

       load(app) {
           const {mainLoop} = app.modules;
           // ...
       },

       // ...

   }

Add some callbacks function to be executed inside the loop, like your render methods ::

    mainLoop.addCallback((loopInfo)=>{
        renderMyScene();
        console.log(JSON.stringify(loopInfo));
    })

Or just listen to the update event ::

       self.app.events.on("@main-loop.update",(loopInfo)=>{
           renderMyScene();
           console.log(JSON.stringify(loopInfo));
       });

Start and stop the loop when you need it ::

        mainLoop.start();
        // ........
        mainLoop.stop();

MainLoop API
-------------

.. js:autoclass:: modules/main-loop/src/main-loop.MainLoop
   :short-name:
   :members:

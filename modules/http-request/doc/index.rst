http-request
============

This modules integrates the obsidian-http-request_ library to the ObsidianJS
framework.

The **http-request** module allows to make HTTP requests (AJAX) ether directly
or through proxy (to workaround CORS issues).


Using This Module
-----------------

First add the module to your project::

    npm install --save @obsidianjs/http-request

Then use it in your application (in your main ``index.js``):

.. code-block:: javascript

   const obsidian = require("@obsidianjs/obsidian");
   const httpRequest = require("@obsidianjs/http-request");

   const app = obsidian("my-application");
   app.use(httpRequest);
   app.start();

Finally require it in modules that need it:

.. code-block:: javascript

   {
       name: "my-module",
       requires: ["http-request"],

       load(app) {
           const {httpRequest} = app.modules;
           // ...
       },

       // ...

   }


Module API
----------

Direct Requests
~~~~~~~~~~~~~~~

.. function:: httpRequest.getText(url)

   Simple function to get plain text data.

   :param string url: The URL of the file to download.
   :rtype: Promise.<string>

   ::

        httpRequest.getText("http://www.example.com/hello.txt")
            .then(function(result) {
                console.log(result);  // -> string
            })
            .catch(function(error) {
                console.error(error);
            });

.. function:: httpRequest.getJson(url)

   Simple function to get JSON data.

   :param string url: The URL of the file to download.
   :rtype: Promise.<Object|Array|string|number|boolean>

   ::

        httpRequest.getJson("http://www.example.com/hello.json")
            .then(function(result) {
                console.log(result);  // -> parsed JSON data
            })
            .catch(function(error) {
                console.error(error);
            });

.. function:: httpRequest.getRaw(url)

   Simple function to get binary data.

   :param string url: The URL of the file to download.
   :rtype: Promise.<Buffer> (Uint8Array with additional methods)

   ::

        httpRequest.getRaw("http://www.example.com/hello.zip")
            .then(function(result) {
                console.log(result);  // -> Buffer
            })
            .catch(function(error) {
                console.error(error);
            });

.. function:: httpRequest.request(url, params={})

   Make a configurable request.

   :param string url: The URL of the file to download.
   :param Object params: optional parameters.
   :param string params.method: The HTTP method for the request (``GET``,
                                ``POST``, ``PUT``,...) (optional, default:
                                ``GET``).
   :param Object params.headers: Custom header  for the request (optional,
                                 default: ``{}``).
   :param Buffer|null params.body: Body of the request (optional, default:
                                   ``null``).
   :rtype: Promise.<Buffer> (Uint8Array with additional methods)

   ::

        httpRequest.request("http://www.example.com/do-something", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "x-foo": "bar"
            },
            body: Buffer.from(JSON.stringify({foo: "bar"}))  // body must be a Buffer or null
        })
            .then(function(resultBuffer) {                   // response is also a Buffer
                var result = JSON.parse(resultBuffer.toString());
                console.log(result);
            })
            .catch(function(error) {
                console.error(error);
            });

Proxyfied Requests
~~~~~~~~~~~~~~~~~~

.. function:: httpRequest.getTextProxy(url, params={})

   Simple function to get plain text data through the proxy server.

   :param string url: The URL of the file to download.
   :param Object params: Additional parameter for the proxy.
   :param Object params.headers: Custom header  for the request (optional,
                                 default: ``{}``).
   :param Array params.allowedMimes: A list of mimetype the proxy is allowed
                                     to download for this request (optional,
                                     default: ``[]``).
   :rtype: Promise.<string>

   ::

        httpRequest.getTextProxy("http://www.example.com/hello.txt")
            .then(function(result) {
                console.log(result);  // -> string
            })
            .catch(function(error) {
                console.error(error);
            });

   ::

        httpRequest.getTextProxy("http://www.example.com/hello.txt", {
            headers: {
                "x-foo": "bar"
            },
            allowedMimes: [
                "text/plain",
                "application/x-yaml"
            ]
        }).then(...);

.. function:: httpRequest.getJsonProxy(url)

   Simple function to get JSON data through the proxy server.

   :param string url: The URL of the file to download.
   :param Object params: Additional parameter for the proxy.
   :param Object params.headers: Custom header  for the request (optional,
                                 default: ``{}``).
   :param Array params.allowedMimes: A list of mimetype the proxy is allowed
                                     to download for this request (optional,
                                     default: ``[]``).
   :rtype: Promise.<Object|Array|string|number|boolean>

   ::

        httpRequest.getJsonProxy("http://www.example.com/hello.json")
            .then(function(result) {
                console.log(result);  // -> parsed JSON data
            })
            .catch(function(error) {
                console.error(error);
            });

.. function:: httpRequest.getRawProxy(url)

   Simple function to get binary data through the proxy server.

   :param string url: The URL of the file to download.
   :param Object params: Additional parameter for the proxy.
   :param Object params.headers: Custom header  for the request (optional,
                                 default: ``{}``).
   :param Array params.allowedMimes: A list of mimetype the proxy is allowed
                                     to download for this request (optional,
                                     default: ``[]``).
   :rtype: Promise.<Buffer> (Uint8Array with additional methods)

   ::

        httpRequest.getRawProxy("http://www.example.com/hello.zip")
            .then(function(result) {
                console.log(result);  // -> Buffer
            })
            .catch(function(error) {
                console.error(error);
            });

.. function:: httpRequest.request(url, params={})

   Make a configurable request through the proxy server.

   :param string url: The URL of the file to download.
   :param Object params: Additional parameter for the proxy.
   :param string params.method: The HTTP method for the request (``GET``,
                                ``POST``, ``PUT``,...) (optional, default:
                                ``GET``).
   :param Object params.headers: Custom header  for the request (optional,
                                 default: ``{}``).
   :param Buffer|null params.body: Body of the request (optional, default:
                                   ``null``).
   :param Array params.allowedMimes: A list of mimetype the proxy is allowed
                                     to download for this request (optional,
                                     default: ``[]``).
   :rtype: Promise.<Buffer> (Uint8Array with additional methods)

   ::

        httpRequest.requestProxy("http://www.example.com/do-something", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "x-foo": "bar"
            },
            body: Buffer.from(JSON.stringify({foo: "bar"})),  // body must be a Buffer or null
            allowedMimes: ["application/json"]                // Only allows JSON response
        })
            .then(function(resultBuffer) {                    // response is also a Buffer
                var result = JSON.parse(resultBuffer.toString());
                console.log(result);
            })
            .catch(function(error) {
                console.error(error);
            });



Server-side Middleware
----------------------

TODO



.. _obsidian-http-request: https://wanadev.github.io/obsidian-http-request/

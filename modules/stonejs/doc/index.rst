stonejs
===================

This modules integrates the stonejs library to the ObsidianJS
framework.

The purpose of **stonejs** is to provide internationalization to your Javascript application.


Using This Module
-----------------

First add the module to your project::

    npm install --save @obsidianjs/stonejs

Then use it in your application (in your main ``index.js``)::

   const obsidian = require("@obsidianjs/obsidian");
   const httpRequest = require("@obsidianjs/stonejs");

   const app = obsidian("my-application");
   app.use(stonejs);
   app.start();


Config
---------

* ``initialLang`` The initial langage of the application default to "C"


Stonejs API
----------------

Functions
~~~~~~~~~

.. function:: Stone.gettext(<string>[, replacements])

    Translates the given string to the current language.

    :param string: The string to translate.
    :param replacements: an object containing replacements for the string (optional, see example below).

    :rtype: string: The translated string.

    ::

        var text1 = Stone.gettext("Hello World");
        var text2 = Stone.gettext("Hello {name}", {name: "John"});

.. function:: Stone.lazyGettext(<string> [, replacements])

    Same as Stone.gettext but returns a Stone.LazyString instead of a String.

.. function:: Stone.addCatalogs(<catalogs>)

    Adds one (or more if you merged multiple languages into one file) string catalog.

    :param catalogs: An object containing translated strings (catalogs can be built using [stronejs-tools][]).

    ::

        Stone.addCatalogs(catalogs);

.. function:: Stone.getLocale()

Returns the current locale (aka target language for the gettext and lazyGettext functions). The default locale is "c" (it means no translation: simply returns the string as it is in the source).

    :rtype: string: The current locale.

    ::

        var locale = Stone.getLocale();
        // "c", "en", "fr", ...

.. function:: Stone.setLocale(<locale>)

    Defines the current locale (aka the target language for the gettext and lazyGettext functions).

    NOTE: You can use the setBestMatchingLocale function to set the best language for the user.

    :param locale: The locale code (e.g. en, fr, ...)

    ::

        Stone.setLocale("fr");

.. function:: stone.setBestMatchingLocale([locales]);

    Find and set the best language for the user (depending on available catalogs and given language list).

    :param locales: (optional) string or array of string (e.g. "fr", ["fr", "fr_FR", "en_US"]).

    ::

        Stone.setBestMatchingLocale();  // Automaticaly set the best language (from informations given by the browser)
        setBestMatchingLocale("fr");    // Finds the catalog that best match "fr" ("fr", "fr_FR", fr_*,...)
        setBestMatchingLocale(["fr", "en_US", "en_UK"]);    // Finds the best available catalog from the given list

.. function:: Stone.findBestMatchingLocale([locales], [catalogs])

    Find and return the given locale that best matches the given catalogs.

    :param locales: string or array of string (e.g. "fr", ["fr", "fr_FR", "en_US"]).
    :param catalogs: array of string (e.g. ["fr_FR", "en"]).

    ::

        Stone.findBestMatchingLocale(["fr"], ["pt_BR", "fr_CA", "fr_FR"]);  // -> "fr_FR"

.. function:: Stone.guessUserLanguage()

    Tries to guess the user language (based on the browser's preferred languages).

    :rtype: string: The user's language.

    ::

        var locale = Stone.guessUserLanguage();

.. function:: Stone.enableDomScan(<enable>)

    Allows Stone.js to scan all the DOM to find translatable strings (and to translate them).

    :param enable: Enable the scan of the DOM if true, disable it otherwise.

    ::

        Stone.enableDomScan(true);

.. function:: Stone.updateDomTranslation()

    Updates the DOM translation if DOM scan was enabled with Stone.enableDomScan (re-scan and re-translate all strings).

.. function:: Stone.LazyString (class)

    Stone.LazyString is an object returned by the Stone.lazyGettext function. It behaves like a standard String object (same API) but its value changes if you change the locale with Stone.setLocale function.

    This is useful when you have to define translatable strings before the string catalog was loaded, or to automatically re-translate strings each time the locale is changed.

    You can find an example of its use in the PhotonUI documentation:

    http://wanadev.github.io/PhotonUI/doc/widgets/translation.html


Events
~~~~~~

    stonejs-locale-changed, newLocale

        This event is fired each time the locale changes (using the Stone.setLocale function).

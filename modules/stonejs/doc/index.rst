stonejs
=======

This modules integrates the stonejs library to the ObsidianJS framework.

The purpose of **stonejs** is to provide internationalization to your
Javascript application.


Using This Module
-----------------

First add the module to your project::

    npm install --save @obsidianjs/stonejs

Then use it in your application (in your main ``index.js``)::

   const obsidian = require("@obsidianjs/obsidian");
   const stonejs = require("@obsidianjs/stonejs");

   const app = obsidian("my-application");
   app.use(stonejs);
   app.start();


Config
------

* ``initialLang`` The initial langage of the application default to "``C``"


Stonejs API
-----------

Functions
~~~~~~~~~

.. function:: stonejs.gettext(string, replacements={})

    Translates the given string to the current language.

    :param string string: The string to translate.
    :param Object replacements: an object containing replacements for the string (optional, see example below).

    :rtype: string
    :returns: The translated string.

    ::

        var text1 = stonejs.gettext("Hello World");
        var text2 = stonejs.gettext("Hello {name}", {name: "John"});

    .. NOTE::

       You may not use this function from this module. It is better to import
       direclty stonejs and using it this way::

          const _ = require("stonejs").gettext

          var text1 = _("Hello World");

.. function:: stonejs.lazyGettext(string, replacements={})

    Same as stonejs.gettext but returns a :js:class:`stonejs.LazyString`
    instead of a String.

    .. NOTE::

       You may not use this function from this module. It is better to import
       direclty stonejs and using it this way::

          const _ = require("stonejs").lazyGettext

          var text1 = _("Hello World");

.. function:: stonejs.addCatalogs(catalogs)

    Adds one (or more if you merged multiple languages into one file) string catalog.

    :param Object catalogs: An object containing translated strings (catalogs
                            can be built using `stronejs-tools
                            <https://github.com/flozz/stonejs-tools>`_).

    ::

        stonejs.addCatalogs(catalogs);

.. function:: stonejs.getLocale()

    Returns the current locale (aka target language for the gettext and
    lazyGettext functions). The default locale is ``"C"`` (it means no
    translation: simply returns the string as it is in the source).

    :rtype: string
    :returns: The current locale.

    ::

        var locale = stonejs.getLocale();
        // "c", "en", "fr", ...

.. function:: stonejs.setLocale(locale)

    Defines the current locale (aka the target language for the gettext and
    lazyGettext functions).

    .. NOTE::

       You can use the :js:func:`stonejs.setBestMatchingLocale` function to set
       the best language for the user.

    :param string locale: The locale code (e.g. ``"en"``, ``"fr"``, ...)

    ::

        stonejs.setLocale("fr");

.. function:: stonejs.setBestMatchingLocale(locales)

    Find and set the best language for the user (depending on available
    catalogs and given language list).

    :param string|Array locales: (optional) The locale(s) to choose from (e.g.
                                 ``"fr"``, ``["fr", "fr_FR", "en_US"]``).

    ::

        stonejs.setBestMatchingLocale();  // Automaticaly set the best language (from informations given by the browser)
        setBestMatchingLocale("fr");    // Finds the catalog that best match "fr" ("fr", "fr_FR", fr_*,...)
        setBestMatchingLocale(["fr", "en_US", "en_UK"]);    // Finds the best available catalog from the given list

.. function:: stonejs.findBestMatchingLocale(locales, catalogs)

    Find and return the given locale that best matches the given catalogs.

    :param string|Array locales: The locale(s) to choose from (e.g. ``"fr"``, ``["fr", "fr_FR", "en_US"]``).
    :param Array catalogs: the list of available catalogs (e.g. ``["fr_FR", "en"]``).

    ::

        stonejs.findBestMatchingLocale(["fr"], ["pt_BR", "fr_CA", "fr_FR"]);  // -> "fr_FR"

.. function:: stonejs.guessUserLanguage()

    Tries to guess the user language (based on the browser's preferred languages).

    :rtype: string:
    :returns: The user's language.

    ::

        var locale = stonejs.guessUserLanguage();

.. function:: stonejs.enableDomScan(enable)

    Allows stonejs.js to scan all the DOM to find translatable strings (and to translate them).

    :param boolean enable: Enable the scan of the DOM if true, disable it otherwise.

    ::

        stonejs.enableDomScan(true);

    .. WARNING::

       This feature should probably not be used with ObsidianJS projects.

.. function:: stonejs.updateDomTranslation()

    Updates the DOM translation if DOM scan was enabled with
    stonejs.enableDomScan (re-scan and re-translate all strings).

    .. WARNING::

       This method should probably not be used with ObsidianJS projects.


The LazyString Class
~~~~~~~~~~~~~~~~~~~~

.. class:: stonejs.LazyString(string)

    ``stonejs.LazyString`` is an object returned by the :js:func:`stonejs.lazyGettext`
    function. It behaves like a standard String object (same API) but its value
    changes if you change the locale with stonejs.setLocale function.

    This is useful when you have to define translatable strings before the
    string catalog was loaded, or to automatically re-translate strings each
    time the locale is changed.

    You can find an example of its use in the PhotonUI documentation:

    http://wanadev.github.io/PhotonUI/doc/widgets/translation.html


Events
~~~~~~

stonejs-locale-changed, newLocale

    This event is fired each time the locale changes (using the stonejs.setLocale function).

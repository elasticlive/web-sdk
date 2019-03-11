(function(l, i, v, e) {
  v = l.createElement(i);
  v.async = 1;
  v.src =
    "//" +
    (location.host || "localhost").split(":")[0] +
    ":35729/livereload.js?snipver=1";
  e = l.getElementsByTagName(i)[0];
  e.parentNode.insertBefore(v, e);
})(document, "script");
(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? (module.exports = factory(
        require("stream"),
        require("http"),
        require("url"),
        require("https"),
        require("zlib")
      ))
    : typeof define === "function" && define.amd
    ? define(["stream", "http", "url", "https", "zlib"], factory)
    : ((global = global || self),
      (global.ELive = factory(
        global.Stream,
        global.http,
        global.Url,
        global.https,
        global.zlib
      )));
})(this, function(Stream, http, Url, https, zlib) {
  "use strict";

  const __VERSION__ = "3.2.0";
  const __ENV__ = "dev";

  Stream =
    Stream && Stream.hasOwnProperty("default") ? Stream["default"] : Stream;
  http = http && http.hasOwnProperty("default") ? http["default"] : http;
  Url = Url && Url.hasOwnProperty("default") ? Url["default"] : Url;
  https = https && https.hasOwnProperty("default") ? https["default"] : https;
  zlib = zlib && zlib.hasOwnProperty("default") ? zlib["default"] : zlib;

  var commonjsGlobal =
    typeof window !== "undefined"
      ? window
      : typeof global !== "undefined"
      ? global
      : typeof self !== "undefined"
      ? self
      : {};

  function createCommonjsModule(fn, module) {
    return (
      (module = { exports: {} }), fn(module, module.exports), module.exports
    );
  }

  var platform = createCommonjsModule(function(module, exports) {
    (function() {
      /** Used to determine if values are of the language type `Object`. */
      var objectTypes = {
        function: true,
        object: true
      };

      /** Used as a reference to the global object. */
      var root = (objectTypes[typeof window] && window) || this;

      /** Detect free variable `exports`. */
      var freeExports = exports;

      /** Detect free variable `module`. */
      var freeModule = module && !module.nodeType && module;

      /** Detect free variable `global` from Node.js or Browserified code and use it as `root`. */
      var freeGlobal =
        freeExports &&
        freeModule &&
        typeof commonjsGlobal == "object" &&
        commonjsGlobal;
      if (
        freeGlobal &&
        (freeGlobal.global === freeGlobal ||
          freeGlobal.window === freeGlobal ||
          freeGlobal.self === freeGlobal)
      ) {
        root = freeGlobal;
      }

      /**
       * Used as the maximum length of an array-like object.
       * See the [ES6 spec](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength)
       * for more details.
       */
      var maxSafeInteger = Math.pow(2, 53) - 1;

      /** Regular expression to detect Opera. */
      var reOpera = /\bOpera/;

      /** Used for native method references. */
      var objectProto = Object.prototype;

      /** Used to check for own properties of an object. */
      var hasOwnProperty = objectProto.hasOwnProperty;

      /** Used to resolve the internal `[[Class]]` of values. */
      var toString = objectProto.toString;

      /*--------------------------------------------------------------------------*/

      /**
       * Capitalizes a string value.
       *
       * @private
       * @param {string} string The string to capitalize.
       * @returns {string} The capitalized string.
       */
      function capitalize(string) {
        string = String(string);
        return string.charAt(0).toUpperCase() + string.slice(1);
      }

      /**
       * A utility function to clean up the OS name.
       *
       * @private
       * @param {string} os The OS name to clean up.
       * @param {string} [pattern] A `RegExp` pattern matching the OS name.
       * @param {string} [label] A label for the OS.
       */
      function cleanupOS(os, pattern, label) {
        // Platform tokens are defined at:
        // http://msdn.microsoft.com/en-us/library/ms537503(VS.85).aspx
        // http://web.archive.org/web/20081122053950/http://msdn.microsoft.com/en-us/library/ms537503(VS.85).aspx
        var data = {
          "10.0": "10",
          "6.4": "10 Technical Preview",
          "6.3": "8.1",
          "6.2": "8",
          "6.1": "Server 2008 R2 / 7",
          "6.0": "Server 2008 / Vista",
          "5.2": "Server 2003 / XP 64-bit",
          "5.1": "XP",
          "5.01": "2000 SP1",
          "5.0": "2000",
          "4.0": "NT",
          "4.90": "ME"
        };
        // Detect Windows version from platform tokens.
        if (
          pattern &&
          label &&
          /^Win/i.test(os) &&
          !/^Windows Phone /i.test(os) &&
          (data = data[/[\d.]+$/.exec(os)])
        ) {
          os = "Windows " + data;
        }
        // Correct character case and cleanup string.
        os = String(os);

        if (pattern && label) {
          os = os.replace(RegExp(pattern, "i"), label);
        }

        os = format(
          os
            .replace(/ ce$/i, " CE")
            .replace(/\bhpw/i, "web")
            .replace(/\bMacintosh\b/, "Mac OS")
            .replace(/_PowerPC\b/i, " OS")
            .replace(/\b(OS X) [^ \d]+/i, "$1")
            .replace(/\bMac (OS X)\b/, "$1")
            .replace(/\/(\d)/, " $1")
            .replace(/_/g, ".")
            .replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, "")
            .replace(/\bx86\.64\b/gi, "x86_64")
            .replace(/\b(Windows Phone) OS\b/, "$1")
            .replace(/\b(Chrome OS \w+) [\d.]+\b/, "$1")
            .split(" on ")[0]
        );

        return os;
      }

      /**
       * An iteration utility for arrays and objects.
       *
       * @private
       * @param {Array|Object} object The object to iterate over.
       * @param {Function} callback The function called per iteration.
       */
      function each(object, callback) {
        var index = -1,
          length = object ? object.length : 0;

        if (
          typeof length == "number" &&
          length > -1 &&
          length <= maxSafeInteger
        ) {
          while (++index < length) {
            callback(object[index], index, object);
          }
        } else {
          forOwn(object, callback);
        }
      }

      /**
       * Trim and conditionally capitalize string values.
       *
       * @private
       * @param {string} string The string to format.
       * @returns {string} The formatted string.
       */
      function format(string) {
        string = trim(string);
        return /^(?:webOS|i(?:OS|P))/.test(string)
          ? string
          : capitalize(string);
      }

      /**
       * Iterates over an object's own properties, executing the `callback` for each.
       *
       * @private
       * @param {Object} object The object to iterate over.
       * @param {Function} callback The function executed per own property.
       */
      function forOwn(object, callback) {
        for (var key in object) {
          if (hasOwnProperty.call(object, key)) {
            callback(object[key], key, object);
          }
        }
      }

      /**
       * Gets the internal `[[Class]]` of a value.
       *
       * @private
       * @param {*} value The value.
       * @returns {string} The `[[Class]]`.
       */
      function getClassOf(value) {
        return value == null
          ? capitalize(value)
          : toString.call(value).slice(8, -1);
      }

      /**
       * Host objects can return type values that are different from their actual
       * data type. The objects we are concerned with usually return non-primitive
       * types of "object", "function", or "unknown".
       *
       * @private
       * @param {*} object The owner of the property.
       * @param {string} property The property to check.
       * @returns {boolean} Returns `true` if the property value is a non-primitive, else `false`.
       */
      function isHostType(object, property) {
        var type = object != null ? typeof object[property] : "number";
        return (
          !/^(?:boolean|number|string|undefined)$/.test(type) &&
          (type == "object" ? !!object[property] : true)
        );
      }

      /**
       * Prepares a string for use in a `RegExp` by making hyphens and spaces optional.
       *
       * @private
       * @param {string} string The string to qualify.
       * @returns {string} The qualified string.
       */
      function qualify(string) {
        return String(string).replace(/([ -])(?!$)/g, "$1?");
      }

      /**
       * A bare-bones `Array#reduce` like utility function.
       *
       * @private
       * @param {Array} array The array to iterate over.
       * @param {Function} callback The function called per iteration.
       * @returns {*} The accumulated result.
       */
      function reduce(array, callback) {
        var accumulator = null;
        each(array, function(value, index) {
          accumulator = callback(accumulator, value, index, array);
        });
        return accumulator;
      }

      /**
       * Removes leading and trailing whitespace from a string.
       *
       * @private
       * @param {string} string The string to trim.
       * @returns {string} The trimmed string.
       */
      function trim(string) {
        return String(string).replace(/^ +| +$/g, "");
      }

      /*--------------------------------------------------------------------------*/

      /**
       * Creates a new platform object.
       *
       * @memberOf platform
       * @param {Object|string} [ua=navigator.userAgent] The user agent string or
       *  context object.
       * @returns {Object} A platform object.
       */
      function parse(ua) {
        /** The environment context object. */
        var context = root;

        /** Used to flag when a custom context is provided. */
        var isCustomContext =
          ua && typeof ua == "object" && getClassOf(ua) != "String";

        // Juggle arguments.
        if (isCustomContext) {
          context = ua;
          ua = null;
        }

        /** Browser navigator object. */
        var nav = context.navigator || {};

        /** Browser user agent string. */
        var userAgent = nav.userAgent || "";

        ua || (ua = userAgent);

        /** Used to detect if browser is like Chrome. */
        var likeChrome = isCustomContext
          ? !!nav.likeChrome
          : /\bChrome\b/.test(ua) && !/internal|\n/i.test(toString.toString());

        /** Internal `[[Class]]` value shortcuts. */
        var objectClass = "Object",
          airRuntimeClass = isCustomContext
            ? objectClass
            : "ScriptBridgingProxyObject",
          enviroClass = isCustomContext ? objectClass : "Environment",
          javaClass =
            isCustomContext && context.java
              ? "JavaPackage"
              : getClassOf(context.java),
          phantomClass = isCustomContext ? objectClass : "RuntimeObject";

        /** Detect Java environments. */
        var java = /\bJava/.test(javaClass) && context.java;

        /** Detect Rhino. */
        var rhino = java && getClassOf(context.environment) == enviroClass;

        /** A character to represent alpha. */
        var alpha = java ? "a" : "\u03b1";

        /** A character to represent beta. */
        var beta = java ? "b" : "\u03b2";

        /** Browser document object. */
        var doc = context.document || {};

        /**
         * Detect Opera browser (Presto-based).
         * http://www.howtocreate.co.uk/operaStuff/operaObject.html
         * http://dev.opera.com/articles/view/opera-mini-web-content-authoring-guidelines/#operamini
         */
        var opera = context.operamini || context.opera;

        /** Opera `[[Class]]`. */
        var operaClass = reOpera.test(
          (operaClass =
            isCustomContext && opera ? opera["[[Class]]"] : getClassOf(opera))
        )
          ? operaClass
          : (opera = null);

        /*------------------------------------------------------------------------*/

        /** Temporary variable used over the script's lifetime. */
        var data;

        /** The CPU architecture. */
        var arch = ua;

        /** Platform description array. */
        var description = [];

        /** Platform alpha/beta indicator. */
        var prerelease = null;

        /** A flag to indicate that environment features should be used to resolve the platform. */
        var useFeatures = ua == userAgent;

        /** The browser/environment version. */
        var version =
          useFeatures &&
          opera &&
          typeof opera.version == "function" &&
          opera.version();

        /** A flag to indicate if the OS ends with "/ Version" */
        var isSpecialCasedOS;

        /* Detectable layout engines (order is important). */
        var layout = getLayout([
          { label: "EdgeHTML", pattern: "Edge" },
          "Trident",
          { label: "WebKit", pattern: "AppleWebKit" },
          "iCab",
          "Presto",
          "NetFront",
          "Tasman",
          "KHTML",
          "Gecko"
        ]);

        /* Detectable browser names (order is important). */
        var name = getName([
          "Adobe AIR",
          "Arora",
          "Avant Browser",
          "Breach",
          "Camino",
          "Electron",
          "Epiphany",
          "Fennec",
          "Flock",
          "Galeon",
          "GreenBrowser",
          "iCab",
          "Iceweasel",
          "K-Meleon",
          "Konqueror",
          "Lunascape",
          "Maxthon",
          { label: "Microsoft Edge", pattern: "Edge" },
          "Midori",
          "Nook Browser",
          "PaleMoon",
          "PhantomJS",
          "Raven",
          "Rekonq",
          "RockMelt",
          { label: "Samsung Internet", pattern: "SamsungBrowser" },
          "SeaMonkey",
          { label: "Silk", pattern: "(?:Cloud9|Silk-Accelerated)" },
          "Sleipnir",
          "SlimBrowser",
          { label: "SRWare Iron", pattern: "Iron" },
          "Sunrise",
          "Swiftfox",
          "Waterfox",
          "WebPositive",
          "Opera Mini",
          { label: "Opera Mini", pattern: "OPiOS" },
          "Opera",
          { label: "Opera", pattern: "OPR" },
          "Chrome",
          { label: "Chrome Mobile", pattern: "(?:CriOS|CrMo)" },
          { label: "Firefox", pattern: "(?:Firefox|Minefield)" },
          { label: "Firefox for iOS", pattern: "FxiOS" },
          { label: "IE", pattern: "IEMobile" },
          { label: "IE", pattern: "MSIE" },
          "Safari"
        ]);

        /* Detectable products (order is important). */
        var product = getProduct([
          { label: "BlackBerry", pattern: "BB10" },
          "BlackBerry",
          { label: "Galaxy S", pattern: "GT-I9000" },
          { label: "Galaxy S2", pattern: "GT-I9100" },
          { label: "Galaxy S3", pattern: "GT-I9300" },
          { label: "Galaxy S4", pattern: "GT-I9500" },
          { label: "Galaxy S5", pattern: "SM-G900" },
          { label: "Galaxy S6", pattern: "SM-G920" },
          { label: "Galaxy S6 Edge", pattern: "SM-G925" },
          { label: "Galaxy S7", pattern: "SM-G930" },
          { label: "Galaxy S7 Edge", pattern: "SM-G935" },
          "Google TV",
          "Lumia",
          "iPad",
          "iPod",
          "iPhone",
          "Kindle",
          { label: "Kindle Fire", pattern: "(?:Cloud9|Silk-Accelerated)" },
          "Nexus",
          "Nook",
          "PlayBook",
          "PlayStation Vita",
          "PlayStation",
          "TouchPad",
          "Transformer",
          { label: "Wii U", pattern: "WiiU" },
          "Wii",
          "Xbox One",
          { label: "Xbox 360", pattern: "Xbox" },
          "Xoom"
        ]);

        /* Detectable manufacturers. */
        var manufacturer = getManufacturer({
          Apple: { iPad: 1, iPhone: 1, iPod: 1 },
          Archos: {},
          Amazon: { Kindle: 1, "Kindle Fire": 1 },
          Asus: { Transformer: 1 },
          "Barnes & Noble": { Nook: 1 },
          BlackBerry: { PlayBook: 1 },
          Google: { "Google TV": 1, Nexus: 1 },
          HP: { TouchPad: 1 },
          HTC: {},
          LG: {},
          Microsoft: { Xbox: 1, "Xbox One": 1 },
          Motorola: { Xoom: 1 },
          Nintendo: { "Wii U": 1, Wii: 1 },
          Nokia: { Lumia: 1 },
          Samsung: {
            "Galaxy S": 1,
            "Galaxy S2": 1,
            "Galaxy S3": 1,
            "Galaxy S4": 1
          },
          Sony: { PlayStation: 1, "PlayStation Vita": 1 }
        });

        /* Detectable operating systems (order is important). */
        var os = getOS([
          "Windows Phone",
          "Android",
          "CentOS",
          { label: "Chrome OS", pattern: "CrOS" },
          "Debian",
          "Fedora",
          "FreeBSD",
          "Gentoo",
          "Haiku",
          "Kubuntu",
          "Linux Mint",
          "OpenBSD",
          "Red Hat",
          "SuSE",
          "Ubuntu",
          "Xubuntu",
          "Cygwin",
          "Symbian OS",
          "hpwOS",
          "webOS ",
          "webOS",
          "Tablet OS",
          "Tizen",
          "Linux",
          "Mac OS X",
          "Macintosh",
          "Mac",
          "Windows 98;",
          "Windows "
        ]);

        /*------------------------------------------------------------------------*/

        /**
         * Picks the layout engine from an array of guesses.
         *
         * @private
         * @param {Array} guesses An array of guesses.
         * @returns {null|string} The detected layout engine.
         */
        function getLayout(guesses) {
          return reduce(guesses, function(result, guess) {
            return (
              result ||
              (RegExp(
                "\\b" + (guess.pattern || qualify(guess)) + "\\b",
                "i"
              ).exec(ua) &&
                (guess.label || guess))
            );
          });
        }

        /**
         * Picks the manufacturer from an array of guesses.
         *
         * @private
         * @param {Array} guesses An object of guesses.
         * @returns {null|string} The detected manufacturer.
         */
        function getManufacturer(guesses) {
          return reduce(guesses, function(result, value, key) {
            // Lookup the manufacturer by product or scan the UA for the manufacturer.
            return (
              result ||
              ((value[product] ||
                value[/^[a-z]+(?: +[a-z]+\b)*/i.exec(product)] ||
                RegExp("\\b" + qualify(key) + "(?:\\b|\\w*\\d)", "i").exec(
                  ua
                )) &&
                key)
            );
          });
        }

        /**
         * Picks the browser name from an array of guesses.
         *
         * @private
         * @param {Array} guesses An array of guesses.
         * @returns {null|string} The detected browser name.
         */
        function getName(guesses) {
          return reduce(guesses, function(result, guess) {
            return (
              result ||
              (RegExp(
                "\\b" + (guess.pattern || qualify(guess)) + "\\b",
                "i"
              ).exec(ua) &&
                (guess.label || guess))
            );
          });
        }

        /**
         * Picks the OS name from an array of guesses.
         *
         * @private
         * @param {Array} guesses An array of guesses.
         * @returns {null|string} The detected OS name.
         */
        function getOS(guesses) {
          return reduce(guesses, function(result, guess) {
            var pattern = guess.pattern || qualify(guess);
            if (
              !result &&
              (result = RegExp(
                "\\b" + pattern + "(?:/[\\d.]+|[ \\w.]*)",
                "i"
              ).exec(ua))
            ) {
              result = cleanupOS(result, pattern, guess.label || guess);
            }
            return result;
          });
        }

        /**
         * Picks the product name from an array of guesses.
         *
         * @private
         * @param {Array} guesses An array of guesses.
         * @returns {null|string} The detected product name.
         */
        function getProduct(guesses) {
          return reduce(guesses, function(result, guess) {
            var pattern = guess.pattern || qualify(guess);
            if (
              !result &&
              (result =
                RegExp("\\b" + pattern + " *\\d+[.\\w_]*", "i").exec(ua) ||
                RegExp("\\b" + pattern + " *\\w+-[\\w]*", "i").exec(ua) ||
                RegExp(
                  "\\b" +
                    pattern +
                    "(?:; *(?:[a-z]+[_-])?[a-z]+\\d+|[^ ();-]*)",
                  "i"
                ).exec(ua))
            ) {
              // Split by forward slash and append product version if needed.
              if (
                (result = String(
                  guess.label && !RegExp(pattern, "i").test(guess.label)
                    ? guess.label
                    : result
                ).split("/"))[1] &&
                !/[\d.]+/.test(result[0])
              ) {
                result[0] += " " + result[1];
              }
              // Correct character case and cleanup string.
              guess = guess.label || guess;
              result = format(
                result[0]
                  .replace(RegExp(pattern, "i"), guess)
                  .replace(RegExp("; *(?:" + guess + "[_-])?", "i"), " ")
                  .replace(RegExp("(" + guess + ")[-_.]?(\\w)", "i"), "$1 $2")
              );
            }
            return result;
          });
        }

        /**
         * Resolves the version using an array of UA patterns.
         *
         * @private
         * @param {Array} patterns An array of UA patterns.
         * @returns {null|string} The detected version.
         */
        function getVersion(patterns) {
          return reduce(patterns, function(result, pattern) {
            return (
              result ||
              (RegExp(
                pattern +
                  "(?:-[\\d.]+/|(?: for [\\w-]+)?[ /-])([\\d.]+[^ ();/_-]*)",
                "i"
              ).exec(ua) || 0)[1] ||
              null
            );
          });
        }

        /**
         * Returns `platform.description` when the platform object is coerced to a string.
         *
         * @name toString
         * @memberOf platform
         * @returns {string} Returns `platform.description` if available, else an empty string.
         */
        function toStringPlatform() {
          return this.description || "";
        }

        /*------------------------------------------------------------------------*/

        // Convert layout to an array so we can add extra details.
        layout && (layout = [layout]);

        // Detect product names that contain their manufacturer's name.
        if (manufacturer && !product) {
          product = getProduct([manufacturer]);
        }
        // Clean up Google TV.
        if ((data = /\bGoogle TV\b/.exec(product))) {
          product = data[0];
        }
        // Detect simulators.
        if (/\bSimulator\b/i.test(ua)) {
          product = (product ? product + " " : "") + "Simulator";
        }
        // Detect Opera Mini 8+ running in Turbo/Uncompressed mode on iOS.
        if (name == "Opera Mini" && /\bOPiOS\b/.test(ua)) {
          description.push("running in Turbo/Uncompressed mode");
        }
        // Detect IE Mobile 11.
        if (name == "IE" && /\blike iPhone OS\b/.test(ua)) {
          data = parse(ua.replace(/like iPhone OS/, ""));
          manufacturer = data.manufacturer;
          product = data.product;
        }
        // Detect iOS.
        else if (/^iP/.test(product)) {
          name || (name = "Safari");
          os =
            "iOS" +
            ((data = / OS ([\d_]+)/i.exec(ua))
              ? " " + data[1].replace(/_/g, ".")
              : "");
        }
        // Detect Kubuntu.
        else if (name == "Konqueror" && !/buntu/i.test(os)) {
          os = "Kubuntu";
        }
        // Detect Android browsers.
        else if (
          (manufacturer &&
            manufacturer != "Google" &&
            ((/Chrome/.test(name) && !/\bMobile Safari\b/i.test(ua)) ||
              /\bVita\b/.test(product))) ||
          (/\bAndroid\b/.test(os) &&
            /^Chrome/.test(name) &&
            /\bVersion\//i.test(ua))
        ) {
          name = "Android Browser";
          os = /\bAndroid\b/.test(os) ? os : "Android";
        }
        // Detect Silk desktop/accelerated modes.
        else if (name == "Silk") {
          if (!/\bMobi/i.test(ua)) {
            os = "Android";
            description.unshift("desktop mode");
          }
          if (/Accelerated *= *true/i.test(ua)) {
            description.unshift("accelerated");
          }
        }
        // Detect PaleMoon identifying as Firefox.
        else if (
          name == "PaleMoon" &&
          (data = /\bFirefox\/([\d.]+)\b/.exec(ua))
        ) {
          description.push("identifying as Firefox " + data[1]);
        }
        // Detect Firefox OS and products running Firefox.
        else if (
          name == "Firefox" &&
          (data = /\b(Mobile|Tablet|TV)\b/i.exec(ua))
        ) {
          os || (os = "Firefox OS");
          product || (product = data[1]);
        }
        // Detect false positives for Firefox/Safari.
        else if (
          !name ||
          (data =
            !/\bMinefield\b/i.test(ua) && /\b(?:Firefox|Safari)\b/.exec(name))
        ) {
          // Escape the `/` for Firefox 1.
          if (
            name &&
            !product &&
            /[\/,]|^[^(]+?\)/.test(ua.slice(ua.indexOf(data + "/") + 8))
          ) {
            // Clear name of false positives.
            name = null;
          }
          // Reassign a generic name.
          if (
            (data = product || manufacturer || os) &&
            (product ||
              manufacturer ||
              /\b(?:Android|Symbian OS|Tablet OS|webOS)\b/.test(os))
          ) {
            name =
              /[a-z]+(?: Hat)?/i.exec(/\bAndroid\b/.test(os) ? os : data) +
              " Browser";
          }
        }
        // Add Chrome version to description for Electron.
        else if (
          name == "Electron" &&
          (data = (/\bChrome\/([\d.]+)\b/.exec(ua) || 0)[1])
        ) {
          description.push("Chromium " + data);
        }
        // Detect non-Opera (Presto-based) versions (order is important).
        if (!version) {
          version = getVersion([
            "(?:Cloud9|CriOS|CrMo|Edge|FxiOS|IEMobile|Iron|Opera ?Mini|OPiOS|OPR|Raven|SamsungBrowser|Silk(?!/[\\d.]+$))",
            "Version",
            qualify(name),
            "(?:Firefox|Minefield|NetFront)"
          ]);
        }
        // Detect stubborn layout engines.
        if (
          (data =
            (layout == "iCab" && parseFloat(version) > 3 && "WebKit") ||
            (/\bOpera\b/.test(name) &&
              (/\bOPR\b/.test(ua) ? "Blink" : "Presto")) ||
            (/\b(?:Midori|Nook|Safari)\b/i.test(ua) &&
              !/^(?:Trident|EdgeHTML)$/.test(layout) &&
              "WebKit") ||
            (!layout &&
              /\bMSIE\b/i.test(ua) &&
              (os == "Mac OS" ? "Tasman" : "Trident")) ||
            (layout == "WebKit" &&
              /\bPlayStation\b(?! Vita\b)/i.test(name) &&
              "NetFront"))
        ) {
          layout = [data];
        }
        // Detect Windows Phone 7 desktop mode.
        if (
          name == "IE" &&
          (data = (/; *(?:XBLWP|ZuneWP)(\d+)/i.exec(ua) || 0)[1])
        ) {
          name += " Mobile";
          os = "Windows Phone " + (/\+$/.test(data) ? data : data + ".x");
          description.unshift("desktop mode");
        }
        // Detect Windows Phone 8.x desktop mode.
        else if (/\bWPDesktop\b/i.test(ua)) {
          name = "IE Mobile";
          os = "Windows Phone 8.x";
          description.unshift("desktop mode");
          version || (version = (/\brv:([\d.]+)/.exec(ua) || 0)[1]);
        }
        // Detect IE 11 identifying as other browsers.
        else if (
          name != "IE" &&
          layout == "Trident" &&
          (data = /\brv:([\d.]+)/.exec(ua))
        ) {
          if (name) {
            description.push(
              "identifying as " + name + (version ? " " + version : "")
            );
          }
          name = "IE";
          version = data[1];
        }
        // Leverage environment features.
        if (useFeatures) {
          // Detect server-side environments.
          // Rhino has a global function while others have a global object.
          if (isHostType(context, "global")) {
            if (java) {
              data = java.lang.System;
              arch = data.getProperty("os.arch");
              os =
                os ||
                data.getProperty("os.name") +
                  " " +
                  data.getProperty("os.version");
            }
            if (rhino) {
              try {
                version = context.require("ringo/engine").version.join(".");
                name = "RingoJS";
              } catch (e) {
                if (
                  (data = context.system) &&
                  data.global.system == context.system
                ) {
                  name = "Narwhal";
                  os || (os = data[0].os || null);
                }
              }
              if (!name) {
                name = "Rhino";
              }
            } else if (
              typeof context.process == "object" &&
              !context.process.browser &&
              (data = context.process)
            ) {
              if (typeof data.versions == "object") {
                if (typeof data.versions.electron == "string") {
                  description.push("Node " + data.versions.node);
                  name = "Electron";
                  version = data.versions.electron;
                } else if (typeof data.versions.nw == "string") {
                  description.push(
                    "Chromium " + version,
                    "Node " + data.versions.node
                  );
                  name = "NW.js";
                  version = data.versions.nw;
                }
              }
              if (!name) {
                name = "Node.js";
                arch = data.arch;
                os = data.platform;
                version = /[\d.]+/.exec(data.version);
                version = version ? version[0] : null;
              }
            }
          }
          // Detect Adobe AIR.
          else if (getClassOf((data = context.runtime)) == airRuntimeClass) {
            name = "Adobe AIR";
            os = data.flash.system.Capabilities.os;
          }
          // Detect PhantomJS.
          else if (getClassOf((data = context.phantom)) == phantomClass) {
            name = "PhantomJS";
            version =
              (data = data.version || null) &&
              data.major + "." + data.minor + "." + data.patch;
          }
          // Detect IE compatibility modes.
          else if (
            typeof doc.documentMode == "number" &&
            (data = /\bTrident\/(\d+)/i.exec(ua))
          ) {
            // We're in compatibility mode when the Trident version + 4 doesn't
            // equal the document mode.
            version = [version, doc.documentMode];
            if ((data = +data[1] + 4) != version[1]) {
              description.push("IE " + version[1] + " mode");
              layout && (layout[1] = "");
              version[1] = data;
            }
            version = name == "IE" ? String(version[1].toFixed(1)) : version[0];
          }
          // Detect IE 11 masking as other browsers.
          else if (
            typeof doc.documentMode == "number" &&
            /^(?:Chrome|Firefox)\b/.test(name)
          ) {
            description.push("masking as " + name + " " + version);
            name = "IE";
            version = "11.0";
            layout = ["Trident"];
            os = "Windows";
          }
          os = os && format(os);
        }
        // Detect prerelease phases.
        if (
          version &&
          (data =
            /(?:[ab]|dp|pre|[ab]\d+pre)(?:\d+\+?)?$/i.exec(version) ||
            /(?:alpha|beta)(?: ?\d)?/i.exec(
              ua + ";" + (useFeatures && nav.appMinorVersion)
            ) ||
            (/\bMinefield\b/i.test(ua) && "a"))
        ) {
          prerelease = /b/i.test(data) ? "beta" : "alpha";
          version =
            version.replace(RegExp(data + "\\+?$"), "") +
            (prerelease == "beta" ? beta : alpha) +
            (/\d+\+?/.exec(data) || "");
        }
        // Detect Firefox Mobile.
        if (
          name == "Fennec" ||
          (name == "Firefox" && /\b(?:Android|Firefox OS)\b/.test(os))
        ) {
          name = "Firefox Mobile";
        }
        // Obscure Maxthon's unreliable version.
        else if (name == "Maxthon" && version) {
          version = version.replace(/\.[\d.]+/, ".x");
        }
        // Detect Xbox 360 and Xbox One.
        else if (/\bXbox\b/i.test(product)) {
          if (product == "Xbox 360") {
            os = null;
          }
          if (product == "Xbox 360" && /\bIEMobile\b/.test(ua)) {
            description.unshift("mobile mode");
          }
        }
        // Add mobile postfix.
        else if (
          (/^(?:Chrome|IE|Opera)$/.test(name) ||
            (name && !product && !/Browser|Mobi/.test(name))) &&
          (os == "Windows CE" || /Mobi/i.test(ua))
        ) {
          name += " Mobile";
        }
        // Detect IE platform preview.
        else if (name == "IE" && useFeatures) {
          try {
            if (context.external === null) {
              description.unshift("platform preview");
            }
          } catch (e) {
            description.unshift("embedded");
          }
        }
        // Detect BlackBerry OS version.
        // http://docs.blackberry.com/en/developers/deliverables/18169/HTTP_headers_sent_by_BB_Browser_1234911_11.jsp
        else if (
          (/\bBlackBerry\b/.test(product) || /\bBB10\b/.test(ua)) &&
          (data =
            (RegExp(product.replace(/ +/g, " *") + "/([.\\d]+)", "i").exec(
              ua
            ) || 0)[1] || version)
        ) {
          data = [data, /BB10/.test(ua)];
          os =
            (data[1]
              ? ((product = null), (manufacturer = "BlackBerry"))
              : "Device Software") +
            " " +
            data[0];
          version = null;
        }
        // Detect Opera identifying/masking itself as another browser.
        // http://www.opera.com/support/kb/view/843/
        else if (
          this != forOwn &&
          product != "Wii" &&
          ((useFeatures && opera) ||
            (/Opera/.test(name) && /\b(?:MSIE|Firefox)\b/i.test(ua)) ||
            (name == "Firefox" && /\bOS X (?:\d+\.){2,}/.test(os)) ||
            (name == "IE" &&
              ((os && !/^Win/.test(os) && version > 5.5) ||
                (/\bWindows XP\b/.test(os) && version > 8) ||
                (version == 8 && !/\bTrident\b/.test(ua))))) &&
          !reOpera.test(
            (data = parse.call(forOwn, ua.replace(reOpera, "") + ";"))
          ) &&
          data.name
        ) {
          // When "identifying", the UA contains both Opera and the other browser's name.
          data =
            "ing as " + data.name + ((data = data.version) ? " " + data : "");
          if (reOpera.test(name)) {
            if (/\bIE\b/.test(data) && os == "Mac OS") {
              os = null;
            }
            data = "identify" + data;
          }
          // When "masking", the UA contains only the other browser's name.
          else {
            data = "mask" + data;
            if (operaClass) {
              name = format(operaClass.replace(/([a-z])([A-Z])/g, "$1 $2"));
            } else {
              name = "Opera";
            }
            if (/\bIE\b/.test(data)) {
              os = null;
            }
            if (!useFeatures) {
              version = null;
            }
          }
          layout = ["Presto"];
          description.push(data);
        }
        // Detect WebKit Nightly and approximate Chrome/Safari versions.
        if ((data = (/\bAppleWebKit\/([\d.]+\+?)/i.exec(ua) || 0)[1])) {
          // Correct build number for numeric comparison.
          // (e.g. "532.5" becomes "532.05")
          data = [parseFloat(data.replace(/\.(\d)$/, ".0$1")), data];
          // Nightly builds are postfixed with a "+".
          if (name == "Safari" && data[1].slice(-1) == "+") {
            name = "WebKit Nightly";
            prerelease = "alpha";
            version = data[1].slice(0, -1);
          }
          // Clear incorrect browser versions.
          else if (
            version == data[1] ||
            version == (data[2] = (/\bSafari\/([\d.]+\+?)/i.exec(ua) || 0)[1])
          ) {
            version = null;
          }
          // Use the full Chrome version when available.
          data[1] = (/\bChrome\/([\d.]+)/i.exec(ua) || 0)[1];
          // Detect Blink layout engine.
          if (
            data[0] == 537.36 &&
            data[2] == 537.36 &&
            parseFloat(data[1]) >= 28 &&
            layout == "WebKit"
          ) {
            layout = ["Blink"];
          }
          // Detect JavaScriptCore.
          // http://stackoverflow.com/questions/6768474/how-can-i-detect-which-javascript-engine-v8-or-jsc-is-used-at-runtime-in-androi
          if (!useFeatures || (!likeChrome && !data[1])) {
            layout && (layout[1] = "like Safari");
            data = ((data = data[0]),
            data < 400
              ? 1
              : data < 500
              ? 2
              : data < 526
              ? 3
              : data < 533
              ? 4
              : data < 534
              ? "4+"
              : data < 535
              ? 5
              : data < 537
              ? 6
              : data < 538
              ? 7
              : data < 601
              ? 8
              : "8");
          } else {
            layout && (layout[1] = "like Chrome");
            data =
              data[1] ||
              ((data = data[0]),
              data < 530
                ? 1
                : data < 532
                ? 2
                : data < 532.05
                ? 3
                : data < 533
                ? 4
                : data < 534.03
                ? 5
                : data < 534.07
                ? 6
                : data < 534.1
                ? 7
                : data < 534.13
                ? 8
                : data < 534.16
                ? 9
                : data < 534.24
                ? 10
                : data < 534.3
                ? 11
                : data < 535.01
                ? 12
                : data < 535.02
                ? "13+"
                : data < 535.07
                ? 15
                : data < 535.11
                ? 16
                : data < 535.19
                ? 17
                : data < 536.05
                ? 18
                : data < 536.1
                ? 19
                : data < 537.01
                ? 20
                : data < 537.11
                ? "21+"
                : data < 537.13
                ? 23
                : data < 537.18
                ? 24
                : data < 537.24
                ? 25
                : data < 537.36
                ? 26
                : layout != "Blink"
                ? "27"
                : "28");
          }
          // Add the postfix of ".x" or "+" for approximate versions.
          layout &&
            (layout[1] +=
              " " +
              (data +=
                typeof data == "number" ? ".x" : /[.+]/.test(data) ? "" : "+"));
          // Obscure version for some Safari 1-2 releases.
          if (name == "Safari" && (!version || parseInt(version) > 45)) {
            version = data;
          }
        }
        // Detect Opera desktop modes.
        if (name == "Opera" && (data = /\bzbov|zvav$/.exec(os))) {
          name += " ";
          description.unshift("desktop mode");
          if (data == "zvav") {
            name += "Mini";
            version = null;
          } else {
            name += "Mobile";
          }
          os = os.replace(RegExp(" *" + data + "$"), "");
        }
        // Detect Chrome desktop mode.
        else if (name == "Safari" && /\bChrome\b/.exec(layout && layout[1])) {
          description.unshift("desktop mode");
          name = "Chrome Mobile";
          version = null;

          if (/\bOS X\b/.test(os)) {
            manufacturer = "Apple";
            os = "iOS 4.3+";
          } else {
            os = null;
          }
        }
        // Strip incorrect OS versions.
        if (
          version &&
          version.indexOf((data = /[\d.]+$/.exec(os))) == 0 &&
          ua.indexOf("/" + data + "-") > -1
        ) {
          os = trim(os.replace(data, ""));
        }
        // Add layout engine.
        if (
          layout &&
          !/\b(?:Avant|Nook)\b/.test(name) &&
          (/Browser|Lunascape|Maxthon/.test(name) ||
            (name != "Safari" &&
              /^iOS/.test(os) &&
              /\bSafari\b/.test(layout[1])) ||
            (/^(?:Adobe|Arora|Breach|Midori|Opera|Phantom|Rekonq|Rock|Samsung Internet|Sleipnir|Web)/.test(
              name
            ) &&
              layout[1]))
        ) {
          // Don't add layout details to description if they are falsey.
          (data = layout[layout.length - 1]) && description.push(data);
        }
        // Combine contextual information.
        if (description.length) {
          description = ["(" + description.join("; ") + ")"];
        }
        // Append manufacturer to description.
        if (manufacturer && product && product.indexOf(manufacturer) < 0) {
          description.push("on " + manufacturer);
        }
        // Append product to description.
        if (product) {
          description.push(
            (/^on /.test(description[description.length - 1]) ? "" : "on ") +
              product
          );
        }
        // Parse the OS into an object.
        if (os) {
          data = / ([\d.+]+)$/.exec(os);
          isSpecialCasedOS =
            data && os.charAt(os.length - data[0].length - 1) == "/";
          os = {
            architecture: 32,
            family: data && !isSpecialCasedOS ? os.replace(data[0], "") : os,
            version: data ? data[1] : null,
            toString: function() {
              var version = this.version;
              return (
                this.family +
                (version && !isSpecialCasedOS ? " " + version : "") +
                (this.architecture == 64 ? " 64-bit" : "")
              );
            }
          };
        }
        // Add browser/OS architecture.
        if (
          (data = /\b(?:AMD|IA|Win|WOW|x86_|x)64\b/i.exec(arch)) &&
          !/\bi686\b/i.test(arch)
        ) {
          if (os) {
            os.architecture = 64;
            os.family = os.family.replace(RegExp(" *" + data), "");
          }
          if (
            name &&
            (/\bWOW64\b/i.test(ua) ||
              (useFeatures &&
                /\w(?:86|32)$/.test(nav.cpuClass || nav.platform) &&
                !/\bWin64; x64\b/i.test(ua)))
          ) {
            description.unshift("32-bit");
          }
        }
        // Chrome 39 and above on OS X is always 64-bit.
        else if (
          os &&
          /^OS X/.test(os.family) &&
          name == "Chrome" &&
          parseFloat(version) >= 39
        ) {
          os.architecture = 64;
        }

        ua || (ua = null);

        /*------------------------------------------------------------------------*/

        /**
         * The platform object.
         *
         * @name platform
         * @type Object
         */
        var platform = {};

        /**
         * The platform description.
         *
         * @memberOf platform
         * @type string|null
         */
        platform.description = ua;

        /**
         * The name of the browser's layout engine.
         *
         * The list of common layout engines include:
         * "Blink", "EdgeHTML", "Gecko", "Trident" and "WebKit"
         *
         * @memberOf platform
         * @type string|null
         */
        platform.layout = layout && layout[0];

        /**
         * The name of the product's manufacturer.
         *
         * The list of manufacturers include:
         * "Apple", "Archos", "Amazon", "Asus", "Barnes & Noble", "BlackBerry",
         * "Google", "HP", "HTC", "LG", "Microsoft", "Motorola", "Nintendo",
         * "Nokia", "Samsung" and "Sony"
         *
         * @memberOf platform
         * @type string|null
         */
        platform.manufacturer = manufacturer;

        /**
         * The name of the browser/environment.
         *
         * The list of common browser names include:
         * "Chrome", "Electron", "Firefox", "Firefox for iOS", "IE",
         * "Microsoft Edge", "PhantomJS", "Safari", "SeaMonkey", "Silk",
         * "Opera Mini" and "Opera"
         *
         * Mobile versions of some browsers have "Mobile" appended to their name:
         * eg. "Chrome Mobile", "Firefox Mobile", "IE Mobile" and "Opera Mobile"
         *
         * @memberOf platform
         * @type string|null
         */
        platform.name = name;

        /**
         * The alpha/beta release indicator.
         *
         * @memberOf platform
         * @type string|null
         */
        platform.prerelease = prerelease;

        /**
         * The name of the product hosting the browser.
         *
         * The list of common products include:
         *
         * "BlackBerry", "Galaxy S4", "Lumia", "iPad", "iPod", "iPhone", "Kindle",
         * "Kindle Fire", "Nexus", "Nook", "PlayBook", "TouchPad" and "Transformer"
         *
         * @memberOf platform
         * @type string|null
         */
        platform.product = product;

        /**
         * The browser's user agent string.
         *
         * @memberOf platform
         * @type string|null
         */
        platform.ua = ua;

        /**
         * The browser/environment version.
         *
         * @memberOf platform
         * @type string|null
         */
        platform.version = name && version;

        /**
         * The name of the operating system.
         *
         * @memberOf platform
         * @type Object
         */
        platform.os = os || {
          /**
           * The CPU architecture the OS is built for.
           *
           * @memberOf platform.os
           * @type number|null
           */
          architecture: null,

          /**
           * The family of the OS.
           *
           * Common values include:
           * "Windows", "Windows Server 2008 R2 / 7", "Windows Server 2008 / Vista",
           * "Windows XP", "OS X", "Ubuntu", "Debian", "Fedora", "Red Hat", "SuSE",
           * "Android", "iOS" and "Windows Phone"
           *
           * @memberOf platform.os
           * @type string|null
           */
          family: null,

          /**
           * The version of the OS.
           *
           * @memberOf platform.os
           * @type string|null
           */
          version: null,

          /**
           * Returns the OS string.
           *
           * @memberOf platform.os
           * @returns {string} The OS string.
           */
          toString: function() {
            return "null";
          }
        };

        platform.parse = parse;
        platform.toString = toStringPlatform;

        if (platform.version) {
          description.unshift(version);
        }
        if (platform.name) {
          description.unshift(name);
        }
        if (
          os &&
          name &&
          !(
            os == String(os).split(" ")[0] &&
            (os == name.split(" ")[0] || product)
          )
        ) {
          description.push(product ? "(" + os + ")" : "on " + os);
        }
        if (description.length) {
          platform.description = description.join(" ");
        }
        return platform;
      }

      /*--------------------------------------------------------------------------*/

      // Export platform.
      var platform = parse();

      // Some AMD build optimizers, like r.js, check for condition patterns like the following:
      if (freeExports && freeModule) {
        // Export for CommonJS support.
        forOwn(platform, function(value, key) {
          freeExports[key] = value;
        });
      } else {
        // Export to the global object.
        root.platform = platform;
      }
    }.call(commonjsGlobal));
  });

  var umd = createCommonjsModule(function(module, exports) {
    (function(global, factory) {
      module.exports = factory();
    })(commonjsGlobal, function() {
      var isMergeableObject = function isMergeableObject(value) {
        return isNonNullObject(value) && !isSpecial(value);
      };

      function isNonNullObject(value) {
        return !!value && typeof value === "object";
      }

      function isSpecial(value) {
        var stringValue = Object.prototype.toString.call(value);

        return (
          stringValue === "[object RegExp]" ||
          stringValue === "[object Date]" ||
          isReactElement(value)
        );
      }

      // see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
      var canUseSymbol = typeof Symbol === "function" && Symbol.for;
      var REACT_ELEMENT_TYPE = canUseSymbol
        ? Symbol.for("react.element")
        : 0xeac7;

      function isReactElement(value) {
        return value.$$typeof === REACT_ELEMENT_TYPE;
      }

      function emptyTarget(val) {
        return Array.isArray(val) ? [] : {};
      }

      function cloneUnlessOtherwiseSpecified(value, options) {
        return options.clone !== false && options.isMergeableObject(value)
          ? deepmerge(emptyTarget(value), value, options)
          : value;
      }

      function defaultArrayMerge(target, source, options) {
        return target.concat(source).map(function(element) {
          return cloneUnlessOtherwiseSpecified(element, options);
        });
      }

      function getMergeFunction(key, options) {
        if (!options.customMerge) {
          return deepmerge;
        }
        var customMerge = options.customMerge(key);
        return typeof customMerge === "function" ? customMerge : deepmerge;
      }

      function mergeObject(target, source, options) {
        var destination = {};
        if (options.isMergeableObject(target)) {
          Object.keys(target).forEach(function(key) {
            destination[key] = cloneUnlessOtherwiseSpecified(
              target[key],
              options
            );
          });
        }
        Object.keys(source).forEach(function(key) {
          if (!options.isMergeableObject(source[key]) || !target[key]) {
            destination[key] = cloneUnlessOtherwiseSpecified(
              source[key],
              options
            );
          } else {
            destination[key] = getMergeFunction(key, options)(
              target[key],
              source[key],
              options
            );
          }
        });
        return destination;
      }

      function deepmerge(target, source, options) {
        options = options || {};
        options.arrayMerge = options.arrayMerge || defaultArrayMerge;
        options.isMergeableObject =
          options.isMergeableObject || isMergeableObject;

        var sourceIsArray = Array.isArray(source);
        var targetIsArray = Array.isArray(target);
        var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

        if (!sourceAndTargetTypesMatch) {
          return cloneUnlessOtherwiseSpecified(source, options);
        } else if (sourceIsArray) {
          return options.arrayMerge(target, source, options);
        } else {
          return mergeObject(target, source, options);
        }
      }

      deepmerge.all = function deepmergeAll(array, options) {
        if (!Array.isArray(array)) {
          throw new Error("first argument should be an array");
        }

        return array.reduce(function(prev, next) {
          return deepmerge(prev, next, options);
        }, {});
      };

      var deepmerge_1 = deepmerge;

      return deepmerge_1;
    });
  });

  // Copyright Joyent, Inc. and other Node contributors.

  var R = typeof Reflect === "object" ? Reflect : null;
  var ReflectApply =
    R && typeof R.apply === "function"
      ? R.apply
      : function ReflectApply(target, receiver, args) {
          return Function.prototype.apply.call(target, receiver, args);
        };

  var ReflectOwnKeys;
  if (R && typeof R.ownKeys === "function") {
    ReflectOwnKeys = R.ownKeys;
  } else if (Object.getOwnPropertySymbols) {
    ReflectOwnKeys = function ReflectOwnKeys(target) {
      return Object.getOwnPropertyNames(target).concat(
        Object.getOwnPropertySymbols(target)
      );
    };
  } else {
    ReflectOwnKeys = function ReflectOwnKeys(target) {
      return Object.getOwnPropertyNames(target);
    };
  }

  function ProcessEmitWarning(warning) {
    if (console && console.warn) console.warn(warning);
  }

  var NumberIsNaN =
    Number.isNaN ||
    function NumberIsNaN(value) {
      return value !== value;
    };

  function EventEmitter() {
    EventEmitter.init.call(this);
  }
  var events = EventEmitter;

  // Backwards-compat with node 0.10.x
  EventEmitter.EventEmitter = EventEmitter;

  EventEmitter.prototype._events = undefined;
  EventEmitter.prototype._eventsCount = 0;
  EventEmitter.prototype._maxListeners = undefined;

  // By default EventEmitters will print a warning if more than 10 listeners are
  // added to it. This is a useful default which helps finding memory leaks.
  var defaultMaxListeners = 10;

  Object.defineProperty(EventEmitter, "defaultMaxListeners", {
    enumerable: true,
    get: function() {
      return defaultMaxListeners;
    },
    set: function(arg) {
      if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) {
        throw new RangeError(
          'The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' +
            arg +
            "."
        );
      }
      defaultMaxListeners = arg;
    }
  });

  EventEmitter.init = function() {
    if (
      this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events
    ) {
      this._events = Object.create(null);
      this._eventsCount = 0;
    }

    this._maxListeners = this._maxListeners || undefined;
  };

  // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.
  EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
    if (typeof n !== "number" || n < 0 || NumberIsNaN(n)) {
      throw new RangeError(
        'The value of "n" is out of range. It must be a non-negative number. Received ' +
          n +
          "."
      );
    }
    this._maxListeners = n;
    return this;
  };

  function $getMaxListeners(that) {
    if (that._maxListeners === undefined)
      return EventEmitter.defaultMaxListeners;
    return that._maxListeners;
  }

  EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
    return $getMaxListeners(this);
  };

  EventEmitter.prototype.emit = function emit(type) {
    var args = [];
    for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
    var doError = type === "error";

    var events = this._events;
    if (events !== undefined) doError = doError && events.error === undefined;
    else if (!doError) return false;

    // If there is no 'error' event listener then throw.
    if (doError) {
      var er;
      if (args.length > 0) er = args[0];
      if (er instanceof Error) {
        // Note: The comments on the `throw` lines are intentional, they show
        // up in Node's output if this results in an unhandled exception.
        throw er; // Unhandled 'error' event
      }
      // At least give some kind of context to the user
      var err = new Error(
        "Unhandled error." + (er ? " (" + er.message + ")" : "")
      );
      err.context = er;
      throw err; // Unhandled 'error' event
    }

    var handler = events[type];

    if (handler === undefined) return false;

    if (typeof handler === "function") {
      ReflectApply(handler, this, args);
    } else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i) ReflectApply(listeners[i], this, args);
    }

    return true;
  };

  function _addListener(target, type, listener, prepend) {
    var m;
    var events;
    var existing;

    if (typeof listener !== "function") {
      throw new TypeError(
        'The "listener" argument must be of type Function. Received type ' +
          typeof listener
      );
    }

    events = target._events;
    if (events === undefined) {
      events = target._events = Object.create(null);
      target._eventsCount = 0;
    } else {
      // To avoid recursion in the case that type === "newListener"! Before
      // adding it to the listeners, first emit "newListener".
      if (events.newListener !== undefined) {
        target.emit(
          "newListener",
          type,
          listener.listener ? listener.listener : listener
        );

        // Re-assign `events` because a newListener handler could have caused the
        // this._events to be assigned to a new object
        events = target._events;
      }
      existing = events[type];
    }

    if (existing === undefined) {
      // Optimize the case of one listener. Don't need the extra array object.
      existing = events[type] = listener;
      ++target._eventsCount;
    } else {
      if (typeof existing === "function") {
        // Adding the second element, need to change to array.
        existing = events[type] = prepend
          ? [listener, existing]
          : [existing, listener];
        // If we've already got an array, just append.
      } else if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }

      // Check for listener leak
      m = $getMaxListeners(target);
      if (m > 0 && existing.length > m && !existing.warned) {
        existing.warned = true;
        // No error code for this since it is a Warning
        // eslint-disable-next-line no-restricted-syntax
        var w = new Error(
          "Possible EventEmitter memory leak detected. " +
            existing.length +
            " " +
            String(type) +
            " listeners " +
            "added. Use emitter.setMaxListeners() to " +
            "increase limit"
        );
        w.name = "MaxListenersExceededWarning";
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        ProcessEmitWarning(w);
      }
    }

    return target;
  }

  EventEmitter.prototype.addListener = function addListener(type, listener) {
    return _addListener(this, type, listener, false);
  };

  EventEmitter.prototype.on = EventEmitter.prototype.addListener;

  EventEmitter.prototype.prependListener = function prependListener(
    type,
    listener
  ) {
    return _addListener(this, type, listener, true);
  };

  function onceWrapper() {
    var args = [];
    for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);
    if (!this.fired) {
      this.target.removeListener(this.type, this.wrapFn);
      this.fired = true;
      ReflectApply(this.listener, this.target, args);
    }
  }

  function _onceWrap(target, type, listener) {
    var state = {
      fired: false,
      wrapFn: undefined,
      target: target,
      type: type,
      listener: listener
    };
    var wrapped = onceWrapper.bind(state);
    wrapped.listener = listener;
    state.wrapFn = wrapped;
    return wrapped;
  }

  EventEmitter.prototype.once = function once(type, listener) {
    if (typeof listener !== "function") {
      throw new TypeError(
        'The "listener" argument must be of type Function. Received type ' +
          typeof listener
      );
    }
    this.on(type, _onceWrap(this, type, listener));
    return this;
  };

  EventEmitter.prototype.prependOnceListener = function prependOnceListener(
    type,
    listener
  ) {
    if (typeof listener !== "function") {
      throw new TypeError(
        'The "listener" argument must be of type Function. Received type ' +
          typeof listener
      );
    }
    this.prependListener(type, _onceWrap(this, type, listener));
    return this;
  };

  // Emits a 'removeListener' event if and only if the listener was removed.
  EventEmitter.prototype.removeListener = function removeListener(
    type,
    listener
  ) {
    var list, events, position, i, originalListener;

    if (typeof listener !== "function") {
      throw new TypeError(
        'The "listener" argument must be of type Function. Received type ' +
          typeof listener
      );
    }

    events = this._events;
    if (events === undefined) return this;

    list = events[type];
    if (list === undefined) return this;

    if (list === listener || list.listener === listener) {
      if (--this._eventsCount === 0) this._events = Object.create(null);
      else {
        delete events[type];
        if (events.removeListener)
          this.emit("removeListener", type, list.listener || listener);
      }
    } else if (typeof list !== "function") {
      position = -1;

      for (i = list.length - 1; i >= 0; i--) {
        if (list[i] === listener || list[i].listener === listener) {
          originalListener = list[i].listener;
          position = i;
          break;
        }
      }

      if (position < 0) return this;

      if (position === 0) list.shift();
      else {
        spliceOne(list, position);
      }

      if (list.length === 1) events[type] = list[0];

      if (events.removeListener !== undefined)
        this.emit("removeListener", type, originalListener || listener);
    }

    return this;
  };

  EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

  EventEmitter.prototype.removeAllListeners = function removeAllListeners(
    type
  ) {
    var listeners, events, i;

    events = this._events;
    if (events === undefined) return this;

    // not listening for removeListener, no need to emit
    if (events.removeListener === undefined) {
      if (arguments.length === 0) {
        this._events = Object.create(null);
        this._eventsCount = 0;
      } else if (events[type] !== undefined) {
        if (--this._eventsCount === 0) this._events = Object.create(null);
        else delete events[type];
      }
      return this;
    }

    // emit removeListener for all listeners on all events
    if (arguments.length === 0) {
      var keys = Object.keys(events);
      var key;
      for (i = 0; i < keys.length; ++i) {
        key = keys[i];
        if (key === "removeListener") continue;
        this.removeAllListeners(key);
      }
      this.removeAllListeners("removeListener");
      this._events = Object.create(null);
      this._eventsCount = 0;
      return this;
    }

    listeners = events[type];

    if (typeof listeners === "function") {
      this.removeListener(type, listeners);
    } else if (listeners !== undefined) {
      // LIFO order
      for (i = listeners.length - 1; i >= 0; i--) {
        this.removeListener(type, listeners[i]);
      }
    }

    return this;
  };

  function _listeners(target, type, unwrap) {
    var events = target._events;

    if (events === undefined) return [];

    var evlistener = events[type];
    if (evlistener === undefined) return [];

    if (typeof evlistener === "function")
      return unwrap ? [evlistener.listener || evlistener] : [evlistener];

    return unwrap
      ? unwrapListeners(evlistener)
      : arrayClone(evlistener, evlistener.length);
  }

  EventEmitter.prototype.listeners = function listeners(type) {
    return _listeners(this, type, true);
  };

  EventEmitter.prototype.rawListeners = function rawListeners(type) {
    return _listeners(this, type, false);
  };

  EventEmitter.listenerCount = function(emitter, type) {
    if (typeof emitter.listenerCount === "function") {
      return emitter.listenerCount(type);
    } else {
      return listenerCount.call(emitter, type);
    }
  };

  EventEmitter.prototype.listenerCount = listenerCount;
  function listenerCount(type) {
    var events = this._events;

    if (events !== undefined) {
      var evlistener = events[type];

      if (typeof evlistener === "function") {
        return 1;
      } else if (evlistener !== undefined) {
        return evlistener.length;
      }
    }

    return 0;
  }

  EventEmitter.prototype.eventNames = function eventNames() {
    return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
  };

  function arrayClone(arr, n) {
    var copy = new Array(n);
    for (var i = 0; i < n; ++i) copy[i] = arr[i];
    return copy;
  }

  function spliceOne(list, index) {
    for (; index + 1 < list.length; index++) list[index] = list[index + 1];
    list.pop();
  }

  function unwrapListeners(arr) {
    var ret = new Array(arr.length);
    for (var i = 0; i < ret.length; ++i) {
      ret[i] = arr[i].listener || arr[i];
    }
    return ret;
  }

  class Context {
    constructor() {
      this.token;
      this.serviceId;
      this.config;
      this.version;
      this.channel = {
        id: undefined,
        name: undefined,
        peers: [],
        startTime: undefined,
        status: undefined,
        type: undefined, // P2P, CAST, VIEW
        members: []
      };
      this.localVideo;
      this.remoteMedia;
      this.remoteMedia2;
      this.localStream = new MediaStream();
      this.remoteStream = new MediaStream();
      this.transceivers = null;
      this.devices = {
        currentVideoInput: -1,
        currentAudioInput: -1,
        videoInput: [],
        audioInput: [],
        audioOutput: []
      };
      this.peerConnection;
      this.dataConnection;
      this.state; // INIT, WAIT, CONNECT, COMPLETE, CLOSE, FAIL
      this.isConnectToSig = false;

      this.elive;
      this.callEvent; // 내부 이벤트를 API 외부에 전달위한 메소드. name, param 으로 이루어짐
      this.eventManager;
      this.mediaManager;
      this.signaler;
      this.messaging;

      this.country = undefined;
      this.purpose = "P2P";
      this.startTime = 0;
      this.endTime = 0;
      this.health = undefined;
    }
  }

  // TODO: change live to ...
  const logger = (() => {
    let level;
    let ctx;
    let url;

    function init(c) {
      ctx = c;
      level = ctx.config.sdk.logLevel;
      url = ctx.config.sdk.url.log;
    }

    function e(...message) {
      if (level === "SILENT") {
        return;
      }
      console.error(...message);
    }

    function w(...message) {
      if (level === "SILENT" || level === "ERROR") {
        return;
      }
      console.warn(...message);
    }

    function l(...message) {
      i(...message);
    }

    function i(...message) {
      if (level === "SILENT" || level === "ERROR" || level === "WARN") {
        return;
      }
      console.info(...message);
    }

    function t(ctx, message) {
      if (ctx.role === "CALLER" || ctx.role === "CASTOR") return;
      fetch(ctx.config.sdk.url.channelLog, {
        method: "POST",
        body: JSON.stringify(message),
        headers: { "Content-Type": "application/json" }
      }).catch(e => {
        console.error(e);
      });
    }

    function d(...message) {
      if (
        level === "SILENT" ||
        level === "ERROR" ||
        level === "WARN" ||
        level === "INFO"
      ) {
        return;
      }
      console.debug(...message);
    }

    function v(...object) {
      if (
        level === "SILENT" ||
        level === "ERROR" ||
        level === "WARN" ||
        level === "INFO" ||
        level === "DEBUG"
      ) {
        return;
      }
      console.trace(...object);
    }

    return Object.freeze({
      init,
      e,
      w,
      l,
      i,
      d,
      v,
      t
    });
  })();

  class ELiveError extends Error {
    constructor(message, e) {
      super(message);
      this.name = "ELiveError";
      this.code = message.code;
      this.text = message.text;
      if (e) console.error(e);
    }
  }

  class Messaging {
    constructor(ctx) {
      this.ctx = ctx;
      this.pc = new RTCPeerConnection(ctx.config.rtc);
      this.ctx.dataConnection = this.pc;
      this.channel;
    }

    startAnswer(desc) {
      logger.i(`start answer for dc`);
      this.pc
        .setRemoteDescription(desc)
        .then(() => {
          logger.d("remote description(offer) for dc is set");
        })
        .catch(e => {
          console.error(e);
          throw new ELiveError({
            code: "1300",
            text: "remote description for dc is wrong"
          });
        });

      if (desc.type === "offer") {
        this.pc
          .createAnswer()
          .then(desc => {
            this.pc.setLocalDescription(desc).then(() => {
              logger.d("local description(answer) for dc is set");
              const msg = this.ctx.signaler.createMessage({
                command: "sdp",
                body: JSON.stringify(desc)
              });
              msg.to = this.ctx.peerConnection.to;
              msg.pctype = "DC";
              this.ctx.signaler.send(msg);
            });
          })
          .catch(e => {
            throw new ELiveError(
              { code: "1300", text: "failed to create answer for dc" },
              e
            );
          });
      }
    }

    close() {
      logger.d(`datachannel is close`);
      this.pc.close();
      this.ctx.dataConnection = null;
      this.channel = null;
    }

    setRemoteDesciption(desc) {
      this.pc
        .setRemoteDescription(desc)
        .then(() => {
          logger.i("remote description(answer) is set");
        })
        .catch(e => {
          console.error(e);
          throw new ELiveError({
            code: "1300",
            text: "remote description(answer) is wrong"
          });
        });
    }
    startOffer() {
      logger.d("startOffer is started");
      this.channel = this.pc.createDataChannel("chat");
      this.channel.onopen = e => logger.d("datachannel is connected");
      this.channel.onmessage = e =>
        this.ctx.callEvent({ name: "onMessage", param: e.data });

      this.pc.createOffer().then(desc => {
        this.pc.setLocalDescription(desc).then(() => {
          logger.d("local description for dc is set");
          const msg = this.ctx.signaler.createMessage({
            command: "sdp",
            body: JSON.stringify(desc)
          });
          msg.to = this.ctx.channel.master;
          msg.pctype = "DC";
          logger.v(msg);
          this.ctx.signaler.send(msg);
        });
      });
    }

    listening() {
      logger.d("listening is started");
      this.pc.ondatachannel = event => {
        this.channel = event.channel;
        console.log(this.channel);
        this.channel.onopen = e => logger.d("datachannel is connected");
        this.channel.onmessage = e =>
          this.ctx.callEvent({ name: "onMessage", param: e.data });
      };
    }

    sendMessage(msg) {
      logger.d(`sendMessage: ${msg}`);
      if (this.channel) this.channel.send(msg);
    }
  }

  const util = (() => {
    function validateConfig(ctx) {
      if (
        !ctx.config.credential ||
        !ctx.config.credential.serviceId ||
        !ctx.config.credential.key
      ) {
        // l.e('no credential data')
        throw new ELiveError({ code: "1200", text: "no credential data" });
      }
    }

    function getMusicConfiguration() {
      return {
        mandatory: {
          googHighpassFilter: false,
          googEchoCancellation: false,
          googEchoCancellation2: false,
          googAutoGainControl: false,
          googAutoGainControl2: false,
          googNoiseSuppression: false,
          googNoiseSuppression2: false,
          googTypingNoiseDetection: false,
          echoCancellation: false
        },
        optional: [{ googCpuOveruseDetection: false }]
      };
    }

    function makeTransactionLog(ctx) {
      const msg = {
        pid: ctx.token,
        svcid: ctx.config.credential.serviceId,
        cid: ctx.channel.id,
        type: ctx.channel.type,
        start_time: ctx.startTime,
        duration: Math.round((ctx.endTime - ctx.startTime) / 1000),
        network: "wifi",
        status: ctx.state
      };
      return msg;
    }

    async function validateDevices(ctx) {
      logger.d("start gathering available devices");
      var curVideoDeviceId = -1,
        curAudioDeviceId = -1;
      if (ctx.config.media.video && ctx.config.media.video.deviceId)
        curVideoDeviceId = ctx.config.media.video.deviceId;
      if (ctx.config.media.audio && ctx.config.media.audio.deviceId)
        curAudioDeviceId = ctx.config.media.audio.deviceId;
      await navigator.mediaDevices.enumerateDevices().then(devices => {
        for (var i = 0; i < devices.length; i++) {
          const device = devices[i];
          if (device.kind === "videoinput") {
            var length = ctx.devices.videoInput.push({
              text: device.label,
              id: device.deviceId
            });
            if (device.deviceId === curVideoDeviceId) {
              ctx.devices.currentVideoInput = length - 1;
            }
          } else if (device.kind === "audioinput") {
            var length = ctx.devices.audioInput.push({
              text: device.label,
              id: device.deviceId
            });
            if (device.deviceId === curAudioDeviceId) {
              ctx.devices.currentAudioInput = length - 1;
            }
          } else if (device.kind === "audiooutput") {
            ctx.devices.audioOutput.push({
              text: device.label,
              id: device.deviceId
            });
          }
        }
      });
      if (
        ctx.devices.currentVideoInput === -1 &&
        ctx.devices.videoInput.length > 0
      ) {
        ctx.devices.currentVideoInput = 0;
      }
      if (
        ctx.devices.currentAudioInput === -1 &&
        ctx.devices.audioInput.length > 0
      ) {
        ctx.devices.currentAudioInput = 0;
      }
      logger.v(ctx.devices);
      logger.d("finish gathering available devices");
    }
    return Object.freeze({
      validateConfig,
      validateDevices,
      getMusicConfiguration,
      makeTransactionLog
    });
  })();

  function SigMsgHandler(ctx) {
    const sigEvents = {
      onCall(msg) {
        logger.i(`start onCall with chid:${msg.channel.id}`);
        if (!msg.pctype || msg.pctype !== "DC") ctx.channel = msg.channel;
        ctx.role = "CALLER";
        ctx.callEvent({ name: "onCall", param: { channel: ctx.channel } });
        ctx.peerConnection = new RTCPeerConnection(
          ctx.config.rtc,
          ctx.config.rtc.opt
        );
        ctx.peerConnection.onicecandidate = handleIceCandidate;
        ctx.localStream
          .getTracks()
          .forEach(track =>
            ctx.peerConnection.addTrack(track, ctx.localStream)
          );
        ctx.peerConnection.ontrack = handleTrack;
        ctx.messaging = new Messaging(ctx);
        ctx.messaging.listening();
        ctx.dataConnection.onicecandidate = handleDcIceCandidate;
        ctx.peerConnection.oniceconnectionstatechange = handleIceConnectionEvent;
      },
      onCallee(msg) {
        logger.i(`start onCallee with chid:${msg.channel.id}`);
        if (!msg.pctype || msg.pctype !== "DC") ctx.channel = msg.channel;
        ctx.role = "CALLEE";
        ctx.callEvent({ name: "onCall", param: { channel: ctx.channel } });
        ctx.peerConnection = new RTCPeerConnection(
          ctx.config.rtc,
          ctx.config.rtc.opt
        );
        ctx.peerConnection.onicecandidate = handleIceCandidate;
        ctx.localStream
          .getTracks()
          .forEach(track =>
            ctx.peerConnection.addTrack(track, ctx.localStream)
          );
        ctx.peerConnection.ontrack = handleTrack;
        ctx.peerConnection.oniceconnectionstatechange = handleIceConnectionEvent;
        ctx.peerConnection.to = ctx.channel.master;
        ctx.peerConnection.onnegotiationneeded = handleRenegoEvent;
        ctx.messaging = new Messaging(ctx);
        ctx.messaging.startOffer();
        ctx.dataConnection.onicecandidate = handleDcIceCandidate;
        ctx.peerConnection
          .createOffer({ offerToReceiveAudio: 1, offerToReceiveVideo: 1 })
          .then(desc => {
            desc.sdp = replaceCodec(desc.sdp, /m=video(:?.*)?/, "H264");
            // desc.sdp = desc.sdp.replace('a=fmtp:111 minptime=10;useinbandfec=1',
            //   'a=fmtp:111 minptime=20;useinbandfec=1;maxaveragebitrate=256000;stereo=1;sprop-stereo=1;cbr=1')
            desc.sdp = desc.sdp.replace(
              "a=fmtp:111 minptime=10;useinbandfec=1",
              // 'a=fmtp:111 useinbandfec=0;minptime=5;maxptime=20;maxplaybackrate=48000;sprop-maxcapturerate=48000;maxaveragebitrate=400000;stereo=1;cbr=1')
              "a=fmtp:111 useinbandfec=1;minptime=10;stereo=1;cbr=1;maxaveragebitrate=400000"
            );
            if (ctx.config.media.video.bitrate) {
              desc.sdp = setMediaBitrate(
                desc.sdp,
                "video",
                ctx.config.media.video.bitrate
              );
            }
            ctx.peerConnection.setLocalDescription(desc).then(() => {
              logger.d("local description setted");
              const msg = ctx.signaler.createMessage({
                command: "sdp",
                body: JSON.stringify(desc)
              });
              msg.to = ctx.channel.master;
              logger.d(`local offer msg: ${JSON.stringify(msg)}`);
              ctx.signaler.send(msg);
            });
          });
      },
      onCast(msg) {
        logger.i(`start onCast with chid: ${msg.channel.id}`);
        ctx.channel = msg.channel;
        ctx.callEvent({ name: "onCast", param: { channel: ctx.channel } });
        ctx.role = "CASTOR";
        ctx.peerConnection = new RTCPeerConnection(
          ctx.config.rtc,
          ctx.config.rtc.opt
        );
        ctx.peerConnection.onicecandidate = handleIceCandidate;
        ctx.localStream.getTracks().forEach(track =>
          ctx.peerConnection.addTransceiver(track, {
            direction: "sendonly",
            streams: [ctx.localStream]
          })
        );
        // Array.from(ctx.peerConnection.getTransceivers()).forEach(o => (o.direction = 'sendonly'))
        ctx.peerConnection.ontrack = handleTrack;
        ctx.peerConnection.oniceconnectionstatechange = handleIceConnectionEvent;
        ctx.peerConnection.to = ctx.channel.members[0].id;
        ctx.peerConnection.onnegotiationneeded = handleRenegoEvent;
        // ctx.messaging = new Messaging(ctx)
        // ctx.messaging.startOffer()
        // ctx.dataConnection.onicecandidate = handleDcIceCandidate
        ctx.peerConnection
          .createOffer({
            offerToReceiveAudio: 0,
            offerToReceiveVideo: 0,
            voiceActivityDetection: false
          })
          .then(desc => {
            desc.sdp = replaceCodec(desc.sdp, /m=video(:?.*)?/, "H264");
            if (ctx.config.media.video.bitrate) {
              desc.sdp = setMediaBitrate(
                desc.sdp,
                "video",
                ctx.config.media.video.bitrate
              );
            }
            // desc.sdp = desc.sdp.replace('a=fmtp:111 minptime=10;useinbandfec=1',
            //   'a=fmtp:111 minptime=20;useinbandfec=1;maxaveragebitrate=256000;stereo=1;sprop-stereo=1;cbr=1')
            desc.sdp = desc.sdp.replace(
              "a=fmtp:111 minptime=10;useinbandfec=1",
              //'a=fmtp:111 minptime=20;maxaveragebitrate=128000;stereo=1;cbr=1')
              "a=fmtp:111 useinbandfec=1;minptime=10;stereo=1;cbr=1;maxaveragebitrate=128000"
            );
            logger.d(`local offer: ${JSON.stringify(desc)}`);
            ctx.peerConnection.setLocalDescription(desc).then(() => {
              logger.d("local description setted");
              const msg = ctx.signaler.createMessage({
                command: "sdp",
                body: JSON.stringify(desc)
              });
              msg.to = ctx.channel.members[0].id;
              ctx.signaler.send(msg);
            });
          });
        ctx.health.start();
      },
      onWatch(msg) {
        logger.i(`start onWatch with chid: ${msg.channel.id}`);
        ctx.channel = msg.channel;
        ctx.callEvent({ name: "onWatch", param: { channel: ctx.channel } });
        ctx.role = "VIEWER";
        ctx.peerConnection = new RTCPeerConnection(
          ctx.config.rtc,
          ctx.config.rtc.opt
        );
        ctx.peerConnection.onicecandidate = handleIceCandidate;
        ctx.peerConnection.ontrack = handleTrack;
        ctx.peerConnection.oniceconnectionstatechange = handleViewerIceConnectionEvent;
        ctx.peerConnection.to = ctx.channel.members[0].id;
        ctx.peerConnection.onnegotiationneeded = handleRenegoEvent;
      },
      onSearch(msg) {
        logger.d(`onSearch ${JSON.stringify(msg.body)}`);
        if (!msg.body) return;
        var roomList = new Set();
        msg.body.forEach(item => {
          roomList.add(item.id);
        });
        msg.body = [...roomList];
        ctx.callEvent({ name: "onSearch", param: msg.body });
      },
      pong(msg) {},
      async onSdp(msg) {
        logger.d(`onSdp: ${msg.body}`);
        const desc = new RTCSessionDescription(JSON.parse(msg.body));

        ctx.peerConnection.to = msg.from;
        if (msg.pctype === "DC") {
          if (desc.type === "offer") ctx.messaging.startAnswer(desc);
          else ctx.messaging.setRemoteDesciption(desc);
          return;
        }
        ctx.peerConnection
          .setRemoteDescription(desc)
          .then(() => {
            logger.i("remote description is set");
          })
          .catch(e => {
            throw new ELiveError({
              code: "1300",
              text: "remote description is wrong"
            });
          });

        if (desc.type === "offer") {
          ctx.peerConnection
            .createAnswer()
            .then(desc => {
              desc.sdp = desc.sdp.replace(
                "a=fmtp:111 ",
                "a=fmtp:111 useinbandfec=1;minptime=10;stereo=1;cbr=1;maxaveragebitrate=128000"
              );
              // 'a=fmtp:111 maxaveragebitrate=128000;stereo=1;sprop-stereo=1;cbr=1;')
              ctx.peerConnection.setLocalDescription(desc).then(() => {
                logger.d("local description is set");
                const msg = ctx.signaler.createMessage({
                  command: "sdp",
                  body: JSON.stringify(desc)
                });
                msg.to = ctx.peerConnection.to;
                ctx.signaler.send(msg);
              });
            })
            .catch(e => {
              throw new ELiveError(
                { code: "1300", text: "failed to create answer" },
                e
              );
            });
        }
      },
      async onIce(msg) {
        const candidate = new RTCIceCandidate(JSON.parse(msg.body));
        logger.d("candidate: ", JSON.stringify(candidate));
        if (msg.pctype && msg.pctype === "DC")
          ctx.dataConnection.addIceCandidate(candidate);
        else ctx.peerConnection.addIceCandidate(candidate);
      }
    };

    function handleEvent(event) {
      const msg = JSON.parse(event.data);
      const type = msg.command;
      logger.d(`-> msg: ${msg.command}`, msg);
      sigEvents[type](msg);
    }

    function setMediaBitrate(sdp, media, bitrate) {
      var lines = sdp.split("\n");
      var line = -1;
      for (var i = 0; i < lines.length; i++) {
        if (lines[i].indexOf("m=" + media) === 0) {
          line = i;
          break;
        }
      }
      if (line === -1) {
        console.debug("Could not find the m line for", media);
        return sdp;
      }
      console.debug("Found the m line for", media, "at line", line);

      // Pass the m line
      line++;

      // Skip i and c lines
      while (
        lines[line].indexOf("i=") === 0 ||
        lines[line].indexOf("c=") === 0
      ) {
        line++;
      }

      // If we're on a b line, replace it
      if (lines[line].indexOf("b") === 0) {
        console.debug("Replaced b line at line", line);
        lines[line] = "b=AS:" + bitrate;
        return lines.join("\n");
      }

      // Add a new b line
      console.debug("Adding new b line before line", line);
      var newLines = lines.slice(0, line);
      newLines.push("b=AS:" + bitrate);
      newLines = newLines.concat(lines.slice(line, lines.length));
      return newLines.join("\n");
    }

    function replaceCodec(sdp, mLineReg, preferCodec) {
      var mLine,
        newMLine = [],
        sdpCodec,
        mLineSplit,
        reg = new RegExp("a=rtpmap:(\\d+) " + preferCodec + "/\\d+");

      mLine = sdp.match(mLineReg);
      if (!mLine) {
        return sdp;
      }

      sdpCodec = sdp.match(reg);
      if (!sdpCodec) {
        return sdp;
      }

      mLine = mLine[0];
      sdpCodec = sdpCodec[1];

      mLineSplit = mLine.split(" ");
      newMLine.push(mLineSplit[0]);
      newMLine.push(mLineSplit[1]);
      newMLine.push(mLineSplit[2]);
      newMLine.push(sdpCodec);

      for (var i = 3; i < mLineSplit.length; i++) {
        if (mLineSplit[i] !== sdpCodec) {
          newMLine.push(mLineSplit[i]);
        }
      }
      return sdp.replace(mLine, newMLine.join(" "));
    }

    function handleIceCandidate(event) {
      console.log("ice candidate is created");
      console.log(event.candidate);
      const msg = ctx.signaler.createMessage({
        command: "ice",
        body: JSON.stringify(event.candidate)
      });
      msg.to = ctx.peerConnection.to;
      ctx.signaler.send(msg);
    }

    function handleDcIceCandidate(event) {
      console.log("ice candidate for dc is created");
      console.log(event.candidate);
      const msg = ctx.signaler.createMessage({
        command: "ice",
        body: JSON.stringify(event.candidate)
      });
      msg.to = ctx.peerConnection.to;
      msg.pctype = "DC";
      ctx.signaler.send(msg);
    }

    function handleViewerIceConnectionEvent(event) {
      if (!ctx || ctx.state === "CLOSE") return;
      logger.i(`ice con evt: ${ctx.peerConnection.iceConnectionState}`);
      if (ctx.peerConnection.iceConnectionState === "connected") {
        if (ctx.remoteStream.getAudioTracks().length > 1) {
          ctx.remoteMedia.srcObject = new MediaStream([
            ctx.remoteStream.getAudioTracks()[0]
          ]);
          if (ctx.remoteMedia2)
            ctx.remoteMedia2.srcObject = new MediaStream([
              ctx.remoteStream.getAudioTracks()[1]
            ]);
        } else {
          ctx.remoteMedia.srcObject = ctx.remoteStream;
        }
        ctx.state = "COMPLETE";
        ctx.startTime = new Date().getTime();
        ctx.callEvent({ name: "onComplete", param: { channel: ctx.channel } });
      } else if (ctx.peerConnection.iceConnectionState === "closed") {
        if (ctx.state !== "CLOSE") {
          ctx.elive.close();
          ctx.endTime = new Date().getTime();
          logger.t(ctx, util.makeTransactionLog(ctx));
        }
      } else if (ctx.peerConnection.iceConnectionState === "failed") {
        if (ctx.state === "CLOSE") return;
        ctx.state = "FAIL";
        ctx.endTime = new Date().getTime();
        logger.t(ctx, util.makeTransactionLog(ctx));
        throw new ELiveError({
          code: "1300",
          text: "ice connecting is failed"
        });
      } else if (ctx.peerConnection.iceConnectionState === "disconnected") {
        // 상대 peer에 의해 rtc con이 종료되었을 경우
        if (ctx.state !== "CLOSE") {
          ctx.state = "CLOSE";
          ctx.endTime = new Date().getTime();
          logger.t(ctx, util.makeTransactionLog(ctx));
          //ctx.elive.close()
        }
        ctx.callEvent({ name: "onClose", param: {} });
      }
    }

    function handleIceConnectionEvent(event) {
      if (!ctx || ctx.state === "CLOSE") return;
      logger.i(`ice con evt: ${ctx.peerConnection.iceConnectionState}`);
      switch (ctx.peerConnection.iceConnectionState) {
        case "connected":
          if (ctx.channel.type === "P2P") {
            ctx.signaler.close();
            ctx.isConnectToSig = false;
            ctx.remoteMedia.srcObject = ctx.remoteStream;
          }
          ctx.state = "COMPLETE";
          ctx.startTime = new Date().getTime();
          ctx.transceivers = ctx.peerConnection.getTransceivers();
          ctx.callEvent({
            name: "onComplete",
            param: { channel: ctx.channel }
          });
          break;
        case "closed":
          if (ctx.state !== "CLOSE") {
            ctx.elive.close();
            ctx.endTime = new Date().getTime();
            logger.t(ctx, util.makeTransactionLog(ctx));
          }
          break;
        case "failed":
          ctx.state = "FAIL";
          ctx.endTime = new Date().getTime();
          logger.t(ctx, util.makeTransactionLog(ctx));
          throw new ELiveError({
            code: "1300",
            text: "ice connecting is failed"
          });
          break;
        case "disconnected": // 상대 peer에 의해 rtc con이 종료되었을 경우
          if (ctx.state !== "CLOSE") {
            ctx.endTime = new Date().getTime();
            logger.t(ctx, util.makeTransactionLog(ctx));
            ctx.elive.close();
          }
          break;
        default:
      }
    }

    function handleRenegoEvent(event) {
      logger.w("negotiation is needed");
    }

    function handleTrack(event) {
      logger.d("received track");
      console.dir(event);
      if (event.type === "track") {
        ctx.remoteStream.addTrack(event.track);
        ctx.transceivers = ctx.peerConnection.getTransceivers();
        // if (ctx.config.media.video === false) {
        //   ctx.remoteMedia.srcObject = ctx.remoteStream
        //   ctx.transceivers = ctx.peerConnection.getTransceivers()
        //   return
        // }
        // if (ctx.remoteStream.getTracks().length === 2) {
        //   ctx.remoteMedia.srcObject = ctx.remoteStream;
        //   ctx.transceivers = ctx.peerConnection.getTransceivers()
        // }
      }
    }

    ctx.signaler.onMessage(handleEvent);
  }

  class Signal extends events {
    constructor(ctx) {
      super();
      this.ctx = ctx;
      this.onMessageHandler = null;
      this.ws;
      this.MAX_RETRIES = 11;
    }
    init() {
      logger.d("start signaler init");
      this.ctx.isConnectToSig = false;
      this.ctx.sigMsgHandler = SigMsgHandler(this.ctx);
      this.ws = new WebSocket(this.ctx.config.sdk.url.sig);
      this.ws.onopen = () => {
        logger.i("Sig: success connect to sig server");
        this.ctx.isConnectToSig = true;
        this.ctx.callEvent({ name: "init", param: {} });
      };
      this.ws.onerror = e => {
        throw new ELiveError({ code: "1400", text: "websocket is failed" }, e);
      };
      this.ws.onclose = e => {
        logger.i("websocket is closed");
      };
      this.ws.onmessage = this.onMessageHandler;
      logger.d("finished signaler init");
    }

    onMessage(handler) {
      this.onMessageHandler = handler;
    }

    async call(roomId) {
      await this._sendCommand("call", roomId, "P2P");
    }

    async cast(roomId) {
      await this._sendCommand("cast", roomId, "BROADCAST");
    }

    async watch(roomId) {
      await this._sendCommand("watch", roomId, "BROADCAST");
    }

    async search(id) {
      await this.waitForConnection();
      const msg = this.createMessage({ command: "search" });
      this.send(msg);
    }

    async _sendCommand(command, roomId, type) {
      await this.waitForConnection();
      logger.i("start " + command);
      this.ctx.channel.id = roomId;
      this.ctx.channel.type = type;
      const msg = this.createMessage({ command });
      logger.v(msg);
      this.send(msg);
    }

    send(msg) {
      const m = JSON.stringify(msg);
      if (!this.ws) return;
      try {
        this.ws.send(m);
      } catch (e) {
        throw new ELiveError({ code: "1400", text: "send error" }, e);
      }
    }

    close() {
      logger.d("signaler is close");
      this.ws.close();
      this.ctx.isConnectToSig = false;
    }

    createMessage({ command, body }) {
      return {
        command,
        token: this.ctx.token,
        serviceId: this.ctx.config.credential.serviceId,
        channel: this.ctx.channel,
        body
      };
    }
    async waitForConnection() {
      for (let i = 5; i <= this.MAX_RETRIES; i++) {
        if (this.ctx.isConnectToSig === true) {
          return;
        } else {
          const timeout = Math.pow(2, i);
          logger.d("wating for init %i", i);
          await this.wait(timeout);
        }
      }
    }
    wait(timeout) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, timeout);
      });
    }
  }
  // module.exports.Signal;

  // Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js
  // (MIT licensed)

  const BUFFER = Symbol("buffer");
  const TYPE = Symbol("type");

  class Blob {
    constructor() {
      this[TYPE] = "";

      const blobParts = arguments[0];
      const options = arguments[1];

      const buffers = [];

      if (blobParts) {
        const a = blobParts;
        const length = Number(a.length);
        for (let i = 0; i < length; i++) {
          const element = a[i];
          let buffer;
          if (element instanceof Buffer) {
            buffer = element;
          } else if (ArrayBuffer.isView(element)) {
            buffer = Buffer.from(
              element.buffer,
              element.byteOffset,
              element.byteLength
            );
          } else if (element instanceof ArrayBuffer) {
            buffer = Buffer.from(element);
          } else if (element instanceof Blob) {
            buffer = element[BUFFER];
          } else {
            buffer = Buffer.from(
              typeof element === "string" ? element : String(element)
            );
          }
          buffers.push(buffer);
        }
      }

      this[BUFFER] = Buffer.concat(buffers);

      let type =
        options &&
        options.type !== undefined &&
        String(options.type).toLowerCase();
      if (type && !/[^\u0020-\u007E]/.test(type)) {
        this[TYPE] = type;
      }
    }
    get size() {
      return this[BUFFER].length;
    }
    get type() {
      return this[TYPE];
    }
    slice() {
      const size = this.size;

      const start = arguments[0];
      const end = arguments[1];
      let relativeStart, relativeEnd;
      if (start === undefined) {
        relativeStart = 0;
      } else if (start < 0) {
        relativeStart = Math.max(size + start, 0);
      } else {
        relativeStart = Math.min(start, size);
      }
      if (end === undefined) {
        relativeEnd = size;
      } else if (end < 0) {
        relativeEnd = Math.max(size + end, 0);
      } else {
        relativeEnd = Math.min(end, size);
      }
      const span = Math.max(relativeEnd - relativeStart, 0);

      const buffer = this[BUFFER];
      const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
      const blob = new Blob([], { type: arguments[2] });
      blob[BUFFER] = slicedBuffer;
      return blob;
    }
  }

  Object.defineProperties(Blob.prototype, {
    size: { enumerable: true },
    type: { enumerable: true },
    slice: { enumerable: true }
  });

  Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
    value: "Blob",
    writable: false,
    enumerable: false,
    configurable: true
  });

  /**
   * fetch-error.js
   *
   * FetchError interface for operational errors
   */

  /**
   * Create FetchError instance
   *
   * @param   String      message      Error message for human
   * @param   String      type         Error type for machine
   * @param   String      systemError  For Node.js system error
   * @return  FetchError
   */
  function FetchError(message, type, systemError) {
    Error.call(this, message);

    this.message = message;
    this.type = type;

    // when err.type is `system`, err.code contains system error code
    if (systemError) {
      this.code = this.errno = systemError.code;
    }

    // hide custom error implementation details from end-users
    Error.captureStackTrace(this, this.constructor);
  }

  FetchError.prototype = Object.create(Error.prototype);
  FetchError.prototype.constructor = FetchError;
  FetchError.prototype.name = "FetchError";

  let convert;
  try {
    convert = require("encoding").convert;
  } catch (e) {}

  const INTERNALS = Symbol("Body internals");

  // fix an issue where "PassThrough" isn't a named export for node <10
  const PassThrough = Stream.PassThrough;

  /**
   * Body mixin
   *
   * Ref: https://fetch.spec.whatwg.org/#body
   *
   * @param   Stream  body  Readable stream
   * @param   Object  opts  Response options
   * @return  Void
   */
  function Body(body) {
    var _this = this;

    var _ref =
        arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$size = _ref.size;

    let size = _ref$size === undefined ? 0 : _ref$size;
    var _ref$timeout = _ref.timeout;
    let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

    if (body == null) {
      // body is undefined or null
      body = null;
    } else if (typeof body === "string");
    else if (isURLSearchParams(body));
    else if (body instanceof Blob);
    else if (Buffer.isBuffer(body));
    else if (Object.prototype.toString.call(body) === "[object ArrayBuffer]");
    else if (ArrayBuffer.isView(body));
    else if (body instanceof Stream);
    else {
      // none of the above
      // coerce to string
      body = String(body);
    }
    this[INTERNALS] = {
      body,
      disturbed: false,
      error: null
    };
    this.size = size;
    this.timeout = timeout;

    if (body instanceof Stream) {
      body.on("error", function(err) {
        const error =
          err.name === "AbortError"
            ? err
            : new FetchError(
                `Invalid response body while trying to fetch ${_this.url}: ${
                  err.message
                }`,
                "system",
                err
              );
        _this[INTERNALS].error = error;
      });
    }
  }

  Body.prototype = {
    get body() {
      return this[INTERNALS].body;
    },

    get bodyUsed() {
      return this[INTERNALS].disturbed;
    },

    /**
     * Decode response as ArrayBuffer
     *
     * @return  Promise
     */
    arrayBuffer() {
      return consumeBody.call(this).then(function(buf) {
        return buf.buffer.slice(
          buf.byteOffset,
          buf.byteOffset + buf.byteLength
        );
      });
    },

    /**
     * Return raw response as Blob
     *
     * @return Promise
     */
    blob() {
      let ct = (this.headers && this.headers.get("content-type")) || "";
      return consumeBody.call(this).then(function(buf) {
        return Object.assign(
          // Prevent copying
          new Blob([], {
            type: ct.toLowerCase()
          }),
          {
            [BUFFER]: buf
          }
        );
      });
    },

    /**
     * Decode response as json
     *
     * @return  Promise
     */
    json() {
      var _this2 = this;

      return consumeBody.call(this).then(function(buffer) {
        try {
          return JSON.parse(buffer.toString());
        } catch (err) {
          return Body.Promise.reject(
            new FetchError(
              `invalid json response body at ${_this2.url} reason: ${
                err.message
              }`,
              "invalid-json"
            )
          );
        }
      });
    },

    /**
     * Decode response as text
     *
     * @return  Promise
     */
    text() {
      return consumeBody.call(this).then(function(buffer) {
        return buffer.toString();
      });
    },

    /**
     * Decode response as buffer (non-spec api)
     *
     * @return  Promise
     */
    buffer() {
      return consumeBody.call(this);
    },

    /**
     * Decode response as text, while automatically detecting the encoding and
     * trying to decode to UTF-8 (non-spec api)
     *
     * @return  Promise
     */
    textConverted() {
      var _this3 = this;

      return consumeBody.call(this).then(function(buffer) {
        return convertBody(buffer, _this3.headers);
      });
    }
  };

  // In browsers, all properties are enumerable.
  Object.defineProperties(Body.prototype, {
    body: { enumerable: true },
    bodyUsed: { enumerable: true },
    arrayBuffer: { enumerable: true },
    blob: { enumerable: true },
    json: { enumerable: true },
    text: { enumerable: true }
  });

  Body.mixIn = function(proto) {
    for (const name of Object.getOwnPropertyNames(Body.prototype)) {
      // istanbul ignore else: future proof
      if (!(name in proto)) {
        const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
        Object.defineProperty(proto, name, desc);
      }
    }
  };

  /**
   * Consume and convert an entire Body to a Buffer.
   *
   * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
   *
   * @return  Promise
   */
  function consumeBody() {
    var _this4 = this;

    if (this[INTERNALS].disturbed) {
      return Body.Promise.reject(
        new TypeError(`body used already for: ${this.url}`)
      );
    }

    this[INTERNALS].disturbed = true;

    if (this[INTERNALS].error) {
      return Body.Promise.reject(this[INTERNALS].error);
    }

    // body is null
    if (this.body === null) {
      return Body.Promise.resolve(Buffer.alloc(0));
    }

    // body is string
    if (typeof this.body === "string") {
      return Body.Promise.resolve(Buffer.from(this.body));
    }

    // body is blob
    if (this.body instanceof Blob) {
      return Body.Promise.resolve(this.body[BUFFER]);
    }

    // body is buffer
    if (Buffer.isBuffer(this.body)) {
      return Body.Promise.resolve(this.body);
    }

    // body is ArrayBuffer
    if (Object.prototype.toString.call(this.body) === "[object ArrayBuffer]") {
      return Body.Promise.resolve(Buffer.from(this.body));
    }

    // body is ArrayBufferView
    if (ArrayBuffer.isView(this.body)) {
      return Body.Promise.resolve(
        Buffer.from(
          this.body.buffer,
          this.body.byteOffset,
          this.body.byteLength
        )
      );
    }

    // istanbul ignore if: should never happen
    if (!(this.body instanceof Stream)) {
      return Body.Promise.resolve(Buffer.alloc(0));
    }

    // body is stream
    // get ready to actually consume the body
    let accum = [];
    let accumBytes = 0;
    let abort = false;

    return new Body.Promise(function(resolve, reject) {
      let resTimeout;

      // allow timeout on slow response body
      if (_this4.timeout) {
        resTimeout = setTimeout(function() {
          abort = true;
          reject(
            new FetchError(
              `Response timeout while trying to fetch ${_this4.url} (over ${
                _this4.timeout
              }ms)`,
              "body-timeout"
            )
          );
        }, _this4.timeout);
      }

      // handle stream errors
      _this4.body.on("error", function(err) {
        if (err.name === "AbortError") {
          // if the request was aborted, reject with this Error
          abort = true;
          reject(err);
        } else {
          // other errors, such as incorrect content-encoding
          reject(
            new FetchError(
              `Invalid response body while trying to fetch ${_this4.url}: ${
                err.message
              }`,
              "system",
              err
            )
          );
        }
      });

      _this4.body.on("data", function(chunk) {
        if (abort || chunk === null) {
          return;
        }

        if (_this4.size && accumBytes + chunk.length > _this4.size) {
          abort = true;
          reject(
            new FetchError(
              `content size at ${_this4.url} over limit: ${_this4.size}`,
              "max-size"
            )
          );
          return;
        }

        accumBytes += chunk.length;
        accum.push(chunk);
      });

      _this4.body.on("end", function() {
        if (abort) {
          return;
        }

        clearTimeout(resTimeout);

        try {
          resolve(Buffer.concat(accum));
        } catch (err) {
          // handle streams that have accumulated too much data (issue #414)
          reject(
            new FetchError(
              `Could not create Buffer from response body for ${_this4.url}: ${
                err.message
              }`,
              "system",
              err
            )
          );
        }
      });
    });
  }

  /**
   * Detect buffer encoding and convert to target encoding
   * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
   *
   * @param   Buffer  buffer    Incoming buffer
   * @param   String  encoding  Target encoding
   * @return  String
   */
  function convertBody(buffer, headers) {
    if (typeof convert !== "function") {
      throw new Error(
        "The package `encoding` must be installed to use the textConverted() function"
      );
    }

    const ct = headers.get("content-type");
    let charset = "utf-8";
    let res, str;

    // header
    if (ct) {
      res = /charset=([^;]*)/i.exec(ct);
    }

    // no charset in content type, peek at response body for at most 1024 bytes
    str = buffer.slice(0, 1024).toString();

    // html5
    if (!res && str) {
      res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
    }

    // html4
    if (!res && str) {
      res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(
        str
      );

      if (res) {
        res = /charset=(.*)/i.exec(res.pop());
      }
    }

    // xml
    if (!res && str) {
      res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
    }

    // found charset
    if (res) {
      charset = res.pop();

      // prevent decode issues when sites use incorrect encoding
      // ref: https://hsivonen.fi/encoding-menu/
      if (charset === "gb2312" || charset === "gbk") {
        charset = "gb18030";
      }
    }

    // turn raw buffers into a single utf-8 buffer
    return convert(buffer, "UTF-8", charset).toString();
  }

  /**
   * Detect a URLSearchParams object
   * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
   *
   * @param   Object  obj     Object to detect by type or brand
   * @return  String
   */
  function isURLSearchParams(obj) {
    // Duck-typing as a necessary condition.
    if (
      typeof obj !== "object" ||
      typeof obj.append !== "function" ||
      typeof obj.delete !== "function" ||
      typeof obj.get !== "function" ||
      typeof obj.getAll !== "function" ||
      typeof obj.has !== "function" ||
      typeof obj.set !== "function"
    ) {
      return false;
    }

    // Brand-checking and more duck-typing as optional condition.
    return (
      obj.constructor.name === "URLSearchParams" ||
      Object.prototype.toString.call(obj) === "[object URLSearchParams]" ||
      typeof obj.sort === "function"
    );
  }

  /**
   * Clone body given Res/Req instance
   *
   * @param   Mixed  instance  Response or Request instance
   * @return  Mixed
   */
  function clone(instance) {
    let p1, p2;
    let body = instance.body;

    // don't allow cloning a used body
    if (instance.bodyUsed) {
      throw new Error("cannot clone body after it is used");
    }

    // check that body is a stream and not form-data object
    // note: we can't clone the form-data object without having it as a dependency
    if (body instanceof Stream && typeof body.getBoundary !== "function") {
      // tee instance body
      p1 = new PassThrough();
      p2 = new PassThrough();
      body.pipe(p1);
      body.pipe(p2);
      // set instance body to teed body and return the other teed body
      instance[INTERNALS].body = p1;
      body = p2;
    }

    return body;
  }

  /**
   * Performs the operation "extract a `Content-Type` value from |object|" as
   * specified in the specification:
   * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
   *
   * This function assumes that instance.body is present.
   *
   * @param   Mixed  instance  Response or Request instance
   */
  function extractContentType(instance) {
    const body = instance.body;

    // istanbul ignore if: Currently, because of a guard in Request, body
    // can never be null. Included here for completeness.

    if (body === null) {
      // body is null
      return null;
    } else if (typeof body === "string") {
      // body is string
      return "text/plain;charset=UTF-8";
    } else if (isURLSearchParams(body)) {
      // body is a URLSearchParams
      return "application/x-www-form-urlencoded;charset=UTF-8";
    } else if (body instanceof Blob) {
      // body is blob
      return body.type || null;
    } else if (Buffer.isBuffer(body)) {
      // body is buffer
      return null;
    } else if (
      Object.prototype.toString.call(body) === "[object ArrayBuffer]"
    ) {
      // body is ArrayBuffer
      return null;
    } else if (ArrayBuffer.isView(body)) {
      // body is ArrayBufferView
      return null;
    } else if (typeof body.getBoundary === "function") {
      // detect form data input from form-data module
      return `multipart/form-data;boundary=${body.getBoundary()}`;
    } else {
      // body is stream
      // can't really do much about this
      return null;
    }
  }

  /**
   * The Fetch Standard treats this as if "total bytes" is a property on the body.
   * For us, we have to explicitly get it with a function.
   *
   * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
   *
   * @param   Body    instance   Instance of Body
   * @return  Number?            Number of bytes, or null if not possible
   */
  function getTotalBytes(instance) {
    const body = instance.body;

    // istanbul ignore if: included for completion

    if (body === null) {
      // body is null
      return 0;
    } else if (typeof body === "string") {
      // body is string
      return Buffer.byteLength(body);
    } else if (isURLSearchParams(body)) {
      // body is URLSearchParams
      return Buffer.byteLength(String(body));
    } else if (body instanceof Blob) {
      // body is blob
      return body.size;
    } else if (Buffer.isBuffer(body)) {
      // body is buffer
      return body.length;
    } else if (
      Object.prototype.toString.call(body) === "[object ArrayBuffer]"
    ) {
      // body is ArrayBuffer
      return body.byteLength;
    } else if (ArrayBuffer.isView(body)) {
      // body is ArrayBufferView
      return body.byteLength;
    } else if (body && typeof body.getLengthSync === "function") {
      // detect form data input from form-data module
      if (
        (body._lengthRetrievers && body._lengthRetrievers.length == 0) || // 1.x
        (body.hasKnownLength && body.hasKnownLength())
      ) {
        // 2.x
        return body.getLengthSync();
      }
      return null;
    } else {
      // body is stream
      // can't really do much about this
      return null;
    }
  }

  /**
   * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
   *
   * @param   Body    instance   Instance of Body
   * @return  Void
   */
  function writeToStream(dest, instance) {
    const body = instance.body;

    if (body === null) {
      // body is null
      dest.end();
    } else if (typeof body === "string") {
      // body is string
      dest.write(body);
      dest.end();
    } else if (isURLSearchParams(body)) {
      // body is URLSearchParams
      dest.write(Buffer.from(String(body)));
      dest.end();
    } else if (body instanceof Blob) {
      // body is blob
      dest.write(body[BUFFER]);
      dest.end();
    } else if (Buffer.isBuffer(body)) {
      // body is buffer
      dest.write(body);
      dest.end();
    } else if (
      Object.prototype.toString.call(body) === "[object ArrayBuffer]"
    ) {
      // body is ArrayBuffer
      dest.write(Buffer.from(body));
      dest.end();
    } else if (ArrayBuffer.isView(body)) {
      // body is ArrayBufferView
      dest.write(Buffer.from(body.buffer, body.byteOffset, body.byteLength));
      dest.end();
    } else {
      // body is stream
      body.pipe(dest);
    }
  }

  // expose Promise
  Body.Promise = global.Promise;

  /**
   * headers.js
   *
   * Headers class offers convenient helpers
   */

  const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
  const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

  function validateName(name) {
    name = `${name}`;
    if (invalidTokenRegex.test(name)) {
      throw new TypeError(`${name} is not a legal HTTP header name`);
    }
  }

  function validateValue(value) {
    value = `${value}`;
    if (invalidHeaderCharRegex.test(value)) {
      throw new TypeError(`${value} is not a legal HTTP header value`);
    }
  }

  /**
   * Find the key in the map object given a header name.
   *
   * Returns undefined if not found.
   *
   * @param   String  name  Header name
   * @return  String|Undefined
   */
  function find(map, name) {
    name = name.toLowerCase();
    for (const key in map) {
      if (key.toLowerCase() === name) {
        return key;
      }
    }
    return undefined;
  }

  const MAP = Symbol("map");
  class Headers {
    /**
     * Headers class
     *
     * @param   Object  headers  Response headers
     * @return  Void
     */
    constructor() {
      let init =
        arguments.length > 0 && arguments[0] !== undefined
          ? arguments[0]
          : undefined;

      this[MAP] = Object.create(null);

      if (init instanceof Headers) {
        const rawHeaders = init.raw();
        const headerNames = Object.keys(rawHeaders);

        for (const headerName of headerNames) {
          for (const value of rawHeaders[headerName]) {
            this.append(headerName, value);
          }
        }

        return;
      }

      // We don't worry about converting prop to ByteString here as append()
      // will handle it.
      if (init == null);
      else if (typeof init === "object") {
        const method = init[Symbol.iterator];
        if (method != null) {
          if (typeof method !== "function") {
            throw new TypeError("Header pairs must be iterable");
          }

          // sequence<sequence<ByteString>>
          // Note: per spec we have to first exhaust the lists then process them
          const pairs = [];
          for (const pair of init) {
            if (
              typeof pair !== "object" ||
              typeof pair[Symbol.iterator] !== "function"
            ) {
              throw new TypeError("Each header pair must be iterable");
            }
            pairs.push(Array.from(pair));
          }

          for (const pair of pairs) {
            if (pair.length !== 2) {
              throw new TypeError(
                "Each header pair must be a name/value tuple"
              );
            }
            this.append(pair[0], pair[1]);
          }
        } else {
          // record<ByteString, ByteString>
          for (const key of Object.keys(init)) {
            const value = init[key];
            this.append(key, value);
          }
        }
      } else {
        throw new TypeError("Provided initializer must be an object");
      }
    }

    /**
     * Return combined header value given name
     *
     * @param   String  name  Header name
     * @return  Mixed
     */
    get(name) {
      name = `${name}`;
      validateName(name);
      const key = find(this[MAP], name);
      if (key === undefined) {
        return null;
      }

      return this[MAP][key].join(", ");
    }

    /**
     * Iterate over all headers
     *
     * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
     * @param   Boolean   thisArg   `this` context for callback function
     * @return  Void
     */
    forEach(callback) {
      let thisArg =
        arguments.length > 1 && arguments[1] !== undefined
          ? arguments[1]
          : undefined;

      let pairs = getHeaders(this);
      let i = 0;
      while (i < pairs.length) {
        var _pairs$i = pairs[i];
        const name = _pairs$i[0],
          value = _pairs$i[1];

        callback.call(thisArg, value, name, this);
        pairs = getHeaders(this);
        i++;
      }
    }

    /**
     * Overwrite header values given name
     *
     * @param   String  name   Header name
     * @param   String  value  Header value
     * @return  Void
     */
    set(name, value) {
      name = `${name}`;
      value = `${value}`;
      validateName(name);
      validateValue(value);
      const key = find(this[MAP], name);
      this[MAP][key !== undefined ? key : name] = [value];
    }

    /**
     * Append a value onto existing header
     *
     * @param   String  name   Header name
     * @param   String  value  Header value
     * @return  Void
     */
    append(name, value) {
      name = `${name}`;
      value = `${value}`;
      validateName(name);
      validateValue(value);
      const key = find(this[MAP], name);
      if (key !== undefined) {
        this[MAP][key].push(value);
      } else {
        this[MAP][name] = [value];
      }
    }

    /**
     * Check for header name existence
     *
     * @param   String   name  Header name
     * @return  Boolean
     */
    has(name) {
      name = `${name}`;
      validateName(name);
      return find(this[MAP], name) !== undefined;
    }

    /**
     * Delete all header values given name
     *
     * @param   String  name  Header name
     * @return  Void
     */
    delete(name) {
      name = `${name}`;
      validateName(name);
      const key = find(this[MAP], name);
      if (key !== undefined) {
        delete this[MAP][key];
      }
    }

    /**
     * Return raw headers (non-spec api)
     *
     * @return  Object
     */
    raw() {
      return this[MAP];
    }

    /**
     * Get an iterator on keys.
     *
     * @return  Iterator
     */
    keys() {
      return createHeadersIterator(this, "key");
    }

    /**
     * Get an iterator on values.
     *
     * @return  Iterator
     */
    values() {
      return createHeadersIterator(this, "value");
    }

    /**
     * Get an iterator on entries.
     *
     * This is the default iterator of the Headers object.
     *
     * @return  Iterator
     */
    [Symbol.iterator]() {
      return createHeadersIterator(this, "key+value");
    }
  }
  Headers.prototype.entries = Headers.prototype[Symbol.iterator];

  Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
    value: "Headers",
    writable: false,
    enumerable: false,
    configurable: true
  });

  Object.defineProperties(Headers.prototype, {
    get: { enumerable: true },
    forEach: { enumerable: true },
    set: { enumerable: true },
    append: { enumerable: true },
    has: { enumerable: true },
    delete: { enumerable: true },
    keys: { enumerable: true },
    values: { enumerable: true },
    entries: { enumerable: true }
  });

  function getHeaders(headers) {
    let kind =
      arguments.length > 1 && arguments[1] !== undefined
        ? arguments[1]
        : "key+value";

    const keys = Object.keys(headers[MAP]).sort();
    return keys.map(
      kind === "key"
        ? function(k) {
            return k.toLowerCase();
          }
        : kind === "value"
        ? function(k) {
            return headers[MAP][k].join(", ");
          }
        : function(k) {
            return [k.toLowerCase(), headers[MAP][k].join(", ")];
          }
    );
  }

  const INTERNAL = Symbol("internal");

  function createHeadersIterator(target, kind) {
    const iterator = Object.create(HeadersIteratorPrototype);
    iterator[INTERNAL] = {
      target,
      kind,
      index: 0
    };
    return iterator;
  }

  const HeadersIteratorPrototype = Object.setPrototypeOf(
    {
      next() {
        // istanbul ignore if
        if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
          throw new TypeError("Value of `this` is not a HeadersIterator");
        }

        var _INTERNAL = this[INTERNAL];
        const target = _INTERNAL.target,
          kind = _INTERNAL.kind,
          index = _INTERNAL.index;

        const values = getHeaders(target, kind);
        const len = values.length;
        if (index >= len) {
          return {
            value: undefined,
            done: true
          };
        }

        this[INTERNAL].index = index + 1;

        return {
          value: values[index],
          done: false
        };
      }
    },
    Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()))
  );

  Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
    value: "HeadersIterator",
    writable: false,
    enumerable: false,
    configurable: true
  });

  /**
   * Export the Headers object in a form that Node.js can consume.
   *
   * @param   Headers  headers
   * @return  Object
   */
  function exportNodeCompatibleHeaders(headers) {
    const obj = Object.assign({ __proto__: null }, headers[MAP]);

    // http.request() only supports string as Host header. This hack makes
    // specifying custom Host header possible.
    const hostHeaderKey = find(headers[MAP], "Host");
    if (hostHeaderKey !== undefined) {
      obj[hostHeaderKey] = obj[hostHeaderKey][0];
    }

    return obj;
  }

  /**
   * Create a Headers object from an object of headers, ignoring those that do
   * not conform to HTTP grammar productions.
   *
   * @param   Object  obj  Object of headers
   * @return  Headers
   */
  function createHeadersLenient(obj) {
    const headers = new Headers();
    for (const name of Object.keys(obj)) {
      if (invalidTokenRegex.test(name)) {
        continue;
      }
      if (Array.isArray(obj[name])) {
        for (const val of obj[name]) {
          if (invalidHeaderCharRegex.test(val)) {
            continue;
          }
          if (headers[MAP][name] === undefined) {
            headers[MAP][name] = [val];
          } else {
            headers[MAP][name].push(val);
          }
        }
      } else if (!invalidHeaderCharRegex.test(obj[name])) {
        headers[MAP][name] = [obj[name]];
      }
    }
    return headers;
  }

  const INTERNALS$1 = Symbol("Response internals");

  // fix an issue where "STATUS_CODES" aren't a named export for node <10
  const STATUS_CODES = http.STATUS_CODES;

  /**
   * Response class
   *
   * @param   Stream  body  Readable stream
   * @param   Object  opts  Response options
   * @return  Void
   */
  class Response {
    constructor() {
      let body =
        arguments.length > 0 && arguments[0] !== undefined
          ? arguments[0]
          : null;
      let opts =
        arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      Body.call(this, body, opts);

      const status = opts.status || 200;

      this[INTERNALS$1] = {
        url: opts.url,
        status,
        statusText: opts.statusText || STATUS_CODES[status],
        headers: new Headers(opts.headers)
      };
    }

    get url() {
      return this[INTERNALS$1].url;
    }

    get status() {
      return this[INTERNALS$1].status;
    }

    /**
     * Convenience property representing if the request ended normally
     */
    get ok() {
      return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
    }

    get statusText() {
      return this[INTERNALS$1].statusText;
    }

    get headers() {
      return this[INTERNALS$1].headers;
    }

    /**
     * Clone this response
     *
     * @return  Response
     */
    clone() {
      return new Response(clone(this), {
        url: this.url,
        status: this.status,
        statusText: this.statusText,
        headers: this.headers,
        ok: this.ok
      });
    }
  }

  Body.mixIn(Response.prototype);

  Object.defineProperties(Response.prototype, {
    url: { enumerable: true },
    status: { enumerable: true },
    ok: { enumerable: true },
    statusText: { enumerable: true },
    headers: { enumerable: true },
    clone: { enumerable: true }
  });

  Object.defineProperty(Response.prototype, Symbol.toStringTag, {
    value: "Response",
    writable: false,
    enumerable: false,
    configurable: true
  });

  const INTERNALS$2 = Symbol("Request internals");

  // fix an issue where "format", "parse" aren't a named export for node <10
  const parse_url = Url.parse;
  const format_url = Url.format;

  const streamDestructionSupported = "destroy" in Stream.Readable.prototype;

  /**
   * Check if a value is an instance of Request.
   *
   * @param   Mixed   input
   * @return  Boolean
   */
  function isRequest(input) {
    return typeof input === "object" && typeof input[INTERNALS$2] === "object";
  }

  function isAbortSignal(signal) {
    const proto =
      signal && typeof signal === "object" && Object.getPrototypeOf(signal);
    return !!(proto && proto.constructor.name === "AbortSignal");
  }

  /**
   * Request class
   *
   * @param   Mixed   input  Url or Request instance
   * @param   Object  init   Custom options
   * @return  Void
   */
  class Request {
    constructor(input) {
      let init =
        arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      let parsedURL;

      // normalize input
      if (!isRequest(input)) {
        if (input && input.href) {
          // in order to support Node.js' Url objects; though WHATWG's URL objects
          // will fall into this branch also (since their `toString()` will return
          // `href` property anyway)
          parsedURL = parse_url(input.href);
        } else {
          // coerce input to a string before attempting to parse
          parsedURL = parse_url(`${input}`);
        }
        input = {};
      } else {
        parsedURL = parse_url(input.url);
      }

      let method = init.method || input.method || "GET";
      method = method.toUpperCase();

      if (
        (init.body != null || (isRequest(input) && input.body !== null)) &&
        (method === "GET" || method === "HEAD")
      ) {
        throw new TypeError("Request with GET/HEAD method cannot have body");
      }

      let inputBody =
        init.body != null
          ? init.body
          : isRequest(input) && input.body !== null
          ? clone(input)
          : null;

      Body.call(this, inputBody, {
        timeout: init.timeout || input.timeout || 0,
        size: init.size || input.size || 0
      });

      const headers = new Headers(init.headers || input.headers || {});

      if (init.body != null) {
        const contentType = extractContentType(this);
        if (contentType !== null && !headers.has("Content-Type")) {
          headers.append("Content-Type", contentType);
        }
      }

      let signal = isRequest(input) ? input.signal : null;
      if ("signal" in init) signal = init.signal;

      if (signal != null && !isAbortSignal(signal)) {
        throw new TypeError("Expected signal to be an instanceof AbortSignal");
      }

      this[INTERNALS$2] = {
        method,
        redirect: init.redirect || input.redirect || "follow",
        headers,
        parsedURL,
        signal
      };

      // node-fetch-only options
      this.follow =
        init.follow !== undefined
          ? init.follow
          : input.follow !== undefined
          ? input.follow
          : 20;
      this.compress =
        init.compress !== undefined
          ? init.compress
          : input.compress !== undefined
          ? input.compress
          : true;
      this.counter = init.counter || input.counter || 0;
      this.agent = init.agent || input.agent;
    }

    get method() {
      return this[INTERNALS$2].method;
    }

    get url() {
      return format_url(this[INTERNALS$2].parsedURL);
    }

    get headers() {
      return this[INTERNALS$2].headers;
    }

    get redirect() {
      return this[INTERNALS$2].redirect;
    }

    get signal() {
      return this[INTERNALS$2].signal;
    }

    /**
     * Clone this request
     *
     * @return  Request
     */
    clone() {
      return new Request(this);
    }
  }

  Body.mixIn(Request.prototype);

  Object.defineProperty(Request.prototype, Symbol.toStringTag, {
    value: "Request",
    writable: false,
    enumerable: false,
    configurable: true
  });

  Object.defineProperties(Request.prototype, {
    method: { enumerable: true },
    url: { enumerable: true },
    headers: { enumerable: true },
    redirect: { enumerable: true },
    clone: { enumerable: true },
    signal: { enumerable: true }
  });

  /**
   * Convert a Request to Node.js http request options.
   *
   * @param   Request  A Request instance
   * @return  Object   The options object to be passed to http.request
   */
  function getNodeRequestOptions(request) {
    const parsedURL = request[INTERNALS$2].parsedURL;
    const headers = new Headers(request[INTERNALS$2].headers);

    // fetch step 1.3
    if (!headers.has("Accept")) {
      headers.set("Accept", "*/*");
    }

    // Basic fetch
    if (!parsedURL.protocol || !parsedURL.hostname) {
      throw new TypeError("Only absolute URLs are supported");
    }

    if (!/^https?:$/.test(parsedURL.protocol)) {
      throw new TypeError("Only HTTP(S) protocols are supported");
    }

    if (
      request.signal &&
      request.body instanceof Stream.Readable &&
      !streamDestructionSupported
    ) {
      throw new Error(
        "Cancellation of streamed requests with AbortSignal is not supported in node < 8"
      );
    }

    // HTTP-network-or-cache fetch steps 2.4-2.7
    let contentLengthValue = null;
    if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
      contentLengthValue = "0";
    }
    if (request.body != null) {
      const totalBytes = getTotalBytes(request);
      if (typeof totalBytes === "number") {
        contentLengthValue = String(totalBytes);
      }
    }
    if (contentLengthValue) {
      headers.set("Content-Length", contentLengthValue);
    }

    // HTTP-network-or-cache fetch step 2.11
    if (!headers.has("User-Agent")) {
      headers.set(
        "User-Agent",
        "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)"
      );
    }

    // HTTP-network-or-cache fetch step 2.15
    if (request.compress && !headers.has("Accept-Encoding")) {
      headers.set("Accept-Encoding", "gzip,deflate");
    }

    if (!headers.has("Connection") && !request.agent) {
      headers.set("Connection", "close");
    }

    // HTTP-network fetch step 4.2
    // chunked encoding is handled by Node.js

    return Object.assign({}, parsedURL, {
      method: request.method,
      headers: exportNodeCompatibleHeaders(headers),
      agent: request.agent
    });
  }

  /**
   * abort-error.js
   *
   * AbortError interface for cancelled requests
   */

  /**
   * Create AbortError instance
   *
   * @param   String      message      Error message for human
   * @return  AbortError
   */
  function AbortError(message) {
    Error.call(this, message);

    this.type = "aborted";
    this.message = message;

    // hide custom error implementation details from end-users
    Error.captureStackTrace(this, this.constructor);
  }

  AbortError.prototype = Object.create(Error.prototype);
  AbortError.prototype.constructor = AbortError;
  AbortError.prototype.name = "AbortError";

  // fix an issue where "PassThrough", "resolve" aren't a named export for node <10
  const PassThrough$1 = Stream.PassThrough;
  const resolve_url = Url.resolve;

  /**
   * Fetch function
   *
   * @param   Mixed    url   Absolute url or Request instance
   * @param   Object   opts  Fetch options
   * @return  Promise
   */
  function fetch$1(url, opts) {
    // allow custom promise
    if (!fetch$1.Promise) {
      throw new Error(
        "native promise missing, set fetch.Promise to your favorite alternative"
      );
    }

    Body.Promise = fetch$1.Promise;

    // wrap http.request into fetch
    return new fetch$1.Promise(function(resolve, reject) {
      // build request object
      const request = new Request(url, opts);
      const options = getNodeRequestOptions(request);

      const send = (options.protocol === "https:" ? https : http).request;
      const signal = request.signal;

      let response = null;

      const abort = function abort() {
        let error = new AbortError("The user aborted a request.");
        reject(error);
        if (request.body && request.body instanceof Stream.Readable) {
          request.body.destroy(error);
        }
        if (!response || !response.body) return;
        response.body.emit("error", error);
      };

      if (signal && signal.aborted) {
        abort();
        return;
      }

      const abortAndFinalize = function abortAndFinalize() {
        abort();
        finalize();
      };

      // send request
      const req = send(options);
      let reqTimeout;

      if (signal) {
        signal.addEventListener("abort", abortAndFinalize);
      }

      function finalize() {
        req.abort();
        if (signal) signal.removeEventListener("abort", abortAndFinalize);
        clearTimeout(reqTimeout);
      }

      if (request.timeout) {
        req.once("socket", function(socket) {
          reqTimeout = setTimeout(function() {
            reject(
              new FetchError(
                `network timeout at: ${request.url}`,
                "request-timeout"
              )
            );
            finalize();
          }, request.timeout);
        });
      }

      req.on("error", function(err) {
        reject(
          new FetchError(
            `request to ${request.url} failed, reason: ${err.message}`,
            "system",
            err
          )
        );
        finalize();
      });

      req.on("response", function(res) {
        clearTimeout(reqTimeout);

        const headers = createHeadersLenient(res.headers);

        // HTTP fetch step 5
        if (fetch$1.isRedirect(res.statusCode)) {
          // HTTP fetch step 5.2
          const location = headers.get("Location");

          // HTTP fetch step 5.3
          const locationURL =
            location === null ? null : resolve_url(request.url, location);

          // HTTP fetch step 5.5
          switch (request.redirect) {
            case "error":
              reject(
                new FetchError(
                  `redirect mode is set to error: ${request.url}`,
                  "no-redirect"
                )
              );
              finalize();
              return;
            case "manual":
              // node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
              if (locationURL !== null) {
                // handle corrupted header
                try {
                  headers.set("Location", locationURL);
                } catch (err) {
                  // istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
                  reject(err);
                }
              }
              break;
            case "follow":
              // HTTP-redirect fetch step 2
              if (locationURL === null) {
                break;
              }

              // HTTP-redirect fetch step 5
              if (request.counter >= request.follow) {
                reject(
                  new FetchError(
                    `maximum redirect reached at: ${request.url}`,
                    "max-redirect"
                  )
                );
                finalize();
                return;
              }

              // HTTP-redirect fetch step 6 (counter increment)
              // Create a new Request object.
              const requestOpts = {
                headers: new Headers(request.headers),
                follow: request.follow,
                counter: request.counter + 1,
                agent: request.agent,
                compress: request.compress,
                method: request.method,
                body: request.body,
                signal: request.signal
              };

              // HTTP-redirect fetch step 9
              if (
                res.statusCode !== 303 &&
                request.body &&
                getTotalBytes(request) === null
              ) {
                reject(
                  new FetchError(
                    "Cannot follow redirect with body being a readable stream",
                    "unsupported-redirect"
                  )
                );
                finalize();
                return;
              }

              // HTTP-redirect fetch step 11
              if (
                res.statusCode === 303 ||
                ((res.statusCode === 301 || res.statusCode === 302) &&
                  request.method === "POST")
              ) {
                requestOpts.method = "GET";
                requestOpts.body = undefined;
                requestOpts.headers.delete("content-length");
              }

              // HTTP-redirect fetch step 15
              resolve(fetch$1(new Request(locationURL, requestOpts)));
              finalize();
              return;
          }
        }

        // prepare response
        res.once("end", function() {
          if (signal) signal.removeEventListener("abort", abortAndFinalize);
        });
        let body = res.pipe(new PassThrough$1());

        const response_options = {
          url: request.url,
          status: res.statusCode,
          statusText: res.statusMessage,
          headers: headers,
          size: request.size,
          timeout: request.timeout
        };

        // HTTP-network fetch step 12.1.1.3
        const codings = headers.get("Content-Encoding");

        // HTTP-network fetch step 12.1.1.4: handle content codings

        // in following scenarios we ignore compression support
        // 1. compression support is disabled
        // 2. HEAD request
        // 3. no Content-Encoding header
        // 4. no content response (204)
        // 5. content not modified response (304)
        if (
          !request.compress ||
          request.method === "HEAD" ||
          codings === null ||
          res.statusCode === 204 ||
          res.statusCode === 304
        ) {
          response = new Response(body, response_options);
          resolve(response);
          return;
        }

        // For Node v6+
        // Be less strict when decoding compressed responses, since sometimes
        // servers send slightly invalid responses that are still accepted
        // by common browsers.
        // Always using Z_SYNC_FLUSH is what cURL does.
        const zlibOptions = {
          flush: zlib.Z_SYNC_FLUSH,
          finishFlush: zlib.Z_SYNC_FLUSH
        };

        // for gzip
        if (codings == "gzip" || codings == "x-gzip") {
          body = body.pipe(zlib.createGunzip(zlibOptions));
          response = new Response(body, response_options);
          resolve(response);
          return;
        }

        // for deflate
        if (codings == "deflate" || codings == "x-deflate") {
          // handle the infamous raw deflate response from old servers
          // a hack for old IIS and Apache servers
          const raw = res.pipe(new PassThrough$1());
          raw.once("data", function(chunk) {
            // see http://stackoverflow.com/questions/37519828
            if ((chunk[0] & 0x0f) === 0x08) {
              body = body.pipe(zlib.createInflate());
            } else {
              body = body.pipe(zlib.createInflateRaw());
            }
            response = new Response(body, response_options);
            resolve(response);
          });
          return;
        }

        // otherwise, use response as-is
        response = new Response(body, response_options);
        resolve(response);
      });

      writeToStream(req, request);
    });
  }
  /**
   * Redirect code matching
   *
   * @param   Number   code  Status code
   * @return  Boolean
   */
  fetch$1.isRedirect = function(code) {
    return (
      code === 301 ||
      code === 302 ||
      code === 303 ||
      code === 307 ||
      code === 308
    );
  };

  // expose Promise
  fetch$1.Promise = global.Promise;

  // import ipinfo from "ipinfo";
  // ipinfo((err, cloc) => {
  //   console.log(cloc.country);
  // })
  async function Auth(ctx) {
    logger.d(`start auth with context`);
    const messageBody = {
      credential: {
        key: ctx.config.credential.key,
        serviceId: ctx.config.credential.serviceId
      },
      env: {
        os: platform.os.family,
        osVersion: platform.os.version || "0",
        device: platform.name,
        deviceVersion: platform.version || "0",
        sdkVersion: ctx.version,
        purpose: ctx.purpose,
        country:
          ctx.config.sdk && ctx.config.sdk.country
            ? ctx.config.sdk.country
            : "KR"
      }
    };
    if (ctx.config.sdk.coachId)
      messageBody.env.coachId = ctx.config.sdk.coachId;
    const message = {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(messageBody)
    };
    try {
      const respObject = await fetch$1(ctx.config.sdk.url.auth, message);
      const response = await respObject.json();

      Object.keys(response).forEach(responseJsonKey => {
        switch (responseJsonKey) {
          case "iceServers":
            response[responseJsonKey].forEach(server =>
              ctx.config.rtc.iceServers.push(server)
            );
            break;
          case "token":
            ctx.token = response[responseJsonKey];
            break;
          case "coach":
            ctx.config.sdk.url.sig = response[responseJsonKey].url;
            break;
          case "channelLogUrl":
            ctx.config.sdk.url.channelLog = response[responseJsonKey];
            break;
          default:
        }
      });
    } catch (e) {
      console.error(e);
      throw new ELiveError({
        code: 1600,
        text: `Auth is failed with id:${ctx.config.credential.serviceId}/ key:${
          ctx.config.credential.key
        }`
      });
    }
    if (!ctx.token)
      throw new ELiveError({
        code: 1600,
        text: `failed to auth with id: ${
          ctx.config.credential.serviceId
        } and key: ${ctx.config.credential.key}`
      });
    logger.d("success auth");
  }

  /**
   * <h1>schema of config</h1>
   * @example
   * {
   *  // credential is an authentication information from ELive.
   *  // It consists of the serviceId and key.
   *  credential: {
   *    serviceId: 'dummyid',
   *    key: 'dummykey'
   *  },
   *  // view is a set of tags that will execute media on an HTML document.
   *  // You can define a video tag or an audio tag for local and remote.
   *  // If you want to specify the stream itself rather than the tag, use localStream.
   *  view: {
   *    local: 'localVideoTagId'|'localAudioTagId'
   *    remote: 'remoteVideoTagId'|'remoteAudioTagId'
   *    localStream: 'localStreamFromCanvas'
   *  },
   *  // You can use 'rtc' when you'd like to set specifically for the WebRTC PeerConnection constructor option used by ELive.
   *  // please refer to https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/RTCPeerConnection#RTCConfiguration_dictionary
   *  rtc: {
   *    iceServers: {}
   *    opt: {}
   *    dataOpt: {}
   *  },
   *  // You can use 'media' when you'd like to set specifically for the HTML5 GetUserMedia method option used by ELive.
   *  // Please refer to https://developer.mozilla.org/en/docs/Web/API/MediaStreamConstraints
   *  media: {
   *    video: true,
   *    audio: true
   *  },
   *  // 'sdk' is an option for developers and some special features.
   *  sdk: {
   *    logLevel: 'ERROR|WARN|INFO|DEBUG|TRACE',
   *    // default value is 'voice'.
   *    // Set it to music so that you can hear a variety of sounds, such as music, rather than a human voice.
   *    audioType: 'voice|music',
   *    mode: 'dev|prod' // When you want to test it on localhost, change to dev mode.
   *  }
   * }
   * </code></pre>
   */
  var config = (() => {
    return {
      credential: {
        serviceId: undefined,
        key: undefined
      },
      view: {
        local: undefined,
        remote: undefined,
        remote2: undefined
      },
      rtc: {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        opt: {},
        dataOpt: {
          optional: [
            {
              RtpDataChannels: true
            }
          ]
        },
        sdpSemantics: "unified-plan"
      },
      media: {
        // correspond to getusermedia option format
        video: { frameRate: { min: 20, max: 30 } },
        audio: { channelCount: 2 }
      },
      sdk: {
        url: {
          // sig: "wss://signal.remotemonster.com/ws",
          sig: "wss://demo.remotemonster.com/sig",
          auth: "https://auth.remotemonster.com/auth",
          // auth: "https://signal.remotemonster.com/rest/init",
          log: "https://signal.remotemonster.com:2001/topics",
          channelLog: ""
        },
        logLevel: "INFO",
        audioType: "voice",
        mode: "prod",
        coachId: undefined, // if defined, it is a primary coach.
        country: undefined // default: 'KR'
      }
    };
  })();

  class Device {
    constructor(ctx) {
      this.ctx = ctx;
    }

    async captureScreen() {
      this.ctx.localStream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });
      this.ctx.transceivers[1].sender.replaceTrack(
        this.ctx.localStream.getTracks()[0]
      );
      this.ctx.localStream.addTrack(this.ctx.transceivers[0].sender.track);
      this.ctx.localVideo.srcObject = this.ctx.localStream;
    }

    stopCaptureScreen() {
      showLocalVideo();
    }

    async validateDevices() {
      logger.d("start gathering available devices");
      var curVideoDeviceId = -1,
        curAudioDeviceId = -1;
      if (this.ctx.config.media.video && this.ctx.config.media.video.deviceId)
        curVideoDeviceId = this.ctx.config.media.video.deviceId;
      if (this.ctx.config.media.audio && this.ctx.config.media.audio.deviceId)
        curAudioDeviceId = this.ctx.config.media.audio.deviceId;

      await navigator.mediaDevices.enumerateDevices().then(devices => {
        for (var i = 0; i < devices.length; i++) {
          const device = devices[i];
          if (device.kind === "videoinput") {
            var length = this.ctx.devices.videoInput.push({
              text: device.label,
              id: device.deviceId
            });
            if (device.deviceId === curVideoDeviceId) {
              this.ctx.devices.currentVideoInput = length - 1;
            }
          } else if (device.kind === "audioinput") {
            var length = this.ctx.devices.audioInput.push({
              text: device.label,
              id: device.deviceId
            });
            if (device.deviceId === curAudioDeviceId) {
              this.ctx.devices.currentAudioInput = length - 1;
            }
          } else if (device.kind === "audiooutput") {
            this.ctx.devices.audioOutput.push({
              text: device.label,
              id: device.deviceId
            });
          }
        }
      });
      if (
        this.ctx.devices.videoInput.length === 0 ||
        this.ctx.devices.audioInput.length === 0
      ) {
        throw new ELiveError({
          code: "1500",
          text: "there is no input device"
        });
      }
      if (
        this.ctx.devices.currentVideoInput === -1 &&
        this.ctx.devices.videoInput.length > 0
      ) {
        this.ctx.devices.currentVideoInput = 0;
      }
      if (
        this.ctx.devices.currentAudioInput === -1 &&
        this.ctx.devices.audioInput.length > 0
      ) {
        this.ctx.devices.currentAudioInput = 0;
      }
      if (document.querySelector("#" + this.ctx.config.view.local))
        this.ctx.localVideo = document.querySelector(
          "#" + this.ctx.config.view.local
        );
      if (document.querySelector("#" + this.ctx.config.view.remote)) {
        this.ctx.remoteMedia = document.querySelector(
          "#" + this.ctx.config.view.remote
        );
      }
      if (document.querySelector("#" + this.ctx.config.view.remote2)) {
        this.ctx.remoteMedia2 = document.querySelector(
          "#" + this.ctx.config.view.remote2
        );
      }
      logger.d(
        "finish gathering available devices: ${JSON.stringify(this.ctx.devices)}"
      );
    }

    setVideoInput(deviceId) {
      logger.d("start to set video input with " + deviceId);
      const devNumber = this.findDevice(deviceId, this.ctx.devices.videoInput);
      if (devNumber == -1) {
        throw new ELiveError({
          code: "1500",
          text: "incorrect video device. input a right video device id."
        });
        return;
      }
      this.ctx.devices.currentVideoInput = devNumber;
      this.ctx.config.media.video.deviceId = this.ctx.devices.videoInput[
        devNumber
      ].id;
      logger.d("finish to set video input with " + deviceId);
    }

    setAudioInput(deviceId) {
      logger.d("start to set audio input with " + deviceId);
      const devNumber = this.findDevice(deviceId, this.ctx.devices.audioInput);
      if (devNumber == -1) {
        throw new ELiveError({
          code: "1500",
          text: "incorrect audio device. input a right audio device id."
        });
        return;
      }
      this.ctx.devices.currentAudioInput = devNumber;
      this.ctx.config.media.audio.deviceId = this.ctx.devices.audioInput[
        devNumber
      ].id;
      logger.d("finish to set audio input with " + deviceId);
    }

    async switchCamera() {
      logger.d("start to switch camera");
      if (this.ctx.devices.videoInput.length < 2) return;
      if (
        ++this.ctx.devices.currentVideoInput ===
        this.ctx.devices.videoInput.length
      )
        this.ctx.devices.currentVideoInput = 0;
      this.showLocalVideo(
        this.ctx.devices.videoInput[this.ctx.devices.currentVideoInput].id
      );
      this.ctx.config.media.video.deviceId = {
        exact: [
          this.ctx.devices.videoInput[this.ctx.devices.currentVideoInput].id
        ]
      };
      logger.d("finish to switch camera");
    }

    muteRemote(isMute) {
      if (!this.ctx.transceivers) return;
      this.ctx.transceivers[1].receiver.track.enabled = !isMute;
      this.ctx.transceivers[0].receiver.track.enabled = !isMute;
    }
    muteLocal(isMute) {
      if (!this.ctx.transceivers) return;
      this.ctx.transceivers[1].sender.track.enabled = !isMute;
      this.ctx.transceivers[0].sender.track.enabled = !isMute;
    }

    async showLocalVideo(deviceId) {
      logger.d(`start to show localvideo with dev id ${deviceId}`);
      var stream;
      if (deviceId) {
        this.setVideoInput(deviceId);
      }
      stream = await navigator.mediaDevices.getUserMedia(this.ctx.config.media);
      if (!stream)
        throw new ELiveError({ code: "1500", text: "can not get user media" });
      // if (this.ctx.config.media.video && this.ctx.config.media.video !==false) {
      this.ctx.localVideo.srcObject = stream; //localVideo는 이제 localMedia로 이름을 바꾸는 것이 나을 듯.
      // }
      this.ctx.localStream = stream;
      this.ctx.callEvent({ name: "onDisplayUserMedia", param: stream });
      // this.ctx.evtMgr.dispatchEvent('onEvent', {name:'onDisplayUserMedia', param: stream, ctx: this.ctx})
      if (this.ctx.transceivers !== null && this.ctx.transceivers.length > 1) {
        this.ctx.transceivers[1].sender.replaceTrack(
          this.ctx.localStream.getVideoTracks()[0]
        );
      }
      logger.d(`finish to show localvideo with dev id ${deviceId}`);
    }

    findDevice(deviceId, devlist) {
      logger.d(`start find device ${deviceId}`);
      for (var i = 0; i < devlist.length; i++) {
        const dev = devlist[i];
        if (dev.id === deviceId) return i;
      }
      logger.d(`finish find device ${deviceId}`);
      return -1;
    }

    setResolution(width, height) {
      this.ctx.config.media.video.width = width;
      this.ctx.config.media.video.height = height;
      this.applyRuntime("video");
    }

    setFrameRate(frameRate) {
      this.ctx.config.media.video.frameRate = frameRate;
      this.applyRuntime("video");
    }
    // setVolume(volume) {this.devManager.setVolume(volume)}
    setAgc(isAgc) {
      this.ctx.config.media.audio.autoGainControl = isAgc;
      this.applyRuntime("audio");
    }
    setChannelCount(count) {
      this.ctx.config.media.audio.channelCount = count;
      this.applyRuntime("audio");
    }
    setEchoCancellation(isAec) {
      this.ctx.config.media.audio.echoCancellation = isAec;
      this.applyRuntime("audio");
    }
    setLatency(latency) {
      this.ctx.config.media.audio.latency = latency;
      this.applyRuntime("audio");
    }
    setNoiseSuppression(ns) {
      this.ctx.config.media.audio.noiseSuppression = ns;
      this.applyRuntime("audio");
    }
    setSampleRate(sampleRate) {
      this.ctx.config.media.audio.sampleRate = sampleRate;
      this.applyRuntime("audio");
    }
    setSampleSize(sampleSize) {
      this.ctx.config.media.audio.sampleSize = sampleSize;
      this.applyRuntime("audio");
    }
    setVolume(volume) {
      this.ctx.config.media.audio.volume = sampleRate;
      this.applyRuntime("audio");
      if (this.ctx.transceivers)
        this.ctx.transceivers[0].receiver.track.applyConstraints({
          volume: volume
        });
    }
    applyRuntime(audioOrVideo) {
      if (this.ctx.transceivers)
        if (audioOrVideo === "video")
          this.ctx.transceivers[1].sender.track.applyConstraints(
            this.ctx.config.media.video
          );
        else if (audioOrVideo === "audio")
          this.ctx.transceivers[0].sender.track.applyConstraints(
            this.ctx.config.media.audio
          );
    }
  }

  class Health {
    constructor(ctx) {
      this.interval = 5000;
      this.statsReportTimer = null;
      this.context = ctx;
    }
    stop() {
      this._clear();
    }

    start() {
      this._clear();
      this.statsReportTimer = window.setInterval(() => {
        this.context.signaler.send(
          this.context.signaler.createMessage({ command: "ping", body: {} })
        );
      }, this.interval);
    }

    _clear() {
      if (this.statsReportTimer) {
        window.clearInterval(this.statsReportTimer);
        this.statsReportTimer = null;
      }
    }
  }

  /**
   * <p>Main class for ElasticLive. It can help to make P2P call and broadcast room. It can also join the broadcast room and adjust constraints.</p>
   * <p>The order of using ELive is as follows.
   * <ul><li>Create a Config object.</li>
   * <li>Create an ELive object.</li>
   * <li>Call the call () method for communication, call the cast () method for creating a broadcast, and call the watch method when watching a broadcast.</li>
   * <li>Execute callback with elive.on ('event').</li>
   * <li>Exit the ELive object. by close ()</li>
   * </p>
   * <h1>Callback events</h1>
   * <p>ELive callback events include the following.</p>
   * <li>onDisplayUserMedia: event that occurs when taking control of the local media device.</li>
   * <li>onCall: event that occurs when the call method is succeeds. If the other peer is not yet connected, real connection is established when the onComplete event.</li>
   * <li>onComplete: event that occurs when two peers connect to each other via the call method with same room name.</li>
   * <li>onCast: event that occurs when the cast method is succeeds.</li>
   * <li>onWatch: event that occurs when the watch method is succeeds.</li>
   * <li>onMessage: event that occurs when the other peer send a message to this peer.</li>
   * <li>onSearch: event that occurs when the search methos is succeeds.</li>
   * <h1>Basic example</h1>
   * @example
   * const elive = new ELive({...})
   * elive.call('demo')
   * elive.on('onCall|onCast|onWatch|onComplete', (msg) => {})
   * ...
   * elive.close()
   *
   */
  class ELive extends events {
    /**
     * Constructor of ELive
     * @example
     * const elive = new ELive({
     *  confidential:{
     *    serviceId:'dummyId',
     *    key:'dummyKey'
     *  },
     *  view:{
     *    local: 'localVideo',
     *    remote: 'remoteVideo'
     *  }
     * })
     *
     * @param {config} config - please refer the config page
     */
    constructor(config$1) {
      super();
      try {
        /**@ignore */
        this.version = __VERSION__;
      } catch (e) {}
      if (!config$1)
        throw new ELiveError({ code: "1200", text: "no config object" });
      // if (config.sdk && config.sdk.mode === "dev")
      //   config.sdk.url = { sig: "ws://localhost:1235/sig" };
      /**@ignore */
      this.ctx = new Context();
      this.ctx.version = this.version;
      this.ctx.elive = this;
      this.ctx.config = umd(config, config$1);
      logger.init(this.ctx);
      this.ctx.callEvent = this.onEvent;
      /**@ignore */
      this.devManager = new Device(this.ctx);
      this.ctx.signaler = new Signal(this.ctx);
      if (this.ctx.config.sdk.audioType === "music") {
        this.ctx.config.rtc.opt = util.getMusicConfiguration();
      }
      util.validateConfig(this.ctx);
      this.search = this.search.bind(this);
      this.ctx.health = new Health(this.ctx);
    }

    //// main functions
    /**
     * Create or join a 1:1 room.
     * You can receive a 'onCall' and 'onComplete' callback events.
     * @param {string} name - name of 1:1 room
     */
    async call(name) {
      this.ctx.purpose = "P2P";
      if (this.ctx.devices.audioInput.length == 0)
        await this.devManager.validateDevices();
      await Auth(this.ctx);
      await this.devManager.showLocalVideo();
      await this.ctx.signaler.init();
      this.ctx.signaler.call(name);
      // make sendrecv room for call
      logger.d(`finish to call the ${name} room`);
    }

    /**
     * Create a broadcast room.
     * You can receive a 'onCast' callback event.
     * @param {string} name - name of broadcast room
     */
    async cast(name) {
      this.ctx.purpose = "CAST";
      if (this.ctx.devices.audioInput.length == 0)
        await this.devManager.validateDevices();
      await Auth(this.ctx);
      await this.devManager.showLocalVideo();
      await this.ctx.signaler.init();
      this.ctx.signaler.cast(name);
      logger.d(`finish to cast the ${name} room`);
    }

    /**
     * Participate to a broadcast room as a viewer.
     * You can receive a 'onWatch' callback event.
     * @param {string} name - name of broadcast room
     */
    async watch(name) {
      this.ctx.purpose = "CAST";
      this.ctx.remoteMedia = document.querySelector(
        "#" + this.ctx.config.view.remote
      );
      this.ctx.remoteMedia2 = document.querySelector(
        "#" + this.ctx.config.view.remote2
      );
      await Auth(this.ctx);
      await this.ctx.signaler.init();
      this.ctx.signaler.watch(name);
      logger.d(`finish to call the ${name} room`);
    }

    /**
     * Close all connection
     */
    async close() {
      if (this.ctx.state === "CLOSE" && this.ctx.peerConnection === null)
        return;
      this.ctx.state = "CLOSE";
      this.ctx.endTime = new Date().getTime();
      logger.t(this.ctx, util.makeTransactionLog(this.ctx));
      this.ctx.isConnectToSig = false;
      if (this.ctx.messaging) this.ctx.messaging.close();
      this.ctx.signaler.close();
      if (this.ctx.peerConnection)
        await this.ctx.peerConnection
          .getTransceivers()
          .forEach(t => (t.direction = "inactive"));
      if (!this.ctx.peerConnection) return;
      this.ctx.peerConnection.close();
      this.ctx.peerConnection = null;
      this.ctx.remoteStream
        .getTracks()
        .forEach(t => this.ctx.remoteStream.removeTrack(t));
      this.ctx.transceivers = null;
      this.ctx.callEvent({
        name: "onClose",
        param: { channel: this.ctx.channel }
      });
      this.ctx.health.stop();
    }

    /**
     * Send a message to a peer. It can be used for text messaging and data transfer.
     * It is only available in P2P mode yet.
     * @param {string} msg
     */
    sendMessage(msg) {
      this.ctx.messaging.sendMessage(msg);
    }
    /**
     * <p>Method for callback event to sdk users.</p>
     * <p>ELive callback events include the following.</p>
     * <li>onDisplayUserMedia: event that occurs when taking control of the local media device.</li>
     * <li>onCall: event that occurs when the call method is succeeds. If the other peer is not yet connected, real connection is established when the onComplete event.</li>
     * <li>onComplete: event that occurs when two peers connect to each other via the call method with same room name.</li>
     * <li>onCast: event that occurs when the cast method is succeeds.</li>
     * <li>onWatch: event that occurs when the watch method is succeeds.</li>
     * <li>onMessage: event that occurs when the other peer send a message to this peer.</li>
     * <li>onSearch: event that occurs when the search methos is succeeds.</li>
     * @param {EventEmitter.message} message
     */
    onEvent(message) {
      this.elive.emit(message.name, message.param);
    }

    //// functions for configurations
    setVideoQuality(quality) {}
    /// local video
    /** Set the framerate value. It is selectable from 10 to 30. */
    setFrameRate(frameRate) {
      this.devManager.setFrameRate(frameRate);
    }
    /** Set the resolution value. It is selectable from 240p to 1280p. Default value is a (640,480) */
    setResolution(width, height) {
      this.devManager.setResolution(width, height);
    }
    /// local audio
    /** Set the AutoGainControl value. Default value is a true. */
    setAgc(isAgc) {
      this.devManager.setAgc(isAgc);
    }
    /** Set the number of audio channel. Default value is 2. */
    setChannelCount(count) {
      this.devManager.setChannelCount(count);
    }
    /** Set the echo canellation value. Default value is a true. */
    setEchoCancellation(isAec) {
      this.devManager.setEchoCancellation(isAec);
    }
    /** Set the echo latency of audio. */
    setLatency(latency) {
      this.devManager.setLatency(latency);
    }
    /** Set the noise suppression value. Default value is a true. */
    setNoiseSuppression(ns) {
      this.devManager.setNoiseSuppression(ns);
    }
    setSampleSize(sampleSize) {
      this.devManager.setSampleSize(sampleSize);
    }
    setSampleRate(sampleRate) {
      this.devManager.setSampleRate(sampleRate);
    }
    /** volume value should be number from 0.0 to 1.0. */
    setVolume(volume) {
      this.devManager.setVolume(volume);
    }

    //// device management functions
    /** Capture the screen and use it as the source of local media. */
    async captureScreen() {
      this.devManager.captureScreen();
    }
    /** Stop the captureScreen */
    stopCaptureScreen() {
      this.devManager.stopCaptureScreen();
    }
    /** Use a specific video input device as local media. You can gather a device list from getDevices()*/
    async setVideoInput(deviceId) {
      if (this.ctx.devices.audioInput.length == 0)
        await this.devManager.validateDevices();
      this.devManager.setVideoInput(deviceId);
    }
    /** Use a specific audio input device as local media. You can gather a device list from getDevices()*/
    async setAudioInput(deviceId) {
      if (this.ctx.devices.audioInput.length == 0)
        await this.devManager.validateDevices();
      this.devManager.setAudioInput(deviceId);
    }
    /** Use this when you want to display the local input device in the local video tag before calling call or cast method. */
    async showLocalVideo(deviceId) {
      if (this.ctx.devices.audioInput.length == 0)
        await this.devManager.validateDevices();
      await this.devManager.showLocalVideo(deviceId);
    }
    /** If there is more than one camera, switch it. */
    async switchCamera() {
      if (this.ctx.devices.audioInput.length == 0)
        await this.devManager.validateDevices();
      this.devManager.switchCamera();
    }
    /**
     * Mute remote media
     * @param {boolean} isMute
     */
    muteRemote(isMute) {
      this.devManager.muteRemote(isMute);
    }
    /**
     * Mute local media
     * @param {boolean} isMute
     */
    muteLocal(isMute) {
      this.devManager.muteLocal(isMute);
    }

    /** Get list of all local media devices such as video, speaker and mic. */
    getDevices() {
      return this.ctx.devices;
    }

    //// functions for information
    /** Get the quality of the stream realtime. WebRTC is variable in quality depending on network conditions.*/
    getHealth() {}
    getState() {}
    /** Get a room id */
    getRoomId() {
      return this.ctx.channel.id;
    }

    /**
     * Search the room of the current service. If there is no parameter, it searches all rooms of the service.
     * @param {string} id - search keyword for room
     */
    async search(id) {
      this.ctx.purpose = "CAST";
      if (!this.ctx) return;
      if (this.ctx.signaler && !this.ctx.isConnectToSig) {
        await Auth(this.ctx);
        await this.ctx.signaler.init();
      }
      if (this.ctx && this.ctx.signaler) this.ctx.signaler.search(id);
    }

    status() {
      var status = {
        version: this.version,
        platform: platform.name,
        platformVersion: platform.version
      };
      return status;
    }
  }
  try {
    ELive.version = __VERSION__;
    ELive.env = __ENV__;
  } catch (e) {
    ELive.version = "3.0.0";
    ELive.env = {};
  }

  return ELive;
});
//# sourceMappingURL=ELive.js.map

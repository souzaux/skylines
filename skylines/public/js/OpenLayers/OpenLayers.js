/*

  OpenLayers.js -- OpenLayers Map Viewer Library

  Copyright (c) 2006-2012 by OpenLayers Contributors
  Published under the 2-clause BSD license.
  See http://openlayers.org/dev/license.txt for the full text of the license, and http://openlayers.org/dev/authors.txt for full list of contributors.

  Includes compressed code under the following licenses:

  (For uncompressed versions of the code used, please see the
  OpenLayers Github repository: <https://github.com/openlayers/openlayers>)

*/

/**
 * Contains XMLHttpRequest.js <http://code.google.com/p/xmlhttprequest/>
 * Copyright 2007 Sergey Ilinsky (http://www.ilinsky.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * OpenLayers.Util.pagePosition is based on Yahoo's getXY method, which is
 * Copyright (c) 2006, Yahoo! Inc.
 * All rights reserved.
 * 
 * Redistribution and use of this software in source and binary forms, with or
 * without modification, are permitted provided that the following conditions
 * are met:
 * 
 * * Redistributions of source code must retain the above copyright notice,
 *   this list of conditions and the following disclaimer.
 * 
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 * 
 * * Neither the name of Yahoo! Inc. nor the names of its contributors may be
 *   used to endorse or promote products derived from this software without
 *   specific prior written permission of Yahoo! Inc.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE 
 * POSSIBILITY OF SUCH DAMAGE.
 */
/* ======================================================================
    OpenLayers/SingleFile.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

var OpenLayers = {
    /**
     * Constant: VERSION_NUMBER
     */
    VERSION_NUMBER: "Release 2.12-rc5",

    /**
     * Constant: singleFile
     * TODO: remove this in 3.0 when we stop supporting build profiles that
     * include OpenLayers.js
     */
    singleFile: true,

    /**
     * Method: _getScriptLocation
     * Return the path to this script. This is also implemented in
     * OpenLayers.js
     *
     * Returns:
     * {String} Path to this script
     */
    _getScriptLocation: (function() {
        var r = new RegExp("(^|(.*?\\/))(OpenLayers[^\\/]*?\\.js)(\\?|$)"),
            s = document.getElementsByTagName('script'),
            src, m, l = "";
        for(var i=0, len=s.length; i<len; i++) {
            src = s[i].getAttribute('src');
            if(src) {
                m = src.match(r);
                if(m) {
                    l = m[1];
                    break;
                }
            }
        }
        return (function() { return l; });
    })(),
    
    /**
     * Property: ImgPath
     * {String} Set this to the path where control images are stored, a path  
     * given here must end with a slash. If set to '' (which is the default) 
     * OpenLayers will use its script location + "img/".
     * 
     * You will need to set this property when you have a singlefile build of 
     * OpenLayers that either is not named "OpenLayers.js" or if you move
     * the file in a way such that the image directory cannot be derived from 
     * the script location.
     * 
     * If your custom OpenLayers build is named "my-custom-ol.js" and the images
     * of OpenLayers are in a folder "/resources/external/images/ol" a correct
     * way of including OpenLayers in your HTML would be:
     * 
     * (code)
     *   <script src="/path/to/my-custom-ol.js" type="text/javascript"></script>
     *   <script type="text/javascript">
     *      // tell OpenLayers where the control images are
     *      // remember the trailing slash
     *      OpenLayers.ImgPath = "/resources/external/images/ol/";
     *   </script>
     * (end code)
     * 
     * Please remember that when your OpenLayers script is not named 
     * "OpenLayers.js" you will have to make sure that the default theme is 
     * loaded into the page by including an appropriate <link>-tag, 
     * e.g.:
     * 
     * (code)
     *   <link rel="stylesheet" href="/path/to/default/style.css"  type="text/css">
     * (end code)
     */
    ImgPath : ''
};
/* ======================================================================
    OpenLayers/BaseTypes/Class.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/SingleFile.js
 */

/**
 * Constructor: OpenLayers.Class
 * Base class used to construct all other classes. Includes support for 
 *     multiple inheritance. 
 *     
 * This constructor is new in OpenLayers 2.5.  At OpenLayers 3.0, the old 
 *     syntax for creating classes and dealing with inheritance 
 *     will be removed.
 * 
 * To create a new OpenLayers-style class, use the following syntax:
 * (code)
 *     var MyClass = OpenLayers.Class(prototype);
 * (end)
 *
 * To create a new OpenLayers-style class with multiple inheritance, use the
 *     following syntax:
 * (code)
 *     var MyClass = OpenLayers.Class(Class1, Class2, prototype);
 * (end)
 * 
 * Note that instanceof reflection will only reveal Class1 as superclass.
 *
 */
OpenLayers.Class = function() {
    var len = arguments.length;
    var P = arguments[0];
    var F = arguments[len-1];

    var C = typeof F.initialize == "function" ?
        F.initialize :
        function(){ P.prototype.initialize.apply(this, arguments); };

    if (len > 1) {
        var newArgs = [C, P].concat(
                Array.prototype.slice.call(arguments).slice(1, len-1), F);
        OpenLayers.inherit.apply(null, newArgs);
    } else {
        C.prototype = F;
    }
    return C;
};

/**
 * Function: OpenLayers.inherit
 *
 * Parameters:
 * C - {Object} the class that inherits
 * P - {Object} the superclass to inherit from
 *
 * In addition to the mandatory C and P parameters, an arbitrary number of
 * objects can be passed, which will extend C.
 */
OpenLayers.inherit = function(C, P) {
   var F = function() {};
   F.prototype = P.prototype;
   C.prototype = new F;
   var i, l, o;
   for(i=2, l=arguments.length; i<l; i++) {
       o = arguments[i];
       if(typeof o === "function") {
           o = o.prototype;
       }
       OpenLayers.Util.extend(C.prototype, o);
   }
};

/**
 * APIFunction: extend
 * Copy all properties of a source object to a destination object.  Modifies
 *     the passed in destination object.  Any properties on the source object
 *     that are set to undefined will not be (re)set on the destination object.
 *
 * Parameters:
 * destination - {Object} The object that will be modified
 * source - {Object} The object with properties to be set on the destination
 *
 * Returns:
 * {Object} The destination object.
 */
OpenLayers.Util = OpenLayers.Util || {};
OpenLayers.Util.extend = function(destination, source) {
    destination = destination || {};
    if (source) {
        for (var property in source) {
            var value = source[property];
            if (value !== undefined) {
                destination[property] = value;
            }
        }

        /**
         * IE doesn't include the toString property when iterating over an object's
         * properties with the for(property in object) syntax.  Explicitly check if
         * the source has its own toString property.
         */

        /*
         * FF/Windows < 2.0.0.13 reports "Illegal operation on WrappedNative
         * prototype object" when calling hawOwnProperty if the source object
         * is an instance of window.Event.
         */

        var sourceIsEvt = typeof window.Event == "function"
                          && source instanceof window.Event;

        if (!sourceIsEvt
           && source.hasOwnProperty && source.hasOwnProperty("toString")) {
            destination.toString = source.toString;
        }
    }
    return destination;
};
/* ======================================================================
    OpenLayers/BaseTypes.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/SingleFile.js
 */

/** 
 * Header: OpenLayers Base Types
 * OpenLayers custom string, number and function functions are described here.
 */

/**
 * Namespace: OpenLayers.String
 * Contains convenience functions for string manipulation.
 */
OpenLayers.String = {

    /**
     * APIFunction: startsWith
     * Test whether a string starts with another string. 
     * 
     * Parameters:
     * str - {String} The string to test.
     * sub - {String} The substring to look for.
     *  
     * Returns:
     * {Boolean} The first string starts with the second.
     */
    startsWith: function(str, sub) {
        return (str.indexOf(sub) == 0);
    },

    /**
     * APIFunction: contains
     * Test whether a string contains another string.
     * 
     * Parameters:
     * str - {String} The string to test.
     * sub - {String} The substring to look for.
     * 
     * Returns:
     * {Boolean} The first string contains the second.
     */
    contains: function(str, sub) {
        return (str.indexOf(sub) != -1);
    },
    
    /**
     * APIFunction: trim
     * Removes leading and trailing whitespace characters from a string.
     * 
     * Parameters:
     * str - {String} The (potentially) space padded string.  This string is not
     *     modified.
     * 
     * Returns:
     * {String} A trimmed version of the string with all leading and 
     *     trailing spaces removed.
     */
    trim: function(str) {
        return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    },
    
    /**
     * APIFunction: camelize
     * Camel-case a hyphenated string. 
     *     Ex. "chicken-head" becomes "chickenHead", and
     *     "-chicken-head" becomes "ChickenHead".
     *
     * Parameters:
     * str - {String} The string to be camelized.  The original is not modified.
     * 
     * Returns:
     * {String} The string, camelized
     */
    camelize: function(str) {
        var oStringList = str.split('-');
        var camelizedString = oStringList[0];
        for (var i=1, len=oStringList.length; i<len; i++) {
            var s = oStringList[i];
            camelizedString += s.charAt(0).toUpperCase() + s.substring(1);
        }
        return camelizedString;
    },
    
    /**
     * APIFunction: format
     * Given a string with tokens in the form ${token}, return a string
     *     with tokens replaced with properties from the given context
     *     object.  Represent a literal "${" by doubling it, e.g. "${${".
     *
     * Parameters:
     * template - {String} A string with tokens to be replaced.  A template
     *     has the form "literal ${token}" where the token will be replaced
     *     by the value of context["token"].
     * context - {Object} An optional object with properties corresponding
     *     to the tokens in the format string.  If no context is sent, the
     *     window object will be used.
     * args - {Array} Optional arguments to pass to any functions found in
     *     the context.  If a context property is a function, the token
     *     will be replaced by the return from the function called with
     *     these arguments.
     *
     * Returns:
     * {String} A string with tokens replaced from the context object.
     */
    format: function(template, context, args) {
        if(!context) {
            context = window;
        }

        // Example matching: 
        // str   = ${foo.bar}
        // match = foo.bar
        var replacer = function(str, match) {
            var replacement;

            // Loop through all subs. Example: ${a.b.c}
            // 0 -> replacement = context[a];
            // 1 -> replacement = context[a][b];
            // 2 -> replacement = context[a][b][c];
            var subs = match.split(/\.+/);
            for (var i=0; i< subs.length; i++) {
                if (i == 0) {
                    replacement = context;
                }

                replacement = replacement[subs[i]];
            }

            if(typeof replacement == "function") {
                replacement = args ?
                    replacement.apply(null, args) :
                    replacement();
            }

            // If replacement is undefined, return the string 'undefined'.
            // This is a workaround for a bugs in browsers not properly 
            // dealing with non-participating groups in regular expressions:
            // http://blog.stevenlevithan.com/archives/npcg-javascript
            if (typeof replacement == 'undefined') {
                return 'undefined';
            } else {
                return replacement; 
            }
        };

        return template.replace(OpenLayers.String.tokenRegEx, replacer);
    },

    /**
     * Property: tokenRegEx
     * Used to find tokens in a string.
     * Examples: ${a}, ${a.b.c}, ${a-b}, ${5}
     */
    tokenRegEx:  /\$\{([\w.]+?)\}/g,
    
    /**
     * Property: numberRegEx
     * Used to test strings as numbers.
     */
    numberRegEx: /^([+-]?)(?=\d|\.\d)\d*(\.\d*)?([Ee]([+-]?\d+))?$/,
    
    /**
     * APIFunction: isNumeric
     * Determine whether a string contains only a numeric value.
     *
     * Examples:
     * (code)
     * OpenLayers.String.isNumeric("6.02e23") // true
     * OpenLayers.String.isNumeric("12 dozen") // false
     * OpenLayers.String.isNumeric("4") // true
     * OpenLayers.String.isNumeric(" 4 ") // false
     * (end)
     *
     * Returns:
     * {Boolean} String contains only a number.
     */
    isNumeric: function(value) {
        return OpenLayers.String.numberRegEx.test(value);
    },
    
    /**
     * APIFunction: numericIf
     * Converts a string that appears to be a numeric value into a number.
     * 
     * Parameters:
     * value - {String}
     * trimWhitespace - {Boolean}
     *
     * Returns:
     * {Number|String} a Number if the passed value is a number, a String
     *     otherwise. 
     */
    numericIf: function(value, trimWhitespace) {
        var originalValue = value;
        if (trimWhitespace === true && value != null && value.replace) {
            value = value.replace(/^\s*|\s*$/g, "");
        }
        return OpenLayers.String.isNumeric(value) ? parseFloat(value) : originalValue;
    }

};

/**
 * Namespace: OpenLayers.Number
 * Contains convenience functions for manipulating numbers.
 */
OpenLayers.Number = {

    /**
     * Property: decimalSeparator
     * Decimal separator to use when formatting numbers.
     */
    decimalSeparator: ".",
    
    /**
     * Property: thousandsSeparator
     * Thousands separator to use when formatting numbers.
     */
    thousandsSeparator: ",",
    
    /**
     * APIFunction: limitSigDigs
     * Limit the number of significant digits on a float.
     * 
     * Parameters:
     * num - {Float}
     * sig - {Integer}
     * 
     * Returns:
     * {Float} The number, rounded to the specified number of significant
     *     digits.
     */
    limitSigDigs: function(num, sig) {
        var fig = 0;
        if (sig > 0) {
            fig = parseFloat(num.toPrecision(sig));
        }
        return fig;
    },
    
    /**
     * APIFunction: format
     * Formats a number for output.
     * 
     * Parameters:
     * num  - {Float}
     * dec  - {Integer} Number of decimal places to round to.
     *        Defaults to 0. Set to null to leave decimal places unchanged.
     * tsep - {String} Thousands separator.
     *        Default is ",".
     * dsep - {String} Decimal separator.
     *        Default is ".".
     *
     * Returns:
     * {String} A string representing the formatted number.
     */
    format: function(num, dec, tsep, dsep) {
        dec = (typeof dec != "undefined") ? dec : 0; 
        tsep = (typeof tsep != "undefined") ? tsep :
            OpenLayers.Number.thousandsSeparator; 
        dsep = (typeof dsep != "undefined") ? dsep :
            OpenLayers.Number.decimalSeparator;

        if (dec != null) {
            num = parseFloat(num.toFixed(dec));
        }

        var parts = num.toString().split(".");
        if (parts.length == 1 && dec == null) {
            // integer where we do not want to touch the decimals
            dec = 0;
        }
        
        var integer = parts[0];
        if (tsep) {
            var thousands = /(-?[0-9]+)([0-9]{3})/; 
            while(thousands.test(integer)) { 
                integer = integer.replace(thousands, "$1" + tsep + "$2"); 
            }
        }
        
        var str;
        if (dec == 0) {
            str = integer;
        } else {
            var rem = parts.length > 1 ? parts[1] : "0";
            if (dec != null) {
                rem = rem + new Array(dec - rem.length + 1).join("0");
            }
            str = integer + dsep + rem;
        }
        return str;
    }
};

/**
 * Namespace: OpenLayers.Function
 * Contains convenience functions for function manipulation.
 */
OpenLayers.Function = {
    /**
     * APIFunction: bind
     * Bind a function to an object.  Method to easily create closures with
     *     'this' altered.
     * 
     * Parameters:
     * func - {Function} Input function.
     * object - {Object} The object to bind to the input function (as this).
     * 
     * Returns:
     * {Function} A closure with 'this' set to the passed in object.
     */
    bind: function(func, object) {
        // create a reference to all arguments past the second one
        var args = Array.prototype.slice.apply(arguments, [2]);
        return function() {
            // Push on any additional arguments from the actual function call.
            // These will come after those sent to the bind call.
            var newArgs = args.concat(
                Array.prototype.slice.apply(arguments, [0])
            );
            return func.apply(object, newArgs);
        };
    },
    
    /**
     * APIFunction: bindAsEventListener
     * Bind a function to an object, and configure it to receive the event
     *     object as first parameter when called. 
     * 
     * Parameters:
     * func - {Function} Input function to serve as an event listener.
     * object - {Object} A reference to this.
     * 
     * Returns:
     * {Function}
     */
    bindAsEventListener: function(func, object) {
        return function(event) {
            return func.call(object, event || window.event);
        };
    },
    
    /**
     * APIFunction: False
     * A simple function to that just does "return false". We use this to 
     * avoid attaching anonymous functions to DOM event handlers, which 
     * causes "issues" on IE<8.
     * 
     * Usage:
     * document.onclick = OpenLayers.Function.False;
     * 
     * Returns:
     * {Boolean}
     */
    False : function() {
        return false;
    },

    /**
     * APIFunction: True
     * A simple function to that just does "return true". We use this to 
     * avoid attaching anonymous functions to DOM event handlers, which 
     * causes "issues" on IE<8.
     * 
     * Usage:
     * document.onclick = OpenLayers.Function.True;
     * 
     * Returns:
     * {Boolean}
     */
    True : function() {
        return true;
    },
    
    /**
     * APIFunction: Void
     * A reusable function that returns ``undefined``.
     *
     * Returns:
     * {undefined}
     */
    Void: function() {}

};

/**
 * Namespace: OpenLayers.Array
 * Contains convenience functions for array manipulation.
 */
OpenLayers.Array = {

    /**
     * APIMethod: filter
     * Filter an array.  Provides the functionality of the
     *     Array.prototype.filter extension to the ECMA-262 standard.  Where
     *     available, Array.prototype.filter will be used.
     *
     * Based on well known example from http://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/filter
     *
     * Parameters:
     * array - {Array} The array to be filtered.  This array is not mutated.
     *     Elements added to this array by the callback will not be visited.
     * callback - {Function} A function that is called for each element in
     *     the array.  If this function returns true, the element will be
     *     included in the return.  The function will be called with three
     *     arguments: the element in the array, the index of that element, and
     *     the array itself.  If the optional caller parameter is specified
     *     the callback will be called with this set to caller.
     * caller - {Object} Optional object to be set as this when the callback
     *     is called.
     *
     * Returns:
     * {Array} An array of elements from the passed in array for which the
     *     callback returns true.
     */
    filter: function(array, callback, caller) {
        var selected = [];
        if (Array.prototype.filter) {
            selected = array.filter(callback, caller);
        } else {
            var len = array.length;
            if (typeof callback != "function") {
                throw new TypeError();
            }
            for(var i=0; i<len; i++) {
                if (i in array) {
                    var val = array[i];
                    if (callback.call(caller, val, i, array)) {
                        selected.push(val);
                    }
                }
            }        
        }
        return selected;
    }
    
};
/* ======================================================================
    OpenLayers/BaseTypes/Bounds.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/BaseTypes/Class.js
 */

/**
 * Class: OpenLayers.Bounds
 * Instances of this class represent bounding boxes.  Data stored as left,
 * bottom, right, top floats. All values are initialized to null, however,
 * you should make sure you set them before using the bounds for anything.
 * 
 * Possible use case:
 * (code)
 *     bounds = new OpenLayers.Bounds();
 *     bounds.extend(new OpenLayers.LonLat(4,5));
 *     bounds.extend(new OpenLayers.LonLat(5,6));
 *     bounds.toBBOX(); // returns 4,5,5,6
 * (end)
 */
OpenLayers.Bounds = OpenLayers.Class({

    /**
     * Property: left
     * {Number} Minimum horizontal coordinate.
     */
    left: null,

    /**
     * Property: bottom
     * {Number} Minimum vertical coordinate.
     */
    bottom: null,

    /**
     * Property: right
     * {Number} Maximum horizontal coordinate.
     */
    right: null,

    /**
     * Property: top
     * {Number} Maximum vertical coordinate.
     */
    top: null,
    
    /**
     * Property: centerLonLat
     * {<OpenLayers.LonLat>} A cached center location.  This should not be
     *     accessed directly.  Use <getCenterLonLat> instead.
     */
    centerLonLat: null,

    /**
     * Constructor: OpenLayers.Bounds
     * Construct a new bounds object. Coordinates can either be passed as four
     * arguments, or as a single argument.
     *
     * Parameters (four arguments):
     * left - {Number} The left bounds of the box.  Note that for width
     *        calculations, this is assumed to be less than the right value.
     * bottom - {Number} The bottom bounds of the box.  Note that for height
     *          calculations, this is assumed to be more than the top value.
     * right - {Number} The right bounds.
     * top - {Number} The top bounds.
     *
     * Parameters (single argument):
     * bounds - {Array(Number)} [left, bottom, right, top]
     */
    initialize: function(left, bottom, right, top) {
        if (OpenLayers.Util.isArray(left)) {
            top = left[3];
            right = left[2];
            bottom = left[1];
            left = left[0];
        }
        if (left != null) {
            this.left = OpenLayers.Util.toFloat(left);
        }
        if (bottom != null) {
            this.bottom = OpenLayers.Util.toFloat(bottom);
        }
        if (right != null) {
            this.right = OpenLayers.Util.toFloat(right);
        }
        if (top != null) {
            this.top = OpenLayers.Util.toFloat(top);
        }
    },

    /**
     * Method: clone
     * Create a cloned instance of this bounds.
     *
     * Returns:
     * {<OpenLayers.Bounds>} A fresh copy of the bounds
     */
    clone:function() {
        return new OpenLayers.Bounds(this.left, this.bottom, 
                                     this.right, this.top);
    },

    /**
     * Method: equals
     * Test a two bounds for equivalence.
     *
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     *
     * Returns:
     * {Boolean} The passed-in bounds object has the same left,
     *           right, top, bottom components as this.  Note that if bounds 
     *           passed in is null, returns false.
     */
    equals:function(bounds) {
        var equals = false;
        if (bounds != null) {
            equals = ((this.left == bounds.left) && 
                      (this.right == bounds.right) &&
                      (this.top == bounds.top) && 
                      (this.bottom == bounds.bottom));
        }
        return equals;
    },

    /** 
     * APIMethod: toString
     * 
     * Returns:
     * {String} String representation of bounds object. 
     */
    toString:function() {
        return [this.left, this.bottom, this.right, this.top].join(",");
    },

    /**
     * APIMethod: toArray
     *
     * Parameters:
     * reverseAxisOrder - {Boolean} Should we reverse the axis order?
     *
     * Returns:
     * {Array} array of left, bottom, right, top
     */
    toArray: function(reverseAxisOrder) {
        if (reverseAxisOrder === true) {
            return [this.bottom, this.left, this.top, this.right];
        } else {
            return [this.left, this.bottom, this.right, this.top];
        }
    },    

    /** 
     * APIMethod: toBBOX
     * 
     * Parameters:
     * decimal - {Integer} How many significant digits in the bbox coords?
     *                     Default is 6
     * reverseAxisOrder - {Boolean} Should we reverse the axis order?
     * 
     * Returns:
     * {String} Simple String representation of bounds object.
     *          (e.g. <i>"5,42,10,45"</i>)
     */
    toBBOX:function(decimal, reverseAxisOrder) {
        if (decimal== null) {
            decimal = 6; 
        }
        var mult = Math.pow(10, decimal);
        var xmin = Math.round(this.left * mult) / mult;
        var ymin = Math.round(this.bottom * mult) / mult;
        var xmax = Math.round(this.right * mult) / mult;
        var ymax = Math.round(this.top * mult) / mult;
        if (reverseAxisOrder === true) {
            return ymin + "," + xmin + "," + ymax + "," + xmax;
        } else {
            return xmin + "," + ymin + "," + xmax + "," + ymax;
        }
    },
 
    /**
     * APIMethod: toGeometry
     * Create a new polygon geometry based on this bounds.
     *
     * Returns:
     * {<OpenLayers.Geometry.Polygon>} A new polygon with the coordinates
     *     of this bounds.
     */
    toGeometry: function() {
        return new OpenLayers.Geometry.Polygon([
            new OpenLayers.Geometry.LinearRing([
                new OpenLayers.Geometry.Point(this.left, this.bottom),
                new OpenLayers.Geometry.Point(this.right, this.bottom),
                new OpenLayers.Geometry.Point(this.right, this.top),
                new OpenLayers.Geometry.Point(this.left, this.top)
            ])
        ]);
    },
    
    /**
     * APIMethod: getWidth
     * 
     * Returns:
     * {Float} The width of the bounds
     */
    getWidth:function() {
        return (this.right - this.left);
    },

    /**
     * APIMethod: getHeight
     * 
     * Returns:
     * {Float} The height of the bounds (top minus bottom).
     */
    getHeight:function() {
        return (this.top - this.bottom);
    },

    /**
     * APIMethod: getSize
     * 
     * Returns:
     * {<OpenLayers.Size>} The size of the box.
     */
    getSize:function() {
        return new OpenLayers.Size(this.getWidth(), this.getHeight());
    },

    /**
     * APIMethod: getCenterPixel
     * 
     * Returns:
     * {<OpenLayers.Pixel>} The center of the bounds in pixel space.
     */
    getCenterPixel:function() {
        return new OpenLayers.Pixel( (this.left + this.right) / 2,
                                     (this.bottom + this.top) / 2);
    },

    /**
     * APIMethod: getCenterLonLat
     * 
     * Returns:
     * {<OpenLayers.LonLat>} The center of the bounds in map space.
     */
    getCenterLonLat:function() {
        if(!this.centerLonLat) {
            this.centerLonLat = new OpenLayers.LonLat(
                (this.left + this.right) / 2, (this.bottom + this.top) / 2
            );
        }
        return this.centerLonLat;
    },

    /**
     * APIMethod: scale
     * Scales the bounds around a pixel or lonlat. Note that the new 
     *     bounds may return non-integer properties, even if a pixel
     *     is passed. 
     * 
     * Parameters:
     * ratio - {Float} 
     * origin - {<OpenLayers.Pixel> or <OpenLayers.LonLat>}
     *          Default is center.
     *
     * Returns:
     * {<OpenLayers.Bounds>} A new bounds that is scaled by ratio
     *                      from origin.
     */
    scale: function(ratio, origin){
        if(origin == null){
            origin = this.getCenterLonLat();
        }
        
        var origx,origy;

        // get origin coordinates
        if(origin.CLASS_NAME == "OpenLayers.LonLat"){
            origx = origin.lon;
            origy = origin.lat;
        } else {
            origx = origin.x;
            origy = origin.y;
        }

        var left = (this.left - origx) * ratio + origx;
        var bottom = (this.bottom - origy) * ratio + origy;
        var right = (this.right - origx) * ratio + origx;
        var top = (this.top - origy) * ratio + origy;
        
        return new OpenLayers.Bounds(left, bottom, right, top);
    },

    /**
     * APIMethod: add
     * 
     * Parameters:
     * x - {Float}
     * y - {Float}
     * 
     * Returns:
     * {<OpenLayers.Bounds>} A new bounds whose coordinates are the same as
     *     this, but shifted by the passed-in x and y values.
     */
    add:function(x, y) {
        if ( (x == null) || (y == null) ) {
            throw new TypeError('Bounds.add cannot receive null values');
        }
        return new OpenLayers.Bounds(this.left + x, this.bottom + y,
                                     this.right + x, this.top + y);
    },
    
    /**
     * APIMethod: extend
     * Extend the bounds to include the point, lonlat, or bounds specified.
     *     Note, this function assumes that left < right and bottom < top.
     * 
     * Parameters: 
     * object - {Object} Can be LonLat, Point, or Bounds
     */
    extend:function(object) {
        var bounds = null;
        if (object) {
            // clear cached center location
            switch(object.CLASS_NAME) {
                case "OpenLayers.LonLat":    
                    bounds = new OpenLayers.Bounds(object.lon, object.lat,
                                                    object.lon, object.lat);
                    break;
                case "OpenLayers.Geometry.Point":
                    bounds = new OpenLayers.Bounds(object.x, object.y,
                                                    object.x, object.y);
                    break;
                    
                case "OpenLayers.Bounds":    
                    bounds = object;
                    break;
            }
    
            if (bounds) {
                this.centerLonLat = null;
                if ( (this.left == null) || (bounds.left < this.left)) {
                    this.left = bounds.left;
                }
                if ( (this.bottom == null) || (bounds.bottom < this.bottom) ) {
                    this.bottom = bounds.bottom;
                } 
                if ( (this.right == null) || (bounds.right > this.right) ) {
                    this.right = bounds.right;
                }
                if ( (this.top == null) || (bounds.top > this.top) ) { 
                    this.top = bounds.top;
                }
            }
        }
    },

    /**
     * APIMethod: containsLonLat
     * 
     * Parameters:
     * ll - {<OpenLayers.LonLat>|Object} OpenLayers.LonLat or an
     *     object with a 'lon' and 'lat' properties.
     * options - {Object} Optional parameters
     *
     * Acceptable options:
     * inclusive - {Boolean} Whether or not to include the border.
     *     Default is true.
     * worldBounds - {<OpenLayers.Bounds>} If a worldBounds is provided, the
     *     ll will be considered as contained if it exceeds the world bounds,
     *     but can be wrapped around the dateline so it is contained by this
     *     bounds.
     *
     * Returns:
     * {Boolean} The passed-in lonlat is within this bounds.
     */
    containsLonLat: function(ll, options) {
        if (typeof options === "boolean") {
            options =  {inclusive: options};
        }
        options = options || {};
        var contains = this.contains(ll.lon, ll.lat, options.inclusive),
            worldBounds = options.worldBounds;
        if (worldBounds && !contains) {
            var worldWidth = worldBounds.getWidth();
            var worldCenterX = (worldBounds.left + worldBounds.right) / 2;
            var worldsAway = Math.round((ll.lon - worldCenterX) / worldWidth);
            contains = this.containsLonLat({
                lon: ll.lon - worldsAway * worldWidth,
                lat: ll.lat
            }, {inclusive: options.inclusive});
        }
        return contains;
    },

    /**
     * APIMethod: containsPixel
     * 
     * Parameters:
     * px - {<OpenLayers.Pixel>}
     * inclusive - {Boolean} Whether or not to include the border. Default is
     *     true.
     *
     * Returns:
     * {Boolean} The passed-in pixel is within this bounds.
     */
    containsPixel:function(px, inclusive) {
        return this.contains(px.x, px.y, inclusive);
    },
    
    /**
     * APIMethod: contains
     * 
     * Parameters:
     * x - {Float}
     * y - {Float}
     * inclusive - {Boolean} Whether or not to include the border. Default is
     *     true.
     *
     * Returns:
     * {Boolean} Whether or not the passed-in coordinates are within this
     *     bounds.
     */
    contains:function(x, y, inclusive) {
        //set default
        if (inclusive == null) {
            inclusive = true;
        }

        if (x == null || y == null) {
            return false;
        }

        x = OpenLayers.Util.toFloat(x);
        y = OpenLayers.Util.toFloat(y);

        var contains = false;
        if (inclusive) {
            contains = ((x >= this.left) && (x <= this.right) && 
                        (y >= this.bottom) && (y <= this.top));
        } else {
            contains = ((x > this.left) && (x < this.right) && 
                        (y > this.bottom) && (y < this.top));
        }              
        return contains;
    },

    /**
     * APIMethod: intersectsBounds
     * Determine whether the target bounds intersects this bounds.  Bounds are
     *     considered intersecting if any of their edges intersect or if one
     *     bounds contains the other.
     * 
     * Parameters:
     * bounds - {<OpenLayers.Bounds>} The target bounds.
     * options - {Object} Optional parameters.
     * 
     * Acceptable options:
     * inclusive - {Boolean} Treat coincident borders as intersecting.  Default
     *     is true.  If false, bounds that do not overlap but only touch at the
     *     border will not be considered as intersecting.
     * worldBounds - {<OpenLayers.Bounds>} If a worldBounds is provided, two
     *     bounds will be considered as intersecting if they intersect when 
     *     shifted to within the world bounds.  This applies only to bounds that
     *     cross or are completely outside the world bounds.
     *
     * Returns:
     * {Boolean} The passed-in bounds object intersects this bounds.
     */
    intersectsBounds:function(bounds, options) {
        if (typeof options === "boolean") {
            options =  {inclusive: options};
        }
        options = options || {};
        if (options.worldBounds) {
            var self = this.wrapDateLine(options.worldBounds);
            bounds = bounds.wrapDateLine(options.worldBounds);
        } else {
            self = this;
        }
        if (options.inclusive == null) {
            options.inclusive = true;
        }
        var intersects = false;
        var mightTouch = (
            self.left == bounds.right ||
            self.right == bounds.left ||
            self.top == bounds.bottom ||
            self.bottom == bounds.top
        );
        
        // if the two bounds only touch at an edge, and inclusive is false,
        // then the bounds don't *really* intersect.
        if (options.inclusive || !mightTouch) {
            // otherwise, if one of the boundaries even partially contains another,
            // inclusive of the edges, then they do intersect.
            var inBottom = (
                ((bounds.bottom >= self.bottom) && (bounds.bottom <= self.top)) ||
                ((self.bottom >= bounds.bottom) && (self.bottom <= bounds.top))
            );
            var inTop = (
                ((bounds.top >= self.bottom) && (bounds.top <= self.top)) ||
                ((self.top > bounds.bottom) && (self.top < bounds.top))
            );
            var inLeft = (
                ((bounds.left >= self.left) && (bounds.left <= self.right)) ||
                ((self.left >= bounds.left) && (self.left <= bounds.right))
            );
            var inRight = (
                ((bounds.right >= self.left) && (bounds.right <= self.right)) ||
                ((self.right >= bounds.left) && (self.right <= bounds.right))
            );
            intersects = ((inBottom || inTop) && (inLeft || inRight));
        }
        // document me
        if (options.worldBounds && !intersects) {
            var world = options.worldBounds;
            var width = world.getWidth();
            var selfCrosses = !world.containsBounds(self);
            var boundsCrosses = !world.containsBounds(bounds);
            if (selfCrosses && !boundsCrosses) {
                bounds = bounds.add(-width, 0);
                intersects = self.intersectsBounds(bounds, {inclusive: options.inclusive});
            } else if (boundsCrosses && !selfCrosses) {
                self = self.add(-width, 0);
                intersects = bounds.intersectsBounds(self, {inclusive: options.inclusive});                
            }
        }
        return intersects;
    },
    
    /**
     * APIMethod: containsBounds
     * Determine whether the target bounds is contained within this bounds.
     * 
     * bounds - {<OpenLayers.Bounds>} The target bounds.
     * partial - {Boolean} If any of the target corners is within this bounds
     *     consider the bounds contained.  Default is false.  If false, the
     *     entire target bounds must be contained within this bounds.
     * inclusive - {Boolean} Treat shared edges as contained.  Default is
     *     true.
     *
     * Returns:
     * {Boolean} The passed-in bounds object is contained within this bounds. 
     */
    containsBounds:function(bounds, partial, inclusive) {
        if (partial == null) {
            partial = false;
        }
        if (inclusive == null) {
            inclusive = true;
        }
        var bottomLeft  = this.contains(bounds.left, bounds.bottom, inclusive);
        var bottomRight = this.contains(bounds.right, bounds.bottom, inclusive);
        var topLeft  = this.contains(bounds.left, bounds.top, inclusive);
        var topRight = this.contains(bounds.right, bounds.top, inclusive);
        
        return (partial) ? (bottomLeft || bottomRight || topLeft || topRight)
                         : (bottomLeft && bottomRight && topLeft && topRight);
    },

    /** 
     * APIMethod: determineQuadrant
     * 
     * Parameters:
     * lonlat - {<OpenLayers.LonLat>}
     * 
     * Returns:
     * {String} The quadrant ("br" "tr" "tl" "bl") of the bounds in which the
     *     coordinate lies.
     */
    determineQuadrant: function(lonlat) {
    
        var quadrant = "";
        var center = this.getCenterLonLat();
        
        quadrant += (lonlat.lat < center.lat) ? "b" : "t";
        quadrant += (lonlat.lon < center.lon) ? "l" : "r";
    
        return quadrant; 
    },
    
    /**
     * APIMethod: transform
     * Transform the Bounds object from source to dest. 
     *
     * Parameters: 
     * source - {<OpenLayers.Projection>} Source projection. 
     * dest   - {<OpenLayers.Projection>} Destination projection. 
     *
     * Returns:
     * {<OpenLayers.Bounds>} Itself, for use in chaining operations.
     */
    transform: function(source, dest) {
        // clear cached center location
        this.centerLonLat = null;
        var ll = OpenLayers.Projection.transform(
            {'x': this.left, 'y': this.bottom}, source, dest);
        var lr = OpenLayers.Projection.transform(
            {'x': this.right, 'y': this.bottom}, source, dest);
        var ul = OpenLayers.Projection.transform(
            {'x': this.left, 'y': this.top}, source, dest);
        var ur = OpenLayers.Projection.transform(
            {'x': this.right, 'y': this.top}, source, dest);
        this.left   = Math.min(ll.x, ul.x);
        this.bottom = Math.min(ll.y, lr.y);
        this.right  = Math.max(lr.x, ur.x);
        this.top    = Math.max(ul.y, ur.y);
        return this;
    },

    /**
     * APIMethod: wrapDateLine
     *  
     * Parameters:
     * maxExtent - {<OpenLayers.Bounds>}
     * options - {Object} Some possible options are:
     *
     * Allowed Options:
     *                    leftTolerance - {float} Allow for a margin of error 
     *                                            with the 'left' value of this 
     *                                            bound.
     *                                            Default is 0.
     *                    rightTolerance - {float} Allow for a margin of error 
     *                                             with the 'right' value of 
     *                                             this bound.
     *                                             Default is 0.
     * 
     * Returns:
     * {<OpenLayers.Bounds>} A copy of this bounds, but wrapped around the 
     *                       "dateline" (as specified by the borders of 
     *                       maxExtent). Note that this function only returns 
     *                       a different bounds value if this bounds is 
     *                       *entirely* outside of the maxExtent. If this 
     *                       bounds straddles the dateline (is part in/part 
     *                       out of maxExtent), the returned bounds will always 
     *                       cross the left edge of the given maxExtent.
     *.
     */
    wrapDateLine: function(maxExtent, options) {    
        options = options || {};
        
        var leftTolerance = options.leftTolerance || 0;
        var rightTolerance = options.rightTolerance || 0;

        var newBounds = this.clone();
    
        if (maxExtent) {
            var width = maxExtent.getWidth();

            //shift right?
            while (newBounds.left < maxExtent.left && 
                   newBounds.right - rightTolerance <= maxExtent.left ) { 
                newBounds = newBounds.add(width, 0);
            }

            //shift left?
            while (newBounds.left + leftTolerance >= maxExtent.right && 
                   newBounds.right > maxExtent.right ) { 
                newBounds = newBounds.add(-width, 0);
            }
           
            // crosses right only? force left
            var newLeft = newBounds.left + leftTolerance;
            if (newLeft < maxExtent.right && newLeft > maxExtent.left && 
                   newBounds.right - rightTolerance > maxExtent.right) {
                newBounds = newBounds.add(-width, 0);
            }
        }
                
        return newBounds;
    },

    CLASS_NAME: "OpenLayers.Bounds"
});

/** 
 * APIFunction: fromString
 * Alternative constructor that builds a new OpenLayers.Bounds from a 
 *     parameter string
 * 
 * Parameters: 
 * str - {String}Comma-separated bounds string. (e.g. <i>"5,42,10,45"</i>)
 * reverseAxisOrder - {Boolean} Does the string use reverse axis order?
 * 
 * Returns:
 * {<OpenLayers.Bounds>} New bounds object built from the 
 *                       passed-in String.
 */
OpenLayers.Bounds.fromString = function(str, reverseAxisOrder) {
    var bounds = str.split(",");
    return OpenLayers.Bounds.fromArray(bounds, reverseAxisOrder);
};

/** 
 * APIFunction: fromArray
 * Alternative constructor that builds a new OpenLayers.Bounds
 *     from an array
 * 
 * Parameters:
 * bbox - {Array(Float)} Array of bounds values (e.g. <i>[5,42,10,45]</i>)
 * reverseAxisOrder - {Boolean} Does the array use reverse axis order?
 *
 * Returns:
 * {<OpenLayers.Bounds>} New bounds object built from the passed-in Array.
 */
OpenLayers.Bounds.fromArray = function(bbox, reverseAxisOrder) {
    return reverseAxisOrder === true ?
           new OpenLayers.Bounds(bbox[1], bbox[0], bbox[3], bbox[2]) :
           new OpenLayers.Bounds(bbox[0], bbox[1], bbox[2], bbox[3]);
};

/** 
 * APIFunction: fromSize
 * Alternative constructor that builds a new OpenLayers.Bounds
 *     from a size
 * 
 * Parameters:
 * size - {<OpenLayers.Size>|Object} OpenLayers.Size or an object with
 *     a 'w' and 'h' properties.
 *
 * Returns:
 * {<OpenLayers.Bounds>} New bounds object built from the passed-in size.
 */
OpenLayers.Bounds.fromSize = function(size) {
    return new OpenLayers.Bounds(0,
                                 size.h,
                                 size.w,
                                 0);
};

/**
 * Function: oppositeQuadrant
 * Get the opposite quadrant for a given quadrant string.
 *
 * Parameters:
 * quadrant - {String} two character quadrant shortstring
 *
 * Returns:
 * {String} The opposing quadrant ("br" "tr" "tl" "bl"). For Example, if 
 *          you pass in "bl" it returns "tr", if you pass in "br" it 
 *          returns "tl", etc.
 */
OpenLayers.Bounds.oppositeQuadrant = function(quadrant) {
    var opp = "";
    
    opp += (quadrant.charAt(0) == 't') ? 'b' : 't';
    opp += (quadrant.charAt(1) == 'l') ? 'r' : 'l';
    
    return opp;
};
/* ======================================================================
    OpenLayers/BaseTypes/Element.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Util.js
 * @requires OpenLayers/BaseTypes.js
 */

/**
 * Namespace: OpenLayers.Element
 */
OpenLayers.Element = {

    /**
     * APIFunction: visible
     * 
     * Parameters: 
     * element - {DOMElement}
     * 
     * Returns:
     * {Boolean} Is the element visible?
     */
    visible: function(element) {
        return OpenLayers.Util.getElement(element).style.display != 'none';
    },

    /**
     * APIFunction: toggle
     * Toggle the visibility of element(s) passed in
     * 
     * Parameters:
     * element - {DOMElement} Actually user can pass any number of elements
     */
    toggle: function() {
        for (var i=0, len=arguments.length; i<len; i++) {
            var element = OpenLayers.Util.getElement(arguments[i]);
            var display = OpenLayers.Element.visible(element) ? 'none' 
                                                              : '';
            element.style.display = display;
        }
    },

    /**
     * APIFunction: remove
     * Remove the specified element from the DOM.
     * 
     * Parameters:
     * element - {DOMElement}
     */
    remove: function(element) {
        element = OpenLayers.Util.getElement(element);
        element.parentNode.removeChild(element);
    },

    /**
     * APIFunction: getHeight
     *  
     * Parameters:
     * element - {DOMElement}
     * 
     * Returns:
     * {Integer} The offset height of the element passed in
     */
    getHeight: function(element) {
        element = OpenLayers.Util.getElement(element);
        return element.offsetHeight;
    },

    /**
     * Function: hasClass
     * Tests if an element has the given CSS class name.
     *
     * Parameters:
     * element - {DOMElement} A DOM element node.
     * name - {String} The CSS class name to search for.
     *
     * Returns:
     * {Boolean} The element has the given class name.
     */
    hasClass: function(element, name) {
        var names = element.className;
        return (!!names && new RegExp("(^|\\s)" + name + "(\\s|$)").test(names));
    },
    
    /**
     * Function: addClass
     * Add a CSS class name to an element.  Safe where element already has
     *     the class name.
     *
     * Parameters:
     * element - {DOMElement} A DOM element node.
     * name - {String} The CSS class name to add.
     *
     * Returns:
     * {DOMElement} The element.
     */
    addClass: function(element, name) {
        if(!OpenLayers.Element.hasClass(element, name)) {
            element.className += (element.className ? " " : "") + name;
        }
        return element;
    },

    /**
     * Function: removeClass
     * Remove a CSS class name from an element.  Safe where element does not
     *     have the class name.
     *
     * Parameters:
     * element - {DOMElement} A DOM element node.
     * name - {String} The CSS class name to remove.
     *
     * Returns:
     * {DOMElement} The element.
     */
    removeClass: function(element, name) {
        var names = element.className;
        if(names) {
            element.className = OpenLayers.String.trim(
                names.replace(
                    new RegExp("(^|\\s+)" + name + "(\\s+|$)"), " "
                )
            );
        }
        return element;
    },

    /**
     * Function: toggleClass
     * Remove a CSS class name from an element if it exists.  Add the class name
     *     if it doesn't exist.
     *
     * Parameters:
     * element - {DOMElement} A DOM element node.
     * name - {String} The CSS class name to toggle.
     *
     * Returns:
     * {DOMElement} The element.
     */
    toggleClass: function(element, name) {
        if(OpenLayers.Element.hasClass(element, name)) {
            OpenLayers.Element.removeClass(element, name);
        } else {
            OpenLayers.Element.addClass(element, name);
        }
        return element;
    },

    /**
     * APIFunction: getStyle
     * 
     * Parameters:
     * element - {DOMElement}
     * style - {?}
     * 
     * Returns:
     * {?}
     */
    getStyle: function(element, style) {
        element = OpenLayers.Util.getElement(element);

        var value = null;
        if (element && element.style) {
            value = element.style[OpenLayers.String.camelize(style)];
            if (!value) {
                if (document.defaultView && 
                    document.defaultView.getComputedStyle) {
                    
                    var css = document.defaultView.getComputedStyle(element, null);
                    value = css ? css.getPropertyValue(style) : null;
                } else if (element.currentStyle) {
                    value = element.currentStyle[OpenLayers.String.camelize(style)];
                }
            }
        
            var positions = ['left', 'top', 'right', 'bottom'];
            if (window.opera &&
                (OpenLayers.Util.indexOf(positions,style) != -1) &&
                (OpenLayers.Element.getStyle(element, 'position') == 'static')) { 
                value = 'auto';
            }
        }
    
        return value == 'auto' ? null : value;
    }

};
/* ======================================================================
    OpenLayers/BaseTypes/LonLat.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/BaseTypes/Class.js
 */

/**
 * Class: OpenLayers.LonLat
 * This class represents a longitude and latitude pair
 */
OpenLayers.LonLat = OpenLayers.Class({

    /** 
     * APIProperty: lon
     * {Float} The x-axis coodinate in map units
     */
    lon: 0.0,
    
    /** 
     * APIProperty: lat
     * {Float} The y-axis coordinate in map units
     */
    lat: 0.0,

    /**
     * Constructor: OpenLayers.LonLat
     * Create a new map location. Coordinates can be passed either as two
     * arguments, or as a single argument.
     *
     * Parameters (two arguments):
     * lon - {Number} The x-axis coordinate in map units.  If your map is in
     *     a geographic projection, this will be the Longitude.  Otherwise,
     *     it will be the x coordinate of the map location in your map units.
     * lat - {Number} The y-axis coordinate in map units.  If your map is in
     *     a geographic projection, this will be the Latitude.  Otherwise,
     *     it will be the y coordinate of the map location in your map units.
     *
     * Parameters (single argument):
     * location - {Array(Float)} [lon, lat]
     */
    initialize: function(lon, lat) {
        if (OpenLayers.Util.isArray(lon)) {
            lat = lon[1];
            lon = lon[0];
        }
        this.lon = OpenLayers.Util.toFloat(lon);
        this.lat = OpenLayers.Util.toFloat(lat);
    },
    
    /**
     * Method: toString
     * Return a readable string version of the lonlat
     *
     * Returns:
     * {String} String representation of OpenLayers.LonLat object. 
     *           (e.g. <i>"lon=5,lat=42"</i>)
     */
    toString:function() {
        return ("lon=" + this.lon + ",lat=" + this.lat);
    },

    /** 
     * APIMethod: toShortString
     * 
     * Returns:
     * {String} Shortened String representation of OpenLayers.LonLat object. 
     *         (e.g. <i>"5, 42"</i>)
     */
    toShortString:function() {
        return (this.lon + ", " + this.lat);
    },

    /** 
     * APIMethod: clone
     * 
     * Returns:
     * {<OpenLayers.LonLat>} New OpenLayers.LonLat object with the same lon 
     *                       and lat values
     */
    clone:function() {
        return new OpenLayers.LonLat(this.lon, this.lat);
    },

    /** 
     * APIMethod: add
     * 
     * Parameters:
     * lon - {Float}
     * lat - {Float}
     * 
     * Returns:
     * {<OpenLayers.LonLat>} A new OpenLayers.LonLat object with the lon and 
     *                       lat passed-in added to this's. 
     */
    add:function(lon, lat) {
        if ( (lon == null) || (lat == null) ) {
            throw new TypeError('LonLat.add cannot receive null values');
        }
        return new OpenLayers.LonLat(this.lon + OpenLayers.Util.toFloat(lon), 
                                     this.lat + OpenLayers.Util.toFloat(lat));
    },

    /** 
     * APIMethod: equals
     * 
     * Parameters:
     * ll - {<OpenLayers.LonLat>}
     * 
     * Returns:
     * {Boolean} Boolean value indicating whether the passed-in 
     *           <OpenLayers.LonLat> object has the same lon and lat 
     *           components as this.
     *           Note: if ll passed in is null, returns false
     */
    equals:function(ll) {
        var equals = false;
        if (ll != null) {
            equals = ((this.lon == ll.lon && this.lat == ll.lat) ||
                      (isNaN(this.lon) && isNaN(this.lat) && isNaN(ll.lon) && isNaN(ll.lat)));
        }
        return equals;
    },

    /**
     * APIMethod: transform
     * Transform the LonLat object from source to dest. This transformation is
     *    *in place*: if you want a *new* lonlat, use .clone() first.
     *
     * Parameters: 
     * source - {<OpenLayers.Projection>} Source projection. 
     * dest   - {<OpenLayers.Projection>} Destination projection. 
     *
     * Returns:
     * {<OpenLayers.LonLat>} Itself, for use in chaining operations.
     */
    transform: function(source, dest) {
        var point = OpenLayers.Projection.transform(
            {'x': this.lon, 'y': this.lat}, source, dest);
        this.lon = point.x;
        this.lat = point.y;
        return this;
    },
    
    /**
     * APIMethod: wrapDateLine
     * 
     * Parameters:
     * maxExtent - {<OpenLayers.Bounds>}
     * 
     * Returns:
     * {<OpenLayers.LonLat>} A copy of this lonlat, but wrapped around the 
     *                       "dateline" (as specified by the borders of 
     *                       maxExtent)
     */
    wrapDateLine: function(maxExtent) {    

        var newLonLat = this.clone();
    
        if (maxExtent) {
            //shift right?
            while (newLonLat.lon < maxExtent.left) {
                newLonLat.lon +=  maxExtent.getWidth();
            }    
           
            //shift left?
            while (newLonLat.lon > maxExtent.right) {
                newLonLat.lon -= maxExtent.getWidth();
            }    
        }
                
        return newLonLat;
    },

    CLASS_NAME: "OpenLayers.LonLat"
});

/** 
 * Function: fromString
 * Alternative constructor that builds a new <OpenLayers.LonLat> from a 
 *     parameter string
 * 
 * Parameters:
 * str - {String} Comma-separated Lon,Lat coordinate string. 
 *                 (e.g. <i>"5,40"</i>)
 * 
 * Returns:
 * {<OpenLayers.LonLat>} New <OpenLayers.LonLat> object built from the 
 *                       passed-in String.
 */
OpenLayers.LonLat.fromString = function(str) {
    var pair = str.split(",");
    return new OpenLayers.LonLat(pair[0], pair[1]);
};

/** 
 * Function: fromArray
 * Alternative constructor that builds a new <OpenLayers.LonLat> from an 
 *     array of two numbers that represent lon- and lat-values.
 * 
 * Parameters:
 * arr - {Array(Float)} Array of lon/lat values (e.g. [5,-42])
 * 
 * Returns:
 * {<OpenLayers.LonLat>} New <OpenLayers.LonLat> object built from the 
 *                       passed-in array.
 */
OpenLayers.LonLat.fromArray = function(arr) {
    var gotArr = OpenLayers.Util.isArray(arr),
        lon = gotArr && arr[0],
        lat = gotArr && arr[1];
    return new OpenLayers.LonLat(lon, lat);
};
/* ======================================================================
    OpenLayers/BaseTypes/Pixel.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/BaseTypes/Class.js
 */

/**
 * Class: OpenLayers.Pixel
 * This class represents a screen coordinate, in x and y coordinates
 */
OpenLayers.Pixel = OpenLayers.Class({
    
    /**
     * APIProperty: x
     * {Number} The x coordinate
     */
    x: 0.0,

    /**
     * APIProperty: y
     * {Number} The y coordinate
     */
    y: 0.0,
    
    /**
     * Constructor: OpenLayers.Pixel
     * Create a new OpenLayers.Pixel instance
     *
     * Parameters:
     * x - {Number} The x coordinate
     * y - {Number} The y coordinate
     *
     * Returns:
     * An instance of OpenLayers.Pixel
     */
    initialize: function(x, y) {
        this.x = parseFloat(x);
        this.y = parseFloat(y);
    },
    
    /**
     * Method: toString
     * Cast this object into a string
     *
     * Returns:
     * {String} The string representation of Pixel. ex: "x=200.4,y=242.2"
     */
    toString:function() {
        return ("x=" + this.x + ",y=" + this.y);
    },

    /**
     * APIMethod: clone
     * Return a clone of this pixel object
     *
     * Returns:
     * {<OpenLayers.Pixel>} A clone pixel
     */
    clone:function() {
        return new OpenLayers.Pixel(this.x, this.y); 
    },
    
    /**
     * APIMethod: equals
     * Determine whether one pixel is equivalent to another
     *
     * Parameters:
     * px - {<OpenLayers.Pixel>|Object} An OpenLayers.Pixel or an object with
     *                                  a 'x' and 'y' properties.
     *
     * Returns:
     * {Boolean} The point passed in as parameter is equal to this. Note that
     * if px passed in is null, returns false.
     */
    equals:function(px) {
        var equals = false;
        if (px != null) {
            equals = ((this.x == px.x && this.y == px.y) ||
                      (isNaN(this.x) && isNaN(this.y) && isNaN(px.x) && isNaN(px.y)));
        }
        return equals;
    },

    /**
     * APIMethod: distanceTo
     * Returns the distance to the pixel point passed in as a parameter.
     *
     * Parameters:
     * px - {<OpenLayers.Pixel>}
     *
     * Returns:
     * {Float} The pixel point passed in as parameter to calculate the
     *     distance to.
     */
    distanceTo:function(px) {
        return Math.sqrt(
            Math.pow(this.x - px.x, 2) +
            Math.pow(this.y - px.y, 2)
        );
    },

    /**
     * APIMethod: add
     *
     * Parameters:
     * x - {Integer}
     * y - {Integer}
     *
     * Returns:
     * {<OpenLayers.Pixel>} A new Pixel with this pixel's x&y augmented by the 
     * values passed in.
     */
    add:function(x, y) {
        if ( (x == null) || (y == null) ) {
            throw new TypeError('Pixel.add cannot receive null values');
        }
        return new OpenLayers.Pixel(this.x + x, this.y + y);
    },

    /**
    * APIMethod: offset
    * 
    * Parameters
    * px - {<OpenLayers.Pixel>|Object} An OpenLayers.Pixel or an object with
    *                                  a 'x' and 'y' properties.
    * 
    * Returns:
    * {<OpenLayers.Pixel>} A new Pixel with this pixel's x&y augmented by the 
    *                      x&y values of the pixel passed in.
    */
    offset:function(px) {
        var newPx = this.clone();
        if (px) {
            newPx = this.add(px.x, px.y);
        }
        return newPx;
    },

    CLASS_NAME: "OpenLayers.Pixel"
});
/* ======================================================================
    OpenLayers/BaseTypes/Size.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/BaseTypes/Class.js
 */

/**
 * Class: OpenLayers.Size
 * Instances of this class represent a width/height pair
 */
OpenLayers.Size = OpenLayers.Class({

    /**
     * APIProperty: w
     * {Number} width
     */
    w: 0.0,
    
    /**
     * APIProperty: h
     * {Number} height
     */
    h: 0.0,


    /**
     * Constructor: OpenLayers.Size
     * Create an instance of OpenLayers.Size
     *
     * Parameters:
     * w - {Number} width
     * h - {Number} height
     */
    initialize: function(w, h) {
        this.w = parseFloat(w);
        this.h = parseFloat(h);
    },

    /**
     * Method: toString
     * Return the string representation of a size object
     *
     * Returns:
     * {String} The string representation of OpenLayers.Size object. 
     * (e.g. <i>"w=55,h=66"</i>)
     */
    toString:function() {
        return ("w=" + this.w + ",h=" + this.h);
    },

    /**
     * APIMethod: clone
     * Create a clone of this size object
     *
     * Returns:
     * {<OpenLayers.Size>} A new OpenLayers.Size object with the same w and h
     * values
     */
    clone:function() {
        return new OpenLayers.Size(this.w, this.h);
    },

    /**
     *
     * APIMethod: equals
     * Determine where this size is equal to another
     *
     * Parameters:
     * sz - {<OpenLayers.Size>|Object} An OpenLayers.Size or an object with
     *                                  a 'w' and 'h' properties.
     *
     * Returns: 
     * {Boolean} The passed in size has the same h and w properties as this one.
     * Note that if sz passed in is null, returns false.
     */
    equals:function(sz) {
        var equals = false;
        if (sz != null) {
            equals = ((this.w == sz.w && this.h == sz.h) ||
                      (isNaN(this.w) && isNaN(this.h) && isNaN(sz.w) && isNaN(sz.h)));
        }
        return equals;
    },

    CLASS_NAME: "OpenLayers.Size"
});
/* ======================================================================
    OpenLayers/Console.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/BaseTypes/Class.js
 */

/**
 * Namespace: OpenLayers.Console
 * The OpenLayers.Console namespace is used for debugging and error logging.
 * If the Firebug Lite (../Firebug/firebug.js) is included before this script,
 * calls to OpenLayers.Console methods will get redirected to window.console.
 * This makes use of the Firebug extension where available and allows for
 * cross-browser debugging Firebug style.
 *
 * Note:
 * Note that behavior will differ with the Firebug extention and Firebug Lite.
 * Most notably, the Firebug Lite console does not currently allow for
 * hyperlinks to code or for clicking on object to explore their properties.
 * 
 */
OpenLayers.Console = {
    /**
     * Create empty functions for all console methods.  The real value of these
     * properties will be set if Firebug Lite (../Firebug/firebug.js script) is
     * included.  We explicitly require the Firebug Lite script to trigger
     * functionality of the OpenLayers.Console methods.
     */
    
    /**
     * APIFunction: log
     * Log an object in the console.  The Firebug Lite console logs string
     * representation of objects.  Given multiple arguments, they will
     * be cast to strings and logged with a space delimiter.  If the first
     * argument is a string with printf-like formatting, subsequent arguments
     * will be used in string substitution.  Any additional arguments (beyond
     * the number substituted in a format string) will be appended in a space-
     * delimited line.
     * 
     * Parameters:
     * object - {Object}
     */
    log: function() {},

    /**
     * APIFunction: debug
     * Writes a message to the console, including a hyperlink to the line
     * where it was called.
     *
     * May be called with multiple arguments as with OpenLayers.Console.log().
     * 
     * Parameters:
     * object - {Object}
     */
    debug: function() {},

    /**
     * APIFunction: info
     * Writes a message to the console with the visual "info" icon and color
     * coding and a hyperlink to the line where it was called.
     *
     * May be called with multiple arguments as with OpenLayers.Console.log().
     * 
     * Parameters:
     * object - {Object}
     */
    info: function() {},

    /**
     * APIFunction: warn
     * Writes a message to the console with the visual "warning" icon and
     * color coding and a hyperlink to the line where it was called.
     *
     * May be called with multiple arguments as with OpenLayers.Console.log().
     * 
     * Parameters:
     * object - {Object}
     */
    warn: function() {},

    /**
     * APIFunction: error
     * Writes a message to the console with the visual "error" icon and color
     * coding and a hyperlink to the line where it was called.
     *
     * May be called with multiple arguments as with OpenLayers.Console.log().
     * 
     * Parameters:
     * object - {Object}
     */
    error: function() {},
    
    /**
     * APIFunction: userError
     * A single interface for showing error messages to the user. The default
     * behavior is a Javascript alert, though this can be overridden by
     * reassigning OpenLayers.Console.userError to a different function.
     *
     * Expects a single error message
     * 
     * Parameters:
     * error - {Object}
     */
    userError: function(error) {
        alert(error);
    },

    /**
     * APIFunction: assert
     * Tests that an expression is true. If not, it will write a message to
     * the console and throw an exception.
     *
     * May be called with multiple arguments as with OpenLayers.Console.log().
     * 
     * Parameters:
     * object - {Object}
     */
    assert: function() {},

    /**
     * APIFunction: dir
     * Prints an interactive listing of all properties of the object. This
     * looks identical to the view that you would see in the DOM tab.
     * 
     * Parameters:
     * object - {Object}
     */
    dir: function() {},

    /**
     * APIFunction: dirxml
     * Prints the XML source tree of an HTML or XML element. This looks
     * identical to the view that you would see in the HTML tab. You can click
     * on any node to inspect it in the HTML tab.
     * 
     * Parameters:
     * object - {Object}
     */
    dirxml: function() {},

    /**
     * APIFunction: trace
     * Prints an interactive stack trace of JavaScript execution at the point
     * where it is called.  The stack trace details the functions on the stack,
     * as well as the values that were passed as arguments to each function.
     * You can click each function to take you to its source in the Script tab,
     * and click each argument value to inspect it in the DOM or HTML tabs.
     * 
     */
    trace: function() {},

    /**
     * APIFunction: group
     * Writes a message to the console and opens a nested block to indent all
     * future messages sent to the console. Call OpenLayers.Console.groupEnd()
     * to close the block.
     *
     * May be called with multiple arguments as with OpenLayers.Console.log().
     * 
     * Parameters:
     * object - {Object}
     */
    group: function() {},

    /**
     * APIFunction: groupEnd
     * Closes the most recently opened block created by a call to
     * OpenLayers.Console.group
     */
    groupEnd: function() {},
    
    /**
     * APIFunction: time
     * Creates a new timer under the given name. Call
     * OpenLayers.Console.timeEnd(name)
     * with the same name to stop the timer and print the time elapsed.
     *
     * Parameters:
     * name - {String}
     */
    time: function() {},

    /**
     * APIFunction: timeEnd
     * Stops a timer created by a call to OpenLayers.Console.time(name) and
     * writes the time elapsed.
     *
     * Parameters:
     * name - {String}
     */
    timeEnd: function() {},

    /**
     * APIFunction: profile
     * Turns on the JavaScript profiler. The optional argument title would
     * contain the text to be printed in the header of the profile report.
     *
     * This function is not currently implemented in Firebug Lite.
     * 
     * Parameters:
     * title - {String} Optional title for the profiler
     */
    profile: function() {},

    /**
     * APIFunction: profileEnd
     * Turns off the JavaScript profiler and prints its report.
     * 
     * This function is not currently implemented in Firebug Lite.
     */
    profileEnd: function() {},

    /**
     * APIFunction: count
     * Writes the number of times that the line of code where count was called
     * was executed. The optional argument title will print a message in
     * addition to the number of the count.
     *
     * This function is not currently implemented in Firebug Lite.
     *
     * Parameters:
     * title - {String} Optional title to be printed with count
     */
    count: function() {},

    CLASS_NAME: "OpenLayers.Console"
};

/**
 * Execute an anonymous function to extend the OpenLayers.Console namespace
 * if the firebug.js script is included.  This closure is used so that the
 * "scripts" and "i" variables don't pollute the global namespace.
 */
(function() {
    /**
     * If Firebug Lite is included (before this script), re-route all
     * OpenLayers.Console calls to the console object.
     */
    var scripts = document.getElementsByTagName("script");
    for(var i=0, len=scripts.length; i<len; ++i) {
        if(scripts[i].src.indexOf("firebug.js") != -1) {
            if(console) {
                OpenLayers.Util.extend(OpenLayers.Console, console);
                break;
            }
        }
    }
})();
/* ======================================================================
    OpenLayers/Lang.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/BaseTypes.js
 * @requires OpenLayers/Console.js
 */

/**
 * Namespace: OpenLayers.Lang
 * Internationalization namespace.  Contains dictionaries in various languages
 *     and methods to set and get the current language.
 */
OpenLayers.Lang = {
    
    /** 
     * Property: code
     * {String}  Current language code to use in OpenLayers.  Use the
     *     <setCode> method to set this value and the <getCode> method to
     *     retrieve it.
     */
    code: null,

    /** 
     * APIProperty: defaultCode
     * {String} Default language to use when a specific language can't be
     *     found.  Default is "en".
     */
    defaultCode: "en",
        
    /**
     * APIFunction: getCode
     * Get the current language code.
     *
     * Returns:
     * {String} The current language code.
     */
    getCode: function() {
        if(!OpenLayers.Lang.code) {
            OpenLayers.Lang.setCode();
        }
        return OpenLayers.Lang.code;
    },
    
    /**
     * APIFunction: setCode
     * Set the language code for string translation.  This code is used by
     *     the <OpenLayers.Lang.translate> method.
     *
     * Parameters:
     * code - {String} These codes follow the IETF recommendations at
     *     http://www.ietf.org/rfc/rfc3066.txt.  If no value is set, the
     *     browser's language setting will be tested.  If no <OpenLayers.Lang>
     *     dictionary exists for the code, the <OpenLayers.String.defaultLang>
     *     will be used.
     */
    setCode: function(code) {
        var lang;
        if(!code) {
            code = (OpenLayers.BROWSER_NAME == "msie") ?
                navigator.userLanguage : navigator.language;
        }
        var parts = code.split('-');
        parts[0] = parts[0].toLowerCase();
        if(typeof OpenLayers.Lang[parts[0]] == "object") {
            lang = parts[0];
        }

        // check for regional extensions
        if(parts[1]) {
            var testLang = parts[0] + '-' + parts[1].toUpperCase();
            if(typeof OpenLayers.Lang[testLang] == "object") {
                lang = testLang;
            }
        }
        if(!lang) {
            OpenLayers.Console.warn(
                'Failed to find OpenLayers.Lang.' + parts.join("-") +
                ' dictionary, falling back to default language'
            );
            lang = OpenLayers.Lang.defaultCode;
        }
        
        OpenLayers.Lang.code = lang;
    },

    /**
     * APIMethod: translate
     * Looks up a key from a dictionary based on the current language string.
     *     The value of <getCode> will be used to determine the appropriate
     *     dictionary.  Dictionaries are stored in <OpenLayers.Lang>.
     *
     * Parameters:
     * key - {String} The key for an i18n string value in the dictionary.
     * context - {Object} Optional context to be used with
     *     <OpenLayers.String.format>.
     * 
     * Returns:
     * {String} A internationalized string.
     */
    translate: function(key, context) {
        var dictionary = OpenLayers.Lang[OpenLayers.Lang.getCode()];
        var message = dictionary && dictionary[key];
        if(!message) {
            // Message not found, fall back to message key
            message = key;
        }
        if(context) {
            message = OpenLayers.String.format(message, context);
        }
        return message;
    }
    
};


/**
 * APIMethod: OpenLayers.i18n
 * Alias for <OpenLayers.Lang.translate>.  Looks up a key from a dictionary
 *     based on the current language string. The value of
 *     <OpenLayers.Lang.getCode> will be used to determine the appropriate
 *     dictionary.  Dictionaries are stored in <OpenLayers.Lang>.
 *
 * Parameters:
 * key - {String} The key for an i18n string value in the dictionary.
 * context - {Object} Optional context to be used with
 *     <OpenLayers.String.format>.
 * 
 * Returns:
 * {String} A internationalized string.
 */
OpenLayers.i18n = OpenLayers.Lang.translate;
/* ======================================================================
    OpenLayers/Util.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/BaseTypes.js
 * @requires OpenLayers/BaseTypes/Bounds.js
 * @requires OpenLayers/BaseTypes/Element.js
 * @requires OpenLayers/BaseTypes/LonLat.js
 * @requires OpenLayers/BaseTypes/Pixel.js
 * @requires OpenLayers/BaseTypes/Size.js
 * @requires OpenLayers/Lang.js
 */

/**
 * Namespace: Util
 */
OpenLayers.Util = OpenLayers.Util || {};

/** 
 * Function: getElement
 * This is the old $() from prototype
 *
 * Parameters:
 * e - {String or DOMElement or Window}
 *
 * Returns:
 * {Array(DOMElement) or DOMElement}
 */
OpenLayers.Util.getElement = function() {
    var elements = [];

    for (var i=0, len=arguments.length; i<len; i++) {
        var element = arguments[i];
        if (typeof element == 'string') {
            element = document.getElementById(element);
        }
        if (arguments.length == 1) {
            return element;
        }
        elements.push(element);
    }
    return elements;
};

/**
 * Function: isElement
 * A cross-browser implementation of "e instanceof Element".
 *
 * Parameters:
 * o - {Object} The object to test.
 *
 * Returns:
 * {Boolean}
 */
OpenLayers.Util.isElement = function(o) {
    return !!(o && o.nodeType === 1);
};

/**
 * Function: isArray
 * Tests that the provided object is an array.
 * This test handles the cross-IFRAME case not caught
 * by "a instanceof Array" and should be used instead.
 * 
 * Parameters:
 * a - {Object} the object test.
 * 
 * Returns:
 * {Boolean} true if the object is an array.
 */
OpenLayers.Util.isArray = function(a) {
    return (Object.prototype.toString.call(a) === '[object Array]');
};

/** 
 * Function: removeItem
 * Remove an object from an array. Iterates through the array
 *     to find the item, then removes it.
 *
 * Parameters:
 * array - {Array}
 * item - {Object}
 * 
 * Returns:
 * {Array} A reference to the array
 */
OpenLayers.Util.removeItem = function(array, item) {
    for(var i = array.length - 1; i >= 0; i--) {
        if(array[i] == item) {
            array.splice(i,1);
            //break;more than once??
        }
    }
    return array;
};

/** 
 * Function: indexOf
 * Seems to exist already in FF, but not in MOZ.
 * 
 * Parameters:
 * array - {Array}
 * obj - {*}
 * 
 * Returns:
 * {Integer} The index at which the first object was found in the array.
 *           If not found, returns -1.
 */
OpenLayers.Util.indexOf = function(array, obj) {
    // use the build-in function if available.
    if (typeof array.indexOf == "function") {
        return array.indexOf(obj);
    } else {
        for (var i = 0, len = array.length; i < len; i++) {
            if (array[i] == obj) {
                return i;
            }
        }
        return -1;   
    }
};


/**
 * Property: dotless
 * {RegExp}
 * Compiled regular expression to match dots (".").  This is used for replacing
 *     dots in identifiers.  Because object identifiers are frequently used for
 *     DOM element identifiers by the library, we avoid using dots to make for
 *     more sensible CSS selectors.
 *
 * TODO: Use a module pattern to avoid bloating the API with stuff like this.
 */
OpenLayers.Util.dotless = /\./g;

/**
 * Function: modifyDOMElement
 * 
 * Modifies many properties of a DOM element all at once.  Passing in 
 * null to an individual parameter will avoid setting the attribute.
 *
 * Parameters:
 * element - {DOMElement} DOM element to modify.
 * id - {String} The element id attribute to set.  Note that dots (".") will be
 *     replaced with underscore ("_") in setting the element id.
 * px - {<OpenLayers.Pixel>|Object} The element left and top position,
 *                                  OpenLayers.Pixel or an object with
 *                                  a 'x' and 'y' properties.
 * sz - {<OpenLayers.Size>|Object} The element width and height,
 *                                 OpenLayers.Size or an object with a
 *                                 'w' and 'h' properties.
 * position - {String}       The position attribute.  eg: absolute, 
 *                           relative, etc.
 * border - {String}         The style.border attribute.  eg:
 *                           solid black 2px
 * overflow - {String}       The style.overview attribute.  
 * opacity - {Float}         Fractional value (0.0 - 1.0)
 */
OpenLayers.Util.modifyDOMElement = function(element, id, px, sz, position, 
                                            border, overflow, opacity) {

    if (id) {
        element.id = id.replace(OpenLayers.Util.dotless, "_");
    }
    if (px) {
        element.style.left = px.x + "px";
        element.style.top = px.y + "px";
    }
    if (sz) {
        element.style.width = sz.w + "px";
        element.style.height = sz.h + "px";
    }
    if (position) {
        element.style.position = position;
    }
    if (border) {
        element.style.border = border;
    }
    if (overflow) {
        element.style.overflow = overflow;
    }
    if (parseFloat(opacity) >= 0.0 && parseFloat(opacity) < 1.0) {
        element.style.filter = 'alpha(opacity=' + (opacity * 100) + ')';
        element.style.opacity = opacity;
    } else if (parseFloat(opacity) == 1.0) {
        element.style.filter = '';
        element.style.opacity = '';
    }
};

/** 
 * Function: createDiv
 * Creates a new div and optionally set some standard attributes.
 * Null may be passed to each parameter if you do not wish to
 * set a particular attribute.
 * Note - zIndex is NOT set on the resulting div.
 * 
 * Parameters:
 * id - {String} An identifier for this element.  If no id is
 *               passed an identifier will be created 
 *               automatically.  Note that dots (".") will be replaced with
 *               underscore ("_") when generating ids.
 * px - {<OpenLayers.Pixel>|Object} The element left and top position,
 *                                  OpenLayers.Pixel or an object with
 *                                  a 'x' and 'y' properties.
 * sz - {<OpenLayers.Size>|Object} The element width and height,
 *                                 OpenLayers.Size or an object with a
 *                                 'w' and 'h' properties.
 * imgURL - {String} A url pointing to an image to use as a 
 *                   background image.
 * position - {String} The style.position value. eg: absolute,
 *                     relative etc.
 * border - {String} The the style.border value. 
 *                   eg: 2px solid black
 * overflow - {String} The style.overflow value. Eg. hidden
 * opacity - {Float} Fractional value (0.0 - 1.0)
 * 
 * Returns: 
 * {DOMElement} A DOM Div created with the specified attributes.
 */
OpenLayers.Util.createDiv = function(id, px, sz, imgURL, position, 
                                     border, overflow, opacity) {

    var dom = document.createElement('div');

    if (imgURL) {
        dom.style.backgroundImage = 'url(' + imgURL + ')';
    }

    //set generic properties
    if (!id) {
        id = OpenLayers.Util.createUniqueID("OpenLayersDiv");
    }
    if (!position) {
        position = "absolute";
    }
    OpenLayers.Util.modifyDOMElement(dom, id, px, sz, position, 
                                     border, overflow, opacity);

    return dom;
};

/**
 * Function: createImage
 * Creates an img element with specific attribute values.
 *  
 * Parameters:
 * id - {String} The id field for the img.  If none assigned one will be
 *               automatically generated.
 * px - {<OpenLayers.Pixel>|Object} The element left and top position,
 *                                  OpenLayers.Pixel or an object with
 *                                  a 'x' and 'y' properties.
 * sz - {<OpenLayers.Size>|Object} The element width and height,
 *                                 OpenLayers.Size or an object with a
 *                                 'w' and 'h' properties.
 * imgURL - {String} The url to use as the image source.
 * position - {String} The style.position value.
 * border - {String} The border to place around the image.
 * opacity - {Float} Fractional value (0.0 - 1.0)
 * delayDisplay - {Boolean} If true waits until the image has been
 *                          loaded.
 * 
 * Returns:
 * {DOMElement} A DOM Image created with the specified attributes.
 */
OpenLayers.Util.createImage = function(id, px, sz, imgURL, position, border,
                                       opacity, delayDisplay) {

    var image = document.createElement("img");

    //set generic properties
    if (!id) {
        id = OpenLayers.Util.createUniqueID("OpenLayersDiv");
    }
    if (!position) {
        position = "relative";
    }
    OpenLayers.Util.modifyDOMElement(image, id, px, sz, position, 
                                     border, null, opacity);

    if (delayDisplay) {
        image.style.display = "none";
        function display() {
            image.style.display = "";
            OpenLayers.Event.stopObservingElement(image);
        }
        OpenLayers.Event.observe(image, "load", display);
        OpenLayers.Event.observe(image, "error", display);
    }
    
    //set special properties
    image.style.alt = id;
    image.galleryImg = "no";
    if (imgURL) {
        image.src = imgURL;
    }
        
    return image;
};

/**
 * Property: IMAGE_RELOAD_ATTEMPTS
 * {Integer} How many times should we try to reload an image before giving up?
 *           Default is 0
 */
OpenLayers.IMAGE_RELOAD_ATTEMPTS = 0;

/**
 * Property: alphaHackNeeded
 * {Boolean} true if the png alpha hack is necessary and possible, false otherwise.
 */
OpenLayers.Util.alphaHackNeeded = null;

/**
 * Function: alphaHack
 * Checks whether it's necessary (and possible) to use the png alpha
 * hack which allows alpha transparency for png images under Internet
 * Explorer.
 * 
 * Returns:
 * {Boolean} true if the png alpha hack is necessary and possible, false otherwise.
 */
OpenLayers.Util.alphaHack = function() {
    if (OpenLayers.Util.alphaHackNeeded == null) {
        var arVersion = navigator.appVersion.split("MSIE");
        var version = parseFloat(arVersion[1]);
        var filter = false;
    
        // IEs4Lin dies when trying to access document.body.filters, because 
        // the property is there, but requires a DLL that can't be provided. This
        // means that we need to wrap this in a try/catch so that this can
        // continue.
    
        try { 
            filter = !!(document.body.filters);
        } catch (e) {}    
    
        OpenLayers.Util.alphaHackNeeded = (filter && 
                                           (version >= 5.5) && (version < 7));
    }
    return OpenLayers.Util.alphaHackNeeded;
};

/** 
 * Function: modifyAlphaImageDiv
 * 
 * Parameters:
 * div - {DOMElement} Div containing Alpha-adjusted Image
 * id - {String}
 * px - {<OpenLayers.Pixel>|Object} OpenLayers.Pixel or an object with
 *                                  a 'x' and 'y' properties.
 * sz - {<OpenLayers.Size>|Object} OpenLayers.Size or an object with
 *                                 a 'w' and 'h' properties.
 * imgURL - {String}
 * position - {String}
 * border - {String}
 * sizing - {String} 'crop', 'scale', or 'image'. Default is "scale"
 * opacity - {Float} Fractional value (0.0 - 1.0)
 */ 
OpenLayers.Util.modifyAlphaImageDiv = function(div, id, px, sz, imgURL, 
                                               position, border, sizing, 
                                               opacity) {

    OpenLayers.Util.modifyDOMElement(div, id, px, sz, position,
                                     null, null, opacity);

    var img = div.childNodes[0];

    if (imgURL) {
        img.src = imgURL;
    }
    OpenLayers.Util.modifyDOMElement(img, div.id + "_innerImage", null, sz, 
                                     "relative", border);
    
    if (OpenLayers.Util.alphaHack()) {
        if(div.style.display != "none") {
            div.style.display = "inline-block";
        }
        if (sizing == null) {
            sizing = "scale";
        }
        
        div.style.filter = "progid:DXImageTransform.Microsoft" +
                           ".AlphaImageLoader(src='" + img.src + "', " +
                           "sizingMethod='" + sizing + "')";
        if (parseFloat(div.style.opacity) >= 0.0 && 
            parseFloat(div.style.opacity) < 1.0) {
            div.style.filter += " alpha(opacity=" + div.style.opacity * 100 + ")";
        }

        img.style.filter = "alpha(opacity=0)";
    }
};

/** 
 * Function: createAlphaImageDiv
 * 
 * Parameters:
 * id - {String}
 * px - {<OpenLayers.Pixel>|Object} OpenLayers.Pixel or an object with
 *                                  a 'x' and 'y' properties.
 * sz - {<OpenLayers.Size>|Object} OpenLayers.Size or an object with
 *                                 a 'w' and 'h' properties.
 * imgURL - {String}
 * position - {String}
 * border - {String}
 * sizing - {String} 'crop', 'scale', or 'image'. Default is "scale"
 * opacity - {Float} Fractional value (0.0 - 1.0)
 * delayDisplay - {Boolean} If true waits until the image has been
 *                          loaded.
 * 
 * Returns:
 * {DOMElement} A DOM Div created with a DOM Image inside it. If the hack is 
 *              needed for transparency in IE, it is added.
 */ 
OpenLayers.Util.createAlphaImageDiv = function(id, px, sz, imgURL, 
                                               position, border, sizing, 
                                               opacity, delayDisplay) {
    
    var div = OpenLayers.Util.createDiv();
    var img = OpenLayers.Util.createImage(null, null, null, null, null, null, 
                                          null, delayDisplay);
    img.className = "olAlphaImg";
    div.appendChild(img);

    OpenLayers.Util.modifyAlphaImageDiv(div, id, px, sz, imgURL, position, 
                                        border, sizing, opacity);
    
    return div;
};


/** 
 * Function: upperCaseObject
 * Creates a new hashtable and copies over all the keys from the 
 *     passed-in object, but storing them under an uppercased
 *     version of the key at which they were stored.
 * 
 * Parameters: 
 * object - {Object}
 * 
 * Returns: 
 * {Object} A new Object with all the same keys but uppercased
 */
OpenLayers.Util.upperCaseObject = function (object) {
    var uObject = {};
    for (var key in object) {
        uObject[key.toUpperCase()] = object[key];
    }
    return uObject;
};

/** 
 * Function: applyDefaults
 * Takes an object and copies any properties that don't exist from
 *     another properties, by analogy with OpenLayers.Util.extend() from
 *     Prototype.js.
 * 
 * Parameters:
 * to - {Object} The destination object.
 * from - {Object} The source object.  Any properties of this object that
 *     are undefined in the to object will be set on the to object.
 *
 * Returns:
 * {Object} A reference to the to object.  Note that the to argument is modified
 *     in place and returned by this function.
 */
OpenLayers.Util.applyDefaults = function (to, from) {
    to = to || {};
    /*
     * FF/Windows < 2.0.0.13 reports "Illegal operation on WrappedNative
     * prototype object" when calling hawOwnProperty if the source object is an
     * instance of window.Event.
     */
    var fromIsEvt = typeof window.Event == "function"
                    && from instanceof window.Event;

    for (var key in from) {
        if (to[key] === undefined ||
            (!fromIsEvt && from.hasOwnProperty
             && from.hasOwnProperty(key) && !to.hasOwnProperty(key))) {
            to[key] = from[key];
        }
    }
    /**
     * IE doesn't include the toString property when iterating over an object's
     * properties with the for(property in object) syntax.  Explicitly check if
     * the source has its own toString property.
     */
    if(!fromIsEvt && from && from.hasOwnProperty
       && from.hasOwnProperty('toString') && !to.hasOwnProperty('toString')) {
        to.toString = from.toString;
    }
    
    return to;
};

/**
 * Function: getParameterString
 * 
 * Parameters:
 * params - {Object}
 * 
 * Returns:
 * {String} A concatenation of the properties of an object in 
 *          http parameter notation. 
 *          (ex. <i>"key1=value1&key2=value2&key3=value3"</i>)
 *          If a parameter is actually a list, that parameter will then
 *          be set to a comma-seperated list of values (foo,bar) instead
 *          of being URL escaped (foo%3Abar). 
 */
OpenLayers.Util.getParameterString = function(params) {
    var paramsArray = [];
    
    for (var key in params) {
      var value = params[key];
      if ((value != null) && (typeof value != 'function')) {
        var encodedValue;
        if (typeof value == 'object' && value.constructor == Array) {
          /* value is an array; encode items and separate with "," */
          var encodedItemArray = [];
          var item;
          for (var itemIndex=0, len=value.length; itemIndex<len; itemIndex++) {
            item = value[itemIndex];
            encodedItemArray.push(encodeURIComponent(
                (item === null || item === undefined) ? "" : item)
            );
          }
          encodedValue = encodedItemArray.join(",");
        }
        else {
          /* value is a string; simply encode */
          encodedValue = encodeURIComponent(value);
        }
        paramsArray.push(encodeURIComponent(key) + "=" + encodedValue);
      }
    }
    
    return paramsArray.join("&");
};

/**
 * Function: urlAppend
 * Appends a parameter string to a url. This function includes the logic for
 * using the appropriate character (none, & or ?) to append to the url before
 * appending the param string.
 * 
 * Parameters:
 * url - {String} The url to append to
 * paramStr - {String} The param string to append
 * 
 * Returns:
 * {String} The new url
 */
OpenLayers.Util.urlAppend = function(url, paramStr) {
    var newUrl = url;
    if(paramStr) {
        var parts = (url + " ").split(/[?&]/);
        newUrl += (parts.pop() === " " ?
            paramStr :
            parts.length ? "&" + paramStr : "?" + paramStr);
    }
    return newUrl;
};

/** 
 * Function: getImagesLocation
 * 
 * Returns:
 * {String} The fully formatted image location string
 */
OpenLayers.Util.getImagesLocation = function() {
    return OpenLayers.ImgPath || (OpenLayers._getScriptLocation() + "img/");
};

/** 
 * Function: getImageLocation
 * 
 * Returns:
 * {String} The fully formatted location string for a specified image
 */
OpenLayers.Util.getImageLocation = function(image) {
    return OpenLayers.Util.getImagesLocation() + image;
};


/** 
 * Function: Try
 * Execute functions until one of them doesn't throw an error. 
 *     Capitalized because "try" is a reserved word in JavaScript.
 *     Taken directly from OpenLayers.Util.Try()
 * 
 * Parameters:
 * [*] - {Function} Any number of parameters may be passed to Try()
 *    It will attempt to execute each of them until one of them 
 *    successfully executes. 
 *    If none executes successfully, returns null.
 * 
 * Returns:
 * {*} The value returned by the first successfully executed function.
 */
OpenLayers.Util.Try = function() {
    var returnValue = null;

    for (var i=0, len=arguments.length; i<len; i++) {
      var lambda = arguments[i];
      try {
        returnValue = lambda();
        break;
      } catch (e) {}
    }

    return returnValue;
};

/**
 * Function: getXmlNodeValue
 * 
 * Parameters:
 * node - {XMLNode}
 * 
 * Returns:
 * {String} The text value of the given node, without breaking in firefox or IE
 */
OpenLayers.Util.getXmlNodeValue = function(node) {
    var val = null;
    OpenLayers.Util.Try( 
        function() {
            val = node.text;
            if (!val) {
                val = node.textContent;
            }
            if (!val) {
                val = node.firstChild.nodeValue;
            }
        }, 
        function() {
            val = node.textContent;
        }); 
    return val;
};

/** 
 * Function: mouseLeft
 * 
 * Parameters:
 * evt - {Event}
 * div - {HTMLDivElement}
 * 
 * Returns:
 * {Boolean}
 */
OpenLayers.Util.mouseLeft = function (evt, div) {
    // start with the element to which the mouse has moved
    var target = (evt.relatedTarget) ? evt.relatedTarget : evt.toElement;
    // walk up the DOM tree.
    while (target != div && target != null) {
        target = target.parentNode;
    }
    // if the target we stop at isn't the div, then we've left the div.
    return (target != div);
};

/**
 * Property: precision
 * {Number} The number of significant digits to retain to avoid
 * floating point precision errors.
 *
 * We use 14 as a "safe" default because, although IEEE 754 double floats
 * (standard on most modern operating systems) support up to about 16
 * significant digits, 14 significant digits are sufficient to represent
 * sub-millimeter accuracy in any coordinate system that anyone is likely to
 * use with OpenLayers.
 *
 * If DEFAULT_PRECISION is set to 0, the original non-truncating behavior
 * of OpenLayers <2.8 is preserved. Be aware that this will cause problems
 * with certain projections, e.g. spherical Mercator.
 *
 */
OpenLayers.Util.DEFAULT_PRECISION = 14;

/**
 * Function: toFloat
 * Convenience method to cast an object to a Number, rounded to the
 * desired floating point precision.
 *
 * Parameters:
 * number    - {Number} The number to cast and round.
 * precision - {Number} An integer suitable for use with
 *      Number.toPrecision(). Defaults to OpenLayers.Util.DEFAULT_PRECISION.
 *      If set to 0, no rounding is performed.
 *
 * Returns:
 * {Number} The cast, rounded number.
 */
OpenLayers.Util.toFloat = function (number, precision) {
    if (precision == null) {
        precision = OpenLayers.Util.DEFAULT_PRECISION;
    }
    if (typeof number !== "number") {
        number = parseFloat(number);
    }
    return precision === 0 ? number :
                             parseFloat(number.toPrecision(precision));
};

/**
 * Function: rad
 * 
 * Parameters:
 * x - {Float}
 * 
 * Returns:
 * {Float}
 */
OpenLayers.Util.rad = function(x) {return x*Math.PI/180;};

/**
 * Function: deg
 *
 * Parameters:
 * x - {Float}
 *
 * Returns:
 * {Float}
 */
OpenLayers.Util.deg = function(x) {return x*180/Math.PI;};

/**
 * Property: VincentyConstants
 * {Object} Constants for Vincenty functions.
 */
OpenLayers.Util.VincentyConstants = {
    a: 6378137,
    b: 6356752.3142,
    f: 1/298.257223563
};

/**
 * APIFunction: distVincenty
 * Given two objects representing points with geographic coordinates, this
 *     calculates the distance between those points on the surface of an
 *     ellipsoid.
 *
 * Parameters:
 * p1 - {<OpenLayers.LonLat>} (or any object with both .lat, .lon properties)
 * p2 - {<OpenLayers.LonLat>} (or any object with both .lat, .lon properties)
 *
 * Returns:
 * {Float} The distance (in km) between the two input points as measured on an
 *     ellipsoid.  Note that the input point objects must be in geographic
 *     coordinates (decimal degrees) and the return distance is in kilometers.
 */
OpenLayers.Util.distVincenty = function(p1, p2) {
    var ct = OpenLayers.Util.VincentyConstants;
    var a = ct.a, b = ct.b, f = ct.f;

    var L = OpenLayers.Util.rad(p2.lon - p1.lon);
    var U1 = Math.atan((1-f) * Math.tan(OpenLayers.Util.rad(p1.lat)));
    var U2 = Math.atan((1-f) * Math.tan(OpenLayers.Util.rad(p2.lat)));
    var sinU1 = Math.sin(U1), cosU1 = Math.cos(U1);
    var sinU2 = Math.sin(U2), cosU2 = Math.cos(U2);
    var lambda = L, lambdaP = 2*Math.PI;
    var iterLimit = 20;
    while (Math.abs(lambda-lambdaP) > 1e-12 && --iterLimit>0) {
        var sinLambda = Math.sin(lambda), cosLambda = Math.cos(lambda);
        var sinSigma = Math.sqrt((cosU2*sinLambda) * (cosU2*sinLambda) +
        (cosU1*sinU2-sinU1*cosU2*cosLambda) * (cosU1*sinU2-sinU1*cosU2*cosLambda));
        if (sinSigma==0) {
            return 0;  // co-incident points
        }
        var cosSigma = sinU1*sinU2 + cosU1*cosU2*cosLambda;
        var sigma = Math.atan2(sinSigma, cosSigma);
        var alpha = Math.asin(cosU1 * cosU2 * sinLambda / sinSigma);
        var cosSqAlpha = Math.cos(alpha) * Math.cos(alpha);
        var cos2SigmaM = cosSigma - 2*sinU1*sinU2/cosSqAlpha;
        var C = f/16*cosSqAlpha*(4+f*(4-3*cosSqAlpha));
        lambdaP = lambda;
        lambda = L + (1-C) * f * Math.sin(alpha) *
        (sigma + C*sinSigma*(cos2SigmaM+C*cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)));
    }
    if (iterLimit==0) {
        return NaN;  // formula failed to converge
    }
    var uSq = cosSqAlpha * (a*a - b*b) / (b*b);
    var A = 1 + uSq/16384*(4096+uSq*(-768+uSq*(320-175*uSq)));
    var B = uSq/1024 * (256+uSq*(-128+uSq*(74-47*uSq)));
    var deltaSigma = B*sinSigma*(cos2SigmaM+B/4*(cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)-
        B/6*cos2SigmaM*(-3+4*sinSigma*sinSigma)*(-3+4*cos2SigmaM*cos2SigmaM)));
    var s = b*A*(sigma-deltaSigma);
    var d = s.toFixed(3)/1000; // round to 1mm precision
    return d;
};

/**
 * APIFunction: destinationVincenty
 * Calculate destination point given start point lat/long (numeric degrees),
 * bearing (numeric degrees) & distance (in m).
 * Adapted from Chris Veness work, see
 * http://www.movable-type.co.uk/scripts/latlong-vincenty-direct.html
 *
 * Parameters:
 * lonlat  - {<OpenLayers.LonLat>} (or any object with both .lat, .lon
 *     properties) The start point.
 * brng     - {Float} The bearing (degrees).
 * dist     - {Float} The ground distance (meters).
 *
 * Returns:
 * {<OpenLayers.LonLat>} The destination point.
 */
OpenLayers.Util.destinationVincenty = function(lonlat, brng, dist) {
    var u = OpenLayers.Util;
    var ct = u.VincentyConstants;
    var a = ct.a, b = ct.b, f = ct.f;

    var lon1 = lonlat.lon;
    var lat1 = lonlat.lat;

    var s = dist;
    var alpha1 = u.rad(brng);
    var sinAlpha1 = Math.sin(alpha1);
    var cosAlpha1 = Math.cos(alpha1);

    var tanU1 = (1-f) * Math.tan(u.rad(lat1));
    var cosU1 = 1 / Math.sqrt((1 + tanU1*tanU1)), sinU1 = tanU1*cosU1;
    var sigma1 = Math.atan2(tanU1, cosAlpha1);
    var sinAlpha = cosU1 * sinAlpha1;
    var cosSqAlpha = 1 - sinAlpha*sinAlpha;
    var uSq = cosSqAlpha * (a*a - b*b) / (b*b);
    var A = 1 + uSq/16384*(4096+uSq*(-768+uSq*(320-175*uSq)));
    var B = uSq/1024 * (256+uSq*(-128+uSq*(74-47*uSq)));

    var sigma = s / (b*A), sigmaP = 2*Math.PI;
    while (Math.abs(sigma-sigmaP) > 1e-12) {
        var cos2SigmaM = Math.cos(2*sigma1 + sigma);
        var sinSigma = Math.sin(sigma);
        var cosSigma = Math.cos(sigma);
        var deltaSigma = B*sinSigma*(cos2SigmaM+B/4*(cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)-
            B/6*cos2SigmaM*(-3+4*sinSigma*sinSigma)*(-3+4*cos2SigmaM*cos2SigmaM)));
        sigmaP = sigma;
        sigma = s / (b*A) + deltaSigma;
    }

    var tmp = sinU1*sinSigma - cosU1*cosSigma*cosAlpha1;
    var lat2 = Math.atan2(sinU1*cosSigma + cosU1*sinSigma*cosAlpha1,
        (1-f)*Math.sqrt(sinAlpha*sinAlpha + tmp*tmp));
    var lambda = Math.atan2(sinSigma*sinAlpha1, cosU1*cosSigma - sinU1*sinSigma*cosAlpha1);
    var C = f/16*cosSqAlpha*(4+f*(4-3*cosSqAlpha));
    var L = lambda - (1-C) * f * sinAlpha *
        (sigma + C*sinSigma*(cos2SigmaM+C*cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)));

    var revAz = Math.atan2(sinAlpha, -tmp);  // final bearing

    return new OpenLayers.LonLat(lon1+u.deg(L), u.deg(lat2));
};

/**
 * Function: getParameters
 * Parse the parameters from a URL or from the current page itself into a 
 *     JavaScript Object. Note that parameter values with commas are separated
 *     out into an Array.
 * 
 * Parameters:
 * url - {String} Optional url used to extract the query string.
 *                If url is null or is not supplied, query string is taken 
 *                from the page location.
 * 
 * Returns:
 * {Object} An object of key/value pairs from the query string.
 */
OpenLayers.Util.getParameters = function(url) {
    // if no url specified, take it from the location bar
    url = (url === null || url === undefined) ? window.location.href : url;

    //parse out parameters portion of url string
    var paramsString = "";
    if (OpenLayers.String.contains(url, '?')) {
        var start = url.indexOf('?') + 1;
        var end = OpenLayers.String.contains(url, "#") ?
                    url.indexOf('#') : url.length;
        paramsString = url.substring(start, end);
    }

    var parameters = {};
    var pairs = paramsString.split(/[&;]/);
    for(var i=0, len=pairs.length; i<len; ++i) {
        var keyValue = pairs[i].split('=');
        if (keyValue[0]) {

            var key = keyValue[0];
            try {
                key = decodeURIComponent(key);
            } catch (err) {
                key = unescape(key);
            }
            
            // being liberal by replacing "+" with " "
            var value = (keyValue[1] || '').replace(/\+/g, " ");

            try {
                value = decodeURIComponent(value);
            } catch (err) {
                value = unescape(value);
            }
            
            // follow OGC convention of comma delimited values
            value = value.split(",");

            //if there's only one value, do not return as array                    
            if (value.length == 1) {
                value = value[0];
            }                
            
            parameters[key] = value;
         }
     }
    return parameters;
};

/**
 * Property: lastSeqID
 * {Integer} The ever-incrementing count variable.
 *           Used for generating unique ids.
 */
OpenLayers.Util.lastSeqID = 0;

/**
 * Function: createUniqueID
 * Create a unique identifier for this session.  Each time this function
 *     is called, a counter is incremented.  The return will be the optional
 *     prefix (defaults to "id_") appended with the counter value.
 * 
 * Parameters:
 * prefix - {String} Optional string to prefix unique id. Default is "id_".
 *     Note that dots (".") in the prefix will be replaced with underscore ("_").
 * 
 * Returns:
 * {String} A unique id string, built on the passed in prefix.
 */
OpenLayers.Util.createUniqueID = function(prefix) {
    if (prefix == null) {
        prefix = "id_";
    } else {
        prefix = prefix.replace(OpenLayers.Util.dotless, "_");
    }
    OpenLayers.Util.lastSeqID += 1; 
    return prefix + OpenLayers.Util.lastSeqID;        
};

/**
 * Constant: INCHES_PER_UNIT
 * {Object} Constant inches per unit -- borrowed from MapServer mapscale.c
 * derivation of nautical miles from http://en.wikipedia.org/wiki/Nautical_mile
 * Includes the full set of units supported by CS-MAP (http://trac.osgeo.org/csmap/)
 * and PROJ.4 (http://trac.osgeo.org/proj/)
 * The hardcoded table is maintain in a CS-MAP source code module named CSdataU.c
 * The hardcoded table of PROJ.4 units are in pj_units.c.
 */
OpenLayers.INCHES_PER_UNIT = { 
    'inches': 1.0,
    'ft': 12.0,
    'mi': 63360.0,
    'm': 39.3701,
    'km': 39370.1,
    'dd': 4374754,
    'yd': 36
};
OpenLayers.INCHES_PER_UNIT["in"]= OpenLayers.INCHES_PER_UNIT.inches;
OpenLayers.INCHES_PER_UNIT["degrees"] = OpenLayers.INCHES_PER_UNIT.dd;
OpenLayers.INCHES_PER_UNIT["nmi"] = 1852 * OpenLayers.INCHES_PER_UNIT.m;

// Units from CS-Map
OpenLayers.METERS_PER_INCH = 0.02540005080010160020;
OpenLayers.Util.extend(OpenLayers.INCHES_PER_UNIT, {
    "Inch": OpenLayers.INCHES_PER_UNIT.inches,
    "Meter": 1.0 / OpenLayers.METERS_PER_INCH,   //EPSG:9001
    "Foot": 0.30480060960121920243 / OpenLayers.METERS_PER_INCH,   //EPSG:9003
    "IFoot": 0.30480000000000000000 / OpenLayers.METERS_PER_INCH,   //EPSG:9002
    "ClarkeFoot": 0.3047972651151 / OpenLayers.METERS_PER_INCH,   //EPSG:9005
    "SearsFoot": 0.30479947153867624624 / OpenLayers.METERS_PER_INCH,   //EPSG:9041
    "GoldCoastFoot": 0.30479971018150881758 / OpenLayers.METERS_PER_INCH,   //EPSG:9094
    "IInch": 0.02540000000000000000 / OpenLayers.METERS_PER_INCH,
    "MicroInch": 0.00002540000000000000 / OpenLayers.METERS_PER_INCH,
    "Mil": 0.00000002540000000000 / OpenLayers.METERS_PER_INCH,
    "Centimeter": 0.01000000000000000000 / OpenLayers.METERS_PER_INCH,
    "Kilometer": 1000.00000000000000000000 / OpenLayers.METERS_PER_INCH,   //EPSG:9036
    "Yard": 0.91440182880365760731 / OpenLayers.METERS_PER_INCH,
    "SearsYard": 0.914398414616029 / OpenLayers.METERS_PER_INCH,   //EPSG:9040
    "IndianYard": 0.91439853074444079983 / OpenLayers.METERS_PER_INCH,   //EPSG:9084
    "IndianYd37": 0.91439523 / OpenLayers.METERS_PER_INCH,   //EPSG:9085
    "IndianYd62": 0.9143988 / OpenLayers.METERS_PER_INCH,   //EPSG:9086
    "IndianYd75": 0.9143985 / OpenLayers.METERS_PER_INCH,   //EPSG:9087
    "IndianFoot": 0.30479951 / OpenLayers.METERS_PER_INCH,   //EPSG:9080
    "IndianFt37": 0.30479841 / OpenLayers.METERS_PER_INCH,   //EPSG:9081
    "IndianFt62": 0.3047996 / OpenLayers.METERS_PER_INCH,   //EPSG:9082
    "IndianFt75": 0.3047995 / OpenLayers.METERS_PER_INCH,   //EPSG:9083
    "Mile": 1609.34721869443738887477 / OpenLayers.METERS_PER_INCH,
    "IYard": 0.91440000000000000000 / OpenLayers.METERS_PER_INCH,   //EPSG:9096
    "IMile": 1609.34400000000000000000 / OpenLayers.METERS_PER_INCH,   //EPSG:9093
    "NautM": 1852.00000000000000000000 / OpenLayers.METERS_PER_INCH,   //EPSG:9030
    "Lat-66": 110943.316488932731 / OpenLayers.METERS_PER_INCH,
    "Lat-83": 110946.25736872234125 / OpenLayers.METERS_PER_INCH,
    "Decimeter": 0.10000000000000000000 / OpenLayers.METERS_PER_INCH,
    "Millimeter": 0.00100000000000000000 / OpenLayers.METERS_PER_INCH,
    "Dekameter": 10.00000000000000000000 / OpenLayers.METERS_PER_INCH,
    "Decameter": 10.00000000000000000000 / OpenLayers.METERS_PER_INCH,
    "Hectometer": 100.00000000000000000000 / OpenLayers.METERS_PER_INCH,
    "GermanMeter": 1.0000135965 / OpenLayers.METERS_PER_INCH,   //EPSG:9031
    "CaGrid": 0.999738 / OpenLayers.METERS_PER_INCH,
    "ClarkeChain": 20.1166194976 / OpenLayers.METERS_PER_INCH,   //EPSG:9038
    "GunterChain": 20.11684023368047 / OpenLayers.METERS_PER_INCH,   //EPSG:9033
    "BenoitChain": 20.116782494375872 / OpenLayers.METERS_PER_INCH,   //EPSG:9062
    "SearsChain": 20.11676512155 / OpenLayers.METERS_PER_INCH,   //EPSG:9042
    "ClarkeLink": 0.201166194976 / OpenLayers.METERS_PER_INCH,   //EPSG:9039
    "GunterLink": 0.2011684023368047 / OpenLayers.METERS_PER_INCH,   //EPSG:9034
    "BenoitLink": 0.20116782494375872 / OpenLayers.METERS_PER_INCH,   //EPSG:9063
    "SearsLink": 0.2011676512155 / OpenLayers.METERS_PER_INCH,   //EPSG:9043
    "Rod": 5.02921005842012 / OpenLayers.METERS_PER_INCH,
    "IntnlChain": 20.1168 / OpenLayers.METERS_PER_INCH,   //EPSG:9097
    "IntnlLink": 0.201168 / OpenLayers.METERS_PER_INCH,   //EPSG:9098
    "Perch": 5.02921005842012 / OpenLayers.METERS_PER_INCH,
    "Pole": 5.02921005842012 / OpenLayers.METERS_PER_INCH,
    "Furlong": 201.1684023368046 / OpenLayers.METERS_PER_INCH,
    "Rood": 3.778266898 / OpenLayers.METERS_PER_INCH,
    "CapeFoot": 0.3047972615 / OpenLayers.METERS_PER_INCH,
    "Brealey": 375.00000000000000000000 / OpenLayers.METERS_PER_INCH,
    "ModAmFt": 0.304812252984505969011938 / OpenLayers.METERS_PER_INCH,
    "Fathom": 1.8288 / OpenLayers.METERS_PER_INCH,
    "NautM-UK": 1853.184 / OpenLayers.METERS_PER_INCH,
    "50kilometers": 50000.0 / OpenLayers.METERS_PER_INCH,
    "150kilometers": 150000.0 / OpenLayers.METERS_PER_INCH
});

//unit abbreviations supported by PROJ.4
OpenLayers.Util.extend(OpenLayers.INCHES_PER_UNIT, {
    "mm": OpenLayers.INCHES_PER_UNIT["Meter"] / 1000.0,
    "cm": OpenLayers.INCHES_PER_UNIT["Meter"] / 100.0,
    "dm": OpenLayers.INCHES_PER_UNIT["Meter"] * 100.0,
    "km": OpenLayers.INCHES_PER_UNIT["Meter"] * 1000.0,
    "kmi": OpenLayers.INCHES_PER_UNIT["nmi"],    //International Nautical Mile
    "fath": OpenLayers.INCHES_PER_UNIT["Fathom"], //International Fathom
    "ch": OpenLayers.INCHES_PER_UNIT["IntnlChain"],  //International Chain
    "link": OpenLayers.INCHES_PER_UNIT["IntnlLink"], //International Link
    "us-in": OpenLayers.INCHES_PER_UNIT["inches"], //U.S. Surveyor's Inch
    "us-ft": OpenLayers.INCHES_PER_UNIT["Foot"],	//U.S. Surveyor's Foot
    "us-yd": OpenLayers.INCHES_PER_UNIT["Yard"],	//U.S. Surveyor's Yard
    "us-ch": OpenLayers.INCHES_PER_UNIT["GunterChain"], //U.S. Surveyor's Chain
    "us-mi": OpenLayers.INCHES_PER_UNIT["Mile"],   //U.S. Surveyor's Statute Mile
    "ind-yd": OpenLayers.INCHES_PER_UNIT["IndianYd37"],  //Indian Yard
    "ind-ft": OpenLayers.INCHES_PER_UNIT["IndianFt37"],  //Indian Foot
    "ind-ch": 20.11669506 / OpenLayers.METERS_PER_INCH  //Indian Chain
});

/** 
 * Constant: DOTS_PER_INCH
 * {Integer} 72 (A sensible default)
 */
OpenLayers.DOTS_PER_INCH = 72;

/**
 * Function: normalizeScale
 * 
 * Parameters:
 * scale - {float}
 * 
 * Returns:
 * {Float} A normalized scale value, in 1 / X format. 
 *         This means that if a value less than one ( already 1/x) is passed
 *         in, it just returns scale directly. Otherwise, it returns 
 *         1 / scale
 */
OpenLayers.Util.normalizeScale = function (scale) {
    var normScale = (scale > 1.0) ? (1.0 / scale) 
                                  : scale;
    return normScale;
};

/**
 * Function: getResolutionFromScale
 * 
 * Parameters:
 * scale - {Float}
 * units - {String} Index into OpenLayers.INCHES_PER_UNIT hashtable.
 *                  Default is degrees
 * 
 * Returns:
 * {Float} The corresponding resolution given passed-in scale and unit 
 *     parameters.  If the given scale is falsey, the returned resolution will
 *     be undefined.
 */
OpenLayers.Util.getResolutionFromScale = function (scale, units) {
    var resolution;
    if (scale) {
        if (units == null) {
            units = "degrees";
        }
        var normScale = OpenLayers.Util.normalizeScale(scale);
        resolution = 1 / (normScale * OpenLayers.INCHES_PER_UNIT[units]
                                        * OpenLayers.DOTS_PER_INCH);        
    }
    return resolution;
};

/**
 * Function: getScaleFromResolution
 * 
 * Parameters:
 * resolution - {Float}
 * units - {String} Index into OpenLayers.INCHES_PER_UNIT hashtable.
 *                  Default is degrees
 * 
 * Returns:
 * {Float} The corresponding scale given passed-in resolution and unit 
 *         parameters.
 */
OpenLayers.Util.getScaleFromResolution = function (resolution, units) {

    if (units == null) {
        units = "degrees";
    }

    var scale = resolution * OpenLayers.INCHES_PER_UNIT[units] *
                    OpenLayers.DOTS_PER_INCH;
    return scale;
};

/**
 * Function: pagePosition
 * Calculates the position of an element on the page (see
 * http://code.google.com/p/doctype/wiki/ArticlePageOffset)
 *
 * OpenLayers.Util.pagePosition is based on Yahoo's getXY method, which is
 * Copyright (c) 2006, Yahoo! Inc.
 * All rights reserved.
 * 
 * Redistribution and use of this software in source and binary forms, with or
 * without modification, are permitted provided that the following conditions
 * are met:
 * 
 * * Redistributions of source code must retain the above copyright notice,
 *   this list of conditions and the following disclaimer.
 * 
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 * 
 * * Neither the name of Yahoo! Inc. nor the names of its contributors may be
 *   used to endorse or promote products derived from this software without
 *   specific prior written permission of Yahoo! Inc.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE 
 * POSSIBILITY OF SUCH DAMAGE.
 *
 * Parameters:
 * forElement - {DOMElement}
 * 
 * Returns:
 * {Array} two item array, Left value then Top value.
 */
OpenLayers.Util.pagePosition =  function(forElement) {
    // NOTE: If element is hidden (display none or disconnected or any the
    // ancestors are hidden) we get (0,0) by default but we still do the
    // accumulation of scroll position.

    var pos = [0, 0];
    var viewportElement = OpenLayers.Util.getViewportElement();
    if (!forElement || forElement == window || forElement == viewportElement) {
        // viewport is always at 0,0 as that defined the coordinate system for
        // this function - this avoids special case checks in the code below
        return pos;
    }

    // Gecko browsers normally use getBoxObjectFor to calculate the position.
    // When invoked for an element with an implicit absolute position though it
    // can be off by one. Therefore the recursive implementation is used in
    // those (relatively rare) cases.
    var BUGGY_GECKO_BOX_OBJECT =
        OpenLayers.IS_GECKO && document.getBoxObjectFor &&
        OpenLayers.Element.getStyle(forElement, 'position') == 'absolute' &&
        (forElement.style.top == '' || forElement.style.left == '');

    var parent = null;
    var box;

    if (forElement.getBoundingClientRect) { // IE
        box = forElement.getBoundingClientRect();
        var scrollTop = viewportElement.scrollTop;
        var scrollLeft = viewportElement.scrollLeft;

        pos[0] = box.left + scrollLeft;
        pos[1] = box.top + scrollTop;

    } else if (document.getBoxObjectFor && !BUGGY_GECKO_BOX_OBJECT) { // gecko
        // Gecko ignores the scroll values for ancestors, up to 1.9.  See:
        // https://bugzilla.mozilla.org/show_bug.cgi?id=328881 and
        // https://bugzilla.mozilla.org/show_bug.cgi?id=330619

        box = document.getBoxObjectFor(forElement);
        var vpBox = document.getBoxObjectFor(viewportElement);
        pos[0] = box.screenX - vpBox.screenX;
        pos[1] = box.screenY - vpBox.screenY;

    } else { // safari/opera
        pos[0] = forElement.offsetLeft;
        pos[1] = forElement.offsetTop;
        parent = forElement.offsetParent;
        if (parent != forElement) {
            while (parent) {
                pos[0] += parent.offsetLeft;
                pos[1] += parent.offsetTop;
                parent = parent.offsetParent;
            }
        }

        var browser = OpenLayers.BROWSER_NAME;

        // opera & (safari absolute) incorrectly account for body offsetTop
        if (browser == "opera" || (browser == "safari" &&
              OpenLayers.Element.getStyle(forElement, 'position') == 'absolute')) {
            pos[1] -= document.body.offsetTop;
        }

        // accumulate the scroll positions for everything but the body element
        parent = forElement.offsetParent;
        while (parent && parent != document.body) {
            pos[0] -= parent.scrollLeft;
            // see https://bugs.opera.com/show_bug.cgi?id=249965
            if (browser != "opera" || parent.tagName != 'TR') {
                pos[1] -= parent.scrollTop;
            }
            parent = parent.offsetParent;
        }
    }
    
    return pos;
};

/**
 * Function: getViewportElement
 * Returns die viewport element of the document. The viewport element is
 * usually document.documentElement, except in IE,where it is either
 * document.body or document.documentElement, depending on the document's
 * compatibility mode (see
 * http://code.google.com/p/doctype/wiki/ArticleClientViewportElement)
 *
 * Returns:
 * {DOMElement}
 */
OpenLayers.Util.getViewportElement = function() {
    var viewportElement = arguments.callee.viewportElement;
    if (viewportElement == undefined) {
        viewportElement = (OpenLayers.BROWSER_NAME == "msie" &&
            document.compatMode != 'CSS1Compat') ? document.body :
            document.documentElement;
        arguments.callee.viewportElement = viewportElement;
    }
    return viewportElement;
};

/** 
 * Function: isEquivalentUrl
 * Test two URLs for equivalence. 
 * 
 * Setting 'ignoreCase' allows for case-independent comparison.
 * 
 * Comparison is based on: 
 *  - Protocol
 *  - Host (evaluated without the port)
 *  - Port (set 'ignorePort80' to ignore "80" values)
 *  - Hash ( set 'ignoreHash' to disable)
 *  - Pathname (for relative <-> absolute comparison) 
 *  - Arguments (so they can be out of order)
 *  
 * Parameters:
 * url1 - {String}
 * url2 - {String}
 * options - {Object} Allows for customization of comparison:
 *                    'ignoreCase' - Default is True
 *                    'ignorePort80' - Default is True
 *                    'ignoreHash' - Default is True
 *
 * Returns:
 * {Boolean} Whether or not the two URLs are equivalent
 */
OpenLayers.Util.isEquivalentUrl = function(url1, url2, options) {
    options = options || {};

    OpenLayers.Util.applyDefaults(options, {
        ignoreCase: true,
        ignorePort80: true,
        ignoreHash: true
    });

    var urlObj1 = OpenLayers.Util.createUrlObject(url1, options);
    var urlObj2 = OpenLayers.Util.createUrlObject(url2, options);

    //compare all keys except for "args" (treated below)
    for(var key in urlObj1) {
        if(key !== "args") {
            if(urlObj1[key] != urlObj2[key]) {
                return false;
            }
        }
    }

    // compare search args - irrespective of order
    for(var key in urlObj1.args) {
        if(urlObj1.args[key] != urlObj2.args[key]) {
            return false;
        }
        delete urlObj2.args[key];
    }
    // urlObj2 shouldn't have any args left
    for(var key in urlObj2.args) {
        return false;
    }
    
    return true;
};

/**
 * Function: createUrlObject
 * 
 * Parameters:
 * url - {String}
 * options - {Object} A hash of options.
 *
 * Valid options:
 *   ignoreCase - {Boolean} lowercase url,
 *   ignorePort80 - {Boolean} don't include explicit port if port is 80,
 *   ignoreHash - {Boolean} Don't include part of url after the hash (#).
 * 
 * Returns:
 * {Object} An object with separate url, a, port, host, and args parsed out 
 *          and ready for comparison
 */
OpenLayers.Util.createUrlObject = function(url, options) {
    options = options || {};

    // deal with relative urls first
    if(!(/^\w+:\/\//).test(url)) {
        var loc = window.location;
        var port = loc.port ? ":" + loc.port : "";
        var fullUrl = loc.protocol + "//" + loc.host.split(":").shift() + port;
        if(url.indexOf("/") === 0) {
            // full pathname
            url = fullUrl + url;
        } else {
            // relative to current path
            var parts = loc.pathname.split("/");
            parts.pop();
            url = fullUrl + parts.join("/") + "/" + url;
        }
    }
  
    if (options.ignoreCase) {
        url = url.toLowerCase(); 
    }

    var a = document.createElement('a');
    a.href = url;
    
    var urlObject = {};
    
    //host (without port)
    urlObject.host = a.host.split(":").shift();

    //protocol
    urlObject.protocol = a.protocol;  

    //port (get uniform browser behavior with port 80 here)
    if(options.ignorePort80) {
        urlObject.port = (a.port == "80" || a.port == "0") ? "" : a.port;
    } else {
        urlObject.port = (a.port == "" || a.port == "0") ? "80" : a.port;
    }

    //hash
    urlObject.hash = (options.ignoreHash || a.hash === "#") ? "" : a.hash;  
    
    //args
    var queryString = a.search;
    if (!queryString) {
        var qMark = url.indexOf("?");
        queryString = (qMark != -1) ? url.substr(qMark) : "";
    }
    urlObject.args = OpenLayers.Util.getParameters(queryString);

    // pathname
    //
    // This is a workaround for Internet Explorer where
    // window.location.pathname has a leading "/", but
    // a.pathname has no leading "/".
    urlObject.pathname = (a.pathname.charAt(0) == "/") ? a.pathname : "/" + a.pathname;
    
    return urlObject; 
};
 
/**
 * Function: removeTail
 * Takes a url and removes everything after the ? and #
 * 
 * Parameters:
 * url - {String} The url to process
 * 
 * Returns:
 * {String} The string with all queryString and Hash removed
 */
OpenLayers.Util.removeTail = function(url) {
    var head = null;
    
    var qMark = url.indexOf("?");
    var hashMark = url.indexOf("#");

    if (qMark == -1) {
        head = (hashMark != -1) ? url.substr(0,hashMark) : url;
    } else {
        head = (hashMark != -1) ? url.substr(0,Math.min(qMark, hashMark)) 
                                  : url.substr(0, qMark);
    }
    return head;
};

/**
 * Constant: IS_GECKO
 * {Boolean} True if the userAgent reports the browser to use the Gecko engine
 */
OpenLayers.IS_GECKO = (function() {
    var ua = navigator.userAgent.toLowerCase();
    return ua.indexOf("webkit") == -1 && ua.indexOf("gecko") != -1;
})();

/**
 * Constant: CANVAS_SUPPORTED
 * {Boolean} True if canvas 2d is supported.
 */
OpenLayers.CANVAS_SUPPORTED = (function() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
})();

/**
 * Constant: BROWSER_NAME
 * {String}
 * A substring of the navigator.userAgent property.  Depending on the userAgent
 *     property, this will be the empty string or one of the following:
 *     * "opera" -- Opera
 *     * "msie"  -- Internet Explorer
 *     * "safari" -- Safari
 *     * "firefox" -- Firefox
 *     * "mozilla" -- Mozilla
 */
OpenLayers.BROWSER_NAME = (function() {
    var name = "";
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("opera") != -1) {
        name = "opera";
    } else if (ua.indexOf("msie") != -1) {
        name = "msie";
    } else if (ua.indexOf("safari") != -1) {
        name = "safari";
    } else if (ua.indexOf("mozilla") != -1) {
        if (ua.indexOf("firefox") != -1) {
            name = "firefox";
        } else {
            name = "mozilla";
        }
    }
    return name;
})();

/**
 * Function: getBrowserName
 * 
 * Returns:
 * {String} A string which specifies which is the current 
 *          browser in which we are running. 
 * 
 *          Currently-supported browser detection and codes:
 *           * 'opera' -- Opera
 *           * 'msie'  -- Internet Explorer
 *           * 'safari' -- Safari
 *           * 'firefox' -- Firefox
 *           * 'mozilla' -- Mozilla
 * 
 *          If we are unable to property identify the browser, we 
 *           return an empty string.
 */
OpenLayers.Util.getBrowserName = function() {
    return OpenLayers.BROWSER_NAME;
};

/**
 * Method: getRenderedDimensions
 * Renders the contentHTML offscreen to determine actual dimensions for
 *     popup sizing. As we need layout to determine dimensions the content
 *     is rendered -9999px to the left and absolute to ensure the 
 *     scrollbars do not flicker
 *     
 * Parameters:
 * contentHTML
 * size - {<OpenLayers.Size>} If either the 'w' or 'h' properties is 
 *     specified, we fix that dimension of the div to be measured. This is 
 *     useful in the case where we have a limit in one dimension and must 
 *     therefore meaure the flow in the other dimension.
 * options - {Object}
 *
 * Allowed Options:
 *     displayClass - {String} Optional parameter.  A CSS class name(s) string
 *         to provide the CSS context of the rendered content.
 *     containerElement - {DOMElement} Optional parameter. Insert the HTML to 
 *         this node instead of the body root when calculating dimensions. 
 * 
 * Returns:
 * {<OpenLayers.Size>}
 */
OpenLayers.Util.getRenderedDimensions = function(contentHTML, size, options) {
    
    var w, h;
    
    // create temp container div with restricted size
    var container = document.createElement("div");
    container.style.visibility = "hidden";
        
    var containerElement = (options && options.containerElement) 
    	? options.containerElement : document.body;

    //fix a dimension, if specified.
    if (size) {
        if (size.w) {
            w = size.w;
            container.style.width = w + "px";
        } else if (size.h) {
            h = size.h;
            container.style.height = h + "px";
        }
    }

    //add css classes, if specified
    if (options && options.displayClass) {
        container.className = options.displayClass;
    }
    
    // create temp content div and assign content
    var content = document.createElement("div");
    content.innerHTML = contentHTML;
    
    // we need overflow visible when calculating the size
    content.style.overflow = "visible";
    if (content.childNodes) {
        for (var i=0, l=content.childNodes.length; i<l; i++) {
            if (!content.childNodes[i].style) continue;
            content.childNodes[i].style.overflow = "visible";
        }
    }
    
    // add content to restricted container 
    container.appendChild(content);
    
    // append container to body for rendering
    containerElement.appendChild(container);
    
    // Opera and IE7 can't handle a node with position:aboslute if it inherits
    // position:absolute from a parent.
    var parentHasPositionAbsolute = false;
    var parent = container.parentNode;
    while (parent && parent.tagName.toLowerCase()!="body") {
        var parentPosition = OpenLayers.Element.getStyle(parent, "position");
        if(parentPosition == "absolute") {
            parentHasPositionAbsolute = true;
            break;
        } else if (parentPosition && parentPosition != "static") {
            break;
        }
        parent = parent.parentNode;
    }

    if(!parentHasPositionAbsolute) {
        container.style.position = "absolute";
    }
    
    // calculate scroll width of content and add corners and shadow width
    if (!w) {
        w = parseInt(content.scrollWidth);
    
        // update container width to allow height to adjust
        container.style.width = w + "px";
    }        
    // capture height and add shadow and corner image widths
    if (!h) {
        h = parseInt(content.scrollHeight);
    }

    // remove elements
    container.removeChild(content);
    containerElement.removeChild(container);
    
    return new OpenLayers.Size(w, h);
};

/**
 * APIFunction: getScrollbarWidth
 * This function has been modified by the OpenLayers from the original version,
 *     written by Matthew Eernisse and released under the Apache 2 
 *     license here:
 * 
 *     http://www.fleegix.org/articles/2006/05/30/getting-the-scrollbar-width-in-pixels
 * 
 *     It has been modified simply to cache its value, since it is physically 
 *     impossible that this code could ever run in more than one browser at 
 *     once. 
 * 
 * Returns:
 * {Integer}
 */
OpenLayers.Util.getScrollbarWidth = function() {
    
    var scrollbarWidth = OpenLayers.Util._scrollbarWidth;
    
    if (scrollbarWidth == null) {
        var scr = null;
        var inn = null;
        var wNoScroll = 0;
        var wScroll = 0;
    
        // Outer scrolling div
        scr = document.createElement('div');
        scr.style.position = 'absolute';
        scr.style.top = '-1000px';
        scr.style.left = '-1000px';
        scr.style.width = '100px';
        scr.style.height = '50px';
        // Start with no scrollbar
        scr.style.overflow = 'hidden';
    
        // Inner content div
        inn = document.createElement('div');
        inn.style.width = '100%';
        inn.style.height = '200px';
    
        // Put the inner div in the scrolling div
        scr.appendChild(inn);
        // Append the scrolling div to the doc
        document.body.appendChild(scr);
    
        // Width of the inner div sans scrollbar
        wNoScroll = inn.offsetWidth;
    
        // Add the scrollbar
        scr.style.overflow = 'scroll';
        // Width of the inner div width scrollbar
        wScroll = inn.offsetWidth;
    
        // Remove the scrolling div from the doc
        document.body.removeChild(document.body.lastChild);
    
        // Pixel width of the scroller
        OpenLayers.Util._scrollbarWidth = (wNoScroll - wScroll);
        scrollbarWidth = OpenLayers.Util._scrollbarWidth;
    }

    return scrollbarWidth;
};

/**
 * APIFunction: getFormattedLonLat
 * This function will return latitude or longitude value formatted as 
 *
 * Parameters:
 * coordinate - {Float} the coordinate value to be formatted
 * axis - {String} value of either 'lat' or 'lon' to indicate which axis is to
 *          to be formatted (default = lat)
 * dmsOption - {String} specify the precision of the output can be one of:
 *           'dms' show degrees minutes and seconds
 *           'dm' show only degrees and minutes
 *           'd' show only degrees
 * 
 * Returns:
 * {String} the coordinate value formatted as a string
 */
OpenLayers.Util.getFormattedLonLat = function(coordinate, axis, dmsOption) {
    if (!dmsOption) {
        dmsOption = 'dms';    //default to show degree, minutes, seconds
    }
	
	coordinate = (coordinate+540)%360 - 180; // normalize for sphere being round
	
    var abscoordinate = Math.abs(coordinate);
    var coordinatedegrees = Math.floor(abscoordinate);

    var coordinateminutes = (abscoordinate - coordinatedegrees)/(1/60);
    var tempcoordinateminutes = coordinateminutes;
    coordinateminutes = Math.floor(coordinateminutes);
    var coordinateseconds = (tempcoordinateminutes - coordinateminutes)/(1/60);
    coordinateseconds =  Math.round(coordinateseconds*10);
    coordinateseconds /= 10;

    if( coordinateseconds >= 60) { 
        coordinateseconds -= 60; 
        coordinateminutes += 1; 
        if( coordinateminutes >= 60) { 
            coordinateminutes -= 60; 
            coordinatedegrees += 1; 
        } 
    }
    
    if( coordinatedegrees < 10 ) {
        coordinatedegrees = "0" + coordinatedegrees;
    }
    var str = coordinatedegrees + "\u00B0";

    if (dmsOption.indexOf('dm') >= 0) {
        if( coordinateminutes < 10 ) {
            coordinateminutes = "0" + coordinateminutes;
        }
        str += coordinateminutes + "'";
  
        if (dmsOption.indexOf('dms') >= 0) {
            if( coordinateseconds < 10 ) {
                coordinateseconds = "0" + coordinateseconds;
            }
            str += coordinateseconds + '"';
        }
    }
    
    if (axis == "lon") {
        str += coordinate < 0 ? OpenLayers.i18n("W") : OpenLayers.i18n("E");
    } else {
        str += coordinate < 0 ? OpenLayers.i18n("S") : OpenLayers.i18n("N");
    }
    return str;
};

/**
 * APIFunction: decodeGooglePolyline
 * This function will decode a google-style polyline and return an array
 * of <OpenLayers.Geometry.Point>
 *
 * Algorithm by http://facstaff.unca.edu/mcmcclur/GoogleMaps/EncodePolyline/
 *
 * Parameters:
 * polyline - {String} encoded polyline
 *
 * Returns:
 * {Array(<OpenLayers.LonLat>} decoded points array
 */
OpenLayers.Util.decodeGooglePolyline = function(polyline) {
    var points = new Array();

    var b;
    var i = 0;
    var lat = 0;
    var lon = 0;
    var result;
    var shift;

    while (i < polyline.length) {
      result = 0;
      shift = 0;

      do {
        b = polyline.charCodeAt(i++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      lat += ((result & 1) ? ~(result >> 1) : (result >> 1));

      result = 0;
      shift = 0;

      do {
        b = polyline.charCodeAt(i++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      lon += ((result & 1) ? ~(result >> 1) : (result >> 1));

      points.push(new OpenLayers.LonLat(lon * 1e-5, lat * 1e-5));
    }

    return points;
};

/**
 * APIFunction: decodeGoogleLoD
 * This function will decode a google-style level of details string an array
 *
 * Algorithm by http://facstaff.unca.edu/mcmcclur/GoogleMaps/EncodePolyline/
 *
 * Parameters:
 * levels - {String} encoded levels
 * num_levels - {int} number of levels
 *
 * Returns:
 * {Array(int} decoded levels array
 */
OpenLayers.Util.decodeGoogleLoD = function(levels, num_levels) {
    var lod = new Array();

    var b;
    var i = 0;
    var result;
    var shift;

    while (i < levels.length) {
      result = 0;
      shift = 0;

      do {
        b = levels.charCodeAt(i++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      lod.push(num_levels - result - 1);
    }

    return lod;
};

/**
 * APIFunction: decodeGoogle
 * This function will decode a google-style string to an array
 *
 * Algorithm by http://facstaff.unca.edu/mcmcclur/GoogleMaps/EncodePolyline/
 *
 * Parameters:
 * list- {String} encoded list
 *
 * Returns:
 * {Array(int} decoded list
 */
OpenLayers.Util.decodeGoogle = function(list_encoded) {
    var list = new Array();

    var b;
    var i = 0;
    var result;
    var shift;
    var value = 0;

    while (i < list_encoded.length) {
      result = 0;
      shift = 0;

      do {
        b = list_encoded.charCodeAt(i++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      value += (result & 1) ? ~(result >> 1) : (result >> 1);

      list.push(value);
    }

    return list;
};

/* ======================================================================
    OpenLayers/Feature.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


/**
 * @requires OpenLayers/BaseTypes/Class.js
 * @requires OpenLayers/Util.js
 */

/**
 * Class: OpenLayers.Feature
 * Features are combinations of geography and attributes. The OpenLayers.Feature
 *     class specifically combines a marker and a lonlat.
 */
OpenLayers.Feature = OpenLayers.Class({

    /** 
     * Property: layer 
     * {<OpenLayers.Layer>} 
     */
    layer: null,

    /** 
     * Property: id 
     * {String} 
     */
    id: null,
    
    /** 
     * Property: lonlat 
     * {<OpenLayers.LonLat>} 
     */
    lonlat: null,

    /** 
     * Property: data 
     * {Object} 
     */
    data: null,

    /** 
     * Property: marker 
     * {<OpenLayers.Marker>} 
     */
    marker: null,

    /**
     * APIProperty: popupClass
     * {<OpenLayers.Class>} The class which will be used to instantiate
     *     a new Popup. Default is <OpenLayers.Popup.Anchored>.
     */
    popupClass: null,

    /** 
     * Property: popup 
     * {<OpenLayers.Popup>} 
     */
    popup: null,

    /** 
     * Constructor: OpenLayers.Feature
     * Constructor for features.
     *
     * Parameters:
     * layer - {<OpenLayers.Layer>} 
     * lonlat - {<OpenLayers.LonLat>} 
     * data - {Object} 
     * 
     * Returns:
     * {<OpenLayers.Feature>}
     */
    initialize: function(layer, lonlat, data) {
        this.layer = layer;
        this.lonlat = lonlat;
        this.data = (data != null) ? data : {};
        this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_"); 
    },

    /** 
     * Method: destroy
     * nullify references to prevent circular references and memory leaks
     */
    destroy: function() {

        //remove the popup from the map
        if ((this.layer != null) && (this.layer.map != null)) {
            if (this.popup != null) {
                this.layer.map.removePopup(this.popup);
            }
        }
        // remove the marker from the layer
        if (this.layer != null && this.marker != null) {
            this.layer.removeMarker(this.marker);
        }

        this.layer = null;
        this.id = null;
        this.lonlat = null;
        this.data = null;
        if (this.marker != null) {
            this.destroyMarker(this.marker);
            this.marker = null;
        }
        if (this.popup != null) {
            this.destroyPopup(this.popup);
            this.popup = null;
        }
    },
    
    /**
     * Method: onScreen
     * 
     * Returns:
     * {Boolean} Whether or not the feature is currently visible on screen
     *           (based on its 'lonlat' property)
     */
    onScreen:function() {
        
        var onScreen = false;
        if ((this.layer != null) && (this.layer.map != null)) {
            var screenBounds = this.layer.map.getExtent();
            onScreen = screenBounds.containsLonLat(this.lonlat);
        }    
        return onScreen;
    },
    

    /**
     * Method: createMarker
     * Based on the data associated with the Feature, create and return a marker object.
     *
     * Returns: 
     * {<OpenLayers.Marker>} A Marker Object created from the 'lonlat' and 'icon' properties
     *          set in this.data. If no 'lonlat' is set, returns null. If no
     *          'icon' is set, OpenLayers.Marker() will load the default image.
     *          
     *          Note - this.marker is set to return value
     * 
     */
    createMarker: function() {

        if (this.lonlat != null) {
            this.marker = new OpenLayers.Marker(this.lonlat, this.data.icon);
        }
        return this.marker;
    },

    /**
     * Method: destroyMarker
     * Destroys marker.
     * If user overrides the createMarker() function, s/he should be able
     *   to also specify an alternative function for destroying it
     */
    destroyMarker: function() {
        this.marker.destroy();  
    },

    /**
     * Method: createPopup
     * Creates a popup object created from the 'lonlat', 'popupSize',
     *     and 'popupContentHTML' properties set in this.data. It uses
     *     this.marker.icon as default anchor. 
     *  
     *  If no 'lonlat' is set, returns null. 
     *  If no this.marker has been created, no anchor is sent.
     *
     *  Note - the returned popup object is 'owned' by the feature, so you
     *      cannot use the popup's destroy method to discard the popup.
     *      Instead, you must use the feature's destroyPopup
     * 
     *  Note - this.popup is set to return value
     * 
     * Parameters: 
     * closeBox - {Boolean} create popup with closebox or not
     * 
     * Returns:
     * {<OpenLayers.Popup>} Returns the created popup, which is also set
     *     as 'popup' property of this feature. Will be of whatever type
     *     specified by this feature's 'popupClass' property, but must be
     *     of type <OpenLayers.Popup>.
     * 
     */
    createPopup: function(closeBox) {

        if (this.lonlat != null) {
            if (!this.popup) {
                var anchor = (this.marker) ? this.marker.icon : null;
                var popupClass = this.popupClass ? 
                    this.popupClass : OpenLayers.Popup.Anchored;
                this.popup = new popupClass(this.id + "_popup", 
                                            this.lonlat,
                                            this.data.popupSize,
                                            this.data.popupContentHTML,
                                            anchor, 
                                            closeBox); 
            }    
            if (this.data.overflow != null) {
                this.popup.contentDiv.style.overflow = this.data.overflow;
            }    
            
            this.popup.feature = this;
        }        
        return this.popup;
    },

    
    /**
     * Method: destroyPopup
     * Destroys the popup created via createPopup.
     *
     * As with the marker, if user overrides the createPopup() function, s/he 
     *   should also be able to override the destruction
     */
    destroyPopup: function() {
        if (this.popup) {
            this.popup.feature = null;
            this.popup.destroy();
            this.popup = null;
        }    
    },

    CLASS_NAME: "OpenLayers.Feature"
});
/* ======================================================================
    OpenLayers/Feature/Vector.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

// TRASH THIS
OpenLayers.State = {
    /** states */
    UNKNOWN: 'Unknown',
    INSERT: 'Insert',
    UPDATE: 'Update',
    DELETE: 'Delete'
};

/**
 * @requires OpenLayers/Feature.js
 * @requires OpenLayers/Util.js
 */

/**
 * Class: OpenLayers.Feature.Vector
 * Vector features use the OpenLayers.Geometry classes as geometry description.
 * They have an 'attributes' property, which is the data object, and a 'style'
 * property, the default values of which are defined in the 
 * <OpenLayers.Feature.Vector.style> objects.
 * 
 * Inherits from:
 *  - <OpenLayers.Feature>
 */
OpenLayers.Feature.Vector = OpenLayers.Class(OpenLayers.Feature, {

    /** 
     * Property: fid 
     * {String} 
     */
    fid: null,
    
    /** 
     * APIProperty: geometry 
     * {<OpenLayers.Geometry>} 
     */
    geometry: null,

    /** 
     * APIProperty: attributes 
     * {Object} This object holds arbitrary, serializable properties that
     *     describe the feature.
     */
    attributes: null,

    /**
     * Property: bounds
     * {<OpenLayers.Bounds>} The box bounding that feature's geometry, that
     *     property can be set by an <OpenLayers.Format> object when
     *     deserializing the feature, so in most cases it represents an
     *     information set by the server. 
     */
    bounds: null,

    /** 
     * Property: state 
     * {String} 
     */
    state: null,
    
    /** 
     * APIProperty: style 
     * {Object} 
     */
    style: null,

    /**
     * APIProperty: url
     * {String} If this property is set it will be taken into account by
     *     {<OpenLayers.HTTP>} when upadting or deleting the feature.
     */
    url: null,
    
    /**
     * Property: renderIntent
     * {String} rendering intent currently being used
     */
    renderIntent: "default",
    
    /**
     * APIProperty: modified
     * {Object} An object with the originals of the geometry and attributes of
     * the feature, if they were changed. Currently this property is only read
     * by <OpenLayers.Format.WFST.v1>, and written by
     * <OpenLayers.Control.ModifyFeature>, which sets the geometry property.
     * Applications can set the originals of modified attributes in the
     * attributes property. Note that applications have to check if this
     * object and the attributes property is already created before using it.
     * After a change made with ModifyFeature, this object could look like
     *
     * (code)
     * {
     *     geometry: >Object
     * }
     * (end)
     *
     * When an application has made changes to feature attributes, it could
     * have set the attributes to something like this:
     *
     * (code)
     * {
     *     attributes: {
     *         myAttribute: "original"
     *     }
     * }
     * (end)
     *
     * Note that <OpenLayers.Format.WFST.v1> only checks for truthy values in
     * *modified.geometry* and the attribute names in *modified.attributes*,
     * but it is recommended to set the original values (and not just true) as
     * attribute value, so applications could use this information to undo
     * changes.
     */
    modified: null,

    /** 
     * Constructor: OpenLayers.Feature.Vector
     * Create a vector feature. 
     * 
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} The geometry that this feature
     *     represents.
     * attributes - {Object} An optional object that will be mapped to the
     *     <attributes> property. 
     * style - {Object} An optional style object.
     */
    initialize: function(geometry, attributes, style) {
        OpenLayers.Feature.prototype.initialize.apply(this,
                                                      [null, null, attributes]);
        this.lonlat = null;
        this.geometry = geometry ? geometry : null;
        this.state = null;
        this.attributes = {};
        if (attributes) {
            this.attributes = OpenLayers.Util.extend(this.attributes,
                                                     attributes);
        }
        this.style = style ? style : null; 
    },
    
    /** 
     * Method: destroy
     * nullify references to prevent circular references and memory leaks
     */
    destroy: function() {
        if (this.layer) {
            this.layer.removeFeatures(this);
            this.layer = null;
        }
            
        this.geometry = null;
        this.modified = null;
        OpenLayers.Feature.prototype.destroy.apply(this, arguments);
    },
    
    /**
     * Method: clone
     * Create a clone of this vector feature.  Does not set any non-standard
     *     properties.
     *
     * Returns:
     * {<OpenLayers.Feature.Vector>} An exact clone of this vector feature.
     */
    clone: function () {
        return new OpenLayers.Feature.Vector(
            this.geometry ? this.geometry.clone() : null,
            this.attributes,
            this.style);
    },

    /**
     * Method: onScreen
     * Determine whether the feature is within the map viewport.  This method
     *     tests for an intersection between the geometry and the viewport
     *     bounds.  If a more effecient but less precise geometry bounds
     *     intersection is desired, call the method with the boundsOnly
     *     parameter true.
     *
     * Parameters:
     * boundsOnly - {Boolean} Only test whether a feature's bounds intersects
     *     the viewport bounds.  Default is false.  If false, the feature's
     *     geometry must intersect the viewport for onScreen to return true.
     * 
     * Returns:
     * {Boolean} The feature is currently visible on screen (optionally
     *     based on its bounds if boundsOnly is true).
     */
    onScreen:function(boundsOnly) {
        var onScreen = false;
        if(this.layer && this.layer.map) {
            var screenBounds = this.layer.map.getExtent();
            if(boundsOnly) {
                var featureBounds = this.geometry.getBounds();
                onScreen = screenBounds.intersectsBounds(featureBounds);
            } else {
                var screenPoly = screenBounds.toGeometry();
                onScreen = screenPoly.intersects(this.geometry);
            }
        }    
        return onScreen;
    },

    /**
     * Method: getVisibility
     * Determine whether the feature is displayed or not. It may not displayed
     *     because:
     *     - its style display property is set to 'none',
     *     - it doesn't belong to any layer,
     *     - the styleMap creates a symbolizer with display property set to 'none'
     *          for it,
     *     - the layer which it belongs to is not visible.
     * 
     * Returns:
     * {Boolean} The feature is currently displayed.
     */
    getVisibility: function() {
        return !(this.style && this.style.display == 'none' ||
                 !this.layer ||
                 this.layer && this.layer.styleMap &&
                 this.layer.styleMap.createSymbolizer(this, this.renderIntent).display == 'none' ||
                 this.layer && !this.layer.getVisibility());
    },
    
    /**
     * Method: createMarker
     * HACK - we need to decide if all vector features should be able to
     *     create markers
     * 
     * Returns:
     * {<OpenLayers.Marker>} For now just returns null
     */
    createMarker: function() {
        return null;
    },

    /**
     * Method: destroyMarker
     * HACK - we need to decide if all vector features should be able to
     *     delete markers
     * 
     * If user overrides the createMarker() function, s/he should be able
     *   to also specify an alternative function for destroying it
     */
    destroyMarker: function() {
        // pass
    },

    /**
     * Method: createPopup
     * HACK - we need to decide if all vector features should be able to
     *     create popups
     * 
     * Returns:
     * {<OpenLayers.Popup>} For now just returns null
     */
    createPopup: function() {
        return null;
    },

    /**
     * Method: atPoint
     * Determins whether the feature intersects with the specified location.
     * 
     * Parameters: 
     * lonlat - {<OpenLayers.LonLat>|Object} OpenLayers.LonLat or an
     *     object with a 'lon' and 'lat' properties.
     * toleranceLon - {float} Optional tolerance in Geometric Coords
     * toleranceLat - {float} Optional tolerance in Geographic Coords
     * 
     * Returns:
     * {Boolean} Whether or not the feature is at the specified location
     */
    atPoint: function(lonlat, toleranceLon, toleranceLat) {
        var atPoint = false;
        if(this.geometry) {
            atPoint = this.geometry.atPoint(lonlat, toleranceLon, 
                                                    toleranceLat);
        }
        return atPoint;
    },

    /**
     * Method: destroyPopup
     * HACK - we need to decide if all vector features should be able to
     * delete popups
     */
    destroyPopup: function() {
        // pass
    },

    /**
     * Method: move
     * Moves the feature and redraws it at its new location
     *
     * Parameters:
     * location - {<OpenLayers.LonLat> or <OpenLayers.Pixel>} the
     *         location to which to move the feature.
     */
    move: function(location) {

        if(!this.layer || !this.geometry.move){
            //do nothing if no layer or immoveable geometry
            return undefined;
        }

        var pixel;
        if (location.CLASS_NAME == "OpenLayers.LonLat") {
            pixel = this.layer.getViewPortPxFromLonLat(location);
        } else {
            pixel = location;
        }
        
        var lastPixel = this.layer.getViewPortPxFromLonLat(this.geometry.getBounds().getCenterLonLat());
        var res = this.layer.map.getResolution();
        this.geometry.move(res * (pixel.x - lastPixel.x),
                           res * (lastPixel.y - pixel.y));
        this.layer.drawFeature(this);
        return lastPixel;
    },
    
    /**
     * Method: toState
     * Sets the new state
     *
     * Parameters:
     * state - {String} 
     */
    toState: function(state) {
        if (state == OpenLayers.State.UPDATE) {
            switch (this.state) {
                case OpenLayers.State.UNKNOWN:
                case OpenLayers.State.DELETE:
                    this.state = state;
                    break;
                case OpenLayers.State.UPDATE:
                case OpenLayers.State.INSERT:
                    break;
            }
        } else if (state == OpenLayers.State.INSERT) {
            switch (this.state) {
                case OpenLayers.State.UNKNOWN:
                    break;
                default:
                    this.state = state;
                    break;
            }
        } else if (state == OpenLayers.State.DELETE) {
            switch (this.state) {
                case OpenLayers.State.INSERT:
                    // the feature should be destroyed
                    break;
                case OpenLayers.State.DELETE:
                    break;
                case OpenLayers.State.UNKNOWN:
                case OpenLayers.State.UPDATE:
                    this.state = state;
                    break;
            }
        } else if (state == OpenLayers.State.UNKNOWN) {
            this.state = state;
        }
    },
    
    CLASS_NAME: "OpenLayers.Feature.Vector"
});


/**
 * Constant: OpenLayers.Feature.Vector.style
 * OpenLayers features can have a number of style attributes. The 'default' 
 *     style will typically be used if no other style is specified. These
 *     styles correspond for the most part, to the styling properties defined
 *     by the SVG standard. 
 *     Information on fill properties: http://www.w3.org/TR/SVG/painting.html#FillProperties
 *     Information on stroke properties: http://www.w3.org/TR/SVG/painting.html#StrokeProperties
 *
 * Symbolizer properties:
 * fill - {Boolean} Set to false if no fill is desired.
 * fillColor - {String} Hex fill color.  Default is "#ee9900".
 * fillOpacity - {Number} Fill opacity (0-1).  Default is 0.4 
 * stroke - {Boolean} Set to false if no stroke is desired.
 * strokeColor - {String} Hex stroke color.  Default is "#ee9900".
 * strokeOpacity - {Number} Stroke opacity (0-1).  Default is 1.
 * strokeWidth - {Number} Pixel stroke width.  Default is 1.
 * strokeLinecap - {String} Stroke cap type.  Default is "round".  [butt | round | square]
 * strokeDashstyle - {String} Stroke dash style.  Default is "solid". [dot | dash | dashdot | longdash | longdashdot | solid]
 * graphic - {Boolean} Set to false if no graphic is desired.
 * pointRadius - {Number} Pixel point radius.  Default is 6.
 * pointerEvents - {String}  Default is "visiblePainted".
 * cursor - {String} Default is "".
 * externalGraphic - {String} Url to an external graphic that will be used for rendering points.
 * graphicWidth - {Number} Pixel width for sizing an external graphic.
 * graphicHeight - {Number} Pixel height for sizing an external graphic.
 * graphicOpacity - {Number} Opacity (0-1) for an external graphic.
 * graphicXOffset - {Number} Pixel offset along the positive x axis for displacing an external graphic.
 * graphicYOffset - {Number} Pixel offset along the positive y axis for displacing an external graphic.
 * rotation - {Number} For point symbolizers, this is the rotation of a graphic in the clockwise direction about its center point (or any point off center as specified by graphicXOffset and graphicYOffset).
 * graphicZIndex - {Number} The integer z-index value to use in rendering.
 * graphicName - {String} Named graphic to use when rendering points.  Supported values include "circle" (default),
 *     "square", "star", "x", "cross", "triangle".
 * graphicTitle - {String} Tooltip when hovering over a feature. *deprecated*, use title instead
 * title - {String} Tooltip when hovering over a feature. Not supported by the canvas renderer.
 * backgroundGraphic - {String} Url to a graphic to be used as the background under an externalGraphic.
 * backgroundGraphicZIndex - {Number} The integer z-index value to use in rendering the background graphic.
 * backgroundXOffset - {Number} The x offset (in pixels) for the background graphic.
 * backgroundYOffset - {Number} The y offset (in pixels) for the background graphic.
 * backgroundHeight - {Number} The height of the background graphic.  If not provided, the graphicHeight will be used.
 * backgroundWidth - {Number} The width of the background width.  If not provided, the graphicWidth will be used.
 * label - {String} The text for an optional label. For browsers that use the canvas renderer, this requires either
 *     fillText or mozDrawText to be available.
 * labelAlign - {String} Label alignment. This specifies the insertion point relative to the text. It is a string
 *     composed of two characters. The first character is for the horizontal alignment, the second for the vertical
 *     alignment. Valid values for horizontal alignment: "l"=left, "c"=center, "r"=right. Valid values for vertical
 *     alignment: "t"=top, "m"=middle, "b"=bottom. Example values: "lt", "cm", "rb". Default is "cm".
 * labelXOffset - {Number} Pixel offset along the positive x axis for displacing the label. Not supported by the canvas renderer.
 * labelYOffset - {Number} Pixel offset along the positive y axis for displacing the label. Not supported by the canvas renderer.
 * labelSelect - {Boolean} If set to true, labels will be selectable using SelectFeature or similar controls.
 *     Default is false.
 * labelOutlineColor - {String} The color of the label outline. Default is 'white'. Only supported by the canvas & SVG renderers.
 * labelOutlineWidth - {Number} The width of the label outline. Default is 3, set to 0 or null to disable. Only supported by the canvas & SVG renderers.
 * fontColor - {String} The font color for the label, to be provided like CSS.
 * fontOpacity - {Number} Opacity (0-1) for the label
 * fontFamily - {String} The font family for the label, to be provided like in CSS.
 * fontSize - {String} The font size for the label, to be provided like in CSS.
 * fontStyle - {String} The font style for the label, to be provided like in CSS.
 * fontWeight - {String} The font weight for the label, to be provided like in CSS.
 * display - {String} Symbolizers will have no effect if display is set to "none".  All other values have no effect.
 */ 
OpenLayers.Feature.Vector.style = {
    'default': {
        fillColor: "#ee9900",
        fillOpacity: 0.4, 
        hoverFillColor: "white",
        hoverFillOpacity: 0.8,
        strokeColor: "#ee9900",
        strokeOpacity: 1,
        strokeWidth: 1,
        strokeLinecap: "round",
        strokeDashstyle: "solid",
        hoverStrokeColor: "red",
        hoverStrokeOpacity: 1,
        hoverStrokeWidth: 0.2,
        pointRadius: 6,
        hoverPointRadius: 1,
        hoverPointUnit: "%",
        pointerEvents: "visiblePainted",
        cursor: "inherit",
        fontColor: "#000000",
        labelAlign: "cm",
        labelOutlineColor: "white",
        labelOutlineWidth: 3
    },
    'select': {
        fillColor: "blue",
        fillOpacity: 0.4, 
        hoverFillColor: "white",
        hoverFillOpacity: 0.8,
        strokeColor: "blue",
        strokeOpacity: 1,
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeDashstyle: "solid",
        hoverStrokeColor: "red",
        hoverStrokeOpacity: 1,
        hoverStrokeWidth: 0.2,
        pointRadius: 6,
        hoverPointRadius: 1,
        hoverPointUnit: "%",
        pointerEvents: "visiblePainted",
        cursor: "pointer",
        fontColor: "#000000",
        labelAlign: "cm",
        labelOutlineColor: "white",
        labelOutlineWidth: 3

    },
    'temporary': {
        fillColor: "#66cccc",
        fillOpacity: 0.2, 
        hoverFillColor: "white",
        hoverFillOpacity: 0.8,
        strokeColor: "#66cccc",
        strokeOpacity: 1,
        strokeLinecap: "round",
        strokeWidth: 2,
        strokeDashstyle: "solid",
        hoverStrokeColor: "red",
        hoverStrokeOpacity: 1,
        hoverStrokeWidth: 0.2,
        pointRadius: 6,
        hoverPointRadius: 1,
        hoverPointUnit: "%",
        pointerEvents: "visiblePainted",
        cursor: "inherit",
        fontColor: "#000000",
        labelAlign: "cm",
        labelOutlineColor: "white",
        labelOutlineWidth: 3

    },
    'delete': {
        display: "none"
    }
};    
/* ======================================================================
    OpenLayers/Style.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


/**
 * @requires OpenLayers/BaseTypes/Class.js
 * @requires OpenLayers/Util.js
 * @requires OpenLayers/Feature/Vector.js
 */

/**
 * Class: OpenLayers.Style
 * This class represents a UserStyle obtained
 *     from a SLD, containing styling rules.
 */
OpenLayers.Style = OpenLayers.Class({

    /**
     * Property: id
     * {String} A unique id for this session.
     */
    id: null,
    
    /**
     * APIProperty: name
     * {String}
     */
    name: null,
    
    /**
     * Property: title
     * {String} Title of this style (set if included in SLD)
     */
    title: null,
    
    /**
     * Property: description
     * {String} Description of this style (set if abstract is included in SLD)
     */
    description: null,

    /**
     * APIProperty: layerName
     * {<String>} name of the layer that this style belongs to, usually
     * according to the NamedLayer attribute of an SLD document.
     */
    layerName: null,
    
    /**
     * APIProperty: isDefault
     * {Boolean}
     */
    isDefault: false,
     
    /** 
     * Property: rules 
     * {Array(<OpenLayers.Rule>)}
     */
    rules: null,
    
    /**
     * APIProperty: context
     * {Object} An optional object with properties that symbolizers' property
     * values should be evaluated against. If no context is specified,
     * feature.attributes will be used
     */
    context: null,

    /**
     * Property: defaultStyle
     * {Object} hash of style properties to use as default for merging
     * rule-based style symbolizers onto. If no rules are defined,
     * createSymbolizer will return this style. If <defaultsPerSymbolizer> is set to
     * true, the defaultStyle will only be taken into account if there are
     * rules defined.
     */
    defaultStyle: null,
    
    /**
     * Property: defaultsPerSymbolizer
     * {Boolean} If set to true, the <defaultStyle> will extend the symbolizer
     * of every rule. Properties of the <defaultStyle> will also be used to set
     * missing symbolizer properties if the symbolizer has stroke, fill or
     * graphic set to true. Default is false.
     */
    defaultsPerSymbolizer: false,
    
    /**
     * Property: propertyStyles
     * {Hash of Boolean} cache of style properties that need to be parsed for
     * propertyNames. Property names are keys, values won't be used.
     */
    propertyStyles: null,
    

    /** 
     * Constructor: OpenLayers.Style
     * Creates a UserStyle.
     *
     * Parameters:
     * style        - {Object} Optional hash of style properties that will be
     *                used as default style for this style object. This style
     *                applies if no rules are specified. Symbolizers defined in
     *                rules will extend this default style.
     * options - {Object} An optional object with properties to set on the
     *     style.
     *
     * Valid options:
     * rules - {Array(<OpenLayers.Rule>)} List of rules to be added to the
     *     style.
     * 
     * Returns:
     * {<OpenLayers.Style>}
     */
    initialize: function(style, options) {

        OpenLayers.Util.extend(this, options);
        this.rules = [];
        if(options && options.rules) {
            this.addRules(options.rules);
        }

        // use the default style from OpenLayers.Feature.Vector if no style
        // was given in the constructor
        this.setDefaultStyle(style ||
                             OpenLayers.Feature.Vector.style["default"]);

        this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_");
    },

    /** 
     * APIMethod: destroy
     * nullify references to prevent circular references and memory leaks
     */
    destroy: function() {
        for (var i=0, len=this.rules.length; i<len; i++) {
            this.rules[i].destroy();
            this.rules[i] = null;
        }
        this.rules = null;
        this.defaultStyle = null;
    },
    
    /**
     * Method: createSymbolizer
     * creates a style by applying all feature-dependent rules to the base
     * style.
     * 
     * Parameters:
     * feature - {<OpenLayers.Feature>} feature to evaluate rules for
     * 
     * Returns:
     * {Object} symbolizer hash
     */
    createSymbolizer: function(feature) {
        var style = this.defaultsPerSymbolizer ? {} : this.createLiterals(
            OpenLayers.Util.extend({}, this.defaultStyle), feature);
        
        var rules = this.rules;

        var rule, context;
        var elseRules = [];
        var appliedRules = false;
        for(var i=0, len=rules.length; i<len; i++) {
            rule = rules[i];
            // does the rule apply?
            var applies = rule.evaluate(feature);
            
            if(applies) {
                if(rule instanceof OpenLayers.Rule && rule.elseFilter) {
                    elseRules.push(rule);
                } else {
                    appliedRules = true;
                    this.applySymbolizer(rule, style, feature);
                }
            }
        }
        
        // if no other rules apply, apply the rules with else filters
        if(appliedRules == false && elseRules.length > 0) {
            appliedRules = true;
            for(var i=0, len=elseRules.length; i<len; i++) {
                this.applySymbolizer(elseRules[i], style, feature);
            }
        }

        // don't display if there were rules but none applied
        if(rules.length > 0 && appliedRules == false) {
            style.display = "none";
        }
        
        if (style.label != null && typeof style.label !== "string") {
            style.label = String(style.label);
        }
        
        return style;
    },
    
    /**
     * Method: applySymbolizer
     *
     * Parameters:
     * rule - {<OpenLayers.Rule>}
     * style - {Object}
     * feature - {<OpenLayer.Feature.Vector>}
     *
     * Returns:
     * {Object} A style with new symbolizer applied.
     */
    applySymbolizer: function(rule, style, feature) {
        var symbolizerPrefix = feature.geometry ?
                this.getSymbolizerPrefix(feature.geometry) :
                OpenLayers.Style.SYMBOLIZER_PREFIXES[0];

        var symbolizer = rule.symbolizer[symbolizerPrefix] || rule.symbolizer;
        
        if(this.defaultsPerSymbolizer === true) {
            var defaults = this.defaultStyle;
            OpenLayers.Util.applyDefaults(symbolizer, {
                pointRadius: defaults.pointRadius
            });
            if(symbolizer.stroke === true || symbolizer.graphic === true) {
                OpenLayers.Util.applyDefaults(symbolizer, {
                    strokeWidth: defaults.strokeWidth,
                    strokeColor: defaults.strokeColor,
                    strokeOpacity: defaults.strokeOpacity,
                    strokeDashstyle: defaults.strokeDashstyle,
                    strokeLinecap: defaults.strokeLinecap
                });
            }
            if(symbolizer.fill === true || symbolizer.graphic === true) {
                OpenLayers.Util.applyDefaults(symbolizer, {
                    fillColor: defaults.fillColor,
                    fillOpacity: defaults.fillOpacity
                });
            }
            if(symbolizer.graphic === true) {
                OpenLayers.Util.applyDefaults(symbolizer, {
                    pointRadius: this.defaultStyle.pointRadius,
                    externalGraphic: this.defaultStyle.externalGraphic,
                    graphicName: this.defaultStyle.graphicName,
                    graphicOpacity: this.defaultStyle.graphicOpacity,
                    graphicWidth: this.defaultStyle.graphicWidth,
                    graphicHeight: this.defaultStyle.graphicHeight,
                    graphicXOffset: this.defaultStyle.graphicXOffset,
                    graphicYOffset: this.defaultStyle.graphicYOffset
                });
            }
        }

        // merge the style with the current style
        return this.createLiterals(
                OpenLayers.Util.extend(style, symbolizer), feature);
    },
    
    /**
     * Method: createLiterals
     * creates literals for all style properties that have an entry in
     * <this.propertyStyles>.
     * 
     * Parameters:
     * style   - {Object} style to create literals for. Will be modified
     *           inline.
     * feature - {Object}
     * 
     * Returns:
     * {Object} the modified style
     */
    createLiterals: function(style, feature) {
        var context = OpenLayers.Util.extend({}, feature.attributes || feature.data);
        OpenLayers.Util.extend(context, this.context);
        
        for (var i in this.propertyStyles) {
            style[i] = OpenLayers.Style.createLiteral(style[i], context, feature, i);
        }
        return style;
    },
    
    /**
     * Method: findPropertyStyles
     * Looks into all rules for this style and the defaultStyle to collect
     * all the style hash property names containing ${...} strings that have
     * to be replaced using the createLiteral method before returning them.
     * 
     * Returns:
     * {Object} hash of property names that need createLiteral parsing. The
     * name of the property is the key, and the value is true;
     */
    findPropertyStyles: function() {
        var propertyStyles = {};

        // check the default style
        var style = this.defaultStyle;
        this.addPropertyStyles(propertyStyles, style);

        // walk through all rules to check for properties in their symbolizer
        var rules = this.rules;
        var symbolizer, value;
        for (var i=0, len=rules.length; i<len; i++) {
            symbolizer = rules[i].symbolizer;
            for (var key in symbolizer) {
                value = symbolizer[key];
                if (typeof value == "object") {
                    // symbolizer key is "Point", "Line" or "Polygon"
                    this.addPropertyStyles(propertyStyles, value);
                } else {
                    // symbolizer is a hash of style properties
                    this.addPropertyStyles(propertyStyles, symbolizer);
                    break;
                }
            }
        }
        return propertyStyles;
    },
    
    /**
     * Method: addPropertyStyles
     * 
     * Parameters:
     * propertyStyles - {Object} hash to add new property styles to. Will be
     *                  modified inline
     * symbolizer     - {Object} search this symbolizer for property styles
     * 
     * Returns:
     * {Object} propertyStyles hash
     */
    addPropertyStyles: function(propertyStyles, symbolizer) {
        var property;
        for (var key in symbolizer) {
            property = symbolizer[key];
            if (typeof property == "string" &&
                    property.match(/\$\{\w+\}/)) {
                propertyStyles[key] = true;
            }
        }
        return propertyStyles;
    },
    
    /**
     * APIMethod: addRules
     * Adds rules to this style.
     * 
     * Parameters:
     * rules - {Array(<OpenLayers.Rule>)}
     */
    addRules: function(rules) {
        Array.prototype.push.apply(this.rules, rules);
        this.propertyStyles = this.findPropertyStyles();
    },
    
    /**
     * APIMethod: setDefaultStyle
     * Sets the default style for this style object.
     * 
     * Parameters:
     * style - {Object} Hash of style properties
     */
    setDefaultStyle: function(style) {
        this.defaultStyle = style; 
        this.propertyStyles = this.findPropertyStyles();
    },
        
    /**
     * Method: getSymbolizerPrefix
     * Returns the correct symbolizer prefix according to the
     * geometry type of the passed geometry
     * 
     * Parameters:
     * geometry - {<OpenLayers.Geometry>}
     * 
     * Returns:
     * {String} key of the according symbolizer
     */
    getSymbolizerPrefix: function(geometry) {
        var prefixes = OpenLayers.Style.SYMBOLIZER_PREFIXES;
        for (var i=0, len=prefixes.length; i<len; i++) {
            if (geometry.CLASS_NAME.indexOf(prefixes[i]) != -1) {
                return prefixes[i];
            }
        }
    },
    
    /**
     * APIMethod: clone
     * Clones this style.
     * 
     * Returns:
     * {<OpenLayers.Style>} Clone of this style.
     */
    clone: function() {
        var options = OpenLayers.Util.extend({}, this);
        // clone rules
        if(this.rules) {
            options.rules = [];
            for(var i=0, len=this.rules.length; i<len; ++i) {
                options.rules.push(this.rules[i].clone());
            }
        }
        // clone context
        options.context = this.context && OpenLayers.Util.extend({}, this.context);
        //clone default style
        var defaultStyle = OpenLayers.Util.extend({}, this.defaultStyle);
        return new OpenLayers.Style(defaultStyle, options);
    },
    
    CLASS_NAME: "OpenLayers.Style"
});


/**
 * Function: createLiteral
 * converts a style value holding a combination of PropertyName and Literal
 * into a Literal, taking the property values from the passed features.
 * 
 * Parameters:
 * value - {String} value to parse. If this string contains a construct like
 *         "foo ${bar}", then "foo " will be taken as literal, and "${bar}"
 *         will be replaced by the value of the "bar" attribute of the passed
 *         feature.
 * context - {Object} context to take attribute values from
 * feature - {<OpenLayers.Feature.Vector>} optional feature to pass to
 *           <OpenLayers.String.format> for evaluating functions in the
 *           context.
 * property - {String} optional, name of the property for which the literal is
 *            being created for evaluating functions in the context.
 * 
 * Returns:
 * {String} the parsed value. In the example of the value parameter above, the
 * result would be "foo valueOfBar", assuming that the passed feature has an
 * attribute named "bar" with the value "valueOfBar".
 */
OpenLayers.Style.createLiteral = function(value, context, feature, property) {
    if (typeof value == "string" && value.indexOf("${") != -1) {
        value = OpenLayers.String.format(value, context, [feature, property]);
        value = (isNaN(value) || !value) ? value : parseFloat(value);
    }
    return value;
};
    
/**
 * Constant: OpenLayers.Style.SYMBOLIZER_PREFIXES
 * {Array} prefixes of the sld symbolizers. These are the
 * same as the main geometry types
 */
OpenLayers.Style.SYMBOLIZER_PREFIXES = ['Point', 'Line', 'Polygon', 'Text',
    'Raster'];
/* ======================================================================
    OpenLayers/Renderer.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/BaseTypes/Class.js
 */

/**
 * Class: OpenLayers.Renderer 
 * This is the base class for all renderers.
 *
 * This is based on a merger code written by Paul Spencer and Bertil Chapuis.
 * It is largely composed of virtual functions that are to be implemented
 * in technology-specific subclasses, but there is some generic code too.
 * 
 * The functions that *are* implemented here merely deal with the maintenance
 *  of the size and extent variables, as well as the cached 'resolution' 
 *  value. 
 * 
 * A note to the user that all subclasses should use getResolution() instead
 *  of directly accessing this.resolution in order to correctly use the 
 *  cacheing system.
 *
 */
OpenLayers.Renderer = OpenLayers.Class({

    /** 
     * Property: container
     * {DOMElement} 
     */
    container: null,
    
    /**
     * Property: root
     * {DOMElement}
     */
    root: null,

    /** 
     * Property: extent
     * {<OpenLayers.Bounds>}
     */
    extent: null,

    /**
     * Property: locked
     * {Boolean} If the renderer is currently in a state where many things
     *     are changing, the 'locked' property is set to true. This means 
     *     that renderers can expect at least one more drawFeature event to be
     *     called with the 'locked' property set to 'true': In some renderers,
     *     this might make sense to use as a 'only update local information'
     *     flag. 
     */  
    locked: false,
    
    /** 
     * Property: size
     * {<OpenLayers.Size>} 
     */
    size: null,
    
    /**
     * Property: resolution
     * {Float} cache of current map resolution
     */
    resolution: null,
    
    /**
     * Property: map  
     * {<OpenLayers.Map>} Reference to the map -- this is set in Vector's setMap()
     */
    map: null,
    
    /**
     * Property: featureDx
     * {Number} Feature offset in x direction. Will be calculated for and
     * applied to the current feature while rendering (see
     * <calculateFeatureDx>).
     */
    featureDx: 0,
    
    /**
     * Constructor: OpenLayers.Renderer 
     *
     * Parameters:
     * containerID - {<String>} 
     * options - {Object} options for this renderer. See sublcasses for
     *     supported options.
     */
    initialize: function(containerID, options) {
        this.container = OpenLayers.Util.getElement(containerID);
        OpenLayers.Util.extend(this, options);
    },
    
    /**
     * APIMethod: destroy
     */
    destroy: function() {
        this.container = null;
        this.extent = null;
        this.size =  null;
        this.resolution = null;
        this.map = null;
    },

    /**
     * APIMethod: supported
     * This should be overridden by specific subclasses
     * 
     * Returns:
     * {Boolean} Whether or not the browser supports the renderer class
     */
    supported: function() {
        return false;
    },    
    
    /**
     * Method: setExtent
     * Set the visible part of the layer.
     *
     * Resolution has probably changed, so we nullify the resolution 
     * cache (this.resolution) -- this way it will be re-computed when 
     * next it is needed.
     * We nullify the resolution cache (this.resolution) if resolutionChanged
     * is set to true - this way it will be re-computed on the next
     * getResolution() request.
     *
     * Parameters:
     * extent - {<OpenLayers.Bounds>}
     * resolutionChanged - {Boolean}
     *
     * Returns:
     * {Boolean} true to notify the layer that the new extent does not exceed
     *     the coordinate range, and the features will not need to be redrawn.
     *     False otherwise.
     */
    setExtent: function(extent, resolutionChanged) {
        this.extent = extent.clone();
        if (this.map.baseLayer && this.map.baseLayer.wrapDateLine) {
            var ratio = extent.getWidth() / this.map.getExtent().getWidth(),
                extent = extent.scale(1 / ratio);
            this.extent = extent.wrapDateLine(this.map.getMaxExtent()).scale(ratio);
        }
        if (resolutionChanged) {
            this.resolution = null;
        }
        return true;
    },
    
    /**
     * Method: setSize
     * Sets the size of the drawing surface.
     * 
     * Resolution has probably changed, so we nullify the resolution 
     * cache (this.resolution) -- this way it will be re-computed when 
     * next it is needed.
     *
     * Parameters:
     * size - {<OpenLayers.Size>} 
     */
    setSize: function(size) {
        this.size = size.clone();
        this.resolution = null;
    },
    
    /** 
     * Method: getResolution
     * Uses cached copy of resolution if available to minimize computing
     * 
     * Returns:
     * {Float} The current map's resolution
     */
    getResolution: function() {
        this.resolution = this.resolution || this.map.getResolution();
        return this.resolution;
    },
    
    /**
     * Method: drawFeature
     * Draw the feature.  The optional style argument can be used
     * to override the feature's own style.  This method should only
     * be called from layer.drawFeature().
     *
     * Parameters:
     * feature - {<OpenLayers.Feature.Vector>} 
     * style - {<Object>}
     * 
     * Returns:
     * {Boolean} true if the feature has been drawn completely, false if not,
     *     undefined if the feature had no geometry
     */
    drawFeature: function(feature, style) {
        if(style == null) {
            style = feature.style;
        }
        if (feature.geometry) {
            var bounds = feature.geometry.getBounds();
            if(bounds) {
                var worldBounds;
                if (this.map.baseLayer && this.map.baseLayer.wrapDateLine) {
                    worldBounds = this.map.getMaxExtent();
                }
                if (!bounds.intersectsBounds(this.extent, {worldBounds: worldBounds})) {
                    style = {display: "none"};
                } else {
                    this.calculateFeatureDx(bounds, worldBounds);
                }
                var rendered = this.drawGeometry(feature.geometry, style, feature.id);
                if(style.display != "none" && style.label && rendered !== false) {

                    var location = feature.geometry.getCentroid(); 
                    if(style.labelXOffset || style.labelYOffset) {
                        var xOffset = isNaN(style.labelXOffset) ? 0 : style.labelXOffset;
                        var yOffset = isNaN(style.labelYOffset) ? 0 : style.labelYOffset;
                        var res = this.getResolution();
                        location.move(xOffset*res, yOffset*res);
                    }
                    this.drawText(feature.id, style, location);
                } else {
                    this.removeText(feature.id);
                }
                return rendered;
            }
        }
    },

    /**
     * Method: calculateFeatureDx
     * {Number} Calculates the feature offset in x direction. Looking at the
     * center of the feature bounds and the renderer extent, we calculate how
     * many world widths the two are away from each other. This distance is
     * used to shift the feature as close as possible to the center of the
     * current enderer extent, which ensures that the feature is visible in the
     * current viewport.
     *
     * Parameters:
     * bounds - {<OpenLayers.Bounds>} Bounds of the feature
     * worldBounds - {<OpenLayers.Bounds>} Bounds of the world
     */
    calculateFeatureDx: function(bounds, worldBounds) {
        this.featureDx = 0;
        if (worldBounds) {
            var worldWidth = worldBounds.getWidth(),
                rendererCenterX = (this.extent.left + this.extent.right) / 2,
                featureCenterX = (bounds.left + bounds.right) / 2,
                worldsAway = Math.round((featureCenterX - rendererCenterX) / worldWidth);
            this.featureDx = worldsAway * worldWidth;
        }
    },

    /** 
     * Method: drawGeometry
     * 
     * Draw a geometry.  This should only be called from the renderer itself.
     * Use layer.drawFeature() from outside the renderer.
     * virtual function
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} 
     * style - {Object} 
     * featureId - {<String>} 
     */
    drawGeometry: function(geometry, style, featureId) {},
        
    /**
     * Method: drawText
     * Function for drawing text labels.
     * This method is only called by the renderer itself.
     * 
     * Parameters: 
     * featureId - {String}
     * style -
     * location - {<OpenLayers.Geometry.Point>}
     */
    drawText: function(featureId, style, location) {},

    /**
     * Method: removeText
     * Function for removing text labels.
     * This method is only called by the renderer itself.
     * 
     * Parameters: 
     * featureId - {String}
     */
    removeText: function(featureId) {},
    
    /**
     * Method: clear
     * Clear all vectors from the renderer.
     * virtual function.
     */    
    clear: function() {},

    /**
     * Method: getFeatureIdFromEvent
     * Returns a feature id from an event on the renderer.  
     * How this happens is specific to the renderer.  This should be
     * called from layer.getFeatureFromEvent().
     * Virtual function.
     * 
     * Parameters:
     * evt - {<OpenLayers.Event>} 
     *
     * Returns:
     * {String} A feature id or undefined.
     */
    getFeatureIdFromEvent: function(evt) {},
    
    /**
     * Method: eraseFeatures 
     * This is called by the layer to erase features
     * 
     * Parameters:
     * features - {Array(<OpenLayers.Feature.Vector>)} 
     */
    eraseFeatures: function(features) {
        if(!(OpenLayers.Util.isArray(features))) {
            features = [features];
        }
        for(var i=0, len=features.length; i<len; ++i) {
            var feature = features[i];
            this.eraseGeometry(feature.geometry, feature.id);
            this.removeText(feature.id);
        }
    },
    
    /**
     * Method: eraseGeometry
     * Remove a geometry from the renderer (by id).
     * virtual function.
     * 
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} 
     * featureId - {String}
     */
    eraseGeometry: function(geometry, featureId) {},
    
    /**
     * Method: moveRoot
     * moves this renderer's root to a (different) renderer.
     * To be implemented by subclasses that require a common renderer root for
     * feature selection.
     * 
     * Parameters:
     * renderer - {<OpenLayers.Renderer>} target renderer for the moved root
     */
    moveRoot: function(renderer) {},

    /**
     * Method: getRenderLayerId
     * Gets the layer that this renderer's output appears on. If moveRoot was
     * used, this will be different from the id of the layer containing the
     * features rendered by this renderer.
     * 
     * Returns:
     * {String} the id of the output layer.
     */
    getRenderLayerId: function() {
        return this.container.id;
    },
    
    /**
     * Method: applyDefaultSymbolizer
     * 
     * Parameters:
     * symbolizer - {Object}
     * 
     * Returns:
     * {Object}
     */
    applyDefaultSymbolizer: function(symbolizer) {
        var result = OpenLayers.Util.extend({},
            OpenLayers.Renderer.defaultSymbolizer);
        if(symbolizer.stroke === false) {
            delete result.strokeWidth;
            delete result.strokeColor;
        }
        if(symbolizer.fill === false) {
            delete result.fillColor;
        }
        OpenLayers.Util.extend(result, symbolizer);
        return result;
    },

    CLASS_NAME: "OpenLayers.Renderer"
});

/**
 * Constant: OpenLayers.Renderer.defaultSymbolizer
 * {Object} Properties from this symbolizer will be applied to symbolizers
 *     with missing properties. This can also be used to set a global
 *     symbolizer default in OpenLayers. To be SLD 1.x compliant, add the
 *     following code before rendering any vector features:
 * (code)
 * OpenLayers.Renderer.defaultSymbolizer = {
 *     fillColor: "#808080",
 *     fillOpacity: 1,
 *     strokeColor: "#000000",
 *     strokeOpacity: 1,
 *     strokeWidth: 1,
 *     pointRadius: 3,
 *     graphicName: "square"
 * };
 * (end)
 */
OpenLayers.Renderer.defaultSymbolizer = {
    fillColor: "#000000",
    strokeColor: "#000000",
    strokeWidth: 2,
    fillOpacity: 1,
    strokeOpacity: 1,
    pointRadius: 0,
    labelAlign: 'cm'
};
    


/**
 * Constant: OpenLayers.Renderer.symbol
 * Coordinate arrays for well known (named) symbols.
 */
OpenLayers.Renderer.symbol = {
    "star": [350,75, 379,161, 469,161, 397,215, 423,301, 350,250, 277,301,
            303,215, 231,161, 321,161, 350,75],
    "cross": [4,0, 6,0, 6,4, 10,4, 10,6, 6,6, 6,10, 4,10, 4,6, 0,6, 0,4, 4,4,
            4,0],
    "x": [0,0, 25,0, 50,35, 75,0, 100,0, 65,50, 100,100, 75,100, 50,65, 25,100, 0,100, 35,50, 0,0],
    "square": [0,0, 0,1, 1,1, 1,0, 0,0],
    "triangle": [0,10, 10,10, 5,0, 0,10]
};
/* ======================================================================
    OpenLayers/Renderer/Elements.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Renderer.js
 */

/**
 * Class: OpenLayers.ElementsIndexer
 * This class takes care of figuring out which order elements should be
 *     placed in the DOM based on given indexing methods. 
 */
OpenLayers.ElementsIndexer = OpenLayers.Class({
   
    /**
     * Property: maxZIndex
     * {Integer} This is the largest-most z-index value for a node
     *     contained within the indexer.
     */
    maxZIndex: null,
    
    /**
     * Property: order
     * {Array<String>} This is an array of node id's stored in the
     *     order that they should show up on screen. Id's higher up in the
     *     array (higher array index) represent nodes with higher z-indeces.
     */
    order: null, 
    
    /**
     * Property: indices
     * {Object} This is a hash that maps node ids to their z-index value
     *     stored in the indexer. This is done to make finding a nodes z-index 
     *     value O(1).
     */
    indices: null,
    
    /**
     * Property: compare
     * {Function} This is the function used to determine placement of
     *     of a new node within the indexer. If null, this defaults to to
     *     the Z_ORDER_DRAWING_ORDER comparison method.
     */
    compare: null,
    
    /**
     * APIMethod: initialize
     * Create a new indexer with 
     * 
     * Parameters:
     * yOrdering - {Boolean} Whether to use y-ordering.
     */
    initialize: function(yOrdering) {

        this.compare = yOrdering ? 
            OpenLayers.ElementsIndexer.IndexingMethods.Z_ORDER_Y_ORDER :
            OpenLayers.ElementsIndexer.IndexingMethods.Z_ORDER_DRAWING_ORDER;

        this.clear();
    },
    
    /**
     * APIMethod: insert
     * Insert a new node into the indexer. In order to find the correct 
     *     positioning for the node to be inserted, this method uses a binary 
     *     search. This makes inserting O(log(n)). 
     * 
     * Parameters:
     * newNode - {DOMElement} The new node to be inserted.
     * 
     * Returns
     * {DOMElement} the node before which we should insert our newNode, or
     *     null if newNode can just be appended.
     */
    insert: function(newNode) {
        // If the node is known to the indexer, remove it so we can
        // recalculate where it should go.
        if (this.exists(newNode)) {
            this.remove(newNode);
        }
        
        var nodeId = newNode.id;
        
        this.determineZIndex(newNode);       

        var leftIndex = -1;
        var rightIndex = this.order.length;
        var middle;

        while (rightIndex - leftIndex > 1) {
            middle = parseInt((leftIndex + rightIndex) / 2);
            
            var placement = this.compare(this, newNode,
                OpenLayers.Util.getElement(this.order[middle]));
            
            if (placement > 0) {
                leftIndex = middle;
            } else {
                rightIndex = middle;
            } 
        }
        
        this.order.splice(rightIndex, 0, nodeId);
        this.indices[nodeId] = this.getZIndex(newNode);
        
        // If the new node should be before another in the index
        // order, return the node before which we have to insert the new one;
        // else, return null to indicate that the new node can be appended.
        return this.getNextElement(rightIndex);
    },
    
    /**
     * APIMethod: remove
     * 
     * Parameters:
     * node - {DOMElement} The node to be removed.
     */
    remove: function(node) {
        var nodeId = node.id;
        var arrayIndex = OpenLayers.Util.indexOf(this.order, nodeId);
        if (arrayIndex >= 0) {
            // Remove it from the order array, as well as deleting the node
            // from the indeces hash.
            this.order.splice(arrayIndex, 1);
            delete this.indices[nodeId];
            
            // Reset the maxium z-index based on the last item in the 
            // order array.
            if (this.order.length > 0) {
                var lastId = this.order[this.order.length - 1];
                this.maxZIndex = this.indices[lastId];
            } else {
                this.maxZIndex = 0;
            }
        }
    },
    
    /**
     * APIMethod: clear
     */
    clear: function() {
        this.order = [];
        this.indices = {};
        this.maxZIndex = 0;
    },
    
    /**
     * APIMethod: exists
     *
     * Parameters:
     * node - {DOMElement} The node to test for existence.
     *
     * Returns:
     * {Boolean} Whether or not the node exists in the indexer?
     */
    exists: function(node) {
        return (this.indices[node.id] != null);
    },

    /**
     * APIMethod: getZIndex
     * Get the z-index value for the current node from the node data itself.
     * 
     * Parameters:
     * node - {DOMElement} The node whose z-index to get.
     * 
     * Returns:
     * {Integer} The z-index value for the specified node (from the node 
     *     data itself).
     */
    getZIndex: function(node) {
        return node._style.graphicZIndex;  
    },
    
    /**
     * Method: determineZIndex
     * Determine the z-index for the current node if there isn't one, 
     *     and set the maximum value if we've found a new maximum.
     * 
     * Parameters:
     * node - {DOMElement} 
     */
    determineZIndex: function(node) {
        var zIndex = node._style.graphicZIndex;
        
        // Everything must have a zIndex. If none is specified,
        // this means the user *must* (hint: assumption) want this
        // node to succomb to drawing order. To enforce drawing order
        // over all indexing methods, we'll create a new z-index that's
        // greater than any currently in the indexer.
        if (zIndex == null) {
            zIndex = this.maxZIndex;
            node._style.graphicZIndex = zIndex; 
        } else if (zIndex > this.maxZIndex) {
            this.maxZIndex = zIndex;
        }
    },

    /**
     * APIMethod: getNextElement
     * Get the next element in the order stack.
     * 
     * Parameters:
     * index - {Integer} The index of the current node in this.order.
     * 
     * Returns:
     * {DOMElement} the node following the index passed in, or
     *     null.
     */
    getNextElement: function(index) {
        var nextIndex = index + 1;
        if (nextIndex < this.order.length) {
            var nextElement = OpenLayers.Util.getElement(this.order[nextIndex]);
            if (nextElement == undefined) {
                nextElement = this.getNextElement(nextIndex);
            }
            return nextElement;
        } else {
            return null;
        } 
    },
    
    CLASS_NAME: "OpenLayers.ElementsIndexer"
});

/**
 * Namespace: OpenLayers.ElementsIndexer.IndexingMethods
 * These are the compare methods for figuring out where a new node should be 
 *     placed within the indexer. These methods are very similar to general 
 *     sorting methods in that they return -1, 0, and 1 to specify the 
 *     direction in which new nodes fall in the ordering.
 */
OpenLayers.ElementsIndexer.IndexingMethods = {
    
    /**
     * Method: Z_ORDER
     * This compare method is used by other comparison methods.
     *     It can be used individually for ordering, but is not recommended,
     *     because it doesn't subscribe to drawing order.
     * 
     * Parameters:
     * indexer - {<OpenLayers.ElementsIndexer>}
     * newNode - {DOMElement}
     * nextNode - {DOMElement}
     * 
     * Returns:
     * {Integer}
     */
    Z_ORDER: function(indexer, newNode, nextNode) {
        var newZIndex = indexer.getZIndex(newNode);

        var returnVal = 0;
        if (nextNode) {
            var nextZIndex = indexer.getZIndex(nextNode);
            returnVal = newZIndex - nextZIndex; 
        }
        
        return returnVal;
    },

    /**
     * APIMethod: Z_ORDER_DRAWING_ORDER
     * This method orders nodes by their z-index, but does so in a way
     *     that, if there are other nodes with the same z-index, the newest 
     *     drawn will be the front most within that z-index. This is the 
     *     default indexing method.
     * 
     * Parameters:
     * indexer - {<OpenLayers.ElementsIndexer>}
     * newNode - {DOMElement}
     * nextNode - {DOMElement}
     * 
     * Returns:
     * {Integer}
     */
    Z_ORDER_DRAWING_ORDER: function(indexer, newNode, nextNode) {
        var returnVal = OpenLayers.ElementsIndexer.IndexingMethods.Z_ORDER(
            indexer, 
            newNode, 
            nextNode
        );
        
        // Make Z_ORDER subscribe to drawing order by pushing it above
        // all of the other nodes with the same z-index.
        if (nextNode && returnVal == 0) {
            returnVal = 1;
        }
        
        return returnVal;
    },

    /**
     * APIMethod: Z_ORDER_Y_ORDER
     * This one should really be called Z_ORDER_Y_ORDER_DRAWING_ORDER, as it
     *     best describes which ordering methods have precedence (though, the 
     *     name would be too long). This method orders nodes by their z-index, 
     *     but does so in a way that, if there are other nodes with the same 
     *     z-index, the nodes with the lower y position will be "closer" than 
     *     those with a higher y position. If two nodes have the exact same y 
     *     position, however, then this method will revert to using drawing  
     *     order to decide placement.
     * 
     * Parameters:
     * indexer - {<OpenLayers.ElementsIndexer>}
     * newNode - {DOMElement}
     * nextNode - {DOMElement}
     * 
     * Returns:
     * {Integer}
     */
    Z_ORDER_Y_ORDER: function(indexer, newNode, nextNode) {
        var returnVal = OpenLayers.ElementsIndexer.IndexingMethods.Z_ORDER(
            indexer, 
            newNode, 
            nextNode
        );
        
        if (nextNode && returnVal === 0) {            
            var result = nextNode._boundsBottom - newNode._boundsBottom;
            returnVal = (result === 0) ? 1 : result;
        }
        
        return returnVal;       
    }
};

/**
 * Class: OpenLayers.Renderer.Elements
 * This is another virtual class in that it should never be instantiated by 
 *  itself as a Renderer. It exists because there is *tons* of shared 
 *  functionality between different vector libraries which use nodes/elements
 *  as a base for rendering vectors. 
 * 
 * The highlevel bits of code that are implemented here are the adding and 
 *  removing of geometries, which is essentially the same for any 
 *  element-based renderer. The details of creating each node and drawing the
 *  paths are of course different, but the machinery is the same. 
 * 
 * Inherits:
 *  - <OpenLayers.Renderer>
 */
OpenLayers.Renderer.Elements = OpenLayers.Class(OpenLayers.Renderer, {

    /**
     * Property: rendererRoot
     * {DOMElement}
     */
    rendererRoot: null,
    
    /**
     * Property: root
     * {DOMElement}
     */
    root: null,
    
    /**
     * Property: vectorRoot
     * {DOMElement}
     */
    vectorRoot: null,

    /**
     * Property: textRoot
     * {DOMElement}
     */
    textRoot: null,

    /**
     * Property: xmlns
     * {String}
     */    
    xmlns: null,
    
    /**
     * Property: xOffset
     * {Number} Offset to apply to the renderer viewport translation in x
     * direction. If the renderer extent's center is on the right of the
     * dateline (i.e. exceeds the world bounds), we shift the viewport to the
     * left by one world width. This avoids that features disappear from the
     * map viewport. Because our dateline handling logic in other places
     * ensures that extents crossing the dateline always have a center
     * exceeding the world bounds on the left, we need this offset to make sure
     * that the same is true for the renderer extent in pixel space as well.
     */
    xOffset: 0,
    
    /**
     * Property: rightOfDateLine
     * {Boolean} Keeps track of the location of the map extent relative to the
     * date line. The <setExtent> method compares this value (which is the one
     * from the previous <setExtent> call) with the current position of the map
     * extent relative to the date line and updates the xOffset when the extent
     * has moved from one side of the date line to the other.
     */
    
    /**
     * Property: Indexer
     * {<OpenLayers.ElementIndexer>} An instance of OpenLayers.ElementsIndexer 
     *     created upon initialization if the zIndexing or yOrdering options
     *     passed to this renderer's constructor are set to true.
     */
    indexer: null, 
    
    /**
     * Constant: BACKGROUND_ID_SUFFIX
     * {String}
     */
    BACKGROUND_ID_SUFFIX: "_background",
    
    /**
     * Constant: LABEL_ID_SUFFIX
     * {String}
     */
    LABEL_ID_SUFFIX: "_label",
    
    /**
     * Constant: LABEL_OUTLINE_SUFFIX
     * {String}
     */
    LABEL_OUTLINE_SUFFIX: "_outline",

    /**
     * Constructor: OpenLayers.Renderer.Elements
     * 
     * Parameters:
     * containerID - {String}
     * options - {Object} options for this renderer. 
     *
     * Supported options are:
     *     yOrdering - {Boolean} Whether to use y-ordering
     *     zIndexing - {Boolean} Whether to use z-indexing. Will be ignored
     *         if yOrdering is set to true.
     */
    initialize: function(containerID, options) {
        OpenLayers.Renderer.prototype.initialize.apply(this, arguments);

        this.rendererRoot = this.createRenderRoot();
        this.root = this.createRoot("_root");
        this.vectorRoot = this.createRoot("_vroot");
        this.textRoot = this.createRoot("_troot");
        
        this.root.appendChild(this.vectorRoot);
        this.root.appendChild(this.textRoot);
        
        this.rendererRoot.appendChild(this.root);
        this.container.appendChild(this.rendererRoot);
        
        if(options && (options.zIndexing || options.yOrdering)) {
            this.indexer = new OpenLayers.ElementsIndexer(options.yOrdering);
        }
    },
    
    /**
     * Method: destroy
     */
    destroy: function() {

        this.clear(); 

        this.rendererRoot = null;
        this.root = null;
        this.xmlns = null;

        OpenLayers.Renderer.prototype.destroy.apply(this, arguments);
    },
    
    /**
     * Method: clear
     * Remove all the elements from the root
     */    
    clear: function() {
        var child;
        var root = this.vectorRoot;
        if (root) {
            while (child = root.firstChild) {
                root.removeChild(child);
            }
        }
        root = this.textRoot;
        if (root) {
            while (child = root.firstChild) {
                root.removeChild(child);
            }
        }
        if (this.indexer) {
            this.indexer.clear();
        }
    },
    
    /**
     * Method: setExtent
     * Set the visible part of the layer.
     *
     * Parameters:
     * extent - {<OpenLayers.Bounds>}
     * resolutionChanged - {Boolean}
     *
     * Returns:
     * {Boolean} true to notify the layer that the new extent does not exceed
     *     the coordinate range, and the features will not need to be redrawn.
     *     False otherwise.
     */
    setExtent: function(extent, resolutionChanged) {
        var coordSysUnchanged = OpenLayers.Renderer.prototype.setExtent.apply(this, arguments);
        var resolution = this.getResolution();
        if (this.map.baseLayer && this.map.baseLayer.wrapDateLine) {
            var rightOfDateLine,
                ratio = extent.getWidth() / this.map.getExtent().getWidth(),
                extent = extent.scale(1 / ratio),
                world = this.map.getMaxExtent();
            if (world.right > extent.left && world.right < extent.right) {
                rightOfDateLine = true;
            } else if (world.left > extent.left && world.left < extent.right) {
                rightOfDateLine = false;
            }
            if (rightOfDateLine !== this.rightOfDateLine || resolutionChanged) {
                coordSysUnchanged = false;
                this.xOffset = rightOfDateLine === true ?
                    world.getWidth() / resolution : 0;
            }
            this.rightOfDateLine = rightOfDateLine;
        }
        return coordSysUnchanged;
    },

    /** 
     * Method: getNodeType
     * This function is in charge of asking the specific renderer which type
     *     of node to create for the given geometry and style. All geometries
     *     in an Elements-based renderer consist of one node and some
     *     attributes. We have the nodeFactory() function which creates a node
     *     for us, but it takes a 'type' as input, and that is precisely what
     *     this function tells us.  
     *  
     * Parameters:
     * geometry - {<OpenLayers.Geometry>}
     * style - {Object}
     * 
     * Returns:
     * {String} The corresponding node type for the specified geometry
     */
    getNodeType: function(geometry, style) { },

    /** 
     * Method: drawGeometry 
     * Draw the geometry, creating new nodes, setting paths, setting style,
     *     setting featureId on the node.  This method should only be called
     *     by the renderer itself.
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>}
     * style - {Object}
     * featureId - {String}
     * 
     * Returns:
     * {Boolean} true if the geometry has been drawn completely; null if
     *     incomplete; false otherwise
     */
    drawGeometry: function(geometry, style, featureId) {
        var className = geometry.CLASS_NAME;
        var rendered = true;
        if ((className == "OpenLayers.Geometry.Collection") ||
            (className == "OpenLayers.Geometry.MultiPoint") ||
            (className == "OpenLayers.Geometry.MultiLineString") ||
            (className == "OpenLayers.Geometry.MultiPolygon")) {
            for (var i = 0, len=geometry.components.length; i<len; i++) {
                rendered = this.drawGeometry(
                    geometry.components[i], style, featureId) && rendered;
            }
            return rendered;
        } else if (className == "OpenLayers.Geometry.ProgressiveLineString") {
            var components = geometry.updateGeometries(this.extent,
                this.map.getZoomForResolution(this.resolution));
            // remove unused nodes
            for (var i = 0, len=components.remove.length; i<len; i++) {
              var node = document.getElementById(components.remove[i].id);
              if (node) {
                  if (node._style.backgroundGraphic) {
                      removeBackground = true;
                  }
                  node.parentNode.removeChild(node);
              }
            }
            // draw new nodes
            for (var i = 0, len=components.add.length; i<len; i++) {
                rendered = this.drawGeometry(
                    components.add[i], style, featureId) && rendered;
            }
            return rendered;
        }

        rendered = false;
        var removeBackground = false;
        if (style.display != "none") {
            if (style.backgroundGraphic) {
                this.redrawBackgroundNode(geometry.id, geometry, style,
                    featureId);
            } else {
                removeBackground = true;
            }
            rendered = this.redrawNode(geometry.id, geometry, style,
                featureId);
        }
        if (rendered == false) {
            var node = document.getElementById(geometry.id);
            if (node) {
                if (node._style.backgroundGraphic) {
                    removeBackground = true;
                }
                node.parentNode.removeChild(node);
            }
        }
        if (removeBackground) {
            var node = document.getElementById(
                geometry.id + this.BACKGROUND_ID_SUFFIX);
            if (node) {
                node.parentNode.removeChild(node);
            }
        }
        return rendered;
    },
    
    /**
     * Method: redrawNode
     * 
     * Parameters:
     * id - {String}
     * geometry - {<OpenLayers.Geometry>}
     * style - {Object}
     * featureId - {String}
     * 
     * Returns:
     * {Boolean} true if the complete geometry could be drawn, null if parts of
     *     the geometry could not be drawn, false otherwise
     */
    redrawNode: function(id, geometry, style, featureId) {
        style = this.applyDefaultSymbolizer(style);
        // Get the node if it's already on the map.
        var node = this.nodeFactory(id, this.getNodeType(geometry, style));
        
        // Set the data for the node, then draw it.
        node._featureId = featureId;
        node._boundsBottom = geometry.getBounds().bottom;
        node._geometryClass = geometry.CLASS_NAME;
        node._style = style;

        var drawResult = this.drawGeometryNode(node, geometry, style);
        if(drawResult === false) {
            return false;
        }
         
        node = drawResult.node;
        
        // Insert the node into the indexer so it can show us where to
        // place it. Note that this operation is O(log(n)). If there's a
        // performance problem (when dragging, for instance) this is
        // likely where it would be.
        if (this.indexer) {
            var insert = this.indexer.insert(node);
            if (insert) {
                this.vectorRoot.insertBefore(node, insert);
            } else {
                this.vectorRoot.appendChild(node);
            }
        } else {
            // if there's no indexer, simply append the node to root,
            // but only if the node is a new one
            if (node.parentNode !== this.vectorRoot){ 
                this.vectorRoot.appendChild(node);
            }
        }
        
        this.postDraw(node);
        
        return drawResult.complete;
    },
    
    /**
     * Method: redrawBackgroundNode
     * Redraws the node using special 'background' style properties. Basically
     *     just calls redrawNode(), but instead of directly using the 
     *     'externalGraphic', 'graphicXOffset', 'graphicYOffset', and 
     *     'graphicZIndex' properties directly from the specified 'style' 
     *     parameter, we create a new style object and set those properties 
     *     from the corresponding 'background'-prefixed properties from 
     *     specified 'style' parameter.
     * 
     * Parameters:
     * id - {String}
     * geometry - {<OpenLayers.Geometry>}
     * style - {Object}
     * featureId - {String}
     * 
     * Returns:
     * {Boolean} true if the complete geometry could be drawn, null if parts of
     *     the geometry could not be drawn, false otherwise
     */
    redrawBackgroundNode: function(id, geometry, style, featureId) {
        var backgroundStyle = OpenLayers.Util.extend({}, style);
        
        // Set regular style attributes to apply to the background styles.
        backgroundStyle.externalGraphic = backgroundStyle.backgroundGraphic;
        backgroundStyle.graphicXOffset = backgroundStyle.backgroundXOffset;
        backgroundStyle.graphicYOffset = backgroundStyle.backgroundYOffset;
        backgroundStyle.graphicZIndex = backgroundStyle.backgroundGraphicZIndex;
        backgroundStyle.graphicWidth = backgroundStyle.backgroundWidth || backgroundStyle.graphicWidth;
        backgroundStyle.graphicHeight = backgroundStyle.backgroundHeight || backgroundStyle.graphicHeight;
        
        // Erase background styles.
        backgroundStyle.backgroundGraphic = null;
        backgroundStyle.backgroundXOffset = null;
        backgroundStyle.backgroundYOffset = null;
        backgroundStyle.backgroundGraphicZIndex = null;
        
        return this.redrawNode(
            id + this.BACKGROUND_ID_SUFFIX, 
            geometry, 
            backgroundStyle, 
            null
        );
    },

    /**
     * Method: drawGeometryNode
     * Given a node, draw a geometry on the specified layer.
     *     node and geometry are required arguments, style is optional.
     *     This method is only called by the render itself.
     *
     * Parameters:
     * node - {DOMElement}
     * geometry - {<OpenLayers.Geometry>}
     * style - {Object}
     * 
     * Returns:
     * {Object} a hash with properties "node" (the drawn node) and "complete"
     *     (null if parts of the geometry could not be drawn, false if nothing
     *     could be drawn)
     */
    drawGeometryNode: function(node, geometry, style) {
        style = style || node._style;

        var options = {
            'isFilled': style.fill === undefined ?
                true :
                style.fill,
            'isStroked': style.stroke === undefined ?
                !!style.strokeWidth :
                style.stroke
        };
        var drawn;
        switch (geometry.CLASS_NAME) {
            case "OpenLayers.Geometry.Point":
                if(style.graphic === false) {
                    options.isFilled = false;
                    options.isStroked = false;
                }
                drawn = this.drawPoint(node, geometry);
                break;
            case "OpenLayers.Geometry.LineString":
                options.isFilled = false;
                drawn = this.drawLineString(node, geometry);
                break;
            case "OpenLayers.Geometry.LinearRing":
                drawn = this.drawLinearRing(node, geometry);
                break;
            case "OpenLayers.Geometry.Polygon":
                drawn = this.drawPolygon(node, geometry);
                break;
            case "OpenLayers.Geometry.Rectangle":
                drawn = this.drawRectangle(node, geometry);
                break;
            default:
                break;
        }

        node._options = options; 

        //set style
        //TBD simplify this
        if (drawn != false) {
            return {
                node: this.setStyle(node, style, options, geometry),
                complete: drawn
            };
        } else {
            return false;
        }
    },
    
    /**
     * Method: postDraw
     * Things that have do be done after the geometry node is appended
     *     to its parent node. To be overridden by subclasses.
     * 
     * Parameters:
     * node - {DOMElement}
     */
    postDraw: function(node) {},
    
    /**
     * Method: drawPoint
     * Virtual function for drawing Point Geometry. 
     *     Should be implemented by subclasses.
     *     This method is only called by the renderer itself.
     * 
     * Parameters: 
     * node - {DOMElement}
     * geometry - {<OpenLayers.Geometry>}
     * 
     * Returns:
     * {DOMElement} or false if the renderer could not draw the point
     */ 
    drawPoint: function(node, geometry) {},

    /**
     * Method: drawLineString
     * Virtual function for drawing LineString Geometry. 
     *     Should be implemented by subclasses.
     *     This method is only called by the renderer itself.
     * 
     * Parameters: 
     * node - {DOMElement}
     * geometry - {<OpenLayers.Geometry>}
     * 
     * Returns:
     * {DOMElement} or null if the renderer could not draw all components of
     *     the linestring, or false if nothing could be drawn
     */ 
    drawLineString: function(node, geometry) {},

    /**
     * Method: drawLinearRing
     * Virtual function for drawing LinearRing Geometry. 
     *     Should be implemented by subclasses.
     *     This method is only called by the renderer itself.
     * 
     * Parameters: 
     * node - {DOMElement}
     * geometry - {<OpenLayers.Geometry>}
     * 
     * Returns:
     * {DOMElement} or null if the renderer could not draw all components
     *     of the linear ring, or false if nothing could be drawn
     */ 
    drawLinearRing: function(node, geometry) {},

    /**
     * Method: drawPolygon
     * Virtual function for drawing Polygon Geometry. 
     *    Should be implemented by subclasses.
     *    This method is only called by the renderer itself.
     * 
     * Parameters: 
     * node - {DOMElement}
     * geometry - {<OpenLayers.Geometry>}
     * 
     * Returns:
     * {DOMElement} or null if the renderer could not draw all components
     *     of the polygon, or false if nothing could be drawn
     */ 
    drawPolygon: function(node, geometry) {},

    /**
     * Method: drawRectangle
     * Virtual function for drawing Rectangle Geometry. 
     *     Should be implemented by subclasses.
     *     This method is only called by the renderer itself.
     * 
     * Parameters: 
     * node - {DOMElement}
     * geometry - {<OpenLayers.Geometry>}
     * 
     * Returns:
     * {DOMElement} or false if the renderer could not draw the rectangle
     */ 
    drawRectangle: function(node, geometry) {},

    /**
     * Method: drawCircle
     * Virtual function for drawing Circle Geometry. 
     *     Should be implemented by subclasses.
     *     This method is only called by the renderer itself.
     * 
     * Parameters: 
     * node - {DOMElement}
     * geometry - {<OpenLayers.Geometry>}
     * 
     * Returns:
     * {DOMElement} or false if the renderer could not draw the circle
     */ 
    drawCircle: function(node, geometry) {},

    /**
     * Method: removeText
     * Removes a label
     * 
     * Parameters:
     * featureId - {String}
     */
    removeText: function(featureId) {
        var label = document.getElementById(featureId + this.LABEL_ID_SUFFIX);
        if (label) {
            this.textRoot.removeChild(label);
        }
        var outline = document.getElementById(featureId + this.LABEL_OUTLINE_SUFFIX);
        if (outline) {
            this.textRoot.removeChild(outline);
        }
    },

    /**
     * Method: getFeatureIdFromEvent
     * 
     * Parameters:
     * evt - {Object} An <OpenLayers.Event> object
     *
     * Returns:
     * {String} A feature id or undefined.
     */
    getFeatureIdFromEvent: function(evt) {
        var target = evt.target;
        var useElement = target && target.correspondingUseElement;
        var node = useElement ? useElement : (target || evt.srcElement);
        return node._featureId;
    },

    /** 
     * Method: eraseGeometry
     * Erase a geometry from the renderer. In the case of a multi-geometry, 
     *     we cycle through and recurse on ourselves. Otherwise, we look for a 
     *     node with the geometry.id, destroy its geometry, and remove it from
     *     the DOM.
     * 
     * Parameters:
     * geometry - {<OpenLayers.Geometry>}
     * featureId - {String}
     */
    eraseGeometry: function(geometry, featureId) {
        if ((geometry.CLASS_NAME == "OpenLayers.Geometry.MultiPoint") ||
            (geometry.CLASS_NAME == "OpenLayers.Geometry.MultiLineString") ||
            (geometry.CLASS_NAME == "OpenLayers.Geometry.MultiPolygon") ||
            (geometry.CLASS_NAME == "OpenLayers.Geometry.Collection")) {
            for (var i=0, len=geometry.components.length; i<len; i++) {
                this.eraseGeometry(geometry.components[i], featureId);
            }
        } else if (geometry.CLASS_NAME == "OpenLayers.Geometry.ProgressiveLineString") {
            for (var i=0, len=geometry.progressive_geometries.length; i<len; i++) {
                this.eraseGeometry(geometry.progressive_geometries[i], featureId);
            }
        } else {    
            var element = OpenLayers.Util.getElement(geometry.id);
            if (element && element.parentNode) {
                if (element.geometry) {
                    element.geometry.destroy();
                    element.geometry = null;
                }
                element.parentNode.removeChild(element);

                if (this.indexer) {
                    this.indexer.remove(element);
                }
                
                if (element._style.backgroundGraphic) {
                    var backgroundId = geometry.id + this.BACKGROUND_ID_SUFFIX;
                    var bElem = OpenLayers.Util.getElement(backgroundId);
                    if (bElem && bElem.parentNode) {
                        // No need to destroy the geometry since the element and the background
                        // node share the same geometry.
                        bElem.parentNode.removeChild(bElem);
                    }
                }
            }
        }
    },

    /** 
     * Method: nodeFactory
     * Create new node of the specified type, with the (optional) specified id.
     * 
     * If node already exists with same ID and a different type, we remove it
     *     and then call ourselves again to recreate it.
     * 
     * Parameters:
     * id - {String}
     * type - {String} type Kind of node to draw.
     * 
     * Returns:
     * {DOMElement} A new node of the given type and id.
     */
    nodeFactory: function(id, type) {
        var node = OpenLayers.Util.getElement(id);
        if (node) {
            if (!this.nodeTypeCompare(node, type)) {
                node.parentNode.removeChild(node);
                node = this.nodeFactory(id, type);
            }
        } else {
            node = this.createNode(type, id);
        }
        return node;
    },
    
    /** 
     * Method: nodeTypeCompare
     * 
     * Parameters:
     * node - {DOMElement}
     * type - {String} Kind of node
     * 
     * Returns:
     * {Boolean} Whether or not the specified node is of the specified type
     *     This function must be overridden by subclasses.
     */
    nodeTypeCompare: function(node, type) {},
    
    /** 
     * Method: createNode
     * 
     * Parameters:
     * type - {String} Kind of node to draw.
     * id - {String} Id for node.
     * 
     * Returns:
     * {DOMElement} A new node of the given type and id.
     *     This function must be overridden by subclasses.
     */
    createNode: function(type, id) {},

    /**
     * Method: moveRoot
     * moves this renderer's root to a different renderer.
     * 
     * Parameters:
     * renderer - {<OpenLayers.Renderer>} target renderer for the moved root
     */
    moveRoot: function(renderer) {
        var root = this.root;
        if(renderer.root.parentNode == this.rendererRoot) {
            root = renderer.root;
        }
        root.parentNode.removeChild(root);
        renderer.rendererRoot.appendChild(root);
    },
    
    /**
     * Method: getRenderLayerId
     * Gets the layer that this renderer's output appears on. If moveRoot was
     * used, this will be different from the id of the layer containing the
     * features rendered by this renderer.
     * 
     * Returns:
     * {String} the id of the output layer.
     */
    getRenderLayerId: function() {
        return this.root.parentNode.parentNode.id;
    },
    
    /**
     * Method: isComplexSymbol
     * Determines if a symbol cannot be rendered using drawCircle
     * 
     * Parameters:
     * graphicName - {String}
     * 
     * Returns
     * {Boolean} true if the symbol is complex, false if not
     */
    isComplexSymbol: function(graphicName) {
        return (graphicName != "circle") && !!graphicName;
    },

    CLASS_NAME: "OpenLayers.Renderer.Elements"
});

/* ======================================================================
    OpenLayers/Renderer/VML.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Renderer/Elements.js
 */

/**
 * Class: OpenLayers.Renderer.VML
 * Render vector features in browsers with VML capability.  Construct a new
 * VML renderer with the <OpenLayers.Renderer.VML> constructor.
 * 
 * Note that for all calculations in this class, we use (num | 0) to truncate a 
 * float value to an integer. This is done because it seems that VML doesn't 
 * support float values.
 *
 * Inherits from:
 *  - <OpenLayers.Renderer.Elements>
 */
OpenLayers.Renderer.VML = OpenLayers.Class(OpenLayers.Renderer.Elements, {

    /**
     * Property: xmlns
     * {String} XML Namespace URN
     */
    xmlns: "urn:schemas-microsoft-com:vml",
    
    /**
     * Property: symbolCache
     * {DOMElement} node holding symbols. This hash is keyed by symbol name,
     *     and each value is a hash with a "path" and an "extent" property.
     */
    symbolCache: {},

    /**
     * Property: offset
     * {Object} Hash with "x" and "y" properties
     */
    offset: null,
    
    /**
     * Constructor: OpenLayers.Renderer.VML
     * Create a new VML renderer.
     *
     * Parameters:
     * containerID - {String} The id for the element that contains the renderer
     */
    initialize: function(containerID) {
        if (!this.supported()) { 
            return; 
        }
        if (!document.namespaces.olv) {
            document.namespaces.add("olv", this.xmlns);
            var style = document.createStyleSheet();
            var shapes = ['shape','rect', 'oval', 'fill', 'stroke', 'imagedata', 'group','textbox']; 
            for (var i = 0, len = shapes.length; i < len; i++) {

                style.addRule('olv\\:' + shapes[i], "behavior: url(#default#VML); " +
                              "position: absolute; display: inline-block;");
            }                  
        }
        
        OpenLayers.Renderer.Elements.prototype.initialize.apply(this, 
                                                                arguments);
    },

    /**
     * APIMethod: supported
     * Determine whether a browser supports this renderer.
     *
     * Returns:
     * {Boolean} The browser supports the VML renderer
     */
    supported: function() {
        return !!(document.namespaces);
    },    

    /**
     * Method: setExtent
     * Set the renderer's extent
     *
     * Parameters:
     * extent - {<OpenLayers.Bounds>}
     * resolutionChanged - {Boolean}
     * 
     * Returns:
     * {Boolean} true to notify the layer that the new extent does not exceed
     *     the coordinate range, and the features will not need to be redrawn.
     */
    setExtent: function(extent, resolutionChanged) {
        var coordSysUnchanged = OpenLayers.Renderer.Elements.prototype.setExtent.apply(this, arguments);
        var resolution = this.getResolution();
    
        var left = (extent.left/resolution) | 0;
        var top = (extent.top/resolution - this.size.h) | 0;
        if (resolutionChanged || !this.offset) {
            this.offset = {x: left, y: top};
            left = 0;
            top = 0;
        } else {
            left = left - this.offset.x;
            top = top - this.offset.y;
        }

        
        var org = (left - this.xOffset) + " " + top;
        this.root.coordorigin = org;
        var roots = [this.root, this.vectorRoot, this.textRoot];
        var root;
        for(var i=0, len=roots.length; i<len; ++i) {
            root = roots[i];

            var size = this.size.w + " " + this.size.h;
            root.coordsize = size;
            
        }
        // flip the VML display Y axis upside down so it 
        // matches the display Y axis of the map
        this.root.style.flip = "y";
        
        return coordSysUnchanged;
    },


    /**
     * Method: setSize
     * Set the size of the drawing surface
     *
     * Parameters:
     * size - {<OpenLayers.Size>} the size of the drawing surface
     */
    setSize: function(size) {
        OpenLayers.Renderer.prototype.setSize.apply(this, arguments);
        
        // setting width and height on all roots to avoid flicker which we
        // would get with 100% width and height on child roots
        var roots = [
            this.rendererRoot,
            this.root,
            this.vectorRoot,
            this.textRoot
        ];
        var w = this.size.w + "px";
        var h = this.size.h + "px";
        var root;
        for(var i=0, len=roots.length; i<len; ++i) {
            root = roots[i];
            root.style.width = w;
            root.style.height = h;
        }
    },

    /**
     * Method: getNodeType
     * Get the node type for a geometry and style
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>}
     * style - {Object}
     *
     * Returns:
     * {String} The corresponding node type for the specified geometry
     */
    getNodeType: function(geometry, style) {
        var nodeType = null;
        switch (geometry.CLASS_NAME) {
            case "OpenLayers.Geometry.Point":
                if (style.externalGraphic) {
                    nodeType = "olv:rect";
                } else if (this.isComplexSymbol(style.graphicName)) {
                    nodeType = "olv:shape";
                } else {
                    nodeType = "olv:oval";
                }
                break;
            case "OpenLayers.Geometry.Rectangle":
                nodeType = "olv:rect";
                break;
            case "OpenLayers.Geometry.LineString":
            case "OpenLayers.Geometry.LinearRing":
            case "OpenLayers.Geometry.Polygon":
            case "OpenLayers.Geometry.Curve":
                nodeType = "olv:shape";
                break;
            default:
                break;
        }
        return nodeType;
    },

    /**
     * Method: setStyle
     * Use to set all the style attributes to a VML node.
     *
     * Parameters:
     * node - {DOMElement} An VML element to decorate
     * style - {Object}
     * options - {Object} Currently supported options include 
     *                              'isFilled' {Boolean} and
     *                              'isStroked' {Boolean}
     * geometry - {<OpenLayers.Geometry>}
     */
    setStyle: function(node, style, options, geometry) {
        style = style  || node._style;
        options = options || node._options;
        var fillColor = style.fillColor;

        var title = style.title || style.graphicTitle;
        if (title) {
            node.title = title;
        } 

        if (node._geometryClass === "OpenLayers.Geometry.Point") {
            if (style.externalGraphic) {
                options.isFilled = true;
                var width = style.graphicWidth || style.graphicHeight;
                var height = style.graphicHeight || style.graphicWidth;
                width = width ? width : style.pointRadius*2;
                height = height ? height : style.pointRadius*2;

                var resolution = this.getResolution();
                var xOffset = (style.graphicXOffset != undefined) ?
                    style.graphicXOffset : -(0.5 * width);
                var yOffset = (style.graphicYOffset != undefined) ?
                    style.graphicYOffset : -(0.5 * height);
                
                node.style.left = ((((geometry.x - this.featureDx)/resolution - this.offset.x)+xOffset) | 0) + "px";
                node.style.top = (((geometry.y/resolution - this.offset.y)-(yOffset+height)) | 0) + "px";
                node.style.width = width + "px";
                node.style.height = height + "px";
                node.style.flip = "y";
                
                // modify fillColor and options for stroke styling below
                fillColor = "none";
                options.isStroked = false;
            } else if (this.isComplexSymbol(style.graphicName)) {
                var cache = this.importSymbol(style.graphicName);
                node.path = cache.path;
                node.coordorigin = cache.left + "," + cache.bottom;
                var size = cache.size;
                node.coordsize = size + "," + size;        
                this.drawCircle(node, geometry, style.pointRadius);
                node.style.flip = "y";
            } else {
                this.drawCircle(node, geometry, style.pointRadius);
            }
        }

        // fill 
        if (options.isFilled) { 
            node.fillcolor = fillColor; 
        } else { 
            node.filled = "false"; 
        }
        var fills = node.getElementsByTagName("fill");
        var fill = (fills.length == 0) ? null : fills[0];
        if (!options.isFilled) {
            if (fill) {
                node.removeChild(fill);
            }
        } else {
            if (!fill) {
                fill = this.createNode('olv:fill', node.id + "_fill");
            }
            fill.opacity = style.fillOpacity;

            if (node._geometryClass === "OpenLayers.Geometry.Point" &&
                    style.externalGraphic) {

                // override fillOpacity
                if (style.graphicOpacity) {
                    fill.opacity = style.graphicOpacity;
                }
                
                fill.src = style.externalGraphic;
                fill.type = "frame";
                
                if (!(style.graphicWidth && style.graphicHeight)) {
                  fill.aspect = "atmost";
                }                
            }
            if (fill.parentNode != node) {
                node.appendChild(fill);
            }
        }

        // additional rendering for rotated graphics or symbols
        var rotation = style.rotation;
        if ((rotation !== undefined || node._rotation !== undefined)) {
            node._rotation = rotation;
            if (style.externalGraphic) {
                this.graphicRotate(node, xOffset, yOffset, style);
                // make the fill fully transparent, because we now have
                // the graphic as imagedata element. We cannot just remove
                // the fill, because this is part of the hack described
                // in graphicRotate
                fill.opacity = 0;
            } else if(node._geometryClass === "OpenLayers.Geometry.Point") {
                node.style.rotation = rotation || 0;
            }
        }

        // stroke 
        var strokes = node.getElementsByTagName("stroke");
        var stroke = (strokes.length == 0) ? null : strokes[0];
        if (!options.isStroked) {
            node.stroked = false;
            if (stroke) {
                stroke.on = false;
            }
        } else {
            if (!stroke) {
                stroke = this.createNode('olv:stroke', node.id + "_stroke");
                node.appendChild(stroke);
            }
            stroke.on = true;
            stroke.color = style.strokeColor; 
            stroke.weight = style.strokeWidth + "px"; 
            stroke.opacity = style.strokeOpacity;
            stroke.endcap = style.strokeLinecap == 'butt' ? 'flat' :
                (style.strokeLinecap || 'round');
            if (style.strokeDashstyle) {
                stroke.dashstyle = this.dashStyle(style);
            }
        }
        
        if (style.cursor != "inherit" && style.cursor != null) {
            node.style.cursor = style.cursor;
        }
        return node;
    },

    /**
     * Method: graphicRotate
     * If a point is to be styled with externalGraphic and rotation, VML fills
     * cannot be used to display the graphic, because rotation of graphic
     * fills is not supported by the VML implementation of Internet Explorer.
     * This method creates a olv:imagedata element inside the VML node,
     * DXImageTransform.Matrix and BasicImage filters for rotation and
     * opacity, and a 3-step hack to remove rendering artefacts from the
     * graphic and preserve the ability of graphics to trigger events.
     * Finally, OpenLayers methods are used to determine the correct
     * insertion point of the rotated image, because DXImageTransform.Matrix
     * does the rotation without the ability to specify a rotation center
     * point.
     * 
     * Parameters:
     * node    - {DOMElement}
     * xOffset - {Number} rotation center relative to image, x coordinate
     * yOffset - {Number} rotation center relative to image, y coordinate
     * style   - {Object}
     */
    graphicRotate: function(node, xOffset, yOffset, style) {
        var style = style || node._style;
        var rotation = style.rotation || 0;
        
        var aspectRatio, size;
        if (!(style.graphicWidth && style.graphicHeight)) {
            // load the image to determine its size
            var img = new Image();
            img.onreadystatechange = OpenLayers.Function.bind(function() {
                if(img.readyState == "complete" ||
                        img.readyState == "interactive") {
                    aspectRatio = img.width / img.height;
                    size = Math.max(style.pointRadius * 2, 
                        style.graphicWidth || 0,
                        style.graphicHeight || 0);
                    xOffset = xOffset * aspectRatio;
                    style.graphicWidth = size * aspectRatio;
                    style.graphicHeight = size;
                    this.graphicRotate(node, xOffset, yOffset, style);
                }
            }, this);
            img.src = style.externalGraphic;
            
            // will be called again by the onreadystate handler
            return;
        } else {
            size = Math.max(style.graphicWidth, style.graphicHeight);
            aspectRatio = style.graphicWidth / style.graphicHeight;
        }
        
        var width = Math.round(style.graphicWidth || size * aspectRatio);
        var height = Math.round(style.graphicHeight || size);
        node.style.width = width + "px";
        node.style.height = height + "px";
        
        // Three steps are required to remove artefacts for images with
        // transparent backgrounds (resulting from using DXImageTransform
        // filters on svg objects), while preserving awareness for browser
        // events on images:
        // - Use the fill as usual (like for unrotated images) to handle
        //   events
        // - specify an imagedata element with the same src as the fill
        // - style the imagedata element with an AlphaImageLoader filter
        //   with empty src
        var image = document.getElementById(node.id + "_image");
        if (!image) {
            image = this.createNode("olv:imagedata", node.id + "_image");
            node.appendChild(image);
        }
        image.style.width = width + "px";
        image.style.height = height + "px";
        image.src = style.externalGraphic;
        image.style.filter =
            "progid:DXImageTransform.Microsoft.AlphaImageLoader(" + 
            "src='', sizingMethod='scale')";

        var rot = rotation * Math.PI / 180;
        var sintheta = Math.sin(rot);
        var costheta = Math.cos(rot);

        // do the rotation on the image
        var filter =
            "progid:DXImageTransform.Microsoft.Matrix(M11=" + costheta +
            ",M12=" + (-sintheta) + ",M21=" + sintheta + ",M22=" + costheta +
            ",SizingMethod='auto expand')\n";

        // set the opacity (needed for the imagedata)
        var opacity = style.graphicOpacity || style.fillOpacity;
        if (opacity && opacity != 1) {
            filter += 
                "progid:DXImageTransform.Microsoft.BasicImage(opacity=" + 
                opacity+")\n";
        }
        node.style.filter = filter;

        // do the rotation again on a box, so we know the insertion point
        var centerPoint = new OpenLayers.Geometry.Point(-xOffset, -yOffset);
        var imgBox = new OpenLayers.Bounds(0, 0, width, height).toGeometry();
        imgBox.rotate(style.rotation, centerPoint);
        var imgBounds = imgBox.getBounds();

        node.style.left = Math.round(
            parseInt(node.style.left) + imgBounds.left) + "px";
        node.style.top = Math.round(
            parseInt(node.style.top) - imgBounds.bottom) + "px";
    },

    /**
     * Method: postDraw
     * Does some node postprocessing to work around browser issues:
     * - Some versions of Internet Explorer seem to be unable to set fillcolor
     *   and strokecolor to "none" correctly before the fill node is appended
     *   to a visible vml node. This method takes care of that and sets
     *   fillcolor and strokecolor again if needed.
     * - In some cases, a node won't become visible after being drawn. Setting
     *   style.visibility to "visible" works around that.
     * 
     * Parameters:
     * node - {DOMElement}
     */
    postDraw: function(node) {
        node.style.visibility = "visible";
        var fillColor = node._style.fillColor;
        var strokeColor = node._style.strokeColor;
        if (fillColor == "none" &&
                node.fillcolor != fillColor) {
            node.fillcolor = fillColor;
        }
        if (strokeColor == "none" &&
                node.strokecolor != strokeColor) {
            node.strokecolor = strokeColor;
        }
    },


    /**
     * Method: setNodeDimension
     * Get the geometry's bounds, convert it to our vml coordinate system, 
     * then set the node's position, size, and local coordinate system.
     *   
     * Parameters:
     * node - {DOMElement}
     * geometry - {<OpenLayers.Geometry>}
     */
    setNodeDimension: function(node, geometry) {

        var bbox = geometry.getBounds();
        if(bbox) {
            var resolution = this.getResolution();
        
            var scaledBox = 
                new OpenLayers.Bounds(((bbox.left - this.featureDx)/resolution - this.offset.x) | 0,
                                      (bbox.bottom/resolution - this.offset.y) | 0,
                                      ((bbox.right - this.featureDx)/resolution - this.offset.x) | 0,
                                      (bbox.top/resolution - this.offset.y) | 0);
            
            // Set the internal coordinate system to draw the path
            node.style.left = scaledBox.left + "px";
            node.style.top = scaledBox.top + "px";
            node.style.width = scaledBox.getWidth() + "px";
            node.style.height = scaledBox.getHeight() + "px";
    
            node.coordorigin = scaledBox.left + " " + scaledBox.top;
            node.coordsize = scaledBox.getWidth()+ " " + scaledBox.getHeight();
        }
    },
    
    /** 
     * Method: dashStyle
     * 
     * Parameters:
     * style - {Object}
     * 
     * Returns:
     * {String} A VML compliant 'stroke-dasharray' value
     */
    dashStyle: function(style) {
        var dash = style.strokeDashstyle;
        switch (dash) {
            case 'solid':
            case 'dot':
            case 'dash':
            case 'dashdot':
            case 'longdash':
            case 'longdashdot':
                return dash;
            default:
                // very basic guessing of dash style patterns
                var parts = dash.split(/[ ,]/);
                if (parts.length == 2) {
                    if (1*parts[0] >= 2*parts[1]) {
                        return "longdash";
                    }
                    return (parts[0] == 1 || parts[1] == 1) ? "dot" : "dash";
                } else if (parts.length == 4) {
                    return (1*parts[0] >= 2*parts[1]) ? "longdashdot" :
                        "dashdot";
                }
                return "solid";
        }
    },

    /**
     * Method: createNode
     * Create a new node
     *
     * Parameters:
     * type - {String} Kind of node to draw
     * id - {String} Id for node
     *
     * Returns:
     * {DOMElement} A new node of the given type and id
     */
    createNode: function(type, id) {
        var node = document.createElement(type);
        if (id) {
            node.id = id;
        }
        
        // IE hack to make elements unselectable, to prevent 'blue flash'
        // while dragging vectors; #1410
        node.unselectable = 'on';
        node.onselectstart = OpenLayers.Function.False;
        
        return node;    
    },
    
    /**
     * Method: nodeTypeCompare
     * Determine whether a node is of a given type
     *
     * Parameters:
     * node - {DOMElement} An VML element
     * type - {String} Kind of node
     *
     * Returns:
     * {Boolean} Whether or not the specified node is of the specified type
     */
    nodeTypeCompare: function(node, type) {

        //split type
        var subType = type;
        var splitIndex = subType.indexOf(":");
        if (splitIndex != -1) {
            subType = subType.substr(splitIndex+1);
        }

        //split nodeName
        var nodeName = node.nodeName;
        splitIndex = nodeName.indexOf(":");
        if (splitIndex != -1) {
            nodeName = nodeName.substr(splitIndex+1);
        }

        return (subType == nodeName);
    },

    /**
     * Method: createRenderRoot
     * Create the renderer root
     *
     * Returns:
     * {DOMElement} The specific render engine's root element
     */
    createRenderRoot: function() {
        return this.nodeFactory(this.container.id + "_vmlRoot", "div");
    },

    /**
     * Method: createRoot
     * Create the main root element
     * 
     * Parameters:
     * suffix - {String} suffix to append to the id
     *
     * Returns:
     * {DOMElement}
     */
    createRoot: function(suffix) {
        return this.nodeFactory(this.container.id + suffix, "olv:group");
    },
    
    /**************************************
     *                                    *
     *     GEOMETRY DRAWING FUNCTIONS     *
     *                                    *
     **************************************/
    
    /**
     * Method: drawPoint
     * Render a point
     * 
     * Parameters:
     * node - {DOMElement}
     * geometry - {<OpenLayers.Geometry>}
     * 
     * Returns:
     * {DOMElement} or false if the point could not be drawn
     */
    drawPoint: function(node, geometry) {
        return this.drawCircle(node, geometry, 1);
    },

    /**
     * Method: drawCircle
     * Render a circle.
     * Size and Center a circle given geometry (x,y center) and radius
     * 
     * Parameters:
     * node - {DOMElement}
     * geometry - {<OpenLayers.Geometry>}
     * radius - {float}
     * 
     * Returns:
     * {DOMElement} or false if the circle could not ne drawn
     */
    drawCircle: function(node, geometry, radius) {
        if(!isNaN(geometry.x)&& !isNaN(geometry.y)) {
            var resolution = this.getResolution();

            node.style.left = ((((geometry.x - this.featureDx) /resolution - this.offset.x) | 0) - radius) + "px";
            node.style.top = (((geometry.y /resolution - this.offset.y) | 0) - radius) + "px";
    
            var diameter = radius * 2;
            
            node.style.width = diameter + "px";
            node.style.height = diameter + "px";
            return node;
        }
        return false;
    },


    /**
     * Method: drawLineString
     * Render a linestring.
     * 
     * Parameters:
     * node - {DOMElement}
     * geometry - {<OpenLayers.Geometry>}
     * 
     * Returns:
     * {DOMElement}
     */
    drawLineString: function(node, geometry) {
        return this.drawLine(node, geometry, false);
    },

    /**
     * Method: drawLinearRing
     * Render a linearring
     * 
     * Parameters:
     * node - {DOMElement}
     * geometry - {<OpenLayers.Geometry>}
     * 
     * Returns:
     * {DOMElement}
     */
    drawLinearRing: function(node, geometry) {
        return this.drawLine(node, geometry, true);
    },

    /**
     * Method: DrawLine
     * Render a line.
     * 
     * Parameters:
     * node - {DOMElement}
     * geometry - {<OpenLayers.Geometry>}
     * closeLine - {Boolean} Close the line? (make it a ring?)
     * 
     * Returns:
     * {DOMElement}
     */
    drawLine: function(node, geometry, closeLine) {

        this.setNodeDimension(node, geometry);

        var resolution = this.getResolution();
        var numComponents = geometry.components.length;
        var parts = new Array(numComponents);

        var comp, x, y;
        for (var i = 0; i < numComponents; i++) {
            comp = geometry.components[i];
            x = ((comp.x - this.featureDx)/resolution - this.offset.x) | 0;
            y = (comp.y/resolution - this.offset.y) | 0;
            parts[i] = " " + x + "," + y + " l ";
        }
        var end = (closeLine) ? " x e" : " e";
        node.path = "m" + parts.join("") + end;
        return node;
    },

    /**
     * Method: drawPolygon
     * Render a polygon
     * 
     * Parameters:
     * node - {DOMElement}
     * geometry - {<OpenLayers.Geometry>}
     * 
     * Returns:
     * {DOMElement}
     */
    drawPolygon: function(node, geometry) {
        this.setNodeDimension(node, geometry);

        var resolution = this.getResolution();
    
        var path = [];
        var j, jj, points, area, first, second, i, ii, comp, pathComp, x, y;
        for (j=0, jj=geometry.components.length; j<jj; j++) {
            path.push("m");
            points = geometry.components[j].components;
            // we only close paths of interior rings with area
            area = (j === 0);
            first = null;
            second = null;
            for (i=0, ii=points.length; i<ii; i++) {
                comp = points[i];
                x = ((comp.x - this.featureDx) / resolution - this.offset.x) | 0;
                y = (comp.y / resolution - this.offset.y) | 0;
                pathComp = " " + x + "," + y;
                path.push(pathComp);
                if (i==0) {
                    path.push(" l");
                }
                if (!area) {
                    // IE improperly renders sub-paths that have no area.
                    // Instead of checking the area of every ring, we confirm
                    // the ring has at least three distinct points.  This does
                    // not catch all non-zero area cases, but it greatly improves
                    // interior ring digitizing and is a minor performance hit
                    // when rendering rings with many points.
                    if (!first) {
                        first = pathComp;
                    } else if (first != pathComp) {
                        if (!second) {
                            second = pathComp;
                        } else if (second != pathComp) {
                            // stop looking
                            area = true;
                        }
                    }
                }
            }
            path.push(area ? " x " : " ");
        }
        path.push("e");
        node.path = path.join("");
        return node;
    },

    /**
     * Method: drawRectangle
     * Render a rectangle
     * 
     * Parameters:
     * node - {DOMElement}
     * geometry - {<OpenLayers.Geometry>}
     * 
     * Returns:
     * {DOMElement}
     */
    drawRectangle: function(node, geometry) {
        var resolution = this.getResolution();
    
        node.style.left = (((geometry.x - this.featureDx)/resolution - this.offset.x) | 0) + "px";
        node.style.top = ((geometry.y/resolution - this.offset.y) | 0) + "px";
        node.style.width = ((geometry.width/resolution) | 0) + "px";
        node.style.height = ((geometry.height/resolution) | 0) + "px";
        
        return node;
    },
    
    /**
     * Method: drawText
     * This method is only called by the renderer itself.
     * 
     * Parameters: 
     * featureId - {String}
     * style -
     * location - {<OpenLayers.Geometry.Point>}
     */
    drawText: function(featureId, style, location) {
        var label = this.nodeFactory(featureId + this.LABEL_ID_SUFFIX, "olv:rect");
        var textbox = this.nodeFactory(featureId + this.LABEL_ID_SUFFIX + "_textbox", "olv:textbox");
        
        var resolution = this.getResolution();
        label.style.left = (((location.x - this.featureDx)/resolution - this.offset.x) | 0) + "px";
        label.style.top = ((location.y/resolution - this.offset.y) | 0) + "px";
        label.style.flip = "y";

        textbox.innerText = style.label;

        if (style.cursor != "inherit" && style.cursor != null) {
            textbox.style.cursor = style.cursor;
        }
        if (style.fontColor) {
            textbox.style.color = style.fontColor;
        }
        if (style.fontOpacity) {
            textbox.style.filter = 'alpha(opacity=' + (style.fontOpacity * 100) + ')';
        }
        if (style.fontFamily) {
            textbox.style.fontFamily = style.fontFamily;
        }
        if (style.fontSize) {
            textbox.style.fontSize = style.fontSize;
        }
        if (style.fontWeight) {
            textbox.style.fontWeight = style.fontWeight;
        }
        if (style.fontStyle) {
            textbox.style.fontStyle = style.fontStyle;
        }
        if(style.labelSelect === true) {
            label._featureId = featureId;
            textbox._featureId = featureId;
            textbox._geometry = location;
            textbox._geometryClass = location.CLASS_NAME;
        }
        textbox.style.whiteSpace = "nowrap";
        // fun with IE: IE7 in standards compliant mode does not display any
        // text with a left inset of 0. So we set this to 1px and subtract one
        // pixel later when we set label.style.left
        textbox.inset = "1px,0px,0px,0px";

        if(!label.parentNode) {
            label.appendChild(textbox);
            this.textRoot.appendChild(label);
        }

        var align = style.labelAlign || "cm";
        if (align.length == 1) {
            align += "m";
        }
        var xshift = textbox.clientWidth *
            (OpenLayers.Renderer.VML.LABEL_SHIFT[align.substr(0,1)]);
        var yshift = textbox.clientHeight *
            (OpenLayers.Renderer.VML.LABEL_SHIFT[align.substr(1,1)]);
        label.style.left = parseInt(label.style.left)-xshift-1+"px";
        label.style.top = parseInt(label.style.top)+yshift+"px";
        
    },
    
    /**
     * Method: moveRoot
     * moves this renderer's root to a different renderer.
     * 
     * Parameters:
     * renderer - {<OpenLayers.Renderer>} target renderer for the moved root
     * root - {DOMElement} optional root node. To be used when this renderer
     *     holds roots from multiple layers to tell this method which one to
     *     detach
     * 
     * Returns:
     * {Boolean} true if successful, false otherwise
     */
    moveRoot: function(renderer) {
        var layer = this.map.getLayer(renderer.container.id);
        if(layer instanceof OpenLayers.Layer.Vector.RootContainer) {
            layer = this.map.getLayer(this.container.id);
        }
        layer && layer.renderer.clear();
        OpenLayers.Renderer.Elements.prototype.moveRoot.apply(this, arguments);
        layer && layer.redraw();
    },
    
    /**
     * Method: importSymbol
     * add a new symbol definition from the rendererer's symbol hash
     * 
     * Parameters:
     * graphicName - {String} name of the symbol to import
     * 
     * Returns:
     * {Object} - hash of {DOMElement} "symbol" and {Number} "size"
     */      
    importSymbol: function (graphicName)  {
        var id = this.container.id + "-" + graphicName;
        
        // check if symbol already exists in the cache
        var cache = this.symbolCache[id];
        if (cache) {
            return cache;
        }
        
        var symbol = OpenLayers.Renderer.symbol[graphicName];
        if (!symbol) {
            throw new Error(graphicName + ' is not a valid symbol name');
        }

        var symbolExtent = new OpenLayers.Bounds(
                                    Number.MAX_VALUE, Number.MAX_VALUE, 0, 0);
        
        var pathitems = ["m"];
        for (var i=0; i<symbol.length; i=i+2) {
            var x = symbol[i];
            var y = symbol[i+1];
            symbolExtent.left = Math.min(symbolExtent.left, x);
            symbolExtent.bottom = Math.min(symbolExtent.bottom, y);
            symbolExtent.right = Math.max(symbolExtent.right, x);
            symbolExtent.top = Math.max(symbolExtent.top, y);

            pathitems.push(x);
            pathitems.push(y);
            if (i == 0) {
                pathitems.push("l");
            }
        }
        pathitems.push("x e");
        var path = pathitems.join(" ");

        var diff = (symbolExtent.getWidth() - symbolExtent.getHeight()) / 2;
        if(diff > 0) {
            symbolExtent.bottom = symbolExtent.bottom - diff;
            symbolExtent.top = symbolExtent.top + diff;
        } else {
            symbolExtent.left = symbolExtent.left + diff;
            symbolExtent.right = symbolExtent.right - diff;
        }
        
        cache = {
            path: path,
            size: symbolExtent.getWidth(), // equals getHeight() now
            left: symbolExtent.left,
            bottom: symbolExtent.bottom
        };
        this.symbolCache[id] = cache;
        
        return cache;
    },
    
    CLASS_NAME: "OpenLayers.Renderer.VML"
});

/**
 * Constant: OpenLayers.Renderer.VML.LABEL_SHIFT
 * {Object}
 */
OpenLayers.Renderer.VML.LABEL_SHIFT = {
    "l": 0,
    "c": .5,
    "r": 1,
    "t": 0,
    "m": .5,
    "b": 1
};
/* ======================================================================
    OpenLayers/Animation.js
   ====================================================================== */

/**
 * Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. 
 *
 * @requires OpenLayers/SingleFile.js
 */

/**
 * Namespace: OpenLayers.Animation
 * A collection of utility functions for executing methods that repaint a 
 *     portion of the browser window.  These methods take advantage of the
 *     browser's scheduled repaints where requestAnimationFrame is available.
 */
OpenLayers.Animation = (function(window) {
    
    /**
     * Property: isNative
     * {Boolean} true if a native requestAnimationFrame function is available
     */
    var isNative = !!(window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame);
    
    /**
     * Function: requestFrame
     * Schedule a function to be called at the next available animation frame.
     *     Uses the native method where available.  Where requestAnimationFrame is
     *     not available, setTimeout will be called with a 16ms delay.
     *
     * Parameters:
     * callback - {Function} The function to be called at the next animation frame.
     * element - {DOMElement} Optional element that visually bounds the animation.
     */
    var requestFrame = (function() {
        var request = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback, element) {
                window.setTimeout(callback, 16);
            };
        // bind to window to avoid illegal invocation of native function
        return function(callback, element) {
            request.apply(window, [callback, element]);
        };
    })();
    
    // private variables for animation loops
    var counter = 0;
    var loops = {};
    
    /**
     * Function: start
     * Executes a method with <requestFrame> in series for some 
     *     duration.
     *
     * Parameters:
     * callback - {Function} The function to be called at the next animation frame.
     * duration - {Number} Optional duration for the loop.  If not provided, the
     *     animation loop will execute indefinitely.
     * element - {DOMElement} Optional element that visually bounds the animation.
     *
     * Returns:
     * {Number} Identifier for the animation loop.  Used to stop animations with
     *     <stop>.
     */
    function start(callback, duration, element) {
        duration = duration > 0 ? duration : Number.POSITIVE_INFINITY;
        var id = ++counter;
        var start = +new Date;
        loops[id] = function() {
            if (loops[id] && +new Date - start <= duration) {
                callback();
                if (loops[id]) {
                    requestFrame(loops[id], element);
                }
            } else {
                delete loops[id];
            }
        };
        requestFrame(loops[id], element);
        return id;
    }
    
    /**
     * Function: stop
     * Terminates an animation loop started with <start>.
     *
     * Parameters:
     * id - {Number} Identifier returned from <start>.
     */
    function stop(id) {
        delete loops[id];
    }
    
    return {
        isNative: isNative,
        requestFrame: requestFrame,
        start: start,
        stop: stop
    };
    
})(window);
/* ======================================================================
    OpenLayers/Tween.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/BaseTypes/Class.js
 * @requires OpenLayers/Animation.js
 */

/**
 * Namespace: OpenLayers.Tween
 */
OpenLayers.Tween = OpenLayers.Class({
    
    /**
     * APIProperty: easing
     * {<OpenLayers.Easing>(Function)} Easing equation used for the animation
     *     Defaultly set to OpenLayers.Easing.Expo.easeOut
     */
    easing: null,
    
    /**
     * APIProperty: begin
     * {Object} Values to start the animation with
     */
    begin: null,
    
    /**
     * APIProperty: finish
     * {Object} Values to finish the animation with
     */
    finish: null,
    
    /**
     * APIProperty: duration
     * {int} duration of the tween (number of steps)
     */
    duration: null,
    
    /**
     * APIProperty: callbacks
     * {Object} An object with start, eachStep and done properties whose values
     *     are functions to be call during the animation. They are passed the
     *     current computed value as argument.
     */
    callbacks: null,
    
    /**
     * Property: time
     * {int} Step counter
     */
    time: null,
    
    /**
     * Property: animationId
     * {int} Loop id returned by OpenLayers.Animation.start
     */
    animationId: null,
    
    /**
     * Property: playing
     * {Boolean} Tells if the easing is currently playing
     */
    playing: false,
    
    /** 
     * Constructor: OpenLayers.Tween
     * Creates a Tween.
     *
     * Parameters:
     * easing - {<OpenLayers.Easing>(Function)} easing function method to use
     */ 
    initialize: function(easing) {
        this.easing = (easing) ? easing : OpenLayers.Easing.Expo.easeOut;
    },
    
    /**
     * APIMethod: start
     * Plays the Tween, and calls the callback method on each step
     * 
     * Parameters:
     * begin - {Object} values to start the animation with
     * finish - {Object} values to finish the animation with
     * duration - {int} duration of the tween (number of steps)
     * options - {Object} hash of options (for example callbacks (start, eachStep, done))
     */
    start: function(begin, finish, duration, options) {
        this.playing = true;
        this.begin = begin;
        this.finish = finish;
        this.duration = duration;
        this.callbacks = options.callbacks;
        this.time = 0;
        OpenLayers.Animation.stop(this.animationId);
        this.animationId = null;
        if (this.callbacks && this.callbacks.start) {
            this.callbacks.start.call(this, this.begin);
        }
        this.animationId = OpenLayers.Animation.start(
            OpenLayers.Function.bind(this.play, this)
        );
    },
    
    /**
     * APIMethod: stop
     * Stops the Tween, and calls the done callback
     *     Doesn't do anything if animation is already finished
     */
    stop: function() {
        if (!this.playing) {
            return;
        }
        
        if (this.callbacks && this.callbacks.done) {
            this.callbacks.done.call(this, this.finish);
        }
        OpenLayers.Animation.stop(this.animationId);
        this.animationId = null;
        this.playing = false;
    },
    
    /**
     * Method: play
     * Calls the appropriate easing method
     */
    play: function() {
        var value = {};
        for (var i in this.begin) {
            var b = this.begin[i];
            var f = this.finish[i];
            if (b == null || f == null || isNaN(b) || isNaN(f)) {
                throw new TypeError('invalid value for Tween');
            }

            var c = f - b;
            value[i] = this.easing.apply(this, [this.time, b, c, this.duration]);
        }
        this.time++;
        
        if (this.callbacks && this.callbacks.eachStep) {
            this.callbacks.eachStep.call(this, value);
        }
        
        if (this.time > this.duration) {
            this.stop();
        }
    },
    
    /**
     * Create empty functions for all easing methods.
     */
    CLASS_NAME: "OpenLayers.Tween"
});

/**
 * Namespace: OpenLayers.Easing
 * 
 * Credits:
 *      Easing Equations by Robert Penner, <http://www.robertpenner.com/easing/>
 */
OpenLayers.Easing = {
    /**
     * Create empty functions for all easing methods.
     */
    CLASS_NAME: "OpenLayers.Easing"
};

/**
 * Namespace: OpenLayers.Easing.Linear
 */
OpenLayers.Easing.Linear = {
    
    /**
     * Function: easeIn
     * 
     * Parameters:
     * t - {Float} time
     * b - {Float} beginning position
     * c - {Float} total change
     * d - {Float} duration of the transition
     *
     * Returns:
     * {Float}
     */
    easeIn: function(t, b, c, d) {
        return c*t/d + b;
    },
    
    /**
     * Function: easeOut
     * 
     * Parameters:
     * t - {Float} time
     * b - {Float} beginning position
     * c - {Float} total change
     * d - {Float} duration of the transition
     *
     * Returns:
     * {Float}
     */
    easeOut: function(t, b, c, d) {
        return c*t/d + b;
    },
    
    /**
     * Function: easeInOut
     * 
     * Parameters:
     * t - {Float} time
     * b - {Float} beginning position
     * c - {Float} total change
     * d - {Float} duration of the transition
     *
     * Returns:
     * {Float}
     */
    easeInOut: function(t, b, c, d) {
        return c*t/d + b;
    },

    CLASS_NAME: "OpenLayers.Easing.Linear"
};

/**
 * Namespace: OpenLayers.Easing.Expo
 */
OpenLayers.Easing.Expo = {
    
    /**
     * Function: easeIn
     * 
     * Parameters:
     * t - {Float} time
     * b - {Float} beginning position
     * c - {Float} total change
     * d - {Float} duration of the transition
     *
     * Returns:
     * {Float}
     */
    easeIn: function(t, b, c, d) {
        return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
    },
    
    /**
     * Function: easeOut
     * 
     * Parameters:
     * t - {Float} time
     * b - {Float} beginning position
     * c - {Float} total change
     * d - {Float} duration of the transition
     *
     * Returns:
     * {Float}
     */
    easeOut: function(t, b, c, d) {
        return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    },
    
    /**
     * Function: easeInOut
     * 
     * Parameters:
     * t - {Float} time
     * b - {Float} beginning position
     * c - {Float} total change
     * d - {Float} duration of the transition
     *
     * Returns:
     * {Float}
     */
    easeInOut: function(t, b, c, d) {
        if (t==0) return b;
        if (t==d) return b+c;
        if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },

    CLASS_NAME: "OpenLayers.Easing.Expo"
};

/**
 * Namespace: OpenLayers.Easing.Quad
 */
OpenLayers.Easing.Quad = {
    
    /**
     * Function: easeIn
     * 
     * Parameters:
     * t - {Float} time
     * b - {Float} beginning position
     * c - {Float} total change
     * d - {Float} duration of the transition
     *
     * Returns:
     * {Float}
     */
    easeIn: function(t, b, c, d) {
        return c*(t/=d)*t + b;
    },
    
    /**
     * Function: easeOut
     * 
     * Parameters:
     * t - {Float} time
     * b - {Float} beginning position
     * c - {Float} total change
     * d - {Float} duration of the transition
     *
     * Returns:
     * {Float}
     */
    easeOut: function(t, b, c, d) {
        return -c *(t/=d)*(t-2) + b;
    },
    
    /**
     * Function: easeInOut
     * 
     * Parameters:
     * t - {Float} time
     * b - {Float} beginning position
     * c - {Float} total change
     * d - {Float} duration of the transition
     *
     * Returns:
     * {Float}
     */
    easeInOut: function(t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t + b;
        return -c/2 * ((--t)*(t-2) - 1) + b;
    },

    CLASS_NAME: "OpenLayers.Easing.Quad"
};
/* ======================================================================
    OpenLayers/Geometry.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */
 
/**
 * @requires OpenLayers/BaseTypes/Class.js
 */

/**
 * Class: OpenLayers.Geometry
 * A Geometry is a description of a geographic object.  Create an instance of
 * this class with the <OpenLayers.Geometry> constructor.  This is a base class,
 * typical geometry types are described by subclasses of this class.
 *
 * Note that if you use the <OpenLayers.Geometry.fromWKT> method, you must
 * explicitly include the OpenLayers.Format.WKT in your build.
 */
OpenLayers.Geometry = OpenLayers.Class({

    /**
     * Property: id
     * {String} A unique identifier for this geometry.
     */
    id: null,

    /**
     * Property: parent
     * {<OpenLayers.Geometry>}This is set when a Geometry is added as component
     * of another geometry
     */
    parent: null,

    /**
     * Property: bounds 
     * {<OpenLayers.Bounds>} The bounds of this geometry
     */
    bounds: null,

    /**
     * Constructor: OpenLayers.Geometry
     * Creates a geometry object.  
     */
    initialize: function() {
        this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME+ "_");
    },
    
    /**
     * Method: destroy
     * Destroy this geometry.
     */
    destroy: function() {
        this.id = null;
        this.bounds = null;
    },
    
    /**
     * APIMethod: clone
     * Create a clone of this geometry.  Does not set any non-standard
     *     properties of the cloned geometry.
     * 
     * Returns:
     * {<OpenLayers.Geometry>} An exact clone of this geometry.
     */
    clone: function() {
        return new OpenLayers.Geometry();
    },
    
    /**
     * Method: setBounds
     * Set the bounds for this Geometry.
     * 
     * Parameters:
     * bounds - {<OpenLayers.Bounds>} 
     */
    setBounds: function(bounds) {
        if (bounds) {
            this.bounds = bounds.clone();
        }
    },
    
    /**
     * Method: clearBounds
     * Nullify this components bounds and that of its parent as well.
     */
    clearBounds: function() {
        this.bounds = null;
        if (this.parent) {
            this.parent.clearBounds();
        }    
    },
    
    /**
     * Method: extendBounds
     * Extend the existing bounds to include the new bounds. 
     * If geometry's bounds is not yet set, then set a new Bounds.
     * 
     * Parameters:
     * newBounds - {<OpenLayers.Bounds>} 
     */
    extendBounds: function(newBounds){
        var bounds = this.getBounds();
        if (!bounds) {
            this.setBounds(newBounds);
        } else {
            this.bounds.extend(newBounds);
        }
    },
    
    /**
     * APIMethod: getBounds
     * Get the bounds for this Geometry. If bounds is not set, it 
     * is calculated again, this makes queries faster.
     * 
     * Returns:
     * {<OpenLayers.Bounds>}
     */
    getBounds: function() {
        if (this.bounds == null) {
            this.calculateBounds();
        }
        return this.bounds;
    },
    
    /** 
     * APIMethod: calculateBounds
     * Recalculate the bounds for the geometry. 
     */
    calculateBounds: function() {
        //
        // This should be overridden by subclasses.
        //
    },
    
    /**
     * APIMethod: distanceTo
     * Calculate the closest distance between two geometries (on the x-y plane).
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} The target geometry.
     * options - {Object} Optional properties for configuring the distance
     *     calculation.
     *
     * Valid options depend on the specific geometry type.
     * 
     * Returns:
     * {Number | Object} The distance between this geometry and the target.
     *     If details is true, the return will be an object with distance,
     *     x0, y0, x1, and x2 properties.  The x0 and y0 properties represent
     *     the coordinates of the closest point on this geometry. The x1 and y1
     *     properties represent the coordinates of the closest point on the
     *     target geometry.
     */
    distanceTo: function(geometry, options) {
    },
    
    /**
     * APIMethod: getVertices
     * Return a list of all points in this geometry.
     *
     * Parameters:
     * nodes - {Boolean} For lines, only return vertices that are
     *     endpoints.  If false, for lines, only vertices that are not
     *     endpoints will be returned.  If not provided, all vertices will
     *     be returned.
     *
     * Returns:
     * {Array} A list of all vertices in the geometry.
     */
    getVertices: function(nodes) {
    },

    /**
     * Method: atPoint
     * Note - This is only an approximation based on the bounds of the 
     * geometry.
     * 
     * Parameters:
     * lonlat - {<OpenLayers.LonLat>|Object} OpenLayers.LonLat or an
     *     object with a 'lon' and 'lat' properties.
     * toleranceLon - {float} Optional tolerance in Geometric Coords
     * toleranceLat - {float} Optional tolerance in Geographic Coords
     * 
     * Returns:
     * {Boolean} Whether or not the geometry is at the specified location
     */
    atPoint: function(lonlat, toleranceLon, toleranceLat) {
        var atPoint = false;
        var bounds = this.getBounds();
        if ((bounds != null) && (lonlat != null)) {

            var dX = (toleranceLon != null) ? toleranceLon : 0;
            var dY = (toleranceLat != null) ? toleranceLat : 0;
    
            var toleranceBounds = 
                new OpenLayers.Bounds(this.bounds.left - dX,
                                      this.bounds.bottom - dY,
                                      this.bounds.right + dX,
                                      this.bounds.top + dY);

            atPoint = toleranceBounds.containsLonLat(lonlat);
        }
        return atPoint;
    },
    
    /**
     * Method: getLength
     * Calculate the length of this geometry. This method is defined in
     * subclasses.
     * 
     * Returns:
     * {Float} The length of the collection by summing its parts
     */
    getLength: function() {
        //to be overridden by geometries that actually have a length
        //
        return 0.0;
    },

    /**
     * Method: getArea
     * Calculate the area of this geometry. This method is defined in subclasses.
     * 
     * Returns:
     * {Float} The area of the collection by summing its parts
     */
    getArea: function() {
        //to be overridden by geometries that actually have an area
        //
        return 0.0;
    },
    
    /**
     * APIMethod: getCentroid
     * Calculate the centroid of this geometry. This method is defined in subclasses.
     *
     * Returns:
     * {<OpenLayers.Geometry.Point>} The centroid of the collection
     */
    getCentroid: function() {
        return null;
    },

    /**
     * Method: toString
     * Returns a text representation of the geometry.  If the WKT format is
     *     included in a build, this will be the Well-Known Text 
     *     representation.
     *
     * Returns:
     * {String} String representation of this geometry.
     */
    toString: function() {
        var string;
        if (OpenLayers.Format && OpenLayers.Format.WKT) {
            string = OpenLayers.Format.WKT.prototype.write(
                new OpenLayers.Feature.Vector(this)
            );
        } else {
            string = Object.prototype.toString.call(this);
        }
        return string;
    },

    CLASS_NAME: "OpenLayers.Geometry"
});

/**
 * Function: OpenLayers.Geometry.fromWKT
 * Generate a geometry given a Well-Known Text string.  For this method to
 *     work, you must include the OpenLayers.Format.WKT in your build 
 *     explicitly.
 *
 * Parameters:
 * wkt - {String} A string representing the geometry in Well-Known Text.
 *
 * Returns:
 * {<OpenLayers.Geometry>} A geometry of the appropriate class.
 */
OpenLayers.Geometry.fromWKT = function(wkt) {
    var geom;
    if (OpenLayers.Format && OpenLayers.Format.WKT) {
        var format = OpenLayers.Geometry.fromWKT.format;
        if (!format) {
            format = new OpenLayers.Format.WKT();
            OpenLayers.Geometry.fromWKT.format = format;
        }
        var result = format.read(wkt);
        if (result instanceof OpenLayers.Feature.Vector) {
            geom = result.geometry;
        } else if (OpenLayers.Util.isArray(result)) {
            var len = result.length;
            var components = new Array(len);
            for (var i=0; i<len; ++i) {
                components[i] = result[i].geometry;
            }
            geom = new OpenLayers.Geometry.Collection(components);
        }
    }
    return geom;
};
    
/**
 * Method: OpenLayers.Geometry.segmentsIntersect
 * Determine whether two line segments intersect.  Optionally calculates
 *     and returns the intersection point.  This function is optimized for
 *     cases where seg1.x2 >= seg2.x1 || seg2.x2 >= seg1.x1.  In those
 *     obvious cases where there is no intersection, the function should
 *     not be called.
 *
 * Parameters:
 * seg1 - {Object} Object representing a segment with properties x1, y1, x2,
 *     and y2.  The start point is represented by x1 and y1.  The end point
 *     is represented by x2 and y2.  Start and end are ordered so that x1 < x2.
 * seg2 - {Object} Object representing a segment with properties x1, y1, x2,
 *     and y2.  The start point is represented by x1 and y1.  The end point
 *     is represented by x2 and y2.  Start and end are ordered so that x1 < x2.
 * options - {Object} Optional properties for calculating the intersection.
 *
 * Valid options:
 * point - {Boolean} Return the intersection point.  If false, the actual
 *     intersection point will not be calculated.  If true and the segments
 *     intersect, the intersection point will be returned.  If true and
 *     the segments do not intersect, false will be returned.  If true and
 *     the segments are coincident, true will be returned.
 * tolerance - {Number} If a non-null value is provided, if the segments are
 *     within the tolerance distance, this will be considered an intersection.
 *     In addition, if the point option is true and the calculated intersection
 *     is within the tolerance distance of an end point, the endpoint will be
 *     returned instead of the calculated intersection.  Further, if the
 *     intersection is within the tolerance of endpoints on both segments, or
 *     if two segment endpoints are within the tolerance distance of eachother
 *     (but no intersection is otherwise calculated), an endpoint on the
 *     first segment provided will be returned.
 *
 * Returns:
 * {Boolean | <OpenLayers.Geometry.Point>}  The two segments intersect.
 *     If the point argument is true, the return will be the intersection
 *     point or false if none exists.  If point is true and the segments
 *     are coincident, return will be true (and the instersection is equal
 *     to the shorter segment).
 */
OpenLayers.Geometry.segmentsIntersect = function(seg1, seg2, options) {
    var point = options && options.point;
    var tolerance = options && options.tolerance;
    var intersection = false;
    var x11_21 = seg1.x1 - seg2.x1;
    var y11_21 = seg1.y1 - seg2.y1;
    var x12_11 = seg1.x2 - seg1.x1;
    var y12_11 = seg1.y2 - seg1.y1;
    var y22_21 = seg2.y2 - seg2.y1;
    var x22_21 = seg2.x2 - seg2.x1;
    var d = (y22_21 * x12_11) - (x22_21 * y12_11);
    var n1 = (x22_21 * y11_21) - (y22_21 * x11_21);
    var n2 = (x12_11 * y11_21) - (y12_11 * x11_21);
    if(d == 0) {
        // parallel
        if(n1 == 0 && n2 == 0) {
            // coincident
            intersection = true;
        }
    } else {
        var along1 = n1 / d;
        var along2 = n2 / d;
        if(along1 >= 0 && along1 <= 1 && along2 >=0 && along2 <= 1) {
            // intersect
            if(!point) {
                intersection = true;
            } else {
                // calculate the intersection point
                var x = seg1.x1 + (along1 * x12_11);
                var y = seg1.y1 + (along1 * y12_11);
                intersection = new OpenLayers.Geometry.Point(x, y);
            }
        }
    }
    if(tolerance) {
        var dist;
        if(intersection) {
            if(point) {
                var segs = [seg1, seg2];
                var seg, x, y;
                // check segment endpoints for proximity to intersection
                // set intersection to first endpoint within the tolerance
                outer: for(var i=0; i<2; ++i) {
                    seg = segs[i];
                    for(var j=1; j<3; ++j) {
                        x = seg["x" + j];
                        y = seg["y" + j];
                        dist = Math.sqrt(
                            Math.pow(x - intersection.x, 2) +
                            Math.pow(y - intersection.y, 2)
                        );
                        if(dist < tolerance) {
                            intersection.x = x;
                            intersection.y = y;
                            break outer;
                        }
                    }
                }
                
            }
        } else {
            // no calculated intersection, but segments could be within
            // the tolerance of one another
            var segs = [seg1, seg2];
            var source, target, x, y, p, result;
            // check segment endpoints for proximity to intersection
            // set intersection to first endpoint within the tolerance
            outer: for(var i=0; i<2; ++i) {
                source = segs[i];
                target = segs[(i+1)%2];
                for(var j=1; j<3; ++j) {
                    p = {x: source["x"+j], y: source["y"+j]};
                    result = OpenLayers.Geometry.distanceToSegment(p, target);
                    if(result.distance < tolerance) {
                        if(point) {
                            intersection = new OpenLayers.Geometry.Point(p.x, p.y);
                        } else {
                            intersection = true;
                        }
                        break outer;
                    }
                }
            }
        }
    }
    return intersection;
};

/**
 * Function: OpenLayers.Geometry.distanceToSegment
 *
 * Parameters:
 * point - {Object} An object with x and y properties representing the
 *     point coordinates.
 * segment - {Object} An object with x1, y1, x2, and y2 properties
 *     representing endpoint coordinates.
 *
 * Returns:
 * {Object} An object with distance, x, and y properties.  The distance
 *     will be the shortest distance between the input point and segment.
 *     The x and y properties represent the coordinates along the segment
 *     where the shortest distance meets the segment.
 */
OpenLayers.Geometry.distanceToSegment = function(point, segment) {
    var x0 = point.x;
    var y0 = point.y;
    var x1 = segment.x1;
    var y1 = segment.y1;
    var x2 = segment.x2;
    var y2 = segment.y2;
    var dx = x2 - x1;
    var dy = y2 - y1;
    var along = ((dx * (x0 - x1)) + (dy * (y0 - y1))) /
                (Math.pow(dx, 2) + Math.pow(dy, 2));
    var x, y;
    if(along <= 0.0) {
        x = x1;
        y = y1;
    } else if(along >= 1.0) {
        x = x2;
        y = y2;
    } else {
        x = x1 + along * dx;
        y = y1 + along * dy;
    }
    return {
        distance: Math.sqrt(Math.pow(x - x0, 2) + Math.pow(y - y0, 2)),
        x: x, y: y
    };
};
/* ======================================================================
    OpenLayers/Geometry/Collection.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Geometry.js
 */

/**
 * Class: OpenLayers.Geometry.Collection
 * A Collection is exactly what it sounds like: A collection of different 
 * Geometries. These are stored in the local parameter <components> (which
 * can be passed as a parameter to the constructor). 
 * 
 * As new geometries are added to the collection, they are NOT cloned. 
 * When removing geometries, they need to be specified by reference (ie you 
 * have to pass in the *exact* geometry to be removed).
 * 
 * The <getArea> and <getLength> functions here merely iterate through
 * the components, summing their respective areas and lengths.
 *
 * Create a new instance with the <OpenLayers.Geometry.Collection> constructor.
 *
 * Inherits from:
 *  - <OpenLayers.Geometry> 
 */
OpenLayers.Geometry.Collection = OpenLayers.Class(OpenLayers.Geometry, {

    /**
     * APIProperty: components
     * {Array(<OpenLayers.Geometry>)} The component parts of this geometry
     */
    components: null,
    
    /**
     * Property: componentTypes
     * {Array(String)} An array of class names representing the types of
     * components that the collection can include.  A null value means the
     * component types are not restricted.
     */
    componentTypes: null,

    /**
     * Constructor: OpenLayers.Geometry.Collection
     * Creates a Geometry Collection -- a list of geoms.
     *
     * Parameters: 
     * components - {Array(<OpenLayers.Geometry>)} Optional array of geometries
     *
     */
    initialize: function (components) {
        OpenLayers.Geometry.prototype.initialize.apply(this, arguments);
        this.components = [];
        if (components != null) {
            this.addComponents(components);
        }
    },

    /**
     * APIMethod: destroy
     * Destroy this geometry.
     */
    destroy: function () {
        this.components.length = 0;
        this.components = null;
        OpenLayers.Geometry.prototype.destroy.apply(this, arguments);
    },

    /**
     * APIMethod: clone
     * Clone this geometry.
     *
     * Returns:
     * {<OpenLayers.Geometry.Collection>} An exact clone of this collection
     */
    clone: function() {
        var geometry = eval("new " + this.CLASS_NAME + "()");
        for(var i=0, len=this.components.length; i<len; i++) {
            geometry.addComponent(this.components[i].clone());
        }
        
        // catch any randomly tagged-on properties
        OpenLayers.Util.applyDefaults(geometry, this);
        
        return geometry;
    },

    /**
     * Method: getComponentsString
     * Get a string representing the components for this collection
     * 
     * Returns:
     * {String} A string representation of the components of this geometry
     */
    getComponentsString: function(){
        var strings = [];
        for(var i=0, len=this.components.length; i<len; i++) {
            strings.push(this.components[i].toShortString()); 
        }
        return strings.join(",");
    },

    /**
     * APIMethod: calculateBounds
     * Recalculate the bounds by iterating through the components and 
     * calling calling extendBounds() on each item.
     */
    calculateBounds: function() {
        this.bounds = null;
        var bounds = new OpenLayers.Bounds();
        var components = this.components;
        if (components) {
            for (var i=0, len=components.length; i<len; i++) {
                bounds.extend(components[i].getBounds());
            }
        }
        // to preserve old behavior, we only set bounds if non-null
        // in the future, we could add bounds.isEmpty()
        if (bounds.left != null && bounds.bottom != null && 
            bounds.right != null && bounds.top != null) {
            this.setBounds(bounds);
        }
    },

    /**
     * APIMethod: addComponents
     * Add components to this geometry.
     *
     * Parameters:
     * components - {Array(<OpenLayers.Geometry>)} An array of geometries to add
     */
    addComponents: function(components){
        if(!(OpenLayers.Util.isArray(components))) {
            components = [components];
        }
        for(var i=0, len=components.length; i<len; i++) {
            this.addComponent(components[i]);
        }
    },

    /**
     * Method: addComponent
     * Add a new component (geometry) to the collection.  If this.componentTypes
     * is set, then the component class name must be in the componentTypes array.
     *
     * The bounds cache is reset.
     * 
     * Parameters:
     * component - {<OpenLayers.Geometry>} A geometry to add
     * index - {int} Optional index into the array to insert the component
     *
     * Returns:
     * {Boolean} The component geometry was successfully added
     */    
    addComponent: function(component, index) {
        var added = false;
        if(component) {
            if(this.componentTypes == null ||
               (OpenLayers.Util.indexOf(this.componentTypes,
                                        component.CLASS_NAME) > -1)) {

                if(index != null && (index < this.components.length)) {
                    var components1 = this.components.slice(0, index);
                    var components2 = this.components.slice(index, 
                                                           this.components.length);
                    components1.push(component);
                    this.components = components1.concat(components2);
                } else {
                    this.components.push(component);
                }
                component.parent = this;
                this.clearBounds();
                added = true;
            }
        }
        return added;
    },
    
    /**
     * APIMethod: removeComponents
     * Remove components from this geometry.
     *
     * Parameters:
     * components - {Array(<OpenLayers.Geometry>)} The components to be removed
     *
     * Returns: 
     * {Boolean} A component was removed.
     */
    removeComponents: function(components) {
        var removed = false;

        if(!(OpenLayers.Util.isArray(components))) {
            components = [components];
        }
        for(var i=components.length-1; i>=0; --i) {
            removed = this.removeComponent(components[i]) || removed;
        }
        return removed;
    },
    
    /**
     * Method: removeComponent
     * Remove a component from this geometry.
     *
     * Parameters:
     * component - {<OpenLayers.Geometry>} 
     *
     * Returns: 
     * {Boolean} The component was removed.
     */
    removeComponent: function(component) {
        
        OpenLayers.Util.removeItem(this.components, component);
        
        // clearBounds() so that it gets recalculated on the next call
        // to this.getBounds();
        this.clearBounds();
        return true;
    },

    /**
     * APIMethod: getLength
     * Calculate the length of this geometry
     *
     * Returns:
     * {Float} The length of the geometry
     */
    getLength: function() {
        var length = 0.0;
        for (var i=0, len=this.components.length; i<len; i++) {
            length += this.components[i].getLength();
        }
        return length;
    },
    
    /**
     * APIMethod: getArea
     * Calculate the area of this geometry. Note how this function is overridden
     * in <OpenLayers.Geometry.Polygon>.
     *
     * Returns:
     * {Float} The area of the collection by summing its parts
     */
    getArea: function() {
        var area = 0.0;
        for (var i=0, len=this.components.length; i<len; i++) {
            area += this.components[i].getArea();
        }
        return area;
    },

    /** 
     * APIMethod: getGeodesicArea
     * Calculate the approximate area of the polygon were it projected onto
     *     the earth.
     *
     * Parameters:
     * projection - {<OpenLayers.Projection>} The spatial reference system
     *     for the geometry coordinates.  If not provided, Geographic/WGS84 is
     *     assumed.
     * 
     * Reference:
     * Robert. G. Chamberlain and William H. Duquette, "Some Algorithms for
     *     Polygons on a Sphere", JPL Publication 07-03, Jet Propulsion
     *     Laboratory, Pasadena, CA, June 2007 http://trs-new.jpl.nasa.gov/dspace/handle/2014/40409
     *
     * Returns:
     * {float} The approximate geodesic area of the geometry in square meters.
     */
    getGeodesicArea: function(projection) {
        var area = 0.0;
        for(var i=0, len=this.components.length; i<len; i++) {
            area += this.components[i].getGeodesicArea(projection);
        }
        return area;
    },
    
    /**
     * APIMethod: getCentroid
     *
     * Compute the centroid for this geometry collection.
     *
     * Parameters:
     * weighted - {Boolean} Perform the getCentroid computation recursively,
     * returning an area weighted average of all geometries in this collection.
     *
     * Returns:
     * {<OpenLayers.Geometry.Point>} The centroid of the collection
     */
    getCentroid: function(weighted) {
        if (!weighted) {
            return this.components.length && this.components[0].getCentroid();
        }
        var len = this.components.length;
        if (!len) {
            return false;
        }
        
        var areas = [];
        var centroids = [];
        var areaSum = 0;
        var minArea = Number.MAX_VALUE;
        var component;
        for (var i=0; i<len; ++i) {
            component = this.components[i];
            var area = component.getArea();
            var centroid = component.getCentroid(true);
            if (isNaN(area) || isNaN(centroid.x) || isNaN(centroid.y)) {
                continue;
            }
            areas.push(area);
            areaSum += area;
            minArea = (area < minArea && area > 0) ? area : minArea;
            centroids.push(centroid);
        }
        len = areas.length;
        if (areaSum === 0) {
            // all the components in this collection have 0 area
            // probably a collection of points -- weight all the points the same
            for (var i=0; i<len; ++i) {
                areas[i] = 1;
            }
            areaSum = areas.length;
        } else {
            // normalize all the areas where the smallest area will get
            // a value of 1
            for (var i=0; i<len; ++i) {
                areas[i] /= minArea;
            }
            areaSum /= minArea;
        }
        
        var xSum = 0, ySum = 0, centroid, area;
        for (var i=0; i<len; ++i) {
            centroid = centroids[i];
            area = areas[i];
            xSum += centroid.x * area;
            ySum += centroid.y * area;
        }
        
        return new OpenLayers.Geometry.Point(xSum/areaSum, ySum/areaSum);
    },

    /**
     * APIMethod: getGeodesicLength
     * Calculate the approximate length of the geometry were it projected onto
     *     the earth.
     *
     * projection - {<OpenLayers.Projection>} The spatial reference system
     *     for the geometry coordinates.  If not provided, Geographic/WGS84 is
     *     assumed.
     * 
     * Returns:
     * {Float} The appoximate geodesic length of the geometry in meters.
     */
    getGeodesicLength: function(projection) {
        var length = 0.0;
        for(var i=0, len=this.components.length; i<len; i++) {
            length += this.components[i].getGeodesicLength(projection);
        }
        return length;
    },

    /**
     * APIMethod: move
     * Moves a geometry by the given displacement along positive x and y axes.
     *     This modifies the position of the geometry and clears the cached
     *     bounds.
     *
     * Parameters:
     * x - {Float} Distance to move geometry in positive x direction. 
     * y - {Float} Distance to move geometry in positive y direction.
     */
    move: function(x, y) {
        for(var i=0, len=this.components.length; i<len; i++) {
            this.components[i].move(x, y);
        }
    },

    /**
     * APIMethod: rotate
     * Rotate a geometry around some origin
     *
     * Parameters:
     * angle - {Float} Rotation angle in degrees (measured counterclockwise
     *                 from the positive x-axis)
     * origin - {<OpenLayers.Geometry.Point>} Center point for the rotation
     */
    rotate: function(angle, origin) {
        for(var i=0, len=this.components.length; i<len; ++i) {
            this.components[i].rotate(angle, origin);
        }
    },

    /**
     * APIMethod: resize
     * Resize a geometry relative to some origin.  Use this method to apply
     *     a uniform scaling to a geometry.
     *
     * Parameters:
     * scale - {Float} Factor by which to scale the geometry.  A scale of 2
     *                 doubles the size of the geometry in each dimension
     *                 (lines, for example, will be twice as long, and polygons
     *                 will have four times the area).
     * origin - {<OpenLayers.Geometry.Point>} Point of origin for resizing
     * ratio - {Float} Optional x:y ratio for resizing.  Default ratio is 1.
     * 
     * Returns:
     * {<OpenLayers.Geometry>} - The current geometry. 
     */
    resize: function(scale, origin, ratio) {
        for(var i=0; i<this.components.length; ++i) {
            this.components[i].resize(scale, origin, ratio);
        }
        return this;
    },

    /**
     * APIMethod: distanceTo
     * Calculate the closest distance between two geometries (on the x-y plane).
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} The target geometry.
     * options - {Object} Optional properties for configuring the distance
     *     calculation.
     *
     * Valid options:
     * details - {Boolean} Return details from the distance calculation.
     *     Default is false.
     * edge - {Boolean} Calculate the distance from this geometry to the
     *     nearest edge of the target geometry.  Default is true.  If true,
     *     calling distanceTo from a geometry that is wholly contained within
     *     the target will result in a non-zero distance.  If false, whenever
     *     geometries intersect, calling distanceTo will return 0.  If false,
     *     details cannot be returned.
     *
     * Returns:
     * {Number | Object} The distance between this geometry and the target.
     *     If details is true, the return will be an object with distance,
     *     x0, y0, x1, and y1 properties.  The x0 and y0 properties represent
     *     the coordinates of the closest point on this geometry. The x1 and y1
     *     properties represent the coordinates of the closest point on the
     *     target geometry.
     */
    distanceTo: function(geometry, options) {
        var edge = !(options && options.edge === false);
        var details = edge && options && options.details;
        var result, best, distance;
        var min = Number.POSITIVE_INFINITY;
        for(var i=0, len=this.components.length; i<len; ++i) {
            result = this.components[i].distanceTo(geometry, options);
            distance = details ? result.distance : result;
            if(distance < min) {
                min = distance;
                best = result;
                if(min == 0) {
                    break;
                }
            }
        }
        return best;
    },

    /** 
     * APIMethod: equals
     * Determine whether another geometry is equivalent to this one.  Geometries
     *     are considered equivalent if all components have the same coordinates.
     * 
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} The geometry to test. 
     *
     * Returns:
     * {Boolean} The supplied geometry is equivalent to this geometry.
     */
    equals: function(geometry) {
        var equivalent = true;
        if(!geometry || !geometry.CLASS_NAME ||
           (this.CLASS_NAME != geometry.CLASS_NAME)) {
            equivalent = false;
        } else if(!(OpenLayers.Util.isArray(geometry.components)) ||
                  (geometry.components.length != this.components.length)) {
            equivalent = false;
        } else {
            for(var i=0, len=this.components.length; i<len; ++i) {
                if(!this.components[i].equals(geometry.components[i])) {
                    equivalent = false;
                    break;
                }
            }
        }
        return equivalent;
    },

    /**
     * APIMethod: transform
     * Reproject the components geometry from source to dest.
     * 
     * Parameters:
     * source - {<OpenLayers.Projection>} 
     * dest - {<OpenLayers.Projection>}
     * 
     * Returns:
     * {<OpenLayers.Geometry>} 
     */
    transform: function(source, dest) {
        if (source && dest) {
            for (var i=0, len=this.components.length; i<len; i++) {  
                var component = this.components[i];
                component.transform(source, dest);
            }
            this.bounds = null;
        }
        return this;
    },

    /**
     * APIMethod: intersects
     * Determine if the input geometry intersects this one.
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} Any type of geometry.
     *
     * Returns:
     * {Boolean} The input geometry intersects this one.
     */
    intersects: function(geometry) {
        var intersect = false;
        for(var i=0, len=this.components.length; i<len; ++ i) {
            intersect = geometry.intersects(this.components[i]);
            if(intersect) {
                break;
            }
        }
        return intersect;
    },

    /**
     * APIMethod: getVertices
     * Return a list of all points in this geometry.
     *
     * Parameters:
     * nodes - {Boolean} For lines, only return vertices that are
     *     endpoints.  If false, for lines, only vertices that are not
     *     endpoints will be returned.  If not provided, all vertices will
     *     be returned.
     *
     * Returns:
     * {Array} A list of all vertices in the geometry.
     */
    getVertices: function(nodes) {
        var vertices = [];
        for(var i=0, len=this.components.length; i<len; ++i) {
            Array.prototype.push.apply(
                vertices, this.components[i].getVertices(nodes)
            );
        }
        return vertices;
    },


    CLASS_NAME: "OpenLayers.Geometry.Collection"
});
/* ======================================================================
    OpenLayers/Geometry/Point.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Geometry.js
 */

/**
 * Class: OpenLayers.Geometry.Point
 * Point geometry class. 
 * 
 * Inherits from:
 *  - <OpenLayers.Geometry> 
 */
OpenLayers.Geometry.Point = OpenLayers.Class(OpenLayers.Geometry, {

    /** 
     * APIProperty: x 
     * {float} 
     */
    x: null,

    /** 
     * APIProperty: y 
     * {float} 
     */
    y: null,

    /**
     * Constructor: OpenLayers.Geometry.Point
     * Construct a point geometry.
     *
     * Parameters:
     * x - {float} 
     * y - {float}
     * 
     */
    initialize: function(x, y) {
        OpenLayers.Geometry.prototype.initialize.apply(this, arguments);
        
        this.x = parseFloat(x);
        this.y = parseFloat(y);
    },

    /**
     * APIMethod: clone
     * 
     * Returns:
     * {<OpenLayers.Geometry.Point>} An exact clone of this OpenLayers.Geometry.Point
     */
    clone: function(obj) {
        if (obj == null) {
            obj = new OpenLayers.Geometry.Point(this.x, this.y);
        }

        // catch any randomly tagged-on properties
        OpenLayers.Util.applyDefaults(obj, this);

        return obj;
    },

    /** 
     * Method: calculateBounds
     * Create a new Bounds based on the lon/lat
     */
    calculateBounds: function () {
        this.bounds = new OpenLayers.Bounds(this.x, this.y,
                                            this.x, this.y);
    },

    /**
     * APIMethod: distanceTo
     * Calculate the closest distance between two geometries (on the x-y plane).
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} The target geometry.
     * options - {Object} Optional properties for configuring the distance
     *     calculation.
     *
     * Valid options:
     * details - {Boolean} Return details from the distance calculation.
     *     Default is false.
     * edge - {Boolean} Calculate the distance from this geometry to the
     *     nearest edge of the target geometry.  Default is true.  If true,
     *     calling distanceTo from a geometry that is wholly contained within
     *     the target will result in a non-zero distance.  If false, whenever
     *     geometries intersect, calling distanceTo will return 0.  If false,
     *     details cannot be returned.
     *
     * Returns:
     * {Number | Object} The distance between this geometry and the target.
     *     If details is true, the return will be an object with distance,
     *     x0, y0, x1, and x2 properties.  The x0 and y0 properties represent
     *     the coordinates of the closest point on this geometry. The x1 and y1
     *     properties represent the coordinates of the closest point on the
     *     target geometry.
     */
    distanceTo: function(geometry, options) {
        var edge = !(options && options.edge === false);
        var details = edge && options && options.details;
        var distance, x0, y0, x1, y1, result;
        if(geometry instanceof OpenLayers.Geometry.Point) {
            x0 = this.x;
            y0 = this.y;
            x1 = geometry.x;
            y1 = geometry.y;
            distance = Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
            result = !details ?
                distance : {x0: x0, y0: y0, x1: x1, y1: y1, distance: distance};
        } else {
            result = geometry.distanceTo(this, options);
            if(details) {
                // switch coord order since this geom is target
                result = {
                    x0: result.x1, y0: result.y1,
                    x1: result.x0, y1: result.y0,
                    distance: result.distance
                };
            }
        }
        return result;
    },
    
    /** 
     * APIMethod: equals
     * Determine whether another geometry is equivalent to this one.  Geometries
     *     are considered equivalent if all components have the same coordinates.
     * 
     * Parameters:
     * geom - {<OpenLayers.Geometry.Point>} The geometry to test. 
     *
     * Returns:
     * {Boolean} The supplied geometry is equivalent to this geometry.
     */
    equals: function(geom) {
        var equals = false;
        if (geom != null) {
            equals = ((this.x == geom.x && this.y == geom.y) ||
                      (isNaN(this.x) && isNaN(this.y) && isNaN(geom.x) && isNaN(geom.y)));
        }
        return equals;
    },
    
    /**
     * Method: toShortString
     *
     * Returns:
     * {String} Shortened String representation of Point object. 
     *         (ex. <i>"5, 42"</i>)
     */
    toShortString: function() {
        return (this.x + ", " + this.y);
    },
    
    /**
     * APIMethod: move
     * Moves a geometry by the given displacement along positive x and y axes.
     *     This modifies the position of the geometry and clears the cached
     *     bounds.
     *
     * Parameters:
     * x - {Float} Distance to move geometry in positive x direction. 
     * y - {Float} Distance to move geometry in positive y direction.
     */
    move: function(x, y) {
        this.x = this.x + x;
        this.y = this.y + y;
        this.clearBounds();
    },

    /**
     * APIMethod: rotate
     * Rotate a point around another.
     *
     * Parameters:
     * angle - {Float} Rotation angle in degrees (measured counterclockwise
     *                 from the positive x-axis)
     * origin - {<OpenLayers.Geometry.Point>} Center point for the rotation
     */
    rotate: function(angle, origin) {
        angle *= Math.PI / 180;
        var radius = this.distanceTo(origin);
        var theta = angle + Math.atan2(this.y - origin.y, this.x - origin.x);
        this.x = origin.x + (radius * Math.cos(theta));
        this.y = origin.y + (radius * Math.sin(theta));
        this.clearBounds();
    },
    
    /**
     * APIMethod: getCentroid
     *
     * Returns:
     * {<OpenLayers.Geometry.Point>} The centroid of the collection
     */
    getCentroid: function() {
        return new OpenLayers.Geometry.Point(this.x, this.y);
    },

    /**
     * APIMethod: resize
     * Resize a point relative to some origin.  For points, this has the effect
     *     of scaling a vector (from the origin to the point).  This method is
     *     more useful on geometry collection subclasses.
     *
     * Parameters:
     * scale - {Float} Ratio of the new distance from the origin to the old
     *                 distance from the origin.  A scale of 2 doubles the
     *                 distance between the point and origin.
     * origin - {<OpenLayers.Geometry.Point>} Point of origin for resizing
     * ratio - {Float} Optional x:y ratio for resizing.  Default ratio is 1.
     * 
     * Returns:
     * {<OpenLayers.Geometry>} - The current geometry. 
     */
    resize: function(scale, origin, ratio) {
        ratio = (ratio == undefined) ? 1 : ratio;
        this.x = origin.x + (scale * ratio * (this.x - origin.x));
        this.y = origin.y + (scale * (this.y - origin.y));
        this.clearBounds();
        return this;
    },
    
    /**
     * APIMethod: intersects
     * Determine if the input geometry intersects this one.
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} Any type of geometry.
     *
     * Returns:
     * {Boolean} The input geometry intersects this one.
     */
    intersects: function(geometry) {
        var intersect = false;
        if(geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
            intersect = this.equals(geometry);
        } else {
            intersect = geometry.intersects(this);
        }
        return intersect;
    },
    
    /**
     * APIMethod: transform
     * Translate the x,y properties of the point from source to dest.
     * 
     * Parameters:
     * source - {<OpenLayers.Projection>} 
     * dest - {<OpenLayers.Projection>}
     * 
     * Returns:
     * {<OpenLayers.Geometry>} 
     */
    transform: function(source, dest) {
        if ((source && dest)) {
            OpenLayers.Projection.transform(
                this, source, dest); 
            this.bounds = null;
        }       
        return this;
    },

    /**
     * APIMethod: getVertices
     * Return a list of all points in this geometry.
     *
     * Parameters:
     * nodes - {Boolean} For lines, only return vertices that are
     *     endpoints.  If false, for lines, only vertices that are not
     *     endpoints will be returned.  If not provided, all vertices will
     *     be returned.
     *
     * Returns:
     * {Array} A list of all vertices in the geometry.
     */
    getVertices: function(nodes) {
        return [this];
    },

    CLASS_NAME: "OpenLayers.Geometry.Point"
});
/* ======================================================================
    OpenLayers/Geometry/MultiPoint.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Geometry/Collection.js
 * @requires OpenLayers/Geometry/Point.js
 */

/**
 * Class: OpenLayers.Geometry.MultiPoint
 * MultiPoint is a collection of Points.  Create a new instance with the
 * <OpenLayers.Geometry.MultiPoint> constructor.
 *
 * Inherits from:
 *  - <OpenLayers.Geometry.Collection>
 *  - <OpenLayers.Geometry>
 */
OpenLayers.Geometry.MultiPoint = OpenLayers.Class(
  OpenLayers.Geometry.Collection, {

    /**
     * Property: componentTypes
     * {Array(String)} An array of class names representing the types of
     * components that the collection can include.  A null value means the
     * component types are not restricted.
     */
    componentTypes: ["OpenLayers.Geometry.Point"],

    /**
     * Constructor: OpenLayers.Geometry.MultiPoint
     * Create a new MultiPoint Geometry
     *
     * Parameters:
     * components - {Array(<OpenLayers.Geometry.Point>)} 
     *
     * Returns:
     * {<OpenLayers.Geometry.MultiPoint>}
     */

    /**
     * APIMethod: addPoint
     * Wrapper for <OpenLayers.Geometry.Collection.addComponent>
     *
     * Parameters:
     * point - {<OpenLayers.Geometry.Point>} Point to be added
     * index - {Integer} Optional index
     */
    addPoint: function(point, index) {
        this.addComponent(point, index);
    },
    
    /**
     * APIMethod: removePoint
     * Wrapper for <OpenLayers.Geometry.Collection.removeComponent>
     *
     * Parameters:
     * point - {<OpenLayers.Geometry.Point>} Point to be removed
     */
    removePoint: function(point){
        this.removeComponent(point);
    },

    CLASS_NAME: "OpenLayers.Geometry.MultiPoint"
});
/* ======================================================================
    OpenLayers/Geometry/Curve.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Geometry/MultiPoint.js
 */

/**
 * Class: OpenLayers.Geometry.Curve
 * A Curve is a MultiPoint, whose points are assumed to be connected. To 
 * this end, we provide a "getLength()" function, which iterates through 
 * the points, summing the distances between them. 
 * 
 * Inherits: 
 *  - <OpenLayers.Geometry.MultiPoint>
 */
OpenLayers.Geometry.Curve = OpenLayers.Class(OpenLayers.Geometry.MultiPoint, {

    /**
     * Property: componentTypes
     * {Array(String)} An array of class names representing the types of 
     *                 components that the collection can include.  A null 
     *                 value means the component types are not restricted.
     */
    componentTypes: ["OpenLayers.Geometry.Point"],

    /**
     * Constructor: OpenLayers.Geometry.Curve
     * 
     * Parameters:
     * point - {Array(<OpenLayers.Geometry.Point>)}
     */
    
    /**
     * APIMethod: getLength
     * 
     * Returns:
     * {Float} The length of the curve
     */
    getLength: function() {
        var length = 0.0;
        if ( this.components && (this.components.length > 1)) {
            for(var i=1, len=this.components.length; i<len; i++) {
                length += this.components[i-1].distanceTo(this.components[i]);
            }
        }
        return length;
    },

    /**
     * APIMethod: getGeodesicLength
     * Calculate the approximate length of the geometry were it projected onto
     *     the earth.
     *
     * projection - {<OpenLayers.Projection>} The spatial reference system
     *     for the geometry coordinates.  If not provided, Geographic/WGS84 is
     *     assumed.
     * 
     * Returns:
     * {Float} The appoximate geodesic length of the geometry in meters.
     */
    getGeodesicLength: function(projection) {
        var geom = this;  // so we can work with a clone if needed
        if(projection) {
            var gg = new OpenLayers.Projection("EPSG:4326");
            if(!gg.equals(projection)) {
                geom = this.clone().transform(projection, gg);
            }
        }
        var length = 0.0;
        if(geom.components && (geom.components.length > 1)) {
            var p1, p2;
            for(var i=1, len=geom.components.length; i<len; i++) {
                p1 = geom.components[i-1];
                p2 = geom.components[i];
                // this returns km and requires lon/lat properties
                length += OpenLayers.Util.distVincenty(
                    {lon: p1.x, lat: p1.y}, {lon: p2.x, lat: p2.y}
                );
            }
        }
        // convert to m
        return length * 1000;
    },

    CLASS_NAME: "OpenLayers.Geometry.Curve"
});
/* ======================================================================
    OpenLayers/Geometry/LineString.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Geometry/Curve.js
 */

/**
 * Class: OpenLayers.Geometry.LineString
 * A LineString is a Curve which, once two points have been added to it, can 
 * never be less than two points long.
 * 
 * Inherits from:
 *  - <OpenLayers.Geometry.Curve>
 */
OpenLayers.Geometry.LineString = OpenLayers.Class(OpenLayers.Geometry.Curve, {

    /**
     * Constructor: OpenLayers.Geometry.LineString
     * Create a new LineString geometry
     *
     * Parameters:
     * points - {Array(<OpenLayers.Geometry.Point>)} An array of points used to
     *          generate the linestring
     *
     */

    /**
     * APIMethod: removeComponent
     * Only allows removal of a point if there are three or more points in 
     * the linestring. (otherwise the result would be just a single point)
     *
     * Parameters: 
     * point - {<OpenLayers.Geometry.Point>} The point to be removed
     *
     * Returns: 
     * {Boolean} The component was removed.
     */
    removeComponent: function(point) {
        var removed = this.components && (this.components.length > 2);
        if (removed) {
            OpenLayers.Geometry.Collection.prototype.removeComponent.apply(this, 
                                                                  arguments);
        }
        return removed;
    },
    
    /**
     * APIMethod: intersects
     * Test for instersection between two geometries.  This is a cheapo
     *     implementation of the Bently-Ottmann algorigithm.  It doesn't
     *     really keep track of a sweep line data structure.  It is closer
     *     to the brute force method, except that segments are sorted and
     *     potential intersections are only calculated when bounding boxes
     *     intersect.
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>}
     *
     * Returns:
     * {Boolean} The input geometry intersects this geometry.
     */
    intersects: function(geometry) {
        var intersect = false;
        var type = geometry.CLASS_NAME;
        if(type == "OpenLayers.Geometry.LineString" ||
           type == "OpenLayers.Geometry.LinearRing" ||
           type == "OpenLayers.Geometry.Point") {
            var segs1 = this.getSortedSegments();
            var segs2;
            if(type == "OpenLayers.Geometry.Point") {
                segs2 = [{
                    x1: geometry.x, y1: geometry.y,
                    x2: geometry.x, y2: geometry.y
                }];
            } else {
                segs2 = geometry.getSortedSegments();
            }
            var seg1, seg1x1, seg1x2, seg1y1, seg1y2,
                seg2, seg2y1, seg2y2;
            // sweep right
            outer: for(var i=0, len=segs1.length; i<len; ++i) {
                seg1 = segs1[i];
                seg1x1 = seg1.x1;
                seg1x2 = seg1.x2;
                seg1y1 = seg1.y1;
                seg1y2 = seg1.y2;
                inner: for(var j=0, jlen=segs2.length; j<jlen; ++j) {
                    seg2 = segs2[j];
                    if(seg2.x1 > seg1x2) {
                        // seg1 still left of seg2
                        break;
                    }
                    if(seg2.x2 < seg1x1) {
                        // seg2 still left of seg1
                        continue;
                    }
                    seg2y1 = seg2.y1;
                    seg2y2 = seg2.y2;
                    if(Math.min(seg2y1, seg2y2) > Math.max(seg1y1, seg1y2)) {
                        // seg2 above seg1
                        continue;
                    }
                    if(Math.max(seg2y1, seg2y2) < Math.min(seg1y1, seg1y2)) {
                        // seg2 below seg1
                        continue;
                    }
                    if(OpenLayers.Geometry.segmentsIntersect(seg1, seg2)) {
                        intersect = true;
                        break outer;
                    }
                }
            }
        } else {
            intersect = geometry.intersects(this);
        }
        return intersect;
    },
    
    /**
     * Method: getSortedSegments
     *
     * Returns:
     * {Array} An array of segment objects.  Segment objects have properties
     *     x1, y1, x2, and y2.  The start point is represented by x1 and y1.
     *     The end point is represented by x2 and y2.  Start and end are
     *     ordered so that x1 < x2.
     */
    getSortedSegments: function() {
        var numSeg = this.components.length - 1;
        var segments = new Array(numSeg), point1, point2;
        for(var i=0; i<numSeg; ++i) {
            point1 = this.components[i];
            point2 = this.components[i + 1];
            if(point1.x < point2.x) {
                segments[i] = {
                    x1: point1.x,
                    y1: point1.y,
                    x2: point2.x,
                    y2: point2.y
                };
            } else {
                segments[i] = {
                    x1: point2.x,
                    y1: point2.y,
                    x2: point1.x,
                    y2: point1.y
                };
            }
        }
        // more efficient to define this somewhere static
        function byX1(seg1, seg2) {
            return seg1.x1 - seg2.x1;
        }
        return segments.sort(byX1);
    },
    
    /**
     * Method: splitWithSegment
     * Split this geometry with the given segment.
     *
     * Parameters:
     * seg - {Object} An object with x1, y1, x2, and y2 properties referencing
     *     segment endpoint coordinates.
     * options - {Object} Properties of this object will be used to determine
     *     how the split is conducted.
     *
     * Valid options:
     * edge - {Boolean} Allow splitting when only edges intersect.  Default is
     *     true.  If false, a vertex on the source segment must be within the
     *     tolerance distance of the intersection to be considered a split.
     * tolerance - {Number} If a non-null value is provided, intersections
     *     within the tolerance distance of one of the source segment's
     *     endpoints will be assumed to occur at the endpoint.
     *
     * Returns:
     * {Object} An object with *lines* and *points* properties.  If the given
     *     segment intersects this linestring, the lines array will reference
     *     geometries that result from the split.  The points array will contain
     *     all intersection points.  Intersection points are sorted along the
     *     segment (in order from x1,y1 to x2,y2).
     */
    splitWithSegment: function(seg, options) {
        var edge = !(options && options.edge === false);
        var tolerance = options && options.tolerance;
        var lines = [];
        var verts = this.getVertices();
        var points = [];
        var intersections = [];
        var split = false;
        var vert1, vert2, point;
        var node, vertex, target;
        var interOptions = {point: true, tolerance: tolerance};
        var result = null;
        for(var i=0, stop=verts.length-2; i<=stop; ++i) {
            vert1 = verts[i];
            points.push(vert1.clone());
            vert2 = verts[i+1];
            target = {x1: vert1.x, y1: vert1.y, x2: vert2.x, y2: vert2.y};
            point = OpenLayers.Geometry.segmentsIntersect(
                seg, target, interOptions
            );
            if(point instanceof OpenLayers.Geometry.Point) {
                if((point.x === seg.x1 && point.y === seg.y1) ||
                   (point.x === seg.x2 && point.y === seg.y2) ||
                   point.equals(vert1) || point.equals(vert2)) {
                    vertex = true;
                } else {
                    vertex = false;
                }
                if(vertex || edge) {
                    // push intersections different than the previous
                    if(!point.equals(intersections[intersections.length-1])) {
                        intersections.push(point.clone());
                    }
                    if(i === 0) {
                        if(point.equals(vert1)) {
                            continue;
                        }
                    }
                    if(point.equals(vert2)) {
                        continue;
                    }
                    split = true;
                    if(!point.equals(vert1)) {
                        points.push(point);
                    }
                    lines.push(new OpenLayers.Geometry.LineString(points));
                    points = [point.clone()];
                }
            }
        }
        if(split) {
            points.push(vert2.clone());
            lines.push(new OpenLayers.Geometry.LineString(points));
        }
        if(intersections.length > 0) {
            // sort intersections along segment
            var xDir = seg.x1 < seg.x2 ? 1 : -1;
            var yDir = seg.y1 < seg.y2 ? 1 : -1;
            result = {
                lines: lines,
                points: intersections.sort(function(p1, p2) {
                    return (xDir * p1.x - xDir * p2.x) || (yDir * p1.y - yDir * p2.y);
                })
            };
        }
        return result;
    },

    /**
     * Method: split
     * Use this geometry (the source) to attempt to split a target geometry.
     * 
     * Parameters:
     * target - {<OpenLayers.Geometry>} The target geometry.
     * options - {Object} Properties of this object will be used to determine
     *     how the split is conducted.
     *
     * Valid options:
     * mutual - {Boolean} Split the source geometry in addition to the target
     *     geometry.  Default is false.
     * edge - {Boolean} Allow splitting when only edges intersect.  Default is
     *     true.  If false, a vertex on the source must be within the tolerance
     *     distance of the intersection to be considered a split.
     * tolerance - {Number} If a non-null value is provided, intersections
     *     within the tolerance distance of an existing vertex on the source
     *     will be assumed to occur at the vertex.
     * 
     * Returns:
     * {Array} A list of geometries (of this same type as the target) that
     *     result from splitting the target with the source geometry.  The
     *     source and target geometry will remain unmodified.  If no split
     *     results, null will be returned.  If mutual is true and a split
     *     results, return will be an array of two arrays - the first will be
     *     all geometries that result from splitting the source geometry and
     *     the second will be all geometries that result from splitting the
     *     target geometry.
     */
    split: function(target, options) {
        var results = null;
        var mutual = options && options.mutual;
        var sourceSplit, targetSplit, sourceParts, targetParts;
        if(target instanceof OpenLayers.Geometry.LineString) {
            var verts = this.getVertices();
            var vert1, vert2, seg, splits, lines, point;
            var points = [];
            sourceParts = [];
            for(var i=0, stop=verts.length-2; i<=stop; ++i) {
                vert1 = verts[i];
                vert2 = verts[i+1];
                seg = {
                    x1: vert1.x, y1: vert1.y,
                    x2: vert2.x, y2: vert2.y
                };
                targetParts = targetParts || [target];
                if(mutual) {
                    points.push(vert1.clone());
                }
                for(var j=0; j<targetParts.length; ++j) {
                    splits = targetParts[j].splitWithSegment(seg, options);
                    if(splits) {
                        // splice in new features
                        lines = splits.lines;
                        if(lines.length > 0) {
                            lines.unshift(j, 1);
                            Array.prototype.splice.apply(targetParts, lines);
                            j += lines.length - 2;
                        }
                        if(mutual) {
                            for(var k=0, len=splits.points.length; k<len; ++k) {
                                point = splits.points[k];
                                if(!point.equals(vert1)) {
                                    points.push(point);
                                    sourceParts.push(new OpenLayers.Geometry.LineString(points));
                                    if(point.equals(vert2)) {
                                        points = [];
                                    } else {
                                        points = [point.clone()];
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if(mutual && sourceParts.length > 0 && points.length > 0) {
                points.push(vert2.clone());
                sourceParts.push(new OpenLayers.Geometry.LineString(points));
            }
        } else {
            results = target.splitWith(this, options);
        }
        if(targetParts && targetParts.length > 1) {
            targetSplit = true;
        } else {
            targetParts = [];
        }
        if(sourceParts && sourceParts.length > 1) {
            sourceSplit = true;
        } else {
            sourceParts = [];
        }
        if(targetSplit || sourceSplit) {
            if(mutual) {
                results = [sourceParts, targetParts];
            } else {
                results = targetParts;
            }
        }
        return results;
    },

    /**
     * Method: splitWith
     * Split this geometry (the target) with the given geometry (the source).
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} A geometry used to split this
     *     geometry (the source).
     * options - {Object} Properties of this object will be used to determine
     *     how the split is conducted.
     *
     * Valid options:
     * mutual - {Boolean} Split the source geometry in addition to the target
     *     geometry.  Default is false.
     * edge - {Boolean} Allow splitting when only edges intersect.  Default is
     *     true.  If false, a vertex on the source must be within the tolerance
     *     distance of the intersection to be considered a split.
     * tolerance - {Number} If a non-null value is provided, intersections
     *     within the tolerance distance of an existing vertex on the source
     *     will be assumed to occur at the vertex.
     * 
     * Returns:
     * {Array} A list of geometries (of this same type as the target) that
     *     result from splitting the target with the source geometry.  The
     *     source and target geometry will remain unmodified.  If no split
     *     results, null will be returned.  If mutual is true and a split
     *     results, return will be an array of two arrays - the first will be
     *     all geometries that result from splitting the source geometry and
     *     the second will be all geometries that result from splitting the
     *     target geometry.
     */
    splitWith: function(geometry, options) {
        return geometry.split(this, options);

    },

    /**
     * APIMethod: getVertices
     * Return a list of all points in this geometry.
     *
     * Parameters:
     * nodes - {Boolean} For lines, only return vertices that are
     *     endpoints.  If false, for lines, only vertices that are not
     *     endpoints will be returned.  If not provided, all vertices will
     *     be returned.
     *
     * Returns:
     * {Array} A list of all vertices in the geometry.
     */
    getVertices: function(nodes) {
        var vertices;
        if(nodes === true) {
            vertices = [
                this.components[0],
                this.components[this.components.length-1]
            ];
        } else if (nodes === false) {
            vertices = this.components.slice(1, this.components.length-1);
        } else {
            vertices = this.components.slice();
        }
        return vertices;
    },

    /**
     * APIMethod: distanceTo
     * Calculate the closest distance between two geometries (on the x-y plane).
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} The target geometry.
     * options - {Object} Optional properties for configuring the distance
     *     calculation.
     *
     * Valid options:
     * details - {Boolean} Return details from the distance calculation.
     *     Default is false.
     * edge - {Boolean} Calculate the distance from this geometry to the
     *     nearest edge of the target geometry.  Default is true.  If true,
     *     calling distanceTo from a geometry that is wholly contained within
     *     the target will result in a non-zero distance.  If false, whenever
     *     geometries intersect, calling distanceTo will return 0.  If false,
     *     details cannot be returned.
     *
     * Returns:
     * {Number | Object} The distance between this geometry and the target.
     *     If details is true, the return will be an object with distance,
     *     x0, y0, x1, and x2 properties.  The x0 and y0 properties represent
     *     the coordinates of the closest point on this geometry. The x1 and y1
     *     properties represent the coordinates of the closest point on the
     *     target geometry.
     */
    distanceTo: function(geometry, options) {
        var edge = !(options && options.edge === false);
        var details = edge && options && options.details;
        var result, best = {};
        var min = Number.POSITIVE_INFINITY;
        if(geometry instanceof OpenLayers.Geometry.Point) {
            var segs = this.getSortedSegments();
            var x = geometry.x;
            var y = geometry.y;
            var seg;
            for(var i=0, len=segs.length; i<len; ++i) {
                seg = segs[i];
                result = OpenLayers.Geometry.distanceToSegment(geometry, seg);
                if(result.distance < min) {
                    min = result.distance;
                    best = result;
                    if(min === 0) {
                        break;
                    }
                } else {
                    // if distance increases and we cross y0 to the right of x0, no need to keep looking.
                    if(seg.x2 > x && ((y > seg.y1 && y < seg.y2) || (y < seg.y1 && y > seg.y2))) {
                        break;
                    }
                }
            }
            if(details) {
                best = {
                    distance: best.distance,
                    x0: best.x, y0: best.y,
                    x1: x, y1: y
                };
            } else {
                best = best.distance;
            }
        } else if(geometry instanceof OpenLayers.Geometry.LineString) { 
            var segs0 = this.getSortedSegments();
            var segs1 = geometry.getSortedSegments();
            var seg0, seg1, intersection, x0, y0;
            var len1 = segs1.length;
            var interOptions = {point: true};
            outer: for(var i=0, len=segs0.length; i<len; ++i) {
                seg0 = segs0[i];
                x0 = seg0.x1;
                y0 = seg0.y1;
                for(var j=0; j<len1; ++j) {
                    seg1 = segs1[j];
                    intersection = OpenLayers.Geometry.segmentsIntersect(seg0, seg1, interOptions);
                    if(intersection) {
                        min = 0;
                        best = {
                            distance: 0,
                            x0: intersection.x, y0: intersection.y,
                            x1: intersection.x, y1: intersection.y
                        };
                        break outer;
                    } else {
                        result = OpenLayers.Geometry.distanceToSegment({x: x0, y: y0}, seg1);
                        if(result.distance < min) {
                            min = result.distance;
                            best = {
                                distance: min,
                                x0: x0, y0: y0,
                                x1: result.x, y1: result.y
                            };
                        }
                    }
                }
            }
            if(!details) {
                best = best.distance;
            }
            if(min !== 0) {
                // check the final vertex in this line's sorted segments
                if(seg0) {
                    result = geometry.distanceTo(
                        new OpenLayers.Geometry.Point(seg0.x2, seg0.y2),
                        options
                    );
                    var dist = details ? result.distance : result;
                    if(dist < min) {
                        if(details) {
                            best = {
                                distance: min,
                                x0: result.x1, y0: result.y1,
                                x1: result.x0, y1: result.y0
                            };
                        } else {
                            best = dist;
                        }
                    }
                }
            }
        } else {
            best = geometry.distanceTo(this, options);
            // swap since target comes from this line
            if(details) {
                best = {
                    distance: best.distance,
                    x0: best.x1, y0: best.y1,
                    x1: best.x0, y1: best.y0
                };
            }
        }
        return best;
    },
    
    /**
     * APIMethod: simplify
     * This function will return a simplified LineString.
     * Simplification is based on the Douglas-Peucker algorithm.
     *
     *
     * Parameters:
     * tolerance - {number} threshhold for simplification in map units
     *
     * Returns:
     * {OpenLayers.Geometry.LineString} the simplified LineString
     */
    simplify: function(tolerance){
        if (this && this !== null) {
            var points = this.getVertices();
            if (points.length < 3) {
                return this;
            }
    
            var compareNumbers = function(a, b){
                return (a-b);
            };
    
            /**
             * Private function doing the Douglas-Peucker reduction
             */
            var douglasPeuckerReduction = function(points, firstPoint, lastPoint, tolerance){
                var maxDistance = 0;
                var indexFarthest = 0;
    
                for (var index = firstPoint, distance; index < lastPoint; index++) {
                    distance = perpendicularDistance(points[firstPoint], points[lastPoint], points[index]);
                    if (distance > maxDistance) {
                        maxDistance = distance;
                        indexFarthest = index;
                    }
                }
    
                if (maxDistance > tolerance && indexFarthest != firstPoint) {
                    //Add the largest point that exceeds the tolerance
                    pointIndexsToKeep.push(indexFarthest);
                    douglasPeuckerReduction(points, firstPoint, indexFarthest, tolerance);
                    douglasPeuckerReduction(points, indexFarthest, lastPoint, tolerance);
                }
            };
    
            /**
             * Private function calculating the perpendicular distance
             * TODO: check whether OpenLayers.Geometry.LineString::distanceTo() is faster or slower
             */
            var perpendicularDistance = function(point1, point2, point){
                //Area = |(1/2)(x1y2 + x2y3 + x3y1 - x2y1 - x3y2 - x1y3)|   *Area of triangle
                //Base = v((x1-x2)²+(x1-x2)²)                               *Base of Triangle*
                //Area = .5*Base*H                                          *Solve for height
                //Height = Area/.5/Base
    
                var area = Math.abs(0.5 * (point1.x * point2.y + point2.x * point.y + point.x * point1.y - point2.x * point1.y - point.x * point2.y - point1.x * point.y));
                var bottom = Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
                var height = area / bottom * 2;
    
                return height;
            };
    
            var firstPoint = 0;
            var lastPoint = points.length - 1;
            var pointIndexsToKeep = [];
    
            //Add the first and last index to the keepers
            pointIndexsToKeep.push(firstPoint);
            pointIndexsToKeep.push(lastPoint);
    
            //The first and the last point cannot be the same
            while (points[firstPoint].equals(points[lastPoint])) {
                lastPoint--;
                //Addition: the first point not equal to first point in the LineString is kept as well
                pointIndexsToKeep.push(lastPoint);
            }
    
            douglasPeuckerReduction(points, firstPoint, lastPoint, tolerance);
            var returnPoints = [];
            pointIndexsToKeep.sort(compareNumbers);
            for (var index = 0; index < pointIndexsToKeep.length; index++) {
                returnPoints.push(points[pointIndexsToKeep[index]]);
            }
            return new OpenLayers.Geometry.LineString(returnPoints);
    
        }
        else {
            return this;
        }
    },

    CLASS_NAME: "OpenLayers.Geometry.LineString"
});
/* ======================================================================
    OpenLayers/Geometry/LinearRing.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Geometry/LineString.js
 */

/**
 * Class: OpenLayers.Geometry.LinearRing
 * 
 * A Linear Ring is a special LineString which is closed. It closes itself 
 * automatically on every addPoint/removePoint by adding a copy of the first
 * point as the last point. 
 * 
 * Also, as it is the first in the line family to close itself, a getArea()
 * function is defined to calculate the enclosed area of the linearRing
 * 
 * Inherits:
 *  - <OpenLayers.Geometry.LineString>
 */
OpenLayers.Geometry.LinearRing = OpenLayers.Class(
  OpenLayers.Geometry.LineString, {

    /**
     * Property: componentTypes
     * {Array(String)} An array of class names representing the types of 
     *                 components that the collection can include.  A null 
     *                 value means the component types are not restricted.
     */
    componentTypes: ["OpenLayers.Geometry.Point"],

    /**
     * Constructor: OpenLayers.Geometry.LinearRing
     * Linear rings are constructed with an array of points.  This array
     *     can represent a closed or open ring.  If the ring is open (the last
     *     point does not equal the first point), the constructor will close
     *     the ring.  If the ring is already closed (the last point does equal
     *     the first point), it will be left closed.
     * 
     * Parameters:
     * points - {Array(<OpenLayers.Geometry.Point>)} points
     */

    /**
     * APIMethod: addComponent
     * Adds a point to geometry components.  If the point is to be added to
     *     the end of the components array and it is the same as the last point
     *     already in that array, the duplicate point is not added.  This has 
     *     the effect of closing the ring if it is not already closed, and 
     *     doing the right thing if it is already closed.  This behavior can 
     *     be overridden by calling the method with a non-null index as the 
     *     second argument.
     *
     * Parameters:
     * point - {<OpenLayers.Geometry.Point>}
     * index - {Integer} Index into the array to insert the component
     * 
     * Returns:
     * {Boolean} Was the Point successfully added?
     */
    addComponent: function(point, index) {
        var added = false;

        //remove last point
        var lastPoint = this.components.pop();

        // given an index, add the point
        // without an index only add non-duplicate points
        if(index != null || !point.equals(lastPoint)) {
            added = OpenLayers.Geometry.Collection.prototype.addComponent.apply(this, 
                                                                    arguments);
        }

        //append copy of first point
        var firstPoint = this.components[0];
        OpenLayers.Geometry.Collection.prototype.addComponent.apply(this, 
                                                                [firstPoint]);
        
        return added;
    },
    
    /**
     * APIMethod: removeComponent
     * Removes a point from geometry components.
     *
     * Parameters:
     * point - {<OpenLayers.Geometry.Point>}
     *
     * Returns: 
     * {Boolean} The component was removed.
     */
    removeComponent: function(point) {
        var removed = this.components && (this.components.length > 3);
        if (removed) {
            //remove last point
            this.components.pop();
            
            //remove our point
            OpenLayers.Geometry.Collection.prototype.removeComponent.apply(this, 
                                                                    arguments);
            //append copy of first point
            var firstPoint = this.components[0];
            OpenLayers.Geometry.Collection.prototype.addComponent.apply(this, 
                                                                [firstPoint]);
        }
        return removed;
    },
    
    /**
     * APIMethod: move
     * Moves a geometry by the given displacement along positive x and y axes.
     *     This modifies the position of the geometry and clears the cached
     *     bounds.
     *
     * Parameters:
     * x - {Float} Distance to move geometry in positive x direction. 
     * y - {Float} Distance to move geometry in positive y direction.
     */
    move: function(x, y) {
        for(var i = 0, len=this.components.length; i<len - 1; i++) {
            this.components[i].move(x, y);
        }
    },

    /**
     * APIMethod: rotate
     * Rotate a geometry around some origin
     *
     * Parameters:
     * angle - {Float} Rotation angle in degrees (measured counterclockwise
     *                 from the positive x-axis)
     * origin - {<OpenLayers.Geometry.Point>} Center point for the rotation
     */
    rotate: function(angle, origin) {
        for(var i=0, len=this.components.length; i<len - 1; ++i) {
            this.components[i].rotate(angle, origin);
        }
    },

    /**
     * APIMethod: resize
     * Resize a geometry relative to some origin.  Use this method to apply
     *     a uniform scaling to a geometry.
     *
     * Parameters:
     * scale - {Float} Factor by which to scale the geometry.  A scale of 2
     *                 doubles the size of the geometry in each dimension
     *                 (lines, for example, will be twice as long, and polygons
     *                 will have four times the area).
     * origin - {<OpenLayers.Geometry.Point>} Point of origin for resizing
     * ratio - {Float} Optional x:y ratio for resizing.  Default ratio is 1.
     * 
     * Returns:
     * {<OpenLayers.Geometry>} - The current geometry. 
     */
    resize: function(scale, origin, ratio) {
        for(var i=0, len=this.components.length; i<len - 1; ++i) {
            this.components[i].resize(scale, origin, ratio);
        }
        return this;
    },
    
    /**
     * APIMethod: transform
     * Reproject the components geometry from source to dest.
     *
     * Parameters:
     * source - {<OpenLayers.Projection>}
     * dest - {<OpenLayers.Projection>}
     * 
     * Returns:
     * {<OpenLayers.Geometry>} 
     */
    transform: function(source, dest) {
        if (source && dest) {
            for (var i=0, len=this.components.length; i<len - 1; i++) {
                var component = this.components[i];
                component.transform(source, dest);
            }
            this.bounds = null;
        }
        return this;
    },
    
    /**
     * APIMethod: getCentroid
     *
     * Returns:
     * {<OpenLayers.Geometry.Point>} The centroid of the collection
     */
    getCentroid: function() {
        if (this.components) {
            var len = this.components.length;
            if (len > 0 && len <= 2) {
                return this.components[0].clone();
            } else if (len > 2) {
                var sumX = 0.0;
                var sumY = 0.0;
                var x0 = this.components[0].x;
                var y0 = this.components[0].y;
                var area = -1 * this.getArea();
                if (area != 0) {
                    for (var i = 0; i < len - 1; i++) {
                        var b = this.components[i];
                        var c = this.components[i+1];
                        sumX += (b.x + c.x - 2 * x0) * ((b.x - x0) * (c.y - y0) - (c.x - x0) * (b.y - y0));
                        sumY += (b.y + c.y - 2 * y0) * ((b.x - x0) * (c.y - y0) - (c.x - x0) * (b.y - y0));
                    }
                    var x = x0 + sumX / (6 * area);
                    var y = y0 + sumY / (6 * area);
                } else {
                    for (var i = 0; i < len - 1; i++) {
                        sumX += this.components[i].x;
                        sumY += this.components[i].y;
                    }
                    var x = sumX / (len - 1);
                    var y = sumY / (len - 1);
                }
                return new OpenLayers.Geometry.Point(x, y);
            } else {
                return null;
            }
        }
    },

    /**
     * APIMethod: getArea
     * Note - The area is positive if the ring is oriented CW, otherwise
     *         it will be negative.
     * 
     * Returns:
     * {Float} The signed area for a ring.
     */
    getArea: function() {
        var area = 0.0;
        if ( this.components && (this.components.length > 2)) {
            var sum = 0.0;
            for (var i=0, len=this.components.length; i<len - 1; i++) {
                var b = this.components[i];
                var c = this.components[i+1];
                sum += (b.x + c.x) * (c.y - b.y);
            }
            area = - sum / 2.0;
        }
        return area;
    },
    
    /**
     * APIMethod: getGeodesicArea
     * Calculate the approximate area of the polygon were it projected onto
     *     the earth.  Note that this area will be positive if ring is oriented
     *     clockwise, otherwise it will be negative.
     *
     * Parameters:
     * projection - {<OpenLayers.Projection>} The spatial reference system
     *     for the geometry coordinates.  If not provided, Geographic/WGS84 is
     *     assumed.
     * 
     * Reference:
     * Robert. G. Chamberlain and William H. Duquette, "Some Algorithms for
     *     Polygons on a Sphere", JPL Publication 07-03, Jet Propulsion
     *     Laboratory, Pasadena, CA, June 2007 http://trs-new.jpl.nasa.gov/dspace/handle/2014/40409
     *
     * Returns:
     * {float} The approximate signed geodesic area of the polygon in square
     *     meters.
     */
    getGeodesicArea: function(projection) {
        var ring = this;  // so we can work with a clone if needed
        if(projection) {
            var gg = new OpenLayers.Projection("EPSG:4326");
            if(!gg.equals(projection)) {
                ring = this.clone().transform(projection, gg);
            }
        }
        var area = 0.0;
        var len = ring.components && ring.components.length;
        if(len > 2) {
            var p1, p2;
            for(var i=0; i<len-1; i++) {
                p1 = ring.components[i];
                p2 = ring.components[i+1];
                area += OpenLayers.Util.rad(p2.x - p1.x) *
                        (2 + Math.sin(OpenLayers.Util.rad(p1.y)) +
                        Math.sin(OpenLayers.Util.rad(p2.y)));
            }
            area = area * 6378137.0 * 6378137.0 / 2.0;
        }
        return area;
    },
    
    /**
     * Method: containsPoint
     * Test if a point is inside a linear ring.  For the case where a point
     *     is coincident with a linear ring edge, returns 1.  Otherwise,
     *     returns boolean.
     *
     * Parameters:
     * point - {<OpenLayers.Geometry.Point>}
     *
     * Returns:
     * {Boolean | Number} The point is inside the linear ring.  Returns 1 if
     *     the point is coincident with an edge.  Returns boolean otherwise.
     */
    containsPoint: function(point) {
        var approx = OpenLayers.Number.limitSigDigs;
        var digs = 14;
        var px = approx(point.x, digs);
        var py = approx(point.y, digs);
        function getX(y, x1, y1, x2, y2) {
            return (y - y2) * ((x2 - x1) / (y2 - y1)) + x2;
        }
        var numSeg = this.components.length - 1;
        var start, end, x1, y1, x2, y2, cx, cy;
        var crosses = 0;
        for(var i=0; i<numSeg; ++i) {
            start = this.components[i];
            x1 = approx(start.x, digs);
            y1 = approx(start.y, digs);
            end = this.components[i + 1];
            x2 = approx(end.x, digs);
            y2 = approx(end.y, digs);
            
            /**
             * The following conditions enforce five edge-crossing rules:
             *    1. points coincident with edges are considered contained;
             *    2. an upward edge includes its starting endpoint, and
             *    excludes its final endpoint;
             *    3. a downward edge excludes its starting endpoint, and
             *    includes its final endpoint;
             *    4. horizontal edges are excluded; and
             *    5. the edge-ray intersection point must be strictly right
             *    of the point P.
             */
            if(y1 == y2) {
                // horizontal edge
                if(py == y1) {
                    // point on horizontal line
                    if(x1 <= x2 && (px >= x1 && px <= x2) || // right or vert
                       x1 >= x2 && (px <= x1 && px >= x2)) { // left or vert
                        // point on edge
                        crosses = -1;
                        break;
                    }
                }
                // ignore other horizontal edges
                continue;
            }
            cx = approx(getX(py, x1, y1, x2, y2), digs);
            if(cx == px) {
                // point on line
                if(y1 < y2 && (py >= y1 && py <= y2) || // upward
                   y1 > y2 && (py <= y1 && py >= y2)) { // downward
                    // point on edge
                    crosses = -1;
                    break;
                }
            }
            if(cx <= px) {
                // no crossing to the right
                continue;
            }
            if(x1 != x2 && (cx < Math.min(x1, x2) || cx > Math.max(x1, x2))) {
                // no crossing
                continue;
            }
            if(y1 < y2 && (py >= y1 && py < y2) || // upward
               y1 > y2 && (py < y1 && py >= y2)) { // downward
                ++crosses;
            }
        }
        var contained = (crosses == -1) ?
            // on edge
            1 :
            // even (out) or odd (in)
            !!(crosses & 1);

        return contained;
    },

    /**
     * APIMethod: intersects
     * Determine if the input geometry intersects this one.
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} Any type of geometry.
     *
     * Returns:
     * {Boolean} The input geometry intersects this one.
     */
    intersects: function(geometry) {
        var intersect = false;
        if(geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
            intersect = this.containsPoint(geometry);
        } else if(geometry.CLASS_NAME == "OpenLayers.Geometry.LineString") {
            intersect = geometry.intersects(this);
        } else if(geometry.CLASS_NAME == "OpenLayers.Geometry.LinearRing") {
            intersect = OpenLayers.Geometry.LineString.prototype.intersects.apply(
                this, [geometry]
            );
        } else {
            // check for component intersections
            for(var i=0, len=geometry.components.length; i<len; ++ i) {
                intersect = geometry.components[i].intersects(this);
                if(intersect) {
                    break;
                }
            }
        }
        return intersect;
    },

    /**
     * APIMethod: getVertices
     * Return a list of all points in this geometry.
     *
     * Parameters:
     * nodes - {Boolean} For lines, only return vertices that are
     *     endpoints.  If false, for lines, only vertices that are not
     *     endpoints will be returned.  If not provided, all vertices will
     *     be returned.
     *
     * Returns:
     * {Array} A list of all vertices in the geometry.
     */
    getVertices: function(nodes) {
        return (nodes === true) ? [] : this.components.slice(0, this.components.length-1);
    },

    CLASS_NAME: "OpenLayers.Geometry.LinearRing"
});
/* ======================================================================
    OpenLayers/Geometry/Polygon.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Geometry/Collection.js
 * @requires OpenLayers/Geometry/LinearRing.js
 */

/**
 * Class: OpenLayers.Geometry.Polygon 
 * Polygon is a collection of Geometry.LinearRings. 
 * 
 * Inherits from:
 *  - <OpenLayers.Geometry.Collection> 
 *  - <OpenLayers.Geometry> 
 */
OpenLayers.Geometry.Polygon = OpenLayers.Class(
  OpenLayers.Geometry.Collection, {

    /**
     * Property: componentTypes
     * {Array(String)} An array of class names representing the types of
     * components that the collection can include.  A null value means the
     * component types are not restricted.
     */
    componentTypes: ["OpenLayers.Geometry.LinearRing"],

    /**
     * Constructor: OpenLayers.Geometry.Polygon
     * Constructor for a Polygon geometry. 
     * The first ring (this.component[0])is the outer bounds of the polygon and 
     * all subsequent rings (this.component[1-n]) are internal holes.
     *
     *
     * Parameters:
     * components - {Array(<OpenLayers.Geometry.LinearRing>)} 
     */

    /** 
     * APIMethod: getArea
     * Calculated by subtracting the areas of the internal holes from the 
     *   area of the outer hole.
     * 
     * Returns:
     * {float} The area of the geometry
     */
    getArea: function() {
        var area = 0.0;
        if ( this.components && (this.components.length > 0)) {
            area += Math.abs(this.components[0].getArea());
            for (var i=1, len=this.components.length; i<len; i++) {
                area -= Math.abs(this.components[i].getArea());
            }
        }
        return area;
    },

    /** 
     * APIMethod: getGeodesicArea
     * Calculate the approximate area of the polygon were it projected onto
     *     the earth.
     *
     * Parameters:
     * projection - {<OpenLayers.Projection>} The spatial reference system
     *     for the geometry coordinates.  If not provided, Geographic/WGS84 is
     *     assumed.
     * 
     * Reference:
     * Robert. G. Chamberlain and William H. Duquette, "Some Algorithms for
     *     Polygons on a Sphere", JPL Publication 07-03, Jet Propulsion
     *     Laboratory, Pasadena, CA, June 2007 http://trs-new.jpl.nasa.gov/dspace/handle/2014/40409
     *
     * Returns:
     * {float} The approximate geodesic area of the polygon in square meters.
     */
    getGeodesicArea: function(projection) {
        var area = 0.0;
        if(this.components && (this.components.length > 0)) {
            area += Math.abs(this.components[0].getGeodesicArea(projection));
            for(var i=1, len=this.components.length; i<len; i++) {
                area -= Math.abs(this.components[i].getGeodesicArea(projection));
            }
        }
        return area;
    },

    /**
     * Method: containsPoint
     * Test if a point is inside a polygon.  Points on a polygon edge are
     *     considered inside.
     *
     * Parameters:
     * point - {<OpenLayers.Geometry.Point>}
     *
     * Returns:
     * {Boolean | Number} The point is inside the polygon.  Returns 1 if the
     *     point is on an edge.  Returns boolean otherwise.
     */
    containsPoint: function(point) {
        var numRings = this.components.length;
        var contained = false;
        if(numRings > 0) {
            // check exterior ring - 1 means on edge, boolean otherwise
            contained = this.components[0].containsPoint(point);
            if(contained !== 1) {
                if(contained && numRings > 1) {
                    // check interior rings
                    var hole;
                    for(var i=1; i<numRings; ++i) {
                        hole = this.components[i].containsPoint(point);
                        if(hole) {
                            if(hole === 1) {
                                // on edge
                                contained = 1;
                            } else {
                                // in hole
                                contained = false;
                            }                            
                            break;
                        }
                    }
                }
            }
        }
        return contained;
    },

    /**
     * APIMethod: intersects
     * Determine if the input geometry intersects this one.
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} Any type of geometry.
     *
     * Returns:
     * {Boolean} The input geometry intersects this one.
     */
    intersects: function(geometry) {
        var intersect = false;
        var i, len;
        if(geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
            intersect = this.containsPoint(geometry);
        } else if(geometry.CLASS_NAME == "OpenLayers.Geometry.LineString" ||
                  geometry.CLASS_NAME == "OpenLayers.Geometry.LinearRing") {
            // check if rings/linestrings intersect
            for(i=0, len=this.components.length; i<len; ++i) {
                intersect = geometry.intersects(this.components[i]);
                if(intersect) {
                    break;
                }
            }
            if(!intersect) {
                // check if this poly contains points of the ring/linestring
                for(i=0, len=geometry.components.length; i<len; ++i) {
                    intersect = this.containsPoint(geometry.components[i]);
                    if(intersect) {
                        break;
                    }
                }
            }
        } else {
            for(i=0, len=geometry.components.length; i<len; ++ i) {
                intersect = this.intersects(geometry.components[i]);
                if(intersect) {
                    break;
                }
            }
        }
        // check case where this poly is wholly contained by another
        if(!intersect && geometry.CLASS_NAME == "OpenLayers.Geometry.Polygon") {
            // exterior ring points will be contained in the other geometry
            var ring = this.components[0];
            for(i=0, len=ring.components.length; i<len; ++i) {
                intersect = geometry.containsPoint(ring.components[i]);
                if(intersect) {
                    break;
                }
            }
        }
        return intersect;
    },

    /**
     * APIMethod: distanceTo
     * Calculate the closest distance between two geometries (on the x-y plane).
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} The target geometry.
     * options - {Object} Optional properties for configuring the distance
     *     calculation.
     *
     * Valid options:
     * details - {Boolean} Return details from the distance calculation.
     *     Default is false.
     * edge - {Boolean} Calculate the distance from this geometry to the
     *     nearest edge of the target geometry.  Default is true.  If true,
     *     calling distanceTo from a geometry that is wholly contained within
     *     the target will result in a non-zero distance.  If false, whenever
     *     geometries intersect, calling distanceTo will return 0.  If false,
     *     details cannot be returned.
     *
     * Returns:
     * {Number | Object} The distance between this geometry and the target.
     *     If details is true, the return will be an object with distance,
     *     x0, y0, x1, and y1 properties.  The x0 and y0 properties represent
     *     the coordinates of the closest point on this geometry. The x1 and y1
     *     properties represent the coordinates of the closest point on the
     *     target geometry.
     */
    distanceTo: function(geometry, options) {
        var edge = !(options && options.edge === false);
        var result;
        // this is the case where we might not be looking for distance to edge
        if(!edge && this.intersects(geometry)) {
            result = 0;
        } else {
            result = OpenLayers.Geometry.Collection.prototype.distanceTo.apply(
                this, [geometry, options]
            );
        }
        return result;
    },

    CLASS_NAME: "OpenLayers.Geometry.Polygon"
});

/**
 * APIMethod: createRegularPolygon
 * Create a regular polygon around a radius. Useful for creating circles 
 * and the like.
 *
 * Parameters:
 * origin - {<OpenLayers.Geometry.Point>} center of polygon.
 * radius - {Float} distance to vertex, in map units.
 * sides - {Integer} Number of sides. 20 approximates a circle.
 * rotation - {Float} original angle of rotation, in degrees.
 */
OpenLayers.Geometry.Polygon.createRegularPolygon = function(origin, radius, sides, rotation) {  
    var angle = Math.PI * ((1/sides) - (1/2));
    if(rotation) {
        angle += (rotation / 180) * Math.PI;
    }
    var rotatedAngle, x, y;
    var points = [];
    for(var i=0; i<sides; ++i) {
        rotatedAngle = angle + (i * 2 * Math.PI / sides);
        x = origin.x + (radius * Math.cos(rotatedAngle));
        y = origin.y + (radius * Math.sin(rotatedAngle));
        points.push(new OpenLayers.Geometry.Point(x, y));
    }
    var ring = new OpenLayers.Geometry.LinearRing(points);
    return new OpenLayers.Geometry.Polygon([ring]);
};
/* ======================================================================
    OpenLayers/Events.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


/**
 * @requires OpenLayers/Util.js
 */

/**
 * Namespace: OpenLayers.Event
 * Utility functions for event handling.
 */
OpenLayers.Event = {

    /** 
     * Property: observers 
     * {Object} A hashtable cache of the event observers. Keyed by
     * element._eventCacheID 
     */
    observers: false,

    /**
     * Constant: KEY_SPACE
     * {int}
     */
    KEY_SPACE: 32,
    
    /** 
     * Constant: KEY_BACKSPACE 
     * {int} 
     */
    KEY_BACKSPACE: 8,

    /** 
     * Constant: KEY_TAB 
     * {int} 
     */
    KEY_TAB: 9,

    /** 
     * Constant: KEY_RETURN 
     * {int} 
     */
    KEY_RETURN: 13,

    /** 
     * Constant: KEY_ESC 
     * {int} 
     */
    KEY_ESC: 27,

    /** 
     * Constant: KEY_LEFT 
     * {int} 
     */
    KEY_LEFT: 37,

    /** 
     * Constant: KEY_UP 
     * {int} 
     */
    KEY_UP: 38,

    /** 
     * Constant: KEY_RIGHT 
     * {int} 
     */
    KEY_RIGHT: 39,

    /** 
     * Constant: KEY_DOWN 
     * {int} 
     */
    KEY_DOWN: 40,

    /** 
     * Constant: KEY_DELETE 
     * {int} 
     */
    KEY_DELETE: 46,


    /**
     * Method: element
     * Cross browser event element detection.
     * 
     * Parameters:
     * event - {Event} 
     * 
     * Returns:
     * {DOMElement} The element that caused the event 
     */
    element: function(event) {
        return event.target || event.srcElement;
    },

    /**
     * Method: isSingleTouch
     * Determine whether event was caused by a single touch
     *
     * Parameters:
     * event - {Event}
     *
     * Returns:
     * {Boolean}
     */
    isSingleTouch: function(event) {
        return event.touches && event.touches.length == 1;
    },

    /**
     * Method: isMultiTouch
     * Determine whether event was caused by a multi touch
     *
     * Parameters:
     * event - {Event}
     *
     * Returns:
     * {Boolean}
     */
    isMultiTouch: function(event) {
        return event.touches && event.touches.length > 1;
    },

    /**
     * Method: isLeftClick
     * Determine whether event was caused by a left click. 
     *
     * Parameters:
     * event - {Event} 
     * 
     * Returns:
     * {Boolean}
     */
    isLeftClick: function(event) {
        return (((event.which) && (event.which == 1)) ||
                ((event.button) && (event.button == 1)));
    },

    /**
     * Method: isRightClick
     * Determine whether event was caused by a right mouse click. 
     *
     * Parameters:
     * event - {Event} 
     * 
     * Returns:
     * {Boolean}
     */
     isRightClick: function(event) {
        return (((event.which) && (event.which == 3)) ||
                ((event.button) && (event.button == 2)));
    },
     
    /**
     * Method: stop
     * Stops an event from propagating. 
     *
     * Parameters: 
     * event - {Event} 
     * allowDefault - {Boolean} If true, we stop the event chain but 
     *     still allow the default browser behaviour (text selection,
     *     radio-button clicking, etc).  Default is false.
     */
    stop: function(event, allowDefault) {
        
        if (!allowDefault) { 
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        }
                
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    },

    /** 
     * Method: findElement
     * 
     * Parameters:
     * event - {Event} 
     * tagName - {String} 
     * 
     * Returns:
     * {DOMElement} The first node with the given tagName, starting from the
     * node the event was triggered on and traversing the DOM upwards
     */
    findElement: function(event, tagName) {
        var element = OpenLayers.Event.element(event);
        while (element.parentNode && (!element.tagName ||
              (element.tagName.toUpperCase() != tagName.toUpperCase()))){
            element = element.parentNode;
        }
        return element;
    },

    /** 
     * Method: observe
     * 
     * Parameters:
     * elementParam - {DOMElement || String} 
     * name - {String} 
     * observer - {function} 
     * useCapture - {Boolean} 
     */
    observe: function(elementParam, name, observer, useCapture) {
        var element = OpenLayers.Util.getElement(elementParam);
        useCapture = useCapture || false;

        if (name == 'keypress' &&
           (navigator.appVersion.match(/Konqueror|Safari|KHTML/)
           || element.attachEvent)) {
            name = 'keydown';
        }

        //if observers cache has not yet been created, create it
        if (!this.observers) {
            this.observers = {};
        }

        //if not already assigned, make a new unique cache ID
        if (!element._eventCacheID) {
            var idPrefix = "eventCacheID_";
            if (element.id) {
                idPrefix = element.id + "_" + idPrefix;
            }
            element._eventCacheID = OpenLayers.Util.createUniqueID(idPrefix);
        }

        var cacheID = element._eventCacheID;

        //if there is not yet a hash entry for this element, add one
        if (!this.observers[cacheID]) {
            this.observers[cacheID] = [];
        }

        //add a new observer to this element's list
        this.observers[cacheID].push({
            'element': element,
            'name': name,
            'observer': observer,
            'useCapture': useCapture
        });

        //add the actual browser event listener
        if (element.addEventListener) {
            element.addEventListener(name, observer, useCapture);
        } else if (element.attachEvent) {
            element.attachEvent('on' + name, observer);
        }
    },

    /** 
     * Method: stopObservingElement
     * Given the id of an element to stop observing, cycle through the 
     *   element's cached observers, calling stopObserving on each one, 
     *   skipping those entries which can no longer be removed.
     * 
     * parameters:
     * elementParam - {DOMElement || String} 
     */
    stopObservingElement: function(elementParam) {
        var element = OpenLayers.Util.getElement(elementParam);
        var cacheID = element._eventCacheID;

        this._removeElementObservers(OpenLayers.Event.observers[cacheID]);
    },

    /**
     * Method: _removeElementObservers
     *
     * Parameters:
     * elementObservers - {Array(Object)} Array of (element, name, 
     *                                         observer, usecapture) objects, 
     *                                         taken directly from hashtable
     */
    _removeElementObservers: function(elementObservers) {
        if (elementObservers) {
            for(var i = elementObservers.length-1; i >= 0; i--) {
                var entry = elementObservers[i];
                OpenLayers.Event.stopObserving.apply(this, [
                    entry.element, entry.name, entry.observer, entry.useCapture
                ]);
            }
        }
    },

    /**
     * Method: stopObserving
     * 
     * Parameters:
     * elementParam - {DOMElement || String} 
     * name - {String} 
     * observer - {function} 
     * useCapture - {Boolean} 
     *  
     * Returns:
     * {Boolean} Whether or not the event observer was removed
     */
    stopObserving: function(elementParam, name, observer, useCapture) {
        useCapture = useCapture || false;
    
        var element = OpenLayers.Util.getElement(elementParam);
        var cacheID = element._eventCacheID;

        if (name == 'keypress') {
            if ( navigator.appVersion.match(/Konqueror|Safari|KHTML/) || 
                 element.detachEvent) {
              name = 'keydown';
            }
        }

        // find element's entry in this.observers cache and remove it
        var foundEntry = false;
        var elementObservers = OpenLayers.Event.observers[cacheID];
        if (elementObservers) {
    
            // find the specific event type in the element's list
            var i=0;
            while(!foundEntry && i < elementObservers.length) {
                var cacheEntry = elementObservers[i];
    
                if ((cacheEntry.name == name) &&
                    (cacheEntry.observer == observer) &&
                    (cacheEntry.useCapture == useCapture)) {
    
                    elementObservers.splice(i, 1);
                    if (elementObservers.length == 0) {
                        delete OpenLayers.Event.observers[cacheID];
                    }
                    foundEntry = true;
                    break; 
                }
                i++;           
            }
        }
    
        //actually remove the event listener from browser
        if (foundEntry) {
            if (element.removeEventListener) {
                element.removeEventListener(name, observer, useCapture);
            } else if (element && element.detachEvent) {
                element.detachEvent('on' + name, observer);
            }
        }
        return foundEntry;
    },
    
    /** 
     * Method: unloadCache
     * Cycle through all the element entries in the events cache and call
     *   stopObservingElement on each. 
     */
    unloadCache: function() {
        // check for OpenLayers.Event before checking for observers, because
        // OpenLayers.Event may be undefined in IE if no map instance was
        // created
        if (OpenLayers.Event && OpenLayers.Event.observers) {
            for (var cacheID in OpenLayers.Event.observers) {
                var elementObservers = OpenLayers.Event.observers[cacheID];
                OpenLayers.Event._removeElementObservers.apply(this, 
                                                           [elementObservers]);
            }
            OpenLayers.Event.observers = false;
        }
    },

    CLASS_NAME: "OpenLayers.Event"
};

/* prevent memory leaks in IE */
OpenLayers.Event.observe(window, 'unload', OpenLayers.Event.unloadCache, false);

/**
 * Class: OpenLayers.Events
 */
OpenLayers.Events = OpenLayers.Class({

    /** 
     * Constant: BROWSER_EVENTS
     * {Array(String)} supported events 
     */
    BROWSER_EVENTS: [
        "mouseover", "mouseout",
        "mousedown", "mouseup", "mousemove", 
        "click", "dblclick", "rightclick", "dblrightclick",
        "resize", "focus", "blur",
        "touchstart", "touchmove", "touchend",
        "keydown"
    ],

    /** 
     * Property: listeners 
     * {Object} Hashtable of Array(Function): events listener functions  
     */
    listeners: null,

    /** 
     * Property: object 
     * {Object}  the code object issuing application events 
     */
    object: null,

    /** 
     * Property: element 
     * {DOMElement}  the DOM element receiving browser events 
     */
    element: null,

    /** 
     * Property: eventHandler 
     * {Function}  bound event handler attached to elements 
     */
    eventHandler: null,

    /** 
     * APIProperty: fallThrough 
     * {Boolean} 
     */
    fallThrough: null,

    /** 
     * APIProperty: includeXY
     * {Boolean} Should the .xy property automatically be created for browser
     *    mouse events? In general, this should be false. If it is true, then
     *    mouse events will automatically generate a '.xy' property on the 
     *    event object that is passed. (Prior to OpenLayers 2.7, this was true
     *    by default.) Otherwise, you can call the getMousePosition on the
     *    relevant events handler on the object available via the 'evt.object'
     *    property of the evt object. So, for most events, you can call:
     *    function named(evt) { 
     *        this.xy = this.object.events.getMousePosition(evt) 
     *    } 
     *
     *    This option typically defaults to false for performance reasons:
     *    when creating an events object whose primary purpose is to manage
     *    relatively positioned mouse events within a div, it may make
     *    sense to set it to true.
     *
     *    This option is also used to control whether the events object caches
     *    offsets. If this is false, it will not: the reason for this is that
     *    it is only expected to be called many times if the includeXY property
     *    is set to true. If you set this to true, you are expected to clear 
     *    the offset cache manually (using this.clearMouseCache()) if:
     *        the border of the element changes
     *        the location of the element in the page changes
    */
    includeXY: false,      
    
    /**
     * APIProperty: extensions
     * {Object} Event extensions registered with this instance. Keys are
     *     event types, values are {OpenLayers.Events.*} extension instances or
     *     {Boolean} for events that an instantiated extension provides in
     *     addition to the one it was created for.
     *
     * Extensions create an event in addition to browser events, which usually
     * fires when a sequence of browser events is completed. Extensions are
     * automatically instantiated when a listener is registered for an event
     * provided by an extension.
     *
     * Extensions are created in the <OpenLayers.Events> namespace using
     * <OpenLayers.Class>, and named after the event they provide.
     * The constructor receives the target <OpenLayers.Events> instance as
     * argument. Extensions that need to capture browser events before they
     * propagate can register their listeners events using <register>, with
     * {extension: true} as 4th argument.
     *
     * If an extension creates more than one event, an alias for each event
     * type should be created and reference the same class. The constructor
     * should set a reference in the target's extensions registry to itself.
     *
     * Below is a minimal extension that provides the "foostart" and "fooend"
     * event types, which replace the native "click" event type if clicked on
     * an element with the css class "foo":
     *
     * (code)
     *   OpenLayers.Events.foostart = OpenLayers.Class({
     *       initialize: function(target) {
     *           this.target = target;
     *           this.target.register("click", this, this.doStuff, {extension: true});
     *           // only required if extension provides more than one event type
     *           this.target.extensions["foostart"] = true;
     *           this.target.extensions["fooend"] = true;
     *       },
     *       destroy: function() {
     *           var target = this.target;
     *           target.unregister("click", this, this.doStuff);
     *           delete this.target;
     *           // only required if extension provides more than one event type
     *           delete target.extensions["foostart"];
     *           delete target.extensions["fooend"];
     *       },
     *       doStuff: function(evt) {
     *           var propagate = true;
     *           if (OpenLayers.Event.element(evt).className === "foo") {
     *               propagate = false;
     *               var target = this.target;
     *               target.triggerEvent("foostart");
     *               window.setTimeout(function() {
     *                   target.triggerEvent("fooend");
     *               }, 1000);
     *           }
     *           return propagate;
     *       }
     *   });
     *   // only required if extension provides more than one event type
     *   OpenLayers.Events.fooend = OpenLayers.Events.foostart;
     * (end)
     * 
     */
    extensions: null,
    
    /**
     * Property: extensionCount
     * {Object} Keys are event types (like in <listeners>), values are the
     *     number of extension listeners for each event type.
     */
    extensionCount: null,

    /**
     * Method: clearMouseListener
     * A version of <clearMouseCache> that is bound to this instance so that
     *     it can be used with <OpenLayers.Event.observe> and
     *     <OpenLayers.Event.stopObserving>.
     */
    clearMouseListener: null,

    /**
     * Constructor: OpenLayers.Events
     * Construct an OpenLayers.Events object.
     *
     * Parameters:
     * object - {Object} The js object to which this Events object  is being added
     * element - {DOMElement} A dom element to respond to browser events
     * eventTypes - {Array(String)} Deprecated.  Array of custom application
     *     events.  A listener may be registered for any named event, regardless
     *     of the values provided here.
     * fallThrough - {Boolean} Allow events to fall through after these have
     *                         been handled?
     * options - {Object} Options for the events object.
     */
    initialize: function (object, element, eventTypes, fallThrough, options) {
        OpenLayers.Util.extend(this, options);
        this.object     = object;
        this.fallThrough = fallThrough;
        this.listeners  = {};
        this.extensions = {};
        this.extensionCount = {};
        
        // if a dom element is specified, add a listeners list 
        // for browser events on the element and register them
        if (element != null) {
            this.attachToElement(element);
        }
    },

    /**
     * APIMethod: destroy
     */
    destroy: function () {
        for (var e in this.extensions) {
            if (typeof this.extensions[e] !== "boolean") {
                this.extensions[e].destroy();
            }
        }
        this.extensions = null;
        if (this.element) {
            OpenLayers.Event.stopObservingElement(this.element);
            if(this.element.hasScrollEvent) {
                OpenLayers.Event.stopObserving(
                    window, "scroll", this.clearMouseListener
                );
            }
        }
        this.element = null;

        this.listeners = null;
        this.object = null;
        this.fallThrough = null;
        this.eventHandler = null;
    },

    /**
     * APIMethod: addEventType
     * Deprecated.  Any event can be triggered without adding it first.
     * 
     * Parameters:
     * eventName - {String}
     */
    addEventType: function(eventName) {
    },

    /**
     * Method: attachToElement
     *
     * Parameters:
     * element - {HTMLDOMElement} a DOM element to attach browser events to
     */
    attachToElement: function (element) {
        if (this.element) {
            OpenLayers.Event.stopObservingElement(this.element);
        } else {
            // keep a bound copy of handleBrowserEvent() so that we can
            // pass the same function to both Event.observe() and .stopObserving()
            this.eventHandler = OpenLayers.Function.bindAsEventListener(
                this.handleBrowserEvent, this
            );
            
            // to be used with observe and stopObserving
            this.clearMouseListener = OpenLayers.Function.bind(
                this.clearMouseCache, this
            );
        }
        this.element = element;
        for (var i = 0, len = this.BROWSER_EVENTS.length; i < len; i++) {
            // register the event cross-browser
            OpenLayers.Event.observe(
                element, this.BROWSER_EVENTS[i], this.eventHandler
            );
        }
        // disable dragstart in IE so that mousedown/move/up works normally
        OpenLayers.Event.observe(element, "dragstart", OpenLayers.Event.stop);
    },
    
    /**
     * APIMethod: on
     * Convenience method for registering listeners with a common scope.
     *     Internally, this method calls <register> as shown in the examples
     *     below.
     *
     * Example use:
     * (code)
     * // register a single listener for the "loadstart" event
     * events.on({"loadstart": loadStartListener});
     *
     * // this is equivalent to the following
     * events.register("loadstart", undefined, loadStartListener);
     *
     * // register multiple listeners to be called with the same `this` object
     * events.on({
     *     "loadstart": loadStartListener,
     *     "loadend": loadEndListener,
     *     scope: object
     * });
     *
     * // this is equivalent to the following
     * events.register("loadstart", object, loadStartListener);
     * events.register("loadend", object, loadEndListener);
     * (end)
     *
     * Parameters:
     *  object - {Object}     
     */
    on: function(object) {
        for(var type in object) {
            if(type != "scope" && object.hasOwnProperty(type)) {
                this.register(type, object.scope, object[type]);
            }
        }
    },

    /**
     * APIMethod: register
     * Register an event on the events object.
     *
     * When the event is triggered, the 'func' function will be called, in the
     * context of 'obj'. Imagine we were to register an event, specifying an 
     * OpenLayers.Bounds Object as 'obj'. When the event is triggered, the 
     * context in the callback function will be our Bounds object. This means
     * that within our callback function, we can access the properties and 
     * methods of the Bounds object through the "this" variable. So our 
     * callback could execute something like: 
     * :    leftStr = "Left: " + this.left;
     *   
     *                   or
     *  
     * :    centerStr = "Center: " + this.getCenterLonLat();
     *
     * Parameters:
     * type - {String} Name of the event to register
     * obj - {Object} The object to bind the context to for the callback#.
     *     If no object is specified, default is the Events's 'object' property.
     * func - {Function} The callback function. If no callback is 
     *     specified, this function does nothing.
     * priority - {Boolean|Object} If true, adds the new listener to the
     *     *front* of the events queue instead of to the end.
     *
     * Valid options for priority:
     * extension - {Boolean} If true, then the event will be registered as
     *     extension event. Extension events are handled before all other
     *     events.
     */
    register: function (type, obj, func, priority) {
        if (type in OpenLayers.Events && !this.extensions[type]) {
            this.extensions[type] = new OpenLayers.Events[type](this);
        }
        if (func != null) {
            if (obj == null)  {
                obj = this.object;
            }
            var listeners = this.listeners[type];
            if (!listeners) {
                listeners = [];
                this.listeners[type] = listeners;
                this.extensionCount[type] = 0;
            }
            var listener = {obj: obj, func: func};
            if (priority) {
                listeners.splice(this.extensionCount[type], 0, listener);
                if (typeof priority === "object" && priority.extension) {
                    this.extensionCount[type]++;
                }
            } else {
                listeners.push(listener);
            }
        }
    },

    /**
     * APIMethod: registerPriority
     * Same as register() but adds the new listener to the *front* of the
     *     events queue instead of to the end.
     *    
     *     TODO: get rid of this in 3.0 - Decide whether listeners should be 
     *     called in the order they were registered or in reverse order.
     *
     *
     * Parameters:
     * type - {String} Name of the event to register
     * obj - {Object} The object to bind the context to for the callback#.
     *                If no object is specified, default is the Events's 
     *                'object' property.
     * func - {Function} The callback function. If no callback is 
     *                   specified, this function does nothing.
     */
    registerPriority: function (type, obj, func) {
        this.register(type, obj, func, true);
    },
    
    /**
     * APIMethod: un
     * Convenience method for unregistering listeners with a common scope.
     *     Internally, this method calls <unregister> as shown in the examples
     *     below.
     *
     * Example use:
     * (code)
     * // unregister a single listener for the "loadstart" event
     * events.un({"loadstart": loadStartListener});
     *
     * // this is equivalent to the following
     * events.unregister("loadstart", undefined, loadStartListener);
     *
     * // unregister multiple listeners with the same `this` object
     * events.un({
     *     "loadstart": loadStartListener,
     *     "loadend": loadEndListener,
     *     scope: object
     * });
     *
     * // this is equivalent to the following
     * events.unregister("loadstart", object, loadStartListener);
     * events.unregister("loadend", object, loadEndListener);
     * (end)
     */
    un: function(object) {
        for(var type in object) {
            if(type != "scope" && object.hasOwnProperty(type)) {
                this.unregister(type, object.scope, object[type]);
            }
        }
    },

    /**
     * APIMethod: unregister
     *
     * Parameters:
     * type - {String} 
     * obj - {Object} If none specified, defaults to this.object
     * func - {Function} 
     */
    unregister: function (type, obj, func) {
        if (obj == null)  {
            obj = this.object;
        }
        var listeners = this.listeners[type];
        if (listeners != null) {
            for (var i=0, len=listeners.length; i<len; i++) {
                if (listeners[i].obj == obj && listeners[i].func == func) {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    },

    /** 
     * Method: remove
     * Remove all listeners for a given event type. If type is not registered,
     *     does nothing.
     *
     * Parameters:
     * type - {String} 
     */
    remove: function(type) {
        if (this.listeners[type] != null) {
            this.listeners[type] = [];
        }
    },

    /**
     * APIMethod: triggerEvent
     * Trigger a specified registered event.  
     * 
     * Parameters:
     * type - {String} 
     * evt - {Event}
     *
     * Returns:
     * {Boolean} The last listener return.  If a listener returns false, the
     *     chain of listeners will stop getting called.
     */
    triggerEvent: function (type, evt) {
        var listeners = this.listeners[type];

        // fast path
        if(!listeners || listeners.length == 0) {
            return undefined;
        }

        // prep evt object with object & div references
        if (evt == null) {
            evt = {};
        }
        evt.object = this.object;
        evt.element = this.element;
        if(!evt.type) {
            evt.type = type;
        }
    
        // execute all callbacks registered for specified type
        // get a clone of the listeners array to
        // allow for splicing during callbacks
        listeners = listeners.slice();
        var continueChain;
        for (var i=0, len=listeners.length; i<len; i++) {
            var callback = listeners[i];
            // bind the context to callback.obj
            continueChain = callback.func.apply(callback.obj, [evt]);

            if ((continueChain != undefined) && (continueChain == false)) {
                // if callback returns false, execute no more callbacks.
                break;
            }
        }
        // don't fall through to other DOM elements
        if (!this.fallThrough) {           
            OpenLayers.Event.stop(evt, true);
        }
        return continueChain;
    },

    /**
     * Method: handleBrowserEvent
     * Basically just a wrapper to the triggerEvent() function, but takes 
     *     care to set a property 'xy' on the event with the current mouse 
     *     position.
     *
     * Parameters:
     * evt - {Event} 
     */
    handleBrowserEvent: function (evt) {
        var type = evt.type, listeners = this.listeners[type];
        if(!listeners || listeners.length == 0) {
            // noone's listening, bail out
            return;
        }
        // add clientX & clientY to all events - corresponds to average x, y
        var touches = evt.touches;
        if (touches && touches[0]) {
            var x = 0;
            var y = 0;
            var num = touches.length;
            var touch;
            for (var i=0; i<num; ++i) {
                touch = touches[i];
                x += touch.clientX;
                y += touch.clientY;
            }
            evt.clientX = x / num;
            evt.clientY = y / num;
        }
        if (this.includeXY) {
            evt.xy = this.getMousePosition(evt);
        } 
        this.triggerEvent(type, evt);
    },

    /**
     * APIMethod: clearMouseCache
     * Clear cached data about the mouse position. This should be called any 
     *     time the element that events are registered on changes position 
     *     within the page.
     */
    clearMouseCache: function() { 
        this.element.scrolls = null;
        this.element.lefttop = null;
        // OpenLayers.Util.pagePosition needs to use
        // element.getBoundingClientRect to correctly calculate the offsets
        // for the iPhone, but once the page is scrolled, getBoundingClientRect
        // returns incorrect offsets. So our best bet is to not invalidate the
        // offsets once we have them, and hope that the page was not scrolled
        // when we did the initial calculation.
        var body = document.body;
        if (body && !((body.scrollTop != 0 || body.scrollLeft != 0) &&
                                    navigator.userAgent.match(/iPhone/i))) {
            this.element.offsets = null;
        }
    },      

    /**
     * Method: getMousePosition
     * 
     * Parameters:
     * evt - {Event} 
     * 
     * Returns:
     * {<OpenLayers.Pixel>} The current xy coordinate of the mouse, adjusted
     *                      for offsets
     */
    getMousePosition: function (evt) {
        if (!this.includeXY) {
            this.clearMouseCache();
        } else if (!this.element.hasScrollEvent) {
            OpenLayers.Event.observe(window, "scroll", this.clearMouseListener);
            this.element.hasScrollEvent = true;
        }
        
        if (!this.element.scrolls) {
            var viewportElement = OpenLayers.Util.getViewportElement();
            this.element.scrolls = [
                viewportElement.scrollLeft,
                viewportElement.scrollTop
            ];
        }

        if (!this.element.lefttop) {
            this.element.lefttop = [
                (document.documentElement.clientLeft || 0),
                (document.documentElement.clientTop  || 0)
            ];
        }
        
        if (!this.element.offsets) {
            this.element.offsets = OpenLayers.Util.pagePosition(this.element);
        }

        return new OpenLayers.Pixel(
            (evt.clientX + this.element.scrolls[0]) - this.element.offsets[0]
                         - this.element.lefttop[0], 
            (evt.clientY + this.element.scrolls[1]) - this.element.offsets[1]
                         - this.element.lefttop[1]
        ); 
    },

    CLASS_NAME: "OpenLayers.Events"
});
/* ======================================================================
    OpenLayers/Projection.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/BaseTypes/Class.js
 * @requires OpenLayers/Util.js
 */

/**
 * Namespace: OpenLayers.Projection
 * Methods for coordinate transforms between coordinate systems.  By default,
 *     OpenLayers ships with the ability to transform coordinates between
 *     geographic (EPSG:4326) and web or spherical mercator (EPSG:900913 et al.)
 *     coordinate reference systems.  See the <transform> method for details
 *     on usage.
 *
 * Additional transforms may be added by using the <proj4js at http://proj4js.org/>
 *     library.  If the proj4js library is included, the <transform> method 
 *     will work between any two coordinate reference systems with proj4js 
 *     definitions.
 *
 * If the proj4js library is not included, or if you wish to allow transforms
 *     between arbitrary coordinate reference systems, use the <addTransform>
 *     method to register a custom transform method.
 */
OpenLayers.Projection = OpenLayers.Class({

    /**
     * Property: proj
     * {Object} Proj4js.Proj instance.
     */
    proj: null,
    
    /**
     * Property: projCode
     * {String}
     */
    projCode: null,
    
    /**
     * Property: titleRegEx
     * {RegExp} regular expression to strip the title from a proj4js definition
     */
    titleRegEx: /\+title=[^\+]*/,

    /**
     * Constructor: OpenLayers.Projection
     * This class offers several methods for interacting with a wrapped 
     *     pro4js projection object. 
     *
     * Parameters:
     * projCode - {String} A string identifying the Well Known Identifier for
     *    the projection.
     * options - {Object} An optional object to set additional properties
     *     on the projection.
     *
     * Returns:
     * {<OpenLayers.Projection>} A projection object.
     */
    initialize: function(projCode, options) {
        OpenLayers.Util.extend(this, options);
        this.projCode = projCode;
        if (window.Proj4js) {
            this.proj = new Proj4js.Proj(projCode);
        }
    },
    
    /**
     * APIMethod: getCode
     * Get the string SRS code.
     *
     * Returns:
     * {String} The SRS code.
     */
    getCode: function() {
        return this.proj ? this.proj.srsCode : this.projCode;
    },
   
    /**
     * APIMethod: getUnits
     * Get the units string for the projection -- returns null if 
     *     proj4js is not available.
     *
     * Returns:
     * {String} The units abbreviation.
     */
    getUnits: function() {
        return this.proj ? this.proj.units : null;
    },

    /**
     * Method: toString
     * Convert projection to string (getCode wrapper).
     *
     * Returns:
     * {String} The projection code.
     */
    toString: function() {
        return this.getCode();
    },

    /**
     * Method: equals
     * Test equality of two projection instances.  Determines equality based
     *     soley on the projection code.
     *
     * Returns:
     * {Boolean} The two projections are equivalent.
     */
    equals: function(projection) {
        var p = projection, equals = false;
        if (p) {
            if (!(p instanceof OpenLayers.Projection)) {
                p = new OpenLayers.Projection(p);
            }
            if (window.Proj4js && this.proj.defData && p.proj.defData) {
                equals = this.proj.defData.replace(this.titleRegEx, "") ==
                    p.proj.defData.replace(this.titleRegEx, "");
            } else if (p.getCode) {
                var source = this.getCode(), target = p.getCode();
                equals = source == target ||
                    !!OpenLayers.Projection.transforms[source] &&
                    OpenLayers.Projection.transforms[source][target] ===
                        OpenLayers.Projection.nullTransform;
            }
        }
        return equals;   
    },

    /* Method: destroy
     * Destroy projection object.
     */
    destroy: function() {
        delete this.proj;
        delete this.projCode;
    },
    
    CLASS_NAME: "OpenLayers.Projection" 
});     

/**
 * Property: transforms
 * {Object} Transforms is an object, with from properties, each of which may
 * have a to property. This allows you to define projections without 
 * requiring support for proj4js to be included.
 *
 * This object has keys which correspond to a 'source' projection object.  The
 * keys should be strings, corresponding to the projection.getCode() value.
 * Each source projection object should have a set of destination projection
 * keys included in the object. 
 * 
 * Each value in the destination object should be a transformation function,
 * where the function is expected to be passed an object with a .x and a .y
 * property.  The function should return the object, with the .x and .y
 * transformed according to the transformation function.
 *
 * Note - Properties on this object should not be set directly.  To add a
 *     transform method to this object, use the <addTransform> method.  For an
 *     example of usage, see the OpenLayers.Layer.SphericalMercator file.
 */
OpenLayers.Projection.transforms = {};

/**
 * APIProperty: defaults
 * {Object} Defaults for the SRS codes known to OpenLayers (currently
 * EPSG:4326, CRS:84, urn:ogc:def:crs:EPSG:6.6:4326, EPSG:900913, EPSG:3857,
 * EPSG:102113 and EPSG:102100). Keys are the SRS code, values are units,
 * maxExtent (the validity extent for the SRS) and yx (true if this SRS is
 * known to have a reverse axis order).
 */
OpenLayers.Projection.defaults = {
    "EPSG:4326": {
        units: "degrees",
        maxExtent: [-180, -90, 180, 90],
        yx: true
    },
    "CRS:84": {
        units: "degrees",
        maxExtent: [-180, -90, 180, 90]
    },
    "EPSG:900913": {
        units: "m",
        maxExtent: [-20037508.34, -20037508.34, 20037508.34, 20037508.34]
    }
};

/**
 * APIMethod: addTransform
 * Set a custom transform method between two projections.  Use this method in
 *     cases where the proj4js lib is not available or where custom projections
 *     need to be handled.
 *
 * Parameters:
 * from - {String} The code for the source projection
 * to - {String} the code for the destination projection
 * method - {Function} A function that takes a point as an argument and
 *     transforms that point from the source to the destination projection
 *     in place.  The original point should be modified.
 */
OpenLayers.Projection.addTransform = function(from, to, method) {
    if (method === OpenLayers.Projection.nullTransform) {
        var defaults = OpenLayers.Projection.defaults[from];
        if (defaults && !OpenLayers.Projection.defaults[to]) {
            OpenLayers.Projection.defaults[to] = defaults;
        }
    }
    if(!OpenLayers.Projection.transforms[from]) {
        OpenLayers.Projection.transforms[from] = {};
    }
    OpenLayers.Projection.transforms[from][to] = method;
};

/**
 * APIMethod: transform
 * Transform a point coordinate from one projection to another.  Note that
 *     the input point is transformed in place.
 * 
 * Parameters:
 * point - {<OpenLayers.Geometry.Point> | Object} An object with x and y
 *     properties representing coordinates in those dimensions.
 * source - {OpenLayers.Projection} Source map coordinate system
 * dest - {OpenLayers.Projection} Destination map coordinate system
 *
 * Returns:
 * point - {object} A transformed coordinate.  The original point is modified.
 */
OpenLayers.Projection.transform = function(point, source, dest) {
    if (source && dest) {
        if (!(source instanceof OpenLayers.Projection)) {
            source = new OpenLayers.Projection(source);
        }
        if (!(dest instanceof OpenLayers.Projection)) {
            dest = new OpenLayers.Projection(dest);
        }
        if (source.proj && dest.proj) {
            point = Proj4js.transform(source.proj, dest.proj, point);
        } else {
            var sourceCode = source.getCode();
            var destCode = dest.getCode();
            var transforms = OpenLayers.Projection.transforms;
            if (transforms[sourceCode] && transforms[sourceCode][destCode]) {
                transforms[sourceCode][destCode](point);
            }
        }
    }
    return point;
};

/**
 * APIFunction: nullTransform
 * A null transformation - useful for defining projection aliases when
 * proj4js is not available:
 *
 * (code)
 * OpenLayers.Projection.addTransform("EPSG:3857", "EPSG:900913",
 *     OpenLayers.Projection.nullTransform);
 * OpenLayers.Projection.addTransform("EPSG:900913", "EPSG:3857",
 *     OpenLayers.Projection.nullTransform);
 * (end)
 */
OpenLayers.Projection.nullTransform = function(point) {
    return point;
};

/**
 * Note: Transforms for web mercator <-> geographic
 * OpenLayers recognizes EPSG:3857, EPSG:900913, EPSG:102113 and EPSG:102100.
 * OpenLayers originally started referring to EPSG:900913 as web mercator.
 * The EPSG has declared EPSG:3857 to be web mercator.
 * ArcGIS 10 recognizes the EPSG:3857, EPSG:102113, and EPSG:102100 as
 * equivalent.  See http://blogs.esri.com/Dev/blogs/arcgisserver/archive/2009/11/20/ArcGIS-Online-moving-to-Google-_2F00_-Bing-tiling-scheme_3A00_-What-does-this-mean-for-you_3F00_.aspx#12084.
 * For geographic, OpenLayers recognizes EPSG:4326, CRS:84 and
 * urn:ogc:def:crs:EPSG:6.6:4326. OpenLayers also knows about the reverse axis
 * order for EPSG:4326. 
 */
(function() {

    var pole = 20037508.34;

    function inverseMercator(xy) {
        xy.x = 180 * xy.x / pole;
        xy.y = 180 / Math.PI * (2 * Math.atan(Math.exp((xy.y / pole) * Math.PI)) - Math.PI / 2);
        return xy;
    }

    function forwardMercator(xy) {
        xy.x = xy.x * pole / 180;
        xy.y = Math.log(Math.tan((90 + xy.y) * Math.PI / 360)) / Math.PI * pole;
        return xy;
    }

    function map(base, codes) {
        var add = OpenLayers.Projection.addTransform;
        var same = OpenLayers.Projection.nullTransform;
        var i, len, code, other, j;
        for (i=0, len=codes.length; i<len; ++i) {
            code = codes[i];
            add(base, code, forwardMercator);
            add(code, base, inverseMercator);
            for (j=i+1; j<len; ++j) {
                other = codes[j];
                add(code, other, same);
                add(other, code, same);
            }
        }
    }
    
    // list of equivalent codes for web mercator
    var mercator = ["EPSG:900913", "EPSG:3857", "EPSG:102113", "EPSG:102100"],
        geographic = ["CRS:84", "urn:ogc:def:crs:EPSG:6.6:4326", "EPSG:4326"],
        i;
    for (i=mercator.length-1; i>=0; --i) {
        map(mercator[i], geographic);
    }
    for (i=geographic.length-1; i>=0; --i) {
        map(geographic[i], mercator);
    }

})();
/* ======================================================================
    OpenLayers/Map.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/BaseTypes/Class.js
 * @requires OpenLayers/Util.js
 * @requires OpenLayers/Events.js
 * @requires OpenLayers/Tween.js
 * @requires OpenLayers/Projection.js
 */

/**
 * Class: OpenLayers.Map
 * Instances of OpenLayers.Map are interactive maps embedded in a web page.
 * Create a new map with the <OpenLayers.Map> constructor.
 * 
 * On their own maps do not provide much functionality.  To extend a map
 * it's necessary to add controls (<OpenLayers.Control>) and 
 * layers (<OpenLayers.Layer>) to the map. 
 */
OpenLayers.Map = OpenLayers.Class({
    
    /**
     * Constant: Z_INDEX_BASE
     * {Object} Base z-indexes for different classes of thing 
     */
    Z_INDEX_BASE: {
        BaseLayer: 100,
        Overlay: 325,
        Feature: 725,
        Popup: 750,
        Control: 1000
    },

    /**
     * APIProperty: events
     * {<OpenLayers.Events>}
     *
     * Register a listener for a particular event with the following syntax:
     * (code)
     * map.events.register(type, obj, listener);
     * (end)
     *
     * Listeners will be called with a reference to an event object.  The
     *     properties of this event depends on exactly what happened.
     *
     * All event objects have at least the following properties:
     * object - {Object} A reference to map.events.object.
     * element - {DOMElement} A reference to map.events.element.
     *
     * Browser events have the following additional properties:
     * xy - {<OpenLayers.Pixel>} The pixel location of the event (relative
     *     to the the map viewport).
     *
     * Supported map event types:
     * preaddlayer - triggered before a layer has been added.  The event
     *     object will include a *layer* property that references the layer  
     *     to be added. When a listener returns "false" the adding will be 
     *     aborted.
     * addlayer - triggered after a layer has been added.  The event object
     *     will include a *layer* property that references the added layer.
     * preremovelayer - triggered before a layer has been removed. The event
     *     object will include a *layer* property that references the layer  
     *     to be removed. When a listener returns "false" the removal will be 
     *     aborted.
     * removelayer - triggered after a layer has been removed.  The event
     *     object will include a *layer* property that references the removed
     *     layer.
     * changelayer - triggered after a layer name change, order change,
     *     opacity change, params change, visibility change (due to resolution
     *     thresholds) or attribution change (due to extent change). Listeners
     *     will receive an event object with *layer* and *property* properties.
     *     The *layer* property will be a reference to the changed layer. The
     *     *property* property will be a key to the changed property (name,
     *     order, opacity, params, visibility or attribution).
     * movestart - triggered after the start of a drag, pan, or zoom
     * move - triggered after each drag, pan, or zoom
     * moveend - triggered after a drag, pan, or zoom completes
     * zoomend - triggered after a zoom completes
     * mouseover - triggered after mouseover the map
     * mouseout - triggered after mouseout the map
     * mousemove - triggered after mousemove the map
     * changebaselayer - triggered after the base layer changes
     */

    /**
     * Property: id
     * {String} Unique identifier for the map
     */
    id: null,
    
    /**
     * Property: fractionalZoom
     * {Boolean} For a base layer that supports it, allow the map resolution
     *     to be set to a value between one of the values in the resolutions
     *     array.  Default is false.
     *
     * When fractionalZoom is set to true, it is possible to zoom to
     *     an arbitrary extent.  This requires a base layer from a source
     *     that supports requests for arbitrary extents (i.e. not cached
     *     tiles on a regular lattice).  This means that fractionalZoom
     *     will not work with commercial layers (Google, Yahoo, VE), layers
     *     using TileCache, or any other pre-cached data sources.
     *
     * If you are using fractionalZoom, then you should also use
     *     <getResolutionForZoom> instead of layer.resolutions[zoom] as the
     *     former works for non-integer zoom levels.
     */
    fractionalZoom: false,
    
    /**
     * APIProperty: events
     * {<OpenLayers.Events>} An events object that handles all 
     *                       events on the map
     */
    events: null,
    
    /**
     * APIProperty: allOverlays
     * {Boolean} Allow the map to function with "overlays" only.  Defaults to
     *     false.  If true, the lowest layer in the draw order will act as
     *     the base layer.  In addition, if set to true, all layers will
     *     have isBaseLayer set to false when they are added to the map.
     *
     * Note:
     * If you set map.allOverlays to true, then you *cannot* use
     *     map.setBaseLayer or layer.setIsBaseLayer.  With allOverlays true,
     *     the lowest layer in the draw layer is the base layer.  So, to change
     *     the base layer, use <setLayerIndex> or <raiseLayer> to set the layer
     *     index to 0.
     */
    allOverlays: false,

    /**
     * APIProperty: div
     * {DOMElement|String} The element that contains the map (or an id for
     *     that element).  If the <OpenLayers.Map> constructor is called
     *     with two arguments, this should be provided as the first argument.
     *     Alternatively, the map constructor can be called with the options
     *     object as the only argument.  In this case (one argument), a
     *     div property may or may not be provided.  If the div property
     *     is not provided, the map can be rendered to a container later
     *     using the <render> method.
     *     
     * Note:
     * If you are calling <render> after map construction, do not use
     *     <maxResolution>  auto.  Instead, divide your <maxExtent> by your
     *     maximum expected dimension.
     */
    div: null,
    
    /**
     * Property: dragging
     * {Boolean} The map is currently being dragged.
     */
    dragging: false,

    /**
     * Property: size
     * {<OpenLayers.Size>} Size of the main div (this.div)
     */
    size: null,
    
    /**
     * Property: viewPortDiv
     * {HTMLDivElement} The element that represents the map viewport
     */
    viewPortDiv: null,

    /**
     * Property: layerContainerOrigin
     * {<OpenLayers.LonLat>} The lonlat at which the later container was
     *                       re-initialized (on-zoom)
     */
    layerContainerOrigin: null,

    /**
     * Property: layerContainerDiv
     * {HTMLDivElement} The element that contains the layers.
     */
    layerContainerDiv: null,

    /**
     * APIProperty: layers
     * {Array(<OpenLayers.Layer>)} Ordered list of layers in the map
     */
    layers: null,

    /**
     * APIProperty: controls
     * {Array(<OpenLayers.Control>)} List of controls associated with the map.
     *
     * If not provided in the map options at construction, the map will
     *     by default be given the following controls if present in the build:
     *  - <OpenLayers.Control.Navigation> or <OpenLayers.Control.TouchNavigation>
     *  - <OpenLayers.Control.Zoom> or <OpenLayers.Control.PanZoom>
     *  - <OpenLayers.Control.ArgParser>
     *  - <OpenLayers.Control.Attribution>
     */
    controls: null,

    /**
     * Property: popups
     * {Array(<OpenLayers.Popup>)} List of popups associated with the map
     */
    popups: null,

    /**
     * APIProperty: baseLayer
     * {<OpenLayers.Layer>} The currently selected base layer.  This determines
     * min/max zoom level, projection, etc.
     */
    baseLayer: null,
    
    /**
     * Property: center
     * {<OpenLayers.LonLat>} The current center of the map
     */
    center: null,

    /**
     * Property: resolution
     * {Float} The resolution of the map.
     */
    resolution: null,

    /**
     * Property: zoom
     * {Integer} The current zoom level of the map
     */
    zoom: 0,    

    /**
     * Property: panRatio
     * {Float} The ratio of the current extent within
     *         which panning will tween.
     */
    panRatio: 1.5,    

    /**
     * APIProperty: options
     * {Object} The options object passed to the class constructor. Read-only.
     */
    options: null,

  // Options

    /**
     * APIProperty: tileSize
     * {<OpenLayers.Size>} Set in the map options to override the default tile
     *                     size for this map.
     */
    tileSize: null,

    /**
     * APIProperty: projection
     * {String} Set in the map options to specify the default projection 
     *          for layers added to this map. When using a projection other than EPSG:4326
     *          (CRS:84, Geographic) or EPSG:3857 (EPSG:900913, Web Mercator),
     *          also set maxExtent, maxResolution or resolutions.  Default is "EPSG:4326".
     *          Note that the projection of the map is usually determined
     *          by that of the current baseLayer (see <baseLayer> and <getProjectionObject>).
     */
    projection: "EPSG:4326",    
        
    /**
     * APIProperty: units
     * {String} The map units.  Possible values are 'degrees' (or 'dd'), 'm', 
     *     'ft', 'km', 'mi', 'inches'.  Normally taken from the projection.
     *     Only required if both map and layers do not define a projection,
     *     or if they define a projection which does not define units
     */
    units: null,

    /**
     * APIProperty: resolutions
     * {Array(Float)} A list of map resolutions (map units per pixel) in 
     *     descending order.  If this is not set in the layer constructor, it 
     *     will be set based on other resolution related properties 
     *     (maxExtent, maxResolution, maxScale, etc.).
     */
    resolutions: null,

    /**
     * APIProperty: maxResolution
     * {Float} Required if you are not displaying the whole world on a tile
     * with the size specified in <tileSize>.
     */
    maxResolution: null,

    /**
     * APIProperty: minResolution
     * {Float}
     */
    minResolution: null,

    /**
     * APIProperty: maxScale
     * {Float}
     */
    maxScale: null,

    /**
     * APIProperty: minScale
     * {Float}
     */
    minScale: null,

    /**
     * APIProperty: maxExtent
     * {<OpenLayers.Bounds>|Array} If provided as an array, the array
     *     should consist of four values (left, bottom, right, top).
     *     The maximum extent for the map.  Defaults to the
     *     whole world in decimal degrees (-180, -90, 180, 90).  Specify a 
     *     different extent in the map options if you are not using a geographic
     *     projection and displaying the whole  world. To restrict user panning
     *     and zooming of the map, use <restrictedExtent> instead.  The value 
     *     for <maxExtent> will change calculations for tile URLs.
     */
    maxExtent: null,
    
    /**
     * APIProperty: minExtent
     * {<OpenLayers.Bounds>|Array} If provided as an array, the array
     *     should consist of four values (left, bottom, right, top).
     *     The minimum extent for the map.  Defaults to null.
     */
    minExtent: null,
    
    /**
     * APIProperty: restrictedExtent
     * {<OpenLayers.Bounds>|Array} If provided as an array, the array
     *     should consist of four values (left, bottom, right, top).
     *     Limit map navigation to this extent where possible.
     *     If a non-null restrictedExtent is set, panning will be restricted
     *     to the given bounds.  In addition, zooming to a resolution that
     *     displays more than the restricted extent will center the map
     *     on the restricted extent.  If you wish to limit the zoom level
     *     or resolution, use maxResolution.
     */
    restrictedExtent: null,

    /**
     * APIProperty: numZoomLevels
     * {Integer} Number of zoom levels for the map.  Defaults to 16.  Set a
     *           different value in the map options if needed.
     */
    numZoomLevels: 16,

    /**
     * APIProperty: theme
     * {String} Relative path to a CSS file from which to load theme styles.
     *          Specify null in the map options (e.g. {theme: null}) if you 
     *          want to get cascading style declarations - by putting links to 
     *          stylesheets or style declarations directly in your page.
     */
    theme: null,
    
    /** 
     * APIProperty: displayProjection
     * {<OpenLayers.Projection>} Requires proj4js support for projections other
     *     than EPSG:4326 or EPSG:900913/EPSG:3857. Projection used by
     *     several controls to display data to user. If this property is set,
     *     it will be set on any control which has a null displayProjection
     *     property at the time the control is added to the map. 
     */
    displayProjection: null,

    /**
     * APIProperty: fallThrough
     * {Boolean} Should OpenLayers allow events on the map to fall through to
     *           other elements on the page, or should it swallow them? (#457)
     *           Default is to fall through.
     */
    fallThrough: true,
    
    /**
     * Property: panTween
     * {<OpenLayers.Tween>} Animated panning tween object, see panTo()
     */
    panTween: null,

    /**
     * APIProperty: eventListeners
     * {Object} If set as an option at construction, the eventListeners
     *     object will be registered with <OpenLayers.Events.on>.  Object
     *     structure must be a listeners object as shown in the example for
     *     the events.on method.
     */
    eventListeners: null,

    /**
     * APIProperty: panMethod
     * {Function} The Easing function to be used for tweening.  Default is
     * OpenLayers.Easing.Expo.easeOut. Setting this to 'null' turns off
     * animated panning.
     */
    panMethod: OpenLayers.Easing.Expo.easeOut,
    
    /**
     * Property: panDuration
     * {Integer} The number of steps to be passed to the
     * OpenLayers.Tween.start() method when the map is
     * panned.
     * Default is 50.
     */
    panDuration: 50,
    
    /**
     * Property: paddingForPopups
     * {<OpenLayers.Bounds>} Outside margin of the popup. Used to prevent 
     *     the popup from getting too close to the map border.
     */
    paddingForPopups : null,
    
    /**
     * Property: minPx
     * {Object} An object with a 'x' and 'y' values that is the lower
     *     left of maxExtent in viewport pixel space.
     *     Used to verify in moveByPx that the new location we're moving to
     *     is valid. It is also used in the getLonLatFromViewPortPx function
     *     of Layer.
     */
    minPx: null,
    
    /**
     * Property: maxPx
     * {Object} An object with a 'x' and 'y' values that is the top
     *     right of maxExtent in viewport pixel space.
     *     Used to verify in moveByPx that the new location we're moving to
     *     is valid.
     */
    maxPx: null,
    
    /**
     * Constructor: OpenLayers.Map
     * Constructor for a new OpenLayers.Map instance.  There are two possible
     *     ways to call the map constructor.  See the examples below.
     *
     * Parameters:
     * div - {DOMElement|String}  The element or id of an element in your page
     *     that will contain the map.  May be omitted if the <div> option is
     *     provided or if you intend to call the <render> method later.
     * options - {Object} Optional object with properties to tag onto the map.
     *
     * Valid options (in addition to the listed API properties):
     * center - {<OpenLayers.LonLat>|Array} The default initial center of the map.
     *     If provided as array, the first value is the x coordinate,
     *     and the 2nd value is the y coordinate.
     *     Only specify if <layers> is provided.
     *     Note that if an ArgParser/Permalink control is present,
     *     and the querystring contains coordinates, center will be set
     *     by that, and this option will be ignored.
     * zoom - {Number} The initial zoom level for the map. Only specify if
     *     <layers> is provided.
     *     Note that if an ArgParser/Permalink control is present,
     *     and the querystring contains a zoom level, zoom will be set
     *     by that, and this option will be ignored.
     * extent - {<OpenLayers.Bounds>|Array} The initial extent of the map.
     *     If provided as an array, the array should consist of
     *     four values (left, bottom, right, top).
     *     Only specify if <center> and <zoom> are not provided.
     * 
     * Examples:
     * (code)
     * // create a map with default options in an element with the id "map1"
     * var map = new OpenLayers.Map("map1");
     *
     * // create a map with non-default options in an element with id "map2"
     * var options = {
     *     projection: "EPSG:3857",
     *     maxExtent: new OpenLayers.Bounds(-200000, -200000, 200000, 200000),
     *     center: new OpenLayers.LonLat(-12356463.476333, 5621521.4854095)
     * };
     * var map = new OpenLayers.Map("map2", options);
     *
     * // map with non-default options - same as above but with a single argument,
     * // a restricted extent, and using arrays for bounds and center
     * var map = new OpenLayers.Map({
     *     div: "map_id",
     *     projection: "EPSG:3857",
     *     maxExtent: [-18924313.432222, -15538711.094146, 18924313.432222, 15538711.094146],
     *     restrictedExtent: [-13358338.893333, -9608371.5085962, 13358338.893333, 9608371.5085962],
     *     center: [-12356463.476333, 5621521.4854095]
     * });
     *
     * // create a map without a reference to a container - call render later
     * var map = new OpenLayers.Map({
     *     projection: "EPSG:3857",
     *     maxExtent: new OpenLayers.Bounds(-200000, -200000, 200000, 200000)
     * });
     * (end)
     */    
    initialize: function (div, options) {
        
        // If only one argument is provided, check if it is an object.
        if(arguments.length === 1 && typeof div === "object") {
            options = div;
            div = options && options.div;
        }

        // Simple-type defaults are set in class definition. 
        //  Now set complex-type defaults 
        this.tileSize = new OpenLayers.Size(OpenLayers.Map.TILE_WIDTH,
                                            OpenLayers.Map.TILE_HEIGHT);
        
        this.paddingForPopups = new OpenLayers.Bounds(15, 15, 15, 15);

        this.theme = OpenLayers._getScriptLocation() + 
                             'theme/default/style.css'; 

        // backup original options
        this.options = OpenLayers.Util.extend({}, options);

        // now override default options 
        OpenLayers.Util.extend(this, options);
        
        var projCode = this.projection instanceof OpenLayers.Projection ?
            this.projection.projCode : this.projection;
        OpenLayers.Util.applyDefaults(this, OpenLayers.Projection.defaults[projCode]);
        
        // allow extents and center to be arrays
        if (this.maxExtent && !(this.maxExtent instanceof OpenLayers.Bounds)) {
            this.maxExtent = new OpenLayers.Bounds(this.maxExtent);
        }
        if (this.minExtent && !(this.minExtent instanceof OpenLayers.Bounds)) {
            this.minExtent = new OpenLayers.Bounds(this.minExtent);
        }
        if (this.restrictedExtent && !(this.restrictedExtent instanceof OpenLayers.Bounds)) {
            this.restrictedExtent = new OpenLayers.Bounds(this.restrictedExtent);
        }
        if (this.center && !(this.center instanceof OpenLayers.LonLat)) {
            this.center = new OpenLayers.LonLat(this.center);
        }

        // initialize layers array
        this.layers = [];

        this.id = OpenLayers.Util.createUniqueID("OpenLayers.Map_");

        this.div = OpenLayers.Util.getElement(div);
        if(!this.div) {
            this.div = document.createElement("div");
            this.div.style.height = "1px";
            this.div.style.width = "1px";
        }
        
        OpenLayers.Element.addClass(this.div, 'olMap');

        // the viewPortDiv is the outermost div we modify
        var id = this.id + "_OpenLayers_ViewPort";
        this.viewPortDiv = OpenLayers.Util.createDiv(id, null, null, null,
                                                     "relative", null,
                                                     "hidden");
        this.viewPortDiv.style.width = "100%";
        this.viewPortDiv.style.height = "100%";
        this.viewPortDiv.className = "olMapViewport";
        this.div.appendChild(this.viewPortDiv);

        this.events = new OpenLayers.Events(
            this, this.viewPortDiv, null, this.fallThrough, 
            {includeXY: true}
        );

        // the layerContainerDiv is the one that holds all the layers
        id = this.id + "_OpenLayers_Container";
        this.layerContainerDiv = OpenLayers.Util.createDiv(id);
        this.layerContainerDiv.style.width = '100px';
        this.layerContainerDiv.style.height = '100px';
        this.layerContainerDiv.style.zIndex=this.Z_INDEX_BASE['Popup']-1;
        
        this.viewPortDiv.appendChild(this.layerContainerDiv);

        this.updateSize();
        if(this.eventListeners instanceof Object) {
            this.events.on(this.eventListeners);
        }
 
        // Because Mozilla does not support the "resize" event for elements 
        // other than "window", we need to put a hack here. 
        if (parseFloat(navigator.appVersion.split("MSIE")[1]) < 9) {
            // If IE < 9, register the resize on the div
            this.events.register("resize", this, this.updateSize);
        } else {
            // Else updateSize on catching the window's resize
            //  Note that this is ok, as updateSize() does nothing if the 
            //  map's size has not actually changed.
            this.updateSizeDestroy = OpenLayers.Function.bind(this.updateSize, 
                this);
            OpenLayers.Event.observe(window, 'resize',
                            this.updateSizeDestroy);
        }
        
        // only append link stylesheet if the theme property is set
        if(this.theme) {
            // check existing links for equivalent url
            var addNode = true;
            var nodes = document.getElementsByTagName('link');
            for(var i=0, len=nodes.length; i<len; ++i) {
                if(OpenLayers.Util.isEquivalentUrl(nodes.item(i).href,
                                                   this.theme)) {
                    addNode = false;
                    break;
                }
            }
            // only add a new node if one with an equivalent url hasn't already
            // been added
            if(addNode) {
                var cssNode = document.createElement('link');
                cssNode.setAttribute('rel', 'stylesheet');
                cssNode.setAttribute('type', 'text/css');
                cssNode.setAttribute('href', this.theme);
                document.getElementsByTagName('head')[0].appendChild(cssNode);
            }
        }
        
        if (this.controls == null) { // default controls
            this.controls = [];
            if (OpenLayers.Control != null) { // running full or lite?
                // Navigation or TouchNavigation depending on what is in build
                if (OpenLayers.Control.Navigation) {
                    this.controls.push(new OpenLayers.Control.Navigation());
                } else if (OpenLayers.Control.TouchNavigation) {
                    this.controls.push(new OpenLayers.Control.TouchNavigation());
                }
                if (OpenLayers.Control.Zoom) {
                    this.controls.push(new OpenLayers.Control.Zoom());
                } else if (OpenLayers.Control.PanZoom) {
                    this.controls.push(new OpenLayers.Control.PanZoom());
                }

                if (OpenLayers.Control.ArgParser) {
                    this.controls.push(new OpenLayers.Control.ArgParser());
                }
                if (OpenLayers.Control.Attribution) {
                    this.controls.push(new OpenLayers.Control.Attribution());
                }
            }
        }

        for(var i=0, len=this.controls.length; i<len; i++) {
            this.addControlToMap(this.controls[i]);
        }

        this.popups = [];

        this.unloadDestroy = OpenLayers.Function.bind(this.destroy, this);
        

        // always call map.destroy()
        OpenLayers.Event.observe(window, 'unload', this.unloadDestroy);
        
        // add any initial layers
        if (options && options.layers) {
            /** 
             * If you have set options.center, the map center property will be
             * set at this point.  However, since setCenter has not been called,
             * addLayers gets confused.  So we delete the map center in this 
             * case.  Because the check below uses options.center, it will
             * be properly set below.
             */
            delete this.center;
            delete this.zoom;
            this.addLayers(options.layers);
            // set center (and optionally zoom)
            if (options.center && !this.getCenter()) {
                // zoom can be undefined here
                this.setCenter(options.center, options.zoom);
            }
        }
    },

    /** 
     * APIMethod: getViewport
     * Get the DOMElement representing the view port.
     *
     * Returns:
     * {DOMElement}
     */
    getViewport: function() {
        return this.viewPortDiv;
    },
    
    /**
     * APIMethod: render
     * Render the map to a specified container.
     * 
     * Parameters:
     * div - {String|DOMElement} The container that the map should be rendered
     *     to. If different than the current container, the map viewport
     *     will be moved from the current to the new container.
     */
    render: function(div) {
        this.div = OpenLayers.Util.getElement(div);
        OpenLayers.Element.addClass(this.div, 'olMap');
        this.viewPortDiv.parentNode.removeChild(this.viewPortDiv);
        this.div.appendChild(this.viewPortDiv);
        this.updateSize();
    },

    /**
     * Method: unloadDestroy
     * Function that is called to destroy the map on page unload. stored here
     *     so that if map is manually destroyed, we can unregister this.
     */
    unloadDestroy: null,
    
    /**
     * Method: updateSizeDestroy
     * When the map is destroyed, we need to stop listening to updateSize
     *    events: this method stores the function we need to unregister in 
     *    non-IE browsers.
     */
    updateSizeDestroy: null,

    /**
     * APIMethod: destroy
     * Destroy this map.
     *    Note that if you are using an application which removes a container
     *    of the map from the DOM, you need to ensure that you destroy the
     *    map *before* this happens; otherwise, the page unload handler
     *    will fail because the DOM elements that map.destroy() wants
     *    to clean up will be gone. (See 
     *    http://trac.osgeo.org/openlayers/ticket/2277 for more information).
     *    This will apply to GeoExt and also to other applications which
     *    modify the DOM of the container of the OpenLayers Map.
     */
    destroy:function() {
        // if unloadDestroy is null, we've already been destroyed
        if (!this.unloadDestroy) {
            return false;
        }
        
        // make sure panning doesn't continue after destruction
        if(this.panTween) {
            this.panTween.stop();
            this.panTween = null;
        }

        // map has been destroyed. dont do it again!
        OpenLayers.Event.stopObserving(window, 'unload', this.unloadDestroy);
        this.unloadDestroy = null;

        if (this.updateSizeDestroy) {
            OpenLayers.Event.stopObserving(window, 'resize', 
                                           this.updateSizeDestroy);
        } else {
            this.events.unregister("resize", this, this.updateSize);
        }    
        
        this.paddingForPopups = null;    

        if (this.controls != null) {
            for (var i = this.controls.length - 1; i>=0; --i) {
                this.controls[i].destroy();
            } 
            this.controls = null;
        }
        if (this.layers != null) {
            for (var i = this.layers.length - 1; i>=0; --i) {
                //pass 'false' to destroy so that map wont try to set a new 
                // baselayer after each baselayer is removed
                this.layers[i].destroy(false);
            } 
            this.layers = null;
        }
        if (this.viewPortDiv) {
            this.div.removeChild(this.viewPortDiv);
        }
        this.viewPortDiv = null;

        if(this.eventListeners) {
            this.events.un(this.eventListeners);
            this.eventListeners = null;
        }
        this.events.destroy();
        this.events = null;

        this.options = null;
    },

    /**
     * APIMethod: setOptions
     * Change the map options
     *
     * Parameters:
     * options - {Object} Hashtable of options to tag to the map
     */
    setOptions: function(options) {
        var updatePxExtent = this.minPx &&
            options.restrictedExtent != this.restrictedExtent;
        OpenLayers.Util.extend(this, options);
        // force recalculation of minPx and maxPx
        updatePxExtent && this.moveTo(this.getCachedCenter(), this.zoom, {
            forceZoomChange: true
        });
    },

    /**
     * APIMethod: getTileSize
     * Get the tile size for the map
     *
     * Returns:
     * {<OpenLayers.Size>}
     */
     getTileSize: function() {
         return this.tileSize;
     },


    /**
     * APIMethod: getBy
     * Get a list of objects given a property and a match item.
     *
     * Parameters:
     * array - {String} A property on the map whose value is an array.
     * property - {String} A property on each item of the given array.
     * match - {String | Object} A string to match.  Can also be a regular
     *     expression literal or object.  In addition, it can be any object
     *     with a method named test.  For reqular expressions or other, if
     *     match.test(map[array][i][property]) evaluates to true, the item will
     *     be included in the array returned.  If no items are found, an empty
     *     array is returned.
     *
     * Returns:
     * {Array} An array of items where the given property matches the given
     *     criteria.
     */
    getBy: function(array, property, match) {
        var test = (typeof match.test == "function");
        var found = OpenLayers.Array.filter(this[array], function(item) {
            return item[property] == match || (test && match.test(item[property]));
        });
        return found;
    },

    /**
     * APIMethod: getLayersBy
     * Get a list of layers with properties matching the given criteria.
     *
     * Parameters:
     * property - {String} A layer property to be matched.
     * match - {String | Object} A string to match.  Can also be a regular
     *     expression literal or object.  In addition, it can be any object
     *     with a method named test.  For reqular expressions or other, if
     *     match.test(layer[property]) evaluates to true, the layer will be
     *     included in the array returned.  If no layers are found, an empty
     *     array is returned.
     *
     * Returns:
     * {Array(<OpenLayers.Layer>)} A list of layers matching the given criteria.
     *     An empty array is returned if no matches are found.
     */
    getLayersBy: function(property, match) {
        return this.getBy("layers", property, match);
    },

    /**
     * APIMethod: getLayersByName
     * Get a list of layers with names matching the given name.
     *
     * Parameters:
     * match - {String | Object} A layer name.  The name can also be a regular
     *     expression literal or object.  In addition, it can be any object
     *     with a method named test.  For reqular expressions or other, if
     *     name.test(layer.name) evaluates to true, the layer will be included
     *     in the list of layers returned.  If no layers are found, an empty
     *     array is returned.
     *
     * Returns:
     * {Array(<OpenLayers.Layer>)} A list of layers matching the given name.
     *     An empty array is returned if no matches are found.
     */
    getLayersByName: function(match) {
        return this.getLayersBy("name", match);
    },

    /**
     * APIMethod: getLayersByClass
     * Get a list of layers of a given class (CLASS_NAME).
     *
     * Parameters:
     * match - {String | Object} A layer class name.  The match can also be a
     *     regular expression literal or object.  In addition, it can be any
     *     object with a method named test.  For reqular expressions or other,
     *     if type.test(layer.CLASS_NAME) evaluates to true, the layer will
     *     be included in the list of layers returned.  If no layers are
     *     found, an empty array is returned.
     *
     * Returns:
     * {Array(<OpenLayers.Layer>)} A list of layers matching the given class.
     *     An empty array is returned if no matches are found.
     */
    getLayersByClass: function(match) {
        return this.getLayersBy("CLASS_NAME", match);
    },

    /**
     * APIMethod: getControlsBy
     * Get a list of controls with properties matching the given criteria.
     *
     * Parameters:
     * property - {String} A control property to be matched.
     * match - {String | Object} A string to match.  Can also be a regular
     *     expression literal or object.  In addition, it can be any object
     *     with a method named test.  For reqular expressions or other, if
     *     match.test(layer[property]) evaluates to true, the layer will be
     *     included in the array returned.  If no layers are found, an empty
     *     array is returned.
     *
     * Returns:
     * {Array(<OpenLayers.Control>)} A list of controls matching the given
     *     criteria.  An empty array is returned if no matches are found.
     */
    getControlsBy: function(property, match) {
        return this.getBy("controls", property, match);
    },

    /**
     * APIMethod: getControlsByClass
     * Get a list of controls of a given class (CLASS_NAME).
     *
     * Parameters:
     * match - {String | Object} A control class name.  The match can also be a
     *     regular expression literal or object.  In addition, it can be any
     *     object with a method named test.  For reqular expressions or other,
     *     if type.test(control.CLASS_NAME) evaluates to true, the control will
     *     be included in the list of controls returned.  If no controls are
     *     found, an empty array is returned.
     *
     * Returns:
     * {Array(<OpenLayers.Control>)} A list of controls matching the given class.
     *     An empty array is returned if no matches are found.
     */
    getControlsByClass: function(match) {
        return this.getControlsBy("CLASS_NAME", match);
    },

  /********************************************************/
  /*                                                      */
  /*                  Layer Functions                     */
  /*                                                      */
  /*     The following functions deal with adding and     */
  /*        removing Layers to and from the Map           */
  /*                                                      */
  /********************************************************/         

    /**
     * APIMethod: getLayer
     * Get a layer based on its id
     *
     * Parameters:
     * id - {String} A layer id
     *
     * Returns:
     * {<OpenLayers.Layer>} The Layer with the corresponding id from the map's 
     *                      layer collection, or null if not found.
     */
    getLayer: function(id) {
        var foundLayer = null;
        for (var i=0, len=this.layers.length; i<len; i++) {
            var layer = this.layers[i];
            if (layer.id == id) {
                foundLayer = layer;
                break;
            }
        }
        return foundLayer;
    },

    /**
    * Method: setLayerZIndex
    * 
    * Parameters:
    * layer - {<OpenLayers.Layer>} 
    * zIdx - {int} 
    */    
    setLayerZIndex: function (layer, zIdx) {
        layer.setZIndex(
            this.Z_INDEX_BASE[layer.isBaseLayer ? 'BaseLayer' : 'Overlay']
            + zIdx * 5 );
    },

    /**
     * Method: resetLayersZIndex
     * Reset each layer's z-index based on layer's array index
     */
    resetLayersZIndex: function() {
        for (var i=0, len=this.layers.length; i<len; i++) {
            var layer = this.layers[i];
            this.setLayerZIndex(layer, i);
        }
    },

    /**
    * APIMethod: addLayer
    *
    * Parameters:
    * layer - {<OpenLayers.Layer>} 
    *
    * Returns:
    * {Boolean} True if the layer has been added to the map.
    */    
    addLayer: function (layer) {
        for(var i = 0, len = this.layers.length; i < len; i++) {
            if (this.layers[i] == layer) {
                return false;
            }
        }
        if (this.events.triggerEvent("preaddlayer", {layer: layer}) === false) {
            return false;
        }
        if(this.allOverlays) {
            layer.isBaseLayer = false;
        }
        
        layer.div.className = "olLayerDiv";
        layer.div.style.overflow = "";
        this.setLayerZIndex(layer, this.layers.length);

        if (layer.isFixed) {
            this.viewPortDiv.appendChild(layer.div);
        } else {
            this.layerContainerDiv.appendChild(layer.div);
        }
        this.layers.push(layer);
        layer.setMap(this);

        if (layer.isBaseLayer || (this.allOverlays && !this.baseLayer))  {
            if (this.baseLayer == null) {
                // set the first baselaye we add as the baselayer
                this.setBaseLayer(layer);
            } else {
                layer.setVisibility(false);
            }
        } else {
            layer.redraw();
        }

        this.events.triggerEvent("addlayer", {layer: layer});
        layer.events.triggerEvent("added", {map: this, layer: layer});
        layer.afterAdd();

        return true;
    },

    /**
    * APIMethod: addLayers 
    *
    * Parameters:
    * layers - {Array(<OpenLayers.Layer>)} 
    */    
    addLayers: function (layers) {
        for (var i=0, len=layers.length; i<len; i++) {
            this.addLayer(layers[i]);
        }
    },

    /** 
     * APIMethod: removeLayer
     * Removes a layer from the map by removing its visual element (the 
     *   layer.div property), then removing it from the map's internal list 
     *   of layers, setting the layer's map property to null. 
     * 
     *   a "removelayer" event is triggered.
     * 
     *   very worthy of mention is that simply removing a layer from a map
     *   will not cause the removal of any popups which may have been created
     *   by the layer. this is due to the fact that it was decided at some
     *   point that popups would not belong to layers. thus there is no way 
     *   for us to know here to which layer the popup belongs.
     *    
     *     A simple solution to this is simply to call destroy() on the layer.
     *     the default OpenLayers.Layer class's destroy() function
     *     automatically takes care to remove itself from whatever map it has
     *     been attached to. 
     * 
     *     The correct solution is for the layer itself to register an 
     *     event-handler on "removelayer" and when it is called, if it 
     *     recognizes itself as the layer being removed, then it cycles through
     *     its own personal list of popups, removing them from the map.
     * 
     * Parameters:
     * layer - {<OpenLayers.Layer>} 
     * setNewBaseLayer - {Boolean} Default is true
     */
    removeLayer: function(layer, setNewBaseLayer) {
        if (this.events.triggerEvent("preremovelayer", {layer: layer}) === false) {
            return;
        }
        if (setNewBaseLayer == null) {
            setNewBaseLayer = true;
        }

        if (layer.isFixed) {
            this.viewPortDiv.removeChild(layer.div);
        } else {
            this.layerContainerDiv.removeChild(layer.div);
        }
        OpenLayers.Util.removeItem(this.layers, layer);
        layer.removeMap(this);
        layer.map = null;

        // if we removed the base layer, need to set a new one
        if(this.baseLayer == layer) {
            this.baseLayer = null;
            if(setNewBaseLayer) {
                for(var i=0, len=this.layers.length; i<len; i++) {
                    var iLayer = this.layers[i];
                    if (iLayer.isBaseLayer || this.allOverlays) {
                        this.setBaseLayer(iLayer);
                        break;
                    }
                }
            }
        }

        this.resetLayersZIndex();

        this.events.triggerEvent("removelayer", {layer: layer});
        layer.events.triggerEvent("removed", {map: this, layer: layer});
    },

    /**
     * APIMethod: getNumLayers
     * 
     * Returns:
     * {Int} The number of layers attached to the map.
     */
    getNumLayers: function () {
        return this.layers.length;
    },

    /** 
     * APIMethod: getLayerIndex
     *
     * Parameters:
     * layer - {<OpenLayers.Layer>}
     *
     * Returns:
     * {Integer} The current (zero-based) index of the given layer in the map's
     *           layer stack. Returns -1 if the layer isn't on the map.
     */
    getLayerIndex: function (layer) {
        return OpenLayers.Util.indexOf(this.layers, layer);
    },
    
    /** 
     * APIMethod: setLayerIndex
     * Move the given layer to the specified (zero-based) index in the layer
     *     list, changing its z-index in the map display. Use
     *     map.getLayerIndex() to find out the current index of a layer. Note
     *     that this cannot (or at least should not) be effectively used to
     *     raise base layers above overlays.
     *
     * Parameters:
     * layer - {<OpenLayers.Layer>} 
     * idx - {int} 
     */
    setLayerIndex: function (layer, idx) {
        var base = this.getLayerIndex(layer);
        if (idx < 0) {
            idx = 0;
        } else if (idx > this.layers.length) {
            idx = this.layers.length;
        }
        if (base != idx) {
            this.layers.splice(base, 1);
            this.layers.splice(idx, 0, layer);
            for (var i=0, len=this.layers.length; i<len; i++) {
                this.setLayerZIndex(this.layers[i], i);
            }
            this.events.triggerEvent("changelayer", {
                layer: layer, property: "order"
            });
            if(this.allOverlays) {
                if(idx === 0) {
                    this.setBaseLayer(layer);
                } else if(this.baseLayer !== this.layers[0]) {
                    this.setBaseLayer(this.layers[0]);
                }
            }
        }
    },

    /** 
     * APIMethod: raiseLayer
     * Change the index of the given layer by delta. If delta is positive, 
     *     the layer is moved up the map's layer stack; if delta is negative,
     *     the layer is moved down.  Again, note that this cannot (or at least
     *     should not) be effectively used to raise base layers above overlays.
     *
     * Paremeters:
     * layer - {<OpenLayers.Layer>} 
     * delta - {int} 
     */
    raiseLayer: function (layer, delta) {
        var idx = this.getLayerIndex(layer) + delta;
        this.setLayerIndex(layer, idx);
    },
    
    /** 
     * APIMethod: setBaseLayer
     * Allows user to specify one of the currently-loaded layers as the Map's
     *     new base layer.
     * 
     * Parameters:
     * newBaseLayer - {<OpenLayers.Layer>}
     */
    setBaseLayer: function(newBaseLayer) {
        
        if (newBaseLayer != this.baseLayer) {
          
            // ensure newBaseLayer is already loaded
            if (OpenLayers.Util.indexOf(this.layers, newBaseLayer) != -1) {

                // preserve center and scale when changing base layers
                var center = this.getCachedCenter();
                var newResolution = OpenLayers.Util.getResolutionFromScale(
                    this.getScale(), newBaseLayer.units
                );

                // make the old base layer invisible 
                if (this.baseLayer != null && !this.allOverlays) {
                    this.baseLayer.setVisibility(false);
                }

                // set new baselayer
                this.baseLayer = newBaseLayer;
                
                if(!this.allOverlays || this.baseLayer.visibility) {
                    this.baseLayer.setVisibility(true);
                    // Layer may previously have been visible but not in range.
                    // In this case we need to redraw it to make it visible.
                    if (this.baseLayer.inRange === false) {
                        this.baseLayer.redraw();
                    }
                }

                // recenter the map
                if (center != null) {
                    // new zoom level derived from old scale
                    var newZoom = this.getZoomForResolution(
                        newResolution || this.resolution, true
                    );
                    // zoom and force zoom change
                    this.setCenter(center, newZoom, false, true);
                }

                this.events.triggerEvent("changebaselayer", {
                    layer: this.baseLayer
                });
            }        
        }
    },


  /********************************************************/
  /*                                                      */
  /*                 Control Functions                    */
  /*                                                      */
  /*     The following functions deal with adding and     */
  /*        removing Controls to and from the Map         */
  /*                                                      */
  /********************************************************/         

    /**
     * APIMethod: addControl
     * Add the passed over control to the map. Optionally 
     *     position the control at the given pixel.
     * 
     * Parameters:
     * control - {<OpenLayers.Control>}
     * px - {<OpenLayers.Pixel>}
     */    
    addControl: function (control, px) {
        this.controls.push(control);
        this.addControlToMap(control, px);
    },
    
    /**
     * APIMethod: addControls
     * Add all of the passed over controls to the map. 
     *     You can pass over an optional second array
     *     with pixel-objects to position the controls.
     *     The indices of the two arrays should match and
     *     you can add null as pixel for those controls 
     *     you want to be autopositioned.   
     *     
     * Parameters:
     * controls - {Array(<OpenLayers.Control>)}
     * pixels - {Array(<OpenLayers.Pixel>)}
     */    
    addControls: function (controls, pixels) {
        var pxs = (arguments.length === 1) ? [] : pixels;
        for (var i=0, len=controls.length; i<len; i++) {
            var ctrl = controls[i];
            var px = (pxs[i]) ? pxs[i] : null;
            this.addControl( ctrl, px );
        }
    },

    /**
     * Method: addControlToMap
     * 
     * Parameters:
     * 
     * control - {<OpenLayers.Control>}
     * px - {<OpenLayers.Pixel>}
     */    
    addControlToMap: function (control, px) {
        // If a control doesn't have a div at this point, it belongs in the
        // viewport.
        control.outsideViewport = (control.div != null);
        
        // If the map has a displayProjection, and the control doesn't, set 
        // the display projection.
        if (this.displayProjection && !control.displayProjection) {
            control.displayProjection = this.displayProjection;
        }    
        
        control.setMap(this);
        var div = control.draw(px);
        if (div) {
            if(!control.outsideViewport) {
                div.style.zIndex = this.Z_INDEX_BASE['Control'] +
                                    this.controls.length;
                this.viewPortDiv.appendChild( div );
            }
        }
        if(control.autoActivate) {
            control.activate();
        }
    },
    
    /**
     * APIMethod: getControl
     * 
     * Parameters:
     * id - {String} ID of the control to return.
     * 
     * Returns:
     * {<OpenLayers.Control>} The control from the map's list of controls 
     *                        which has a matching 'id'. If none found, 
     *                        returns null.
     */    
    getControl: function (id) {
        var returnControl = null;
        for(var i=0, len=this.controls.length; i<len; i++) {
            var control = this.controls[i];
            if (control.id == id) {
                returnControl = control;
                break;
            }
        }
        return returnControl;
    },
    
    /** 
     * APIMethod: removeControl
     * Remove a control from the map. Removes the control both from the map 
     *     object's internal array of controls, as well as from the map's 
     *     viewPort (assuming the control was not added outsideViewport)
     * 
     * Parameters:
     * control - {<OpenLayers.Control>} The control to remove.
     */    
    removeControl: function (control) {
        //make sure control is non-null and actually part of our map
        if ( (control) && (control == this.getControl(control.id)) ) {
            if (control.div && (control.div.parentNode == this.viewPortDiv)) {
                this.viewPortDiv.removeChild(control.div);
            }
            OpenLayers.Util.removeItem(this.controls, control);
        }
    },

  /********************************************************/
  /*                                                      */
  /*                  Popup Functions                     */
  /*                                                      */
  /*     The following functions deal with adding and     */
  /*        removing Popups to and from the Map           */
  /*                                                      */
  /********************************************************/         

    /** 
     * APIMethod: addPopup
     * 
     * Parameters:
     * popup - {<OpenLayers.Popup>}
     * exclusive - {Boolean} If true, closes all other popups first
     */
    addPopup: function(popup, exclusive) {

        if (exclusive) {
            //remove all other popups from screen
            for (var i = this.popups.length - 1; i >= 0; --i) {
                this.removePopup(this.popups[i]);
            }
        }

        popup.map = this;
        this.popups.push(popup);
        var popupDiv = popup.draw();
        if (popupDiv) {
            popupDiv.style.zIndex = this.Z_INDEX_BASE['Popup'] +
                                    this.popups.length;
            this.layerContainerDiv.appendChild(popupDiv);
        }
    },
    
    /** 
    * APIMethod: removePopup
    * 
    * Parameters:
    * popup - {<OpenLayers.Popup>}
    */
    removePopup: function(popup) {
        OpenLayers.Util.removeItem(this.popups, popup);
        if (popup.div) {
            try { this.layerContainerDiv.removeChild(popup.div); }
            catch (e) { } // Popups sometimes apparently get disconnected
                      // from the layerContainerDiv, and cause complaints.
        }
        popup.map = null;
    },

  /********************************************************/
  /*                                                      */
  /*              Container Div Functions                 */
  /*                                                      */
  /*   The following functions deal with the access to    */
  /*    and maintenance of the size of the container div  */
  /*                                                      */
  /********************************************************/     

    /**
     * APIMethod: getSize
     * 
     * Returns:
     * {<OpenLayers.Size>} An <OpenLayers.Size> object that represents the 
     *                     size, in pixels, of the div into which OpenLayers 
     *                     has been loaded. 
     *                     Note - A clone() of this locally cached variable is
     *                     returned, so as not to allow users to modify it.
     */
    getSize: function () {
        var size = null;
        if (this.size != null) {
            size = this.size.clone();
        }
        return size;
    },

    /**
     * APIMethod: updateSize
     * This function should be called by any external code which dynamically
     *     changes the size of the map div (because mozilla wont let us catch 
     *     the "onresize" for an element)
     */
    updateSize: function() {
        // the div might have moved on the page, also
        var newSize = this.getCurrentSize();
        if (newSize && !isNaN(newSize.h) && !isNaN(newSize.w)) {
            this.events.clearMouseCache();
            var oldSize = this.getSize();
            if (oldSize == null) {
                this.size = oldSize = newSize;
            }
            if (!newSize.equals(oldSize)) {
                
                // store the new size
                this.size = newSize;
    
                //notify layers of mapresize
                for(var i=0, len=this.layers.length; i<len; i++) {
                    this.layers[i].onMapResize();                
                }
    
                var center = this.getCachedCenter();
    
                if (this.baseLayer != null && center != null) {
                    var zoom = this.getZoom();
                    this.zoom = null;
                    this.setCenter(center, zoom);
                }
    
            }
        }
    },
    
    /**
     * Method: getCurrentSize
     * 
     * Returns:
     * {<OpenLayers.Size>} A new <OpenLayers.Size> object with the dimensions 
     *                     of the map div
     */
    getCurrentSize: function() {

        var size = new OpenLayers.Size(this.div.clientWidth, 
                                       this.div.clientHeight);

        if (size.w == 0 && size.h == 0 || isNaN(size.w) && isNaN(size.h)) {
            size.w = this.div.offsetWidth;
            size.h = this.div.offsetHeight;
        }
        if (size.w == 0 && size.h == 0 || isNaN(size.w) && isNaN(size.h)) {
            size.w = parseInt(this.div.style.width);
            size.h = parseInt(this.div.style.height);
        }
        return size;
    },

    /** 
     * Method: calculateBounds
     * 
     * Parameters:
     * center - {<OpenLayers.LonLat>} Default is this.getCenter()
     * resolution - {float} Default is this.getResolution() 
     * 
     * Returns:
     * {<OpenLayers.Bounds>} A bounds based on resolution, center, and 
     *                       current mapsize.
     */
    calculateBounds: function(center, resolution) {

        var extent = null;
        
        if (center == null) {
            center = this.getCachedCenter();
        }                
        if (resolution == null) {
            resolution = this.getResolution();
        }
    
        if ((center != null) && (resolution != null)) {
            var halfWDeg = (this.size.w * resolution) / 2;
            var halfHDeg = (this.size.h * resolution) / 2;
        
            extent = new OpenLayers.Bounds(center.lon - halfWDeg,
                                           center.lat - halfHDeg,
                                           center.lon + halfWDeg,
                                           center.lat + halfHDeg);
        }

        return extent;
    },


  /********************************************************/
  /*                                                      */
  /*            Zoom, Center, Pan Functions               */
  /*                                                      */
  /*    The following functions handle the validation,    */
  /*   getting and setting of the Zoom Level and Center   */
  /*       as well as the panning of the Map              */
  /*                                                      */
  /********************************************************/
    /**
     * APIMethod: getCenter
     * 
     * Returns:
     * {<OpenLayers.LonLat>}
     */
    getCenter: function () {
        var center = null;
        var cachedCenter = this.getCachedCenter();
        if (cachedCenter) {
            center = cachedCenter.clone();
        }
        return center;
    },

    /**
     * Method: getCachedCenter
     *
     * Returns:
     * {<OpenLayers.LonLat>}
     */
    getCachedCenter: function() {
        if (!this.center && this.size) {
            this.center = this.getLonLatFromViewPortPx({
                x: this.size.w / 2,
                y: this.size.h / 2
            });
        }
        return this.center;
    },

    /**
     * APIMethod: getZoom
     * 
     * Returns:
     * {Integer}
     */
    getZoom: function () {
        return this.zoom;
    },
    
    /** 
     * APIMethod: pan
     * Allows user to pan by a value of screen pixels
     * 
     * Parameters:
     * dx - {Integer}
     * dy - {Integer}
     * options - {Object} Options to configure panning:
     *  - *animate* {Boolean} Use panTo instead of setCenter. Default is true.
     *  - *dragging* {Boolean} Call setCenter with dragging true.  Default is
     *    false.
     */
    pan: function(dx, dy, options) {
        options = OpenLayers.Util.applyDefaults(options, {
            animate: true,
            dragging: false
        });
        if (options.dragging) {
            if (dx != 0 || dy != 0) {
                this.moveByPx(dx, dy);
            }
        } else {
            // getCenter
            var centerPx = this.getViewPortPxFromLonLat(this.getCachedCenter());

            // adjust
            var newCenterPx = centerPx.add(dx, dy);

            if (this.dragging || !newCenterPx.equals(centerPx)) {
                var newCenterLonLat = this.getLonLatFromViewPortPx(newCenterPx);
                if (options.animate) {
                    this.panTo(newCenterLonLat);
                } else {
                    this.moveTo(newCenterLonLat);
                    if(this.dragging) {
                        this.dragging = false;
                        this.events.triggerEvent("moveend");
                    }
                }    
            }
        }        

   },
   
   /** 
     * APIMethod: panTo
     * Allows user to pan to a new lonlat
     * If the new lonlat is in the current extent the map will slide smoothly
     * 
     * Parameters:
     * lonlat - {<OpenLayers.LonLat>}
     */
    panTo: function(lonlat) {
        if (this.panMethod && this.getExtent().scale(this.panRatio).containsLonLat(lonlat)) {
            if (!this.panTween) {
                this.panTween = new OpenLayers.Tween(this.panMethod);
            }
            var center = this.getCachedCenter();

            // center will not change, don't do nothing
            if (lonlat.equals(center)) {
                return;
            }

            var from = this.getPixelFromLonLat(center);
            var to = this.getPixelFromLonLat(lonlat);
            var vector = { x: to.x - from.x, y: to.y - from.y };
            var last = { x: 0, y: 0 };

            this.panTween.start( { x: 0, y: 0 }, vector, this.panDuration, {
                callbacks: {
                    eachStep: OpenLayers.Function.bind(function(px) {
                        var x = px.x - last.x,
                            y = px.y - last.y;
                        this.moveByPx(x, y);
                        last.x = Math.round(px.x);
                        last.y = Math.round(px.y);
                    }, this),
                    done: OpenLayers.Function.bind(function(px) {
                        this.moveTo(lonlat);
                        this.dragging = false;
                        this.events.triggerEvent("moveend");
                    }, this)
                }
            });
        } else {
            this.setCenter(lonlat);
        }
    },

    /**
     * APIMethod: setCenter
     * Set the map center (and optionally, the zoom level).
     * 
     * Parameters:
     * lonlat - {<OpenLayers.LonLat>|Array} The new center location.
     *     If provided as array, the first value is the x coordinate,
     *     and the 2nd value is the y coordinate.
     * zoom - {Integer} Optional zoom level.
     * dragging - {Boolean} Specifies whether or not to trigger 
     *                      movestart/end events
     * forceZoomChange - {Boolean} Specifies whether or not to trigger zoom 
     *                             change events (needed on baseLayer change)
     *
     * TBD: reconsider forceZoomChange in 3.0
     */
    setCenter: function(lonlat, zoom, dragging, forceZoomChange) {
        this.panTween && this.panTween.stop();             
        this.moveTo(lonlat, zoom, {
            'dragging': dragging,
            'forceZoomChange': forceZoomChange
        });
    },
    
    /** 
     * Method: moveByPx
     * Drag the map by pixels.
     *
     * Parameters:
     * dx - {Number}
     * dy - {Number}
     */
    moveByPx: function(dx, dy) {
        var hw = this.size.w / 2;
        var hh = this.size.h / 2;
        var x = hw + dx;
        var y = hh + dy;
        var wrapDateLine = this.baseLayer.wrapDateLine;
        var xRestriction = 0;
        var yRestriction = 0;
        if (this.restrictedExtent) {
            xRestriction = hw;
            yRestriction = hh;
            // wrapping the date line makes no sense for restricted extents
            wrapDateLine = false;
        }
        dx = wrapDateLine ||
                    x <= this.maxPx.x - xRestriction &&
                    x >= this.minPx.x + xRestriction ? Math.round(dx) : 0;
        dy = y <= this.maxPx.y - yRestriction &&
                    y >= this.minPx.y + yRestriction ? Math.round(dy) : 0;
        if (dx || dy) {
            if (!this.dragging) {
                this.dragging = true;
                this.events.triggerEvent("movestart");
            }
            this.center = null;
            if (dx) {
                this.layerContainerDiv.style.left =
                    parseInt(this.layerContainerDiv.style.left) - dx + "px";
                this.minPx.x -= dx;
                this.maxPx.x -= dx;
            }
            if (dy) {
                this.layerContainerDiv.style.top =
                    parseInt(this.layerContainerDiv.style.top) - dy + "px";
                this.minPx.y -= dy;
                this.maxPx.y -= dy;
            }
            var layer, i, len;
            for (i=0, len=this.layers.length; i<len; ++i) {
                layer = this.layers[i];
                if (layer.visibility &&
                    (layer === this.baseLayer || layer.inRange)) {
                    layer.moveByPx(dx, dy);
                    layer.events.triggerEvent("move");
                }
            }
            this.events.triggerEvent("move");
        }
    },
    
    /**
     * Method: adjustZoom
     *
     * Parameters:
     * zoom - {Number} The zoom level to adjust
     *
     * Returns:
     * {Integer} Adjusted zoom level that shows a map not wider than its
     * <baseLayer>'s maxExtent.
     */
    adjustZoom: function(zoom) {
        var resolution, resolutions = this.baseLayer.resolutions,
            maxResolution = this.getMaxExtent().getWidth() / this.size.w;
        if (this.getResolutionForZoom(zoom) > maxResolution) {
            for (var i=zoom|0, ii=resolutions.length; i<ii; ++i) {
                if (resolutions[i] <= maxResolution) {
                    zoom = i;
                    break;
                }
            }
        }
        return zoom;
    },

    /**
     * Method: moveTo
     *
     * Parameters:
     * lonlat - {<OpenLayers.LonLat>}
     * zoom - {Integer}
     * options - {Object}
     */
    moveTo: function(lonlat, zoom, options) {
        if (lonlat != null && !(lonlat instanceof OpenLayers.LonLat)) {
            lonlat = new OpenLayers.LonLat(lonlat);
        }
        if (!options) { 
            options = {};
        }
        if (zoom != null) {
            zoom = parseFloat(zoom);
            if (!this.fractionalZoom) {
                zoom = Math.round(zoom);
            }
        }
        if (this.baseLayer.wrapDateLine) {
            var requestedZoom = zoom;
            zoom = this.adjustZoom(zoom);
            if (zoom !== requestedZoom) {
                // zoom was adjusted, so keep old lonlat to avoid panning
                lonlat = this.getCenter();
            }
        }
        // dragging is false by default
        var dragging = options.dragging || this.dragging;
        // forceZoomChange is false by default
        var forceZoomChange = options.forceZoomChange;

        if (!this.getCachedCenter() && !this.isValidLonLat(lonlat)) {
            lonlat = this.maxExtent.getCenterLonLat();
            this.center = lonlat.clone();
        }

        if(this.restrictedExtent != null) {
            // In 3.0, decide if we want to change interpretation of maxExtent.
            if(lonlat == null) { 
                lonlat = this.center; 
            }
            if(zoom == null) { 
                zoom = this.getZoom(); 
            }
            var resolution = this.getResolutionForZoom(zoom);
            var extent = this.calculateBounds(lonlat, resolution); 
            if(!this.restrictedExtent.containsBounds(extent)) {
                var maxCenter = this.restrictedExtent.getCenterLonLat(); 
                if(extent.getWidth() > this.restrictedExtent.getWidth()) { 
                    lonlat = new OpenLayers.LonLat(maxCenter.lon, lonlat.lat); 
                } else if(extent.left < this.restrictedExtent.left) {
                    lonlat = lonlat.add(this.restrictedExtent.left -
                                        extent.left, 0); 
                } else if(extent.right > this.restrictedExtent.right) { 
                    lonlat = lonlat.add(this.restrictedExtent.right -
                                        extent.right, 0); 
                } 
                if(extent.getHeight() > this.restrictedExtent.getHeight()) { 
                    lonlat = new OpenLayers.LonLat(lonlat.lon, maxCenter.lat); 
                } else if(extent.bottom < this.restrictedExtent.bottom) { 
                    lonlat = lonlat.add(0, this.restrictedExtent.bottom -
                                        extent.bottom); 
                } 
                else if(extent.top > this.restrictedExtent.top) { 
                    lonlat = lonlat.add(0, this.restrictedExtent.top -
                                        extent.top); 
                } 
            }
        }
        
        var zoomChanged = forceZoomChange || (
                            (this.isValidZoomLevel(zoom)) && 
                            (zoom != this.getZoom()) );

        var centerChanged = (this.isValidLonLat(lonlat)) && 
                            (!lonlat.equals(this.center));

        // if neither center nor zoom will change, no need to do anything
        if (zoomChanged || centerChanged || dragging) {
            dragging || this.events.triggerEvent("movestart");

            if (centerChanged) {
                if (!zoomChanged && this.center) { 
                    // if zoom hasnt changed, just slide layerContainer
                    //  (must be done before setting this.center to new value)
                    this.centerLayerContainer(lonlat);
                }
                this.center = lonlat.clone();
            }

            var res = zoomChanged ?
                this.getResolutionForZoom(zoom) : this.getResolution();
            // (re)set the layerContainerDiv's location
            if (zoomChanged || this.layerContainerOrigin == null) {
                this.layerContainerOrigin = this.getCachedCenter();
                this.layerContainerDiv.style.left = "0px";
                this.layerContainerDiv.style.top  = "0px";
                var maxExtent = this.getMaxExtent({restricted: true});
                var maxExtentCenter = maxExtent.getCenterLonLat();
                var lonDelta = this.center.lon - maxExtentCenter.lon;
                var latDelta = maxExtentCenter.lat - this.center.lat;
                var extentWidth = Math.round(maxExtent.getWidth() / res);
                var extentHeight = Math.round(maxExtent.getHeight() / res);
                this.minPx = {
                    x: (this.size.w - extentWidth) / 2 - lonDelta / res,
                    y: (this.size.h - extentHeight) / 2 - latDelta / res
                };
                this.maxPx = {
                    x: this.minPx.x + Math.round(maxExtent.getWidth() / res),
                    y: this.minPx.y + Math.round(maxExtent.getHeight() / res)
                };
            }

            if (zoomChanged) {
                this.zoom = zoom;
                this.resolution = res;
            }    
            
            var bounds = this.getExtent();
            
            //send the move call to the baselayer and all the overlays    

            if(this.baseLayer.visibility) {
                this.baseLayer.moveTo(bounds, zoomChanged, options.dragging);
                options.dragging || this.baseLayer.events.triggerEvent(
                    "moveend", {zoomChanged: zoomChanged}
                );
            }
            
            bounds = this.baseLayer.getExtent();
            
            for (var i=this.layers.length-1; i>=0; --i) {
                var layer = this.layers[i];
                if (layer !== this.baseLayer && !layer.isBaseLayer) {
                    var inRange = layer.calculateInRange();
                    if (layer.inRange != inRange) {
                        // the inRange property has changed. If the layer is
                        // no longer in range, we turn it off right away. If
                        // the layer is no longer out of range, the moveTo
                        // call below will turn on the layer.
                        layer.inRange = inRange;
                        if (!inRange) {
                            layer.display(false);
                        }
                        this.events.triggerEvent("changelayer", {
                            layer: layer, property: "visibility"
                        });
                    }
                    if (inRange && layer.visibility) {
                        layer.moveTo(bounds, zoomChanged, options.dragging);
                        options.dragging || layer.events.triggerEvent(
                            "moveend", {zoomChanged: zoomChanged}
                        );
                    }
                }                
            }
            
            this.events.triggerEvent("move");
            dragging || this.events.triggerEvent("moveend");

            if (zoomChanged) {
                //redraw popups
                for (var i=0, len=this.popups.length; i<len; i++) {
                    this.popups[i].updatePosition();
                }
                this.events.triggerEvent("zoomend");
            }
        }
    },

    /** 
     * Method: centerLayerContainer
     * This function takes care to recenter the layerContainerDiv.
     * 
     * Parameters:
     * lonlat - {<OpenLayers.LonLat>}
     */
    centerLayerContainer: function (lonlat) {
        var originPx = this.getViewPortPxFromLonLat(this.layerContainerOrigin);
        var newPx = this.getViewPortPxFromLonLat(lonlat);

        if ((originPx != null) && (newPx != null)) {
            var oldLeft = parseInt(this.layerContainerDiv.style.left);
            var oldTop = parseInt(this.layerContainerDiv.style.top);
            var newLeft = Math.round(originPx.x - newPx.x);
            var newTop = Math.round(originPx.y - newPx.y);
            this.layerContainerDiv.style.left = newLeft + "px";
            this.layerContainerDiv.style.top  = newTop + "px";
            var dx = oldLeft - newLeft;
            var dy = oldTop - newTop;
            this.minPx.x -= dx;
            this.maxPx.x -= dx;
            this.minPx.y -= dy;
            this.maxPx.y -= dy;
        }        
    },

    /**
     * Method: isValidZoomLevel
     * 
     * Parameters:
     * zoomLevel - {Integer}
     * 
     * Returns:
     * {Boolean} Whether or not the zoom level passed in is non-null and 
     *           within the min/max range of zoom levels.
     */
    isValidZoomLevel: function(zoomLevel) {
        return ( (zoomLevel != null) &&
                 (zoomLevel >= 0) && 
                 (zoomLevel < this.getNumZoomLevels()) );
    },
    
    /**
     * Method: isValidLonLat
     * 
     * Parameters:
     * lonlat - {<OpenLayers.LonLat>}
     * 
     * Returns:
     * {Boolean} Whether or not the lonlat passed in is non-null and within
     *           the maxExtent bounds
     */
    isValidLonLat: function(lonlat) {
        var valid = false;
        if (lonlat != null) {
            var maxExtent = this.getMaxExtent();
            var worldBounds = this.baseLayer.wrapDateLine && maxExtent;
            valid = maxExtent.containsLonLat(lonlat, {worldBounds: worldBounds});
        }
        return valid;
    },

  /********************************************************/
  /*                                                      */
  /*                 Layer Options                        */
  /*                                                      */
  /*    Accessor functions to Layer Options parameters    */
  /*                                                      */
  /********************************************************/
    
    /**
     * APIMethod: getProjection
     * This method returns a string representing the projection. In 
     *     the case of projection support, this will be the srsCode which
     *     is loaded -- otherwise it will simply be the string value that
     *     was passed to the projection at startup.
     *
     * FIXME: In 3.0, we will remove getProjectionObject, and instead
     *     return a Projection object from this function. 
     * 
     * Returns:
     * {String} The Projection string from the base layer or null. 
     */
    getProjection: function() {
        var projection = this.getProjectionObject();
        return projection ? projection.getCode() : null;
    },
    
    /**
     * APIMethod: getProjectionObject
     * Returns the projection obect from the baselayer.
     *
     * Returns:
     * {<OpenLayers.Projection>} The Projection of the base layer.
     */
    getProjectionObject: function() {
        var projection = null;
        if (this.baseLayer != null) {
            projection = this.baseLayer.projection;
        }
        return projection;
    },
    
    /**
     * APIMethod: getMaxResolution
     * 
     * Returns:
     * {String} The Map's Maximum Resolution
     */
    getMaxResolution: function() {
        var maxResolution = null;
        if (this.baseLayer != null) {
            maxResolution = this.baseLayer.maxResolution;
        }
        return maxResolution;
    },
        
    /**
     * APIMethod: getMaxExtent
     *
     * Parameters:
     * options - {Object} 
     * 
     * Allowed Options:
     * restricted - {Boolean} If true, returns restricted extent (if it is 
     *     available.)
     *
     * Returns:
     * {<OpenLayers.Bounds>} The maxExtent property as set on the current 
     *     baselayer, unless the 'restricted' option is set, in which case
     *     the 'restrictedExtent' option from the map is returned (if it
     *     is set).
     */
    getMaxExtent: function (options) {
        var maxExtent = null;
        if(options && options.restricted && this.restrictedExtent){
            maxExtent = this.restrictedExtent;
        } else if (this.baseLayer != null) {
            maxExtent = this.baseLayer.maxExtent;
        }        
        return maxExtent;
    },
    
    /**
     * APIMethod: getNumZoomLevels
     * 
     * Returns:
     * {Integer} The total number of zoom levels that can be displayed by the 
     *           current baseLayer.
     */
    getNumZoomLevels: function() {
        var numZoomLevels = null;
        if (this.baseLayer != null) {
            numZoomLevels = this.baseLayer.numZoomLevels;
        }
        return numZoomLevels;
    },

  /********************************************************/
  /*                                                      */
  /*                 Baselayer Functions                  */
  /*                                                      */
  /*    The following functions, all publicly exposed     */
  /*       in the API?, are all merely wrappers to the    */
  /*       the same calls on whatever layer is set as     */
  /*                the current base layer                */
  /*                                                      */
  /********************************************************/

    /**
     * APIMethod: getExtent
     * 
     * Returns:
     * {<OpenLayers.Bounds>} A Bounds object which represents the lon/lat 
     *                       bounds of the current viewPort. 
     *                       If no baselayer is set, returns null.
     */
    getExtent: function () {
        var extent = null;
        if (this.baseLayer != null) {
            extent = this.baseLayer.getExtent();
        }
        return extent;
    },

    /**
     * APIMethod: getResolution
     * 
     * Returns:
     * {Float} The current resolution of the map. 
     *         If no baselayer is set, returns null.
     */
    getResolution: function () {
        var resolution = null;
        if (this.baseLayer != null) {
            resolution = this.baseLayer.getResolution();
        } else if(this.allOverlays === true && this.layers.length > 0) {
            // while adding the 1st layer to the map in allOverlays mode,
            // this.baseLayer is not set yet when we need the resolution
            // for calculateInRange.
            resolution = this.layers[0].getResolution();
        }
        return resolution;
    },

    /**
     * APIMethod: getUnits
     * 
     * Returns:
     * {Float} The current units of the map. 
     *         If no baselayer is set, returns null.
     */
    getUnits: function () {
        var units = null;
        if (this.baseLayer != null) {
            units = this.baseLayer.units;
        }
        return units;
    },

     /**
      * APIMethod: getScale
      * 
      * Returns:
      * {Float} The current scale denominator of the map. 
      *         If no baselayer is set, returns null.
      */
    getScale: function () {
        var scale = null;
        if (this.baseLayer != null) {
            var res = this.getResolution();
            var units = this.baseLayer.units;
            scale = OpenLayers.Util.getScaleFromResolution(res, units);
        }
        return scale;
    },


    /**
     * APIMethod: getZoomForExtent
     * 
     * Parameters: 
     * bounds - {<OpenLayers.Bounds>}
     * closest - {Boolean} Find the zoom level that most closely fits the 
     *     specified bounds. Note that this may result in a zoom that does 
     *     not exactly contain the entire extent.
     *     Default is false.
     * 
     * Returns:
     * {Integer} A suitable zoom level for the specified bounds.
     *           If no baselayer is set, returns null.
     */
    getZoomForExtent: function (bounds, closest) {
        var zoom = null;
        if (this.baseLayer != null) {
            zoom = this.baseLayer.getZoomForExtent(bounds, closest);
        }
        return zoom;
    },

    /**
     * APIMethod: getResolutionForZoom
     * 
     * Parameters:
     * zoom - {Float}
     * 
     * Returns:
     * {Float} A suitable resolution for the specified zoom.  If no baselayer
     *     is set, returns null.
     */
    getResolutionForZoom: function(zoom) {
        var resolution = null;
        if(this.baseLayer) {
            resolution = this.baseLayer.getResolutionForZoom(zoom);
        }
        return resolution;
    },

    /**
     * APIMethod: getZoomForResolution
     * 
     * Parameters:
     * resolution - {Float}
     * closest - {Boolean} Find the zoom level that corresponds to the absolute 
     *     closest resolution, which may result in a zoom whose corresponding
     *     resolution is actually smaller than we would have desired (if this
     *     is being called from a getZoomForExtent() call, then this means that
     *     the returned zoom index might not actually contain the entire 
     *     extent specified... but it'll be close).
     *     Default is false.
     * 
     * Returns:
     * {Integer} A suitable zoom level for the specified resolution.
     *           If no baselayer is set, returns null.
     */
    getZoomForResolution: function(resolution, closest) {
        var zoom = null;
        if (this.baseLayer != null) {
            zoom = this.baseLayer.getZoomForResolution(resolution, closest);
        }
        return zoom;
    },

  /********************************************************/
  /*                                                      */
  /*                  Zooming Functions                   */
  /*                                                      */
  /*    The following functions, all publicly exposed     */
  /*       in the API, are all merely wrappers to the     */
  /*               the setCenter() function               */
  /*                                                      */
  /********************************************************/
  
    /** 
     * APIMethod: zoomTo
     * Zoom to a specific zoom level
     * 
     * Parameters:
     * zoom - {Integer}
     */
    zoomTo: function(zoom) {
        if (this.isValidZoomLevel(zoom)) {
            this.setCenter(null, zoom);
        }
    },
    
    /**
     * APIMethod: zoomIn
     * 
     */
    zoomIn: function() {
        this.zoomTo(this.getZoom() + 1);
    },
    
    /**
     * APIMethod: zoomOut
     * 
     */
    zoomOut: function() {
        this.zoomTo(this.getZoom() - 1);
    },

    /**
     * APIMethod: zoomToExtent
     * Zoom to the passed in bounds, recenter
     * 
     * Parameters:
     * bounds - {<OpenLayers.Bounds>|Array} If provided as an array, the array
     *     should consist of four values (left, bottom, right, top).
     * closest - {Boolean} Find the zoom level that most closely fits the 
     *     specified bounds. Note that this may result in a zoom that does 
     *     not exactly contain the entire extent.
     *     Default is false.
     * 
     */
    zoomToExtent: function(bounds, closest) {
        if (!(bounds instanceof OpenLayers.Bounds)) {
            bounds = new OpenLayers.Bounds(bounds);
        }
        var center = bounds.getCenterLonLat();
        if (this.baseLayer.wrapDateLine) {
            var maxExtent = this.getMaxExtent();

            //fix straddling bounds (in the case of a bbox that straddles the 
            // dateline, it's left and right boundaries will appear backwards. 
            // we fix this by allowing a right value that is greater than the
            // max value at the dateline -- this allows us to pass a valid 
            // bounds to calculate zoom)
            //
            bounds = bounds.clone();
            while (bounds.right < bounds.left) {
                bounds.right += maxExtent.getWidth();
            }
            //if the bounds was straddling (see above), then the center point 
            // we got from it was wrong. So we take our new bounds and ask it
            // for the center.
            //
            center = bounds.getCenterLonLat().wrapDateLine(maxExtent);
        }
        this.setCenter(center, this.getZoomForExtent(bounds, closest));
    },

    /** 
     * APIMethod: zoomToMaxExtent
     * Zoom to the full extent and recenter.
     *
     * Parameters:
     * options - {Object}
     * 
     * Allowed Options:
     * restricted - {Boolean} True to zoom to restricted extent if it is 
     *     set. Defaults to true.
     */
    zoomToMaxExtent: function(options) {
        //restricted is true by default
        var restricted = (options) ? options.restricted : true;

        var maxExtent = this.getMaxExtent({
            'restricted': restricted 
        });
        this.zoomToExtent(maxExtent);
    },

    /** 
     * APIMethod: zoomToScale
     * Zoom to a specified scale 
     * 
     * Parameters:
     * scale - {float}
     * closest - {Boolean} Find the zoom level that most closely fits the 
     *     specified scale. Note that this may result in a zoom that does 
     *     not exactly contain the entire extent.
     *     Default is false.
     * 
     */
    zoomToScale: function(scale, closest) {
        var res = OpenLayers.Util.getResolutionFromScale(scale, 
                                                         this.baseLayer.units);

        var halfWDeg = (this.size.w * res) / 2;
        var halfHDeg = (this.size.h * res) / 2;
        var center = this.getCachedCenter();

        var extent = new OpenLayers.Bounds(center.lon - halfWDeg,
                                           center.lat - halfHDeg,
                                           center.lon + halfWDeg,
                                           center.lat + halfHDeg);
        this.zoomToExtent(extent, closest);
    },
    
  /********************************************************/
  /*                                                      */
  /*             Translation Functions                    */
  /*                                                      */
  /*      The following functions translate between       */
  /*           LonLat, LayerPx, and ViewPortPx            */
  /*                                                      */
  /********************************************************/
      
  //
  // TRANSLATION: LonLat <-> ViewPortPx
  //

    /**
     * Method: getLonLatFromViewPortPx
     * 
     * Parameters:
     * viewPortPx - {<OpenLayers.Pixel>|Object} An OpenLayers.Pixel or
     *                                          an object with a 'x'
     *                                          and 'y' properties.
     * 
     * Returns:
     * {<OpenLayers.LonLat>} An OpenLayers.LonLat which is the passed-in view 
     *                       port <OpenLayers.Pixel>, translated into lon/lat
     *                       by the current base layer.
     */
    getLonLatFromViewPortPx: function (viewPortPx) {
        var lonlat = null; 
        if (this.baseLayer != null) {
            lonlat = this.baseLayer.getLonLatFromViewPortPx(viewPortPx);
        }
        return lonlat;
    },

    /**
     * APIMethod: getViewPortPxFromLonLat
     * 
     * Parameters:
     * lonlat - {<OpenLayers.LonLat>}
     * 
     * Returns:
     * {<OpenLayers.Pixel>} An OpenLayers.Pixel which is the passed-in 
     *                      <OpenLayers.LonLat>, translated into view port 
     *                      pixels by the current base layer.
     */
    getViewPortPxFromLonLat: function (lonlat) {
        var px = null; 
        if (this.baseLayer != null) {
            px = this.baseLayer.getViewPortPxFromLonLat(lonlat);
        }
        return px;
    },

    
  //
  // CONVENIENCE TRANSLATION FUNCTIONS FOR API
  //

    /**
     * APIMethod: getLonLatFromPixel
     * 
     * Parameters:
     * px - {<OpenLayers.Pixel>|Object} An OpenLayers.Pixel or an object with
     *                                  a 'x' and 'y' properties.
     *
     * Returns:
     * {<OpenLayers.LonLat>} An OpenLayers.LonLat corresponding to the given
     *                       OpenLayers.Pixel, translated into lon/lat by the 
     *                       current base layer
     */
    getLonLatFromPixel: function (px) {
        return this.getLonLatFromViewPortPx(px);
    },

    /**
     * APIMethod: getPixelFromLonLat
     * Returns a pixel location given a map location.  The map location is
     *     translated to an integer pixel location (in viewport pixel
     *     coordinates) by the current base layer.
     * 
     * Parameters:
     * lonlat - {<OpenLayers.LonLat>} A map location.
     * 
     * Returns: 
     * {<OpenLayers.Pixel>} An OpenLayers.Pixel corresponding to the 
     *     <OpenLayers.LonLat> translated into view port pixels by the current
     *     base layer.
     */
    getPixelFromLonLat: function (lonlat) {
        var px = this.getViewPortPxFromLonLat(lonlat);
        px.x = Math.round(px.x);
        px.y = Math.round(px.y);
        return px;
    },
    
    /**
     * Method: getGeodesicPixelSize
     * 
     * Parameters:
     * px - {<OpenLayers.Pixel>} The pixel to get the geodesic length for. If
     *     not provided, the center pixel of the map viewport will be used.
     * 
     * Returns:
     * {<OpenLayers.Size>} The geodesic size of the pixel in kilometers.
     */
    getGeodesicPixelSize: function(px) {
        var lonlat = px ? this.getLonLatFromPixel(px) : (
            this.getCachedCenter() || new OpenLayers.LonLat(0, 0));
        var res = this.getResolution();
        var left = lonlat.add(-res / 2, 0);
        var right = lonlat.add(res / 2, 0);
        var bottom = lonlat.add(0, -res / 2);
        var top = lonlat.add(0, res / 2);
        var dest = new OpenLayers.Projection("EPSG:4326");
        var source = this.getProjectionObject() || dest;
        if(!source.equals(dest)) {
            left.transform(source, dest);
            right.transform(source, dest);
            bottom.transform(source, dest);
            top.transform(source, dest);
        }
        
        return new OpenLayers.Size(
            OpenLayers.Util.distVincenty(left, right),
            OpenLayers.Util.distVincenty(bottom, top)
        );
    },



  //
  // TRANSLATION: ViewPortPx <-> LayerPx
  //

    /**
     * APIMethod: getViewPortPxFromLayerPx
     * 
     * Parameters:
     * layerPx - {<OpenLayers.Pixel>}
     * 
     * Returns:
     * {<OpenLayers.Pixel>} Layer Pixel translated into ViewPort Pixel 
     *                      coordinates
     */
    getViewPortPxFromLayerPx:function(layerPx) {
        var viewPortPx = null;
        if (layerPx != null) {
            var dX = parseInt(this.layerContainerDiv.style.left);
            var dY = parseInt(this.layerContainerDiv.style.top);
            viewPortPx = layerPx.add(dX, dY);            
        }
        return viewPortPx;
    },
    
    /**
     * APIMethod: getLayerPxFromViewPortPx
     * 
     * Parameters:
     * viewPortPx - {<OpenLayers.Pixel>}
     * 
     * Returns:
     * {<OpenLayers.Pixel>} ViewPort Pixel translated into Layer Pixel 
     *                      coordinates
     */
    getLayerPxFromViewPortPx:function(viewPortPx) {
        var layerPx = null;
        if (viewPortPx != null) {
            var dX = -parseInt(this.layerContainerDiv.style.left);
            var dY = -parseInt(this.layerContainerDiv.style.top);
            layerPx = viewPortPx.add(dX, dY);
            if (isNaN(layerPx.x) || isNaN(layerPx.y)) {
                layerPx = null;
            }
        }
        return layerPx;
    },
    
  //
  // TRANSLATION: LonLat <-> LayerPx
  //

    /**
     * Method: getLonLatFromLayerPx
     * 
     * Parameters:
     * px - {<OpenLayers.Pixel>}
     *
     * Returns:
     * {<OpenLayers.LonLat>}
     */
    getLonLatFromLayerPx: function (px) {
       //adjust for displacement of layerContainerDiv
       px = this.getViewPortPxFromLayerPx(px);
       return this.getLonLatFromViewPortPx(px);         
    },
    
    /**
     * APIMethod: getLayerPxFromLonLat
     * 
     * Parameters:
     * lonlat - {<OpenLayers.LonLat>} lonlat
     *
     * Returns:
     * {<OpenLayers.Pixel>} An OpenLayers.Pixel which is the passed-in 
     *                      <OpenLayers.LonLat>, translated into layer pixels 
     *                      by the current base layer
     */
    getLayerPxFromLonLat: function (lonlat) {
       //adjust for displacement of layerContainerDiv
       var px = this.getPixelFromLonLat(lonlat);
       return this.getLayerPxFromViewPortPx(px);         
    },

    CLASS_NAME: "OpenLayers.Map"
});

/**
 * Constant: TILE_WIDTH
 * {Integer} 256 Default tile width (unless otherwise specified)
 */
OpenLayers.Map.TILE_WIDTH = 256;
/**
 * Constant: TILE_HEIGHT
 * {Integer} 256 Default tile height (unless otherwise specified)
 */
OpenLayers.Map.TILE_HEIGHT = 256;
/* ======================================================================
    OpenLayers/Layer.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


/**
 * @requires OpenLayers/BaseTypes/Class.js
 * @requires OpenLayers/Map.js
 * @requires OpenLayers/Projection.js
 */

/**
 * Class: OpenLayers.Layer
 */
OpenLayers.Layer = OpenLayers.Class({

    /**
     * APIProperty: id
     * {String}
     */
    id: null,

    /** 
     * APIProperty: name
     * {String}
     */
    name: null,

    /** 
     * APIProperty: div
     * {DOMElement}
     */
    div: null,

    /**
     * APIProperty: opacity
     * {Float} The layer's opacity. Float number between 0.0 and 1.0. Default
     * is 1.
     */
    opacity: 1,

    /**
     * APIProperty: alwaysInRange
     * {Boolean} If a layer's display should not be scale-based, this should 
     *     be set to true. This will cause the layer, as an overlay, to always 
     *     be 'active', by always returning true from the calculateInRange() 
     *     function. 
     * 
     *     If not explicitly specified for a layer, its value will be 
     *     determined on startup in initResolutions() based on whether or not 
     *     any scale-specific properties have been set as options on the 
     *     layer. If no scale-specific options have been set on the layer, we 
     *     assume that it should always be in range.
     * 
     *     See #987 for more info.
     */
    alwaysInRange: null,   

    /**
     * Constant: RESOLUTION_PROPERTIES
     * {Array} The properties that are used for calculating resolutions
     *     information.
     */
    RESOLUTION_PROPERTIES: [
        'scales', 'resolutions',
        'maxScale', 'minScale',
        'maxResolution', 'minResolution',
        'numZoomLevels', 'maxZoomLevel'
    ],

    /**
     * APIProperty: events
     * {<OpenLayers.Events>}
     *
     * Register a listener for a particular event with the following syntax:
     * (code)
     * layer.events.register(type, obj, listener);
     * (end)
     *
     * Listeners will be called with a reference to an event object.  The
     *     properties of this event depends on exactly what happened.
     *
     * All event objects have at least the following properties:
     * object - {Object} A reference to layer.events.object.
     * element - {DOMElement} A reference to layer.events.element.
     *
     * Supported map event types:
     * loadstart - Triggered when layer loading starts.
     * loadend - Triggered when layer loading ends.
     * visibilitychanged - Triggered when layer visibility is changed.
     * move - Triggered when layer moves (triggered with every mousemove
     *     during a drag).
     * moveend - Triggered when layer is done moving, object passed as
     *     argument has a zoomChanged boolean property which tells that the
     *     zoom has changed.
     * added - Triggered after the layer is added to a map.  Listeners will
     *     receive an object with a *map* property referencing the map and a
     *     *layer* property referencing the layer.
     * removed - Triggered after the layer is removed from the map.  Listeners
     *     will receive an object with a *map* property referencing the map and
     *     a *layer* property referencing the layer.
     */
    events: null,

    /**
     * APIProperty: map
     * {<OpenLayers.Map>} This variable is set when the layer is added to 
     *     the map, via the accessor function setMap().
     */
    map: null,
    
    /**
     * APIProperty: isBaseLayer
     * {Boolean} Whether or not the layer is a base layer. This should be set 
     *     individually by all subclasses. Default is false
     */
    isBaseLayer: false,
 
    /**
     * Property: alpha
     * {Boolean} The layer's images have an alpha channel.  Default is false. 
     */
    alpha: false,

    /** 
     * APIProperty: displayInLayerSwitcher
     * {Boolean} Display the layer's name in the layer switcher.  Default is
     *     true.
     */
    displayInLayerSwitcher: true,

    /**
     * APIProperty: visibility
     * {Boolean} The layer should be displayed in the map.  Default is true.
     */
    visibility: true,

    /**
     * APIProperty: attribution
     * {String} Attribution string, displayed when an 
     *     <OpenLayers.Control.Attribution> has been added to the map.
     */
    attribution: null, 

    /** 
     * Property: inRange
     * {Boolean} The current map resolution is within the layer's min/max 
     *     range. This is set in <OpenLayers.Map.setCenter> whenever the zoom 
     *     changes.
     */
    inRange: false,
    
    /**
     * Propery: imageSize
     * {<OpenLayers.Size>} For layers with a gutter, the image is larger than 
     *     the tile by twice the gutter in each dimension.
     */
    imageSize: null,
    
  // OPTIONS

    /** 
     * Property: options
     * {Object} An optional object whose properties will be set on the layer.
     *     Any of the layer properties can be set as a property of the options
     *     object and sent to the constructor when the layer is created.
     */
    options: null,

    /**
     * APIProperty: eventListeners
     * {Object} If set as an option at construction, the eventListeners
     *     object will be registered with <OpenLayers.Events.on>.  Object
     *     structure must be a listeners object as shown in the example for
     *     the events.on method.
     */
    eventListeners: null,

    /**
     * APIProperty: gutter
     * {Integer} Determines the width (in pixels) of the gutter around image
     *     tiles to ignore.  By setting this property to a non-zero value,
     *     images will be requested that are wider and taller than the tile
     *     size by a value of 2 x gutter.  This allows artifacts of rendering
     *     at tile edges to be ignored.  Set a gutter value that is equal to
     *     half the size of the widest symbol that needs to be displayed.
     *     Defaults to zero.  Non-tiled layers always have zero gutter.
     */ 
    gutter: 0, 

    /**
     * APIProperty: projection
     * {<OpenLayers.Projection>} or {<String>} Specifies the projection of the layer.
     *     Can be set in the layer options. If not specified in the layer options,
     *     it is set to the default projection specified in the map,
     *     when the layer is added to the map.
     *     Projection along with default maxExtent and resolutions
     *     are set automatically with commercial baselayers in EPSG:3857,
     *     such as Google, Bing and OpenStreetMap, and do not need to be specified.
     *     Otherwise, if specifying projection, also set maxExtent,
     *     maxResolution or resolutions as appropriate.
     *     When using vector layers with strategies, layer projection should be set
     *     to the projection of the source data if that is different from the map default.
     * 
     *     Can be either a string or an <OpenLayers.Projection> object;
     *     if a string is passed, will be converted to an object when
     *     the layer is added to the map.
     * 
     */
    projection: null,    
    
    /**
     * APIProperty: units
     * {String} The layer map units.  Defaults to null.  Possible values
     *     are 'degrees' (or 'dd'), 'm', 'ft', 'km', 'mi', 'inches'.
     *     Normally taken from the projection.
     *     Only required if both map and layers do not define a projection,
     *     or if they define a projection which does not define units.
     */
    units: null,

    /**
     * APIProperty: scales
     * {Array}  An array of map scales in descending order.  The values in the
     *     array correspond to the map scale denominator.  Note that these
     *     values only make sense if the display (monitor) resolution of the
     *     client is correctly guessed by whomever is configuring the
     *     application.  In addition, the units property must also be set.
     *     Use <resolutions> instead wherever possible.
     */
    scales: null,

    /**
     * APIProperty: resolutions
     * {Array} A list of map resolutions (map units per pixel) in descending
     *     order.  If this is not set in the layer constructor, it will be set
     *     based on other resolution related properties (maxExtent,
     *     maxResolution, maxScale, etc.).
     */
    resolutions: null,
    
    /**
     * APIProperty: maxExtent
     * {<OpenLayers.Bounds>|Array} If provided as an array, the array
     *     should consist of four values (left, bottom, right, top).
     *     The maximum extent for the layer.  Defaults to null.
     * 
     *     The center of these bounds will not stray outside
     *     of the viewport extent during panning.  In addition, if
     *     <displayOutsideMaxExtent> is set to false, data will not be
     *     requested that falls completely outside of these bounds.
     */
    maxExtent: null,
    
    /**
     * APIProperty: minExtent
     * {<OpenLayers.Bounds>|Array} If provided as an array, the array
     *     should consist of four values (left, bottom, right, top).
     *     The minimum extent for the layer.  Defaults to null.
     */
    minExtent: null,
    
    /**
     * APIProperty: maxResolution
     * {Float} Default max is 360 deg / 256 px, which corresponds to
     *     zoom level 0 on gmaps.  Specify a different value in the layer 
     *     options if you are not using the default <OpenLayers.Map.tileSize>
     *     and displaying the whole world.
     */
    maxResolution: null,

    /**
     * APIProperty: minResolution
     * {Float}
     */
    minResolution: null,

    /**
     * APIProperty: numZoomLevels
     * {Integer}
     */
    numZoomLevels: null,
    
    /**
     * APIProperty: minScale
     * {Float}
     */
    minScale: null,
    
    /**
     * APIProperty: maxScale
     * {Float}
     */
    maxScale: null,

    /**
     * APIProperty: displayOutsideMaxExtent
     * {Boolean} Request map tiles that are completely outside of the max 
     *     extent for this layer. Defaults to false.
     */
    displayOutsideMaxExtent: false,

    /**
     * APIProperty: wrapDateLine
     * {Boolean} Wraps the world at the international dateline, so the map can
     * be panned infinitely in longitudinal direction. Only use this on the
     * base layer, and only if the layer's maxExtent equals the world bounds.
     * #487 for more info.   
     */
    wrapDateLine: false,
    
    /**
     * Property: metadata
     * {Object} This object can be used to store additional information on a
     *     layer object.
     */
    metadata: null,
    
    /**
     * Constructor: OpenLayers.Layer
     *
     * Parameters:
     * name - {String} The layer name
     * options - {Object} Hashtable of extra options to tag onto the layer
     */
    initialize: function(name, options) {

        this.metadata = {};
        
        options = OpenLayers.Util.extend({}, options);
        // make sure we respect alwaysInRange if set on the prototype
        if (this.alwaysInRange != null) {
            options.alwaysInRange = this.alwaysInRange;
        }
        this.addOptions(options);

        this.name = name;
        
        if (this.id == null) {

            this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_");

            this.div = OpenLayers.Util.createDiv(this.id);
            this.div.style.width = "100%";
            this.div.style.height = "100%";
            this.div.dir = "ltr";

            this.events = new OpenLayers.Events(this, this.div);
            if(this.eventListeners instanceof Object) {
                this.events.on(this.eventListeners);
            }

        }
    },
    
    /**
     * Method: destroy
     * Destroy is a destructor: this is to alleviate cyclic references which
     *     the Javascript garbage cleaner can not take care of on its own.
     *
     * Parameters:
     * setNewBaseLayer - {Boolean} Set a new base layer when this layer has
     *     been destroyed.  Default is true.
     */
    destroy: function(setNewBaseLayer) {
        if (setNewBaseLayer == null) {
            setNewBaseLayer = true;
        }
        if (this.map != null) {
            this.map.removeLayer(this, setNewBaseLayer);
        }
        this.projection = null;
        this.map = null;
        this.name = null;
        this.div = null;
        this.options = null;

        if (this.events) {
            if(this.eventListeners) {
                this.events.un(this.eventListeners);
            }
            this.events.destroy();
        }
        this.eventListeners = null;
        this.events = null;
    },
    
   /**
    * Method: clone
    *
    * Parameters:
    * obj - {<OpenLayers.Layer>} The layer to be cloned
    *
    * Returns:
    * {<OpenLayers.Layer>} An exact clone of this <OpenLayers.Layer>
    */
    clone: function (obj) {
        
        if (obj == null) {
            obj = new OpenLayers.Layer(this.name, this.getOptions());
        }
        
        // catch any randomly tagged-on properties
        OpenLayers.Util.applyDefaults(obj, this);
        
        // a cloned layer should never have its map property set
        //  because it has not been added to a map yet. 
        obj.map = null;
        
        return obj;
    },
    
    /**
     * Method: getOptions
     * Extracts an object from the layer with the properties that were set as
     *     options, but updates them with the values currently set on the
     *     instance.
     * 
     * Returns:
     * {Object} the <options> of the layer, representing the current state.
     */
    getOptions: function() {
        var options = {};
        for(var o in this.options) {
            options[o] = this[o];
        }
        return options;
    },
    
    /** 
     * APIMethod: setName
     * Sets the new layer name for this layer.  Can trigger a changelayer event
     *     on the map.
     *
     * Parameters:
     * newName - {String} The new name.
     */
    setName: function(newName) {
        if (newName != this.name) {
            this.name = newName;
            if (this.map != null) {
                this.map.events.triggerEvent("changelayer", {
                    layer: this,
                    property: "name"
                });
            }
        }
    },    
    
   /**
    * APIMethod: addOptions
    * 
    * Parameters:
    * newOptions - {Object}
    * reinitialize - {Boolean} If set to true, and if resolution options of the
    *     current baseLayer were changed, the map will be recentered to make
    *     sure that it is displayed with a valid resolution, and a
    *     changebaselayer event will be triggered.
    */
    addOptions: function (newOptions, reinitialize) {

        if (this.options == null) {
            this.options = {};
        }
        
        if (newOptions) {
            // make sure this.projection references a projection object
            if(typeof newOptions.projection == "string") {
                newOptions.projection = new OpenLayers.Projection(newOptions.projection);
            }
            if (newOptions.projection) {
                // get maxResolution, units and maxExtent from projection defaults if
                // they are not defined already
                OpenLayers.Util.applyDefaults(newOptions,
                    OpenLayers.Projection.defaults[newOptions.projection.getCode()]);
            }
            // allow array for extents
            if (newOptions.maxExtent && !(newOptions.maxExtent instanceof OpenLayers.Bounds)) {
                newOptions.maxExtent = new OpenLayers.Bounds(newOptions.maxExtent);
            }
            if (newOptions.minExtent && !(newOptions.minExtent instanceof OpenLayers.Bounds)) {
                newOptions.minExtent = new OpenLayers.Bounds(newOptions.minExtent);
            }
        }

        // update our copy for clone
        OpenLayers.Util.extend(this.options, newOptions);

        // add new options to this
        OpenLayers.Util.extend(this, newOptions);
        
        // get the units from the projection, if we have a projection
        // and it it has units
        if(this.projection && this.projection.getUnits()) {
            this.units = this.projection.getUnits();
        }

        // re-initialize resolutions if necessary, i.e. if any of the
        // properties of the "properties" array defined below is set
        // in the new options
        if(this.map) {
            // store current resolution so we can try to restore it later
            var resolution = this.map.getResolution();
            var properties = this.RESOLUTION_PROPERTIES.concat(
                ["projection", "units", "minExtent", "maxExtent"]
            );
            for(var o in newOptions) {
                if(newOptions.hasOwnProperty(o) &&
                   OpenLayers.Util.indexOf(properties, o) >= 0) {

                    this.initResolutions();
                    if (reinitialize && this.map.baseLayer === this) {
                        // update map position, and restore previous resolution
                        this.map.setCenter(this.map.getCenter(),
                            this.map.getZoomForResolution(resolution),
                            false, true
                        );
                        // trigger a changebaselayer event to make sure that
                        // all controls (especially
                        // OpenLayers.Control.PanZoomBar) get notified of the
                        // new options
                        this.map.events.triggerEvent("changebaselayer", {
                            layer: this
                        });
                    }
                    break;
                }
            }
        }
    },

    /**
     * APIMethod: onMapResize
     * This function can be implemented by subclasses
     */
    onMapResize: function() {
        //this function can be implemented by subclasses  
    },

    /**
     * APIMethod: redraw
     * Redraws the layer.  Returns true if the layer was redrawn, false if not.
     *
     * Returns:
     * {Boolean} The layer was redrawn.
     */
    redraw: function() {
        var redrawn = false;
        if (this.map) {

            // min/max Range may have changed
            this.inRange = this.calculateInRange();

            // map's center might not yet be set
            var extent = this.getExtent();

            if (extent && this.inRange && this.visibility) {
                var zoomChanged = true;
                this.moveTo(extent, zoomChanged, false);
                this.events.triggerEvent("moveend",
                    {"zoomChanged": zoomChanged});
                redrawn = true;
            }
        }
        return redrawn;
    },

    /**
     * Method: moveTo
     * 
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     * zoomChanged - {Boolean} Tells when zoom has changed, as layers have to
     *     do some init work in that case.
     * dragging - {Boolean}
     */
    moveTo:function(bounds, zoomChanged, dragging) {
        var display = this.visibility;
        if (!this.isBaseLayer) {
            display = display && this.inRange;
        }
        this.display(display);
    },

    /**
     * Method: moveByPx
     * Move the layer based on pixel vector. To be implemented by subclasses.
     *
     * Parameters:
     * dx - {Number} The x coord of the displacement vector.
     * dy - {Number} The y coord of the displacement vector.
     */
    moveByPx: function(dx, dy) {
    },

    /**
     * Method: setMap
     * Set the map property for the layer. This is done through an accessor
     *     so that subclasses can override this and take special action once 
     *     they have their map variable set. 
     * 
     *     Here we take care to bring over any of the necessary default 
     *     properties from the map. 
     * 
     * Parameters:
     * map - {<OpenLayers.Map>}
     */
    setMap: function(map) {
        if (this.map == null) {
        
            this.map = map;
            
            // grab some essential layer data from the map if it hasn't already
            //  been set
            this.maxExtent = this.maxExtent || this.map.maxExtent;
            this.minExtent = this.minExtent || this.map.minExtent;

            this.projection = this.projection || this.map.projection;
            if (typeof this.projection == "string") {
                this.projection = new OpenLayers.Projection(this.projection);
            }

            // Check the projection to see if we can get units -- if not, refer
            // to properties.
            this.units = this.projection.getUnits() ||
                         this.units || this.map.units;
            
            this.initResolutions();
            
            if (!this.isBaseLayer) {
                this.inRange = this.calculateInRange();
                var show = ((this.visibility) && (this.inRange));
                this.div.style.display = show ? "" : "none";
            }
            
            // deal with gutters
            this.setTileSize();
        }
    },
    
    /**
     * Method: afterAdd
     * Called at the end of the map.addLayer sequence.  At this point, the map
     *     will have a base layer.  To be overridden by subclasses.
     */
    afterAdd: function() {
    },
    
    /**
     * APIMethod: removeMap
     * Just as setMap() allows each layer the possibility to take a 
     *     personalized action on being added to the map, removeMap() allows
     *     each layer to take a personalized action on being removed from it. 
     *     For now, this will be mostly unused, except for the EventPane layer,
     *     which needs this hook so that it can remove the special invisible
     *     pane. 
     * 
     * Parameters:
     * map - {<OpenLayers.Map>}
     */
    removeMap: function(map) {
        //to be overridden by subclasses
    },
    
    /**
     * APIMethod: getImageSize
     *
     * Parameters:
     * bounds - {<OpenLayers.Bounds>} optional tile bounds, can be used
     *     by subclasses that have to deal with different tile sizes at the
     *     layer extent edges (e.g. Zoomify)
     * 
     * Returns:
     * {<OpenLayers.Size>} The size that the image should be, taking into 
     *     account gutters.
     */ 
    getImageSize: function(bounds) { 
        return (this.imageSize || this.tileSize); 
    },    
  
    /**
     * APIMethod: setTileSize
     * Set the tile size based on the map size.  This also sets layer.imageSize
     *     or use by Tile.Image.
     * 
     * Parameters:
     * size - {<OpenLayers.Size>}
     */
    setTileSize: function(size) {
        var tileSize = (size) ? size :
                                ((this.tileSize) ? this.tileSize :
                                                   this.map.getTileSize());
        this.tileSize = tileSize;
        if(this.gutter) {
          // layers with gutters need non-null tile sizes
          //if(tileSize == null) {
          //    OpenLayers.console.error("Error in layer.setMap() for " +
          //                              this.name + ": layers with " +
          //                              "gutters need non-null tile sizes");
          //}
            this.imageSize = new OpenLayers.Size(tileSize.w + (2*this.gutter), 
                                                 tileSize.h + (2*this.gutter)); 
        }
    },

    /**
     * APIMethod: getVisibility
     * 
     * Returns:
     * {Boolean} The layer should be displayed (if in range).
     */
    getVisibility: function() {
        return this.visibility;
    },

    /** 
     * APIMethod: setVisibility
     * Set the visibility flag for the layer and hide/show & redraw 
     *     accordingly. Fire event unless otherwise specified
     * 
     * Note that visibility is no longer simply whether or not the layer's
     *     style.display is set to "block". Now we store a 'visibility' state 
     *     property on the layer class, this allows us to remember whether or 
     *     not we *desire* for a layer to be visible. In the case where the 
     *     map's resolution is out of the layer's range, this desire may be 
     *     subverted.
     * 
     * Parameters:
     * visibility - {Boolean} Whether or not to display the layer (if in range)
     */
    setVisibility: function(visibility) {
        if (visibility != this.visibility) {
            this.visibility = visibility;
            this.display(visibility);
            this.redraw();
            if (this.map != null) {
                this.map.events.triggerEvent("changelayer", {
                    layer: this,
                    property: "visibility"
                });
            }
            this.events.triggerEvent("visibilitychanged");
        }
    },

    /** 
     * APIMethod: display
     * Hide or show the Layer. This is designed to be used internally, and 
     *     is not generally the way to enable or disable the layer. For that,
     *     use the setVisibility function instead..
     * 
     * Parameters:
     * display - {Boolean}
     */
    display: function(display) {
        if (display != (this.div.style.display != "none")) {
            this.div.style.display = (display && this.calculateInRange()) ? "block" : "none";
        }
    },

    /**
     * APIMethod: calculateInRange
     * 
     * Returns:
     * {Boolean} The layer is displayable at the current map's current
     *     resolution. Note that if 'alwaysInRange' is true for the layer, 
     *     this function will always return true.
     */
    calculateInRange: function() {
        var inRange = false;

        if (this.alwaysInRange) {
            inRange = true;
        } else {
            if (this.map) {
                var resolution = this.map.getResolution();
                inRange = ( (resolution >= this.minResolution) &&
                            (resolution <= this.maxResolution) );
            }
        }
        return inRange;
    },

    /** 
     * APIMethod: setIsBaseLayer
     * 
     * Parameters:
     * isBaseLayer - {Boolean}
     */
    setIsBaseLayer: function(isBaseLayer) {
        if (isBaseLayer != this.isBaseLayer) {
            this.isBaseLayer = isBaseLayer;
            if (this.map != null) {
                this.map.events.triggerEvent("changebaselayer", {
                    layer: this
                });
            }
        }
    },

  /********************************************************/
  /*                                                      */
  /*                 Baselayer Functions                  */
  /*                                                      */
  /********************************************************/
  
    /** 
     * Method: initResolutions
     * This method's responsibility is to set up the 'resolutions' array 
     *     for the layer -- this array is what the layer will use to interface
     *     between the zoom levels of the map and the resolution display 
     *     of the layer.
     * 
     * The user has several options that determine how the array is set up.
     *  
     * For a detailed explanation, see the following wiki from the 
     *     openlayers.org homepage:
     *     http://trac.openlayers.org/wiki/SettingZoomLevels
     */
    initResolutions: function() {

        // ok we want resolutions, here's our strategy:
        //
        // 1. if resolutions are defined in the layer config, use them
        // 2. else, if scales are defined in the layer config then derive
        //    resolutions from these scales
        // 3. else, attempt to calculate resolutions from maxResolution,
        //    minResolution, numZoomLevels, maxZoomLevel set in the
        //    layer config
        // 4. if we still don't have resolutions, and if resolutions
        //    are defined in the same, use them
        // 5. else, if scales are defined in the map then derive
        //    resolutions from these scales
        // 6. else, attempt to calculate resolutions from maxResolution,
        //    minResolution, numZoomLevels, maxZoomLevel set in the
        //    map
        // 7. hope for the best!

        var i, len, p;
        var props = {}, alwaysInRange = true;

        // get resolution data from layer config
        // (we also set alwaysInRange in the layer as appropriate)
        for(i=0, len=this.RESOLUTION_PROPERTIES.length; i<len; i++) {
            p = this.RESOLUTION_PROPERTIES[i];
            props[p] = this.options[p];
            if(alwaysInRange && this.options[p]) {
                alwaysInRange = false;
            }
        }
        if(this.options.alwaysInRange == null) {
            this.alwaysInRange = alwaysInRange;
        }

        // if we don't have resolutions then attempt to derive them from scales
        if(props.resolutions == null) {
            props.resolutions = this.resolutionsFromScales(props.scales);
        }

        // if we still don't have resolutions then attempt to calculate them
        if(props.resolutions == null) {
            props.resolutions = this.calculateResolutions(props);
        }

        // if we couldn't calculate resolutions then we look at we have
        // in the map
        if(props.resolutions == null) {
            for(i=0, len=this.RESOLUTION_PROPERTIES.length; i<len; i++) {
                p = this.RESOLUTION_PROPERTIES[i];
                props[p] = this.options[p] != null ?
                    this.options[p] : this.map[p];
            }
            if(props.resolutions == null) {
                props.resolutions = this.resolutionsFromScales(props.scales);
            }
            if(props.resolutions == null) {
                props.resolutions = this.calculateResolutions(props);
            }
        }

        // ok, we new need to set properties in the instance

        // get maxResolution from the config if it's defined there
        var maxResolution;
        if(this.options.maxResolution &&
           this.options.maxResolution !== "auto") {
            maxResolution = this.options.maxResolution;
        }
        if(this.options.minScale) {
            maxResolution = OpenLayers.Util.getResolutionFromScale(
                this.options.minScale, this.units);
        }

        // get minResolution from the config if it's defined there
        var minResolution;
        if(this.options.minResolution &&
           this.options.minResolution !== "auto") {
            minResolution = this.options.minResolution;
        }
        if(this.options.maxScale) {
            minResolution = OpenLayers.Util.getResolutionFromScale(
                this.options.maxScale, this.units);
        }

        if(props.resolutions) {

            //sort resolutions array descendingly
            props.resolutions.sort(function(a, b) {
                return (b - a);
            });

            // if we still don't have a maxResolution get it from the
            // resolutions array
            if(!maxResolution) {
                maxResolution = props.resolutions[0];
            }

            // if we still don't have a minResolution get it from the
            // resolutions array
            if(!minResolution) {
                var lastIdx = props.resolutions.length - 1;
                minResolution = props.resolutions[lastIdx];
            }
        }

        this.resolutions = props.resolutions;
        if(this.resolutions) {
            len = this.resolutions.length;
            this.scales = new Array(len);
            for(i=0; i<len; i++) {
                this.scales[i] = OpenLayers.Util.getScaleFromResolution(
                    this.resolutions[i], this.units);
            }
            this.numZoomLevels = len;
        }
        this.minResolution = minResolution;
        if(minResolution) {
            this.maxScale = OpenLayers.Util.getScaleFromResolution(
                minResolution, this.units);
        }
        this.maxResolution = maxResolution;
        if(maxResolution) {
            this.minScale = OpenLayers.Util.getScaleFromResolution(
                maxResolution, this.units);
        }
    },

    /**
     * Method: resolutionsFromScales
     * Derive resolutions from scales.
     *
     * Parameters:
     * scales - {Array(Number)} Scales
     *
     * Returns
     * {Array(Number)} Resolutions
     */
    resolutionsFromScales: function(scales) {
        if(scales == null) {
            return;
        }
        var resolutions, i, len;
        len = scales.length;
        resolutions = new Array(len);
        for(i=0; i<len; i++) {
            resolutions[i] = OpenLayers.Util.getResolutionFromScale(
                scales[i], this.units);
        }
        return resolutions;
    },

    /**
     * Method: calculateResolutions
     * Calculate resolutions based on the provided properties.
     *
     * Parameters:
     * props - {Object} Properties
     *
     * Returns:
     * {Array({Number})} Array of resolutions.
     */
    calculateResolutions: function(props) {

        var viewSize, wRes, hRes;

        // determine maxResolution
        var maxResolution = props.maxResolution;
        if(props.minScale != null) {
            maxResolution =
                OpenLayers.Util.getResolutionFromScale(props.minScale,
                                                       this.units);
        } else if(maxResolution == "auto" && this.maxExtent != null) {
            viewSize = this.map.getSize();
            wRes = this.maxExtent.getWidth() / viewSize.w;
            hRes = this.maxExtent.getHeight() / viewSize.h;
            maxResolution = Math.max(wRes, hRes);
        }

        // determine minResolution
        var minResolution = props.minResolution;
        if(props.maxScale != null) {
            minResolution =
                OpenLayers.Util.getResolutionFromScale(props.maxScale,
                                                       this.units);
        } else if(props.minResolution == "auto" && this.minExtent != null) {
            viewSize = this.map.getSize();
            wRes = this.minExtent.getWidth() / viewSize.w;
            hRes = this.minExtent.getHeight()/ viewSize.h;
            minResolution = Math.max(wRes, hRes);
        }

        if(typeof maxResolution !== "number" &&
           typeof minResolution !== "number" &&
           this.maxExtent != null) {
            // maxResolution for default grid sets assumes that at zoom
            // level zero, the whole world fits on one tile.
            var tileSize = this.map.getTileSize();
            maxResolution = Math.max(
                this.maxExtent.getWidth() / tileSize.w,
                this.maxExtent.getHeight() / tileSize.h
            );
        }

        // determine numZoomLevels
        var maxZoomLevel = props.maxZoomLevel;
        var numZoomLevels = props.numZoomLevels;
        if(typeof minResolution === "number" &&
           typeof maxResolution === "number" && numZoomLevels === undefined) {
            var ratio = maxResolution / minResolution;
            numZoomLevels = Math.floor(Math.log(ratio) / Math.log(2)) + 1;
        } else if(numZoomLevels === undefined && maxZoomLevel != null) {
            numZoomLevels = maxZoomLevel + 1;
        }

        // are we able to calculate resolutions?
        if(typeof numZoomLevels !== "number" || numZoomLevels <= 0 ||
           (typeof maxResolution !== "number" &&
                typeof minResolution !== "number")) {
            return;
        }

        // now we have numZoomLevels and at least one of maxResolution
        // or minResolution, we can populate the resolutions array

        var resolutions = new Array(numZoomLevels);
        var base = 2;
        if(typeof minResolution == "number" &&
           typeof maxResolution == "number") {
            // if maxResolution and minResolution are set, we calculate
            // the base for exponential scaling that starts at
            // maxResolution and ends at minResolution in numZoomLevels
            // steps.
            base = Math.pow(
                    (maxResolution / minResolution),
                (1 / (numZoomLevels - 1))
            );
        }

        var i;
        if(typeof maxResolution === "number") {
            for(i=0; i<numZoomLevels; i++) {
                resolutions[i] = maxResolution / Math.pow(base, i);
            }
        } else {
            for(i=0; i<numZoomLevels; i++) {
                resolutions[numZoomLevels - 1 - i] =
                    minResolution * Math.pow(base, i);
            }
        }

        return resolutions;
    },

    /**
     * APIMethod: getResolution
     * 
     * Returns:
     * {Float} The currently selected resolution of the map, taken from the
     *     resolutions array, indexed by current zoom level.
     */
    getResolution: function() {
        var zoom = this.map.getZoom();
        return this.getResolutionForZoom(zoom);
    },

    /** 
     * APIMethod: getExtent
     * 
     * Returns:
     * {<OpenLayers.Bounds>} A Bounds object which represents the lon/lat 
     *     bounds of the current viewPort.
     */
    getExtent: function() {
        // just use stock map calculateBounds function -- passing no arguments
        //  means it will user map's current center & resolution
        //
        return this.map.calculateBounds();
    },

    /**
     * APIMethod: getZoomForExtent
     * 
     * Parameters:
     * extent - {<OpenLayers.Bounds>}
     * closest - {Boolean} Find the zoom level that most closely fits the 
     *     specified bounds. Note that this may result in a zoom that does 
     *     not exactly contain the entire extent.
     *     Default is false.
     *
     * Returns:
     * {Integer} The index of the zoomLevel (entry in the resolutions array) 
     *     for the passed-in extent. We do this by calculating the ideal 
     *     resolution for the given extent (based on the map size) and then 
     *     calling getZoomForResolution(), passing along the 'closest'
     *     parameter.
     */
    getZoomForExtent: function(extent, closest) {
        var viewSize = this.map.getSize();
        var idealResolution = Math.max( extent.getWidth()  / viewSize.w,
                                        extent.getHeight() / viewSize.h );

        return this.getZoomForResolution(idealResolution, closest);
    },
    
    /** 
     * Method: getDataExtent
     * Calculates the max extent which includes all of the data for the layer.
     *     This function is to be implemented by subclasses.
     * 
     * Returns:
     * {<OpenLayers.Bounds>}
     */
    getDataExtent: function () {
        //to be implemented by subclasses
    },

    /**
     * APIMethod: getResolutionForZoom
     * 
     * Parameters:
     * zoom - {Float}
     * 
     * Returns:
     * {Float} A suitable resolution for the specified zoom.
     */
    getResolutionForZoom: function(zoom) {
        zoom = Math.max(0, Math.min(zoom, this.resolutions.length - 1));
        var resolution;
        if(this.map.fractionalZoom) {
            var low = Math.floor(zoom);
            var high = Math.ceil(zoom);
            resolution = this.resolutions[low] -
                ((zoom-low) * (this.resolutions[low]-this.resolutions[high]));
        } else {
            resolution = this.resolutions[Math.round(zoom)];
        }
        return resolution;
    },

    /**
     * APIMethod: getZoomForResolution
     * 
     * Parameters:
     * resolution - {Float}
     * closest - {Boolean} Find the zoom level that corresponds to the absolute 
     *     closest resolution, which may result in a zoom whose corresponding
     *     resolution is actually smaller than we would have desired (if this
     *     is being called from a getZoomForExtent() call, then this means that
     *     the returned zoom index might not actually contain the entire 
     *     extent specified... but it'll be close).
     *     Default is false.
     * 
     * Returns:
     * {Integer} The index of the zoomLevel (entry in the resolutions array) 
     *     that corresponds to the best fit resolution given the passed in 
     *     value and the 'closest' specification.
     */
    getZoomForResolution: function(resolution, closest) {
        var zoom, i, len;
        if(this.map.fractionalZoom) {
            var lowZoom = 0;
            var highZoom = this.resolutions.length - 1;
            var highRes = this.resolutions[lowZoom];
            var lowRes = this.resolutions[highZoom];
            var res;
            for(i=0, len=this.resolutions.length; i<len; ++i) {
                res = this.resolutions[i];
                if(res >= resolution) {
                    highRes = res;
                    lowZoom = i;
                }
                if(res <= resolution) {
                    lowRes = res;
                    highZoom = i;
                    break;
                }
            }
            var dRes = highRes - lowRes;
            if(dRes > 0) {
                zoom = lowZoom + ((highRes - resolution) / dRes);
            } else {
                zoom = lowZoom;
            }
        } else {
            var diff;
            var minDiff = Number.POSITIVE_INFINITY;
            for(i=0, len=this.resolutions.length; i<len; i++) {            
                if (closest) {
                    diff = Math.abs(this.resolutions[i] - resolution);
                    if (diff > minDiff) {
                        break;
                    }
                    minDiff = diff;
                } else {
                    if (this.resolutions[i] < resolution) {
                        break;
                    }
                }
            }
            zoom = Math.max(0, i-1);
        }
        return zoom;
    },
    
    /**
     * APIMethod: getLonLatFromViewPortPx
     * 
     * Parameters:
     * viewPortPx - {<OpenLayers.Pixel>|Object} An OpenLayers.Pixel or
     *                                          an object with a 'x'
     *                                          and 'y' properties.
     *
     * Returns:
     * {<OpenLayers.LonLat>} An OpenLayers.LonLat which is the passed-in 
     *     view port <OpenLayers.Pixel>, translated into lon/lat by the layer.
     */
    getLonLatFromViewPortPx: function (viewPortPx) {
        var lonlat = null;
        var map = this.map;
        if (viewPortPx != null && map.minPx) {
            var res = map.getResolution();
            var maxExtent = map.getMaxExtent({restricted: true});
            var lon = (viewPortPx.x - map.minPx.x) * res + maxExtent.left;
            var lat = (map.minPx.y - viewPortPx.y) * res + maxExtent.top;
            lonlat = new OpenLayers.LonLat(lon, lat);

            if (this.wrapDateLine) {
                lonlat = lonlat.wrapDateLine(this.maxExtent);
            }
        }
        return lonlat;
    },

    /**
     * APIMethod: getViewPortPxFromLonLat
     * Returns a pixel location given a map location.  This method will return
     *     fractional pixel values.
     * 
     * Parameters:
     * lonlat - {<OpenLayers.LonLat>|Object} An OpenLayers.LonLat or
     *                                       an object with a 'lon'
     *                                       and 'lat' properties.
     *
     * Returns: 
     * {<OpenLayers.Pixel>} An <OpenLayers.Pixel> which is the passed-in 
     *     lonlat translated into view port pixels.
     */
    getViewPortPxFromLonLat: function (lonlat, resolution) {
        var px = null; 
        if (lonlat != null) {
            resolution = resolution || this.map.getResolution();
            var extent = this.map.calculateBounds(null, resolution);
            px = new OpenLayers.Pixel(
                (1/resolution * (lonlat.lon - extent.left)),
                (1/resolution * (extent.top - lonlat.lat))
            );    
        }
        return px;
    },
    
    /**
     * APIMethod: setOpacity
     * Sets the opacity for the entire layer (all images)
     * 
     * Parameters:
     * opacity - {Float}
     */
    setOpacity: function(opacity) {
        if (opacity != this.opacity) {
            this.opacity = opacity;
            var childNodes = this.div.childNodes;
            for(var i = 0, len = childNodes.length; i < len; ++i) {
                var element = childNodes[i].firstChild || childNodes[i];
                var lastChild = childNodes[i].lastChild;
                //TODO de-uglify this
                if (lastChild && lastChild.nodeName.toLowerCase() === "iframe") {
                    element = lastChild.parentNode;
                }
                OpenLayers.Util.modifyDOMElement(element, null, null, null, 
                                                 null, null, null, opacity);
            }
            if (this.map != null) {
                this.map.events.triggerEvent("changelayer", {
                    layer: this,
                    property: "opacity"
                });
            }
        }
    },

    /**
     * Method: getZIndex
     * 
     * Returns: 
     * {Integer} the z-index of this layer
     */    
    getZIndex: function () {
        return this.div.style.zIndex;
    },

    /**
     * Method: setZIndex
     * 
     * Parameters: 
     * zIndex - {Integer}
     */    
    setZIndex: function (zIndex) {
        this.div.style.zIndex = zIndex;
    },

    /**
     * Method: adjustBounds
     * This function will take a bounds, and if wrapDateLine option is set
     *     on the layer, it will return a bounds which is wrapped around the 
     *     world. We do not wrap for bounds which *cross* the 
     *     maxExtent.left/right, only bounds which are entirely to the left 
     *     or entirely to the right.
     * 
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     */
    adjustBounds: function (bounds) {

        if (this.gutter) {
            // Adjust the extent of a bounds in map units by the 
            // layer's gutter in pixels.
            var mapGutter = this.gutter * this.map.getResolution();
            bounds = new OpenLayers.Bounds(bounds.left - mapGutter,
                                           bounds.bottom - mapGutter,
                                           bounds.right + mapGutter,
                                           bounds.top + mapGutter);
        }

        if (this.wrapDateLine) {
            // wrap around the date line, within the limits of rounding error
            var wrappingOptions = { 
                'rightTolerance':this.getResolution(),
                'leftTolerance':this.getResolution()
            };    
            bounds = bounds.wrapDateLine(this.maxExtent, wrappingOptions);
                              
        }
        return bounds;
    },

    CLASS_NAME: "OpenLayers.Layer"
});
/* ======================================================================
    OpenLayers/Layer/HTTPRequest.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


/**
 * @requires OpenLayers/Layer.js
 */

/**
 * Class: OpenLayers.Layer.HTTPRequest
 * 
 * Inherits from: 
 *  - <OpenLayers.Layer>
 */
OpenLayers.Layer.HTTPRequest = OpenLayers.Class(OpenLayers.Layer, {

    /** 
     * Constant: URL_HASH_FACTOR
     * {Float} Used to hash URL param strings for multi-WMS server selection.
     *         Set to the Golden Ratio per Knuth's recommendation.
     */
    URL_HASH_FACTOR: (Math.sqrt(5) - 1) / 2,

    /** 
     * Property: url
     * {Array(String) or String} This is either an array of url strings or 
     *                           a single url string. 
     */
    url: null,

    /** 
     * Property: params
     * {Object} Hashtable of key/value parameters
     */
    params: null,
    
    /** 
     * APIProperty: reproject
     * *Deprecated*. See http://docs.openlayers.org/library/spherical_mercator.html
     * for information on the replacement for this functionality. 
     * {Boolean} Whether layer should reproject itself based on base layer 
     *           locations. This allows reprojection onto commercial layers. 
     *           Default is false: Most layers can't reproject, but layers 
     *           which can create non-square geographic pixels can, like WMS.
     *           
     */
    reproject: false,

    /**
     * Constructor: OpenLayers.Layer.HTTPRequest
     * 
     * Parameters:
     * name - {String}
     * url - {Array(String) or String}
     * params - {Object}
     * options - {Object} Hashtable of extra options to tag onto the layer
     */
    initialize: function(name, url, params, options) {
        OpenLayers.Layer.prototype.initialize.apply(this, [name, options]);
        this.url = url;
        if (!this.params) {
            this.params = OpenLayers.Util.extend({}, params);
        }
    },

    /**
     * APIMethod: destroy
     */
    destroy: function() {
        this.url = null;
        this.params = null;
        OpenLayers.Layer.prototype.destroy.apply(this, arguments); 
    },
    
    /**
     * APIMethod: clone
     * 
     * Parameters:
     * obj - {Object}
     * 
     * Returns:
     * {<OpenLayers.Layer.HTTPRequest>} An exact clone of this 
     *                                  <OpenLayers.Layer.HTTPRequest>
     */
    clone: function (obj) {
        
        if (obj == null) {
            obj = new OpenLayers.Layer.HTTPRequest(this.name,
                                                   this.url,
                                                   this.params,
                                                   this.getOptions());
        }
        
        //get all additions from superclasses
        obj = OpenLayers.Layer.prototype.clone.apply(this, [obj]);

        // copy/set any non-init, non-simple values here
        
        return obj;
    },

    /** 
     * APIMethod: setUrl
     * 
     * Parameters:
     * newUrl - {String}
     */
    setUrl: function(newUrl) {
        this.url = newUrl;
    },

    /**
     * APIMethod: mergeNewParams
     * 
     * Parameters:
     * newParams - {Object}
     *
     * Returns:
     * redrawn: {Boolean} whether the layer was actually redrawn.
     */
    mergeNewParams:function(newParams) {
        this.params = OpenLayers.Util.extend(this.params, newParams);
        var ret = this.redraw();
        if(this.map != null) {
            this.map.events.triggerEvent("changelayer", {
                layer: this,
                property: "params"
            });
        }
        return ret;
    },

    /**
     * APIMethod: redraw
     * Redraws the layer.  Returns true if the layer was redrawn, false if not.
     *
     * Parameters:
     * force - {Boolean} Force redraw by adding random parameter.
     *
     * Returns:
     * {Boolean} The layer was redrawn.
     */
    redraw: function(force) { 
        if (force) {
            return this.mergeNewParams({"_olSalt": Math.random()});
        } else {
            return OpenLayers.Layer.prototype.redraw.apply(this, []);
        }
    },
    
    /**
     * Method: selectUrl
     * selectUrl() implements the standard floating-point multiplicative
     *     hash function described by Knuth, and hashes the contents of the 
     *     given param string into a float between 0 and 1. This float is then
     *     scaled to the size of the provided urls array, and used to select
     *     a URL.
     *
     * Parameters:
     * paramString - {String}
     * urls - {Array(String)}
     * 
     * Returns:
     * {String} An entry from the urls array, deterministically selected based
     *          on the paramString.
     */
    selectUrl: function(paramString, urls) {
        var product = 1;
        for (var i=0, len=paramString.length; i<len; i++) { 
            product *= paramString.charCodeAt(i) * this.URL_HASH_FACTOR; 
            product -= Math.floor(product); 
        }
        return urls[Math.floor(product * urls.length)];
    },

    /** 
     * Method: getFullRequestString
     * Combine url with layer's params and these newParams. 
     *   
     *    does checking on the serverPath variable, allowing for cases when it 
     *     is supplied with trailing ? or &, as well as cases where not. 
     *
     *    return in formatted string like this:
     *        "server?key1=value1&key2=value2&key3=value3"
     * 
     * WARNING: The altUrl parameter is deprecated and will be removed in 3.0.
     *
     * Parameters:
     * newParams - {Object}
     * altUrl - {String} Use this as the url instead of the layer's url
     *   
     * Returns: 
     * {String}
     */
    getFullRequestString:function(newParams, altUrl) {

        // if not altUrl passed in, use layer's url
        var url = altUrl || this.url;
        
        // create a new params hashtable with all the layer params and the 
        // new params together. then convert to string
        var allParams = OpenLayers.Util.extend({}, this.params);
        allParams = OpenLayers.Util.extend(allParams, newParams);
        var paramsString = OpenLayers.Util.getParameterString(allParams);
        
        // if url is not a string, it should be an array of strings, 
        // in which case we will deterministically select one of them in 
        // order to evenly distribute requests to different urls.
        //
        if (OpenLayers.Util.isArray(url)) {
            url = this.selectUrl(paramsString, url);
        }   
 
        // ignore parameters that are already in the url search string
        var urlParams = 
            OpenLayers.Util.upperCaseObject(OpenLayers.Util.getParameters(url));
        for(var key in allParams) {
            if(key.toUpperCase() in urlParams) {
                delete allParams[key];
            }
        }
        paramsString = OpenLayers.Util.getParameterString(allParams);
        
        return OpenLayers.Util.urlAppend(url, paramsString);
    },

    CLASS_NAME: "OpenLayers.Layer.HTTPRequest"
});
/* ======================================================================
    OpenLayers/Tile.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


/**
 * @requires OpenLayers/BaseTypes/Class.js
 * @requires OpenLayers/Util.js
 */

/**
 * Class: OpenLayers.Tile 
 * This is a class designed to designate a single tile, however
 *     it is explicitly designed to do relatively little. Tiles store 
 *     information about themselves -- such as the URL that they are related
 *     to, and their size - but do not add themselves to the layer div 
 *     automatically, for example. Create a new tile with the 
 *     <OpenLayers.Tile> constructor, or a subclass. 
 * 
 * TBD 3.0 - remove reference to url in above paragraph
 * 
 */
OpenLayers.Tile = OpenLayers.Class({
    
    /**
     * APIProperty: events
     * {<OpenLayers.Events>} An events object that handles all 
     *     events on the tile.
     *
     * Register a listener for a particular event with the following syntax:
     * (code)
     * tile.events.register(type, obj, listener);
     * (end)
     *
     * Supported event types:
     * beforedraw - Triggered before the tile is drawn. Used to defer
     *     drawing to an animation queue. To defer drawing, listeners need
     *     to return false, which will abort drawing. The queue handler needs
     *     to call <draw>(true) to actually draw the tile.
     * loadstart - Triggered when tile loading starts.
     * loadend - Triggered when tile loading ends.
     * loaderror - Triggered before the loadend event (i.e. when the tile is
     *     still hidden) if the tile could not be loaded.
     * reload - Triggered when an already loading tile is reloaded.
     * unload - Triggered before a tile is unloaded.
     */
    events: null,

    /**
     * APIProperty: eventListeners
     * {Object} If set as an option at construction, the eventListeners
     *     object will be registered with <OpenLayers.Events.on>.  Object
     *     structure must be a listeners object as shown in the example for
     *     the events.on method.
     *
     * This options can be set in the ``tileOptions`` option from
     * <OpenLayers.Layer.Grid>. For example, to be notified of the
     * ``loadend`` event of each tiles:
     * (code)
     * new OpenLayers.Layer.OSM('osm', 'http://tile.openstreetmap.org/${z}/${x}/${y}.png', {
     *     tileOptions: {
     *         eventListeners: {
     *             'loadend': function(evt) {
     *                 // do something on loadend
     *             }
     *         }
     *     }
     * });
     * (end)
     */
    eventListeners: null,

    /**
     * Property: id 
     * {String} null
     */
    id: null,
    
    /** 
     * Property: layer 
     * {<OpenLayers.Layer>} layer the tile is attached to 
     */
    layer: null,
    
    /**
     * Property: url
     * {String} url of the request.
     *
     * TBD 3.0 
     * Deprecated. The base tile class does not need an url. This should be 
     * handled in subclasses. Does not belong here.
     */
    url: null,

    /** 
     * APIProperty: bounds 
     * {<OpenLayers.Bounds>} null
     */
    bounds: null,
    
    /** 
     * Property: size 
     * {<OpenLayers.Size>} null
     */
    size: null,
    
    /** 
     * Property: position 
     * {<OpenLayers.Pixel>} Top Left pixel of the tile
     */    
    position: null,
    
    /**
     * Property: isLoading
     * {Boolean} Is the tile loading?
     */
    isLoading: false,
    
    /** TBD 3.0 -- remove 'url' from the list of parameters to the constructor.
     *             there is no need for the base tile class to have a url.
     */

    /** 
     * Constructor: OpenLayers.Tile
     * Constructor for a new <OpenLayers.Tile> instance.
     * 
     * Parameters:
     * layer - {<OpenLayers.Layer>} layer that the tile will go in.
     * position - {<OpenLayers.Pixel>}
     * bounds - {<OpenLayers.Bounds>}
     * url - {<String>}
     * size - {<OpenLayers.Size>}
     * options - {Object}
     */   
    initialize: function(layer, position, bounds, url, size, options) {
        this.layer = layer;
        this.position = position.clone();
        this.setBounds(bounds);
        this.url = url;
        if (size) {
            this.size = size.clone();
        }

        //give the tile a unique id based on its BBOX.
        this.id = OpenLayers.Util.createUniqueID("Tile_");

        OpenLayers.Util.extend(this, options);

        this.events = new OpenLayers.Events(this);
        if (this.eventListeners instanceof Object) {
            this.events.on(this.eventListeners);
        }
    },

    /**
     * Method: unload
     * Call immediately before destroying if you are listening to tile
     * events, so that counters are properly handled if tile is still
     * loading at destroy-time. Will only fire an event if the tile is
     * still loading.
     */
    unload: function() {
       if (this.isLoading) { 
           this.isLoading = false; 
           this.events.triggerEvent("unload"); 
       }
    },
    
    /** 
     * APIMethod: destroy
     * Nullify references to prevent circular references and memory leaks.
     */
    destroy:function() {
        this.layer  = null;
        this.bounds = null;
        this.size = null;
        this.position = null;
        
        if (this.eventListeners) {
            this.events.un(this.eventListeners);
        }
        this.events.destroy();
        this.eventListeners = null;
        this.events = null;
    },
    
    /**
     * Method: draw
     * Clear whatever is currently in the tile, then return whether or not 
     *     it should actually be re-drawn. This is an example implementation
     *     that can be overridden by subclasses. The minimum thing to do here
     *     is to call <clear> and return the result from <shouldDraw>.
     *
     * Parameters:
     * deferred - {Boolean} When drawing was aborted by returning false from a
     *     *beforedraw* listener, the queue manager needs to pass true, so the
     *     tile will not be cleared and immediately be drawn. Otherwise, the
     *     tile will be cleared and a *beforedraw* event will be fired.
     * 
     * Returns:
     * {Boolean} Whether or not the tile should actually be drawn.
     */
    draw: function(deferred) {
        if (!deferred) {
            //clear tile's contents and mark as not drawn
            this.clear();
        }
        var draw = this.shouldDraw();
        if (draw && !deferred) {
            draw = this.events.triggerEvent("beforedraw") !== false;
        }
        return draw;
    },
    
    /**
     * Method: shouldDraw
     * Return whether or not the tile should actually be (re-)drawn. The only
     * case where we *wouldn't* want to draw the tile is if the tile is outside
     * its layer's maxExtent
     * 
     * Returns:
     * {Boolean} Whether or not the tile should actually be drawn.
     */
    shouldDraw: function() {        
        var withinMaxExtent = false,
            maxExtent = this.layer.maxExtent;
        if (maxExtent) {
            var map = this.layer.map;
            var worldBounds = map.baseLayer.wrapDateLine && map.getMaxExtent();
            if (this.bounds.intersectsBounds(maxExtent, {inclusive: false, worldBounds: worldBounds})) {
                withinMaxExtent = true;
            }
        }
        
        return withinMaxExtent || this.layer.displayOutsideMaxExtent;
    },
    
    /**
     * Method: setBounds
     * Sets the bounds on this instance
     *
     * Parameters:
     * bounds {<OpenLayers.Bounds>}
     */
    setBounds: function(bounds) {
        bounds = bounds.clone();
        if (this.layer.map.baseLayer.wrapDateLine) {
            var worldExtent = this.layer.map.getMaxExtent(),
                tolerance = this.layer.map.getResolution();
            bounds = bounds.wrapDateLine(worldExtent, {
                leftTolerance: tolerance,
                rightTolerance: tolerance
            });
        }
        this.bounds = bounds;
    },
    
    /** 
     * Method: moveTo
     * Reposition the tile.
     *
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     * position - {<OpenLayers.Pixel>}
     * redraw - {Boolean} Call draw method on tile after moving.
     *     Default is true
     */
    moveTo: function (bounds, position, redraw) {
        if (redraw == null) {
            redraw = true;
        }

        this.setBounds(bounds);
        this.position = position.clone();
        if (redraw) {
            this.draw();
        }
    },

    /** 
     * Method: clear
     * Clear the tile of any bounds/position-related data so that it can 
     *     be reused in a new location.
     */
    clear: function(draw) {
        // to be extended by subclasses
    },
    
    CLASS_NAME: "OpenLayers.Tile"
});
/* ======================================================================
    OpenLayers/Tile/Image.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


/**
 * @requires OpenLayers/Tile.js
 * @requires OpenLayers/Animation.js
 */

/**
 * Class: OpenLayers.Tile.Image
 * Instances of OpenLayers.Tile.Image are used to manage the image tiles
 * used by various layers.  Create a new image tile with the
 * <OpenLayers.Tile.Image> constructor.
 *
 * Inherits from:
 *  - <OpenLayers.Tile>
 */
OpenLayers.Tile.Image = OpenLayers.Class(OpenLayers.Tile, {

    /** 
     * APIProperty: url
     * {String} The URL of the image being requested. No default. Filled in by
     * layer.getURL() function. May be modified by loadstart listeners.
     */
    url: null,
    
    /** 
     * Property: imgDiv
     * {HTMLImageElement} The image for this tile.
     */
    imgDiv: null,
    
    /**
     * Property: frame
     * {DOMElement} The image element is appended to the frame.  Any gutter on
     * the image will be hidden behind the frame. If no gutter is set,
     * this will be null.
     */ 
    frame: null, 

    /** 
     * Property: imageReloadAttempts
     * {Integer} Attempts to load the image.
     */
    imageReloadAttempts: null,
    
    /**
     * Property: layerAlphaHack
     * {Boolean} True if the png alpha hack needs to be applied on the layer's div.
     */
    layerAlphaHack: null,
    
    /**
     * Property: asyncRequestId
     * {Integer} ID of an request to see if request is still valid. This is a
     * number which increments by 1 for each asynchronous request.
     */
    asyncRequestId: null,
    
    /**
     * Property: blankImageUrl
     * {String} Using a data scheme url is not supported by all browsers, but
     * we don't care because we either set it as css backgroundImage, or the
     * image's display style is set to "none" when we use it.
     */
    blankImageUrl: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7",

    /**
     * APIProperty: maxGetUrlLength
     * {Number} If set, requests that would result in GET urls with more
     * characters than the number provided will be made using form-encoded
     * HTTP POST. It is good practice to avoid urls that are longer than 2048
     * characters.
     *
     * Caution:
     * Older versions of Gecko based browsers (e.g. Firefox < 3.5) and most
     * Opera versions do not fully support this option. On all browsers,
     * transition effects are not supported if POST requests are used.
     */
    maxGetUrlLength: null,

    /**
     * Property: canvasContext
     * {CanvasRenderingContext2D} A canvas context associated with
     * the tile image.
     */
    canvasContext: null,
    
    /**
     * APIProperty: crossOriginKeyword
     * The value of the crossorigin keyword to use when loading images. This is
     * only relevant when using <getCanvasContext> for tiles from remote
     * origins and should be set to either 'anonymous' or 'use-credentials'
     * for servers that send Access-Control-Allow-Origin headers with their
     * tiles.
     */
    crossOriginKeyword: null,

    /** TBD 3.0 - reorder the parameters to the init function to remove 
     *             URL. the getUrl() function on the layer gets called on 
     *             each draw(), so no need to specify it here.
     */

    /** 
     * Constructor: OpenLayers.Tile.Image
     * Constructor for a new <OpenLayers.Tile.Image> instance.
     * 
     * Parameters:
     * layer - {<OpenLayers.Layer>} layer that the tile will go in.
     * position - {<OpenLayers.Pixel>}
     * bounds - {<OpenLayers.Bounds>}
     * url - {<String>} Deprecated. Remove me in 3.0.
     * size - {<OpenLayers.Size>}
     * options - {Object}
     */   
    initialize: function(layer, position, bounds, url, size, options) {
        OpenLayers.Tile.prototype.initialize.apply(this, arguments);

        this.url = url; //deprecated remove me
        
        this.layerAlphaHack = this.layer.alpha && OpenLayers.Util.alphaHack();

        if (this.maxGetUrlLength != null || this.layer.gutter || this.layerAlphaHack) {
            // only create frame if it's needed
            this.frame = document.createElement("div");
            this.frame.style.position = "absolute";
            this.frame.style.overflow = "hidden";
        }
        if (this.maxGetUrlLength != null) {
            OpenLayers.Util.extend(this, OpenLayers.Tile.Image.IFrame);
        }
    },
    
    /** 
     * APIMethod: destroy
     * nullify references to prevent circular references and memory leaks
     */
    destroy: function() {
        if (this.imgDiv)  {
            this.clear();
            this.imgDiv = null;
            this.frame = null;
        }
        // don't handle async requests any more
        this.asyncRequestId = null;
        OpenLayers.Tile.prototype.destroy.apply(this, arguments);
    },
    
    /**
     * Method: draw
     * Check that a tile should be drawn, and draw it.
     * 
     * Returns:
     * {Boolean} Was a tile drawn?
     */
    draw: function() {
        var drawn = OpenLayers.Tile.prototype.draw.apply(this, arguments);
        if (drawn) {
            // The layer's reproject option is deprecated.
            if (this.layer != this.layer.map.baseLayer && this.layer.reproject) {
                // getBoundsFromBaseLayer is defined in deprecated.js.
                this.bounds = this.getBoundsFromBaseLayer(this.position);
            }
            if (this.isLoading) {
                //if we're already loading, send 'reload' instead of 'loadstart'.
                this._loadEvent = "reload"; 
            } else {
                this.isLoading = true;
                this._loadEvent = "loadstart";
            }
            this.positionTile();
            this.renderTile();
        } else {
            this.unload();
        }
        return drawn;
    },
    
    /**
     * Method: renderTile
     * Internal function to actually initialize the image tile,
     *     position it correctly, and set its url.
     */
    renderTile: function() {
        this.layer.div.appendChild(this.getTile());
        if (this.layer.async) {
            // Asynchronous image requests call the asynchronous getURL method
            // on the layer to fetch an image that covers 'this.bounds'.
            var id = this.asyncRequestId = (this.asyncRequestId || 0) + 1;
            this.layer.getURLasync(this.bounds, function(url) {
                if (id == this.asyncRequestId) {
                    this.url = url;
                    this.initImage();
                }
            }, this);
        } else {
            // synchronous image requests get the url immediately.
            this.url = this.layer.getURL(this.bounds);
            this.initImage();
        }
    },

    /**
     * Method: positionTile
     * Using the properties currenty set on the layer, position the tile correctly.
     * This method is used both by the async and non-async versions of the Tile.Image
     * code.
     */
    positionTile: function() {
        var style = this.getTile().style,
            size = this.frame ? this.size :
                                this.layer.getImageSize(this.bounds);
        style.left = this.position.x + "%";
        style.top = this.position.y + "%";
        style.width = size.w + "%";
        style.height = size.h + "%";
    },

    /** 
     * Method: clear
     * Remove the tile from the DOM, clear it of any image related data so that
     * it can be reused in a new location.
     */
    clear: function() {
        OpenLayers.Tile.prototype.clear.apply(this, arguments);
        var img = this.imgDiv;
        if (img) {
            OpenLayers.Event.stopObservingElement(img);
            var tile = this.getTile();
            if (tile.parentNode === this.layer.div) {
                this.layer.div.removeChild(tile);
            }
            this.setImgSrc();
            if (this.layerAlphaHack === true) {
                img.style.filter = "";
            }
            OpenLayers.Element.removeClass(img, "olImageLoadError");
        }
        this.canvasContext = null;
    },
    
    /**
     * Method: getImage
     * Returns or creates and returns the tile image.
     */
    getImage: function() {
        if (!this.imgDiv) {
            this.imgDiv = document.createElement("img");

            this.imgDiv.className = "olTileImage";
            // avoid image gallery menu in IE6
            this.imgDiv.galleryImg = "no";

            var style = this.imgDiv.style;
            if (this.frame) {
                var left = 0, top = 0;
                if (this.layer.gutter) {
                    left = this.layer.gutter / this.layer.tileSize.w * 100;
                    top = this.layer.gutter / this.layer.tileSize.h * 100;
                }
                style.left = -left + "%";
                style.top = -top + "%";
                style.width = (2 * left + 100) + "%";
                style.height = (2 * top + 100) + "%";
            }
            style.visibility = "hidden";
            style.opacity = 0;
            if (this.layer.opacity < 1) {
                style.filter = 'alpha(opacity=' +
                               (this.layer.opacity * 100) +
                               ')';
            }
            style.position = "absolute";
            if (this.layerAlphaHack) {
                // move the image out of sight
                style.paddingTop = style.height;
                style.height = "0";
                style.width = "100%";
            }
            if (this.frame) {
                this.frame.appendChild(this.imgDiv);
            }
        }

        return this.imgDiv;
    },

    /**
     * Method: initImage
     * Creates the content for the frame on the tile.
     */
    initImage: function() {
        this.events.triggerEvent(this._loadEvent);
        var img = this.getImage();
        if (this.url && img.getAttribute("src") == this.url) {
            this.onImageLoad();
        } else {
            // We need to start with a blank image, to make sure that no
            // loading image placeholder and no old image is displayed when we
            // set the display style to "" in onImageLoad, which is called
            // after the image is loaded, but before it is rendered. So we set
            // a blank image with a data scheme URI, and register for the load
            // event (for browsers that support data scheme) and the error
            // event (for browsers that don't). In the event handler, we set
            // the final src.
            var load = OpenLayers.Function.bind(function() {
                OpenLayers.Event.stopObservingElement(img);
                OpenLayers.Event.observe(img, "load",
                    OpenLayers.Function.bind(this.onImageLoad, this)
                );
                OpenLayers.Event.observe(img, "error",
                    OpenLayers.Function.bind(this.onImageError, this)
                );
                this.imageReloadAttempts = 0;
                this.setImgSrc(this.url);
            }, this);
            if (img.getAttribute("src") == this.blankImageUrl) {
                load();
            } else {
                OpenLayers.Event.observe(img, "load", load);
                OpenLayers.Event.observe(img, "error", load);
                if (this.crossOriginKeyword) {
                    img.removeAttribute("crossorigin");
                }
                img.src = this.blankImageUrl;
            }
        }
    },
    
    /**
     * Method: setImgSrc
     * Sets the source for the tile image
     *
     * Parameters:
     * url - {String} or undefined to hide the image
     */
    setImgSrc: function(url) {
        var img = this.imgDiv;
        if (url) {
            img.style.visibility = 'hidden';
            img.style.opacity = 0;
            // don't set crossOrigin if the url is a data URL
            if (this.crossOriginKeyword) {
                if (url.substr(0, 5) !== 'data:') {
                    img.setAttribute("crossorigin", this.crossOriginKeyword);
                } else {
                    img.removeAttribute("crossorigin");
                }
            }
            img.src = url;
        } else {
            // Remove reference to the image, and leave it to the browser's
            // caching and garbage collection.
            this.imgDiv = null;
            if (img.parentNode) {
                img.parentNode.removeChild(img);
            }
        }
    },
    
    /**
     * Method: getTile
     * Get the tile's markup.
     *
     * Returns:
     * {DOMElement} The tile's markup
     */
    getTile: function() {
        return this.frame ? this.frame : this.getImage();
    },

    /**
     * Method: createBackBuffer
     * Create a backbuffer for this tile. A backbuffer isn't exactly a clone
     * of the tile's markup, because we want to avoid the reloading of the
     * image. So we clone the frame, and steal the image from the tile.
     *
     * Returns:
     * {DOMElement} The markup, or undefined if the tile has no image
     * or if it's currently loading.
     */
    createBackBuffer: function() {
        if (!this.imgDiv || this.isLoading) {
            return;
        }
        var backBuffer;
        if (this.frame) {
            backBuffer = this.frame.cloneNode(false);
            backBuffer.appendChild(this.imgDiv);
        } else {
            backBuffer = this.imgDiv;
        }
        this.imgDiv = null;
        return backBuffer;
    },

    /**
     * Method: onImageLoad
     * Handler for the image onload event
     */
    onImageLoad: function() {
        var img = this.imgDiv;
        OpenLayers.Event.stopObservingElement(img);

        img.style.visibility = 'inherit';
        img.style.opacity = this.layer.opacity;

        this.isLoading = false;
        this.canvasContext = null;
        this.events.triggerEvent("loadend");

        // IE<7 needs a reflow when the tiles are loaded because of the
        // percentage based positioning. Otherwise nothing is shown
        // until the user interacts with the map in some way.
        if (parseFloat(navigator.appVersion.split("MSIE")[1]) < 7 &&
                this.layer && this.layer.div) {
            var span = document.createElement("span");
            span.style.display = "none";
            var layerDiv = this.layer.div;
            layerDiv.appendChild(span);
            window.setTimeout(function() {
                span.parentNode === layerDiv && span.parentNode.removeChild(span);
            }, 0);
        }

        if (this.layerAlphaHack === true) {
            img.style.filter =
                "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" +
                img.src + "', sizingMethod='scale')";
        }
    },
    
    /**
     * Method: onImageError
     * Handler for the image onerror event
     */
    onImageError: function() {
        var img = this.imgDiv;
        if (img.src != null) {
            this.imageReloadAttempts++;
            if (this.imageReloadAttempts <= OpenLayers.IMAGE_RELOAD_ATTEMPTS) {
                this.setImgSrc(this.layer.getURL(this.bounds));
            } else {
                OpenLayers.Element.addClass(img, "olImageLoadError");
                this.events.triggerEvent("loaderror");
                this.onImageLoad();
            }
        }
    },

    /**
     * APIMethod: getCanvasContext
     * Returns a canvas context associated with the tile image (with
     * the image drawn on it).
     * Returns undefined if the browser does not support canvas, if
     * the tile has no image or if it's currently loading.
     *
     * The function returns a canvas context instance but the
     * underlying canvas is still available in the 'canvas' property:
     * (code)
     * var context = tile.getCanvasContext();
     * if (context) {
     *     var data = context.canvas.toDataURL('image/jpeg');
     * }
     * (end)
     *
     * Returns:
     * {Boolean}
     */
    getCanvasContext: function() {
        if (OpenLayers.CANVAS_SUPPORTED && this.imgDiv && !this.isLoading) {
            if (!this.canvasContext) {
                var canvas = document.createElement("canvas");
                canvas.width = this.size.w;
                canvas.height = this.size.h;
                this.canvasContext = canvas.getContext("2d");
                this.canvasContext.drawImage(this.imgDiv, 0, 0);
            }
            return this.canvasContext;
        }
    },

    CLASS_NAME: "OpenLayers.Tile.Image"

});
/* ======================================================================
    OpenLayers/Layer/Grid.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


/**
 * @requires OpenLayers/Layer/HTTPRequest.js
 * @requires OpenLayers/Tile/Image.js
 */

/**
 * Class: OpenLayers.Layer.Grid
 * Base class for layers that use a lattice of tiles.  Create a new grid
 * layer with the <OpenLayers.Layer.Grid> constructor.
 *
 * Inherits from:
 *  - <OpenLayers.Layer.HTTPRequest>
 */
OpenLayers.Layer.Grid = OpenLayers.Class(OpenLayers.Layer.HTTPRequest, {
    
    /**
     * APIProperty: tileSize
     * {<OpenLayers.Size>}
     */
    tileSize: null,

    /**
     * Property: tileOriginCorner
     * {String} If the <tileOrigin> property is not provided, the tile origin 
     *     will be derived from the layer's <maxExtent>.  The corner of the 
     *     <maxExtent> used is determined by this property.  Acceptable values
     *     are "tl" (top left), "tr" (top right), "bl" (bottom left), and "br"
     *     (bottom right).  Default is "bl".
     */
    tileOriginCorner: "bl",
    
    /**
     * APIProperty: tileOrigin
     * {<OpenLayers.LonLat>} Optional origin for aligning the grid of tiles.
     *     If provided, requests for tiles at all resolutions will be aligned
     *     with this location (no tiles shall overlap this location).  If
     *     not provided, the grid of tiles will be aligned with the layer's
     *     <maxExtent>.  Default is ``null``.
     */
    tileOrigin: null,
    
    /** APIProperty: tileOptions
     *  {Object} optional configuration options for <OpenLayers.Tile> instances
     *  created by this Layer, if supported by the tile class.
     */
    tileOptions: null,

    /**
     * APIProperty: tileClass
     * {<OpenLayers.Tile>} The tile class to use for this layer.
     *     Defaults is OpenLayers.Tile.Image.
     */
    tileClass: OpenLayers.Tile.Image,
    
    /**
     * Property: grid
     * {Array(Array(<OpenLayers.Tile>))} This is an array of rows, each row is 
     *     an array of tiles.
     */
    grid: null,

    /**
     * APIProperty: singleTile
     * {Boolean} Moves the layer into single-tile mode, meaning that one tile 
     *     will be loaded. The tile's size will be determined by the 'ratio'
     *     property. When the tile is dragged such that it does not cover the 
     *     entire viewport, it is reloaded.
     */
    singleTile: false,

    /** APIProperty: ratio
     *  {Float} Used only when in single-tile mode, this specifies the 
     *          ratio of the size of the single tile to the size of the map.
     */
    ratio: 1.5,

    /**
     * APIProperty: buffer
     * {Integer} Used only when in gridded mode, this specifies the number of 
     *           extra rows and colums of tiles on each side which will
     *           surround the minimum grid tiles to cover the map.
     *           For very slow loading layers, a larger value may increase
     *           performance somewhat when dragging, but will increase bandwidth
     *           use significantly. 
     */
    buffer: 0,

    /**
     * APIProperty: transitionEffect
     * {String} The transition effect to use when the map is zoomed.
     * Two posible values:
     *
     * null - No transition effect (the default).
     * "resize" - Existing tiles are resized on zoom to provide a visual
     * effect of the zoom having taken place immediately.  As the
     * new tiles become available, they are drawn over top of the
     * resized tiles.
     *
     * Using "resize" on non-opaque layers can cause undesired visual
     * effects. This is therefore discouraged.
     */
    transitionEffect: null,

    /**
     * APIProperty: numLoadingTiles
     * {Integer} How many tiles are still loading?
     */
    numLoadingTiles: 0,

    /**
     * APIProperty: tileLoadingDelay
     * {Integer} Number of milliseconds before we shift and load
     *     tiles when panning. Ignored if <OpenLayers.Animation.isNative> is
     *     true. Default is 85.
     */
    tileLoadingDelay: 85,
    
    /**
     * Property: serverResolutions
     * {Array(Number}} This property is documented in subclasses as
     *     an API property.
     */
    serverResolutions: null,

    /**
     * Property: moveTimerId
     * {Number} The id of the <deferMoveGriddedTiles> timer.
     */
    moveTimerId: null,
    
    /**
     * Property: deferMoveGriddedTiles
     * {Function} A function that defers execution of <moveGriddedTiles> by
     *     <tileLoadingDelay>. If <OpenLayers.Animation.isNative> is true, this
     *     is null and unused.
     */
    deferMoveGriddedTiles: null,

    /**
     * Property: tileQueueId
     * {Number} The id of the <drawTileFromQueue> animation.
     */
    tileQueueId: null,

    /**
     * Property: tileQueue
     * {Array(<OpenLayers.Tile>)} Tiles queued for drawing.
     */
    tileQueue: null,
    
    /**
     * Property: loading
     * {Boolean} Indicates if tiles are being loaded.
     */
    loading: false,
    
    /**
     * Property: backBuffer
     * {DOMElement} The back buffer.
     */
    backBuffer: null,

    /**
     * Property: gridResolution
     * {Number} The resolution of the current grid. Used for backbuffering.
     *     This property is updated each the grid is initialized.
     */
    gridResolution: null,

    /**
     * Property: backBufferResolution
     * {Number} The resolution of the current back buffer. This property is
     *     updated each time a back buffer is created.
     */
    backBufferResolution: null,

    /**
     * Property: backBufferLonLat
     * {Object} The top-left corner of the current back buffer. Includes lon
     *     and lat properties. This object is updated each time a back buffer
     *     is created.
     */
    backBufferLonLat: null,

    /**
     * Property: backBufferTimerId
     * {Number} The id of the back buffer timer. This timer is used to
     *     delay the removal of the back buffer, thereby preventing
     *     flash effects caused by tile animation.
     */
    backBufferTimerId: null,

    /**
     * APIProperty: removeBackBufferDelay
     * {Number} Delay for removing the backbuffer when all tiles have finished
     *     loading. Can be set to 0 when no css opacity transitions for the
     *     olTileImage class are used. Default is 0 for <singleTile> layers,
     *     2500 for tiled layers. See <className> for more information on
     *     tile animation.
     */
    removeBackBufferDelay: null,

    /**
     * APIProperty: className
     * {String} Name of the class added to the layer div. If not set in the
     *     options passed to the constructor then className defaults to
     *     "olLayerGridSingleTile" for single tile layers (see <singleTile>),
     *     and "olLayerGrid" for non single tile layers.
     *
     * Note:
     *
     * The displaying of tiles is not animated by default for single tile
     *     layers - OpenLayers' default theme (style.css) includes this:
     * (code)
     * .olLayerGrid .olTileImage {
     *     -webkit-transition: opacity 0.2s linear;
     *     -moz-transition: opacity 0.2s linear;
     *     -o-transition: opacity 0.2s linear;
     *     transition: opacity 0.2s linear;
     *  }
     * (end)
     * To animate tile displaying for any grid layer the following
     *     CSS rule can be used:
     * (code)
     * .olTileImage {
     *     -webkit-transition: opacity 0.2s linear;
     *     -moz-transition: opacity 0.2s linear;
     *     -o-transition: opacity 0.2s linear;
     *     transition: opacity 0.2s linear;
     * }
     * (end)
     * In that case, to avoid flash effects, <removeBackBufferDelay>
     *     should not be zero.
     */
    className: null,

    /**
     * Register a listener for a particular event with the following syntax:
     * (code)
     * layer.events.register(type, obj, listener);
     * (end)
     *
     * Listeners will be called with a reference to an event object.  The
     *     properties of this event depends on exactly what happened.
     *
     * All event objects have at least the following properties:
     * object - {Object} A reference to layer.events.object.
     * element - {DOMElement} A reference to layer.events.element.
     *
     * Supported event types:
     * tileloadstart - Triggered when a tile starts loading. Listeners receive
     *     an object as first argument, which has a tile property that
     *     references the tile that starts loading.
     * tileloaded - Triggered when each new tile is
     *     loaded, as a means of progress update to listeners.
     *     listeners can access 'numLoadingTiles' if they wish to keep
     *     track of the loading progress. Listeners are called with an object
     *     with a tile property as first argument, making the loded tile
     *     available to the listener.
     * tileerror - Triggered before the tileloaded event (i.e. when the tile is
     *     still hidden) if a tile failed to load. Listeners receive an object
     *     as first argument, which has a tile property that references the
     *     tile that could not be loaded.
     */

    /**
     * Constructor: OpenLayers.Layer.Grid
     * Create a new grid layer
     *
     * Parameters:
     * name - {String}
     * url - {String}
     * params - {Object}
     * options - {Object} Hashtable of extra options to tag onto the layer
     */
    initialize: function(name, url, params, options) {
        OpenLayers.Layer.HTTPRequest.prototype.initialize.apply(this, 
                                                                arguments);
        this.grid = [];
        this.tileQueue = [];

        if (this.removeBackBufferDelay === null) {
            this.removeBackBufferDelay = this.singleTile ? 0 : 2500;
        }
        
        if (this.className === null) {
            this.className = this.singleTile ? 'olLayerGridSingleTile' :
                                               'olLayerGrid';
        }

        if (!OpenLayers.Animation.isNative) {
            this.deferMoveGriddedTiles = OpenLayers.Function.bind(function() {
                this.moveGriddedTiles(true);
                this.moveTimerId = null;
            }, this);
        }
    },

    /**
     * Method: setMap
     *
     * Parameters:
     * map - {<OpenLayers.Map>} The map.
     */
    setMap: function(map) {
        OpenLayers.Layer.HTTPRequest.prototype.setMap.call(this, map);
        OpenLayers.Element.addClass(this.div, this.className);
    },

    /**
     * Method: removeMap
     * Called when the layer is removed from the map.
     *
     * Parameters:
     * map - {<OpenLayers.Map>} The map.
     */
    removeMap: function(map) {
        if (this.moveTimerId !== null) {
            window.clearTimeout(this.moveTimerId);
            this.moveTimerId = null;
        }
        this.clearTileQueue();
        if(this.backBufferTimerId !== null) {
            window.clearTimeout(this.backBufferTimerId);
            this.backBufferTimerId = null;
        }
    },

    /**
     * APIMethod: destroy
     * Deconstruct the layer and clear the grid.
     */
    destroy: function() {
        this.removeBackBuffer();
        this.clearGrid();

        this.grid = null;
        this.tileSize = null;
        OpenLayers.Layer.HTTPRequest.prototype.destroy.apply(this, arguments); 
    },

    /**
     * Method: clearGrid
     * Go through and remove all tiles from the grid, calling
     *    destroy() on each of them to kill circular references
     */
    clearGrid:function() {
        this.clearTileQueue();
        if (this.grid) {
            for(var iRow=0, len=this.grid.length; iRow<len; iRow++) {
                var row = this.grid[iRow];
                for(var iCol=0, clen=row.length; iCol<clen; iCol++) {
                    var tile = row[iCol];
                    this.destroyTile(tile);
                }
            }
            this.grid = [];
            this.gridResolution = null;
        }
    },
    
    /**
     * APIMethod: clone
     * Create a clone of this layer
     *
     * Parameters:
     * obj - {Object} Is this ever used?
     * 
     * Returns:
     * {<OpenLayers.Layer.Grid>} An exact clone of this OpenLayers.Layer.Grid
     */
    clone: function (obj) {
        
        if (obj == null) {
            obj = new OpenLayers.Layer.Grid(this.name,
                                            this.url,
                                            this.params,
                                            this.getOptions());
        }

        //get all additions from superclasses
        obj = OpenLayers.Layer.HTTPRequest.prototype.clone.apply(this, [obj]);

        // copy/set any non-init, non-simple values here
        if (this.tileSize != null) {
            obj.tileSize = this.tileSize.clone();
        }
        
        // we do not want to copy reference to grid, so we make a new array
        obj.grid = [];
        obj.gridResolution = null;
        // same for backbuffer and tile queue
        obj.backBuffer = null;
        obj.backBufferTimerId = null;
        obj.tileQueue = [];
        obj.tileQueueId = null;
        obj.loading = false;
        obj.moveTimerId = null;

        return obj;
    },    

    /**
     * Method: moveTo
     * This function is called whenever the map is moved. All the moving
     * of actual 'tiles' is done by the map, but moveTo's role is to accept
     * a bounds and make sure the data that that bounds requires is pre-loaded.
     *
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     * zoomChanged - {Boolean}
     * dragging - {Boolean}
     */
    moveTo:function(bounds, zoomChanged, dragging) {

        OpenLayers.Layer.HTTPRequest.prototype.moveTo.apply(this, arguments);

        bounds = bounds || this.map.getExtent();

        if (bounds != null) {
             
            // if grid is empty or zoom has changed, we *must* re-tile
            var forceReTile = !this.grid.length || zoomChanged;
            
            // total bounds of the tiles
            var tilesBounds = this.getTilesBounds();            

            // the new map resolution
            var resolution = this.map.getResolution();

            // the server-supported resolution for the new map resolution
            var serverResolution = this.getServerResolution(resolution);

            if (this.singleTile) {
                
                // We want to redraw whenever even the slightest part of the 
                //  current bounds is not contained by our tile.
                //  (thus, we do not specify partial -- its default is false)

                if ( forceReTile ||
                     (!dragging && !tilesBounds.containsBounds(bounds))) {

                    // In single tile mode with no transition effect, we insert
                    // a non-scaled backbuffer when the layer is moved. But if
                    // a zoom occurs right after a move, i.e. before the new
                    // image is received, we need to remove the backbuffer, or
                    // an ill-positioned image will be visible during the zoom
                    // transition.

                    if(zoomChanged && this.transitionEffect !== 'resize') {
                        this.removeBackBuffer();
                    }

                    if(!zoomChanged || this.transitionEffect === 'resize') {
                        this.applyBackBuffer(serverResolution);
                    }

                    this.initSingleTile(bounds);
                }
            } else {

                // if the bounds have changed such that they are not even 
                // *partially* contained by our tiles (e.g. when user has 
                // programmatically panned to the other side of the earth on
                // zoom level 18), then moveGriddedTiles could potentially have
                // to run through thousands of cycles, so we want to reTile
                // instead (thus, partial true).  
                forceReTile = forceReTile ||
                    !tilesBounds.intersectsBounds(bounds, {
                        worldBounds: this.map.baseLayer.wrapDateLine &&
                            this.map.getMaxExtent()
                    });

                if(resolution !== serverResolution) {
                    bounds = this.map.calculateBounds(null, serverResolution);
                    if(forceReTile) {
                        // stretch the layer div
                        var scale = serverResolution / resolution;
                        this.transformDiv(scale);
                    }
                } else {
                    // reset the layer width, height, left, top, to deal with
                    // the case where the layer was previously transformed
                    this.div.style.width = '100%';
                    this.div.style.height = '100%';
                    this.div.style.left = '0%';
                    this.div.style.top = '0%';
                }

                if(forceReTile) {
                    if(zoomChanged && this.transitionEffect === 'resize') {
                        this.applyBackBuffer(serverResolution);
                    }
                    this.initGriddedTiles(bounds);
                } else {
                    this.moveGriddedTiles();
                }
            }
        }
    },

    /**
     * Method: getTileData
     * Given a map location, retrieve a tile and the pixel offset within that
     *     tile corresponding to the location.  If there is not an existing 
     *     tile in the grid that covers the given location, null will be 
     *     returned.
     *
     * Parameters:
     * loc - {<OpenLayers.LonLat>} map location
     *
     * Returns:
     * {Object} Object with the following properties: tile ({<OpenLayers.Tile>}),
     *     i ({Number} x-pixel offset from top left), and j ({Integer} y-pixel
     *     offset from top left).
     */
    getTileData: function(loc) {
        var data = null,
            x = loc.lon,
            y = loc.lat,
            numRows = this.grid.length;

        if (this.map && numRows) {
            var res = this.map.getResolution(),
                tileWidth = this.tileSize.w,
                tileHeight = this.tileSize.h,
                bounds = this.grid[0][0].bounds,
                left = bounds.left,
                top = bounds.top;

            if (x < left) {
                // deal with multiple worlds
                if (this.map.baseLayer.wrapDateLine) {
                    var worldWidth = this.map.getMaxExtent().getWidth();
                    var worldsAway = Math.ceil((left - x) / worldWidth);
                    x += worldWidth * worldsAway;
                }
            }
            // tile distance to location (fractional number of tiles);
            var dtx = (x - left) / (res * tileWidth);
            var dty = (top - y) / (res * tileHeight);
            // index of tile in grid
            var col = Math.floor(dtx);
            var row = Math.floor(dty);
            if (row >= 0 && row < numRows) {
                var tile = this.grid[row][col];
                if (tile) {
                    data = {
                        tile: tile,
                        // pixel index within tile
                        i: Math.floor((dtx - col) * tileWidth),
                        j: Math.floor((dty - row) * tileHeight)
                    };                    
                }
            }
        }
        return data;
    },
    
    /**
     * Method: queueTileDraw
     * Adds a tile to the animation queue that will draw it.
     *
     * Parameters:
     * evt - {Object} Listener argument of the tile's beforedraw event
     */
    queueTileDraw: function(evt) {
        var tile = evt.object;
        if (!~OpenLayers.Util.indexOf(this.tileQueue, tile)) {
            // queue only if not in queue already
            this.tileQueue.push(tile);
        }
        if (!this.tileQueueId) {
            this.tileQueueId = OpenLayers.Animation.start(
                OpenLayers.Function.bind(this.drawTileFromQueue, this),
                null, this.div
            );
        }
        return false;
    },
    
    /**
     * Method: drawTileFromQueue
     * Draws the first tile from the tileQueue, and unqueues that tile
     */
    drawTileFromQueue: function() {
        if (this.tileQueue.length === 0) {
            this.clearTileQueue();
        } else {
            this.tileQueue.shift().draw(true);
        }
    },
    
    /**
     * Method: clearTileQueue
     * Clears the animation queue
     */
    clearTileQueue: function() {
        OpenLayers.Animation.stop(this.tileQueueId);
        this.tileQueueId = null;
        this.tileQueue = [];
    },

    /**
     * Method: destroyTile
     *
     * Parameters:
     * tile - {<OpenLayers.Tile>}
     */
    destroyTile: function(tile) {
        this.removeTileMonitoringHooks(tile);
        tile.destroy();
    },

    /**
     * Method: getServerResolution
     * Return the closest highest server-supported resolution. Throw an
     * exception if none is found in the serverResolutions array.
     *
     * Parameters:
     * resolution - {Number} The base resolution. If undefined the
     *     map resolution is used.
     *
     * Returns:
     * {Number} The closest highest server resolution value.
     */
    getServerResolution: function(resolution) {
        resolution = resolution || this.map.getResolution();
        if(this.serverResolutions &&
           OpenLayers.Util.indexOf(this.serverResolutions, resolution) === -1) {
            var i, serverResolution;
            for(i=this.serverResolutions.length-1; i>= 0; i--) {
                serverResolution = this.serverResolutions[i];
                if(serverResolution > resolution) {
                    resolution = serverResolution;
                    break;
                }
            }
            if(i === -1) {
                throw 'no appropriate resolution in serverResolutions';
            }
        }
        return resolution;
    },

    /**
     * Method: getServerZoom
     * Return the zoom value corresponding to the best matching server
     * resolution, taking into account <serverResolutions> and <zoomOffset>.
     *
     * Returns:
     * {Number} The closest server supported zoom. This is not the map zoom
     *     level, but an index of the server's resolutions array.
     */
    getServerZoom: function() {
        var resolution = this.getServerResolution();
        return this.serverResolutions ?
            OpenLayers.Util.indexOf(this.serverResolutions, resolution) :
            this.map.getZoomForResolution(resolution) + (this.zoomOffset || 0);
    },

    /**
     * Method: transformDiv
     * Transform the layer div.
     *
     * Parameters:
     * scale - {Number} The value by which the layer div is to
     *     be scaled.
     */
    transformDiv: function(scale) {

        // scale the layer div

        this.div.style.width = 100 * scale + '%';
        this.div.style.height = 100 * scale + '%';

        // and translate the layer div as necessary

        var size = this.map.getSize();
        var lcX = parseInt(this.map.layerContainerDiv.style.left, 10);
        var lcY = parseInt(this.map.layerContainerDiv.style.top, 10);
        var x = (lcX - (size.w / 2.0)) * (scale - 1);
        var y = (lcY - (size.h / 2.0)) * (scale - 1);

        this.div.style.left = x + '%';
        this.div.style.top = y + '%';
    },

    /**
     * Method: getResolutionScale
     * Return the value by which the layer is currently scaled.
     *
     * Returns:
     * {Number} The resolution scale.
     */
    getResolutionScale: function() {
        return parseInt(this.div.style.width, 10) / 100;
    },

    /**
     * Method: applyBackBuffer
     * Create, insert, scale and position a back buffer for the layer.
     *
     * Parameters:
     * resolution - {Number} The resolution to transition to.
     */
    applyBackBuffer: function(resolution) {
        if(this.backBufferTimerId !== null) {
            this.removeBackBuffer();
        }
        var backBuffer = this.backBuffer;
        if(!backBuffer) {
            backBuffer = this.createBackBuffer();
            if(!backBuffer) {
                return;
            }
            this.div.insertBefore(backBuffer, this.div.firstChild);
            this.backBuffer = backBuffer;

            // set some information in the instance for subsequent
            // calls to applyBackBuffer where the same back buffer
            // is reused
            var topLeftTileBounds = this.grid[0][0].bounds;
            this.backBufferLonLat = {
                lon: topLeftTileBounds.left,
                lat: topLeftTileBounds.top
            };
            this.backBufferResolution = this.gridResolution;
        }

        var style = backBuffer.style;

        // scale the back buffer
        var ratio = this.backBufferResolution / resolution;
        style.width = 100 * ratio + '%';
        style.height = 100 * ratio + '%';

        // and position it (based on the grid's top-left corner)
        var position = this.getViewPortPxFromLonLat(
                this.backBufferLonLat, resolution);
        var leftOffset = parseInt(this.map.layerContainerDiv.style.left, 10);
        var topOffset = parseInt(this.map.layerContainerDiv.style.top, 10);
        backBuffer.style.left = Math.round(position.x - leftOffset) + '%';
        backBuffer.style.top = Math.round(position.y - topOffset) + '%';
    },

    /**
     * Method: createBackBuffer
     * Create a back buffer.
     *
     * Returns:
     * {DOMElement} The DOM element for the back buffer, undefined if the
     * grid isn't initialized yet.
     */
    createBackBuffer: function() {
        var backBuffer;
        if(this.grid.length > 0) {
            backBuffer = document.createElement('div');
            backBuffer.id = this.div.id + '_bb';
            backBuffer.className = 'olBackBuffer';
            backBuffer.style.position = 'absolute';
            backBuffer.style.width = '100%';
            backBuffer.style.height = '100%';
            for(var i=0, lenI=this.grid.length; i<lenI; i++) {
                for(var j=0, lenJ=this.grid[i].length; j<lenJ; j++) {
                    var tile = this.grid[i][j].createBackBuffer();
                    if(!tile) {
                        continue;
                    }
                    // to be able to correctly position the back buffer we
                    // place the tiles grid at (0, 0) in the back buffer
                    tile.style.top = (i * this.tileSize.h) + '%';
                    tile.style.left = (j * this.tileSize.w) + '%';
                    backBuffer.appendChild(tile);
                }
            }
        }
        return backBuffer;
    },

    /**
     * Method: removeBackBuffer
     * Remove back buffer from DOM.
     */
    removeBackBuffer: function() {
        if(this.backBuffer) {
            this.div.removeChild(this.backBuffer);
            this.backBuffer = null;
            this.backBufferResolution = null;
            if(this.backBufferTimerId !== null) {
                window.clearTimeout(this.backBufferTimerId);
                this.backBufferTimerId = null;
            }
        }
    },

    /**
     * Method: moveByPx
     * Move the layer based on pixel vector.
     *
     * Parameters:
     * dx - {Number}
     * dy - {Number}
     */
    moveByPx: function(dx, dy) {
        if (!this.singleTile) {
            this.moveGriddedTiles();
        }
    },

    /**
     * APIMethod: setTileSize
     * Check if we are in singleTile mode and if so, set the size as a ratio
     *     of the map size (as specified by the layer's 'ratio' property).
     * 
     * Parameters:
     * size - {<OpenLayers.Size>}
     */
    setTileSize: function(size) { 
        if (this.singleTile) {
            size = this.map.getSize();
            size.h = parseInt(size.h * this.ratio);
            size.w = parseInt(size.w * this.ratio);
        } 
        OpenLayers.Layer.HTTPRequest.prototype.setTileSize.apply(this, [size]);
    },

    /**
     * APIMethod: getTilesBounds
     * Return the bounds of the tile grid.
     *
     * Returns:
     * {<OpenLayers.Bounds>} A Bounds object representing the bounds of all the
     *     currently loaded tiles (including those partially or not at all seen 
     *     onscreen).
     */
    getTilesBounds: function() {    
        var bounds = null; 
        
        var length = this.grid.length;
        if (length) {
            var bottomLeftTileBounds = this.grid[length - 1][0].bounds,
                width = this.grid[0].length * bottomLeftTileBounds.getWidth(),
                height = this.grid.length * bottomLeftTileBounds.getHeight();
            
            bounds = new OpenLayers.Bounds(bottomLeftTileBounds.left, 
                                           bottomLeftTileBounds.bottom,
                                           bottomLeftTileBounds.left + width, 
                                           bottomLeftTileBounds.bottom + height);
        }   
        return bounds;
    },

    /**
     * Method: initSingleTile
     * 
     * Parameters: 
     * bounds - {<OpenLayers.Bounds>}
     */
    initSingleTile: function(bounds) {
        this.clearTileQueue();

        //determine new tile bounds
        var center = bounds.getCenterLonLat();
        var tileWidth = bounds.getWidth() * this.ratio;
        var tileHeight = bounds.getHeight() * this.ratio;
                                       
        var tileBounds = 
            new OpenLayers.Bounds(center.lon - (tileWidth/2),
                                  center.lat - (tileHeight/2),
                                  center.lon + (tileWidth/2),
                                  center.lat + (tileHeight/2));
  
        var px = this.map.getLayerPxFromLonLat({
            lon: tileBounds.left,
            lat: tileBounds.top
        });

        if (!this.grid.length) {
            this.grid[0] = [];
        }

        var tile = this.grid[0][0];
        if (!tile) {
            tile = this.addTile(tileBounds, px);
            
            this.addTileMonitoringHooks(tile);
            tile.draw();
            this.grid[0][0] = tile;
        } else {
            tile.moveTo(tileBounds, px);
        }           
        
        //remove all but our single tile
        this.removeExcessTiles(1,1);

        // store the resolution of the grid
        this.gridResolution = this.getServerResolution();
    },

    /** 
     * Method: calculateGridLayout
     * Generate parameters for the grid layout.
     *
     * Parameters:
     * bounds - {<OpenLayers.Bound>|Object} OpenLayers.Bounds or an
     *     object with a 'left' and 'top' properties.
     * origin - {<OpenLayers.LonLat>|Object} OpenLayers.LonLat or an
     *     object with a 'lon' and 'lat' properties.
     * resolution - {Number}
     *
     * Returns:
     * {Object} containing properties tilelon, tilelat, tileoffsetlat,
     * tileoffsetlat, tileoffsetx, tileoffsety
     */
    calculateGridLayout: function(bounds, origin, resolution) {
        var tilelon = resolution * this.tileSize.w;
        var tilelat = resolution * this.tileSize.h;
        
        var offsetlon = bounds.left - origin.lon;
        var tilecol = Math.floor(offsetlon/tilelon) - this.buffer;
        var tilecolremain = offsetlon/tilelon - tilecol;
        var tileoffsetx = -tilecolremain * this.tileSize.w;
        var tileoffsetlon = origin.lon + tilecol * tilelon;
        
        var offsetlat = bounds.top - (origin.lat + tilelat);  
        var tilerow = Math.ceil(offsetlat/tilelat) + this.buffer;
        var tilerowremain = tilerow - offsetlat/tilelat;
        var tileoffsety = -tilerowremain * this.tileSize.h;
        var tileoffsetlat = origin.lat + tilerow * tilelat;
        
        return { 
          tilelon: tilelon, tilelat: tilelat,
          tileoffsetlon: tileoffsetlon, tileoffsetlat: tileoffsetlat,
          tileoffsetx: tileoffsetx, tileoffsety: tileoffsety
        };

    },
    
    /**
     * Method: getTileOrigin
     * Determine the origin for aligning the grid of tiles.  If a <tileOrigin>
     *     property is supplied, that will be returned.  Otherwise, the origin
     *     will be derived from the layer's <maxExtent> property.  In this case,
     *     the tile origin will be the corner of the <maxExtent> given by the 
     *     <tileOriginCorner> property.
     *
     * Returns:
     * {<OpenLayers.LonLat>} The tile origin.
     */
    getTileOrigin: function() {
        var origin = this.tileOrigin;
        if (!origin) {
            var extent = this.getMaxExtent();
            var edges = ({
                "tl": ["left", "top"],
                "tr": ["right", "top"],
                "bl": ["left", "bottom"],
                "br": ["right", "bottom"]
            })[this.tileOriginCorner];
            origin = new OpenLayers.LonLat(extent[edges[0]], extent[edges[1]]);
        }
        return origin;
    },

    /**
     * Method: initGriddedTiles
     * 
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     */
    initGriddedTiles:function(bounds) {
        this.clearTileQueue();

        // work out mininum number of rows and columns; this is the number of
        // tiles required to cover the viewport plus at least one for panning

        var viewSize = this.map.getSize();
        var minRows = Math.ceil(viewSize.h/this.tileSize.h) + 
                      Math.max(1, 2 * this.buffer);
        var minCols = Math.ceil(viewSize.w/this.tileSize.w) +
                      Math.max(1, 2 * this.buffer);
        
        var origin = this.getTileOrigin();
        var resolution = this.getServerResolution();
        
        var tileLayout = this.calculateGridLayout(bounds, origin, resolution);

        var tileoffsetx = Math.round(tileLayout.tileoffsetx); // heaven help us
        var tileoffsety = Math.round(tileLayout.tileoffsety);

        var tileoffsetlon = tileLayout.tileoffsetlon;
        var tileoffsetlat = tileLayout.tileoffsetlat;
        
        var tilelon = tileLayout.tilelon;
        var tilelat = tileLayout.tilelat;

        var startX = tileoffsetx; 
        var startLon = tileoffsetlon;

        var rowidx = 0;
        
        var layerContainerDivLeft = parseInt(this.map.layerContainerDiv.style.left);
        var layerContainerDivTop = parseInt(this.map.layerContainerDiv.style.top);

        var tileData = [], center = this.map.getCenter();
        do {
            var row = this.grid[rowidx++];
            if (!row) {
                row = [];
                this.grid.push(row);
            }

            tileoffsetlon = startLon;
            tileoffsetx = startX;
            var colidx = 0;
 
            do {
                var tileBounds = 
                    new OpenLayers.Bounds(tileoffsetlon, 
                                          tileoffsetlat, 
                                          tileoffsetlon + tilelon,
                                          tileoffsetlat + tilelat);

                var x = tileoffsetx;
                x -= layerContainerDivLeft;

                var y = tileoffsety;
                y -= layerContainerDivTop;

                var px = new OpenLayers.Pixel(x, y);
                var tile = row[colidx++];
                if (!tile) {
                    tile = this.addTile(tileBounds, px);
                    this.addTileMonitoringHooks(tile);
                    row.push(tile);
                } else {
                    tile.moveTo(tileBounds, px, false);
                }
                var tileCenter = tileBounds.getCenterLonLat();
                tileData.push({
                    tile: tile,
                    distance: Math.pow(tileCenter.lon - center.lon, 2) +
                        Math.pow(tileCenter.lat - center.lat, 2)
                });
     
                tileoffsetlon += tilelon;       
                tileoffsetx += this.tileSize.w;
            } while ((tileoffsetlon <= bounds.right + tilelon * this.buffer)
                     || colidx < minCols);
             
            tileoffsetlat -= tilelat;
            tileoffsety += this.tileSize.h;
        } while((tileoffsetlat >= bounds.bottom - tilelat * this.buffer)
                || rowidx < minRows);
        
        //shave off exceess rows and colums
        this.removeExcessTiles(rowidx, colidx);

        // store the resolution of the grid
        this.gridResolution = this.getServerResolution();

        //now actually draw the tiles
        tileData.sort(function(a, b) {
            return a.distance - b.distance; 
        });
        for (var i=0, ii=tileData.length; i<ii; ++i) {
            tileData[i].tile.draw();
        }
    },

    /**
     * Method: getMaxExtent
     * Get this layer's maximum extent. (Implemented as a getter for
     *     potential specific implementations in sub-classes.)
     *
     * Returns:
     * {<OpenLayers.Bounds>}
     */
    getMaxExtent: function() {
        return this.maxExtent;
    },
    
    /**
     * APIMethod: addTile
     * Create a tile, initialize it, and add it to the layer div. 
     *
     * Parameters
     * bounds - {<OpenLayers.Bounds>}
     * position - {<OpenLayers.Pixel>}
     *
     * Returns:
     * {<OpenLayers.Tile>} The added OpenLayers.Tile
     */
    addTile: function(bounds, position) {
        var tile = new this.tileClass(
            this, position, bounds, null, this.tileSize, this.tileOptions
        );
        tile.events.register("beforedraw", this, this.queueTileDraw);
        return tile;
    },
    
    /** 
     * Method: addTileMonitoringHooks
     * This function takes a tile as input and adds the appropriate hooks to 
     *     the tile so that the layer can keep track of the loading tiles.
     * 
     * Parameters: 
     * tile - {<OpenLayers.Tile>}
     */
    addTileMonitoringHooks: function(tile) {
        
        tile.onLoadStart = function() {
            //if that was first tile then trigger a 'loadstart' on the layer
            if (this.loading === false) {
                this.loading = true;
                this.events.triggerEvent("loadstart");
            }
            this.events.triggerEvent("tileloadstart", {tile: tile});
            this.numLoadingTiles++;
        };
      
        tile.onLoadEnd = function() {
            this.numLoadingTiles--;
            this.events.triggerEvent("tileloaded", {tile: tile});
            //if that was the last tile, then trigger a 'loadend' on the layer
            if (this.tileQueue.length === 0 && this.numLoadingTiles === 0) {
                this.loading = false;
                this.events.triggerEvent("loadend");
                if(this.backBuffer) {
                    // the removal of the back buffer is delayed to prevent flash
                    // effects due to the animation of tile displaying
                    this.backBufferTimerId = window.setTimeout(
                        OpenLayers.Function.bind(this.removeBackBuffer, this),
                        this.removeBackBufferDelay
                    );
                }
            }
        };
        
        tile.onLoadError = function() {
            this.events.triggerEvent("tileerror", {tile: tile});
        };
        
        tile.events.on({
            "loadstart": tile.onLoadStart,
            "loadend": tile.onLoadEnd,
            "unload": tile.onLoadEnd,
            "loaderror": tile.onLoadError,
            scope: this
        });
    },

    /** 
     * Method: removeTileMonitoringHooks
     * This function takes a tile as input and removes the tile hooks 
     *     that were added in addTileMonitoringHooks()
     * 
     * Parameters: 
     * tile - {<OpenLayers.Tile>}
     */
    removeTileMonitoringHooks: function(tile) {
        tile.unload();
        tile.events.un({
            "loadstart": tile.onLoadStart,
            "loadend": tile.onLoadEnd,
            "unload": tile.onLoadEnd,
            "loaderror": tile.onLoadError,
            scope: this
        });
    },
    
    /**
     * Method: moveGriddedTiles
     *
     * Parameter:
     * deferred - {Boolean} true if this is a deferred call that should not
     * be delayed.
     */
    moveGriddedTiles: function(deferred) {
        if (!deferred && !OpenLayers.Animation.isNative) {
            if (this.moveTimerId != null) {
                window.clearTimeout(this.moveTimerId);
            }
            this.moveTimerId = window.setTimeout(
                this.deferMoveGriddedTiles, this.tileLoadingDelay
            );
            return;
        }
        var buffer = this.buffer || 1;
        var scale = this.getResolutionScale();
        while(true) {
            var tlViewPort = {
                x: (this.grid[0][0].position.x * scale) +
                    parseInt(this.div.style.left, 10) +
                    parseInt(this.map.layerContainerDiv.style.left),
                y: (this.grid[0][0].position.y * scale) +
                    parseInt(this.div.style.top, 10) +
                    parseInt(this.map.layerContainerDiv.style.top)
            };
            var tileSize = {
                w: this.tileSize.w * scale,
                h: this.tileSize.h * scale
            };
            if (tlViewPort.x > -tileSize.w * (buffer - 1)) {
                this.shiftColumn(true);
            } else if (tlViewPort.x < -tileSize.w * buffer) {
                this.shiftColumn(false);
            } else if (tlViewPort.y > -tileSize.h * (buffer - 1)) {
                this.shiftRow(true);
            } else if (tlViewPort.y < -tileSize.h * buffer) {
                this.shiftRow(false);
            } else {
                break;
            }
        }
    },

    /**
     * Method: shiftRow
     * Shifty grid work
     *
     * Parameters:
     * prepend - {Boolean} if true, prepend to beginning.
     *                          if false, then append to end
     */
    shiftRow:function(prepend) {
        var modelRowIndex = (prepend) ? 0 : (this.grid.length - 1);
        var grid = this.grid;
        var modelRow = grid[modelRowIndex];

        var resolution = this.getServerResolution();
        var deltaY = (prepend) ? -this.tileSize.h : this.tileSize.h;
        var deltaLat = resolution * -deltaY;

        var row = (prepend) ? grid.pop() : grid.shift();

        for (var i=0, len=modelRow.length; i<len; i++) {
            var modelTile = modelRow[i];
            var bounds = modelTile.bounds.clone();
            var position = modelTile.position.clone();
            bounds.bottom = bounds.bottom + deltaLat;
            bounds.top = bounds.top + deltaLat;
            position.y = position.y + deltaY;
            row[i].moveTo(bounds, position);
        }

        if (prepend) {
            grid.unshift(row);
        } else {
            grid.push(row);
        }
    },

    /**
     * Method: shiftColumn
     * Shift grid work in the other dimension
     *
     * Parameters:
     * prepend - {Boolean} if true, prepend to beginning.
     *                          if false, then append to end
     */
    shiftColumn: function(prepend) {
        var deltaX = (prepend) ? -this.tileSize.w : this.tileSize.w;
        var resolution = this.getServerResolution();
        var deltaLon = resolution * deltaX;

        for (var i=0, len=this.grid.length; i<len; i++) {
            var row = this.grid[i];
            var modelTileIndex = (prepend) ? 0 : (row.length - 1);
            var modelTile = row[modelTileIndex];
            
            var bounds = modelTile.bounds.clone();
            var position = modelTile.position.clone();
            bounds.left = bounds.left + deltaLon;
            bounds.right = bounds.right + deltaLon;
            position.x = position.x + deltaX;

            var tile = prepend ? this.grid[i].pop() : this.grid[i].shift();
            tile.moveTo(bounds, position);
            if (prepend) {
                row.unshift(tile);
            } else {
                row.push(tile);
            }
        }
    },

    /**
     * Method: removeExcessTiles
     * When the size of the map or the buffer changes, we may need to
     *     remove some excess rows and columns.
     * 
     * Parameters:
     * rows - {Integer} Maximum number of rows we want our grid to have.
     * columns - {Integer} Maximum number of columns we want our grid to have.
     */
    removeExcessTiles: function(rows, columns) {
        var i, l;
        
        // remove extra rows
        while (this.grid.length > rows) {
            var row = this.grid.pop();
            for (i=0, l=row.length; i<l; i++) {
                var tile = row[i];
                this.destroyTile(tile);
            }
        }
        
        // remove extra columns
        for (i=0, l=this.grid.length; i<l; i++) {
            while (this.grid[i].length > columns) {
                var row = this.grid[i];
                var tile = row.pop();
                this.destroyTile(tile);
            }
        }
    },

    /**
     * Method: onMapResize
     * For singleTile layers, this will set a new tile size according to the
     * dimensions of the map pane.
     */
    onMapResize: function() {
        if (this.singleTile) {
            this.clearGrid();
            this.setTileSize();
        }
    },
    
    /**
     * APIMethod: getTileBounds
     * Returns The tile bounds for a layer given a pixel location.
     *
     * Parameters:
     * viewPortPx - {<OpenLayers.Pixel>} The location in the viewport.
     *
     * Returns:
     * {<OpenLayers.Bounds>} Bounds of the tile at the given pixel location.
     */
    getTileBounds: function(viewPortPx) {
        var maxExtent = this.maxExtent;
        var resolution = this.getResolution();
        var tileMapWidth = resolution * this.tileSize.w;
        var tileMapHeight = resolution * this.tileSize.h;
        var mapPoint = this.getLonLatFromViewPortPx(viewPortPx);
        var tileLeft = maxExtent.left + (tileMapWidth *
                                         Math.floor((mapPoint.lon -
                                                     maxExtent.left) /
                                                    tileMapWidth));
        var tileBottom = maxExtent.bottom + (tileMapHeight *
                                             Math.floor((mapPoint.lat -
                                                         maxExtent.bottom) /
                                                        tileMapHeight));
        return new OpenLayers.Bounds(tileLeft, tileBottom,
                                     tileLeft + tileMapWidth,
                                     tileBottom + tileMapHeight);
    },

    CLASS_NAME: "OpenLayers.Layer.Grid"
});
/* ======================================================================
    OpenLayers/Layer/SphericalMercator.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Layer.js
 * @requires OpenLayers/Projection.js
 */

/**
 * Class: OpenLayers.Layer.SphericalMercator
 * A mixin for layers that wraps up the pieces neccesary to have a coordinate
 *     conversion for working with commercial APIs which use a spherical
 *     mercator projection.  Using this layer as a base layer, additional
 *     layers can be used as overlays if they are in the same projection.
 *
 * A layer is given properties of this object by setting the sphericalMercator
 *     property to true.
 *
 * More projection information:
 *  - http://spatialreference.org/ref/user/google-projection/
 *
 * Proj4 Text:
 *     +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0
 *     +k=1.0 +units=m +nadgrids=@null +no_defs
 *
 * WKT:
 *     900913=PROJCS["WGS84 / Simple Mercator", GEOGCS["WGS 84",
 *     DATUM["WGS_1984", SPHEROID["WGS_1984", 6378137.0, 298.257223563]], 
 *     PRIMEM["Greenwich", 0.0], UNIT["degree", 0.017453292519943295], 
 *     AXIS["Longitude", EAST], AXIS["Latitude", NORTH]],
 *     PROJECTION["Mercator_1SP_Google"], 
 *     PARAMETER["latitude_of_origin", 0.0], PARAMETER["central_meridian", 0.0], 
 *     PARAMETER["scale_factor", 1.0], PARAMETER["false_easting", 0.0], 
 *     PARAMETER["false_northing", 0.0], UNIT["m", 1.0], AXIS["x", EAST],
 *     AXIS["y", NORTH], AUTHORITY["EPSG","900913"]]
 */
OpenLayers.Layer.SphericalMercator = {

    /**
     * Method: getExtent
     * Get the map's extent.
     *
     * Returns:
     * {<OpenLayers.Bounds>} The map extent.
     */
    getExtent: function() {
        var extent = null;
        if (this.sphericalMercator) {
            extent = this.map.calculateBounds();
        } else {
            extent = OpenLayers.Layer.FixedZoomLevels.prototype.getExtent.apply(this);
        }
        return extent;
    },

    /**
     * Method: getLonLatFromViewPortPx
     * Get a map location from a pixel location
     * 
     * Parameters:
     * viewPortPx - {<OpenLayers.Pixel>}
     *
     * Returns:
     *  {<OpenLayers.LonLat>} An OpenLayers.LonLat which is the passed-in view
     *  port OpenLayers.Pixel, translated into lon/lat by map lib
     *  If the map lib is not loaded or not centered, returns null
     */
    getLonLatFromViewPortPx: function (viewPortPx) {
        return OpenLayers.Layer.prototype.getLonLatFromViewPortPx.apply(this, arguments);
    },
    
    /**
     * Method: getViewPortPxFromLonLat
     * Get a pixel location from a map location
     *
     * Parameters:
     * lonlat - {<OpenLayers.LonLat>}
     *
     * Returns:
     * {<OpenLayers.Pixel>} An OpenLayers.Pixel which is the passed-in
     * OpenLayers.LonLat, translated into view port pixels by map lib
     * If map lib is not loaded or not centered, returns null
     */
    getViewPortPxFromLonLat: function (lonlat) {
        return OpenLayers.Layer.prototype.getViewPortPxFromLonLat.apply(this, arguments);
    },

    /** 
     * Method: initMercatorParameters 
     * Set up the mercator parameters on the layer: resolutions,
     *     projection, units.
     */
    initMercatorParameters: function() {
        // set up properties for Mercator - assume EPSG:900913
        this.RESOLUTIONS = [];
        var maxResolution = 156543.03390625;
        for(var zoom=0; zoom<=this.MAX_ZOOM_LEVEL; ++zoom) {
            this.RESOLUTIONS[zoom] = maxResolution / Math.pow(2, zoom);
        }
        this.units = "m";
        this.projection = this.projection || "EPSG:900913";
    },

    /**
     * APIMethod: forwardMercator
     * Given a lon,lat in EPSG:4326, return a point in Spherical Mercator.
     *
     * Parameters:
     * lon - {float} 
     * lat - {float}
     * 
     * Returns:
     * {<OpenLayers.LonLat>} The coordinates transformed to Mercator.
     */
    forwardMercator: (function() {
        var gg = new OpenLayers.Projection("EPSG:4326");
        var sm = new OpenLayers.Projection("EPSG:900913");
        return function(lon, lat) {
            var point = OpenLayers.Projection.transform({x: lon, y: lat}, gg, sm);
            return new OpenLayers.LonLat(point.x, point.y);
        };
    })(),

    /**
     * APIMethod: inverseMercator
     * Given a x,y in Spherical Mercator, return a point in EPSG:4326.
     *
     * Parameters:
     * x - {float} A map x in Spherical Mercator.
     * y - {float} A map y in Spherical Mercator.
     * 
     * Returns:
     * {<OpenLayers.LonLat>} The coordinates transformed to EPSG:4326.
     */
    inverseMercator: (function() {
        var gg = new OpenLayers.Projection("EPSG:4326");
        var sm = new OpenLayers.Projection("EPSG:900913");
        return function(x, y) {
            var point = OpenLayers.Projection.transform({x: x, y: y}, sm, gg);
            return new OpenLayers.LonLat(point.x, point.y);
        };
    })()

};
/* ======================================================================
    OpenLayers/Layer/EventPane.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


/**
 * @requires OpenLayers/Layer.js
 * @requires OpenLayers/Util.js
 */

/**
 * Class: OpenLayers.Layer.EventPane
 * Base class for 3rd party layers, providing a DOM element which isolates
 * the 3rd-party layer from mouse events.
 * Only used by Google layers.
 *
 * Automatically instantiated by the Google constructor, and not usually instantiated directly.
 *
 * Create a new event pane layer with the
 * <OpenLayers.Layer.EventPane> constructor.
 * 
 * Inherits from:
 *  - <OpenLayers.Layer>
 */
OpenLayers.Layer.EventPane = OpenLayers.Class(OpenLayers.Layer, {
    
    /**
     * APIProperty: smoothDragPan
     * {Boolean} smoothDragPan determines whether non-public/internal API
     *     methods are used for better performance while dragging EventPane 
     *     layers. When not in sphericalMercator mode, the smoother dragging 
     *     doesn't actually move north/south directly with the number of 
     *     pixels moved, resulting in a slight offset when you drag your mouse 
     *     north south with this option on. If this visual disparity bothers 
     *     you, you should turn this option off, or use spherical mercator. 
     *     Default is on.
     */
    smoothDragPan: true,

    /**
     * Property: isBaseLayer
     * {Boolean} EventPaned layers are always base layers, by necessity.
     */ 
    isBaseLayer: true,

    /**
     * APIProperty: isFixed
     * {Boolean} EventPaned layers are fixed by default.
     */ 
    isFixed: true,

    /**
     * Property: pane
     * {DOMElement} A reference to the element that controls the events.
     */
    pane: null,


    /**
     * Property: mapObject
     * {Object} This is the object which will be used to load the 3rd party library
     * in the case of the google layer, this will be of type GMap, 
     * in the case of the ve layer, this will be of type VEMap
     */ 
    mapObject: null,


    /**
     * Constructor: OpenLayers.Layer.EventPane
     * Create a new event pane layer
     *
     * Parameters:
     * name - {String}
     * options - {Object} Hashtable of extra options to tag onto the layer
     */
    initialize: function(name, options) {
        OpenLayers.Layer.prototype.initialize.apply(this, arguments);
        if (this.pane == null) {
            this.pane = OpenLayers.Util.createDiv(this.div.id + "_EventPane");
        }
    },
    
    /**
     * APIMethod: destroy
     * Deconstruct this layer.
     */
    destroy: function() {
        this.mapObject = null;
        this.pane = null;
        OpenLayers.Layer.prototype.destroy.apply(this, arguments); 
    },

    
    /**
     * Method: setMap
     * Set the map property for the layer. This is done through an accessor
     * so that subclasses can override this and take special action once 
     * they have their map variable set. 
     *
     * Parameters:
     * map - {<OpenLayers.Map>}
     */
    setMap: function(map) {
        OpenLayers.Layer.prototype.setMap.apply(this, arguments);
        
        this.pane.style.zIndex = parseInt(this.div.style.zIndex) + 1;
        this.pane.style.display = this.div.style.display;
        this.pane.style.width="100%";
        this.pane.style.height="100%";
        if (OpenLayers.BROWSER_NAME == "msie") {
            this.pane.style.background = 
                "url(" + OpenLayers.Util.getImageLocation("blank.gif") + ")";
        }

        if (this.isFixed) {
            this.map.viewPortDiv.appendChild(this.pane);
        } else {
            this.map.layerContainerDiv.appendChild(this.pane);
        }

        // once our layer has been added to the map, we can load it
        this.loadMapObject();
    
        // if map didn't load, display warning
        if (this.mapObject == null) {
            this.loadWarningMessage();
        }
    },

    /**
     * APIMethod: removeMap
     * On being removed from the map, we'll like to remove the invisible 'pane'
     *     div that we added to it on creation. 
     * 
     * Parameters:
     * map - {<OpenLayers.Map>}
     */
    removeMap: function(map) {
        if (this.pane && this.pane.parentNode) {
            this.pane.parentNode.removeChild(this.pane);
        }
        OpenLayers.Layer.prototype.removeMap.apply(this, arguments);
    },
  
    /**
     * Method: loadWarningMessage
     * If we can't load the map lib, then display an error message to the 
     *     user and tell them where to go for help.
     * 
     *     This function sets up the layout for the warning message. Each 3rd
     *     party layer must implement its own getWarningHTML() function to 
     *     provide the actual warning message.
     */
    loadWarningMessage:function() {

        this.div.style.backgroundColor = "darkblue";

        var viewSize = this.map.getSize();
        
        var msgW = Math.min(viewSize.w, 300);
        var msgH = Math.min(viewSize.h, 200);
        var size = new OpenLayers.Size(msgW, msgH);

        var centerPx = new OpenLayers.Pixel(viewSize.w/2, viewSize.h/2);

        var topLeft = centerPx.add(-size.w/2, -size.h/2);            

        var div = OpenLayers.Util.createDiv(this.name + "_warning", 
                                            topLeft, 
                                            size,
                                            null,
                                            null,
                                            null,
                                            "auto");

        div.style.padding = "7px";
        div.style.backgroundColor = "yellow";

        div.innerHTML = this.getWarningHTML();
        this.div.appendChild(div);
    },
  
    /** 
     * Method: getWarningHTML
     * To be implemented by subclasses.
     * 
     * Returns:
     * {String} String with information on why layer is broken, how to get
     *          it working.
     */
    getWarningHTML:function() {
        //should be implemented by subclasses
        return "";
    },
  
    /**
     * Method: display
     * Set the display on the pane
     *
     * Parameters:
     * display - {Boolean}
     */
    display: function(display) {
        OpenLayers.Layer.prototype.display.apply(this, arguments);
        this.pane.style.display = this.div.style.display;
    },
  
    /**
     * Method: setZIndex
     * Set the z-index order for the pane.
     * 
     * Parameters:
     * zIndex - {int}
     */
    setZIndex: function (zIndex) {
        OpenLayers.Layer.prototype.setZIndex.apply(this, arguments);
        this.pane.style.zIndex = parseInt(this.div.style.zIndex) + 1;
    },
    
    /**
     * Method: moveByPx
     * Move the layer based on pixel vector. To be implemented by subclasses.
     *
     * Parameters:
     * dx - {Number} The x coord of the displacement vector.
     * dy - {Number} The y coord of the displacement vector.
     */
    moveByPx: function(dx, dy) {
        OpenLayers.Layer.prototype.moveByPx.apply(this, arguments);
        
        if (this.dragPanMapObject) {
            this.dragPanMapObject(dx, -dy);
        } else {
            this.moveTo(this.map.getCachedCenter());
        }
    },

    /**
     * Method: moveTo
     * Handle calls to move the layer.
     * 
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     * zoomChanged - {Boolean}
     * dragging - {Boolean}
     */
    moveTo:function(bounds, zoomChanged, dragging) {
        OpenLayers.Layer.prototype.moveTo.apply(this, arguments);

        if (this.mapObject != null) {

            var newCenter = this.map.getCenter();
            var newZoom = this.map.getZoom();

            if (newCenter != null) {

                var moOldCenter = this.getMapObjectCenter();
                var oldCenter = this.getOLLonLatFromMapObjectLonLat(moOldCenter);

                var moOldZoom = this.getMapObjectZoom();
                var oldZoom= this.getOLZoomFromMapObjectZoom(moOldZoom);

                if (!(newCenter.equals(oldCenter)) || newZoom != oldZoom) {

                    if (!zoomChanged && oldCenter && this.dragPanMapObject && 
                        this.smoothDragPan) {
                        var oldPx = this.map.getViewPortPxFromLonLat(oldCenter);
                        var newPx = this.map.getViewPortPxFromLonLat(newCenter);
                        this.dragPanMapObject(newPx.x-oldPx.x, oldPx.y-newPx.y);
                    } else {
                        var center = this.getMapObjectLonLatFromOLLonLat(newCenter);
                        var zoom = this.getMapObjectZoomFromOLZoom(newZoom);
                        this.setMapObjectCenter(center, zoom, dragging);
                    }
                }
            }
        }
    },


  /********************************************************/
  /*                                                      */
  /*                 Baselayer Functions                  */
  /*                                                      */
  /********************************************************/

    /**
     * Method: getLonLatFromViewPortPx
     * Get a map location from a pixel location
     * 
     * Parameters:
     * viewPortPx - {<OpenLayers.Pixel>}
     *
     * Returns:
     *  {<OpenLayers.LonLat>} An OpenLayers.LonLat which is the passed-in view
     *  port OpenLayers.Pixel, translated into lon/lat by map lib
     *  If the map lib is not loaded or not centered, returns null
     */
    getLonLatFromViewPortPx: function (viewPortPx) {
        var lonlat = null;
        if ( (this.mapObject != null) && 
             (this.getMapObjectCenter() != null) ) {
            var moPixel = this.getMapObjectPixelFromOLPixel(viewPortPx);
            var moLonLat = this.getMapObjectLonLatFromMapObjectPixel(moPixel);
            lonlat = this.getOLLonLatFromMapObjectLonLat(moLonLat);
        }
        return lonlat;
    },

 
    /**
     * Method: getViewPortPxFromLonLat
     * Get a pixel location from a map location
     *
     * Parameters:
     * lonlat - {<OpenLayers.LonLat>}
     *
     * Returns:
     * {<OpenLayers.Pixel>} An OpenLayers.Pixel which is the passed-in
     * OpenLayers.LonLat, translated into view port pixels by map lib
     * If map lib is not loaded or not centered, returns null
     */
    getViewPortPxFromLonLat: function (lonlat) {
        var viewPortPx = null;
        if ( (this.mapObject != null) && 
             (this.getMapObjectCenter() != null) ) {

            var moLonLat = this.getMapObjectLonLatFromOLLonLat(lonlat);
            var moPixel = this.getMapObjectPixelFromMapObjectLonLat(moLonLat);
        
            viewPortPx = this.getOLPixelFromMapObjectPixel(moPixel);
        }
        return viewPortPx;
    },

  /********************************************************/
  /*                                                      */
  /*               Translation Functions                  */
  /*                                                      */
  /*   The following functions translate Map Object and   */
  /*            OL formats for Pixel, LonLat              */
  /*                                                      */
  /********************************************************/

  //
  // TRANSLATION: MapObject LatLng <-> OpenLayers.LonLat
  //

    /**
     * Method: getOLLonLatFromMapObjectLonLat
     * Get an OL style map location from a 3rd party style map location
     *
     * Parameters
     * moLonLat - {Object}
     * 
     * Returns:
     * {<OpenLayers.LonLat>} An OpenLayers.LonLat, translated from the passed in 
     *          MapObject LonLat
     *          Returns null if null value is passed in
     */
    getOLLonLatFromMapObjectLonLat: function(moLonLat) {
        var olLonLat = null;
        if (moLonLat != null) {
            var lon = this.getLongitudeFromMapObjectLonLat(moLonLat);
            var lat = this.getLatitudeFromMapObjectLonLat(moLonLat);
            olLonLat = new OpenLayers.LonLat(lon, lat);
        }
        return olLonLat;
    },

    /**
     * Method: getMapObjectLonLatFromOLLonLat
     * Get a 3rd party map location from an OL map location.
     *
     * Parameters:
     * olLonLat - {<OpenLayers.LonLat>}
     * 
     * Returns:
     * {Object} A MapObject LonLat, translated from the passed in 
     *          OpenLayers.LonLat
     *          Returns null if null value is passed in
     */
    getMapObjectLonLatFromOLLonLat: function(olLonLat) {
        var moLatLng = null;
        if (olLonLat != null) {
            moLatLng = this.getMapObjectLonLatFromLonLat(olLonLat.lon,
                                                         olLonLat.lat);
        }
        return moLatLng;
    },


  //
  // TRANSLATION: MapObject Pixel <-> OpenLayers.Pixel
  //

    /**
     * Method: getOLPixelFromMapObjectPixel
     * Get an OL pixel location from a 3rd party pixel location.
     *
     * Parameters:
     * moPixel - {Object}
     * 
     * Returns:
     * {<OpenLayers.Pixel>} An OpenLayers.Pixel, translated from the passed in 
     *          MapObject Pixel
     *          Returns null if null value is passed in
     */
    getOLPixelFromMapObjectPixel: function(moPixel) {
        var olPixel = null;
        if (moPixel != null) {
            var x = this.getXFromMapObjectPixel(moPixel);
            var y = this.getYFromMapObjectPixel(moPixel);
            olPixel = new OpenLayers.Pixel(x, y);
        }
        return olPixel;
    },

    /**
     * Method: getMapObjectPixelFromOLPixel
     * Get a 3rd party pixel location from an OL pixel location
     *
     * Parameters:
     * olPixel - {<OpenLayers.Pixel>}
     * 
     * Returns:
     * {Object} A MapObject Pixel, translated from the passed in 
     *          OpenLayers.Pixel
     *          Returns null if null value is passed in
     */
    getMapObjectPixelFromOLPixel: function(olPixel) {
        var moPixel = null;
        if (olPixel != null) {
            moPixel = this.getMapObjectPixelFromXY(olPixel.x, olPixel.y);
        }
        return moPixel;
    },

    CLASS_NAME: "OpenLayers.Layer.EventPane"
});
/* ======================================================================
    OpenLayers/Layer/FixedZoomLevels.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Layer.js
 */

/**
 * Class: OpenLayers.Layer.FixedZoomLevels
 *   Some Layers will already have established zoom levels (like google 
 *    or ve). Instead of trying to determine them and populate a resolutions[]
 *    Array with those values, we will hijack the resolution functionality
 *    here.
 * 
 *   When you subclass FixedZoomLevels: 
 * 
 *   The initResolutions() call gets nullified, meaning no resolutions[] array 
 *    is set up. Which would be a big problem getResolution() in Layer, since 
 *    it merely takes map.zoom and indexes into resolutions[]... but....
 * 
 *   The getResolution() call is also overridden. Instead of using the 
 *    resolutions[] array, we simply calculate the current resolution based
 *    on the current extent and the current map size. But how will we be able
 *    to calculate the current extent without knowing the resolution...?
 *  
 *   The getExtent() function is also overridden. Instead of calculating extent
 *    based on the center point and the current resolution, we instead 
 *    calculate the extent by getting the lonlats at the top-left and 
 *    bottom-right by using the getLonLatFromViewPortPx() translation function,
 *    taken from the pixel locations (0,0) and the size of the map. But how 
 *    will we be able to do lonlat-px translation without resolution....?
 * 
 *   The getZoomForResolution() method is overridden. Instead of indexing into
 *    the resolutions[] array, we call OpenLayers.Layer.getExent(), passing in
 *    the desired resolution. With this extent, we then call getZoomForExtent() 
 * 
 * 
 *   Whenever you implement a layer using OpenLayers.Layer.FixedZoomLevels, 
 *    it is your responsibility to provide the following three functions:
 * 
 *   - getLonLatFromViewPortPx
 *   - getViewPortPxFromLonLat
 *   - getZoomForExtent
 * 
 *  ...those three functions should generally be provided by any reasonable 
 *  API that you might be working from.
 *
 */
OpenLayers.Layer.FixedZoomLevels = OpenLayers.Class({
      
  /********************************************************/
  /*                                                      */
  /*                 Baselayer Functions                  */
  /*                                                      */
  /*    The following functions must all be implemented   */
  /*                  by all base layers                  */
  /*                                                      */
  /********************************************************/
    
    /**
     * Constructor: OpenLayers.Layer.FixedZoomLevels
     * Create a new fixed zoom levels layer.
     */
    initialize: function() {
        //this class is only just to add the following functions... 
        // nothing to actually do here... but it is probably a good
        // idea to have layers that use these functions call this 
        // inititalize() anyways, in case at some point we decide we 
        // do want to put some functionality or state in here. 
    },
    
    /**
     * Method: initResolutions
     * Populate the resolutions array
     */
    initResolutions: function() {

        var props = ['minZoomLevel', 'maxZoomLevel', 'numZoomLevels'];
          
        for(var i=0, len=props.length; i<len; i++) {
            var property = props[i];
            this[property] = (this.options[property] != null)  
                                     ? this.options[property] 
                                     : this.map[property];
        }

        if ( (this.minZoomLevel == null) ||
             (this.minZoomLevel < this.MIN_ZOOM_LEVEL) ){
            this.minZoomLevel = this.MIN_ZOOM_LEVEL;
        }        

        //
        // At this point, we know what the minimum desired zoom level is, and
        //  we must calculate the total number of zoom levels. 
        //  
        //  Because we allow for the setting of either the 'numZoomLevels'
        //   or the 'maxZoomLevel' properties... on either the layer or the  
        //   map, we have to define some rules to see which we take into
        //   account first in this calculation. 
        //
        // The following is the precedence list for these properties:
        // 
        // (1) numZoomLevels set on layer
        // (2) maxZoomLevel set on layer
        // (3) numZoomLevels set on map
        // (4) maxZoomLevel set on map*
        // (5) none of the above*
        //
        // *Note that options (4) and (5) are only possible if the user 
        //  _explicitly_ sets the 'numZoomLevels' property on the map to 
        //  null, since it is set by default to 16. 
        //

        //
        // Note to future: In 3.0, I think we should remove the default 
        // value of 16 for map.numZoomLevels. Rather, I think that value 
        // should be set as a default on the Layer.WMS class. If someone
        // creates a 3rd party layer and does not specify any 'minZoomLevel', 
        // 'maxZoomLevel', or 'numZoomLevels', and has not explicitly 
        // specified any of those on the map object either.. then I think
        // it is fair to say that s/he wants all the zoom levels available.
        // 
        // By making map.numZoomLevels *null* by default, that will be the 
        // case. As it is, I don't feel comfortable changing that right now
        // as it would be a glaring API change and actually would probably
        // break many peoples' codes. 
        //

        //the number of zoom levels we'd like to have.
        var desiredZoomLevels;

        //this is the maximum number of zoom levels the layer will allow, 
        // given the specified starting minimum zoom level.
        var limitZoomLevels = this.MAX_ZOOM_LEVEL - this.minZoomLevel + 1;

        if ( ((this.options.numZoomLevels == null) && 
              (this.options.maxZoomLevel != null)) // (2)
              ||
             ((this.numZoomLevels == null) &&
              (this.maxZoomLevel != null)) // (4)
           ) {
            //calculate based on specified maxZoomLevel (on layer or map)
            desiredZoomLevels = this.maxZoomLevel - this.minZoomLevel + 1;
        } else {
            //calculate based on specified numZoomLevels (on layer or map)
            // this covers cases (1) and (3)
            desiredZoomLevels = this.numZoomLevels;
        }

        if (desiredZoomLevels != null) {
            //Now that we know what we would *like* the number of zoom levels
            // to be, based on layer or map options, we have to make sure that
            // it does not conflict with the actual limit, as specified by 
            // the constants on the layer itself (and calculated into the
            // 'limitZoomLevels' variable). 
            this.numZoomLevels = Math.min(desiredZoomLevels, limitZoomLevels);
        } else {
            // case (5) -- neither 'numZoomLevels' not 'maxZoomLevel' was 
            // set on either the layer or the map. So we just use the 
            // maximum limit as calculated by the layer's constants.
            this.numZoomLevels = limitZoomLevels;
        }

        //now that the 'numZoomLevels' is appropriately, safely set, 
        // we go back and re-calculate the 'maxZoomLevel'.
        this.maxZoomLevel = this.minZoomLevel + this.numZoomLevels - 1;

        if (this.RESOLUTIONS != null) {
            var resolutionsIndex = 0;
            this.resolutions = [];
            for(var i= this.minZoomLevel; i <= this.maxZoomLevel; i++) {
                this.resolutions[resolutionsIndex++] = this.RESOLUTIONS[i];            
            }
            this.maxResolution = this.resolutions[0];
            this.minResolution = this.resolutions[this.resolutions.length - 1];
        }       
    },
    
    /**
     * APIMethod: getResolution
     * Get the current map resolution
     * 
     * Returns:
     * {Float} Map units per Pixel
     */
    getResolution: function() {

        if (this.resolutions != null) {
            return OpenLayers.Layer.prototype.getResolution.apply(this, arguments);
        } else {
            var resolution = null;
            
            var viewSize = this.map.getSize();
            var extent = this.getExtent();
            
            if ((viewSize != null) && (extent != null)) {
                resolution = Math.max( extent.getWidth()  / viewSize.w,
                                       extent.getHeight() / viewSize.h );
            }
            return resolution;
        }
     },

    /**
     * APIMethod: getExtent
     * Calculates using px-> lonlat translation functions on tl and br 
     *     corners of viewport
     * 
     * Returns:
     * {<OpenLayers.Bounds>} A Bounds object which represents the lon/lat 
     *                       bounds of the current viewPort.
     */
    getExtent: function () {
        var size = this.map.getSize();
        var tl = this.getLonLatFromViewPortPx({
            x: 0, y: 0
        });
        var br = this.getLonLatFromViewPortPx({
            x: size.w, y: size.h
        });
        
        if ((tl != null) && (br != null)) {
            return new OpenLayers.Bounds(tl.lon, br.lat, br.lon, tl.lat);
        } else {
            return null;
        }
    },

    /**
     * Method: getZoomForResolution
     * Get the zoom level for a given resolution
     *
     * Parameters:
     * resolution - {Float}
     *
     * Returns:
     * {Integer} A suitable zoom level for the specified resolution.
     *           If no baselayer is set, returns null.
     */
    getZoomForResolution: function(resolution) {
      
        if (this.resolutions != null) {
            return OpenLayers.Layer.prototype.getZoomForResolution.apply(this, arguments);
        } else {
            var extent = OpenLayers.Layer.prototype.getExtent.apply(this, []);
            return this.getZoomForExtent(extent);
        }
    },



    
    /********************************************************/
    /*                                                      */
    /*             Translation Functions                    */
    /*                                                      */
    /*    The following functions translate GMaps and OL    */ 
    /*     formats for Pixel, LonLat, Bounds, and Zoom      */
    /*                                                      */
    /********************************************************/
    
    
    //
    // TRANSLATION: MapObject Zoom <-> OpenLayers Zoom
    //
  
    /**
     * Method: getOLZoomFromMapObjectZoom
     * Get the OL zoom index from the map object zoom level
     *
     * Parameters:
     * moZoom - {Integer}
     * 
     * Returns:
     * {Integer} An OpenLayers Zoom level, translated from the passed in zoom
     *           Returns null if null value is passed in
     */
    getOLZoomFromMapObjectZoom: function(moZoom) {
        var zoom = null;
        if (moZoom != null) {
            zoom = moZoom - this.minZoomLevel;
            if (this.map.baseLayer !== this) {
                zoom = this.map.baseLayer.getZoomForResolution(
                    this.getResolutionForZoom(zoom)
                );
            }
        }
        return zoom;
    },
    
    /**
     * Method: getMapObjectZoomFromOLZoom
     * Get the map object zoom level from the OL zoom level
     *
     * Parameters:
     * olZoom - {Integer}
     * 
     * Returns:
     * {Integer} A MapObject level, translated from the passed in olZoom
     *           Returns null if null value is passed in
     */
    getMapObjectZoomFromOLZoom: function(olZoom) {
        var zoom = null; 
        if (olZoom != null) {
            zoom = olZoom + this.minZoomLevel;
            if (this.map.baseLayer !== this) {
                zoom = this.getZoomForResolution(
                    this.map.baseLayer.getResolutionForZoom(zoom)
                );
            }
        }
        return zoom;
    },

    CLASS_NAME: "OpenLayers.Layer.FixedZoomLevels"
});

/* ======================================================================
    OpenLayers/Layer/Google.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


/**
 * @requires OpenLayers/Layer/SphericalMercator.js
 * @requires OpenLayers/Layer/EventPane.js
 * @requires OpenLayers/Layer/FixedZoomLevels.js
 * @requires OpenLayers/Lang.js
 */

/**
 * Class: OpenLayers.Layer.Google
 * 
 * Provides a wrapper for Google's Maps API
 * Normally the Terms of Use for this API do not allow wrapping, but Google
 * have provided written consent to OpenLayers for this - see email in 
 * http://osgeo-org.1560.n6.nabble.com/Google-Maps-API-Terms-of-Use-changes-tp4910013p4911981.html
 * 
 * Inherits from:
 *  - <OpenLayers.Layer.SphericalMercator>
 *  - <OpenLayers.Layer.EventPane>
 *  - <OpenLayers.Layer.FixedZoomLevels>
 */
OpenLayers.Layer.Google = OpenLayers.Class(
    OpenLayers.Layer.EventPane, 
    OpenLayers.Layer.FixedZoomLevels, {
    
    /** 
     * Constant: MIN_ZOOM_LEVEL
     * {Integer} 0 
     */
    MIN_ZOOM_LEVEL: 0,
    
    /** 
     * Constant: MAX_ZOOM_LEVEL
     * {Integer} 21
     */
    MAX_ZOOM_LEVEL: 21,

    /** 
     * Constant: RESOLUTIONS
     * {Array(Float)} Hardcode these resolutions so that they are more closely
     *                tied with the standard wms projection
     */
    RESOLUTIONS: [
        1.40625, 
        0.703125, 
        0.3515625, 
        0.17578125, 
        0.087890625, 
        0.0439453125,
        0.02197265625, 
        0.010986328125, 
        0.0054931640625, 
        0.00274658203125,
        0.001373291015625, 
        0.0006866455078125, 
        0.00034332275390625,
        0.000171661376953125, 
        0.0000858306884765625, 
        0.00004291534423828125,
        0.00002145767211914062, 
        0.00001072883605957031,
        0.00000536441802978515, 
        0.00000268220901489257,
        0.0000013411045074462891,
        0.00000067055225372314453
    ],

    /**
     * APIProperty: type
     * {GMapType}
     */
    type: null,

    /**
     * APIProperty: wrapDateLine
     * {Boolean} Allow user to pan forever east/west.  Default is true.  
     *     Setting this to false only restricts panning if 
     *     <sphericalMercator> is true. 
     */
    wrapDateLine: true,

    /**
     * APIProperty: sphericalMercator
     * {Boolean} Should the map act as a mercator-projected map? This will
     *     cause all interactions with the map to be in the actual map 
     *     projection, which allows support for vector drawing, overlaying 
     *     other maps, etc. 
     */
    sphericalMercator: false, 
    
    /**
     * Property: version
     * {Number} The version of the Google Maps API
     */
    version: null,

    /** 
     * Constructor: OpenLayers.Layer.Google
     * 
     * Parameters:
     * name - {String} A name for the layer.
     * options - {Object} An optional object whose properties will be set
     *     on the layer.
     */
    initialize: function(name, options) {
        options = options || {};
        if(!options.version) {
            options.version = typeof GMap2 === "function" ? "2" : "3";
        }
        var mixin = OpenLayers.Layer.Google["v" +
            options.version.replace(/\./g, "_")];
        if (mixin) {
            OpenLayers.Util.applyDefaults(options, mixin);
        } else {
            throw "Unsupported Google Maps API version: " + options.version;
        }

        OpenLayers.Util.applyDefaults(options, mixin.DEFAULTS);
        if (options.maxExtent) {
            options.maxExtent = options.maxExtent.clone();
        }

        OpenLayers.Layer.EventPane.prototype.initialize.apply(this,
            [name, options]);
        OpenLayers.Layer.FixedZoomLevels.prototype.initialize.apply(this, 
            [name, options]);

        if (this.sphericalMercator) {
            OpenLayers.Util.extend(this, OpenLayers.Layer.SphericalMercator);
            this.initMercatorParameters();
        }    
    },

    /**
     * Method: clone
     * Create a clone of this layer
     *
     * Returns:
     * {<OpenLayers.Layer.Google>} An exact clone of this layer
     */
    clone: function() {
        /**
         * This method isn't intended to be called by a subclass and it
         * doesn't call the same method on the superclass.  We don't call
         * the super's clone because we don't want properties that are set
         * on this layer after initialize (i.e. this.mapObject etc.).
         */
        return new OpenLayers.Layer.Google(
            this.name, this.getOptions()
        );
    },

    /**
     * APIMethod: setVisibility
     * Set the visibility flag for the layer and hide/show & redraw 
     *     accordingly. Fire event unless otherwise specified
     * 
     * Note that visibility is no longer simply whether or not the layer's
     *     style.display is set to "block". Now we store a 'visibility' state 
     *     property on the layer class, this allows us to remember whether or 
     *     not we *desire* for a layer to be visible. In the case where the 
     *     map's resolution is out of the layer's range, this desire may be 
     *     subverted.
     * 
     * Parameters:
     * visible - {Boolean} Display the layer (if in range)
     */
    setVisibility: function(visible) {
        // sharing a map container, opacity has to be set per layer
        var opacity = this.opacity == null ? 1 : this.opacity;
        OpenLayers.Layer.EventPane.prototype.setVisibility.apply(this, arguments);
        this.setOpacity(opacity);
    },
    
    /** 
     * APIMethod: display
     * Hide or show the Layer
     * 
     * Parameters:
     * visible - {Boolean}
     */
    display: function(visible) {
        if (!this._dragging) {
            this.setGMapVisibility(visible);
        }
        OpenLayers.Layer.EventPane.prototype.display.apply(this, arguments);
    },
    
    /**
     * Method: moveTo
     * 
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     * zoomChanged - {Boolean} Tells when zoom has changed, as layers have to
     *     do some init work in that case.
     * dragging - {Boolean}
     */
    moveTo: function(bounds, zoomChanged, dragging) {
        this._dragging = dragging;
        OpenLayers.Layer.EventPane.prototype.moveTo.apply(this, arguments);
        delete this._dragging;
    },
    
    /**
     * APIMethod: setOpacity
     * Sets the opacity for the entire layer (all images)
     * 
     * Parameters:
     * opacity - {Float}
     */
    setOpacity: function(opacity) {
        if (opacity !== this.opacity) {
            if (this.map != null) {
                this.map.events.triggerEvent("changelayer", {
                    layer: this,
                    property: "opacity"
                });
            }
            this.opacity = opacity;
        }
        // Though this layer's opacity may not change, we're sharing a container
        // and need to update the opacity for the entire container.
        if (this.getVisibility()) {
            var container = this.getMapContainer();
            OpenLayers.Util.modifyDOMElement(
                container, null, null, null, null, null, null, opacity
            );
        }
    },

    /**
     * APIMethod: destroy
     * Clean up this layer.
     */
    destroy: function() {
        /**
         * We have to override this method because the event pane destroy
         * deletes the mapObject reference before removing this layer from
         * the map.
         */
        if (this.map) {
            this.setGMapVisibility(false);
            var cache = OpenLayers.Layer.Google.cache[this.map.id];
            if (cache && cache.count <= 1) {
                this.removeGMapElements();
            }            
        }
        OpenLayers.Layer.EventPane.prototype.destroy.apply(this, arguments);
    },
    
    /**
     * Method: removeGMapElements
     * Remove all elements added to the dom.  This should only be called if
     * this is the last of the Google layers for the given map.
     */
    removeGMapElements: function() {
        var cache = OpenLayers.Layer.Google.cache[this.map.id];
        if (cache) {
            // remove shared elements from dom
            var container = this.mapObject && this.getMapContainer();                
            if (container && container.parentNode) {
                container.parentNode.removeChild(container);
            }
            var termsOfUse = cache.termsOfUse;
            if (termsOfUse && termsOfUse.parentNode) {
                termsOfUse.parentNode.removeChild(termsOfUse);
            }
            var poweredBy = cache.poweredBy;
            if (poweredBy && poweredBy.parentNode) {
                poweredBy.parentNode.removeChild(poweredBy);
            }
        }
    },

    /**
     * APIMethod: removeMap
     * On being removed from the map, also remove termsOfUse and poweredBy divs
     * 
     * Parameters:
     * map - {<OpenLayers.Map>}
     */
    removeMap: function(map) {
        // hide layer before removing
        if (this.visibility && this.mapObject) {
            this.setGMapVisibility(false);
        }
        // check to see if last Google layer in this map
        var cache = OpenLayers.Layer.Google.cache[map.id];
        if (cache) {
            if (cache.count <= 1) {
                this.removeGMapElements();
                delete OpenLayers.Layer.Google.cache[map.id];
            } else {
                // decrement the layer count
                --cache.count;
            }
        }
        // remove references to gmap elements
        delete this.termsOfUse;
        delete this.poweredBy;
        delete this.mapObject;
        delete this.dragObject;
        OpenLayers.Layer.EventPane.prototype.removeMap.apply(this, arguments);
    },
    
  //
  // TRANSLATION: MapObject Bounds <-> OpenLayers.Bounds
  //

    /**
     * APIMethod: getOLBoundsFromMapObjectBounds
     * 
     * Parameters:
     * moBounds - {Object}
     * 
     * Returns:
     * {<OpenLayers.Bounds>} An <OpenLayers.Bounds>, translated from the 
     *                       passed-in MapObject Bounds.
     *                       Returns null if null value is passed in.
     */
    getOLBoundsFromMapObjectBounds: function(moBounds) {
        var olBounds = null;
        if (moBounds != null) {
            var sw = moBounds.getSouthWest();
            var ne = moBounds.getNorthEast();
            if (this.sphericalMercator) {
                sw = this.forwardMercator(sw.lng(), sw.lat());
                ne = this.forwardMercator(ne.lng(), ne.lat());
            } else {
                sw = new OpenLayers.LonLat(sw.lng(), sw.lat()); 
                ne = new OpenLayers.LonLat(ne.lng(), ne.lat()); 
            }    
            olBounds = new OpenLayers.Bounds(sw.lon, 
                                             sw.lat, 
                                             ne.lon, 
                                             ne.lat );
        }
        return olBounds;
    },

    /** 
     * APIMethod: getWarningHTML
     * 
     * Returns: 
     * {String} String with information on why layer is broken, how to get
     *          it working.
     */
    getWarningHTML:function() {
        return OpenLayers.i18n("googleWarning");
    },


    /************************************
     *                                  *
     *   MapObject Interface Controls   *
     *                                  *
     ************************************/


  // Get&Set Center, Zoom

    /**
     * APIMethod: getMapObjectCenter
     * 
     * Returns: 
     * {Object} The mapObject's current center in Map Object format
     */
    getMapObjectCenter: function() {
        return this.mapObject.getCenter();
    },

    /** 
     * APIMethod: getMapObjectZoom
     * 
     * Returns:
     * {Integer} The mapObject's current zoom, in Map Object format
     */
    getMapObjectZoom: function() {
        return this.mapObject.getZoom();
    },

  
    /************************************
     *                                  *
     *       MapObject Primitives       *
     *                                  *
     ************************************/


  // LonLat
    
    /**
     * APIMethod: getLongitudeFromMapObjectLonLat
     * 
     * Parameters:
     * moLonLat - {Object} MapObject LonLat format
     * 
     * Returns:
     * {Float} Longitude of the given MapObject LonLat
     */
    getLongitudeFromMapObjectLonLat: function(moLonLat) {
        return this.sphericalMercator ? 
          this.forwardMercator(moLonLat.lng(), moLonLat.lat()).lon :
          moLonLat.lng();  
    },

    /**
     * APIMethod: getLatitudeFromMapObjectLonLat
     * 
     * Parameters:
     * moLonLat - {Object} MapObject LonLat format
     * 
     * Returns:
     * {Float} Latitude of the given MapObject LonLat
     */
    getLatitudeFromMapObjectLonLat: function(moLonLat) {
        var lat = this.sphericalMercator ? 
          this.forwardMercator(moLonLat.lng(), moLonLat.lat()).lat :
          moLonLat.lat(); 
        return lat;  
    },
    
  // Pixel
    
    /**
     * APIMethod: getXFromMapObjectPixel
     * 
     * Parameters:
     * moPixel - {Object} MapObject Pixel format
     * 
     * Returns:
     * {Integer} X value of the MapObject Pixel
     */
    getXFromMapObjectPixel: function(moPixel) {
        return moPixel.x;
    },

    /**
     * APIMethod: getYFromMapObjectPixel
     * 
     * Parameters:
     * moPixel - {Object} MapObject Pixel format
     * 
     * Returns:
     * {Integer} Y value of the MapObject Pixel
     */
    getYFromMapObjectPixel: function(moPixel) {
        return moPixel.y;
    },
    
    CLASS_NAME: "OpenLayers.Layer.Google"
});

/**
 * Property: OpenLayers.Layer.Google.cache
 * {Object} Cache for elements that should only be created once per map.
 */
OpenLayers.Layer.Google.cache = {};


/**
 * Constant: OpenLayers.Layer.Google.v2
 * 
 * Mixin providing functionality specific to the Google Maps API v2.
 * 
 * This API has been deprecated by Google.
 * Developers are encouraged to migrate to v3 of the API; support for this
 * is provided by <OpenLayers.Layer.Google.v3>
 */
OpenLayers.Layer.Google.v2 = {
    
    /**
     * Property: termsOfUse
     * {DOMElement} Div for Google's copyright and terms of use link
     */
    termsOfUse: null, 

    /**
     * Property: poweredBy
     * {DOMElement} Div for Google's powered by logo and link
     */
    poweredBy: null, 

    /**
     * Property: dragObject
     * {GDraggableObject} Since 2.93, Google has exposed the ability to get
     *     the maps GDraggableObject. We can now use this for smooth panning
     */
    dragObject: null, 
    
    /** 
     * Method: loadMapObject
     * Load the GMap and register appropriate event listeners. If we can't 
     *     load GMap2, then display a warning message.
     */
    loadMapObject:function() {
        if (!this.type) {
            this.type = G_NORMAL_MAP;
        }
        var mapObject, termsOfUse, poweredBy;
        var cache = OpenLayers.Layer.Google.cache[this.map.id];
        if (cache) {
            // there are already Google layers added to this map
            mapObject = cache.mapObject;
            termsOfUse = cache.termsOfUse;
            poweredBy = cache.poweredBy;
            // increment the layer count
            ++cache.count;
        } else {
            // this is the first Google layer for this map

            var container = this.map.viewPortDiv;
            var div = document.createElement("div");
            div.id = this.map.id + "_GMap2Container";
            div.style.position = "absolute";
            div.style.width = "100%";
            div.style.height = "100%";
            container.appendChild(div);

            // create GMap and shuffle elements
            try {
                mapObject = new GMap2(div);
                
                // move the ToS and branding stuff up to the container div
                termsOfUse = div.lastChild;
                container.appendChild(termsOfUse);
                termsOfUse.style.zIndex = "1100";
                termsOfUse.style.right = "";
                termsOfUse.style.bottom = "";
                termsOfUse.className = "olLayerGoogleCopyright";

                poweredBy = div.lastChild;
                container.appendChild(poweredBy);
                poweredBy.style.zIndex = "1100";
                poweredBy.style.right = "";
                poweredBy.style.bottom = "";
                poweredBy.className = "olLayerGooglePoweredBy gmnoprint";
                
            } catch (e) {
                throw(e);
            }
            // cache elements for use by any other google layers added to
            // this same map
            OpenLayers.Layer.Google.cache[this.map.id] = {
                mapObject: mapObject,
                termsOfUse: termsOfUse,
                poweredBy: poweredBy,
                count: 1
            };
        }

        this.mapObject = mapObject;
        this.termsOfUse = termsOfUse;
        this.poweredBy = poweredBy;
        
        // ensure this layer type is one of the mapObject types
        if (OpenLayers.Util.indexOf(this.mapObject.getMapTypes(),
                                    this.type) === -1) {
            this.mapObject.addMapType(this.type);
        }

        //since v 2.93 getDragObject is now available.
        if(typeof mapObject.getDragObject == "function") {
            this.dragObject = mapObject.getDragObject();
        } else {
            this.dragPanMapObject = null;
        }
        
        if(this.isBaseLayer === false) {
            this.setGMapVisibility(this.div.style.display !== "none");
        }

    },

    /**
     * APIMethod: onMapResize
     */
    onMapResize: function() {
        // workaround for resizing of invisible or not yet fully loaded layers
        // where GMap2.checkResize() does not work. We need to load the GMap
        // for the old div size, then checkResize(), and then call
        // layer.moveTo() to trigger GMap.setCenter() (which will finish
        // the GMap initialization).
        if(this.visibility && this.mapObject.isLoaded()) {
            this.mapObject.checkResize();
        } else {
            if(!this._resized) {
                var layer = this;
                var handle = GEvent.addListener(this.mapObject, "load", function() {
                    GEvent.removeListener(handle);
                    delete layer._resized;
                    layer.mapObject.checkResize();
                    layer.moveTo(layer.map.getCenter(), layer.map.getZoom());
                });
            }
            this._resized = true;
        }
    },

    /**
     * Method: setGMapVisibility
     * Display the GMap container and associated elements.
     * 
     * Parameters:
     * visible - {Boolean} Display the GMap elements.
     */
    setGMapVisibility: function(visible) {
        var cache = OpenLayers.Layer.Google.cache[this.map.id];
        if (cache) {
            var container = this.mapObject.getContainer();
            if (visible === true) {
                this.mapObject.setMapType(this.type);
                container.style.display = "";
                this.termsOfUse.style.left = "";
                this.termsOfUse.style.display = "";
                this.poweredBy.style.display = "";            
                cache.displayed = this.id;
            } else {
                if (cache.displayed === this.id) {
                    delete cache.displayed;
                }
                if (!cache.displayed) {
                    container.style.display = "none";
                    this.termsOfUse.style.display = "none";
                    // move ToU far to the left in addition to setting display
                    // to "none", because at the end of the GMap2 load
                    // sequence, display: none will be unset and ToU would be
                    // visible after loading a map with a google layer that is
                    // initially hidden. 
                    this.termsOfUse.style.left = "-9999px";
                    this.poweredBy.style.display = "none";
                }
            }
        }
    },
    
    /**
     * Method: getMapContainer
     * 
     * Returns:
     * {DOMElement} the GMap container's div
     */
    getMapContainer: function() {
        return this.mapObject.getContainer();
    },

  //
  // TRANSLATION: MapObject Bounds <-> OpenLayers.Bounds
  //

    /**
     * APIMethod: getMapObjectBoundsFromOLBounds
     * 
     * Parameters:
     * olBounds - {<OpenLayers.Bounds>}
     * 
     * Returns:
     * {Object} A MapObject Bounds, translated from olBounds
     *          Returns null if null value is passed in
     */
    getMapObjectBoundsFromOLBounds: function(olBounds) {
        var moBounds = null;
        if (olBounds != null) {
            var sw = this.sphericalMercator ? 
              this.inverseMercator(olBounds.bottom, olBounds.left) : 
              new OpenLayers.LonLat(olBounds.bottom, olBounds.left);
            var ne = this.sphericalMercator ? 
              this.inverseMercator(olBounds.top, olBounds.right) : 
              new OpenLayers.LonLat(olBounds.top, olBounds.right);
            moBounds = new GLatLngBounds(new GLatLng(sw.lat, sw.lon),
                                         new GLatLng(ne.lat, ne.lon));
        }
        return moBounds;
    },


    /************************************
     *                                  *
     *   MapObject Interface Controls   *
     *                                  *
     ************************************/


  // Get&Set Center, Zoom

    /** 
     * APIMethod: setMapObjectCenter
     * Set the mapObject to the specified center and zoom
     * 
     * Parameters:
     * center - {Object} MapObject LonLat format
     * zoom - {int} MapObject zoom format
     */
    setMapObjectCenter: function(center, zoom) {
        this.mapObject.setCenter(center, zoom); 
    },
   
    /**
     * APIMethod: dragPanMapObject
     * 
     * Parameters:
     * dX - {Integer}
     * dY - {Integer}
     */
    dragPanMapObject: function(dX, dY) {
        this.dragObject.moveBy(new GSize(-dX, dY));
    },


  // LonLat - Pixel Translation
  
    /**
     * APIMethod: getMapObjectLonLatFromMapObjectPixel
     * 
     * Parameters:
     * moPixel - {Object} MapObject Pixel format
     * 
     * Returns:
     * {Object} MapObject LonLat translated from MapObject Pixel
     */
    getMapObjectLonLatFromMapObjectPixel: function(moPixel) {
        return this.mapObject.fromContainerPixelToLatLng(moPixel);
    },

    /**
     * APIMethod: getMapObjectPixelFromMapObjectLonLat
     * 
     * Parameters:
     * moLonLat - {Object} MapObject LonLat format
     * 
     * Returns:
     * {Object} MapObject Pixel transtlated from MapObject LonLat
     */
    getMapObjectPixelFromMapObjectLonLat: function(moLonLat) {
        return this.mapObject.fromLatLngToContainerPixel(moLonLat);
    },

  
  // Bounds
  
    /** 
     * APIMethod: getMapObjectZoomFromMapObjectBounds
     * 
     * Parameters:
     * moBounds - {Object} MapObject Bounds format
     * 
     * Returns:
     * {Object} MapObject Zoom for specified MapObject Bounds
     */
    getMapObjectZoomFromMapObjectBounds: function(moBounds) {
        return this.mapObject.getBoundsZoomLevel(moBounds);
    },

    /************************************
     *                                  *
     *       MapObject Primitives       *
     *                                  *
     ************************************/


  // LonLat
    
    /**
     * APIMethod: getMapObjectLonLatFromLonLat
     * 
     * Parameters:
     * lon - {Float}
     * lat - {Float}
     * 
     * Returns:
     * {Object} MapObject LonLat built from lon and lat params
     */
    getMapObjectLonLatFromLonLat: function(lon, lat) {
        var gLatLng;
        if(this.sphericalMercator) {
            var lonlat = this.inverseMercator(lon, lat);
            gLatLng = new GLatLng(lonlat.lat, lonlat.lon);
        } else {
            gLatLng = new GLatLng(lat, lon);
        }
        return gLatLng;
    },

  // Pixel
    
    /**
     * APIMethod: getMapObjectPixelFromXY
     * 
     * Parameters:
     * x - {Integer}
     * y - {Integer}
     * 
     * Returns:
     * {Object} MapObject Pixel from x and y parameters
     */
    getMapObjectPixelFromXY: function(x, y) {
        return new GPoint(x, y);
    }
    
};
/* ======================================================================
    OpenLayers/Control.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/BaseTypes/Class.js
 */

/**
 * Class: OpenLayers.Control
 * Controls affect the display or behavior of the map. They allow everything
 * from panning and zooming to displaying a scale indicator. Controls by 
 * default are added to the map they are contained within however it is
 * possible to add a control to an external div by passing the div in the
 * options parameter.
 * 
 * Example:
 * The following example shows how to add many of the common controls
 * to a map.
 * 
 * > var map = new OpenLayers.Map('map', { controls: [] });
 * >
 * > map.addControl(new OpenLayers.Control.PanZoomBar());
 * > map.addControl(new OpenLayers.Control.LayerSwitcher({'ascending':false}));
 * > map.addControl(new OpenLayers.Control.Permalink());
 * > map.addControl(new OpenLayers.Control.Permalink('permalink'));
 * > map.addControl(new OpenLayers.Control.MousePosition());
 * > map.addControl(new OpenLayers.Control.OverviewMap());
 * > map.addControl(new OpenLayers.Control.KeyboardDefaults());
 *
 * The next code fragment is a quick example of how to intercept 
 * shift-mouse click to display the extent of the bounding box
 * dragged out by the user.  Usually controls are not created
 * in exactly this manner.  See the source for a more complete 
 * example:
 *
 * > var control = new OpenLayers.Control();
 * > OpenLayers.Util.extend(control, {
 * >     draw: function () {
 * >         // this Handler.Box will intercept the shift-mousedown
 * >         // before Control.MouseDefault gets to see it
 * >         this.box = new OpenLayers.Handler.Box( control, 
 * >             {"done": this.notice},
 * >             {keyMask: OpenLayers.Handler.MOD_SHIFT});
 * >         this.box.activate();
 * >     },
 * >
 * >     notice: function (bounds) {
 * >         OpenLayers.Console.userError(bounds);
 * >     }
 * > }); 
 * > map.addControl(control);
 * 
 */
OpenLayers.Control = OpenLayers.Class({

    /** 
     * Property: id 
     * {String} 
     */
    id: null,
    
    /** 
     * Property: map 
     * {<OpenLayers.Map>} this gets set in the addControl() function in
     * OpenLayers.Map 
     */
    map: null,

    /** 
     * APIProperty: div 
     * {DOMElement} The element that contains the control, if not present the 
     *     control is placed inside the map.
     */
    div: null,

    /** 
     * APIProperty: type 
     * {Number} Controls can have a 'type'. The type determines the type of
     * interactions which are possible with them when they are placed in an
     * <OpenLayers.Control.Panel>. 
     */
    type: null, 

    /** 
     * Property: allowSelection
     * {Boolean} By default, controls do not allow selection, because
     * it may interfere with map dragging. If this is true, OpenLayers
     * will not prevent selection of the control.
     * Default is false.
     */
    allowSelection: false,  

    /** 
     * Property: displayClass 
     * {string}  This property is used for CSS related to the drawing of the
     * Control. 
     */
    displayClass: "",
    
    /**
    * APIProperty: title  
    * {string}  This property is used for showing a tooltip over the  
    * Control.  
    */ 
    title: "",

    /**
     * APIProperty: autoActivate
     * {Boolean} Activate the control when it is added to a map.  Default is
     *     false.
     */
    autoActivate: false,

    /** 
     * APIProperty: active 
     * {Boolean} The control is active (read-only).  Use <activate> and 
     *     <deactivate> to change control state.
     */
    active: null,

    /**
     * Property: handlerOptions
     * {Object} Used to set non-default properties on the control's handler
     */
    handlerOptions: null,

    /** 
     * Property: handler 
     * {<OpenLayers.Handler>} null
     */
    handler: null,

    /**
     * APIProperty: eventListeners
     * {Object} If set as an option at construction, the eventListeners
     *     object will be registered with <OpenLayers.Events.on>.  Object
     *     structure must be a listeners object as shown in the example for
     *     the events.on method.
     */
    eventListeners: null,

    /** 
     * APIProperty: events
     * {<OpenLayers.Events>} Events instance for listeners and triggering
     *     control specific events.
     *
     * Register a listener for a particular event with the following syntax:
     * (code)
     * control.events.register(type, obj, listener);
     * (end)
     *
     * Listeners will be called with a reference to an event object.  The
     *     properties of this event depends on exactly what happened.
     *
     * All event objects have at least the following properties:
     * object - {Object} A reference to control.events.object (a reference
     *      to the control).
     * element - {DOMElement} A reference to control.events.element (which
     *      will be null unless documented otherwise).
     *
     * Supported map event types:
     * activate - Triggered when activated.
     * deactivate - Triggered when deactivated.
     */
    events: null,

    /**
     * Constructor: OpenLayers.Control
     * Create an OpenLayers Control.  The options passed as a parameter
     * directly extend the control.  For example passing the following:
     * 
     * > var control = new OpenLayers.Control({div: myDiv});
     *
     * Overrides the default div attribute value of null.
     * 
     * Parameters:
     * options - {Object} 
     */
    initialize: function (options) {
        // We do this before the extend so that instances can override
        // className in options.
        this.displayClass = 
            this.CLASS_NAME.replace("OpenLayers.", "ol").replace(/\./g, "");
        
        OpenLayers.Util.extend(this, options);
        
        this.events = new OpenLayers.Events(this);
        if(this.eventListeners instanceof Object) {
            this.events.on(this.eventListeners);
        }
        if (this.id == null) {
            this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_");
        }
    },

    /**
     * Method: destroy
     * The destroy method is used to perform any clean up before the control
     * is dereferenced.  Typically this is where event listeners are removed
     * to prevent memory leaks.
     */
    destroy: function () {
        if(this.events) {
            if(this.eventListeners) {
                this.events.un(this.eventListeners);
            }
            this.events.destroy();
            this.events = null;
        }
        this.eventListeners = null;

        // eliminate circular references
        if (this.handler) {
            this.handler.destroy();
            this.handler = null;
        }
        if(this.handlers) {
            for(var key in this.handlers) {
                if(this.handlers.hasOwnProperty(key) &&
                   typeof this.handlers[key].destroy == "function") {
                    this.handlers[key].destroy();
                }
            }
            this.handlers = null;
        }
        if (this.map) {
            this.map.removeControl(this);
            this.map = null;
        }
        this.div = null;
    },

    /** 
     * Method: setMap
     * Set the map property for the control. This is done through an accessor
     * so that subclasses can override this and take special action once 
     * they have their map variable set. 
     *
     * Parameters:
     * map - {<OpenLayers.Map>} 
     */
    setMap: function(map) {
        this.map = map;
        if (this.handler) {
            this.handler.setMap(map);
        }
    },
  
    /**
     * Method: draw
     * The draw method is called when the control is ready to be displayed
     * on the page.  If a div has not been created one is created.  Controls
     * with a visual component will almost always want to override this method 
     * to customize the look of control. 
     *
     * Parameters:
     * px - {<OpenLayers.Pixel>} The top-left pixel position of the control
     *      or null.
     *
     * Returns:
     * {DOMElement} A reference to the DIV DOMElement containing the control
     */
    draw: function (px) {
        if (this.div == null) {
            this.div = OpenLayers.Util.createDiv(this.id);
            this.div.className = this.displayClass;
            if (!this.allowSelection) {
                this.div.className += " olControlNoSelect";
                this.div.setAttribute("unselectable", "on", 0);
                this.div.onselectstart = OpenLayers.Function.False; 
            }    
            if (this.title != "") {
                this.div.title = this.title;
            }
        }
        if (px != null) {
            this.position = px.clone();
        }
        this.moveTo(this.position);
        return this.div;
    },

    /**
     * Method: moveTo
     * Sets the left and top style attributes to the passed in pixel 
     * coordinates.
     *
     * Parameters:
     * px - {<OpenLayers.Pixel>}
     */
    moveTo: function (px) {
        if ((px != null) && (this.div != null)) {
            this.div.style.left = px.x + "px";
            this.div.style.top = px.y + "px";
        }
    },

    /**
     * APIMethod: activate
     * Explicitly activates a control and it's associated
     * handler if one has been set.  Controls can be
     * deactivated by calling the deactivate() method.
     * 
     * Returns:
     * {Boolean}  True if the control was successfully activated or
     *            false if the control was already active.
     */
    activate: function () {
        if (this.active) {
            return false;
        }
        if (this.handler) {
            this.handler.activate();
        }
        this.active = true;
        if(this.map) {
            OpenLayers.Element.addClass(
                this.map.viewPortDiv,
                this.displayClass.replace(/ /g, "") + "Active"
            );
        }
        this.events.triggerEvent("activate");
        return true;
    },
    
    /**
     * APIMethod: deactivate
     * Deactivates a control and it's associated handler if any.  The exact
     * effect of this depends on the control itself.
     * 
     * Returns:
     * {Boolean} True if the control was effectively deactivated or false
     *           if the control was already inactive.
     */
    deactivate: function () {
        if (this.active) {
            if (this.handler) {
                this.handler.deactivate();
            }
            this.active = false;
            if(this.map) {
                OpenLayers.Element.removeClass(
                    this.map.viewPortDiv,
                    this.displayClass.replace(/ /g, "") + "Active"
                );
            }
            this.events.triggerEvent("deactivate");
            return true;
        }
        return false;
    },

    CLASS_NAME: "OpenLayers.Control"
});

/**
 * Constant: OpenLayers.Control.TYPE_BUTTON
 */
OpenLayers.Control.TYPE_BUTTON = 1;

/**
 * Constant: OpenLayers.Control.TYPE_TOGGLE
 */
OpenLayers.Control.TYPE_TOGGLE = 2;

/**
 * Constant: OpenLayers.Control.TYPE_TOOL
 */
OpenLayers.Control.TYPE_TOOL   = 3;
/* ======================================================================
    OpenLayers/Control/Attribution.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Control.js
 */

/**
 * Class: OpenLayers.Control.Attribution
 * The attribution control adds attribution from layers to the map display. 
 * It uses 'attribution' property of each layer.
 *
 * Inherits from:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.Attribution = 
  OpenLayers.Class(OpenLayers.Control, {
    
    /**
     * APIProperty: seperator
     * {String} String used to seperate layers.
     */
    separator: ", ",
    
    /**
     * APIProperty: template
     * {String} Template for the attribution. This has to include the substring
     *     "${layers}", which will be replaced by the layer specific
     *     attributions, separated by <separator>. The default is "${layers}".
     */
    template: "${layers}",
    
    /**
     * Constructor: OpenLayers.Control.Attribution 
     * 
     * Parameters:
     * options - {Object} Options for control.
     */

    /** 
     * Method: destroy
     * Destroy control.
     */
    destroy: function() {
        this.map.events.un({
            "removelayer": this.updateAttribution,
            "addlayer": this.updateAttribution,
            "changelayer": this.updateAttribution,
            "changebaselayer": this.updateAttribution,
            scope: this
        });
        
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },    
    
    /**
     * Method: draw
     * Initialize control.
     * 
     * Returns: 
     * {DOMElement} A reference to the DIV DOMElement containing the control
     */    
    draw: function() {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        
        this.map.events.on({
            'changebaselayer': this.updateAttribution,
            'changelayer': this.updateAttribution,
            'addlayer': this.updateAttribution,
            'removelayer': this.updateAttribution,
            scope: this
        });
        this.updateAttribution();
        
        return this.div;    
    },

    /**
     * Method: updateAttribution
     * Update attribution string.
     */
    updateAttribution: function() {
        var attributions = [];
        if (this.map && this.map.layers) {
            for(var i=0, len=this.map.layers.length; i<len; i++) {
                var layer = this.map.layers[i];
                if (layer.attribution && layer.getVisibility()) {
                    // add attribution only if attribution text is unique
                    if (OpenLayers.Util.indexOf(
                                    attributions, layer.attribution) === -1) {
                        attributions.push( layer.attribution );
                    }
                }
            } 
            this.div.innerHTML = OpenLayers.String.format(this.template, {
                layers: attributions.join(this.separator)
            });
        }
    },

    CLASS_NAME: "OpenLayers.Control.Attribution"
});
/* ======================================================================
    OpenLayers/Handler.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/BaseTypes/Class.js
 * @requires OpenLayers/Events.js
 */

/**
 * Class: OpenLayers.Handler
 * Base class to construct a higher-level handler for event sequences.  All
 *     handlers have activate and deactivate methods.  In addition, they have
 *     methods named like browser events.  When a handler is activated, any
 *     additional methods named like a browser event is registered as a
 *     listener for the corresponding event.  When a handler is deactivated,
 *     those same methods are unregistered as event listeners.
 *
 * Handlers also typically have a callbacks object with keys named like
 *     the abstracted events or event sequences that they are in charge of
 *     handling.  The controls that wrap handlers define the methods that
 *     correspond to these abstract events - so instead of listening for
 *     individual browser events, they only listen for the abstract events
 *     defined by the handler.
 *     
 * Handlers are created by controls, which ultimately have the responsibility
 *     of making changes to the the state of the application.  Handlers
 *     themselves may make temporary changes, but in general are expected to
 *     return the application in the same state that they found it.
 */
OpenLayers.Handler = OpenLayers.Class({

    /**
     * Property: id
     * {String}
     */
    id: null,
        
    /**
     * APIProperty: control
     * {<OpenLayers.Control>}. The control that initialized this handler.  The
     *     control is assumed to have a valid map property - that map is used
     *     in the handler's own setMap method.
     */
    control: null,

    /**
     * Property: map
     * {<OpenLayers.Map>}
     */
    map: null,

    /**
     * APIProperty: keyMask
     * {Integer} Use bitwise operators and one or more of the OpenLayers.Handler
     *     constants to construct a keyMask.  The keyMask is used by
     *     <checkModifiers>.  If the keyMask matches the combination of keys
     *     down on an event, checkModifiers returns true.
     *
     * Example:
     * (code)
     *     // handler only responds if the Shift key is down
     *     handler.keyMask = OpenLayers.Handler.MOD_SHIFT;
     *
     *     // handler only responds if Ctrl-Shift is down
     *     handler.keyMask = OpenLayers.Handler.MOD_SHIFT |
     *                       OpenLayers.Handler.MOD_CTRL;
     * (end)
     */
    keyMask: null,

    /**
     * Property: active
     * {Boolean}
     */
    active: false,
    
    /**
     * Property: evt
     * {Event} This property references the last event handled by the handler.
     *     Note that this property is not part of the stable API.  Use of the
     *     evt property should be restricted to controls in the library
     *     or other applications that are willing to update with changes to
     *     the OpenLayers code.
     */
    evt: null,

    /**
     * Constructor: OpenLayers.Handler
     * Construct a handler.
     *
     * Parameters:
     * control - {<OpenLayers.Control>} The control that initialized this
     *     handler.  The control is assumed to have a valid map property; that
     *     map is used in the handler's own setMap method.  If a map property
     *     is present in the options argument it will be used instead.
     * callbacks - {Object} An object whose properties correspond to abstracted
     *     events or sequences of browser events.  The values for these
     *     properties are functions defined by the control that get called by
     *     the handler.
     * options - {Object} An optional object whose properties will be set on
     *     the handler.
     */
    initialize: function(control, callbacks, options) {
        OpenLayers.Util.extend(this, options);
        this.control = control;
        this.callbacks = callbacks;

        var map = this.map || control.map;
        if (map) {
            this.setMap(map); 
        }
        
        this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_");
    },
    
    /**
     * Method: setMap
     */
    setMap: function (map) {
        this.map = map;
    },

    /**
     * Method: checkModifiers
     * Check the keyMask on the handler.  If no <keyMask> is set, this always
     *     returns true.  If a <keyMask> is set and it matches the combination
     *     of keys down on an event, this returns true.
     *
     * Returns:
     * {Boolean} The keyMask matches the keys down on an event.
     */
    checkModifiers: function (evt) {
        if(this.keyMask == null) {
            return true;
        }
        /* calculate the keyboard modifier mask for this event */
        var keyModifiers =
            (evt.shiftKey ? OpenLayers.Handler.MOD_SHIFT : 0) |
            (evt.ctrlKey  ? OpenLayers.Handler.MOD_CTRL  : 0) |
            (evt.altKey   ? OpenLayers.Handler.MOD_ALT   : 0) |
            (evt.metaKey  ? OpenLayers.Handler.MOD_META  : 0);
    
        /* if it differs from the handler object's key mask,
           bail out of the event handler */
        return (keyModifiers == this.keyMask);
    },

    /**
     * APIMethod: activate
     * Turn on the handler.  Returns false if the handler was already active.
     * 
     * Returns: 
     * {Boolean} The handler was activated.
     */
    activate: function() {
        if(this.active) {
            return false;
        }
        // register for event handlers defined on this class.
        var events = OpenLayers.Events.prototype.BROWSER_EVENTS;
        for (var i=0, len=events.length; i<len; i++) {
            if (this[events[i]]) {
                this.register(events[i], this[events[i]]); 
            }
        } 
        this.active = true;
        return true;
    },
    
    /**
     * APIMethod: deactivate
     * Turn off the handler.  Returns false if the handler was already inactive.
     * 
     * Returns:
     * {Boolean} The handler was deactivated.
     */
    deactivate: function() {
        if(!this.active) {
            return false;
        }
        // unregister event handlers defined on this class.
        var events = OpenLayers.Events.prototype.BROWSER_EVENTS;
        for (var i=0, len=events.length; i<len; i++) {
            if (this[events[i]]) {
                this.unregister(events[i], this[events[i]]); 
            }
        } 
        this.active = false;
        return true;
    },

    /**
    * Method: callback
    * Trigger the control's named callback with the given arguments
    *
    * Parameters:
    * name - {String} The key for the callback that is one of the properties
    *     of the handler's callbacks object.
    * args - {Array(*)} An array of arguments (any type) with which to call 
    *     the callback (defined by the control).
    */
    callback: function (name, args) {
        if (name && this.callbacks[name]) {
            this.callbacks[name].apply(this.control, args);
        }
    },

    /**
    * Method: register
    * register an event on the map
    */
    register: function (name, method) {
        // TODO: deal with registerPriority in 3.0
        this.map.events.registerPriority(name, this, method);
        this.map.events.registerPriority(name, this, this.setEvent);
    },

    /**
    * Method: unregister
    * unregister an event from the map
    */
    unregister: function (name, method) {
        this.map.events.unregister(name, this, method);   
        this.map.events.unregister(name, this, this.setEvent);
    },
    
    /**
     * Method: setEvent
     * With each registered browser event, the handler sets its own evt
     *     property.  This property can be accessed by controls if needed
     *     to get more information about the event that the handler is
     *     processing.
     *
     * This allows modifier keys on the event to be checked (alt, shift, ctrl,
     *     and meta cannot be checked with the keyboard handler).  For a
     *     control to determine which modifier keys are associated with the
     *     event that a handler is currently processing, it should access
     *     (code)handler.evt.altKey || handler.evt.shiftKey ||
     *     handler.evt.ctrlKey || handler.evt.metaKey(end).
     *
     * Parameters:
     * evt - {Event} The browser event.
     */
    setEvent: function(evt) {
        this.evt = evt;
        return true;
    },

    /**
     * Method: destroy
     * Deconstruct the handler.
     */
    destroy: function () {
        // unregister event listeners
        this.deactivate();
        // eliminate circular references
        this.control = this.map = null;        
    },

    CLASS_NAME: "OpenLayers.Handler"
});

/**
 * Constant: OpenLayers.Handler.MOD_NONE
 * If set as the <keyMask>, <checkModifiers> returns false if any key is down.
 */
OpenLayers.Handler.MOD_NONE  = 0;

/**
 * Constant: OpenLayers.Handler.MOD_SHIFT
 * If set as the <keyMask>, <checkModifiers> returns false if Shift is down.
 */
OpenLayers.Handler.MOD_SHIFT = 1;

/**
 * Constant: OpenLayers.Handler.MOD_CTRL
 * If set as the <keyMask>, <checkModifiers> returns false if Ctrl is down.
 */
OpenLayers.Handler.MOD_CTRL  = 2;

/**
 * Constant: OpenLayers.Handler.MOD_ALT
 * If set as the <keyMask>, <checkModifiers> returns false if Alt is down.
 */
OpenLayers.Handler.MOD_ALT   = 4;

/**
 * Constant: OpenLayers.Handler.MOD_META
 * If set as the <keyMask>, <checkModifiers> returns false if Cmd is down.
 */
OpenLayers.Handler.MOD_META  = 8;


/* ======================================================================
    OpenLayers/Handler/Click.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Handler.js
 */

/**
 * Class: OpenLayers.Handler.Click
 * A handler for mouse clicks.  The intention of this handler is to give
 *     controls more flexibility with handling clicks.  Browsers trigger
 *     click events twice for a double-click.  In addition, the mousedown,
 *     mousemove, mouseup sequence fires a click event.  With this handler,
 *     controls can decide whether to ignore clicks associated with a double
 *     click.  By setting a <pixelTolerance>, controls can also ignore clicks
 *     that include a drag.  Create a new instance with the
 *     <OpenLayers.Handler.Click> constructor.
 * 
 * Inherits from:
 *  - <OpenLayers.Handler> 
 */
OpenLayers.Handler.Click = OpenLayers.Class(OpenLayers.Handler, {
    /**
     * APIProperty: delay
     * {Number} Number of milliseconds between clicks before the event is
     *     considered a double-click.
     */
    delay: 300,
    
    /**
     * APIProperty: single
     * {Boolean} Handle single clicks.  Default is true.  If false, clicks
     * will not be reported.  If true, single-clicks will be reported.
     */
    single: true,
    
    /**
     * APIProperty: double
     * {Boolean} Handle double-clicks.  Default is false.
     */
    'double': false,
    
    /**
     * APIProperty: pixelTolerance
     * {Number} Maximum number of pixels between mouseup and mousedown for an
     *     event to be considered a click.  Default is 0.  If set to an
     *     integer value, clicks with a drag greater than the value will be
     *     ignored.  This property can only be set when the handler is
     *     constructed.
     */
    pixelTolerance: 0,
        
    /**
     * APIProperty: dblclickTolerance
     * {Number} Maximum distance in pixels between clicks for a sequence of 
     *     events to be considered a double click.  Default is 13.  If the
     *     distance between two clicks is greater than this value, a double-
     *     click will not be fired.
     */
    dblclickTolerance: 13,
        
    /**
     * APIProperty: stopSingle
     * {Boolean} Stop other listeners from being notified of clicks.  Default
     *     is false.  If true, any listeners registered before this one for 
     *     click or rightclick events will not be notified.
     */
    stopSingle: false,
    
    /**
     * APIProperty: stopDouble
     * {Boolean} Stop other listeners from being notified of double-clicks.
     *     Default is false.  If true, any click listeners registered before
     *     this one will not be notified of *any* double-click events.
     * 
     * The one caveat with stopDouble is that given a map with two click
     *     handlers, one with stopDouble true and the other with stopSingle
     *     true, the stopSingle handler should be activated last to get
     *     uniform cross-browser performance.  Since IE triggers one click
     *     with a dblclick and FF triggers two, if a stopSingle handler is
     *     activated first, all it gets in IE is a single click when the
     *     second handler stops propagation on the dblclick.
     */
    stopDouble: false,

    /**
     * Property: timerId
     * {Number} The id of the timeout waiting to clear the <delayedCall>.
     */
    timerId: null,

    /**
     * Property: touch
     * {Boolean} When a touchstart event is fired, touch will be true and all
     *     mouse related listeners will do nothing.
     */
    touch: false,
    
    /**
     * Property: down
     * {Object} Object that store relevant information about the last
     *     mousedown or touchstart. Its 'xy' OpenLayers.Pixel property gives
     *     the average location of the mouse/touch event. Its 'touches'
     *     property records clientX/clientY of each touches.
     */
    down: null,

    /**
     * Property: last
     * {Object} Object that store relevant information about the last
     *     mousemove or touchmove. Its 'xy' OpenLayers.Pixel property gives
     *     the average location of the mouse/touch event. Its 'touches'
     *     property records clientX/clientY of each touches.
     */
    last: null,

    /** 
     * Property: first
     * {Object} When waiting for double clicks, this object will store 
     *     information about the first click in a two click sequence.
     */
    first: null,

    /**
     * Property: rightclickTimerId
     * {Number} The id of the right mouse timeout waiting to clear the 
     *     <delayedEvent>.
     */
    rightclickTimerId: null,
    
    /**
     * Constructor: OpenLayers.Handler.Click
     * Create a new click handler.
     * 
     * Parameters:
     * control - {<OpenLayers.Control>} The control that is making use of
     *     this handler.  If a handler is being used without a control, the
     *     handler's setMap method must be overridden to deal properly with
     *     the map.
     * callbacks - {Object} An object with keys corresponding to callbacks
     *     that will be called by the handler. The callbacks should
     *     expect to recieve a single argument, the click event.
     *     Callbacks for 'click' and 'dblclick' are supported.
     * options - {Object} Optional object whose properties will be set on the
     *     handler.
     */
    
    /**
     * Method: touchstart
     * Handle touchstart.
     *
     * Returns:
     * {Boolean} Continue propagating this event.
     */
    touchstart: function(evt) {
        if (!this.touch) {
            this.unregisterMouseListeners();
            this.touch = true;
        }
        this.down = this.getEventInfo(evt);
        this.last = this.getEventInfo(evt);
        return true;
    },
    
    /**
     * Method: touchmove
     *    Store position of last move, because touchend event can have
     *    an empty "touches" property.
     *
     * Returns:
     * {Boolean} Continue propagating this event.
     */
    touchmove: function(evt) {
        this.last = this.getEventInfo(evt);
        return true;
    },

    /**
     * Method: touchend
     *   Correctly set event xy property, and add lastTouches to have
     *   touches property from last touchstart or touchmove
     *
     * Returns:
     * {Boolean} Continue propagating this event.
     */
    touchend: function(evt) {
        // touchstart may not have been allowed to propagate
        if (this.down) {
            evt.xy = this.last.xy;
            evt.lastTouches = this.last.touches;
            this.handleSingle(evt);
            this.down = null;
        }
        return true;
    },
    
    /**
     * Method: unregisterMouseListeners
     * In a touch environment, we don't want to handle mouse events.
     */
    unregisterMouseListeners: function() {
        this.map.events.un({
            mousedown: this.mousedown,
            mouseup: this.mouseup,
            click: this.click,
            dblclick: this.dblclick,
            scope: this
        });
    },

    /**
     * Method: mousedown
     * Handle mousedown.
     *
     * Returns:
     * {Boolean} Continue propagating this event.
     */
    mousedown: function(evt) {
        this.down = this.getEventInfo(evt);
        this.last = this.getEventInfo(evt);
        return true;
    },

    /**
     * Method: mouseup
     * Handle mouseup.  Installed to support collection of right mouse events.
     * 
     * Returns:
     * {Boolean} Continue propagating this event.
     */
    mouseup: function (evt) {
        var propagate = true;

        // Collect right mouse clicks from the mouseup
        //  IE - ignores the second right click in mousedown so using
        //  mouseup instead
        if (this.checkModifiers(evt) && this.control.handleRightClicks &&
           OpenLayers.Event.isRightClick(evt)) {
            propagate = this.rightclick(evt);
        }

        return propagate;
    },
    
    /**
     * Method: rightclick
     * Handle rightclick.  For a dblrightclick, we get two clicks so we need 
     *     to always register for dblrightclick to properly handle single 
     *     clicks.
     *     
     * Returns:
     * {Boolean} Continue propagating this event.
     */
    rightclick: function(evt) {
        if(this.passesTolerance(evt)) {
           if(this.rightclickTimerId != null) {
                //Second click received before timeout this must be 
                // a double click
                this.clearTimer();
                this.callback('dblrightclick', [evt]);
                return !this.stopDouble;
            } else { 
                //Set the rightclickTimerId, send evt only if double is 
                // true else trigger single
                var clickEvent = this['double'] ?
                    OpenLayers.Util.extend({}, evt) : 
                    this.callback('rightclick', [evt]);

                var delayedRightCall = OpenLayers.Function.bind(
                    this.delayedRightCall, 
                    this, 
                    clickEvent
                );
                this.rightclickTimerId = window.setTimeout(
                    delayedRightCall, this.delay
                );
            } 
        }
        return !this.stopSingle;
    },
    
    /**
     * Method: delayedRightCall
     * Sets <rightclickTimerId> to null.  And optionally triggers the 
     *     rightclick callback if evt is set.
     */
    delayedRightCall: function(evt) {
        this.rightclickTimerId = null;
        if (evt) {
           this.callback('rightclick', [evt]);
        }
    },
    
    /**
     * Method: click
     * Handle click events from the browser.  This is registered as a listener
     *     for click events and should not be called from other events in this
     *     handler.
     *
     * Returns:
     * {Boolean} Continue propagating this event.
     */
    click: function(evt) {
        if (!this.last) {
            this.last = this.getEventInfo(evt);
        }
        this.handleSingle(evt);
        return !this.stopSingle;
    },

    /**
     * Method: dblclick
     * Handle dblclick.  For a dblclick, we get two clicks in some browsers
     *     (FF) and one in others (IE).  So we need to always register for
     *     dblclick to properly handle single clicks.  This method is registered
     *     as a listener for the dblclick browser event.  It should *not* be
     *     called by other methods in this handler.
     *     
     * Returns:
     * {Boolean} Continue propagating this event.
     */
    dblclick: function(evt) {
        this.handleDouble(evt);
        return !this.stopDouble;
    },
    
    /** 
     * Method: handleDouble
     * Handle double-click sequence.
     */
    handleDouble: function(evt) {
        if (this.passesDblclickTolerance(evt)) {
            if (this["double"]) {
                this.callback("dblclick", [evt]);
            }
            // to prevent a dblclick from firing the click callback in IE
            this.clearTimer();
        }
    },
    
    /** 
     * Method: handleSingle
     * Handle single click sequence.
     */
    handleSingle: function(evt) {
        if (this.passesTolerance(evt)) {
            if (this.timerId != null) {
                // already received a click
                if (this.last.touches && this.last.touches.length === 1) {
                    // touch device, no dblclick event - this may be a double
                    if (this["double"]) {
                        // on Android don't let the browser zoom on the page
                        OpenLayers.Event.stop(evt);
                    }
                    this.handleDouble(evt);
                }
                // if we're not in a touch environment we clear the click timer
                // if we've got a second touch, we'll get two touchend events
                if (!this.last.touches || this.last.touches.length !== 2) {
                    this.clearTimer();
                }
            } else {
                // remember the first click info so we can compare to the second
                this.first = this.getEventInfo(evt);
                // set the timer, send evt only if single is true
                //use a clone of the event object because it will no longer 
                //be a valid event object in IE in the timer callback
                var clickEvent = this.single ?
                    OpenLayers.Util.extend({}, evt) : null;
                this.queuePotentialClick(clickEvent);
            }
        }
    },
    
    /** 
     * Method: queuePotentialClick
     * This method is separated out largely to make testing easier (so we
     *     don't have to override window.setTimeout)
     */
    queuePotentialClick: function(evt) {
        this.timerId = window.setTimeout(
            OpenLayers.Function.bind(this.delayedCall, this, evt),
            this.delay
        );
    },

    /**
     * Method: passesTolerance
     * Determine whether the event is within the optional pixel tolerance.  Note
     *     that the pixel tolerance check only works if mousedown events get to
     *     the listeners registered here.  If they are stopped by other elements,
     *     the <pixelTolerance> will have no effect here (this method will always
     *     return true).
     *
     * Returns:
     * {Boolean} The click is within the pixel tolerance (if specified).
     */
    passesTolerance: function(evt) {
        var passes = true;
        if (this.pixelTolerance != null && this.down && this.down.xy) {
            passes = this.pixelTolerance >= this.down.xy.distanceTo(evt.xy);
            // for touch environments, we also enforce that all touches
            // start and end within the given tolerance to be considered a click
            if (passes && this.touch && 
                this.down.touches.length === this.last.touches.length) {
                // the touchend event doesn't come with touches, so we check
                // down and last
                for (var i=0, ii=this.down.touches.length; i<ii; ++i) {
                    if (this.getTouchDistance(
                            this.down.touches[i], 
                            this.last.touches[i]
                        ) > this.pixelTolerance) {
                        passes = false;
                        break;
                    }
                }
            }
        }
        return passes;
    },
    
    /** 
     * Method: getTouchDistance
     *
     * Returns:
     * {Boolean} The pixel displacement between two touches.
     */
    getTouchDistance: function(from, to) {
        return Math.sqrt(
            Math.pow(from.clientX - to.clientX, 2) +
            Math.pow(from.clientY - to.clientY, 2)
        );
    },
    
    /**
     * Method: passesDblclickTolerance
     * Determine whether the event is within the optional double-cick pixel 
     *     tolerance.
     *
     * Returns:
     * {Boolean} The click is within the double-click pixel tolerance.
     */
    passesDblclickTolerance: function(evt) {
        var passes = true;
        if (this.down && this.first) {
            passes = this.down.xy.distanceTo(this.first.xy) <= this.dblclickTolerance;
        }
        return passes;
    },

    /**
     * Method: clearTimer
     * Clear the timer and set <timerId> to null.
     */
    clearTimer: function() {
        if (this.timerId != null) {
            window.clearTimeout(this.timerId);
            this.timerId = null;
        }
        if (this.rightclickTimerId != null) {
            window.clearTimeout(this.rightclickTimerId);
            this.rightclickTimerId = null;
        }
    },
    
    /**
     * Method: delayedCall
     * Sets <timerId> to null.  And optionally triggers the click callback if
     *     evt is set.
     */
    delayedCall: function(evt) {
        this.timerId = null;
        if (evt) {
            this.callback("click", [evt]);
        }
    },

    /**
     * Method: getEventInfo
     * This method allows us to store event information without storing the
     *     actual event.  In touch devices (at least), the same event is 
     *     modified between touchstart, touchmove, and touchend.
     *
     * Returns:
     * {Object} An object with event related info.
     */
    getEventInfo: function(evt) {
        var touches;
        if (evt.touches) {
            var len = evt.touches.length;
            touches = new Array(len);
            var touch;
            for (var i=0; i<len; i++) {
                touch = evt.touches[i];
                touches[i] = {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                };
            }
        }
        return {
            xy: evt.xy,
            touches: touches
        };
    },

    /**
     * APIMethod: deactivate
     * Deactivate the handler.
     *
     * Returns:
     * {Boolean} The handler was successfully deactivated.
     */
    deactivate: function() {
        var deactivated = false;
        if(OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            this.clearTimer();
            this.down = null;
            this.first = null;
            this.last = null;
            this.touch = false;
            deactivated = true;
        }
        return deactivated;
    },

    CLASS_NAME: "OpenLayers.Handler.Click"
});
/* ======================================================================
    OpenLayers/Kinetic.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/BaseTypes/Class.js
 * @requires OpenLayers/Animation.js
 */

OpenLayers.Kinetic = OpenLayers.Class({

    /**
     * Property: threshold
     * In most cases changing the threshold isn't needed.
     * In px/ms, default to 0.
     */
    threshold: 0,

    /**
     * Property: deceleration
     * {Float} the deseleration in px/ms², default to 0.0035.
     */
    deceleration: 0.0035,

    /**
     * Property: nbPoints
     * {Integer} the number of points we use to calculate the kinetic
     * initial values.
     */
    nbPoints: 100,

    /**
     * Property: delay
     * {Float} time to consider to calculate the kinetic initial values.
     * In ms, default to 200.
     */
    delay: 200,

    /**
     * Property: points
     * List of points use to calculate the kinetic initial values.
     */
    points: undefined,

    /**
     * Property: timerId
     * ID of the timer.
     */
    timerId: undefined,

    /**
     * Constructor: OpenLayers.Kinetic
     *
     * Parameters:
     * options - {Object}
     */
    initialize: function(options) {
        OpenLayers.Util.extend(this, options);
    },

    /**
     * Method: begin
     * Begins the dragging.
     */
    begin: function() {
        OpenLayers.Animation.stop(this.timerId);
        this.timerId = undefined;
        this.points = [];
    },

    /**
     * Method: update
     * Updates during the dragging.
     *
     * Parameters:
     * xy - {<OpenLayers.Pixel>} The new position.
     */
    update: function(xy) {
        this.points.unshift({xy: xy, tick: new Date().getTime()});
        if (this.points.length > this.nbPoints) {
            this.points.pop();
        }
    },

    /**
     * Method: end
     * Ends the dragging, start the kinetic.
     *
     * Parameters:
     * xy - {<OpenLayers.Pixel>} The last position.
     *
     * Returns:
     * {Object} An object with two properties: "speed", and "theta". The
     *     "speed" and "theta" values are to be passed to the move 
     *     function when starting the animation.
     */
    end: function(xy) {
        var last, now = new Date().getTime();
        for (var i = 0, l = this.points.length, point; i < l; i++) {
            point = this.points[i];
            if (now - point.tick > this.delay) {
                break;
            }
            last = point;
        }
        if (!last) {
            return;
        }
        var time = new Date().getTime() - last.tick;
        var dist = Math.sqrt(Math.pow(xy.x - last.xy.x, 2) +
                             Math.pow(xy.y - last.xy.y, 2));
        var speed = dist / time;
        if (speed == 0 || speed < this.threshold) {
            return;
        }
        var theta = Math.asin((xy.y - last.xy.y) / dist);
        if (last.xy.x <= xy.x) {
            theta = Math.PI - theta;
        }
        return {speed: speed, theta: theta};
    },

    /**
     * Method: move
     * Launch the kinetic move pan.
     *
     * Parameters:
     * info - {Object} An object with two properties, "speed", and "theta".
     *     These values are those returned from the "end" call.
     * callback - {Function} Function called on every step of the animation,
     *     receives x, y (values to pan), end (is the last point).
     */
    move: function(info, callback) {
        var v0 = info.speed;
        var fx = Math.cos(info.theta);
        var fy = -Math.sin(info.theta);

        var initialTime = new Date().getTime();

        var lastX = 0;
        var lastY = 0;

        var timerCallback = function() {
            if (this.timerId == null) {
                return;
            }

            var t = new Date().getTime() - initialTime;

            var p = (-this.deceleration * Math.pow(t, 2)) / 2.0 + v0 * t;
            var x = p * fx;
            var y = p * fy;

            var args = {};
            args.end = false;
            var v = -this.deceleration * t + v0;

            if (v <= 0) {
                OpenLayers.Animation.stop(this.timerId);
                this.timerId = null;
                args.end = true;
            }

            args.x = x - lastX;
            args.y = y - lastY;
            lastX = x;
            lastY = y;
            callback(args.x, args.y, args.end);
        };

        this.timerId = OpenLayers.Animation.start(
            OpenLayers.Function.bind(timerCallback, this)
        );
    },

    CLASS_NAME: "OpenLayers.Kinetic"
});
/* ======================================================================
    OpenLayers/Rule.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


/**
 * @requires OpenLayers/BaseTypes/Class.js
 * @requires OpenLayers/Util.js
 * @requires OpenLayers/Style.js
 */

/**
 * Class: OpenLayers.Rule
 * This class represents an SLD Rule, as being used for rule-based SLD styling.
 */
OpenLayers.Rule = OpenLayers.Class({
    
    /**
     * Property: id
     * {String} A unique id for this session.
     */
    id: null,
    
    /**
     * APIProperty: name
     * {String} name of this rule
     */
    name: null,
    
    /**
     * Property: title
     * {String} Title of this rule (set if included in SLD)
     */
    title: null,
    
    /**
     * Property: description
     * {String} Description of this rule (set if abstract is included in SLD)
     */
    description: null,

    /**
     * Property: context
     * {Object} An optional object with properties that the rule should be
     * evaluated against. If no context is specified, feature.attributes will
     * be used.
     */
    context: null,
    
    /**
     * Property: filter
     * {<OpenLayers.Filter>} Optional filter for the rule.
     */
    filter: null,

    /**
     * Property: elseFilter
     * {Boolean} Determines whether this rule is only to be applied only if
     * no other rules match (ElseFilter according to the SLD specification). 
     * Default is false.  For instances of OpenLayers.Rule, if elseFilter is
     * false, the rule will always apply.  For subclasses, the else property is 
     * ignored.
     */
    elseFilter: false,
    
    /**
     * Property: symbolizer
     * {Object} Symbolizer or hash of symbolizers for this rule. If hash of
     * symbolizers, keys are one or more of ["Point", "Line", "Polygon"]. The
     * latter if useful if it is required to style e.g. vertices of a line
     * with a point symbolizer. Note, however, that this is not implemented
     * yet in OpenLayers, but it is the way how symbolizers are defined in
     * SLD.
     */
    symbolizer: null,
    
    /**
     * Property: symbolizers
     * {Array} Collection of symbolizers associated with this rule.  If 
     *     provided at construction, the symbolizers array has precedence
     *     over the deprecated symbolizer property.  Note that multiple 
     *     symbolizers are not currently supported by the vector renderers.
     *     Rules with multiple symbolizers are currently only useful for
     *     maintaining elements in an SLD document.
     */
    symbolizers: null,
    
    /**
     * APIProperty: minScaleDenominator
     * {Number} or {String} minimum scale at which to draw the feature.
     * In the case of a String, this can be a combination of text and
     * propertyNames in the form "literal ${propertyName}"
     */
    minScaleDenominator: null,

    /**
     * APIProperty: maxScaleDenominator
     * {Number} or {String} maximum scale at which to draw the feature.
     * In the case of a String, this can be a combination of text and
     * propertyNames in the form "literal ${propertyName}"
     */
    maxScaleDenominator: null,
    
    /** 
     * Constructor: OpenLayers.Rule
     * Creates a Rule.
     *
     * Parameters:
     * options - {Object} An optional object with properties to set on the
     *           rule
     * 
     * Returns:
     * {<OpenLayers.Rule>}
     */
    initialize: function(options) {
        this.symbolizer = {};
        OpenLayers.Util.extend(this, options);
        if (this.symbolizers) {
            delete this.symbolizer;
        }
        this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_");
    },

    /** 
     * APIMethod: destroy
     * nullify references to prevent circular references and memory leaks
     */
    destroy: function() {
        for (var i in this.symbolizer) {
            this.symbolizer[i] = null;
        }
        this.symbolizer = null;
        delete this.symbolizers;
    },
    
    /**
     * APIMethod: evaluate
     * evaluates this rule for a specific feature
     * 
     * Parameters:
     * feature - {<OpenLayers.Feature>} feature to apply the rule to.
     * 
     * Returns:
     * {Boolean} true if the rule applies, false if it does not.
     * This rule is the default rule and always returns true.
     */
    evaluate: function(feature) {
        var context = this.getContext(feature);
        var applies = true;

        if (this.minScaleDenominator || this.maxScaleDenominator) {
            var scale = feature.layer.map.getScale();
        }
        
        // check if within minScale/maxScale bounds
        if (this.minScaleDenominator) {
            applies = scale >= OpenLayers.Style.createLiteral(
                    this.minScaleDenominator, context);
        }
        if (applies && this.maxScaleDenominator) {
            applies = scale < OpenLayers.Style.createLiteral(
                    this.maxScaleDenominator, context);
        }
        
        // check if optional filter applies
        if(applies && this.filter) {
            // feature id filters get the feature, others get the context
            if(this.filter.CLASS_NAME == "OpenLayers.Filter.FeatureId") {
                applies = this.filter.evaluate(feature);
            } else {
                applies = this.filter.evaluate(context);
            }
        }

        return applies;
    },
    
    /**
     * Method: getContext
     * Gets the context for evaluating this rule
     * 
     * Paramters:
     * feature - {<OpenLayers.Feature>} feature to take the context from if
     *           none is specified.
     */
    getContext: function(feature) {
        var context = this.context;
        if (!context) {
            context = feature.attributes || feature.data;
        }
        if (typeof this.context == "function") {
            context = this.context(feature);
        }
        return context;
    },
    
    /**
     * APIMethod: clone
     * Clones this rule.
     * 
     * Returns:
     * {<OpenLayers.Rule>} Clone of this rule.
     */
    clone: function() {
        var options = OpenLayers.Util.extend({}, this);
        if (this.symbolizers) {
            // clone symbolizers
            var len = this.symbolizers.length;
            options.symbolizers = new Array(len);
            for (var i=0; i<len; ++i) {
                options.symbolizers[i] = this.symbolizers[i].clone();
            }
        } else {
            // clone symbolizer
            options.symbolizer = {};
            var value, type;
            for(var key in this.symbolizer) {
                value = this.symbolizer[key];
                type = typeof value;
                if(type === "object") {
                    options.symbolizer[key] = OpenLayers.Util.extend({}, value);
                } else if(type === "string") {
                    options.symbolizer[key] = value;
                }
            }
        }
        // clone filter
        options.filter = this.filter && this.filter.clone();
        // clone context
        options.context = this.context && OpenLayers.Util.extend({}, this.context);
        return new OpenLayers.Rule(options);
    },
        
    CLASS_NAME: "OpenLayers.Rule"
});
/* ======================================================================
    OpenLayers/Events/buttonclick.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Events.js
 */

/**
 * Class: OpenLayers.Events.buttonclick
 * Extension event type for handling buttons on top of a dom element. This
 *     event type fires "buttonclick" on its <target> when a button was
 *     clicked. Buttons are detected by the "olButton" class.
 *
 * This event type makes sure that button clicks do not interfere with other
 *     events that are registered on the same <element>.
 *
 * Event types provided by this extension:
 * - *buttonclick* Triggered when a button is clicked. Listeners receive an
 *     object with a *buttonElement* property referencing the dom element of
 *     the clicked button, and an *buttonXY* property with the click position
 *     relative to the button.
 */
OpenLayers.Events.buttonclick = OpenLayers.Class({
    
    /**
     * Property: target
     * {<OpenLayers.Events>} The events instance that the buttonclick event will
     * be triggered on.
     */
    target: null,
    
    /**
     * Property: events
     * {Array} Events to observe and conditionally stop from propagating when
     *     an element with the olButton class (or its olAlphaImg child) is
     *     clicked.
     */
    events: [
        'mousedown', 'mouseup', 'click', 'dblclick',
        'touchstart', 'touchmove', 'touchend', 'keydown'
    ],
    
    /**
     * Property: startRegEx
     * {RegExp} Regular expression to test Event.type for events that start
     *     a buttonclick sequence.
     */
    startRegEx: /^mousedown|touchstart$/,

    /**
     * Property: cancelRegEx
     * {RegExp} Regular expression to test Event.type for events that cancel
     *     a buttonclick sequence.
     */
    cancelRegEx: /^touchmove$/,

    /**
     * Property: completeRegEx
     * {RegExp} Regular expression to test Event.type for events that complete
     *     a buttonclick sequence.
     */
    completeRegEx: /^mouseup|touchend$/,
    
    /**
     * Property: startEvt
     * {Event} The event that started the click sequence
     */
    
    /**
     * Constructor: OpenLayers.Events.buttonclick
     * Construct a buttonclick event type. Applications are not supposed to
     *     create instances of this class - they are created on demand by
     *     <OpenLayers.Events> instances.
     *
     * Parameters:
     * target - {<OpenLayers.Events>} The events instance that the buttonclick
     *     event will be triggered on.
     */
    initialize: function(target) {
        this.target = target;
        for (var i=this.events.length-1; i>=0; --i) {
            this.target.register(this.events[i], this, this.buttonClick, {
                extension: true
            });
        }
    },
    
    /**
     * Method: destroy
     */
    destroy: function() {
        for (var i=this.events.length-1; i>=0; --i) {
            this.target.unregister(this.events[i], this, this.buttonClick);
        }
        delete this.target;
    },

    /**
     * Method: getPressedButton
     * Get the pressed button, if any. Returns undefined if no button
     * was pressed.
     *
     * Arguments:
     * element - {DOMElement} The event target.
     *
     * Returns:
     * {DOMElement} The button element, or undefined.
     */
    getPressedButton: function(element) {
        var depth = 3, // limit the search depth
            button;
        do {
            if(OpenLayers.Element.hasClass(element, "olButton")) {
                // hit!
                button = element;
                break;
            }
            element = element.parentNode;
        } while(--depth > 0 && element);
        return button;
    },

    /**
     * Method: buttonClick
     * Check if a button was clicked, and fire the buttonclick event
     *
     * Parameters:
     * evt - {Event}
     */
    buttonClick: function(evt) {
        var propagate = true,
            element = OpenLayers.Event.element(evt);
        if (element && (OpenLayers.Event.isLeftClick(evt) || !~evt.type.indexOf("mouse"))) {
            // was a button pressed?
            var button = this.getPressedButton(element);
            if (button) {
                if (evt.type === "keydown") {
                    switch (evt.keyCode) {
                    case OpenLayers.Event.KEY_RETURN:
                    case OpenLayers.Event.KEY_SPACE:
                        this.target.triggerEvent("buttonclick", {
                            buttonElement: button
                        });
                        OpenLayers.Event.stop(evt);
                        propagate = false;
                        break;
                    }
                } else if (this.startEvt) {
                    if (this.completeRegEx.test(evt.type)) {
                        var pos = OpenLayers.Util.pagePosition(button);
                        this.target.triggerEvent("buttonclick", {
                            buttonElement: button,
                            buttonXY: {
                                x: this.startEvt.clientX - pos[0],
                                y: this.startEvt.clientY - pos[1]
                            }
                        });
                    }
                    if (this.cancelRegEx.test(evt.type)) {
                        delete this.startEvt;
                    }
                    OpenLayers.Event.stop(evt);
                    propagate = false;
                }
                if (this.startRegEx.test(evt.type)) {
                    this.startEvt = evt;
                    OpenLayers.Event.stop(evt);
                    propagate = false;
                }
            } else {
                delete this.startEvt;
            }
        }
        return propagate;
    }
    
});
/* ======================================================================
    OpenLayers/Control/PanZoom.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


/**
 * @requires OpenLayers/Control.js
 * @requires OpenLayers/Events/buttonclick.js
 */

/**
 * Class: OpenLayers.Control.PanZoom
 * The PanZoom is a visible control, composed of a
 * <OpenLayers.Control.PanPanel> and a <OpenLayers.Control.ZoomPanel>. By
 * default it is drawn in the upper left corner of the map.
 *
 * Inherits from:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.PanZoom = OpenLayers.Class(OpenLayers.Control, {

    /** 
     * APIProperty: slideFactor
     * {Integer} Number of pixels by which we'll pan the map in any direction 
     *     on clicking the arrow buttons.  If you want to pan by some ratio
     *     of the map dimensions, use <slideRatio> instead.
     */
    slideFactor: 50,

    /** 
     * APIProperty: slideRatio
     * {Number} The fraction of map width/height by which we'll pan the map            
     *     on clicking the arrow buttons.  Default is null.  If set, will
     *     override <slideFactor>. E.g. if slideRatio is .5, then the Pan Up
     *     button will pan up half the map height. 
     */
    slideRatio: null,

    /** 
     * Property: buttons
     * {Array(DOMElement)} Array of Button Divs 
     */
    buttons: null,

    /** 
     * Property: position
     * {<OpenLayers.Pixel>} 
     */
    position: null,

    /**
     * Constructor: OpenLayers.Control.PanZoom
     * 
     * Parameters:
     * options - {Object}
     */
    initialize: function(options) {
        this.position = new OpenLayers.Pixel(OpenLayers.Control.PanZoom.X,
                                             OpenLayers.Control.PanZoom.Y);
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
    },

    /**
     * APIMethod: destroy
     */
    destroy: function() {
        if (this.map) {
            this.map.events.unregister("buttonclick", this, this.onButtonClick);
        }
        this.removeButtons();
        this.buttons = null;
        this.position = null;
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },

    /** 
     * Method: setMap
     *
     * Properties:
     * map - {<OpenLayers.Map>} 
     */
    setMap: function(map) {
        OpenLayers.Control.prototype.setMap.apply(this, arguments);
        this.map.events.register("buttonclick", this, this.onButtonClick);
    },

    /**
     * Method: draw
     *
     * Parameters:
     * px - {<OpenLayers.Pixel>} 
     * 
     * Returns:
     * {DOMElement} A reference to the container div for the PanZoom control.
     */
    draw: function(px) {
        // initialize our internal div
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        px = this.position;

        // place the controls
        this.buttons = [];

        var sz = {w: 18, h: 18};
        var centered = new OpenLayers.Pixel(px.x+sz.w/2, px.y);

        this._addButton("panup", "north-mini.png", centered, sz);
        px.y = centered.y+sz.h;
        this._addButton("panleft", "west-mini.png", px, sz);
        this._addButton("panright", "east-mini.png", px.add(sz.w, 0), sz);
        this._addButton("pandown", "south-mini.png", 
                        centered.add(0, sz.h*2), sz);
        this._addButton("zoomin", "zoom-plus-mini.png", 
                        centered.add(0, sz.h*3+5), sz);
        this._addButton("zoomworld", "zoom-world-mini.png", 
                        centered.add(0, sz.h*4+5), sz);
        this._addButton("zoomout", "zoom-minus-mini.png", 
                        centered.add(0, sz.h*5+5), sz);
        return this.div;
    },
    
    /**
     * Method: _addButton
     * 
     * Parameters:
     * id - {String} 
     * img - {String} 
     * xy - {<OpenLayers.Pixel>} 
     * sz - {<OpenLayers.Size>} 
     * 
     * Returns:
     * {DOMElement} A Div (an alphaImageDiv, to be precise) that contains the
     *     image of the button, and has all the proper event handlers set.
     */
    _addButton:function(id, img, xy, sz) {
        var imgLocation = OpenLayers.Util.getImageLocation(img);
        var btn = OpenLayers.Util.createAlphaImageDiv(
                                    this.id + "_" + id, 
                                    xy, sz, imgLocation, "absolute");
        btn.style.cursor = "pointer";
        //we want to add the outer div
        this.div.appendChild(btn);
        btn.action = id;
        btn.className = "olButton";
    
        //we want to remember/reference the outer div
        this.buttons.push(btn);
        return btn;
    },
    
    /**
     * Method: _removeButton
     * 
     * Parameters:
     * btn - {Object}
     */
    _removeButton: function(btn) {
        this.div.removeChild(btn);
        OpenLayers.Util.removeItem(this.buttons, btn);
    },
    
    /**
     * Method: removeButtons
     */
    removeButtons: function() {
        for(var i=this.buttons.length-1; i>=0; --i) {
            this._removeButton(this.buttons[i]);
        }
    },
    
    /**
     * Method: onButtonClick
     *
     * Parameters:
     * evt - {Event}
     */
    onButtonClick: function(evt) {
        var btn = evt.buttonElement;
        switch (btn.action) {
            case "panup": 
                this.map.pan(0, -this.getSlideFactor("h"));
                break;
            case "pandown": 
                this.map.pan(0, this.getSlideFactor("h"));
                break;
            case "panleft": 
                this.map.pan(-this.getSlideFactor("w"), 0);
                break;
            case "panright": 
                this.map.pan(this.getSlideFactor("w"), 0);
                break;
            case "zoomin": 
                this.map.zoomIn(); 
                break;
            case "zoomout": 
                this.map.zoomOut(); 
                break;
            case "zoomworld": 
                this.map.zoomToMaxExtent(); 
                break;
        }
    },
    
    /**
     * Method: getSlideFactor
     *
     * Parameters:
     * dim - {String} "w" or "h" (for width or height).
     *
     * Returns:
     * {Number} The slide factor for panning in the requested direction.
     */
    getSlideFactor: function(dim) {
        return this.slideRatio ?
            this.map.getSize()[dim] * this.slideRatio :
            this.slideFactor;
    },

    CLASS_NAME: "OpenLayers.Control.PanZoom"
});

/**
 * Constant: X
 * {Integer}
 */
OpenLayers.Control.PanZoom.X = 4;

/**
 * Constant: Y
 * {Integer}
 */
OpenLayers.Control.PanZoom.Y = 4;
/* ======================================================================
    OpenLayers/Control/PanZoomBar.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


/**
 * @requires OpenLayers/Control/PanZoom.js
 */

/**
 * Class: OpenLayers.Control.PanZoomBar
 * The PanZoomBar is a visible control composed of a
 * <OpenLayers.Control.PanPanel> and a <OpenLayers.Control.ZoomBar>. 
 * By default it is displayed in the upper left corner of the map as 4
 * directional arrows above a vertical slider.
 *
 * Inherits from:
 *  - <OpenLayers.Control.PanZoom>
 */
OpenLayers.Control.PanZoomBar = OpenLayers.Class(OpenLayers.Control.PanZoom, {

    /** 
     * APIProperty: zoomStopWidth
     */
    zoomStopWidth: 18,

    /** 
     * APIProperty: zoomStopHeight
     */
    zoomStopHeight: 11,

    /** 
     * Property: slider
     */
    slider: null,

    /** 
     * Property: sliderEvents
     * {<OpenLayers.Events>}
     */
    sliderEvents: null,

    /** 
     * Property: zoombarDiv
     * {DOMElement}
     */
    zoombarDiv: null,

    /** 
     * APIProperty: zoomWorldIcon
     * {Boolean}
     */
    zoomWorldIcon: false,

    /**
     * APIProperty: panIcons
     * {Boolean} Set this property to false not to display the pan icons. If
     * false the zoom world icon is placed under the zoom bar. Defaults to
     * true.
     */
    panIcons: true,

    /**
     * APIProperty: forceFixedZoomLevel
     * {Boolean} Force a fixed zoom level even though the map has 
     *     fractionalZoom
     */
    forceFixedZoomLevel: false,

    /**
     * Property: mouseDragStart
     * {<OpenLayers.Pixel>}
     */
    mouseDragStart: null,

    /**
     * Property: deltaY
     * {Number} The cumulative vertical pixel offset during a zoom bar drag.
     */
    deltaY: null,

    /**
     * Property: zoomStart
     * {<OpenLayers.Pixel>}
     */
    zoomStart: null,

    /**
     * Constructor: OpenLayers.Control.PanZoomBar
     */ 

    /**
     * APIMethod: destroy
     */
    destroy: function() {

        this._removeZoomBar();

        this.map.events.un({
            "changebaselayer": this.redraw,
            scope: this
        });

        OpenLayers.Control.PanZoom.prototype.destroy.apply(this, arguments);

        delete this.mouseDragStart;
        delete this.zoomStart;
    },
    
    /**
     * Method: setMap
     * 
     * Parameters:
     * map - {<OpenLayers.Map>} 
     */
    setMap: function(map) {
        OpenLayers.Control.PanZoom.prototype.setMap.apply(this, arguments);
        this.map.events.register("changebaselayer", this, this.redraw);
    },

    /** 
     * Method: redraw
     * clear the div and start over.
     */
    redraw: function() {
        if (this.div != null) {
            this.removeButtons();
            this._removeZoomBar();
        }  
        this.draw();
    },
    
    /**
    * Method: draw 
    *
    * Parameters:
    * px - {<OpenLayers.Pixel>} 
    */
    draw: function(px) {
        // initialize our internal div
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        px = this.position.clone();

        // place the controls
        this.buttons = [];

        var sz = {w: 18, h: 18};
        if (this.panIcons) {
            var centered = new OpenLayers.Pixel(px.x+sz.w/2, px.y);
            var wposition = sz.w;

            if (this.zoomWorldIcon) {
                centered = new OpenLayers.Pixel(px.x+sz.w, px.y);
            }

            this._addButton("panup", "north-mini.png", centered, sz);
            px.y = centered.y+sz.h;
            this._addButton("panleft", "west-mini.png", px, sz);
            if (this.zoomWorldIcon) {
                this._addButton("zoomworld", "zoom-world-mini.png", px.add(sz.w, 0), sz);

                wposition *= 2;
            }
            this._addButton("panright", "east-mini.png", px.add(wposition, 0), sz);
            this._addButton("pandown", "south-mini.png", centered.add(0, sz.h*2), sz);
            this._addButton("zoomin", "zoom-plus-mini.png", centered.add(0, sz.h*3+5), sz);
            centered = this._addZoomBar(centered.add(0, sz.h*4 + 5));
            this._addButton("zoomout", "zoom-minus-mini.png", centered, sz);
        }
        else {
            this._addButton("zoomin", "zoom-plus-mini.png", px, sz);
            centered = this._addZoomBar(px.add(0, sz.h));
            this._addButton("zoomout", "zoom-minus-mini.png", centered, sz);
            if (this.zoomWorldIcon) {
                centered = centered.add(0, sz.h+3);
                this._addButton("zoomworld", "zoom-world-mini.png", centered, sz);
            }
        }
        return this.div;
    },

    /** 
    * Method: _addZoomBar
    * 
    * Parameters:
    * centered - {<OpenLayers.Pixel>} where zoombar drawing is to start.
    */
    _addZoomBar:function(centered) {
        var imgLocation = OpenLayers.Util.getImageLocation("slider.png");
        var id = this.id + "_" + this.map.id;
        var zoomsToEnd = this.map.getNumZoomLevels() - 1 - this.map.getZoom();
        var slider = OpenLayers.Util.createAlphaImageDiv(id,
                       centered.add(-1, zoomsToEnd * this.zoomStopHeight), 
                       {w: 20, h: 9},
                       imgLocation,
                       "absolute");
        slider.style.cursor = "move";
        this.slider = slider;
        
        this.sliderEvents = new OpenLayers.Events(this, slider, null, true,
                                            {includeXY: true});
        this.sliderEvents.on({
            "touchstart": this.zoomBarDown,
            "touchmove": this.zoomBarDrag,
            "touchend": this.zoomBarUp,
            "mousedown": this.zoomBarDown,
            "mousemove": this.zoomBarDrag,
            "mouseup": this.zoomBarUp
        });
        
        var sz = {
            w: this.zoomStopWidth,
            h: this.zoomStopHeight * this.map.getNumZoomLevels()
        };
        var imgLocation = OpenLayers.Util.getImageLocation("zoombar.png");
        var div = null;
        
        if (OpenLayers.Util.alphaHack()) {
            var id = this.id + "_" + this.map.id;
            div = OpenLayers.Util.createAlphaImageDiv(id, centered,
                                      {w: sz.w, h: this.zoomStopHeight},
                                      imgLocation,
                                      "absolute", null, "crop");
            div.style.height = sz.h + "px";
        } else {
            div = OpenLayers.Util.createDiv(
                        'OpenLayers_Control_PanZoomBar_Zoombar' + this.map.id,
                        centered,
                        sz,
                        imgLocation);
        }
        div.style.cursor = "pointer";
        div.className = "olButton";
        this.zoombarDiv = div;
        
        this.div.appendChild(div);

        this.startTop = parseInt(div.style.top);
        this.div.appendChild(slider);

        this.map.events.register("zoomend", this, this.moveZoomBar);

        centered = centered.add(0, 
            this.zoomStopHeight * this.map.getNumZoomLevels());
        return centered; 
    },
    
    /**
     * Method: _removeZoomBar
     */
    _removeZoomBar: function() {
        this.sliderEvents.un({
            "touchstart": this.zoomBarDown,
            "touchmove": this.zoomBarDrag,
            "touchend": this.zoomBarUp,
            "mousedown": this.zoomBarDown,
            "mousemove": this.zoomBarDrag,
            "mouseup": this.zoomBarUp
        });
        this.sliderEvents.destroy();
        
        this.div.removeChild(this.zoombarDiv);
        this.zoombarDiv = null;
        this.div.removeChild(this.slider);
        this.slider = null;
        
        this.map.events.unregister("zoomend", this, this.moveZoomBar);
    },
    
    /**
     * Method: onButtonClick
     *
     * Parameters:
     * evt - {Event}
     */
    onButtonClick: function(evt) {
        OpenLayers.Control.PanZoom.prototype.onButtonClick.apply(this, arguments);
        if (evt.buttonElement === this.zoombarDiv) {
            var levels = evt.buttonXY.y / this.zoomStopHeight;
            if(this.forceFixedZoomLevel || !this.map.fractionalZoom) {
                levels = Math.floor(levels);
            }    
            var zoom = (this.map.getNumZoomLevels() - 1) - levels; 
            zoom = Math.min(Math.max(zoom, 0), this.map.getNumZoomLevels() - 1);
            this.map.zoomTo(zoom);
        }
    },
    
    /**
     * Method: passEventToSlider
     * This function is used to pass events that happen on the div, or the map,
     * through to the slider, which then does its moving thing.
     *
     * Parameters:
     * evt - {<OpenLayers.Event>} 
     */
    passEventToSlider:function(evt) {
        this.sliderEvents.handleBrowserEvent(evt);
    },
    
    /*
     * Method: zoomBarDown
     * event listener for clicks on the slider
     *
     * Parameters:
     * evt - {<OpenLayers.Event>} 
     */
    zoomBarDown:function(evt) {
        if (!OpenLayers.Event.isLeftClick(evt) && !OpenLayers.Event.isSingleTouch(evt)) {
            return;
        }
        this.map.events.on({
            "touchmove": this.passEventToSlider,
            "mousemove": this.passEventToSlider,
            "mouseup": this.passEventToSlider,
            scope: this
        });
        this.mouseDragStart = evt.xy.clone();
        this.zoomStart = evt.xy.clone();
        this.div.style.cursor = "move";
        // reset the div offsets just in case the div moved
        this.zoombarDiv.offsets = null; 
        OpenLayers.Event.stop(evt);
    },
    
    /*
     * Method: zoomBarDrag
     * This is what happens when a click has occurred, and the client is
     * dragging.  Here we must ensure that the slider doesn't go beyond the
     * bottom/top of the zoombar div, as well as moving the slider to its new
     * visual location
     *
     * Parameters:
     * evt - {<OpenLayers.Event>} 
     */
    zoomBarDrag:function(evt) {
        if (this.mouseDragStart != null) {
            var deltaY = this.mouseDragStart.y - evt.xy.y;
            var offsets = OpenLayers.Util.pagePosition(this.zoombarDiv);
            if ((evt.clientY - offsets[1]) > 0 && 
                (evt.clientY - offsets[1]) < parseInt(this.zoombarDiv.style.height) - 2) {
                var newTop = parseInt(this.slider.style.top) - deltaY;
                this.slider.style.top = newTop+"px";
                this.mouseDragStart = evt.xy.clone();
            }
            // set cumulative displacement
            this.deltaY = this.zoomStart.y - evt.xy.y;
            OpenLayers.Event.stop(evt);
        }
    },
    
    /*
     * Method: zoomBarUp
     * Perform cleanup when a mouseup event is received -- discover new zoom
     * level and switch to it.
     *
     * Parameters:
     * evt - {<OpenLayers.Event>} 
     */
    zoomBarUp:function(evt) {
        if (!OpenLayers.Event.isLeftClick(evt) && evt.type !== "touchend") {
            return;
        }
        if (this.mouseDragStart) {
            this.div.style.cursor="";
            this.map.events.un({
                "touchmove": this.passEventToSlider,
                "mouseup": this.passEventToSlider,
                "mousemove": this.passEventToSlider,
                scope: this
            });
            var zoomLevel = this.map.zoom;
            if (!this.forceFixedZoomLevel && this.map.fractionalZoom) {
                zoomLevel += this.deltaY/this.zoomStopHeight;
                zoomLevel = Math.min(Math.max(zoomLevel, 0), 
                                     this.map.getNumZoomLevels() - 1);
            } else {
                zoomLevel += this.deltaY/this.zoomStopHeight;
                zoomLevel = Math.max(Math.round(zoomLevel), 0);      
            }
            this.map.zoomTo(zoomLevel);
            this.mouseDragStart = null;
            this.zoomStart = null;
            this.deltaY = 0;
            OpenLayers.Event.stop(evt);
        }
    },
    
    /*
    * Method: moveZoomBar
    * Change the location of the slider to match the current zoom level.
    */
    moveZoomBar:function() {
        var newTop = 
            ((this.map.getNumZoomLevels()-1) - this.map.getZoom()) * 
            this.zoomStopHeight + this.startTop + 1;
        this.slider.style.top = newTop + "px";
    },    
    
    CLASS_NAME: "OpenLayers.Control.PanZoomBar"
});
/* ======================================================================
    OpenLayers/Handler/Drag.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Handler.js
 */

/**
 * Class: OpenLayers.Handler.Drag
 * The drag handler is used to deal with sequences of browser events related
 *     to dragging.  The handler is used by controls that want to know when
 *     a drag sequence begins, when a drag is happening, and when it has
 *     finished.
 *
 * Controls that use the drag handler typically construct it with callbacks
 *     for 'down', 'move', and 'done'.  Callbacks for these keys are called
 *     when the drag begins, with each move, and when the drag is done.  In
 *     addition, controls can have callbacks keyed to 'up' and 'out' if they
 *     care to differentiate between the types of events that correspond with
 *     the end of a drag sequence.  If no drag actually occurs (no mouse move)
 *     the 'down' and 'up' callbacks will be called, but not the 'done'
 *     callback.
 *
 * Create a new drag handler with the <OpenLayers.Handler.Drag> constructor.
 *
 * Inherits from:
 *  - <OpenLayers.Handler>
 */
OpenLayers.Handler.Drag = OpenLayers.Class(OpenLayers.Handler, {
  
    /** 
     * Property: started
     * {Boolean} When a mousedown or touchstart event is received, we want to
     * record it, but not set 'dragging' until the mouse moves after starting.
     */
    started: false,

    /**
     * Property: stopDown
     * {Boolean} Stop propagation of mousedown events from getting to listeners
     *     on the same element.  Default is true.
     */
    stopDown: true,

    /** 
     * Property: dragging 
     * {Boolean} 
     */
    dragging: false,

    /**
     * Property: touch
     * {Boolean} When a touchstart event is fired, touch will be true and all
     *     mouse related listeners will do nothing.
     */
    touch: false,

    /** 
     * Property: last
     * {<OpenLayers.Pixel>} The last pixel location of the drag.
     */
    last: null,

    /** 
     * Property: start
     * {<OpenLayers.Pixel>} The first pixel location of the drag.
     */
    start: null,

    /**
     * Property: lastMoveEvt
     * {Object} The last mousemove event that occurred. Used to
     *     position the map correctly when our "delay drag"
     *     timeout expired.
     */
    lastMoveEvt: null,

    /**
     * Property: oldOnselectstart
     * {Function}
     */
    oldOnselectstart: null,
    
    /**
     * Property: interval
     * {Integer} In order to increase performance, an interval (in 
     *     milliseconds) can be set to reduce the number of drag events 
     *     called. If set, a new drag event will not be set until the 
     *     interval has passed. 
     *     Defaults to 0, meaning no interval. 
     */
    interval: 0,
    
    /**
     * Property: timeoutId
     * {String} The id of the timeout used for the mousedown interval.
     *     This is "private", and should be left alone.
     */
    timeoutId: null,
    
    /**
     * APIProperty: documentDrag
     * {Boolean} If set to true, the handler will also handle mouse moves when
     *     the cursor has moved out of the map viewport. Default is false.
     */
    documentDrag: false,
    
    /**
     * Property: documentEvents
     * {Boolean} Are we currently observing document events?
     */
    documentEvents: null,

    /**
     * Constructor: OpenLayers.Handler.Drag
     * Returns OpenLayers.Handler.Drag
     * 
     * Parameters:
     * control - {<OpenLayers.Control>} The control that is making use of
     *     this handler.  If a handler is being used without a control, the
     *     handlers setMap method must be overridden to deal properly with
     *     the map.
     * callbacks - {Object} An object containing a single function to be
     *     called when the drag operation is finished. The callback should
     *     expect to recieve a single argument, the pixel location of the event.
     *     Callbacks for 'move' and 'done' are supported. You can also speficy
     *     callbacks for 'down', 'up', and 'out' to respond to those events.
     * options - {Object} 
     */
    initialize: function(control, callbacks, options) {
        OpenLayers.Handler.prototype.initialize.apply(this, arguments);
        
        if (this.documentDrag === true) {
            var me = this;
            this._docMove = function(evt) {
                me.mousemove({
                    xy: {x: evt.clientX, y: evt.clientY},
                    element: document
                });
            };
            this._docUp = function(evt) {
                me.mouseup({xy: {x: evt.clientX, y: evt.clientY}});
            };
        }
    },

    
    /**
     * Method: dragstart
     * This private method is factorized from mousedown and touchstart methods
     *
     * Parameters:
     * evt - {Event} The event
     *
     * Returns:
     * {Boolean} Let the event propagate.
     */
    dragstart: function (evt) {
        var propagate = true;
        this.dragging = false;
        if (this.checkModifiers(evt) &&
               (OpenLayers.Event.isLeftClick(evt) ||
                OpenLayers.Event.isSingleTouch(evt))) {
            this.started = true;
            this.start = evt.xy;
            this.last = evt.xy;
            OpenLayers.Element.addClass(
                this.map.viewPortDiv, "olDragDown"
            );
            this.down(evt);
            this.callback("down", [evt.xy]);

            OpenLayers.Event.stop(evt);

            if(!this.oldOnselectstart) {
                this.oldOnselectstart = document.onselectstart ?
                    document.onselectstart : OpenLayers.Function.True;
            }
            document.onselectstart = OpenLayers.Function.False;

            propagate = !this.stopDown;
        } else {
            this.started = false;
            this.start = null;
            this.last = null;
        }
        return propagate;
    },

    /**
     * Method: dragmove
     * This private method is factorized from mousemove and touchmove methods
     *
     * Parameters:
     * evt - {Event} The event
     *
     * Returns:
     * {Boolean} Let the event propagate.
     */
    dragmove: function (evt) {
        this.lastMoveEvt = evt;
        if (this.started && !this.timeoutId && (evt.xy.x != this.last.x ||
                                                evt.xy.y != this.last.y)) {
            if(this.documentDrag === true && this.documentEvents) {
                if(evt.element === document) {
                    this.adjustXY(evt);
                    // do setEvent manually because the documentEvents are not
                    // registered with the map
                    this.setEvent(evt);
                } else {
                    this.removeDocumentEvents();
                }
            }
            if (this.interval > 0) {
                this.timeoutId = setTimeout(
                    OpenLayers.Function.bind(this.removeTimeout, this),
                    this.interval);
            }
            this.dragging = true;

            this.move(evt);
            this.callback("move", [evt.xy]);
            if(!this.oldOnselectstart) {
                this.oldOnselectstart = document.onselectstart;
                document.onselectstart = OpenLayers.Function.False;
            }
            this.last = evt.xy;
        }
        return true;
    },

    /**
     * Method: dragend
     * This private method is factorized from mouseup and touchend methods
     *
     * Parameters:
     * evt - {Event} The event
     *
     * Returns:
     * {Boolean} Let the event propagate.
     */
    dragend: function (evt) {
        if (this.started) {
            if(this.documentDrag === true && this.documentEvents) {
                this.adjustXY(evt);
                this.removeDocumentEvents();
            }
            var dragged = (this.start != this.last);
            this.started = false;
            this.dragging = false;
            OpenLayers.Element.removeClass(
                this.map.viewPortDiv, "olDragDown"
            );
            this.up(evt);
            this.callback("up", [evt.xy]);
            if(dragged) {
                this.callback("done", [evt.xy]);
            }
            document.onselectstart = this.oldOnselectstart;
        }
        return true;
    },

    /**
     * The four methods below (down, move, up, and out) are used by subclasses
     *     to do their own processing related to these mouse events.
     */

    /**
     * Method: down
     * This method is called during the handling of the mouse down event.
     *     Subclasses can do their own processing here.
     *
     * Parameters:
     * evt - {Event} The mouse down event
     */
    down: function(evt) {
    },

    /**
     * Method: move
     * This method is called during the handling of the mouse move event.
     *     Subclasses can do their own processing here.
     *
     * Parameters:
     * evt - {Event} The mouse move event
     *
     */
    move: function(evt) {
    },

    /**
     * Method: up
     * This method is called during the handling of the mouse up event.
     *     Subclasses can do their own processing here.
     *
     * Parameters:
     * evt - {Event} The mouse up event
     */
    up: function(evt) {
    },

    /**
     * Method: out
     * This method is called during the handling of the mouse out event.
     *     Subclasses can do their own processing here.
     *
     * Parameters:
     * evt - {Event} The mouse out event
     */
    out: function(evt) {
    },

    /**
     * The methods below are part of the magic of event handling.  Because
     *     they are named like browser events, they are registered as listeners
     *     for the events they represent.
     */

    /**
     * Method: mousedown
     * Handle mousedown events
     *
     * Parameters:
     * evt - {Event}
     *
     * Returns:
     * {Boolean} Let the event propagate.
     */
    mousedown: function(evt) {
        return this.dragstart(evt);
    },

    /**
     * Method: touchstart
     * Handle touchstart events
     *
     * Parameters:
     * evt - {Event}
     *
     * Returns:
     * {Boolean} Let the event propagate.
     */
    touchstart: function(evt) {
        if (!this.touch) {
            this.touch = true;
            // unregister mouse listeners
            this.map.events.un({
                mousedown: this.mousedown,
                mouseup: this.mouseup,
                mousemove: this.mousemove,
                click: this.click,
                scope: this
            });
        }
        return this.dragstart(evt);
    },

    /**
     * Method: mousemove
     * Handle mousemove events
     *
     * Parameters:
     * evt - {Event}
     *
     * Returns:
     * {Boolean} Let the event propagate.
     */
    mousemove: function(evt) {
        return this.dragmove(evt);
    },

    /**
     * Method: touchmove
     * Handle touchmove events
     *
     * Parameters:
     * evt - {Event}
     *
     * Returns:
     * {Boolean} Let the event propagate.
     */
    touchmove: function(evt) {
        return this.dragmove(evt);
    },

    /**
     * Method: removeTimeout
     * Private. Called by mousemove() to remove the drag timeout.
     */
    removeTimeout: function() {
        this.timeoutId = null;
        // if timeout expires while we're still dragging (mouseup
        // hasn't occurred) then call mousemove to move to the
        // correct position
        if(this.dragging) {
            this.mousemove(this.lastMoveEvt);
        }
    },

    /**
     * Method: mouseup
     * Handle mouseup events
     *
     * Parameters:
     * evt - {Event}
     *
     * Returns:
     * {Boolean} Let the event propagate.
     */
    mouseup: function(evt) {
        return this.dragend(evt);
    },

    /**
     * Method: touchend
     * Handle touchend events
     *
     * Parameters:
     * evt - {Event}
     *
     * Returns:
     * {Boolean} Let the event propagate.
     */
    touchend: function(evt) {
        // override evt.xy with last position since touchend does not have
        // any touch position
        evt.xy = this.last;
        return this.dragend(evt);
    },

    /**
     * Method: mouseout
     * Handle mouseout events
     *
     * Parameters:
     * evt - {Event}
     *
     * Returns:
     * {Boolean} Let the event propagate.
     */
    mouseout: function (evt) {
        if (this.started && OpenLayers.Util.mouseLeft(evt, this.map.viewPortDiv)) {
            if(this.documentDrag === true) {
                this.addDocumentEvents();
            } else {
                var dragged = (this.start != this.last);
                this.started = false; 
                this.dragging = false;
                OpenLayers.Element.removeClass(
                    this.map.viewPortDiv, "olDragDown"
                );
                this.out(evt);
                this.callback("out", []);
                if(dragged) {
                    this.callback("done", [evt.xy]);
                }
                if(document.onselectstart) {
                    document.onselectstart = this.oldOnselectstart;
                }
            }
        }
        return true;
    },

    /**
     * Method: click
     * The drag handler captures the click event.  If something else registers
     *     for clicks on the same element, its listener will not be called 
     *     after a drag.
     * 
     * Parameters: 
     * evt - {Event} 
     * 
     * Returns:
     * {Boolean} Let the event propagate.
     */
    click: function (evt) {
        // let the click event propagate only if the mouse moved
        return (this.start == this.last);
    },

    /**
     * Method: activate
     * Activate the handler.
     * 
     * Returns:
     * {Boolean} The handler was successfully activated.
     */
    activate: function() {
        var activated = false;
        if(OpenLayers.Handler.prototype.activate.apply(this, arguments)) {
            this.dragging = false;
            activated = true;
        }
        return activated;
    },

    /**
     * Method: deactivate 
     * Deactivate the handler.
     * 
     * Returns:
     * {Boolean} The handler was successfully deactivated.
     */
    deactivate: function() {
        var deactivated = false;
        if(OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            this.touch = false;
            this.started = false;
            this.dragging = false;
            this.start = null;
            this.last = null;
            deactivated = true;
            OpenLayers.Element.removeClass(
                this.map.viewPortDiv, "olDragDown"
            );
        }
        return deactivated;
    },
    
    /**
     * Method: adjustXY
     * Converts event coordinates that are relative to the document body to
     * ones that are relative to the map viewport. The latter is the default in
     * OpenLayers.
     * 
     * Parameters:
     * evt - {Object}
     */
    adjustXY: function(evt) {
        var pos = OpenLayers.Util.pagePosition(this.map.viewPortDiv);
        evt.xy.x -= pos[0];
        evt.xy.y -= pos[1];
    },
    
    /**
     * Method: addDocumentEvents
     * Start observing document events when documentDrag is true and the mouse
     * cursor leaves the map viewport while dragging.
     */
    addDocumentEvents: function() {
        OpenLayers.Element.addClass(document.body, "olDragDown");
        this.documentEvents = true;
        OpenLayers.Event.observe(document, "mousemove", this._docMove);
        OpenLayers.Event.observe(document, "mouseup", this._docUp);
    },
    
    /**
     * Method: removeDocumentEvents
     * Stops observing document events when documentDrag is true and the mouse
     * cursor re-enters the map viewport while dragging.
     */
    removeDocumentEvents: function() {
        OpenLayers.Element.removeClass(document.body, "olDragDown");
        this.documentEvents = false;
        OpenLayers.Event.stopObserving(document, "mousemove", this._docMove);
        OpenLayers.Event.stopObserving(document, "mouseup", this._docUp);
    },

    CLASS_NAME: "OpenLayers.Handler.Drag"
});
/* ======================================================================
    OpenLayers/Handler/Box.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Handler.js
 * @requires OpenLayers/Handler/Drag.js
 */

/**
 * Class: OpenLayers.Handler.Box
 * Handler for dragging a rectangle across the map.  Box is displayed 
 * on mouse down, moves on mouse move, and is finished on mouse up.
 *
 * Inherits from:
 *  - <OpenLayers.Handler> 
 */
OpenLayers.Handler.Box = OpenLayers.Class(OpenLayers.Handler, {

    /** 
     * Property: dragHandler 
     * {<OpenLayers.Handler.Drag>} 
     */
    dragHandler: null,

    /**
     * APIProperty: boxDivClassName
     * {String} The CSS class to use for drawing the box. Default is
     *     olHandlerBoxZoomBox
     */
    boxDivClassName: 'olHandlerBoxZoomBox',
    
    /**
     * Property: boxOffsets
     * {Object} Caches box offsets from css. This is used by the getBoxOffsets
     * method.
     */
    boxOffsets: null,

    /**
     * Constructor: OpenLayers.Handler.Box
     *
     * Parameters:
     * control - {<OpenLayers.Control>} 
     * callbacks - {Object} An object with a properties whose values are
     *     functions.  Various callbacks described below.
     * options - {Object} 
     *
     * Named callbacks:
     * start - Called when the box drag operation starts.
     * done - Called when the box drag operation is finished.
     *     The callback should expect to receive a single argument, the box 
     *     bounds or a pixel. If the box dragging didn't span more than a 5 
     *     pixel distance, a pixel will be returned instead of a bounds object.
     */
    initialize: function(control, callbacks, options) {
        OpenLayers.Handler.prototype.initialize.apply(this, arguments);
        this.dragHandler = new OpenLayers.Handler.Drag(
            this, 
            {
                down: this.startBox, 
                move: this.moveBox, 
                out: this.removeBox,
                up: this.endBox
            }, 
            {keyMask: this.keyMask}
        );
    },

    /**
     * Method: destroy
     */
    destroy: function() {
        OpenLayers.Handler.prototype.destroy.apply(this, arguments);
        if (this.dragHandler) {
            this.dragHandler.destroy();
            this.dragHandler = null;
        }            
    },

    /**
     * Method: setMap
     */
    setMap: function (map) {
        OpenLayers.Handler.prototype.setMap.apply(this, arguments);
        if (this.dragHandler) {
            this.dragHandler.setMap(map);
        }
    },

    /**
    * Method: startBox
    *
    * Parameters:
    * xy - {<OpenLayers.Pixel>}
    */
    startBox: function (xy) {
        this.callback("start", []);
        this.zoomBox = OpenLayers.Util.createDiv('zoomBox', {
            x: -9999, y: -9999
        });
        this.zoomBox.className = this.boxDivClassName;                                         
        this.zoomBox.style.zIndex = this.map.Z_INDEX_BASE["Popup"] - 1;
        
        this.map.viewPortDiv.appendChild(this.zoomBox);
        
        OpenLayers.Element.addClass(
            this.map.viewPortDiv, "olDrawBox"
        );
    },

    /**
    * Method: moveBox
    */
    moveBox: function (xy) {
        var startX = this.dragHandler.start.x;
        var startY = this.dragHandler.start.y;
        var deltaX = Math.abs(startX - xy.x);
        var deltaY = Math.abs(startY - xy.y);

        var offset = this.getBoxOffsets();
        this.zoomBox.style.width = (deltaX + offset.width + 1) + "px";
        this.zoomBox.style.height = (deltaY + offset.height + 1) + "px";
        this.zoomBox.style.left = (xy.x < startX ?
            startX - deltaX - offset.left : startX - offset.left) + "px";
        this.zoomBox.style.top = (xy.y < startY ?
            startY - deltaY - offset.top : startY - offset.top) + "px";
    },

    /**
    * Method: endBox
    */
    endBox: function(end) {
        var result;
        if (Math.abs(this.dragHandler.start.x - end.x) > 5 ||    
            Math.abs(this.dragHandler.start.y - end.y) > 5) {   
            var start = this.dragHandler.start;
            var top = Math.min(start.y, end.y);
            var bottom = Math.max(start.y, end.y);
            var left = Math.min(start.x, end.x);
            var right = Math.max(start.x, end.x);
            result = new OpenLayers.Bounds(left, bottom, right, top);
        } else {
            result = this.dragHandler.start.clone(); // i.e. OL.Pixel
        } 
        this.removeBox();

        this.callback("done", [result]);
    },

    /**
     * Method: removeBox
     * Remove the zoombox from the screen and nullify our reference to it.
     */
    removeBox: function() {
        this.map.viewPortDiv.removeChild(this.zoomBox);
        this.zoomBox = null;
        this.boxOffsets = null;
        OpenLayers.Element.removeClass(
            this.map.viewPortDiv, "olDrawBox"
        );

    },

    /**
     * Method: activate
     */
    activate: function () {
        if (OpenLayers.Handler.prototype.activate.apply(this, arguments)) {
            this.dragHandler.activate();
            return true;
        } else {
            return false;
        }
    },

    /**
     * Method: deactivate
     */
    deactivate: function () {
        if (OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            if (this.dragHandler.deactivate()) {
                if (this.zoomBox) {
                    this.removeBox();
                }
            }
            return true;
        } else {
            return false;
        }
    },
    
    /**
     * Method: getBoxOffsets
     * Determines border offsets for a box, according to the box model.
     * 
     * Returns:
     * {Object} an object with the following offsets:
     *     - left
     *     - right
     *     - top
     *     - bottom
     *     - width
     *     - height
     */
    getBoxOffsets: function() {
        if (!this.boxOffsets) {
            // Determine the box model. If the testDiv's clientWidth is 3, then
            // the borders are outside and we are dealing with the w3c box
            // model. Otherwise, the browser uses the traditional box model and
            // the borders are inside the box bounds, leaving us with a
            // clientWidth of 1.
            var testDiv = document.createElement("div");
            //testDiv.style.visibility = "hidden";
            testDiv.style.position = "absolute";
            testDiv.style.border = "1px solid black";
            testDiv.style.width = "3px";
            document.body.appendChild(testDiv);
            var w3cBoxModel = testDiv.clientWidth == 3;
            document.body.removeChild(testDiv);
            
            var left = parseInt(OpenLayers.Element.getStyle(this.zoomBox,
                "border-left-width"));
            var right = parseInt(OpenLayers.Element.getStyle(
                this.zoomBox, "border-right-width"));
            var top = parseInt(OpenLayers.Element.getStyle(this.zoomBox,
                "border-top-width"));
            var bottom = parseInt(OpenLayers.Element.getStyle(
                this.zoomBox, "border-bottom-width"));
            this.boxOffsets = {
                left: left,
                right: right,
                top: top,
                bottom: bottom,
                width: w3cBoxModel === false ? left + right : 0,
                height: w3cBoxModel === false ? top + bottom : 0
            };
        }
        return this.boxOffsets;
    },
  
    CLASS_NAME: "OpenLayers.Handler.Box"
});
/* ======================================================================
    OpenLayers/Control/ZoomBox.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Control.js
 * @requires OpenLayers/Handler/Box.js
 */

/**
 * Class: OpenLayers.Control.ZoomBox
 * The ZoomBox control enables zooming directly to a given extent, by drawing 
 * a box on the map. The box is drawn by holding down shift, whilst dragging 
 * the mouse.
 *
 * Inherits from:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.ZoomBox = OpenLayers.Class(OpenLayers.Control, {
    /**
     * Property: type
     * {OpenLayers.Control.TYPE}
     */
    type: OpenLayers.Control.TYPE_TOOL,

    /**
     * Property: out
     * {Boolean} Should the control be used for zooming out?
     */
    out: false,

    /**
     * APIProperty: keyMask
     * {Integer} Zoom only occurs if the keyMask matches the combination of 
     *     keys down. Use bitwise operators and one or more of the
     *     <OpenLayers.Handler> constants to construct a keyMask. Leave null if 
     *     not used mask. Default is null.
     */
    keyMask: null,

    /**
     * APIProperty: alwaysZoom
     * {Boolean} Always zoom in/out, when box drawed 
     */
    alwaysZoom: false,

    /**
     * Method: draw
     */    
    draw: function() {
        this.handler = new OpenLayers.Handler.Box( this,
                            {done: this.zoomBox}, {keyMask: this.keyMask} );
    },

    /**
     * Method: zoomBox
     *
     * Parameters:
     * position - {<OpenLayers.Bounds>} or {<OpenLayers.Pixel>}
     */
    zoomBox: function (position) {
        if (position instanceof OpenLayers.Bounds) {
            var bounds;
            if (!this.out) {
                var minXY = this.map.getLonLatFromPixel({
                    x: position.left,
                    y: position.bottom
                });
                var maxXY = this.map.getLonLatFromPixel({
                    x: position.right,
                    y: position.top
                });
                bounds = new OpenLayers.Bounds(minXY.lon, minXY.lat,
                                               maxXY.lon, maxXY.lat);
            } else {
                var pixWidth = Math.abs(position.right-position.left);
                var pixHeight = Math.abs(position.top-position.bottom);
                var zoomFactor = Math.min((this.map.size.h / pixHeight),
                    (this.map.size.w / pixWidth));
                var extent = this.map.getExtent();
                var center = this.map.getLonLatFromPixel(
                    position.getCenterPixel());
                var xmin = center.lon - (extent.getWidth()/2)*zoomFactor;
                var xmax = center.lon + (extent.getWidth()/2)*zoomFactor;
                var ymin = center.lat - (extent.getHeight()/2)*zoomFactor;
                var ymax = center.lat + (extent.getHeight()/2)*zoomFactor;
                bounds = new OpenLayers.Bounds(xmin, ymin, xmax, ymax);
            }
            // always zoom in/out 
            var lastZoom = this.map.getZoom(); 
            this.map.zoomToExtent(bounds);
            if (lastZoom == this.map.getZoom() && this.alwaysZoom == true){ 
                this.map.zoomTo(lastZoom + (this.out ? -1 : 1)); 
            }
        } else { // it's a pixel
            if (!this.out) {
                this.map.setCenter(this.map.getLonLatFromPixel(position),
                               this.map.getZoom() + 1);
            } else {
                this.map.setCenter(this.map.getLonLatFromPixel(position),
                               this.map.getZoom() - 1);
            }
        }
    },

    CLASS_NAME: "OpenLayers.Control.ZoomBox"
});
/* ======================================================================
    OpenLayers/Control/DragPan.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Control.js
 * @requires OpenLayers/Handler/Drag.js
 */

/**
 * Class: OpenLayers.Control.DragPan
 * The DragPan control pans the map with a drag of the mouse.
 *
 * Inherits from:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.DragPan = OpenLayers.Class(OpenLayers.Control, {

    /** 
     * Property: type
     * {OpenLayers.Control.TYPES}
     */
    type: OpenLayers.Control.TYPE_TOOL,
    
    /**
     * Property: panned
     * {Boolean} The map moved.
     */
    panned: false,
    
    /**
     * Property: interval
     * {Integer} The number of milliseconds that should ellapse before
     *     panning the map again. Defaults to 1 millisecond. In most cases
     *     you won't want to change this value. For slow machines/devices
     *     larger values can be tried out.
     */
    interval: 1,
    
    /**
     * APIProperty: documentDrag
     * {Boolean} If set to true, mouse dragging will continue even if the
     *     mouse cursor leaves the map viewport. Default is false.
     */
    documentDrag: false,

    /**
     * Property: kinetic
     * {<OpenLayers.Kinetic>} The OpenLayers.Kinetic object.
     */
    kinetic: null,

    /**
     * APIProperty: enableKinetic
     * {Boolean} Set this option to enable "kinetic dragging". Can be
     *     set to true or to an object. If set to an object this
     *     object will be passed to the {<OpenLayers.Kinetic>}
     *     constructor. Defaults to false.
     *     If you set this property, you should ensure that 
     *     OpenLayers/Kinetic.js is included in your build config
     */
    enableKinetic: false,

    /**
     * APIProperty: kineticInterval
     * {Integer} Interval in milliseconds between 2 steps in the "kinetic
     *     scrolling". Applies only if enableKinetic is set. Defaults
     *     to 10 milliseconds.
     */
    kineticInterval: 10,


    /**
     * Method: draw
     * Creates a Drag handler, using <panMap> and
     * <panMapDone> as callbacks.
     */    
    draw: function() {
        if(this.enableKinetic) {
            var config = {interval: this.kineticInterval};
            if(typeof this.enableKinetic === "object") {
                config = OpenLayers.Util.extend(config, this.enableKinetic);
            }
            this.kinetic = new OpenLayers.Kinetic(config);
        }
        this.handler = new OpenLayers.Handler.Drag(this, {
                "move": this.panMap,
                "done": this.panMapDone,
                "down": this.panMapStart
            }, {
                interval: this.interval,
                documentDrag: this.documentDrag
            }
        );
    },

    /**
     * Method: panMapStart
     */
    panMapStart: function() {
        if(this.kinetic) {
            this.kinetic.begin();
        }
    },

    /**
    * Method: panMap
    *
    * Parameters:
    * xy - {<OpenLayers.Pixel>} Pixel of the mouse position
    */
    panMap: function(xy) {
        if(this.kinetic) {
            this.kinetic.update(xy);
        }
        this.panned = true;
        this.map.pan(
            this.handler.last.x - xy.x,
            this.handler.last.y - xy.y,
            {dragging: true, animate: false}
        );
    },
    
    /**
     * Method: panMapDone
     * Finish the panning operation.  Only call setCenter (through <panMap>)
     *     if the map has actually been moved.
     *
     * Parameters:
     * xy - {<OpenLayers.Pixel>} Pixel of the mouse position
     */
    panMapDone: function(xy) {
        if(this.panned) {
            var res = null;
            if (this.kinetic) {
                res = this.kinetic.end(xy);
            }
            this.map.pan(
                this.handler.last.x - xy.x,
                this.handler.last.y - xy.y,
                {dragging: !!res, animate: false}
            );
            if (res) {
                var self = this;
                this.kinetic.move(res, function(x, y, end) {
                    self.map.pan(x, y, {dragging: !end, animate: false});
                });
            }
            this.panned = false;
        }
    },

    CLASS_NAME: "OpenLayers.Control.DragPan"
});
/* ======================================================================
    OpenLayers/Handler/MouseWheel.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Handler.js
 */

/**
 * Class: OpenLayers.Handler.MouseWheel
 * Handler for wheel up/down events.
 * 
 * Inherits from:
 *  - <OpenLayers.Handler>
 */
OpenLayers.Handler.MouseWheel = OpenLayers.Class(OpenLayers.Handler, {
    /** 
     * Property: wheelListener 
     * {function} 
     */
    wheelListener: null,

    /**
     * Property: interval
     * {Integer} In order to increase server performance, an interval (in 
     *     milliseconds) can be set to reduce the number of up/down events 
     *     called. If set, a new up/down event will not be set until the 
     *     interval has passed. 
     *     Defaults to 0, meaning no interval. 
     */
    interval: 0,
    
    /**
     * Property: delta
     * {Integer} When interval is set, delta collects the mousewheel z-deltas
     *     of the events that occur within the interval.
     *      See also the cumulative option
     */
    delta: 0,
    
    /**
     * Property: cumulative
     * {Boolean} When interval is set: true to collect all the mousewheel 
     *     z-deltas, false to only record the delta direction (positive or
     *     negative)
     */
    cumulative: true,
    
    /**
     * Constructor: OpenLayers.Handler.MouseWheel
     *
     * Parameters:
     * control - {<OpenLayers.Control>} 
     * callbacks - {Object} An object containing a single function to be
     *                          called when the drag operation is finished.
     *                          The callback should expect to recieve a single
     *                          argument, the point geometry.
     * options - {Object} 
     */
    initialize: function(control, callbacks, options) {
        OpenLayers.Handler.prototype.initialize.apply(this, arguments);
        this.wheelListener = OpenLayers.Function.bindAsEventListener(
            this.onWheelEvent, this
        );
    },

    /**
     * Method: destroy
     */    
    destroy: function() {
        OpenLayers.Handler.prototype.destroy.apply(this, arguments);
        this.wheelListener = null;
    },

    /**
     *  Mouse ScrollWheel code thanks to http://adomas.org/javascript-mouse-wheel/
     */

    /** 
     * Method: onWheelEvent
     * Catch the wheel event and handle it xbrowserly
     * 
     * Parameters:
     * e - {Event} 
     */
    onWheelEvent: function(e){
        
        // make sure we have a map and check keyboard modifiers
        if (!this.map || !this.checkModifiers(e)) {
            return;
        }
        
        // Ride up the element's DOM hierarchy to determine if it or any of 
        //  its ancestors was: 
        //   * specifically marked as scrollable (CSS overflow property)
        //   * one of our layer divs or a div marked as scrollable
        //     ('olScrollable' CSS class)
        //   * the map div
        //
        var overScrollableDiv = false;
        var allowScroll = false;
        var overMapDiv = false;
        
        var elem = OpenLayers.Event.element(e);
        while((elem != null) && !overMapDiv && !overScrollableDiv) {

            if (!overScrollableDiv) {
                try {
                    var overflow;
                    if (elem.currentStyle) {
                        overflow = elem.currentStyle["overflow"];
                    } else {
                        var style = 
                            document.defaultView.getComputedStyle(elem, null);
                        overflow = style.getPropertyValue("overflow");
                    }
                    overScrollableDiv = ( overflow && 
                        (overflow == "auto") || (overflow == "scroll") );
                } catch(err) {
                    //sometimes when scrolling in a popup, this causes 
                    // obscure browser error
                }
            }

            if (!allowScroll) {
                allowScroll = OpenLayers.Element.hasClass(elem, 'olScrollable');
                if (!allowScroll) {
                    for (var i = 0, len = this.map.layers.length; i < len; i++) {
                        // Are we in the layer div? Note that we have two cases
                        // here: one is to catch EventPane layers, which have a
                        // pane above the layer (layer.pane)
                        var layer = this.map.layers[i];
                        if (elem == layer.div || elem == layer.pane) {
                            allowScroll = true;
                            break;
                        }
                    }
                }
            }
            overMapDiv = (elem == this.map.div);

            elem = elem.parentNode;
        }
        
        // Logic below is the following:
        //
        // If we are over a scrollable div or not over the map div:
        //  * do nothing (let the browser handle scrolling)
        //
        //    otherwise 
        // 
        //    If we are over the layer div or a 'olScrollable' div:
        //     * zoom/in out
        //     then
        //     * kill event (so as not to also scroll the page after zooming)
        //
        //       otherwise
        //
        //       Kill the event (dont scroll the page if we wheel over the 
        //        layerswitcher or the pan/zoom control)
        //
        if (!overScrollableDiv && overMapDiv) {
            if (allowScroll) {
                var delta = 0;
                if (!e) {
                    e = window.event;
                }
                
                if (e.wheelDelta) {
                    delta = e.wheelDelta;
                    if (delta % 160 === 0) {
                        // opera have steps of 160 instead of 120
                        delta = delta * 0.75;
                    }
                    delta = delta / 120;
                } else if (e.detail) {
                    // detail in Firefox on OS X is 1/3 of Windows
                    // so force delta 1 / -1
                    delta = - (e.detail / Math.abs(e.detail));
                }
                this.delta = this.delta + delta;

                if(this.interval) {
                    window.clearTimeout(this._timeoutId);
                    this._timeoutId = window.setTimeout(
                        OpenLayers.Function.bind(function(){
                            this.wheelZoom(e);
                        }, this),
                        this.interval
                    );
                } else {
                    this.wheelZoom(e);
                }
            }
            OpenLayers.Event.stop(e);
        }
    },

    /**
     * Method: wheelZoom
     * Given the wheel event, we carry out the appropriate zooming in or out,
     *     based on the 'wheelDelta' or 'detail' property of the event.
     * 
     * Parameters:
     * e - {Event}
     */
    wheelZoom: function(e) {
        var delta = this.delta;
        this.delta = 0;
        
        if (delta) {
            e.xy = this.map.events.getMousePosition(e);
            if (delta < 0) {
                this.callback("down", [e, this.cumulative ? delta : -1]);
            } else {
                this.callback("up", [e, this.cumulative ? delta : 1]);
            }
        }
    },
    
    /**
     * Method: activate 
     */
    activate: function (evt) {
        if (OpenLayers.Handler.prototype.activate.apply(this, arguments)) {
            //register mousewheel events specifically on the window and document
            var wheelListener = this.wheelListener;
            OpenLayers.Event.observe(window, "DOMMouseScroll", wheelListener);
            OpenLayers.Event.observe(window, "mousewheel", wheelListener);
            OpenLayers.Event.observe(document, "mousewheel", wheelListener);
            return true;
        } else {
            return false;
        }
    },

    /**
     * Method: deactivate 
     */
    deactivate: function (evt) {
        if (OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            // unregister mousewheel events specifically on the window and document
            var wheelListener = this.wheelListener;
            OpenLayers.Event.stopObserving(window, "DOMMouseScroll", wheelListener);
            OpenLayers.Event.stopObserving(window, "mousewheel", wheelListener);
            OpenLayers.Event.stopObserving(document, "mousewheel", wheelListener);
            return true;
        } else {
            return false;
        }
    },

    CLASS_NAME: "OpenLayers.Handler.MouseWheel"
});
/* ======================================================================
    OpenLayers/Control/Navigation.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Control/ZoomBox.js
 * @requires OpenLayers/Control/DragPan.js
 * @requires OpenLayers/Handler/MouseWheel.js
 * @requires OpenLayers/Handler/Click.js
 */

/**
 * Class: OpenLayers.Control.Navigation
 * The navigation control handles map browsing with mouse events (dragging,
 *     double-clicking, and scrolling the wheel).  Create a new navigation 
 *     control with the <OpenLayers.Control.Navigation> control.  
 * 
 *     Note that this control is added to the map by default (if no controls 
 *     array is sent in the options object to the <OpenLayers.Map> 
 *     constructor).
 * 
 * Inherits:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.Navigation = OpenLayers.Class(OpenLayers.Control, {

    /** 
     * Property: dragPan
     * {<OpenLayers.Control.DragPan>} 
     */
    dragPan: null,

    /**
     * APIProperty: dragPanOptions
     * {Object} Options passed to the DragPan control.
     */
    dragPanOptions: null,

    /**
     * Property: pinchZoom
     * {<OpenLayers.Control.PinchZoom>}
     */
    pinchZoom: null,

    /**
     * APIProperty: pinchZoomOptions
     * {Object} Options passed to the PinchZoom control.
     */
    pinchZoomOptions: null,

    /**
     * APIProperty: documentDrag
     * {Boolean} Allow panning of the map by dragging outside map viewport.
     *     Default is false.
     */
    documentDrag: false,

    /** 
     * Property: zoomBox
     * {<OpenLayers.Control.ZoomBox>}
     */
    zoomBox: null,

    /**
     * APIProperty: zoomBoxEnabled
     * {Boolean} Whether the user can draw a box to zoom
     */
    zoomBoxEnabled: true, 

    /**
     * APIProperty: zoomWheelEnabled
     * {Boolean} Whether the mousewheel should zoom the map
     */
    zoomWheelEnabled: true,

    /**
     * APIProperty: forceFixedZoomLevel
     * {Boolean} Force a fixed zoom level even though the map has
     *     fractionalZoom
     */
    forceFixedZoomLevel: false,
    
    /**
     * Property: mouseWheelOptions
     * {Object} Options passed to the MouseWheel control (only useful if
     *     <zoomWheelEnabled> is set to true)
     */
    mouseWheelOptions: null,

    /**
     * APIProperty: handleRightClicks
     * {Boolean} Whether or not to handle right clicks. Default is false.
     */
    handleRightClicks: false,

    /**
     * APIProperty: zoomBoxKeyMask
     * {Integer} <OpenLayers.Handler> key code of the key, which has to be
     *    pressed, while drawing the zoom box with the mouse on the screen. 
     *    You should probably set handleRightClicks to true if you use this
     *    with MOD_CTRL, to disable the context menu for machines which use
     *    CTRL-Click as a right click.
     * Default: <OpenLayers.Handler.MOD_SHIFT>
     */
    zoomBoxKeyMask: OpenLayers.Handler.MOD_SHIFT,
    
    /**
     * APIProperty: autoActivate
     * {Boolean} Activate the control when it is added to a map.  Default is
     *     true.
     */
    autoActivate: true,

    /**
     * Constructor: OpenLayers.Control.Navigation
     * Create a new navigation control
     * 
     * Parameters:
     * options - {Object} An optional object whose properties will be set on
     *                    the control
     */
    initialize: function(options) {
        this.handlers = {};
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
    },

    /**
     * Method: destroy
     * The destroy method is used to perform any clean up before the control
     * is dereferenced.  Typically this is where event listeners are removed
     * to prevent memory leaks.
     */
    destroy: function() {
        this.deactivate();

        if (this.dragPan) {
            this.dragPan.destroy();
        }
        this.dragPan = null;

        if (this.zoomBox) {
            this.zoomBox.destroy();
        }
        this.zoomBox = null;

        if (this.pinchZoom) {
            this.pinchZoom.destroy();
        }
        this.pinchZoom = null;

        OpenLayers.Control.prototype.destroy.apply(this,arguments);
    },
    
    /**
     * Method: activate
     */
    activate: function() {
        this.dragPan.activate();
        if (this.zoomWheelEnabled) {
            this.handlers.wheel.activate();
        }    
        this.handlers.click.activate();
        if (this.zoomBoxEnabled) {
            this.zoomBox.activate();
        }
        if (this.pinchZoom) {
            this.pinchZoom.activate();
        }
        return OpenLayers.Control.prototype.activate.apply(this,arguments);
    },

    /**
     * Method: deactivate
     */
    deactivate: function() {
        if (this.pinchZoom) {
            this.pinchZoom.deactivate();
        }
        this.zoomBox.deactivate();
        this.dragPan.deactivate();
        this.handlers.click.deactivate();
        this.handlers.wheel.deactivate();
        return OpenLayers.Control.prototype.deactivate.apply(this,arguments);
    },
    
    /**
     * Method: draw
     */
    draw: function() {
        // disable right mouse context menu for support of right click events
        if (this.handleRightClicks) {
            this.map.viewPortDiv.oncontextmenu = OpenLayers.Function.False;
        }

        var clickCallbacks = { 
            'click': this.defaultClick,
            'dblclick': this.defaultDblClick, 
            'dblrightclick': this.defaultDblRightClick 
        };
        var clickOptions = {
            'double': true, 
            'stopDouble': true
        };
        this.handlers.click = new OpenLayers.Handler.Click(
            this, clickCallbacks, clickOptions
        );
        this.dragPan = new OpenLayers.Control.DragPan(
            OpenLayers.Util.extend({
                map: this.map,
                documentDrag: this.documentDrag
            }, this.dragPanOptions)
        );
        this.zoomBox = new OpenLayers.Control.ZoomBox(
                    {map: this.map, keyMask: this.zoomBoxKeyMask});
        this.dragPan.draw();
        this.zoomBox.draw();
        this.handlers.wheel = new OpenLayers.Handler.MouseWheel(
                                    this, {"up"  : this.wheelUp,
                                           "down": this.wheelDown},
                                    this.mouseWheelOptions );
        if (OpenLayers.Control.PinchZoom) {
            this.pinchZoom = new OpenLayers.Control.PinchZoom(
                OpenLayers.Util.extend(
                    {map: this.map}, this.pinchZoomOptions));
        }
    },

    /**
     * Method: defaultClick
     *
     * Parameters:
     * evt - {Event}
     */
    defaultClick: function (evt) {
        if (evt.lastTouches && evt.lastTouches.length == 2) {
            this.map.zoomOut();
        }
    },

    /**
     * Method: defaultDblClick 
     * 
     * Parameters:
     * evt - {Event} 
     */
    defaultDblClick: function (evt) {
        var newCenter = this.map.getLonLatFromViewPortPx( evt.xy ); 
        this.map.setCenter(newCenter, this.map.zoom + 1);
    },

    /**
     * Method: defaultDblRightClick 
     * 
     * Parameters:
     * evt - {Event} 
     */
    defaultDblRightClick: function (evt) {
        var newCenter = this.map.getLonLatFromViewPortPx( evt.xy ); 
        this.map.setCenter(newCenter, this.map.zoom - 1);
    },
    
    /**
     * Method: wheelChange  
     *
     * Parameters:
     * evt - {Event}
     * deltaZ - {Integer}
     */
    wheelChange: function(evt, deltaZ) {
        if (!this.map.fractionalZoom) {
            deltaZ =  Math.round(deltaZ);
        }
        var currentZoom = this.map.getZoom();
        var newZoom;

        if (this.map.fractionalZoom && this.forceFixedZoomLevel &&
            currentZoom != Math.round(currentZoom)) {
            newZoom = (deltaZ < 0)?Math.floor(currentZoom):Math.ceil(currentZoom);
        } else {
            newZoom = this.map.getZoom() + deltaZ;
        }

        newZoom = Math.max(newZoom, 0);
        newZoom = Math.min(newZoom, this.map.getNumZoomLevels());
        if (newZoom === currentZoom) {
            return;
        }
        var size    = this.map.getSize();
        var deltaX  = size.w/2 - evt.xy.x;
        var deltaY  = evt.xy.y - size.h/2;
        var newRes  = this.map.baseLayer.getResolutionForZoom(newZoom);
        var zoomPoint = this.map.getLonLatFromPixel(evt.xy);
        var newCenter = new OpenLayers.LonLat(
                            zoomPoint.lon + deltaX * newRes,
                            zoomPoint.lat + deltaY * newRes );
        this.map.setCenter( newCenter, newZoom );
    },

    /** 
     * Method: wheelUp
     * User spun scroll wheel up
     * 
     * Parameters:
     * evt - {Event}
     * delta - {Integer}
     */
    wheelUp: function(evt, delta) {
        this.wheelChange(evt, delta || 1);
    },

    /** 
     * Method: wheelDown
     * User spun scroll wheel down
     * 
     * Parameters:
     * evt - {Event}
     * delta - {Integer}
     */
    wheelDown: function(evt, delta) {
        this.wheelChange(evt, delta || -1);
    },
    
    /**
     * Method: disableZoomBox
     */
    disableZoomBox : function() {
        this.zoomBoxEnabled = false;
        this.zoomBox.deactivate();       
    },
    
    /**
     * Method: enableZoomBox
     */
    enableZoomBox : function() {
        this.zoomBoxEnabled = true;
        if (this.active) {
            this.zoomBox.activate();
        }    
    },
    
    /**
     * Method: disableZoomWheel
     */
    
    disableZoomWheel : function() {
        this.zoomWheelEnabled = false;
        this.handlers.wheel.deactivate();       
    },
    
    /**
     * Method: enableZoomWheel
     */
    
    enableZoomWheel : function() {
        this.zoomWheelEnabled = true;
        if (this.active) {
            this.handlers.wheel.activate();
        }    
    },

    CLASS_NAME: "OpenLayers.Control.Navigation"
});
/* ======================================================================
    OpenLayers/StyleMap.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/BaseTypes/Class.js
 * @requires OpenLayers/Style.js
 * @requires OpenLayers/Feature/Vector.js
 */
 
/**
 * Class: OpenLayers.StyleMap
 */
OpenLayers.StyleMap = OpenLayers.Class({
    
    /**
     * Property: styles
     * {Object} Hash of {<OpenLayers.Style>}, keyed by names of well known
     * rendering intents (e.g. "default", "temporary", "select", "delete").
     */
    styles: null,
    
    /**
     * Property: extendDefault
     * {Boolean} if true, every render intent will extend the symbolizers
     * specified for the "default" intent at rendering time. Otherwise, every
     * rendering intent will be treated as a completely independent style.
     */
    extendDefault: true,
    
    /**
     * Constructor: OpenLayers.StyleMap
     * 
     * Parameters:
     * style   - {Object} Optional. Either a style hash, or a style object, or
     *           a hash of style objects (style hashes) keyed by rendering
     *           intent. If just one style hash or style object is passed,
     *           this will be used for all known render intents (default,
     *           select, temporary)
     * options - {Object} optional hash of additional options for this
     *           instance
     */
    initialize: function (style, options) {
        this.styles = {
            "default": new OpenLayers.Style(
                OpenLayers.Feature.Vector.style["default"]),
            "select": new OpenLayers.Style(
                OpenLayers.Feature.Vector.style["select"]),
            "temporary": new OpenLayers.Style(
                OpenLayers.Feature.Vector.style["temporary"]),
            "delete": new OpenLayers.Style(
                OpenLayers.Feature.Vector.style["delete"])
        };
        
        // take whatever the user passed as style parameter and convert it
        // into parts of stylemap.
        if(style instanceof OpenLayers.Style) {
            // user passed a style object
            this.styles["default"] = style;
            this.styles["select"] = style;
            this.styles["temporary"] = style;
            this.styles["delete"] = style;
        } else if(typeof style == "object") {
            for(var key in style) {
                if(style[key] instanceof OpenLayers.Style) {
                    // user passed a hash of style objects
                    this.styles[key] = style[key];
                } else if(typeof style[key] == "object") {
                    // user passsed a hash of style hashes
                    this.styles[key] = new OpenLayers.Style(style[key]);
                } else {
                    // user passed a style hash (i.e. symbolizer)
                    this.styles["default"] = new OpenLayers.Style(style);
                    this.styles["select"] = new OpenLayers.Style(style);
                    this.styles["temporary"] = new OpenLayers.Style(style);
                    this.styles["delete"] = new OpenLayers.Style(style);
                    break;
                }
            }
        }
        OpenLayers.Util.extend(this, options);
    },

    /**
     * Method: destroy
     */
    destroy: function() {
        for(var key in this.styles) {
            this.styles[key].destroy();
        }
        this.styles = null;
    },
    
    /**
     * Method: createSymbolizer
     * Creates the symbolizer for a feature for a render intent.
     * 
     * Parameters:
     * feature - {<OpenLayers.Feature>} The feature to evaluate the rules
     *           of the intended style against.
     * intent  - {String} The intent determines the symbolizer that will be
     *           used to draw the feature. Well known intents are "default"
     *           (for just drawing the features), "select" (for selected
     *           features) and "temporary" (for drawing features).
     * 
     * Returns:
     * {Object} symbolizer hash
     */
    createSymbolizer: function(feature, intent) {
        if(!feature) {
            feature = new OpenLayers.Feature.Vector();
        }
        if(!this.styles[intent]) {
            intent = "default";
        }
        feature.renderIntent = intent;
        var defaultSymbolizer = {};
        if(this.extendDefault && intent != "default") {
            defaultSymbolizer = this.styles["default"].createSymbolizer(feature);
        }
        return OpenLayers.Util.extend(defaultSymbolizer,
            this.styles[intent].createSymbolizer(feature));
    },
    
    /**
     * Method: addUniqueValueRules
     * Convenience method to create comparison rules for unique values of a
     * property. The rules will be added to the style object for a specified
     * rendering intent. This method is a shortcut for creating something like
     * the "unique value legends" familiar from well known desktop GIS systems
     * 
     * Parameters:
     * renderIntent - {String} rendering intent to add the rules to
     * property     - {String} values of feature attributes to create the
     *                rules for
     * symbolizers  - {Object} Hash of symbolizers, keyed by the desired
     *                property values 
     * context      - {Object} An optional object with properties that
     *                symbolizers' property values should be evaluated
     *                against. If no context is specified, feature.attributes
     *                will be used
     */
    addUniqueValueRules: function(renderIntent, property, symbolizers, context) {
        var rules = [];
        for (var value in symbolizers) {
            rules.push(new OpenLayers.Rule({
                symbolizer: symbolizers[value],
                context: context,
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                    property: property,
                    value: value
                })
            }));
        }
        this.styles[renderIntent].addRules(rules);
    },

    CLASS_NAME: "OpenLayers.StyleMap"
});
/* ======================================================================
    OpenLayers/Layer/Vector.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Layer.js
 * @requires OpenLayers/Renderer.js
 * @requires OpenLayers/StyleMap.js
 * @requires OpenLayers/Feature/Vector.js
 * @requires OpenLayers/Console.js
 * @requires OpenLayers/Lang.js
 */

/**
 * Class: OpenLayers.Layer.Vector
 * Instances of OpenLayers.Layer.Vector are used to render vector data from
 *     a variety of sources. Create a new vector layer with the
 *     <OpenLayers.Layer.Vector> constructor.
 *
 * Inherits from:
 *  - <OpenLayers.Layer>
 */
OpenLayers.Layer.Vector = OpenLayers.Class(OpenLayers.Layer, {

    /**
     * APIProperty: events
     * {<OpenLayers.Events>}
     *
     * Register a listener for a particular event with the following syntax:
     * (code)
     * layer.events.register(type, obj, listener);
     * (end)
     *
     * Listeners will be called with a reference to an event object.  The
     *     properties of this event depends on exactly what happened.
     *
     * All event objects have at least the following properties:
     * object - {Object} A reference to layer.events.object.
     * element - {DOMElement} A reference to layer.events.element.
     *
     * Supported map event types (in addition to those from <OpenLayers.Layer.events>):
     * beforefeatureadded - Triggered before a feature is added.  Listeners
     *      will receive an object with a *feature* property referencing the
     *      feature to be added.  To stop the feature from being added, a
     *      listener should return false.
     * beforefeaturesadded - Triggered before an array of features is added.
     *      Listeners will receive an object with a *features* property
     *      referencing the feature to be added. To stop the features from
     *      being added, a listener should return false.
     * featureadded - Triggered after a feature is added.  The event
     *      object passed to listeners will have a *feature* property with a
     *      reference to the added feature.
     * featuresadded - Triggered after features are added.  The event
     *      object passed to listeners will have a *features* property with a
     *      reference to an array of added features.
     * beforefeatureremoved - Triggered before a feature is removed. Listeners
     *      will receive an object with a *feature* property referencing the
     *      feature to be removed.
     * beforefeaturesremoved - Triggered before multiple features are removed. 
     *      Listeners will receive an object with a *features* property
     *      referencing the features to be removed.
     * featureremoved - Triggerd after a feature is removed. The event
     *      object passed to listeners will have a *feature* property with a
     *      reference to the removed feature.
     * featuresremoved - Triggered after features are removed. The event
     *      object passed to listeners will have a *features* property with a
     *      reference to an array of removed features.
     * beforefeatureselected - Triggered before a feature is selected.  Listeners
     *      will receive an object with a *feature* property referencing the
     *      feature to be selected. To stop the feature from being selectd, a
     *      listener should return false.
     * featureselected - Triggered after a feature is selected.  Listeners
     *      will receive an object with a *feature* property referencing the
     *      selected feature.
     * featureunselected - Triggered after a feature is unselected.
     *      Listeners will receive an object with a *feature* property
     *      referencing the unselected feature.
     * beforefeaturemodified - Triggered when a feature is selected to 
     *      be modified.  Listeners will receive an object with a *feature* 
     *      property referencing the selected feature.
     * featuremodified - Triggered when a feature has been modified.
     *      Listeners will receive an object with a *feature* property referencing 
     *      the modified feature.
     * afterfeaturemodified - Triggered when a feature is finished being modified.
     *      Listeners will receive an object with a *feature* property referencing 
     *      the modified feature.
     * vertexmodified - Triggered when a vertex within any feature geometry
     *      has been modified.  Listeners will receive an object with a
     *      *feature* property referencing the modified feature, a *vertex*
     *      property referencing the vertex modified (always a point geometry),
     *      and a *pixel* property referencing the pixel location of the
     *      modification.
     * vertexremoved - Triggered when a vertex within any feature geometry
     *      has been deleted.  Listeners will receive an object with a
     *      *feature* property referencing the modified feature, a *vertex*
     *      property referencing the vertex modified (always a point geometry),
     *      and a *pixel* property referencing the pixel location of the
     *      removal.
     * sketchstarted - Triggered when a feature sketch bound for this layer
     *      is started.  Listeners will receive an object with a *feature*
     *      property referencing the new sketch feature and a *vertex* property
     *      referencing the creation point.
     * sketchmodified - Triggered when a feature sketch bound for this layer
     *      is modified.  Listeners will receive an object with a *vertex*
     *      property referencing the modified vertex and a *feature* property
     *      referencing the sketch feature.
     * sketchcomplete - Triggered when a feature sketch bound for this layer
     *      is complete.  Listeners will receive an object with a *feature*
     *      property referencing the sketch feature.  By returning false, a
     *      listener can stop the sketch feature from being added to the layer.
     * refresh - Triggered when something wants a strategy to ask the protocol
     *      for a new set of features.
     */

    /**
     * APIProperty: isBaseLayer
     * {Boolean} The layer is a base layer.  Default is false.  Set this property
     * in the layer options.
     */
    isBaseLayer: false,

    /** 
     * APIProperty: isFixed
     * {Boolean} Whether the layer remains in one place while dragging the
     * map.
     */
    isFixed: false,

    /** 
     * APIProperty: features
     * {Array(<OpenLayers.Feature.Vector>)} 
     */
    features: null,
    
    /** 
     * Property: filter
     * {<OpenLayers.Filter>} The filter set in this layer,
     *     a strategy launching read requests can combined
     *     this filter with its own filter.
     */
    filter: null,
    
    /** 
     * Property: selectedFeatures
     * {Array(<OpenLayers.Feature.Vector>)} 
     */
    selectedFeatures: null,
    
    /**
     * Property: unrenderedFeatures
     * {Object} hash of features, keyed by feature.id, that the renderer
     *     failed to draw
     */
    unrenderedFeatures: null,

    /**
     * APIProperty: reportError
     * {Boolean} report friendly error message when loading of renderer
     * fails.
     */
    reportError: true, 

    /** 
     * APIProperty: style
     * {Object} Default style for the layer
     */
    style: null,
    
    /**
     * Property: styleMap
     * {<OpenLayers.StyleMap>}
     */
    styleMap: null,
    
    /**
     * Property: strategies
     * {Array(<OpenLayers.Strategy>})} Optional list of strategies for the layer.
     */
    strategies: null,
    
    /**
     * Property: protocol
     * {<OpenLayers.Protocol>} Optional protocol for the layer.
     */
    protocol: null,
    
    /**
     * Property: renderers
     * {Array(String)} List of supported Renderer classes. Add to this list to
     * add support for additional renderers. This list is ordered:
     * the first renderer which returns true for the  'supported()'
     * method will be used, if not defined in the 'renderer' option.
     */
    renderers: ['SVG', 'VML', 'Canvas'],
    
    /** 
     * Property: renderer
     * {<OpenLayers.Renderer>}
     */
    renderer: null,
    
    /**
     * APIProperty: rendererOptions
     * {Object} Options for the renderer. See {<OpenLayers.Renderer>} for
     *     supported options.
     */
    rendererOptions: null,
    
    /** 
     * APIProperty: geometryType
     * {String} geometryType allows you to limit the types of geometries this
     * layer supports. This should be set to something like
     * "OpenLayers.Geometry.Point" to limit types.
     */
    geometryType: null,

    /** 
     * Property: drawn
     * {Boolean} Whether the Vector Layer features have been drawn yet.
     */
    drawn: false,
    
    /** 
     * APIProperty: ratio
     * {Float} This specifies the ratio of the size of the visiblity of the Vector Layer features to the size of the map.
     */   
    ratio: 1,

    /**
     * Constructor: OpenLayers.Layer.Vector
     * Create a new vector layer
     *
     * Parameters:
     * name - {String} A name for the layer
     * options - {Object} Optional object with non-default properties to set on
     *           the layer.
     *
     * Returns:
     * {<OpenLayers.Layer.Vector>} A new vector layer
     */
    initialize: function(name, options) {
        OpenLayers.Layer.prototype.initialize.apply(this, arguments);

        // allow user-set renderer, otherwise assign one
        if (!this.renderer || !this.renderer.supported()) {  
            this.assignRenderer();
        }

        // if no valid renderer found, display error
        if (!this.renderer || !this.renderer.supported()) {
            this.renderer = null;
            this.displayError();
        } 

        if (!this.styleMap) {
            this.styleMap = new OpenLayers.StyleMap();
        }

        this.features = [];
        this.selectedFeatures = [];
        this.unrenderedFeatures = {};
        
        // Allow for custom layer behavior
        if(this.strategies){
            for(var i=0, len=this.strategies.length; i<len; i++) {
                this.strategies[i].setLayer(this);
            }
        }

    },

    /**
     * APIMethod: destroy
     * Destroy this layer
     */
    destroy: function() {
        if (this.strategies) {
            var strategy, i, len;
            for(i=0, len=this.strategies.length; i<len; i++) {
                strategy = this.strategies[i];
                if(strategy.autoDestroy) {
                    strategy.destroy();
                }
            }
            this.strategies = null;
        }
        if (this.protocol) {
            if(this.protocol.autoDestroy) {
                this.protocol.destroy();
            }
            this.protocol = null;
        }
        this.destroyFeatures();
        this.features = null;
        this.selectedFeatures = null;
        this.unrenderedFeatures = null;
        if (this.renderer) {
            this.renderer.destroy();
        }
        this.renderer = null;
        this.geometryType = null;
        this.drawn = null;
        OpenLayers.Layer.prototype.destroy.apply(this, arguments);  
    },

    /**
     * Method: clone
     * Create a clone of this layer.
     * 
     * Note: Features of the layer are also cloned.
     *
     * Returns:
     * {<OpenLayers.Layer.Vector>} An exact clone of this layer
     */
    clone: function (obj) {
        
        if (obj == null) {
            obj = new OpenLayers.Layer.Vector(this.name, this.getOptions());
        }

        //get all additions from superclasses
        obj = OpenLayers.Layer.prototype.clone.apply(this, [obj]);

        // copy/set any non-init, non-simple values here
        var features = this.features;
        var len = features.length;
        var clonedFeatures = new Array(len);
        for(var i=0; i<len; ++i) {
            clonedFeatures[i] = features[i].clone();
        }
        obj.features = clonedFeatures;

        return obj;
    },    
    
    /**
     * Method: refresh
     * Ask the layer to request features again and redraw them.  Triggers
     *     the refresh event if the layer is in range and visible.
     *
     * Parameters:
     * obj - {Object} Optional object with properties for any listener of
     *     the refresh event.
     */
    refresh: function(obj) {
        if(this.calculateInRange() && this.visibility) {
            this.events.triggerEvent("refresh", obj);
        }
    },

    /** 
     * Method: assignRenderer
     * Iterates through the available renderer implementations and selects 
     * and assigns the first one whose "supported()" function returns true.
     */    
    assignRenderer: function()  {
        for (var i=0, len=this.renderers.length; i<len; i++) {
            var rendererClass = this.renderers[i];
            var renderer = (typeof rendererClass == "function") ?
                rendererClass :
                OpenLayers.Renderer[rendererClass];
            if (renderer && renderer.prototype.supported()) {
                this.renderer = new renderer(this.div, this.rendererOptions);
                break;
            }  
        }  
    },

    /** 
     * Method: displayError 
     * Let the user know their browser isn't supported.
     */
    displayError: function() {
        if (this.reportError) {
            OpenLayers.Console.userError(OpenLayers.i18n("browserNotSupported", 
                                     {renderers: this. renderers.join('\n')}));
        }    
    },

    /** 
     * Method: setMap
     * The layer has been added to the map. 
     * 
     * If there is no renderer set, the layer can't be used. Remove it.
     * Otherwise, give the renderer a reference to the map and set its size.
     * 
     * Parameters:
     * map - {<OpenLayers.Map>} 
     */
    setMap: function(map) {        
        OpenLayers.Layer.prototype.setMap.apply(this, arguments);

        if (!this.renderer) {
            this.map.removeLayer(this);
        } else {
            this.renderer.map = this.map;

            var newSize = this.map.getSize();
            newSize.w = newSize.w * this.ratio;
            newSize.h = newSize.h * this.ratio;
            this.renderer.setSize(newSize);
        }
    },

    /**
     * Method: afterAdd
     * Called at the end of the map.addLayer sequence.  At this point, the map
     *     will have a base layer.  Any autoActivate strategies will be
     *     activated here.
     */
    afterAdd: function() {
        if(this.strategies) {
            var strategy, i, len;
            for(i=0, len=this.strategies.length; i<len; i++) {
                strategy = this.strategies[i];
                if(strategy.autoActivate) {
                    strategy.activate();
                }
            }
        }
    },

    /**
     * Method: removeMap
     * The layer has been removed from the map.
     *
     * Parameters:
     * map - {<OpenLayers.Map>}
     */
    removeMap: function(map) {
        this.drawn = false;
        if(this.strategies) {
            var strategy, i, len;
            for(i=0, len=this.strategies.length; i<len; i++) {
                strategy = this.strategies[i];
                if(strategy.autoActivate) {
                    strategy.deactivate();
                }
            }
        }
    },
    
    /**
     * Method: onMapResize
     * Notify the renderer of the change in size. 
     * 
     */
    onMapResize: function() {
        OpenLayers.Layer.prototype.onMapResize.apply(this, arguments);
        
        var newSize = this.map.getSize();
        newSize.w = newSize.w * this.ratio;
        newSize.h = newSize.h * this.ratio;
        this.renderer.setSize(newSize);
    },

    /**
     * Method: moveTo
     *  Reset the vector layer's div so that it once again is lined up with 
     *   the map. Notify the renderer of the change of extent, and in the
     *   case of a change of zoom level (resolution), have the 
     *   renderer redraw features.
     * 
     *  If the layer has not yet been drawn, cycle through the layer's 
     *   features and draw each one.
     * 
     * Parameters:
     * bounds - {<OpenLayers.Bounds>} 
     * zoomChanged - {Boolean} 
     * dragging - {Boolean} 
     */
    moveTo: function(bounds, zoomChanged, dragging) {
        OpenLayers.Layer.prototype.moveTo.apply(this, arguments);
        
        var coordSysUnchanged = true;
        if (!dragging) {
            this.renderer.root.style.visibility = 'hidden';

            var viewSize = this.map.getSize(),
                viewWidth = viewSize.w,
                viewHeight = viewSize.h,
                offsetLeft = (viewWidth / 2 * this.ratio) - viewWidth / 2,
                offsetTop = (viewHeight / 2 * this.ratio) - viewHeight / 2;
            offsetLeft += parseInt(this.map.layerContainerDiv.style.left, 10);
            offsetLeft = -Math.round(offsetLeft);
            offsetTop += parseInt(this.map.layerContainerDiv.style.top, 10);
            offsetTop = -Math.round(offsetTop);

            this.div.style.left = offsetLeft + 'px';
            this.div.style.top = offsetTop + 'px';

            var extent = this.map.getExtent().scale(this.ratio);
            coordSysUnchanged = this.renderer.setExtent(extent, zoomChanged);

            this.renderer.root.style.visibility = 'visible';

            // Force a reflow on gecko based browsers to prevent jump/flicker.
            // This seems to happen on only certain configurations; it was originally
            // noticed in FF 2.0 and Linux.
            if (OpenLayers.IS_GECKO === true) {
                this.div.scrollLeft = this.div.scrollLeft;
            }
            
            if (!zoomChanged && coordSysUnchanged) {
                for (var i in this.unrenderedFeatures) {
                    var feature = this.unrenderedFeatures[i];
                    this.drawFeature(feature);
                }
            }
        }
        if (!this.drawn || zoomChanged || !coordSysUnchanged) {
            this.drawn = true;
            var feature;
            for(var i=0, len=this.features.length; i<len; i++) {
                this.renderer.locked = (i !== (len - 1));
                feature = this.features[i];
                this.drawFeature(feature);
            }
        }    
    },
    
    /** 
     * APIMethod: display
     * Hide or show the Layer
     * 
     * Parameters:
     * display - {Boolean}
     */
    display: function(display) {
        OpenLayers.Layer.prototype.display.apply(this, arguments);
        // we need to set the display style of the root in case it is attached
        // to a foreign layer
        var currentDisplay = this.div.style.display;
        if(currentDisplay != this.renderer.root.style.display) {
            this.renderer.root.style.display = currentDisplay;
        }
    },

    /**
     * APIMethod: addFeatures
     * Add Features to the layer.
     *
     * Parameters:
     * features - {Array(<OpenLayers.Feature.Vector>)} 
     * options - {Object}
     */
    addFeatures: function(features, options) {
        if (!(OpenLayers.Util.isArray(features))) {
            features = [features];
        }
        
        var notify = !options || !options.silent;
        if(notify) {
            var event = {features: features};
            var ret = this.events.triggerEvent("beforefeaturesadded", event);
            if(ret === false) {
                return;
            }
            features = event.features;
        }
        
        // Track successfully added features for featuresadded event, since
        // beforefeatureadded can veto single features.
        var featuresAdded = [];
        for (var i=0, len=features.length; i<len; i++) {
            if (i != (features.length - 1)) {
                this.renderer.locked = true;
            } else {
                this.renderer.locked = false;
            }    
            var feature = features[i];
            
            if (this.geometryType &&
              !(feature.geometry instanceof this.geometryType)) {
                throw new TypeError('addFeatures: component should be an ' +
                                    this.geometryType.prototype.CLASS_NAME);
              }

            //give feature reference to its layer
            feature.layer = this;

            if (!feature.style && this.style) {
                feature.style = OpenLayers.Util.extend({}, this.style);
            }

            if (notify) {
                if(this.events.triggerEvent("beforefeatureadded",
                                            {feature: feature}) === false) {
                    continue;
                }
                this.preFeatureInsert(feature);
            }

            featuresAdded.push(feature);
            this.features.push(feature);
            this.drawFeature(feature);
            
            if (notify) {
                this.events.triggerEvent("featureadded", {
                    feature: feature
                });
                this.onFeatureInsert(feature);
            }
        }
        
        if(notify) {
            this.events.triggerEvent("featuresadded", {features: featuresAdded});
        }
    },


    /**
     * APIMethod: removeFeatures
     * Remove features from the layer.  This erases any drawn features and
     *     removes them from the layer's control.  The beforefeatureremoved
     *     and featureremoved events will be triggered for each feature.  The
     *     featuresremoved event will be triggered after all features have
     *     been removed.  To supress event triggering, use the silent option.
     * 
     * Parameters:
     * features - {Array(<OpenLayers.Feature.Vector>)} List of features to be
     *     removed.
     * options - {Object} Optional properties for changing behavior of the
     *     removal.
     *
     * Valid options:
     * silent - {Boolean} Supress event triggering.  Default is false.
     */
    removeFeatures: function(features, options) {
        if(!features || features.length === 0) {
            return;
        }
        if (features === this.features) {
            return this.removeAllFeatures(options);
        }
        if (!(OpenLayers.Util.isArray(features))) {
            features = [features];
        }
        if (features === this.selectedFeatures) {
            features = features.slice();
        }

        var notify = !options || !options.silent;
        
        if (notify) {
            this.events.triggerEvent(
                "beforefeaturesremoved", {features: features}
            );
        }

        for (var i = features.length - 1; i >= 0; i--) {
            // We remain locked so long as we're not at 0
            // and the 'next' feature has a geometry. We do the geometry check
            // because if all the features after the current one are 'null', we
            // won't call eraseGeometry, so we break the 'renderer functions
            // will always be called with locked=false *last*' rule. The end result
            // is a possible gratiutious unlocking to save a loop through the rest 
            // of the list checking the remaining features every time. So long as
            // null geoms are rare, this is probably okay.    
            if (i != 0 && features[i-1].geometry) {
                this.renderer.locked = true;
            } else {
                this.renderer.locked = false;
            }
    
            var feature = features[i];
            delete this.unrenderedFeatures[feature.id];

            if (notify) {
                this.events.triggerEvent("beforefeatureremoved", {
                    feature: feature
                });
            }

            this.features = OpenLayers.Util.removeItem(this.features, feature);
            // feature has no layer at this point
            feature.layer = null;

            if (feature.geometry) {
                this.renderer.eraseFeatures(feature);
            }
                    
            //in the case that this feature is one of the selected features, 
            // remove it from that array as well.
            if (OpenLayers.Util.indexOf(this.selectedFeatures, feature) != -1){
                OpenLayers.Util.removeItem(this.selectedFeatures, feature);
            }

            if (notify) {
                this.events.triggerEvent("featureremoved", {
                    feature: feature
                });
            }
        }

        if (notify) {
            this.events.triggerEvent("featuresremoved", {features: features});
        }
    },
    
    /** 
     * APIMethod: removeAllFeatures
     * Remove all features from the layer.
     *
     * Parameters:
     * options - {Object} Optional properties for changing behavior of the
     *     removal.
     *
     * Valid options:
     * silent - {Boolean} Supress event triggering.  Default is false.
     */
    removeAllFeatures: function(options) {
        var notify = !options || !options.silent;
        var features = this.features;
        if (notify) {
            this.events.triggerEvent(
                "beforefeaturesremoved", {features: features}
            );
        }
        var feature;
        for (var i = features.length-1; i >= 0; i--) {
            feature = features[i];
            if (notify) {
                this.events.triggerEvent("beforefeatureremoved", {
                    feature: feature
                });
            }
            feature.layer = null;
            if (notify) {
                this.events.triggerEvent("featureremoved", {
                    feature: feature
                });
            }
        }
        this.renderer.clear();
        this.features = [];
        this.unrenderedFeatures = {};
        this.selectedFeatures = [];
        if (notify) {
            this.events.triggerEvent("featuresremoved", {features: features});
        }
    },

    /**
     * APIMethod: destroyFeatures
     * Erase and destroy features on the layer.
     *
     * Parameters:
     * features - {Array(<OpenLayers.Feature.Vector>)} An optional array of
     *     features to destroy.  If not supplied, all features on the layer
     *     will be destroyed.
     * options - {Object}
     */
    destroyFeatures: function(features, options) {
        var all = (features == undefined); // evaluates to true if
                                           // features is null
        if(all) {
            features = this.features;
        }
        if(features) {
            this.removeFeatures(features, options);
            for(var i=features.length-1; i>=0; i--) {
                features[i].destroy();
            }
        }
    },

    /**
     * APIMethod: drawFeature
     * Draw (or redraw) a feature on the layer.  If the optional style argument
     * is included, this style will be used.  If no style is included, the
     * feature's style will be used.  If the feature doesn't have a style,
     * the layer's style will be used.
     * 
     * This function is not designed to be used when adding features to 
     * the layer (use addFeatures instead). It is meant to be used when
     * the style of a feature has changed, or in some other way needs to 
     * visually updated *after* it has already been added to a layer. You
     * must add the feature to the layer for most layer-related events to 
     * happen.
     *
     * Parameters: 
     * feature - {<OpenLayers.Feature.Vector>} 
     * style - {String | Object} Named render intent or full symbolizer object.
     */
    drawFeature: function(feature, style) {
        // don't try to draw the feature with the renderer if the layer is not 
        // drawn itself
        if (!this.drawn) {
            return;
        }
        if (typeof style != "object") {
            if(!style && feature.state === OpenLayers.State.DELETE) {
                style = "delete";
            }
            var renderIntent = style || feature.renderIntent;
            style = feature.style || this.style;
            if (!style) {
                style = this.styleMap.createSymbolizer(feature, renderIntent);
            }
        }
        
        var drawn = this.renderer.drawFeature(feature, style);
        //TODO remove the check for null when we get rid of Renderer.SVG
        if (drawn === false || drawn === null) {
            this.unrenderedFeatures[feature.id] = feature;
        } else {
            delete this.unrenderedFeatures[feature.id];
        }
    },
    
    /**
     * Method: eraseFeatures
     * Erase features from the layer.
     *
     * Parameters:
     * features - {Array(<OpenLayers.Feature.Vector>)} 
     */
    eraseFeatures: function(features) {
        this.renderer.eraseFeatures(features);
    },

    /**
     * Method: getFeatureFromEvent
     * Given an event, return a feature if the event occurred over one.
     * Otherwise, return null.
     *
     * Parameters:
     * evt - {Event} 
     *
     * Returns:
     * {<OpenLayers.Feature.Vector>} A feature if one was under the event.
     */
    getFeatureFromEvent: function(evt) {
        if (!this.renderer) {
            throw new Error('getFeatureFromEvent called on layer with no ' +
                            'renderer. This usually means you destroyed a ' +
                            'layer, but not some handler which is associated ' +
                            'with it.');
        }
        var feature = null;
        var featureId = this.renderer.getFeatureIdFromEvent(evt);
        if (featureId) {
            if (typeof featureId === "string") {
                feature = this.getFeatureById(featureId);
            } else {
                feature = featureId;
            }
        }
        return feature;
    },

    /**
     * APIMethod: getFeatureBy
     * Given a property value, return the feature if it exists in the features array
     *
     * Parameters:
     * property - {String}
     * value - {String}
     *
     * Returns:
     * {<OpenLayers.Feature.Vector>} A feature corresponding to the given
     * property value or null if there is no such feature.
     */
    getFeatureBy: function(property, value) {
        //TBD - would it be more efficient to use a hash for this.features?
        var feature = null;
        for(var i=0, len=this.features.length; i<len; ++i) {
            if(this.features[i][property] == value) {
                feature = this.features[i];
                break;
            }
        }
        return feature;
    },

    /**
     * APIMethod: getFeatureById
     * Given a feature id, return the feature if it exists in the features array
     *
     * Parameters:
     * featureId - {String}
     *
     * Returns:
     * {<OpenLayers.Feature.Vector>} A feature corresponding to the given
     * featureId or null if there is no such feature.
     */
    getFeatureById: function(featureId) {
        return this.getFeatureBy('id', featureId);
    },

    /**
     * APIMethod: getFeatureByFid
     * Given a feature fid, return the feature if it exists in the features array
     *
     * Parameters:
     * featureFid - {String}
     *
     * Returns:
     * {<OpenLayers.Feature.Vector>} A feature corresponding to the given
     * featureFid or null if there is no such feature.
     */
    getFeatureByFid: function(featureFid) {
        return this.getFeatureBy('fid', featureFid);
    },
    
    /**
     * APIMethod: getFeaturesByAttribute
     * Returns an array of features that have the given attribute key set to the
     * given value. Comparison of attribute values takes care of datatypes, e.g.
     * the string '1234' is not equal to the number 1234.
     *
     * Parameters:
     * attrName - {String}
     * attrValue - {Mixed}
     *
     * Returns:
     * Array({<OpenLayers.Feature.Vector>}) An array of features that have the 
     * passed named attribute set to the given value.
     */
    getFeaturesByAttribute: function(attrName, attrValue) {
        var i,
            feature,    
            len = this.features.length,
            foundFeatures = [];
        for(i = 0; i < len; i++) {            
            feature = this.features[i];
            if(feature && feature.attributes) {
                if (feature.attributes[attrName] === attrValue) {
                    foundFeatures.push(feature);
                }
            }
        }
        return foundFeatures;
    },

    /**
     * Unselect the selected features
     * i.e. clears the featureSelection array
     * change the style back
    clearSelection: function() {

       var vectorLayer = this.map.vectorLayer;
        for (var i = 0; i < this.map.featureSelection.length; i++) {
            var featureSelection = this.map.featureSelection[i];
            vectorLayer.drawFeature(featureSelection, vectorLayer.style);
        }
        this.map.featureSelection = [];
    },
     */


    /**
     * APIMethod: onFeatureInsert
     * method called after a feature is inserted.
     * Does nothing by default. Override this if you
     * need to do something on feature updates.
     *
     * Parameters: 
     * feature - {<OpenLayers.Feature.Vector>} 
     */
    onFeatureInsert: function(feature) {
    },
    
    /**
     * APIMethod: preFeatureInsert
     * method called before a feature is inserted.
     * Does nothing by default. Override this if you
     * need to do something when features are first added to the
     * layer, but before they are drawn, such as adjust the style.
     *
     * Parameters:
     * feature - {<OpenLayers.Feature.Vector>} 
     */
    preFeatureInsert: function(feature) {
    },

    /** 
     * APIMethod: getDataExtent
     * Calculates the max extent which includes all of the features.
     * 
     * Returns:
     * {<OpenLayers.Bounds>} or null if the layer has no features with
     * geometries.
     */
    getDataExtent: function () {
        var maxExtent = null;
        var features = this.features;
        if(features && (features.length > 0)) {
            var geometry = null;
            for(var i=0, len=features.length; i<len; i++) {
                geometry = features[i].geometry;
                if (geometry) {
                    if (maxExtent === null) {
                        maxExtent = new OpenLayers.Bounds();
                    }
                    maxExtent.extend(geometry.getBounds());
                }
            }
        }
        return maxExtent;
    },

    CLASS_NAME: "OpenLayers.Layer.Vector"
});
/* ======================================================================
    OpenLayers/Layer/XYZ.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Layer/Grid.js
 */

/** 
 * Class: OpenLayers.Layer.XYZ
 * The XYZ class is designed to make it easier for people who have tiles
 * arranged by a standard XYZ grid. 
 * 
 * Inherits from:
 *  - <OpenLayers.Layer.Grid>
 */
OpenLayers.Layer.XYZ = OpenLayers.Class(OpenLayers.Layer.Grid, {
    
    /**
     * APIProperty: isBaseLayer
     * Default is true, as this is designed to be a base tile source. 
     */
    isBaseLayer: true,
    
    /**
     * APIProperty: sphericalMecator
     * Whether the tile extents should be set to the defaults for 
     *    spherical mercator. Useful for things like OpenStreetMap.
     *    Default is false, except for the OSM subclass.
     */
    sphericalMercator: false,

    /**
     * APIProperty: zoomOffset
     * {Number} If your cache has more zoom levels than you want to provide
     *     access to with this layer, supply a zoomOffset.  This zoom offset
     *     is added to the current map zoom level to determine the level
     *     for a requested tile.  For example, if you supply a zoomOffset
     *     of 3, when the map is at the zoom 0, tiles will be requested from
     *     level 3 of your cache.  Default is 0 (assumes cache level and map
     *     zoom are equivalent).  Using <zoomOffset> is an alternative to
     *     setting <serverResolutions> if you only want to expose a subset
     *     of the server resolutions.
     */
    zoomOffset: 0,
    
    /**
     * APIProperty: serverResolutions
     * {Array} A list of all resolutions available on the server.  Only set this
     *     property if the map resolutions differ from the server. This
     *     property serves two purposes. (a) <serverResolutions> can include
     *     resolutions that the server supports and that you don't want to
     *     provide with this layer; you can also look at <zoomOffset>, which is
     *     an alternative to <serverResolutions> for that specific purpose.
     *     (b) The map can work with resolutions that aren't supported by
     *     the server, i.e. that aren't in <serverResolutions>. When the
     *     map is displayed in such a resolution data for the closest
     *     server-supported resolution is loaded and the layer div is
     *     stretched as necessary.
     */
    serverResolutions: null,

    /**
     * Constructor: OpenLayers.Layer.XYZ
     *
     * Parameters:
     * name - {String}
     * url - {String}
     * options - {Object} Hashtable of extra options to tag onto the layer
     */
    initialize: function(name, url, options) {
        if (options && options.sphericalMercator || this.sphericalMercator) {
            options = OpenLayers.Util.extend({
                projection: "EPSG:900913",
                numZoomLevels: 19
            }, options);
        }
        OpenLayers.Layer.Grid.prototype.initialize.apply(this, [
            name || this.name, url || this.url, {}, options
        ]);
    },
    
    /**
     * APIMethod: clone
     * Create a clone of this layer
     *
     * Parameters:
     * obj - {Object} Is this ever used?
     * 
     * Returns:
     * {<OpenLayers.Layer.XYZ>} An exact clone of this OpenLayers.Layer.XYZ
     */
    clone: function (obj) {
        
        if (obj == null) {
            obj = new OpenLayers.Layer.XYZ(this.name,
                                            this.url,
                                            this.getOptions());
        }

        //get all additions from superclasses
        obj = OpenLayers.Layer.Grid.prototype.clone.apply(this, [obj]);

        return obj;
    },    

    /**
     * Method: getURL
     *
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     *
     * Returns:
     * {String} A string with the layer's url and parameters and also the
     *          passed-in bounds and appropriate tile size specified as
     *          parameters
     */
    getURL: function (bounds) {
        var xyz = this.getXYZ(bounds);
        var url = this.url;
        if (OpenLayers.Util.isArray(url)) {
            var s = '' + xyz.x + xyz.y + xyz.z;
            url = this.selectUrl(s, url);
        }
        
        return OpenLayers.String.format(url, xyz);
    },
    
    /**
     * Method: getXYZ
     * Calculates x, y and z for the given bounds.
     *
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     *
     * Returns:
     * {Object} - an object with x, y and z properties.
     */
    getXYZ: function(bounds) {
        var res = this.getServerResolution();
        var x = Math.round((bounds.left - this.maxExtent.left) /
            (res * this.tileSize.w));
        var y = Math.round((this.maxExtent.top - bounds.top) /
            (res * this.tileSize.h));
        var z = this.getServerZoom();

        if (this.wrapDateLine) {
            var limit = Math.pow(2, z);
            x = ((x % limit) + limit) % limit;
        }

        return {'x': x, 'y': y, 'z': z};
    },
    
    /* APIMethod: setMap
     * When the layer is added to a map, then we can fetch our origin 
     *    (if we don't have one.) 
     * 
     * Parameters:
     * map - {<OpenLayers.Map>}
     */
    setMap: function(map) {
        OpenLayers.Layer.Grid.prototype.setMap.apply(this, arguments);
        if (!this.tileOrigin) { 
            this.tileOrigin = new OpenLayers.LonLat(this.maxExtent.left,
                                                this.maxExtent.bottom);
        }                                       
    },

    CLASS_NAME: "OpenLayers.Layer.XYZ"
});
/* ======================================================================
    OpenLayers/Handler/Keyboard.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Handler.js
 * @requires OpenLayers/Events.js
 */

/**
 * Class: OpenLayers.handler.Keyboard
 * A handler for keyboard events.  Create a new instance with the
 *     <OpenLayers.Handler.Keyboard> constructor.
 * 
 * Inherits from:
 *  - <OpenLayers.Handler> 
 */
OpenLayers.Handler.Keyboard = OpenLayers.Class(OpenLayers.Handler, {

    /* http://www.quirksmode.org/js/keys.html explains key x-browser
        key handling quirks in pretty nice detail */

    /** 
     * Constant: KEY_EVENTS
     * keydown, keypress, keyup
     */
    KEY_EVENTS: ["keydown", "keyup"],

    /** 
    * Property: eventListener
    * {Function}
    */
    eventListener: null,

    /**
     * Property: observeElement
     * {DOMElement|String} The DOM element on which we listen for
     *     key events. Default to the document.
     */
    observeElement: null,

    /**
     * Constructor: OpenLayers.Handler.Keyboard
     * Returns a new keyboard handler.
     * 
     * Parameters:
     * control - {<OpenLayers.Control>} The control that is making use of
     *     this handler.  If a handler is being used without a control, the
     *     handlers setMap method must be overridden to deal properly with
     *     the map.
     * callbacks - {Object} An object containing a single function to be
     *     called when the drag operation is finished. The callback should
     *     expect to recieve a single argument, the pixel location of the event.
     *     Callbacks for 'keydown', 'keypress', and 'keyup' are supported.
     * options - {Object} Optional object whose properties will be set on the
     *     handler.
     */
    initialize: function(control, callbacks, options) {
        OpenLayers.Handler.prototype.initialize.apply(this, arguments);
        // cache the bound event listener method so it can be unobserved later
        this.eventListener = OpenLayers.Function.bindAsEventListener(
            this.handleKeyEvent, this
        );
    },
    
    /**
     * Method: destroy
     */
    destroy: function() {
        this.deactivate();
        this.eventListener = null;
        OpenLayers.Handler.prototype.destroy.apply(this, arguments);
    },

    /**
     * Method: activate
     */
    activate: function() {
        if (OpenLayers.Handler.prototype.activate.apply(this, arguments)) {
            this.observeElement = this.observeElement || document;
            for (var i=0, len=this.KEY_EVENTS.length; i<len; i++) {
                OpenLayers.Event.observe(
                    this.observeElement, this.KEY_EVENTS[i], this.eventListener);
            }
            return true;
        } else {
            return false;
        }
    },

    /**
     * Method: deactivate
     */
    deactivate: function() {
        var deactivated = false;
        if (OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            for (var i=0, len=this.KEY_EVENTS.length; i<len; i++) {
                OpenLayers.Event.stopObserving(
                    this.observeElement, this.KEY_EVENTS[i], this.eventListener);
            }
            deactivated = true;
        }
        return deactivated;
    },

    /**
     * Method: handleKeyEvent 
     */
    handleKeyEvent: function (evt) {
        if (this.checkModifiers(evt)) {
            this.callback(evt.type, [evt]);
        }
    },

    CLASS_NAME: "OpenLayers.Handler.Keyboard"
});
/* ======================================================================
    OpenLayers/Control/KeyboardDefaults.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Control.js
 * @requires OpenLayers/Handler/Keyboard.js
 */

/**
 * Class: OpenLayers.Control.KeyboardDefaults
 * The KeyboardDefaults control adds panning and zooming functions, controlled
 * with the keyboard. By default arrow keys pan, +/- keys zoom & Page Up/Page
 * Down/Home/End scroll by three quarters of a page.
 * 
 * This control has no visible appearance.
 *
 * Inherits from:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.KeyboardDefaults = OpenLayers.Class(OpenLayers.Control, {

    /**
     * APIProperty: autoActivate
     * {Boolean} Activate the control when it is added to a map.  Default is
     *     true.
     */
    autoActivate: true,

    /**
     * APIProperty: slideFactor
     * Pixels to slide by.
     */
    slideFactor: 75,

    /**
     * APIProperty: observeElement
     * {DOMelement|String} The DOM element to handle keys for. You
     *     can use the map div here, to have the navigation keys
     *     work when the map div has the focus. If undefined the
     *     document is used.
     */
    observeElement: null,

    /**
     * Constructor: OpenLayers.Control.KeyboardDefaults
     */
        
    /**
     * Method: draw
     * Create handler.
     */
    draw: function() {
        var observeElement = this.observeElement || document;
        this.handler = new OpenLayers.Handler.Keyboard( this,
                {"keydown": this.defaultKeyPress},
                {observeElement: observeElement}
        );
    },
    
    /**
     * Method: defaultKeyPress
     * When handling the key event, we only use evt.keyCode. This holds 
     * some drawbacks, though we get around them below. When interpretting
     * the keycodes below (including the comments associated with them),
     * consult the URL below. For instance, the Safari browser returns
     * "IE keycodes", and so is supported by any keycode labeled "IE".
     * 
     * Very informative URL:
     *    http://unixpapa.com/js/key.html
     *
     * Parameters:
     * evt - {Event} 
     */
    defaultKeyPress: function (evt) {
        var size, handled = true;
        switch(evt.keyCode) {
            case OpenLayers.Event.KEY_LEFT:
                this.map.pan(-this.slideFactor, 0);
                break;
            case OpenLayers.Event.KEY_RIGHT: 
                this.map.pan(this.slideFactor, 0);
                break;
            case OpenLayers.Event.KEY_UP:
                this.map.pan(0, -this.slideFactor);
                break;
            case OpenLayers.Event.KEY_DOWN:
                this.map.pan(0, this.slideFactor);
                break;
            
            case 33: // Page Up. Same in all browsers.
                size = this.map.getSize();
                this.map.pan(0, -0.75*size.h);
                break;
            case 34: // Page Down. Same in all browsers.
                size = this.map.getSize();
                this.map.pan(0, 0.75*size.h);
                break; 
            case 35: // End. Same in all browsers.
                size = this.map.getSize();
                this.map.pan(0.75*size.w, 0);
                break; 
            case 36: // Home. Same in all browsers.
                size = this.map.getSize();
                this.map.pan(-0.75*size.w, 0);
                break; 

            case 43:  // +/= (ASCII), keypad + (ASCII, Opera)
            case 61:  // +/= (Mozilla, Opera, some ASCII)
            case 187: // +/= (IE)
            case 107: // keypad + (IE, Mozilla)
                this.map.zoomIn();
                break; 
            case 45:  // -/_ (ASCII, Opera), keypad - (ASCII, Opera)
            case 109: // -/_ (Mozilla), keypad - (Mozilla, IE)
            case 189: // -/_ (IE)
            case 95:  // -/_ (some ASCII)
                this.map.zoomOut();
                break; 
            default:
                handled = false;
        }
        if (handled) {
            // prevent browser default not to move the page
            // when moving the page with the keyboard
            OpenLayers.Event.stop(evt);
        }
    },

    CLASS_NAME: "OpenLayers.Control.KeyboardDefaults"
});
/* ======================================================================
    OpenLayers/Layer/OSM.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Layer/XYZ.js
 */

/**
 * Class: OpenLayers.Layer.OSM
 * This layer allows accessing OpenStreetMap tiles. By default the OpenStreetMap
 *    hosted tile.openstreetmap.org Mapnik tileset is used. If you wish to use
 *    a different layer instead, you need to provide a different
 *    URL to the constructor. Here's an example for using OpenCycleMap:
 * 
 * (code)
 *     new OpenLayers.Layer.OSM("OpenCycleMap", 
 *       ["http://a.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png",
 *        "http://b.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png",
 *        "http://c.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png"]); 
 * (end)
 *
 * Inherits from:
 *  - <OpenLayers.Layer.XYZ>
 */
OpenLayers.Layer.OSM = OpenLayers.Class(OpenLayers.Layer.XYZ, {

    /**
     * APIProperty: name
     * {String} The layer name. Defaults to "OpenStreetMap" if the first
     * argument to the constructor is null or undefined.
     */
    name: "OpenStreetMap",

    /**
     * APIProperty: url
     * {String} The tileset URL scheme. Defaults to
     * : http://[a|b|c].tile.openstreetmap.org/${z}/${x}/${y}.png
     * (the official OSM tileset) if the second argument to the constructor
     * is null or undefined. To use another tileset you can have something
     * like this:
     * (code)
     *     new OpenLayers.Layer.OSM("OpenCycleMap", 
     *       ["http://a.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png",
     *        "http://b.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png",
     *        "http://c.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png"]); 
     * (end)
     */
    url: [
        'http://a.tile.openstreetmap.org/${z}/${x}/${y}.png',
        'http://b.tile.openstreetmap.org/${z}/${x}/${y}.png',
        'http://c.tile.openstreetmap.org/${z}/${x}/${y}.png'
    ],

    /**
     * Property: attribution
     * {String} The layer attribution.
     */
    attribution: "Data CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>",

    /**
     * Property: sphericalMercator
     * {Boolean}
     */
    sphericalMercator: true,

    /**
     * Property: wrapDateLine
     * {Boolean}
     */
    wrapDateLine: true,

    /** APIProperty: tileOptions
     *  {Object} optional configuration options for <OpenLayers.Tile> instances
     *  created by this Layer. Default is
     *
     *  (code)
     *  {crossOriginKeyword: 'anonymous'}
     *  (end)
     *
     *  When using OSM tilesets other than the default ones, it may be
     *  necessary to set this to
     *
     *  (code)
     *  {crossOriginKeyword: null}
     *  (end)
     *
     *  if the server does not send Access-Control-Allow-Origin headers.
     */
    tileOptions: null,

    /**
     * Constructor: OpenLayers.Layer.OSM
     *
     * Parameters:
     * name - {String} The layer name.
     * url - {String} The tileset URL scheme.
     * options - {Object} Configuration options for the layer. Any inherited
     *     layer option can be set in this object (e.g.
     *     <OpenLayers.Layer.Grid.buffer>).
     */
    initialize: function(name, url, options) {
        OpenLayers.Layer.XYZ.prototype.initialize.apply(this, arguments);
        this.tileOptions = OpenLayers.Util.extend({
            crossOriginKeyword: 'anonymous'
        }, this.options && this.options.tileOptions);
    },

    /**
     * Method: clone
     */
    clone: function(obj) {
        if (obj == null) {
            obj = new OpenLayers.Layer.OSM(
                this.name, this.url, this.getOptions());
        }
        obj = OpenLayers.Layer.XYZ.prototype.clone.apply(this, [obj]);
        return obj;
    },

    CLASS_NAME: "OpenLayers.Layer.OSM"
});
/* ======================================================================
    OpenLayers/Renderer/Canvas.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Renderer.js
 */

/**
 * Class: OpenLayers.Renderer.Canvas 
 * A renderer based on the 2D 'canvas' drawing element.
 * 
 * Inherits:
 *  - <OpenLayers.Renderer>
 */
OpenLayers.Renderer.Canvas = OpenLayers.Class(OpenLayers.Renderer, {
    
    /**
     * APIProperty: hitDetection
     * {Boolean} Allow for hit detection of features.  Default is true.
     */
    hitDetection: true,
    
    /**
     * Property: hitOverflow
     * {Number} The method for converting feature identifiers to color values
     *     supports 16777215 sequential values.  Two features cannot be 
     *     predictably detected if their identifiers differ by more than this
     *     value.  The hitOverflow allows for bigger numbers (but the 
     *     difference in values is still limited).
     */
    hitOverflow: 0,

    /**
     * Property: canvas
     * {Canvas} The canvas context object.
     */
    canvas: null, 
    
    /**
     * Property: features
     * {Object} Internal object of feature/style pairs for use in redrawing the layer.
     */
    features: null,
    
    /**
     * Property: pendingRedraw
     * {Boolean} The renderer needs a redraw call to render features added while
     *     the renderer was locked.
     */
    pendingRedraw: false,
    
    /**
     * Property: cachedSymbolBounds
     * {Object} Internal cache of calculated symbol extents.
     */
    cachedSymbolBounds: {},
    
    /**
     * Constructor: OpenLayers.Renderer.Canvas
     *
     * Parameters:
     * containerID - {<String>}
     * options - {Object} Optional properties to be set on the renderer.
     */
    initialize: function(containerID, options) {
        OpenLayers.Renderer.prototype.initialize.apply(this, arguments);
        this.root = document.createElement("canvas");
        this.container.appendChild(this.root);
        this.canvas = this.root.getContext("2d");
        this.features = {};
        if (this.hitDetection) {
            this.hitCanvas = document.createElement("canvas");
            this.hitContext = this.hitCanvas.getContext("2d");
        }
    },
    
    /**
     * Method: setExtent
     * Set the visible part of the layer.
     *
     * Parameters:
     * extent - {<OpenLayers.Bounds>}
     * resolutionChanged - {Boolean}
     *
     * Returns:
     * {Boolean} true to notify the layer that the new extent does not exceed
     *     the coordinate range, and the features will not need to be redrawn.
     *     False otherwise.
     */
    setExtent: function() {
        OpenLayers.Renderer.prototype.setExtent.apply(this, arguments);
        // always redraw features
        return false;
    },
    
    /** 
     * Method: eraseGeometry
     * Erase a geometry from the renderer. Because the Canvas renderer has
     *     'memory' of the features that it has drawn, we have to remove the
     *     feature so it doesn't redraw.   
     * 
     * Parameters:
     * geometry - {<OpenLayers.Geometry>}
     * featureId - {String}
     */
    eraseGeometry: function(geometry, featureId) {
        this.eraseFeatures(this.features[featureId][0]);
    },

    /**
     * APIMethod: supported
     * 
     * Returns:
     * {Boolean} Whether or not the browser supports the renderer class
     */
    supported: function() {
        return OpenLayers.CANVAS_SUPPORTED;
    },    
    
    /**
     * Method: setSize
     * Sets the size of the drawing surface.
     *
     * Once the size is updated, redraw the canvas.
     *
     * Parameters:
     * size - {<OpenLayers.Size>} 
     */
    setSize: function(size) {
        this.size = size.clone();
        var root = this.root;
        root.style.width = size.w + "px";
        root.style.height = size.h + "px";
        root.width = size.w;
        root.height = size.h;
        this.resolution = null;
        if (this.hitDetection) {
            var hitCanvas = this.hitCanvas;
            hitCanvas.style.width = size.w + "px";
            hitCanvas.style.height = size.h + "px";
            hitCanvas.width = size.w;
            hitCanvas.height = size.h;
        }
    },
    
    /**
     * Method: drawFeature
     * Draw the feature. Stores the feature in the features list,
     * then redraws the layer. 
     *
     * Parameters:
     * feature - {<OpenLayers.Feature.Vector>} 
     * style - {<Object>} 
     *
     * Returns:
     * {Boolean} The feature has been drawn completely.  If the feature has no
     *     geometry, undefined will be returned.  If the feature is not rendered
     *     for other reasons, false will be returned.
     */
    drawFeature: function(feature, style) {
        var rendered;
        if (feature.geometry) {
            style = this.applyDefaultSymbolizer(style || feature.style);
            // don't render if display none or feature outside extent
            var bounds = feature.geometry.getBounds();

            var worldBounds;
            if (this.map.baseLayer && this.map.baseLayer.wrapDateLine) {
                worldBounds = this.map.getMaxExtent();
            }

            var intersects = bounds && bounds.intersectsBounds(this.extent, {worldBounds: worldBounds});

            rendered = (style.display !== "none") && !!bounds && intersects;
            if (rendered) {
                // keep track of what we have rendered for redraw
                this.features[feature.id] = [feature, style];
            }
            else {
                // remove from features tracked for redraw
                delete(this.features[feature.id]);
            }
            this.pendingRedraw = true;
        }
        if (this.pendingRedraw && !this.locked) {
            this.redraw();
            this.pendingRedraw = false;
        }
        return rendered;
    },

    /** 
     * Method: drawGeometry
     * Used when looping (in redraw) over the features; draws
     * the canvas. 
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} 
     * style - {Object} 
     */
    drawGeometry: function(geometry, style, featureId) {
        var className = geometry.CLASS_NAME;
        if ((className == "OpenLayers.Geometry.Collection") ||
            (className == "OpenLayers.Geometry.MultiPoint") ||
            (className == "OpenLayers.Geometry.MultiLineString") ||
            (className == "OpenLayers.Geometry.MultiPolygon")) {
            for (var i = 0; i < geometry.components.length; i++) {
                this.drawGeometry(geometry.components[i], style, featureId);
            }
            return;
        } else if (className == "OpenLayers.Geometry.ProgressiveLineString") {
            var components = geometry.updateGeometries(this.extent,
                this.map.getZoomForResolution(this.resolution));
            // draw new nodes
            for (var i = 0, len=components.add.length; i<len; i++) {
                this.drawGeometry(components.add[i], style, featureId);
            }
            return;
        }

        switch (geometry.CLASS_NAME) {
            case "OpenLayers.Geometry.Point":
                this.drawPoint(geometry, style, featureId);
                break;
            case "OpenLayers.Geometry.LineString":
                this.drawLineString(geometry, style, featureId);
                break;
            case "OpenLayers.Geometry.LinearRing":
                this.drawLinearRing(geometry, style, featureId);
                break;
            case "OpenLayers.Geometry.Polygon":
                this.drawPolygon(geometry, style, featureId);
                break;
            default:
                break;
        }
    },

    /**
     * Method: drawExternalGraphic
     * Called to draw External graphics. 
     * 
     * Parameters: 
     * geometry - {<OpenLayers.Geometry>}
     * style    - {Object}
     * featureId - {String}
     */ 
    drawExternalGraphic: function(geometry, style, featureId) {
        var img = new Image();

        var title = style.title || style.graphicTitle;        
        if (title) {
            img.title = title;           
        }

        var width = style.graphicWidth || style.graphicHeight;
        var height = style.graphicHeight || style.graphicWidth;
        width = width ? width : style.pointRadius * 2;
        height = height ? height : style.pointRadius * 2;
        var xOffset = (style.graphicXOffset != undefined) ?
           style.graphicXOffset : -(0.5 * width);
        var yOffset = (style.graphicYOffset != undefined) ?
           style.graphicYOffset : -(0.5 * height);

        var opacity = style.graphicOpacity || style.fillOpacity;
        
        var onLoad = function() {
            if(!this.features[featureId]) {
                return;
            }
            var pt = this.getLocalXY(geometry);
            var p0 = pt[0];
            var p1 = pt[1];
            if(!isNaN(p0) && !isNaN(p1)) {
                var x = (p0 + xOffset) | 0;
                var y = (p1 + yOffset) | 0;
                var canvas = this.canvas;
                canvas.globalAlpha = opacity;
                var factor = OpenLayers.Renderer.Canvas.drawImageScaleFactor ||
                    (OpenLayers.Renderer.Canvas.drawImageScaleFactor =
                        /android 2.1/.test(navigator.userAgent.toLowerCase()) ?
                            // 320 is the screen width of the G1 phone, for
                            // which drawImage works out of the box.
                            320 / window.screen.width : 1
                    );
                canvas.drawImage(
                    img, x*factor, y*factor, width*factor, height*factor
                );
                if (this.hitDetection) {
                    this.setHitContextStyle("fill", featureId);
                    this.hitContext.fillRect(x, y, width, height);
                }
            }
        };

        img.onload = OpenLayers.Function.bind(onLoad, this);
        img.src = style.externalGraphic;
    },

    /**
     * Method: drawNamedSymbol
     * Called to draw Well Known Graphic Symbol Name. 
     * This method is only called by the renderer itself.
     * 
     * Parameters: 
     * geometry - {<OpenLayers.Geometry>}
     * style    - {Object}
     * featureId - {String}
     */ 
    drawNamedSymbol: function(geometry, style, featureId) {
        var x, y, cx, cy, i, symbolBounds, scaling, angle;
        var unscaledStrokeWidth;
        var deg2rad = Math.PI / 180.0;
        
        var symbol = OpenLayers.Renderer.symbol[style.graphicName];
         
        if (!symbol) {
            throw new Error(style.graphicName + ' is not a valid symbol name');
        }
        
        if (!symbol.length || symbol.length < 2) return;
        
        var pt = this.getLocalXY(geometry);
        var p0 = pt[0];
        var p1 = pt[1];
       
        if (isNaN(p0) || isNaN(p1)) return;
        
        // Use rounded line caps
        this.canvas.lineCap = "round";
        this.canvas.lineJoin = "round";
        
        if (this.hitDetection) {
            this.hitContext.lineCap = "round";
            this.hitContext.lineJoin = "round";
        }
        
        // Scale and rotate symbols, using precalculated bounds whenever possible.
        if (style.graphicName in this.cachedSymbolBounds) {
            symbolBounds = this.cachedSymbolBounds[style.graphicName];
        } else {
            symbolBounds = new OpenLayers.Bounds();
            for(i = 0; i < symbol.length; i+=2) {
                symbolBounds.extend(new OpenLayers.LonLat(symbol[i], symbol[i+1]));
            }
            this.cachedSymbolBounds[style.graphicName] = symbolBounds;
        }
        
        // Push symbol scaling, translation and rotation onto the transformation stack in reverse order.
        // Don't forget to apply all canvas transformations to the hitContext canvas as well(!)
        this.canvas.save();
        if (this.hitDetection) { this.hitContext.save(); }
        
        // Step 3: place symbol at the desired location
        this.canvas.translate(p0,p1);
        if (this.hitDetection) { this.hitContext.translate(p0,p1); }
        
        // Step 2a. rotate the symbol if necessary
        angle = deg2rad * style.rotation; // will be NaN when style.rotation is undefined.
        if (!isNaN(angle)) {
            this.canvas.rotate(angle);
            if (this.hitDetection) { this.hitContext.rotate(angle); }
        }
                
        // // Step 2: scale symbol such that pointRadius equals half the maximum symbol dimension.
        scaling = 2.0 * style.pointRadius / Math.max(symbolBounds.getWidth(), symbolBounds.getHeight());
        this.canvas.scale(scaling,scaling);
        if (this.hitDetection) { this.hitContext.scale(scaling,scaling); }
        
        // Step 1: center the symbol at the origin        
        cx = symbolBounds.getCenterLonLat().lon;
        cy = symbolBounds.getCenterLonLat().lat;
        this.canvas.translate(-cx,-cy);
        if (this.hitDetection) { this.hitContext.translate(-cx,-cy); }        

        // Don't forget to scale stroke widths, because they are affected by canvas scale transformations as well(!)
        // Alternative: scale symbol coordinates manually, so stroke width scaling is not needed anymore.
        unscaledStrokeWidth = style.strokeWidth;
        style.strokeWidth = unscaledStrokeWidth / scaling;
            
        if (style.fill !== false) {
            this.setCanvasStyle("fill", style);
            this.canvas.beginPath();
            for (i=0; i<symbol.length; i=i+2) {
                x = symbol[i];
                y = symbol[i+1];
                if (i == 0) this.canvas.moveTo(x,y);
                this.canvas.lineTo(x,y);
            }
            this.canvas.closePath();
            this.canvas.fill();

            if (this.hitDetection) {
                this.setHitContextStyle("fill", featureId, style);
                this.hitContext.beginPath();
                for (i=0; i<symbol.length; i=i+2) {
                    x = symbol[i];
                    y = symbol[i+1];
                    if (i == 0) this.canvas.moveTo(x,y);
                    this.hitContext.lineTo(x,y);
                }
                this.hitContext.closePath();
                this.hitContext.fill();
            }
        }  
        
        if (style.stroke !== false) {
            this.setCanvasStyle("stroke", style);
            this.canvas.beginPath();
            for (i=0; i<symbol.length; i=i+2) {
                x = symbol[i];
                y = symbol[i+1];
                if (i == 0) this.canvas.moveTo(x,y);
                this.canvas.lineTo(x,y);
            }
            this.canvas.closePath();
            this.canvas.stroke();
            
            
            if (this.hitDetection) {
                this.setHitContextStyle("stroke", featureId, style, scaling);
                this.hitContext.beginPath();
                for (i=0; i<symbol.length; i=i+2) {
                    x = symbol[i];
                    y = symbol[i+1];
                    if (i == 0) this.hitContext.moveTo(x,y);
                    this.hitContext.lineTo(x,y);
                }
                this.hitContext.closePath();
                this.hitContext.stroke();
            }
            
        }
        
        style.strokeWidth = unscaledStrokeWidth;
        this.canvas.restore();
        if (this.hitDetection) { this.hitContext.restore(); }
        this.setCanvasStyle("reset");  
    },

    /**
     * Method: setCanvasStyle
     * Prepare the canvas for drawing by setting various global settings.
     *
     * Parameters:
     * type - {String} one of 'stroke', 'fill', or 'reset'
     * style - {Object} Symbolizer hash
     */
    setCanvasStyle: function(type, style) {
        if (type === "fill") {     
            this.canvas.globalAlpha = style['fillOpacity'];
            this.canvas.fillStyle = style['fillColor'];
        } else if (type === "stroke") {  
            this.canvas.globalAlpha = style['strokeOpacity'];
            this.canvas.strokeStyle = style['strokeColor'];
            this.canvas.lineWidth = style['strokeWidth'];
        } else {
            this.canvas.globalAlpha = 0;
            this.canvas.lineWidth = 1;
        }
    },
    
    /**
     * Method: featureIdToHex
     * Convert a feature ID string into an RGB hex string.
     *
     * Parameters:
     * featureId - {String} Feature id
     *
     * Returns:
     * {String} RGB hex string.
     */
    featureIdToHex: function(featureId) {
        var id = Number(featureId.split("_").pop()) + 1; // zero for no feature
        if (id >= 16777216) {
            this.hitOverflow = id - 16777215;
            id = id % 16777216 + 1;
        }
        var hex = "000000" + id.toString(16);
        var len = hex.length;
        hex = "#" + hex.substring(len-6, len);
        return hex;
    },
    
    /**
     * Method: setHitContextStyle
     * Prepare the hit canvas for drawing by setting various global settings.
     *
     * Parameters:
     * type - {String} one of 'stroke', 'fill', or 'reset'
     * featureId - {String} The feature id.
     * symbolizer - {<OpenLayers.Symbolizer>} The symbolizer.
     */
    setHitContextStyle: function(type, featureId, symbolizer, strokeScaling) {
        var hex = this.featureIdToHex(featureId);
        if (type == "fill") {
            this.hitContext.globalAlpha = 1.0;
            this.hitContext.fillStyle = hex;
        } else if (type == "stroke") {  
            this.hitContext.globalAlpha = 1.0;
            this.hitContext.strokeStyle = hex;
            // bump up stroke width to deal with antialiasing. If strokeScaling is defined, we're rendering a symbol 
            // on a transformed canvas, so the antialias width bump has to scale as well.
            if (typeof strokeScaling === "undefined") {
                this.hitContext.lineWidth = symbolizer.strokeWidth + 2;
            } else {
                if (!isNaN(strokeScaling)) { this.hitContext.lineWidth = symbolizer.strokeWidth + 2.0 / strokeScaling; }
            }
        } else {
            this.hitContext.globalAlpha = 0;
            this.hitContext.lineWidth = 1;
        }
    },

    /**
     * Method: drawPoint
     * This method is only called by the renderer itself.
     * 
     * Parameters: 
     * geometry - {<OpenLayers.Geometry>}
     * style    - {Object}
     * featureId - {String}
     */ 
    drawPoint: function(geometry, style, featureId) {
        if(style.graphic !== false) {
            if(style.externalGraphic) {
                this.drawExternalGraphic(geometry, style, featureId);
            } else if (style.graphicName && (style.graphicName != "circle")) {
                this.drawNamedSymbol(geometry, style, featureId);
            } else {
                var pt = this.getLocalXY(geometry);
                var p0 = pt[0];
                var p1 = pt[1];
                if(!isNaN(p0) && !isNaN(p1)) {
                    var twoPi = Math.PI*2;
                    var radius = style.pointRadius;
                    if(style.fill !== false) {
                        this.setCanvasStyle("fill", style);
                        this.canvas.beginPath();
                        this.canvas.arc(p0, p1, radius, 0, twoPi, true);
                        this.canvas.fill();
                        if (this.hitDetection) {
                            this.setHitContextStyle("fill", featureId, style);
                            this.hitContext.beginPath();
                            this.hitContext.arc(p0, p1, radius, 0, twoPi, true);
                            this.hitContext.fill();
                        }
                    }

                    if(style.stroke !== false) {
                        this.setCanvasStyle("stroke", style);
                        this.canvas.beginPath();
                        this.canvas.arc(p0, p1, radius, 0, twoPi, true);
                        this.canvas.stroke();
                        if (this.hitDetection) {
                            this.setHitContextStyle("stroke", featureId, style);
                            this.hitContext.beginPath();
                            this.hitContext.arc(p0, p1, radius, 0, twoPi, true);
                            this.hitContext.stroke();
                        }
                        this.setCanvasStyle("reset");
                    }
                }
            }
        }
    },
    
    /**
     * Method: drawLineString
     * This method is only called by the renderer itself.
     * 
     * Parameters: 
     * geometry - {<OpenLayers.Geometry>}
     * style    - {Object}
     * featureId - {String}
     */ 
    drawLineString: function(geometry, style, featureId) {
        style = OpenLayers.Util.applyDefaults({fill: false}, style);
        this.drawLinearRing(geometry, style, featureId);
    },    
    
    /**
     * Method: drawLinearRing
     * This method is only called by the renderer itself.
     * 
     * Parameters: 
     * geometry - {<OpenLayers.Geometry>}
     * style    - {Object}
     * featureId - {String}
     */ 
    drawLinearRing: function(geometry, style, featureId) {
        if (style.fill !== false) {
            this.setCanvasStyle("fill", style);
            this.renderPath(this.canvas, geometry, style, featureId, "fill");
            if (this.hitDetection) {
                this.setHitContextStyle("fill", featureId, style);
                this.renderPath(this.hitContext, geometry, style, featureId, "fill");
            }
        }
        if (style.stroke !== false) {
            this.setCanvasStyle("stroke", style);
            this.renderPath(this.canvas, geometry, style, featureId, "stroke");
            if (this.hitDetection) {
                this.setHitContextStyle("stroke", featureId, style);
                this.renderPath(this.hitContext, geometry, style, featureId, "stroke");
            }
        }
        this.setCanvasStyle("reset");
    },
    
    /**
     * Method: renderPath
     * Render a path with stroke and optional fill.
     */
    renderPath: function(context, geometry, style, featureId, type) {
        var components = geometry.components;
        var len = components.length;
        context.beginPath();
        var start = this.getLocalXY(components[0]);
        var x = start[0];
        var y = start[1];
        if (!isNaN(x) && !isNaN(y)) {
            context.moveTo(start[0], start[1]);
            for (var i=1; i<len; ++i) {
                var pt = this.getLocalXY(components[i]);
                context.lineTo(pt[0], pt[1]);
            }
            if (type === "fill") {
                context.fill();
            } else {
                context.stroke();
            }
        }
    },
    
    /**
     * Method: drawPolygon
     * This method is only called by the renderer itself.
     * 
     * Parameters: 
     * geometry - {<OpenLayers.Geometry>}
     * style    - {Object}
     * featureId - {String}
     */ 
    drawPolygon: function(geometry, style, featureId) {
        var components = geometry.components;
        var len = components.length;
        this.drawLinearRing(components[0], style, featureId);
        // erase inner rings
        for (var i=1; i<len; ++i) {
            /** 
             * Note that this is overly agressive.  Here we punch holes through 
             * all previously rendered features on the same canvas.  A better 
             * solution for polygons with interior rings would be to draw the 
             * polygon on a sketch canvas first.  We could erase all holes 
             * there and then copy the drawing to the layer canvas. 
             * TODO: http://trac.osgeo.org/openlayers/ticket/3130 
             */
            this.canvas.globalCompositeOperation = "destination-out";
            if (this.hitDetection) {
                this.hitContext.globalCompositeOperation = "destination-out";
            }
            this.drawLinearRing(
                components[i], 
                OpenLayers.Util.applyDefaults({stroke: false, fillOpacity: 1.0}, style),
                featureId
            );
            this.canvas.globalCompositeOperation = "source-over";
            if (this.hitDetection) {
                this.hitContext.globalCompositeOperation = "source-over";
            }
            this.drawLinearRing(
                components[i], 
                OpenLayers.Util.applyDefaults({fill: false}, style),
                featureId
            );
        }
    },
    
    /**
     * Method: drawText
     * This method is only called by the renderer itself.
     *
     * Parameters:
     * location - {<OpenLayers.Point>}
     * style    - {Object}
     */
    drawText: function(location, style) {
        var pt = this.getLocalXY(location);

        this.setCanvasStyle("reset");
        this.canvas.fillStyle = style.fontColor;
        this.canvas.globalAlpha = style.fontOpacity || 1.0;
        var fontStyle = [style.fontStyle ? style.fontStyle : "normal",
                         "normal", // "font-variant" not supported
                         style.fontWeight ? style.fontWeight : "normal",
                         style.fontSize ? style.fontSize : "1em",
                         style.fontFamily ? style.fontFamily : "sans-serif"].join(" ");
        var labelRows = style.label.split('\n');
        var numRows = labelRows.length;
        if (this.canvas.fillText) {
            // HTML5
            this.canvas.font = fontStyle;
            this.canvas.textAlign =
                OpenLayers.Renderer.Canvas.LABEL_ALIGN[style.labelAlign[0]] ||
                "center";
            this.canvas.textBaseline =
                OpenLayers.Renderer.Canvas.LABEL_ALIGN[style.labelAlign[1]] ||
                "middle";
            var vfactor =
                OpenLayers.Renderer.Canvas.LABEL_FACTOR[style.labelAlign[1]];
            if (vfactor == null) {
                vfactor = -.5;
            }
            var lineHeight =
                this.canvas.measureText('Mg').height ||
                this.canvas.measureText('xx').width;
            pt[1] += lineHeight*vfactor*(numRows-1);
            for (var i = 0; i < numRows; i++) {
                if (style.labelOutlineWidth) {
                    this.canvas.save();
                    this.canvas.strokeStyle = style.labelOutlineColor;
                    this.canvas.lineWidth = style.labelOutlineWidth;
                    this.canvas.strokeText(labelRows[i], pt[0], pt[1] + (lineHeight*i) + 1);
                    this.canvas.restore();
                }
                this.canvas.fillText(labelRows[i], pt[0], pt[1] + (lineHeight*i));
            }
        } else if (this.canvas.mozDrawText) {
            // Mozilla pre-Gecko1.9.1 (<FF3.1)
            this.canvas.mozTextStyle = fontStyle;
            // No built-in text alignment, so we measure and adjust the position
            var hfactor =
                OpenLayers.Renderer.Canvas.LABEL_FACTOR[style.labelAlign[0]];
            if (hfactor == null) {
                hfactor = -.5;
            }
            var vfactor =
                OpenLayers.Renderer.Canvas.LABEL_FACTOR[style.labelAlign[1]];
            if (vfactor == null) {
                vfactor = -.5;
            }
            var lineHeight = this.canvas.mozMeasureText('xx');
            pt[1] += lineHeight*(1 + (vfactor*numRows));
            for (var i = 0; i < numRows; i++) {
                var x = pt[0] + (hfactor*this.canvas.mozMeasureText(labelRows[i]));
                var y = pt[1] + (i*lineHeight);
                this.canvas.translate(x, y);
                this.canvas.mozDrawText(labelRows[i]);
                this.canvas.translate(-x, -y);
            }
        }
        this.setCanvasStyle("reset");
    },
    
    /**
     * Method: getLocalXY
     * transform geographic xy into pixel xy
     *
     * Parameters: 
     * point - {<OpenLayers.Geometry.Point>}
     */
    getLocalXY: function(point) {
        var resolution = this.getResolution();
        var extent = this.extent;
        var x = ((point.x - this.featureDx) / resolution + (-extent.left / resolution));
        var y = ((extent.top / resolution) - point.y / resolution);
        return [x, y];
    },

    /**
     * Method: clear
     * Clear all vectors from the renderer.
     */    
    clear: function() {
        var height = this.root.height;
        var width = this.root.width;
        this.canvas.clearRect(0, 0, width, height);
        this.features = {};
        if (this.hitDetection) {
            this.hitContext.clearRect(0, 0, width, height);
        }
    },

    /**
     * Method: getFeatureIdFromEvent
     * Returns a feature id from an event on the renderer.  
     * 
     * Parameters:
     * evt - {<OpenLayers.Event>} 
     *
     * Returns:
     * {<OpenLayers.Feature.Vector} A feature or undefined.  This method returns a 
     *     feature instead of a feature id to avoid an unnecessary lookup on the
     *     layer.
     */
    getFeatureIdFromEvent: function(evt) {
        var featureId, feature;
        
        if (this.hitDetection && this.root.style.display !== "none") {
            // this dragging check should go in the feature handler
            if (!this.map.dragging) {
                var xy = evt.xy;
                var x = xy.x | 0;
                var y = xy.y | 0;
                var data = this.hitContext.getImageData(x, y, 1, 1).data;
                if (data[3] === 255) { // antialiased
                    var id = data[2] + (256 * (data[1] + (256 * data[0])));
                    if (id) {
                        featureId = "OpenLayers_Feature_Vector_" + (id - 1 + this.hitOverflow);
                        try {
                            feature = this.features[featureId][0];
                        } catch(err) {
                            // Because of antialiasing on the canvas, when the hit location is at a point where the edge of
                            // one symbol intersects the interior of another symbol, a wrong hit color (and therefore id) results.
                            // todo: set Antialiasing = 'off' on the hitContext as soon as browsers allow it.
                        }
                    }
                }
            }
        }
        return feature;
    },
    
    /**
     * Method: eraseFeatures 
     * This is called by the layer to erase features; removes the feature from
     *     the list, then redraws the layer.
     * 
     * Parameters:
     * features - {Array(<OpenLayers.Feature.Vector>)} 
     */
    eraseFeatures: function(features) {
        if(!(OpenLayers.Util.isArray(features))) {
            features = [features];
        }
        for(var i=0; i<features.length; ++i) {
            delete this.features[features[i].id];
        }
        this.redraw();
    },

    /**
     * Method: redraw
     * The real 'meat' of the function: any time things have changed,
     *     redraw() can be called to loop over all the data and (you guessed
     *     it) redraw it.  Unlike Elements-based Renderers, we can't interact
     *     with things once they're drawn, to remove them, for example, so
     *     instead we have to just clear everything and draw from scratch.
     */
    redraw: function() {
        if (!this.locked) {
            var height = this.root.height;
            var width = this.root.width;
            this.canvas.clearRect(0, 0, width, height);
            if (this.hitDetection) {
                this.hitContext.clearRect(0, 0, width, height);
            }
            var labelMap = [];
            var feature, geometry, style;
            var worldBounds = (this.map.baseLayer && this.map.baseLayer.wrapDateLine) && this.map.getMaxExtent();
            for (var id in this.features) {
                if (!this.features.hasOwnProperty(id)) { continue; }
                feature = this.features[id][0];
                geometry = feature.geometry;
                this.calculateFeatureDx(geometry.getBounds(), worldBounds);
                style = this.features[id][1];
                this.drawGeometry(geometry, style, feature.id);
                if(style.label) {
                    labelMap.push([feature, style]);
                }
            }
            var item;
            for (var i=0, len=labelMap.length; i<len; ++i) {
                item = labelMap[i];
                this.drawText(item[0].geometry.getCentroid(), item[1]);
            }
        }    
    },

    CLASS_NAME: "OpenLayers.Renderer.Canvas"
});

/**
 * Constant: OpenLayers.Renderer.Canvas.LABEL_ALIGN
 * {Object}
 */
OpenLayers.Renderer.Canvas.LABEL_ALIGN = {
    "l": "left",
    "r": "right",
    "t": "top",
    "b": "bottom"
};

/**
 * Constant: OpenLayers.Renderer.Canvas.LABEL_FACTOR
 * {Object}
 */
OpenLayers.Renderer.Canvas.LABEL_FACTOR = {
    "l": 0,
    "r": -1,
    "t": 0,
    "b": -1
};

/**
 * Constant: OpenLayers.Renderer.Canvas.drawImageScaleFactor
 * {Number} Scale factor to apply to the canvas drawImage arguments. This
 *     is always 1 except for Android 2.1 devices, to work around
 *     http://code.google.com/p/android/issues/detail?id=5141.
 */
OpenLayers.Renderer.Canvas.drawImageScaleFactor = null;
/* ======================================================================
    OpenLayers/Renderer/SVG.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Renderer/Elements.js
 */

/**
 * Class: OpenLayers.Renderer.SVG
 * 
 * Inherits:
 *  - <OpenLayers.Renderer.Elements>
 */
OpenLayers.Renderer.SVG = OpenLayers.Class(OpenLayers.Renderer.Elements, {

    /** 
     * Property: xmlns
     * {String}
     */
    xmlns: "http://www.w3.org/2000/svg",
    
    /**
     * Property: xlinkns
     * {String}
     */
    xlinkns: "http://www.w3.org/1999/xlink",

    /**
     * Constant: MAX_PIXEL
     * {Integer} Firefox has a limitation where values larger or smaller than  
     *           about 15000 in an SVG document lock the browser up. This 
     *           works around it.
     */
    MAX_PIXEL: 15000,

    /**
     * Property: translationParameters
     * {Object} Hash with "x" and "y" properties
     */
    translationParameters: null,
    
    /**
     * Property: symbolMetrics
     * {Object} Cache for symbol metrics according to their svg coordinate
     *     space. This is an object keyed by the symbol's id, and values are
     *     an array of [width, centerX, centerY].
     */
    symbolMetrics: null,
    
    /**
     * Constructor: OpenLayers.Renderer.SVG
     * 
     * Parameters:
     * containerID - {String}
     */
    initialize: function(containerID) {
        if (!this.supported()) { 
            return; 
        }
        OpenLayers.Renderer.Elements.prototype.initialize.apply(this, 
                                                                arguments);
        this.translationParameters = {x: 0, y: 0};
        
        this.symbolMetrics = {};
    },

    /**
     * APIMethod: supported
     * 
     * Returns:
     * {Boolean} Whether or not the browser supports the SVG renderer
     */
    supported: function() {
        var svgFeature = "http://www.w3.org/TR/SVG11/feature#";
        return (document.implementation && 
           (document.implementation.hasFeature("org.w3c.svg", "1.0") || 
            document.implementation.hasFeature(svgFeature + "SVG", "1.1") || 
            document.implementation.hasFeature(svgFeature + "BasicStructure", "1.1") ));
    },    

    /**
     * Method: inValidRange
     * See #669 for more information
     *
     * Parameters:
     * x      - {Integer}
     * y      - {Integer}
     * xyOnly - {Boolean} whether or not to just check for x and y, which means
     *     to not take the current translation parameters into account if true.
     * 
     * Returns:
     * {Boolean} Whether or not the 'x' and 'y' coordinates are in the  
     *           valid range.
     */ 
    inValidRange: function(x, y, xyOnly) {
        var left = x + (xyOnly ? 0 : this.translationParameters.x);
        var top = y + (xyOnly ? 0 : this.translationParameters.y);
        return (left >= -this.MAX_PIXEL && left <= this.MAX_PIXEL &&
                top >= -this.MAX_PIXEL && top <= this.MAX_PIXEL);
    },

    /**
     * Method: setExtent
     * 
     * Parameters:
     * extent - {<OpenLayers.Bounds>}
     * resolutionChanged - {Boolean}
     * 
     * Returns:
     * {Boolean} true to notify the layer that the new extent does not exceed
     *     the coordinate range, and the features will not need to be redrawn.
     *     False otherwise.
     */
    setExtent: function(extent, resolutionChanged) {
        var coordSysUnchanged = OpenLayers.Renderer.Elements.prototype.setExtent.apply(this, arguments);
        
        var resolution = this.getResolution(),
            left = -extent.left / resolution,
            top = extent.top / resolution;

        // If the resolution has changed, start over changing the corner, because
        // the features will redraw.
        if (resolutionChanged) {
            this.left = left;
            this.top = top;
            // Set the viewbox
            var extentString = "0 0 " + this.size.w + " " + this.size.h;

            this.rendererRoot.setAttributeNS(null, "viewBox", extentString);
            this.translate(this.xOffset, 0);
            return true;
        } else {
            var inRange = this.translate(left - this.left + this.xOffset, top - this.top);
            if (!inRange) {
                // recenter the coordinate system
                this.setExtent(extent, true);
            }
            return coordSysUnchanged && inRange;
        }
    },
    
    /**
     * Method: translate
     * Transforms the SVG coordinate system
     * 
     * Parameters:
     * x - {Float}
     * y - {Float}
     * 
     * Returns:
     * {Boolean} true if the translation parameters are in the valid coordinates
     *     range, false otherwise.
     */
    translate: function(x, y) {
        if (!this.inValidRange(x, y, true)) {
            return false;
        } else {
            var transformString = "";
            if (x || y) {
                transformString = "translate(" + x + "," + y + ")";
            }
            this.root.setAttributeNS(null, "transform", transformString);
            this.translationParameters = {x: x, y: y};
            return true;
        }
    },

    /**
     * Method: setSize
     * Sets the size of the drawing surface.
     * 
     * Parameters:
     * size - {<OpenLayers.Size>} The size of the drawing surface
     */
    setSize: function(size) {
        OpenLayers.Renderer.prototype.setSize.apply(this, arguments);
        
        this.rendererRoot.setAttributeNS(null, "width", this.size.w);
        this.rendererRoot.setAttributeNS(null, "height", this.size.h);
    },

    /** 
     * Method: getNodeType 
     * 
     * Parameters:
     * geometry - {<OpenLayers.Geometry>}
     * style - {Object}
     * 
     * Returns:
     * {String} The corresponding node type for the specified geometry
     */
    getNodeType: function(geometry, style) {
        var nodeType = null;
        switch (geometry.CLASS_NAME) {
            case "OpenLayers.Geometry.Point":
                if (style.externalGraphic) {
                    nodeType = "image";
                } else if (this.isComplexSymbol(style.graphicName)) {
                    nodeType = "svg";
                } else {
                    nodeType = "circle";
                }
                break;
            case "OpenLayers.Geometry.Rectangle":
                nodeType = "rect";
                break;
            case "OpenLayers.Geometry.LineString":
                nodeType = "polyline";
                break;
            case "OpenLayers.Geometry.LinearRing":
                nodeType = "polygon";
                break;
            case "OpenLayers.Geometry.Polygon":
            case "OpenLayers.Geometry.Curve":
                nodeType = "path";
                break;
            default:
                break;
        }
        return nodeType;
    },

    /** 
     * Method: setStyle
     * Use to set all the style attributes to a SVG node.
     * 
     * Takes care to adjust stroke width and point radius to be
     * resolution-relative
     *
     * Parameters:
     * node - {SVGDomElement} An SVG element to decorate
     * style - {Object}
     * options - {Object} Currently supported options include 
     *                              'isFilled' {Boolean} and
     *                              'isStroked' {Boolean}
     */
    setStyle: function(node, style, options) {
        style = style  || node._style;
        options = options || node._options;

        var title = style.title || style.graphicTitle;
        if (title) {
            node.setAttributeNS(null, "title", title);
            //Standards-conformant SVG
            // Prevent duplicate nodes. See issue https://github.com/openlayers/openlayers/issues/92 
            var titleNode = node.getElementsByTagName("title");
            if (titleNode.length > 0) {
                titleNode[0].firstChild.textContent = title;
            } else {
                var label = this.nodeFactory(null, "title");
                label.textContent = title;
                node.appendChild(label);
            }
        }

        var r = parseFloat(node.getAttributeNS(null, "r"));
        var widthFactor = 1;
        var pos;
        if (node._geometryClass == "OpenLayers.Geometry.Point" && r) {
            node.style.visibility = "";
            if (style.graphic === false) {
                node.style.visibility = "hidden";
            } else if (style.externalGraphic) {
                pos = this.getPosition(node);
                if (style.graphicWidth && style.graphicHeight) {
                  node.setAttributeNS(null, "preserveAspectRatio", "none");
                }
                var width = style.graphicWidth || style.graphicHeight;
                var height = style.graphicHeight || style.graphicWidth;
                width = width ? width : style.pointRadius*2;
                height = height ? height : style.pointRadius*2;
                var xOffset = (style.graphicXOffset != undefined) ?
                    style.graphicXOffset : -(0.5 * width);
                var yOffset = (style.graphicYOffset != undefined) ?
                    style.graphicYOffset : -(0.5 * height);

                var opacity = style.graphicOpacity || style.fillOpacity;
                
                node.setAttributeNS(null, "x", (pos.x + xOffset).toFixed());
                node.setAttributeNS(null, "y", (pos.y + yOffset).toFixed());
                node.setAttributeNS(null, "width", width);
                node.setAttributeNS(null, "height", height);
                node.setAttributeNS(this.xlinkns, "href", style.externalGraphic);
                node.setAttributeNS(null, "style", "opacity: "+opacity);
                node.onclick = OpenLayers.Renderer.SVG.preventDefault;
            } else if (this.isComplexSymbol(style.graphicName)) {
                // the symbol viewBox is three times as large as the symbol
                var offset = style.pointRadius * 3;
                var size = offset * 2;
                var src = this.importSymbol(style.graphicName);
                pos = this.getPosition(node);
                widthFactor = this.symbolMetrics[src.id][0] * 3 / size;
                
                // remove the node from the dom before we modify it. This
                // prevents various rendering issues in Safari and FF
                var parent = node.parentNode;
                var nextSibling = node.nextSibling;
                if(parent) {
                    parent.removeChild(node);
                }
                
                // The more appropriate way to implement this would be use/defs,
                // but due to various issues in several browsers, it is safer to
                // copy the symbols instead of referencing them. 
                // See e.g. ticket http://trac.osgeo.org/openlayers/ticket/2985 
                // and this email thread
                // http://osgeo-org.1803224.n2.nabble.com/Select-Control-Ctrl-click-on-Feature-with-a-graphicName-opens-new-browser-window-tc5846039.html
                node.firstChild && node.removeChild(node.firstChild);
                node.appendChild(src.firstChild.cloneNode(true));
                node.setAttributeNS(null, "viewBox", src.getAttributeNS(null, "viewBox"));
                
                node.setAttributeNS(null, "width", size);
                node.setAttributeNS(null, "height", size);
                node.setAttributeNS(null, "x", pos.x - offset);
                node.setAttributeNS(null, "y", pos.y - offset);
                
                // now that the node has all its new properties, insert it
                // back into the dom where it was
                if(nextSibling) {
                    parent.insertBefore(node, nextSibling);
                } else if(parent) {
                    parent.appendChild(node);
                }
            } else {
                node.setAttributeNS(null, "r", style.pointRadius);
            }

            var rotation = style.rotation;
            
            if ((rotation !== undefined || node._rotation !== undefined) && pos) {
                node._rotation = rotation;
                rotation |= 0;
                if (node.nodeName !== "svg") { 
                    node.setAttributeNS(null, "transform", 
                        "rotate(" + rotation + " " + pos.x + " " + 
                        pos.y + ")"); 
                } else {
                    var metrics = this.symbolMetrics[src.id];
                    node.firstChild.setAttributeNS(null, "transform", "rotate(" 
                        + rotation + " " 
                        + metrics[1] + " "
                        + metrics[2] + ")");
                }
            }
        }
        
        if (options.isFilled) {
            node.setAttributeNS(null, "fill", style.fillColor);
            node.setAttributeNS(null, "fill-opacity", style.fillOpacity);
        } else {
            node.setAttributeNS(null, "fill", "none");
        }

        if (options.isStroked) {
            node.setAttributeNS(null, "stroke", style.strokeColor);
            node.setAttributeNS(null, "stroke-opacity", style.strokeOpacity);
            node.setAttributeNS(null, "stroke-width", style.strokeWidth * widthFactor);
            node.setAttributeNS(null, "stroke-linecap", style.strokeLinecap || "round");
            // Hard-coded linejoin for now, to make it look the same as in VML.
            // There is no strokeLinejoin property yet for symbolizers.
            node.setAttributeNS(null, "stroke-linejoin", "round");
            style.strokeDashstyle && node.setAttributeNS(null,
                "stroke-dasharray", this.dashStyle(style, widthFactor));
        } else {
            node.setAttributeNS(null, "stroke", "none");
        }
        
        if (style.pointerEvents) {
            node.setAttributeNS(null, "pointer-events", style.pointerEvents);
        }
                
        if (style.cursor != null) {
            node.setAttributeNS(null, "cursor", style.cursor);
        }
        
        return node;
    },

    /** 
     * Method: dashStyle
     * 
     * Parameters:
     * style - {Object}
     * widthFactor - {Number}
     * 
     * Returns:
     * {String} A SVG compliant 'stroke-dasharray' value
     */
    dashStyle: function(style, widthFactor) {
        var w = style.strokeWidth * widthFactor;
        var str = style.strokeDashstyle;
        switch (str) {
            case 'solid':
                return 'none';
            case 'dot':
                return [1, 4 * w].join();
            case 'dash':
                return [4 * w, 4 * w].join();
            case 'dashdot':
                return [4 * w, 4 * w, 1, 4 * w].join();
            case 'longdash':
                return [8 * w, 4 * w].join();
            case 'longdashdot':
                return [8 * w, 4 * w, 1, 4 * w].join();
            default:
                return OpenLayers.String.trim(str).replace(/\s+/g, ",");
        }
    },
    
    /** 
     * Method: createNode
     * 
     * Parameters:
     * type - {String} Kind of node to draw
     * id - {String} Id for node
     * 
     * Returns:
     * {DOMElement} A new node of the given type and id
     */
    createNode: function(type, id) {
        var node = document.createElementNS(this.xmlns, type);
        if (id) {
            node.setAttributeNS(null, "id", id);
        }
        return node;    
    },
    
    /** 
     * Method: nodeTypeCompare
     * 
     * Parameters:
     * node - {SVGDomElement} An SVG element
     * type - {String} Kind of node
     * 
     * Returns:
     * {Boolean} Whether or not the specified node is of the specified type
     */
    nodeTypeCompare: function(node, type) {
        return (type == node.nodeName);
    },
   
    /**
     * Method: createRenderRoot
     * 
     * Returns:
     * {DOMElement} The specific render engine's root element
     */
    createRenderRoot: function() {
        var svg = this.nodeFactory(this.container.id + "_svgRoot", "svg");
        svg.style.display = "block";
        return svg;
    },

    /**
     * Method: createRoot
     * 
     * Parameters:
     * suffix - {String} suffix to append to the id
     * 
     * Returns:
     * {DOMElement}
     */
    createRoot: function(suffix) {
        return this.nodeFactory(this.container.id + suffix, "g");
    },

    /**
     * Method: createDefs
     *
     * Returns:
     * {DOMElement} The element to which we'll add the symbol definitions
     */
    createDefs: function() {
        var defs = this.nodeFactory(this.container.id + "_defs", "defs");
        this.rendererRoot.appendChild(defs);
        return defs;
    },

    /**************************************
     *                                    *
     *     GEOMETRY DRAWING FUNCTIONS     *
     *                                    *
     **************************************/

    /**
     * Method: drawPoint
     * This method is only called by the renderer itself.
     * 
     * Parameters: 
     * node - {DOMElement}
     * geometry - {<OpenLayers.Geometry>}
     * 
     * Returns:
     * {DOMElement} or false if the renderer could not draw the point
     */ 
    drawPoint: function(node, geometry) {
        return this.drawCircle(node, geometry, 1);
    },

    /**
     * Method: drawCircle
     * This method is only called by the renderer itself.
     * 
     * Parameters: 
     * node - {DOMElement}
     * geometry - {<OpenLayers.Geometry>}
     * radius - {Float}
     * 
     * Returns:
     * {DOMElement} or false if the renderer could not draw the circle
     */
    drawCircle: function(node, geometry, radius) {
        var resolution = this.getResolution();
        var x = ((geometry.x - this.featureDx) / resolution + this.left);
        var y = (this.top - geometry.y / resolution);

        if (this.inValidRange(x, y)) { 
            node.setAttributeNS(null, "cx", x);
            node.setAttributeNS(null, "cy", y);
            node.setAttributeNS(null, "r", radius);
            return node;
        } else {
            return false;
        }    
            
    },
    
    /**
     * Method: drawLineString
     * This method is only called by the renderer itself.
     * 
     * Parameters: 
     * node - {DOMElement}
     * geometry - {<OpenLayers.Geometry>}
     * 
     * Returns:
     * {DOMElement} or null if the renderer could not draw all components of
     *     the linestring, or false if nothing could be drawn
     */ 
    drawLineString: function(node, geometry) {
        var componentsResult = this.getComponentsString(geometry.components);
        if (componentsResult.path) {
            node.setAttributeNS(null, "points", componentsResult.path);
            return (componentsResult.complete ? node : null);  
        } else {
            return false;
        }
    },
    
    /**
     * Method: drawLinearRing
     * This method is only called by the renderer itself.
     * 
     * Parameters: 
     * node - {DOMElement}
     * geometry - {<OpenLayers.Geometry>}
     * 
     * Returns:
     * {DOMElement} or null if the renderer could not draw all components
     *     of the linear ring, or false if nothing could be drawn
     */ 
    drawLinearRing: function(node, geometry) {
        var componentsResult = this.getComponentsString(geometry.components);
        if (componentsResult.path) {
            node.setAttributeNS(null, "points", componentsResult.path);
            return (componentsResult.complete ? node : null);  
        } else {
            return false;
        }
    },
    
    /**
     * Method: drawPolygon
     * This method is only called by the renderer itself.
     * 
     * Parameters: 
     * node - {DOMElement}
     * geometry - {<OpenLayers.Geometry>}
     * 
     * Returns:
     * {DOMElement} or null if the renderer could not draw all components
     *     of the polygon, or false if nothing could be drawn
     */ 
    drawPolygon: function(node, geometry) {
        var d = "";
        var draw = true;
        var complete = true;
        var linearRingResult, path;
        for (var j=0, len=geometry.components.length; j<len; j++) {
            d += " M";
            linearRingResult = this.getComponentsString(
                geometry.components[j].components, " ");
            path = linearRingResult.path;
            if (path) {
                d += " " + path;
                complete = linearRingResult.complete && complete;
            } else {
                draw = false;
            }
        }
        d += " z";
        if (draw) {
            node.setAttributeNS(null, "d", d);
            node.setAttributeNS(null, "fill-rule", "evenodd");
            return complete ? node : null;
        } else {
            return false;
        }    
    },
    
    /**
     * Method: drawRectangle
     * This method is only called by the renderer itself.
     * 
     * Parameters: 
     * node - {DOMElement}
     * geometry - {<OpenLayers.Geometry>}
     * 
     * Returns:
     * {DOMElement} or false if the renderer could not draw the rectangle
     */ 
    drawRectangle: function(node, geometry) {
        var resolution = this.getResolution();
        var x = ((geometry.x - this.featureDx) / resolution + this.left);
        var y = (this.top - geometry.y / resolution);

        if (this.inValidRange(x, y)) { 
            node.setAttributeNS(null, "x", x);
            node.setAttributeNS(null, "y", y);
            node.setAttributeNS(null, "width", geometry.width / resolution);
            node.setAttributeNS(null, "height", geometry.height / resolution);
            return node;
        } else {
            return false;
        }
    },
    
    /**
     * Method: drawText
     * This method is only called by the renderer itself.
     *
     * Parameters:
     * featureId - {String}
     * style -
     * location - {<OpenLayers.Geometry.Point>}
     */
    drawText: function(featureId, style, location) {
        var drawOutline = (!!style.labelOutlineWidth);
        // First draw text in halo color and size and overlay the
        // normal text afterwards
        if (drawOutline) {
            var outlineStyle = OpenLayers.Util.extend({}, style);
            outlineStyle.fontColor = outlineStyle.labelOutlineColor;
            outlineStyle.fontStrokeColor = outlineStyle.labelOutlineColor;
            outlineStyle.fontStrokeWidth = style.labelOutlineWidth;
            delete outlineStyle.labelOutlineWidth;
            this.drawText(featureId, outlineStyle, location);
        }

        var resolution = this.getResolution();

        var x = ((location.x - this.featureDx) / resolution + this.left);
        var y = (location.y / resolution - this.top);

        var suffix = (drawOutline)?this.LABEL_OUTLINE_SUFFIX:this.LABEL_ID_SUFFIX;
        var label = this.nodeFactory(featureId + suffix, "text");

        label.setAttributeNS(null, "x", x);
        label.setAttributeNS(null, "y", -y);

        if (style.fontColor) {
            label.setAttributeNS(null, "fill", style.fontColor);
        }
        if (style.fontStrokeColor) {
            label.setAttributeNS(null, "stroke", style.fontStrokeColor);
        }
        if (style.fontStrokeWidth) {
            label.setAttributeNS(null, "stroke-width", style.fontStrokeWidth);
        }
        if (style.fontOpacity) {
            label.setAttributeNS(null, "opacity", style.fontOpacity);
        }
        if (style.fontFamily) {
            label.setAttributeNS(null, "font-family", style.fontFamily);
        }
        if (style.fontSize) {
            label.setAttributeNS(null, "font-size", style.fontSize);
        }
        if (style.fontWeight) {
            label.setAttributeNS(null, "font-weight", style.fontWeight);
        }
        if (style.fontStyle) {
            label.setAttributeNS(null, "font-style", style.fontStyle);
        }
        if (style.labelSelect === true) {
            label.setAttributeNS(null, "pointer-events", "visible");
            label._featureId = featureId;
        } else {
            label.setAttributeNS(null, "pointer-events", "none");
        }
        var align = style.labelAlign || OpenLayers.Renderer.defaultSymbolizer.labelAlign;
        label.setAttributeNS(null, "text-anchor",
            OpenLayers.Renderer.SVG.LABEL_ALIGN[align[0]] || "middle");

        if (OpenLayers.IS_GECKO === true) {
            label.setAttributeNS(null, "dominant-baseline",
                OpenLayers.Renderer.SVG.LABEL_ALIGN[align[1]] || "central");
        }

        var labelRows = style.label.split('\n');
        var numRows = labelRows.length;
        while (label.childNodes.length > numRows) {
            label.removeChild(label.lastChild);
        }
        for (var i = 0; i < numRows; i++) {
            var tspan = this.nodeFactory(featureId + suffix + "_tspan_" + i, "tspan");
            if (style.labelSelect === true) {
                tspan._featureId = featureId;
                tspan._geometry = location;
                tspan._geometryClass = location.CLASS_NAME;
            }
            if (OpenLayers.IS_GECKO === false) {
                tspan.setAttributeNS(null, "baseline-shift",
                    OpenLayers.Renderer.SVG.LABEL_VSHIFT[align[1]] || "-35%");
            }
            tspan.setAttribute("x", x);
            if (i == 0) {
                var vfactor = OpenLayers.Renderer.SVG.LABEL_VFACTOR[align[1]];
                if (vfactor == null) {
                     vfactor = -.5;
                }
                tspan.setAttribute("dy", (vfactor*(numRows-1)) + "em");
            } else {
                tspan.setAttribute("dy", "1em");
            }
            tspan.textContent = (labelRows[i] === '') ? ' ' : labelRows[i];
            if (!tspan.parentNode) {
                label.appendChild(tspan);
            }
        }

        if (!label.parentNode) {
            this.textRoot.appendChild(label);
        }
    },
    
    /** 
     * Method: getComponentString
     * 
     * Parameters:
     * components - {Array(<OpenLayers.Geometry.Point>)} Array of points
     * separator - {String} character between coordinate pairs. Defaults to ","
     * 
     * Returns:
     * {Object} hash with properties "path" (the string created from the
     *     components and "complete" (false if the renderer was unable to
     *     draw all components)
     */
    getComponentsString: function(components, separator) {
        var renderCmp = [];
        var complete = true;
        var len = components.length;
        var strings = [];
        var str, component;
        for(var i=0; i<len; i++) {
            component = components[i];
            renderCmp.push(component);
            str = this.getShortString(component);
            if (str) {
                strings.push(str);
            } else {
                // The current component is outside the valid range. Let's
                // see if the previous or next component is inside the range.
                // If so, add the coordinate of the intersection with the
                // valid range bounds.
                if (i > 0) {
                    if (this.getShortString(components[i - 1])) {
                        strings.push(this.clipLine(components[i],
                            components[i-1]));
                    }
                }
                if (i < len - 1) {
                    if (this.getShortString(components[i + 1])) {
                        strings.push(this.clipLine(components[i],
                            components[i+1]));
                    }
                }
                complete = false;
            }
        }

        return {
            path: strings.join(separator || ","),
            complete: complete
        };
    },
    
    /**
     * Method: clipLine
     * Given two points (one inside the valid range, and one outside),
     * clips the line betweeen the two points so that the new points are both
     * inside the valid range.
     * 
     * Parameters:
     * badComponent - {<OpenLayers.Geometry.Point>} original geometry of the
     *     invalid point
     * goodComponent - {<OpenLayers.Geometry.Point>} original geometry of the
     *     valid point
     * Returns
     * {String} the SVG coordinate pair of the clipped point (like
     *     getShortString), or an empty string if both passed componets are at
     *     the same point.
     */
    clipLine: function(badComponent, goodComponent) {
        if (goodComponent.equals(badComponent)) {
            return "";
        }
        var resolution = this.getResolution();
        var maxX = this.MAX_PIXEL - this.translationParameters.x;
        var maxY = this.MAX_PIXEL - this.translationParameters.y;
        var x1 = (goodComponent.x - this.featureDx) / resolution + this.left;
        var y1 = this.top - goodComponent.y / resolution;
        var x2 = (badComponent.x - this.featureDx) / resolution + this.left;
        var y2 = this.top - badComponent.y / resolution;
        var k;
        if (x2 < -maxX || x2 > maxX) {
            k = (y2 - y1) / (x2 - x1);
            x2 = x2 < 0 ? -maxX : maxX;
            y2 = y1 + (x2 - x1) * k;
        }
        if (y2 < -maxY || y2 > maxY) {
            k = (x2 - x1) / (y2 - y1);
            y2 = y2 < 0 ? -maxY : maxY;
            x2 = x1 + (y2 - y1) * k;
        }
        return x2 + "," + y2;
    },

    /** 
     * Method: getShortString
     * 
     * Parameters:
     * point - {<OpenLayers.Geometry.Point>}
     * 
     * Returns:
     * {String} or false if point is outside the valid range
     */
    getShortString: function(point) {
        var resolution = this.getResolution();
        var x = ((point.x - this.featureDx) / resolution + this.left);
        var y = (this.top - point.y / resolution);

        if (this.inValidRange(x, y)) { 
            return x + "," + y;
        } else {
            return false;
        }
    },
    
    /**
     * Method: getPosition
     * Finds the position of an svg node.
     * 
     * Parameters:
     * node - {DOMElement}
     * 
     * Returns:
     * {Object} hash with x and y properties, representing the coordinates
     *     within the svg coordinate system
     */
    getPosition: function(node) {
        return({
            x: parseFloat(node.getAttributeNS(null, "cx")),
            y: parseFloat(node.getAttributeNS(null, "cy"))
        });
    },

    /**
     * Method: importSymbol
     * add a new symbol definition from the rendererer's symbol hash
     * 
     * Parameters:
     * graphicName - {String} name of the symbol to import
     * 
     * Returns:
     * {DOMElement} - the imported symbol
     */      
    importSymbol: function (graphicName)  {
        if (!this.defs) {
            // create svg defs tag
            this.defs = this.createDefs();
        }
        var id = this.container.id + "-" + graphicName;
        
        // check if symbol already exists in the defs
        var existing = document.getElementById(id);
        if (existing != null) {
            return existing;
        }
        
        var symbol = OpenLayers.Renderer.symbol[graphicName];
        if (!symbol) {
            throw new Error(graphicName + ' is not a valid symbol name');
        }

        var symbolNode = this.nodeFactory(id, "symbol");
        var node = this.nodeFactory(null, "polygon");
        symbolNode.appendChild(node);
        var symbolExtent = new OpenLayers.Bounds(
                                    Number.MAX_VALUE, Number.MAX_VALUE, 0, 0);

        var points = [];
        var x,y;
        for (var i=0; i<symbol.length; i=i+2) {
            x = symbol[i];
            y = symbol[i+1];
            symbolExtent.left = Math.min(symbolExtent.left, x);
            symbolExtent.bottom = Math.min(symbolExtent.bottom, y);
            symbolExtent.right = Math.max(symbolExtent.right, x);
            symbolExtent.top = Math.max(symbolExtent.top, y);
            points.push(x, ",", y);
        }
        
        node.setAttributeNS(null, "points", points.join(" "));
        
        var width = symbolExtent.getWidth();
        var height = symbolExtent.getHeight();
        // create a viewBox three times as large as the symbol itself,
        // to allow for strokeWidth being displayed correctly at the corners.
        var viewBox = [symbolExtent.left - width,
                        symbolExtent.bottom - height, width * 3, height * 3];
        symbolNode.setAttributeNS(null, "viewBox", viewBox.join(" "));
        this.symbolMetrics[id] = [
            Math.max(width, height),
            symbolExtent.getCenterLonLat().lon,
            symbolExtent.getCenterLonLat().lat
        ];
        
        this.defs.appendChild(symbolNode);
        return symbolNode;
    },
    
    /**
     * Method: getFeatureIdFromEvent
     * 
     * Parameters:
     * evt - {Object} An <OpenLayers.Event> object
     *
     * Returns:
     * {String} A feature id or undefined.
     */
    getFeatureIdFromEvent: function(evt) {
        var featureId = OpenLayers.Renderer.Elements.prototype.getFeatureIdFromEvent.apply(this, arguments);
        if(!featureId) {
            var target = evt.target;
            featureId = target.parentNode && target != this.rendererRoot ?
                target.parentNode._featureId : undefined;
        }
        return featureId;
    },

    CLASS_NAME: "OpenLayers.Renderer.SVG"
});

/**
 * Constant: OpenLayers.Renderer.SVG.LABEL_ALIGN
 * {Object}
 */
OpenLayers.Renderer.SVG.LABEL_ALIGN = {
    "l": "start",
    "r": "end",
    "b": "bottom",
    "t": "hanging"
};

/**
 * Constant: OpenLayers.Renderer.SVG.LABEL_VSHIFT
 * {Object}
 */
OpenLayers.Renderer.SVG.LABEL_VSHIFT = {
    // according to
    // http://www.w3.org/Graphics/SVG/Test/20061213/htmlObjectHarness/full-text-align-02-b.html
    // a baseline-shift of -70% shifts the text exactly from the
    // bottom to the top of the baseline, so -35% moves the text to
    // the center of the baseline.
    "t": "-70%",
    "b": "0"    
};

/**
 * Constant: OpenLayers.Renderer.SVG.LABEL_VFACTOR
 * {Object}
 */
OpenLayers.Renderer.SVG.LABEL_VFACTOR = {
    "t": 0,
    "b": -1
};

/**
 * Function: OpenLayers.Renderer.SVG.preventDefault
 * Used to prevent default events (especially opening images in a new tab on
 * ctrl-click) from being executed for externalGraphic symbols
 */
OpenLayers.Renderer.SVG.preventDefault = function(e) {
    e.preventDefault && e.preventDefault();
};
/* ======================================================================
    OpenLayers/Control/ScaleLine.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Control.js
 */

/**
 * Class: OpenLayers.Control.ScaleLine
 * The ScaleLine displays a small line indicator representing the current 
 * map scale on the map. By default it is drawn in the lower left corner of
 * the map.
 * 
 * Inherits from:
 *  - <OpenLayers.Control>
 *  
 * Is a very close copy of:
 *  - <OpenLayers.Control.Scale>
 */
OpenLayers.Control.ScaleLine = OpenLayers.Class(OpenLayers.Control, {

    /**
     * Property: maxWidth
     * {Integer} Maximum width of the scale line in pixels.  Default is 100.
     */
    maxWidth: 100,

    /**
     * Property: topOutUnits
     * {String} Units for zoomed out on top bar.  Default is km.
     */
    topOutUnits: "km",
    
    /**
     * Property: topInUnits
     * {String} Units for zoomed in on top bar.  Default is m.
     */
    topInUnits: "m",

    /**
     * Property: bottomOutUnits
     * {String} Units for zoomed out on bottom bar.  Default is mi.
     */
    bottomOutUnits: "mi",

    /**
     * Property: bottomInUnits
     * {String} Units for zoomed in on bottom bar.  Default is ft.
     */
    bottomInUnits: "ft",
    
    /**
     * Property: eTop
     * {DOMElement}
     */
    eTop: null,

    /**
     * Property: eBottom
     * {DOMElement}
     */
    eBottom:null,
    
    /**
     * APIProperty: geodesic
     * {Boolean} Use geodesic measurement. Default is false. The recommended
     * setting for maps in EPSG:4326 is false, and true EPSG:900913. If set to
     * true, the scale will be calculated based on the horizontal size of the
     * pixel in the center of the map viewport.
     */
    geodesic: false,

    /**
     * Constructor: OpenLayers.Control.ScaleLine
     * Create a new scale line control.
     * 
     * Parameters:
     * options - {Object} An optional object whose properties will be used
     *     to extend the control.
     */

    /**
     * Method: draw
     * 
     * Returns:
     * {DOMElement}
     */
    draw: function() {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        if (!this.eTop) {
            // stick in the top bar
            this.eTop = document.createElement("div");
            this.eTop.className = this.displayClass + "Top";
            var theLen = this.topInUnits.length;
            this.div.appendChild(this.eTop);
            if((this.topOutUnits == "") || (this.topInUnits == "")) {
                this.eTop.style.visibility = "hidden";
            } else {
                this.eTop.style.visibility = "visible";
            }

            // and the bottom bar
            this.eBottom = document.createElement("div");
            this.eBottom.className = this.displayClass + "Bottom";
            this.div.appendChild(this.eBottom);
            if((this.bottomOutUnits == "") || (this.bottomInUnits == "")) {
                this.eBottom.style.visibility = "hidden";
            } else {
                this.eBottom.style.visibility = "visible";
            }
        }
        this.map.events.register('moveend', this, this.update);
        this.update();
        return this.div;
    },

    /** 
     * Method: getBarLen
     * Given a number, round it down to the nearest 1,2,5 times a power of 10.
     * That seems a fairly useful set of number groups to use.
     * 
     * Parameters:
     * maxLen - {float}  the number we're rounding down from
     * 
     * Returns:
     * {Float} the rounded number (less than or equal to maxLen)
     */
    getBarLen: function(maxLen) {
        // nearest power of 10 lower than maxLen
        var digits = parseInt(Math.log(maxLen) / Math.log(10));
        var pow10 = Math.pow(10, digits);
        
        // ok, find first character
        var firstChar = parseInt(maxLen / pow10);

        // right, put it into the correct bracket
        var barLen;
        if(firstChar > 5) {
            barLen = 5;
        } else if(firstChar > 2) {
            barLen = 2;
        } else {
            barLen = 1;
        }

        // scale it up the correct power of 10
        return barLen * pow10;
    },

    /**
     * Method: update
     * Update the size of the bars, and the labels they contain.
     */
    update: function() {
        var res = this.map.getResolution();
        if (!res) {
            return;
        }

        var curMapUnits = this.map.getUnits();
        var inches = OpenLayers.INCHES_PER_UNIT;

        // convert maxWidth to map units
        var maxSizeData = this.maxWidth * res * inches[curMapUnits];
        var geodesicRatio = 1;
        if(this.geodesic === true) {
            var maxSizeGeodesic = (this.map.getGeodesicPixelSize().w ||
                0.000001) * this.maxWidth;
            var maxSizeKilometers = maxSizeData / inches["km"];
            geodesicRatio = maxSizeGeodesic / maxSizeKilometers;
            maxSizeData *= geodesicRatio;
        }

        // decide whether to use large or small scale units     
        var topUnits;
        var bottomUnits;
        if(maxSizeData > 100000) {
            topUnits = this.topOutUnits;
            bottomUnits = this.bottomOutUnits;
        } else {
            topUnits = this.topInUnits;
            bottomUnits = this.bottomInUnits;
        }

        // and to map units units
        var topMax = maxSizeData / inches[topUnits];
        var bottomMax = maxSizeData / inches[bottomUnits];

        // now trim this down to useful block length
        var topRounded = this.getBarLen(topMax);
        var bottomRounded = this.getBarLen(bottomMax);

        // and back to display units
        topMax = topRounded / inches[curMapUnits] * inches[topUnits];
        bottomMax = bottomRounded / inches[curMapUnits] * inches[bottomUnits];

        // and to pixel units
        var topPx = topMax / res / geodesicRatio;
        var bottomPx = bottomMax / res / geodesicRatio;
        
        // now set the pixel widths
        // and the values inside them
        
        if (this.eBottom.style.visibility == "visible"){
            this.eBottom.style.width = Math.round(bottomPx) + "px"; 
            this.eBottom.innerHTML = bottomRounded + " " + bottomUnits ;
        }
            
        if (this.eTop.style.visibility == "visible"){
            this.eTop.style.width = Math.round(topPx) + "px";
            this.eTop.innerHTML = topRounded + " " + topUnits;
        }
        
    }, 

    CLASS_NAME: "OpenLayers.Control.ScaleLine"
});

/* ======================================================================
    OpenLayers/Layer/Google/v3.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


/**
 * @requires OpenLayers/Layer/Google.js
 */

/**
 * Constant: OpenLayers.Layer.Google.v3
 * 
 * Mixin providing functionality specific to the Google Maps API v3.
 * 
 * To use this layer, you must include the GMaps v3 API in your html.
 * 
 * Because OpenLayers needs to control mouse events, it isolates the GMaps mapObject
 * (the DOM elements provided by Google) using the EventPane.
 * However, because the Terms of Use require some of those elements,
 * such as the links to Google's terms, to be clickable, these elements have 
 * to be moved up to OpenLayers' container div. There is however no easy way
 * to identify these, and the logic (see the repositionMapElements function
 * in the source) may need to be changed if Google changes them.
 * These elements are not part of the published API and can be changed at any time,
 * so a given OpenLayers release can only guarantee support for the 'frozen'
 * Google release at the time of the OpenLayers release. See
 * https://developers.google.com/maps/documentation/javascript/basics#Versioning
 * for Google's current release cycle.
 * 
 * For this reason, it's recommended that production code specifically loads 
 * the current frozen version, for example:
 *
 * (code)
 * <script src="http://maps.google.com/maps/api/js?v=3.7&amp;sensor=false"></script>
 * (end)
 * 
 * but that development code should use the latest 'nightly' version, so that any
 * problems can be dealt with as soon as they arise, and before they affect the production, 'frozen', code.
 * 
 * Note, however, that frozen versions are retired as part of Google's release
 * cycle, and once this happens, you will get the next version, in the example above, 3.8 once 3.7 is retired.
 * 
 * This version supports 3.7.
 * 
 * 
 * Note that this layer configures the google.maps.map object with the
 * "disableDefaultUI" option set to true. Using UI controls that the Google
 * Maps API provides is not supported by the OpenLayers API.
 */
OpenLayers.Layer.Google.v3 = {
    
    /**
     * Constant: DEFAULTS
     * {Object} It is not recommended to change the properties set here. Note
     * that Google.v3 layers only work when sphericalMercator is set to true.
     * 
     * (code)
     * {
     *     sphericalMercator: true,
     *     projection: "EPSG:900913"
     * }
     * (end)
     */
    DEFAULTS: {
        sphericalMercator: true,
        projection: "EPSG:900913"
    },

    /**
     * APIProperty: animationEnabled
     * {Boolean} If set to true, the transition between zoom levels will be
     *     animated (if supported by the GMaps API for the device used). Set to
     *     false to match the zooming experience of other layer types. Default
     *     is true. Note that the GMaps API does not give us control over zoom
     *     animation, so if set to false, when zooming, this will make the
     *     layer temporarily invisible, wait until GMaps reports the map being
     *     idle, and make it visible again. The result will be a blank layer
     *     for a few moments while zooming.
     */
    animationEnabled: true, 

    /** 
     * Method: loadMapObject
     * Load the GMap and register appropriate event listeners. If we can't 
     *     load GMap2, then display a warning message.
     */
    loadMapObject:function() {
        if (!this.type) {
            this.type = google.maps.MapTypeId.ROADMAP;
        }
        var mapObject;
        var cache = OpenLayers.Layer.Google.cache[this.map.id];
        if (cache) {
            // there are already Google layers added to this map
            mapObject = cache.mapObject;
            // increment the layer count
            ++cache.count;
        } else {
            // this is the first Google layer for this map

            var container = this.map.viewPortDiv;
            var div = document.createElement("div");
            div.id = this.map.id + "_GMapContainer";
            div.style.position = "absolute";
            div.style.width = "100%";
            div.style.height = "100%";
            container.appendChild(div);

            // create GMap and shuffle elements
            var center = this.map.getCenter();
            mapObject = new google.maps.Map(div, {
                center: center ?
                    new google.maps.LatLng(center.lat, center.lon) :
                    new google.maps.LatLng(0, 0),
                zoom: this.map.getZoom() || 0,
                mapTypeId: this.type,
                disableDefaultUI: true,
                keyboardShortcuts: false,
                draggable: false,
                disableDoubleClickZoom: true,
                scrollwheel: false,
                streetViewControl: false
            });
            
            // cache elements for use by any other google layers added to
            // this same map
            cache = {
                mapObject: mapObject,
                count: 1
            };
            OpenLayers.Layer.Google.cache[this.map.id] = cache;
            this.repositionListener = google.maps.event.addListenerOnce(
                mapObject, 
                "center_changed", 
                OpenLayers.Function.bind(this.repositionMapElements, this)
            );
        }
        this.mapObject = mapObject;
        this.setGMapVisibility(this.visibility);
    },
    
    /**
     * Method: repositionMapElements
     *
     * Waits until powered by and terms of use elements are available and then
     * moves them so they are clickable.
     */
    repositionMapElements: function() {

        // This is the first time any Google layer in this mapObject has been
        // made visible.  The mapObject needs to know the container size.
        google.maps.event.trigger(this.mapObject, "resize");
        
        var div = this.mapObject.getDiv().firstChild;
        if (!div || div.childNodes.length < 3) {
            this.repositionTimer = window.setTimeout(
                OpenLayers.Function.bind(this.repositionMapElements, this),
                250
            );
            return false;
        }

        var cache = OpenLayers.Layer.Google.cache[this.map.id];
        var container = this.map.viewPortDiv;
        
        // move the ToS and branding stuff up to the container div
        // depends on value of zIndex, which is not robust
        for (var i=div.children.length-1; i>=0; --i) {
            if (div.children[i].style.zIndex == 1000001) {
                var termsOfUse = div.children[i];
                container.appendChild(termsOfUse);
                termsOfUse.style.zIndex = "1100";
                termsOfUse.style.bottom = "";
                termsOfUse.className = "olLayerGoogleCopyright olLayerGoogleV3";
                termsOfUse.style.display = "";
                cache.termsOfUse = termsOfUse;
            }
            if (div.children[i].style.zIndex == 1000000) {
                var poweredBy = div.children[i];
                container.appendChild(poweredBy);
                poweredBy.style.zIndex = "1100";
                poweredBy.style.bottom = "";
                poweredBy.className = "olLayerGooglePoweredBy olLayerGoogleV3 gmnoprint";
                poweredBy.style.display = "";
                cache.poweredBy = poweredBy;
            }
            if (div.children[i].style.zIndex == 10000002) {
                container.appendChild(div.children[i]);
            }
        }

        this.setGMapVisibility(this.visibility);

    },

    /**
     * APIMethod: onMapResize
     */
    onMapResize: function() {
        if (this.visibility) {
            google.maps.event.trigger(this.mapObject, "resize");
        } else {
            var cache = OpenLayers.Layer.Google.cache[this.map.id];
            if (!cache.resized) {
                var layer = this;
                google.maps.event.addListenerOnce(this.mapObject, "tilesloaded", function() {
                    google.maps.event.trigger(layer.mapObject, "resize");
                    layer.moveTo(layer.map.getCenter(), layer.map.getZoom());
                    delete cache.resized;
                });
            }
            cache.resized = true;
        }
    },

    /**
     * Method: setGMapVisibility
     * Display the GMap container and associated elements.
     * 
     * Parameters:
     * visible - {Boolean} Display the GMap elements.
     */
    setGMapVisibility: function(visible) {
        var cache = OpenLayers.Layer.Google.cache[this.map.id];
        if (cache) {
            var type = this.type;
            var layers = this.map.layers;
            var layer;
            for (var i=layers.length-1; i>=0; --i) {
                layer = layers[i];
                if (layer instanceof OpenLayers.Layer.Google &&
                            layer.visibility === true && layer.inRange === true) {
                    type = layer.type;
                    visible = true;
                    break;
                }
            }
            var container = this.mapObject.getDiv();
            if (visible === true) {
                this.mapObject.setMapTypeId(type);                
                container.style.left = "";
                if (cache.termsOfUse && cache.termsOfUse.style) {
                    cache.termsOfUse.style.left = "";
                    cache.termsOfUse.style.display = "";
                    cache.poweredBy.style.display = "";            
                }
                cache.displayed = this.id;
            } else {
                delete cache.displayed;
                container.style.left = "-9999px";
                if (cache.termsOfUse && cache.termsOfUse.style) {
                    cache.termsOfUse.style.display = "none";
                    // move ToU far to the left in addition to setting
                    // display to "none", because at the end of the GMap
                    // load sequence, display: none will be unset and ToU
                    // would be visible after loading a map with a google
                    // layer that is initially hidden. 
                    cache.termsOfUse.style.left = "-9999px";
                    cache.poweredBy.style.display = "none";
                }
            }
        }
    },
    
    /**
     * Method: getMapContainer
     * 
     * Returns:
     * {DOMElement} the GMap container's div
     */
    getMapContainer: function() {
        return this.mapObject.getDiv();
    },
    
  //
  // TRANSLATION: MapObject Bounds <-> OpenLayers.Bounds
  //

    /**
     * APIMethod: getMapObjectBoundsFromOLBounds
     * 
     * Parameters:
     * olBounds - {<OpenLayers.Bounds>}
     * 
     * Returns:
     * {Object} A MapObject Bounds, translated from olBounds
     *          Returns null if null value is passed in
     */
    getMapObjectBoundsFromOLBounds: function(olBounds) {
        var moBounds = null;
        if (olBounds != null) {
            var sw = this.sphericalMercator ? 
              this.inverseMercator(olBounds.bottom, olBounds.left) : 
              new OpenLayers.LonLat(olBounds.bottom, olBounds.left);
            var ne = this.sphericalMercator ? 
              this.inverseMercator(olBounds.top, olBounds.right) : 
              new OpenLayers.LonLat(olBounds.top, olBounds.right);
            moBounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(sw.lat, sw.lon),
                new google.maps.LatLng(ne.lat, ne.lon)
            );
        }
        return moBounds;
    },


    /************************************
     *                                  *
     *   MapObject Interface Controls   *
     *                                  *
     ************************************/


  // LonLat - Pixel Translation
  
    /**
     * APIMethod: getMapObjectLonLatFromMapObjectPixel
     * 
     * Parameters:
     * moPixel - {Object} MapObject Pixel format
     * 
     * Returns:
     * {Object} MapObject LonLat translated from MapObject Pixel
     */
    getMapObjectLonLatFromMapObjectPixel: function(moPixel) {
        var size = this.map.getSize();
        var lon = this.getLongitudeFromMapObjectLonLat(this.mapObject.center);
        var lat = this.getLatitudeFromMapObjectLonLat(this.mapObject.center);
        var res = this.map.getResolution();

        var delta_x = moPixel.x - (size.w / 2);
        var delta_y = moPixel.y - (size.h / 2);
    
        var lonlat = new OpenLayers.LonLat(
            lon + delta_x * res,
            lat - delta_y * res
        ); 

        if (this.wrapDateLine) {
            lonlat = lonlat.wrapDateLine(this.maxExtent);
        }
        return this.getMapObjectLonLatFromLonLat(lonlat.lon, lonlat.lat);
    },

    /**
     * APIMethod: getMapObjectPixelFromMapObjectLonLat
     * 
     * Parameters:
     * moLonLat - {Object} MapObject LonLat format
     * 
     * Returns:
     * {Object} MapObject Pixel transtlated from MapObject LonLat
     */
    getMapObjectPixelFromMapObjectLonLat: function(moLonLat) {
        var lon = this.getLongitudeFromMapObjectLonLat(moLonLat);
        var lat = this.getLatitudeFromMapObjectLonLat(moLonLat);
        var res = this.map.getResolution();
        var extent = this.map.getExtent();
        return this.getMapObjectPixelFromXY((1/res * (lon - extent.left)),
                                            (1/res * (extent.top - lat)));
    },

  
    /** 
     * APIMethod: setMapObjectCenter
     * Set the mapObject to the specified center and zoom
     * 
     * Parameters:
     * center - {Object} MapObject LonLat format
     * zoom - {int} MapObject zoom format
     */
    setMapObjectCenter: function(center, zoom) {
        if (this.animationEnabled === false && zoom != this.mapObject.zoom) {
            var mapContainer = this.getMapContainer();
            google.maps.event.addListenerOnce(
                this.mapObject, 
                "idle", 
                function() {
                    mapContainer.style.visibility = "";
                }
            );
            mapContainer.style.visibility = "hidden";
        }
        this.mapObject.setOptions({
            center: center,
            zoom: zoom
        });
    },
   
    
  // Bounds
  
    /** 
     * APIMethod: getMapObjectZoomFromMapObjectBounds
     * 
     * Parameters:
     * moBounds - {Object} MapObject Bounds format
     * 
     * Returns:
     * {Object} MapObject Zoom for specified MapObject Bounds
     */
    getMapObjectZoomFromMapObjectBounds: function(moBounds) {
        return this.mapObject.getBoundsZoomLevel(moBounds);
    },

    /************************************
     *                                  *
     *       MapObject Primitives       *
     *                                  *
     ************************************/


  // LonLat
    
    /**
     * APIMethod: getMapObjectLonLatFromLonLat
     * 
     * Parameters:
     * lon - {Float}
     * lat - {Float}
     * 
     * Returns:
     * {Object} MapObject LonLat built from lon and lat params
     */
    getMapObjectLonLatFromLonLat: function(lon, lat) {
        var gLatLng;
        if(this.sphericalMercator) {
            var lonlat = this.inverseMercator(lon, lat);
            gLatLng = new google.maps.LatLng(lonlat.lat, lonlat.lon);
        } else {
            gLatLng = new google.maps.LatLng(lat, lon);
        }
        return gLatLng;
    },
    
  // Pixel
    
    /**
     * APIMethod: getMapObjectPixelFromXY
     * 
     * Parameters:
     * x - {Integer}
     * y - {Integer}
     * 
     * Returns:
     * {Object} MapObject Pixel from x and y parameters
     */
    getMapObjectPixelFromXY: function(x, y) {
        return new google.maps.Point(x, y);
    },
        
    /**
     * APIMethod: destroy
     * Clean up this layer.
     */
    destroy: function() {
        if (this.repositionListener) {
            google.maps.event.removeListener(this.repositionListener);
        }
        if (this.repositionTimer) {
            window.clearTimeout(this.repositionTimer);
        }
        OpenLayers.Layer.Google.prototype.destroy.apply(this, arguments);
    }
    
};
/* ======================================================================
    OpenLayers/Geometry/ProgressiveLineString.js
   ====================================================================== */

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/Geometry/LineString.js
 */

/**
 * Class: OpenLayers.Geometry.ProgressiveLineString
 * A LineString with level of detail classification
 * 
 * Inherits from:
 *  - <OpenLayers.Geometry.LineString>
 *  - <OpenLayers.Geometry.Curve> 
 */
OpenLayers.Geometry.ProgressiveLineString = OpenLayers.Class(
  OpenLayers.Geometry.LineString, {

    /**
     * Property: componentsLoD
     * {Array(int)} An array of level of detail classifications.
     * This array must be as long as the number of points in the
     * original LineString.
     */
    componentsLevel: null,

    /**
     * Property: levels
     * {Array(int)} An array of levels of detail <-> zoom level
     * e.g. levels[0] = 0 means all LoD >= 0 are visible in zoom level >= 0
     */
    levels: null,

    /**
     * Property: clip
     * {float} how large to clip the geometry when drawing
     */
    clip: 1.5,


    /**
     * Holds and tracks all partitioned geometries of our LineString.
    */
    partitionedGeometries: [],

    /**
     * Constructor: OpenLayers.Geometry.ProgressiveLineString
     * Constructor for a ProgressiveLineString Geometry.
     *
     * Parameters: 
     * components - {<OpenLayers.Geometry.LineString>} An array of points used to
     *              generate the linestring
     * componentsLevel - {Array(int)} An array of integers describing the level of detail
     *                   for each point. A LoD of 0 is visible in all zoom levels.
     * levels - {Array(int)} Levels array.
     */
    initialize: function(components, componentsLevel, levels) {
        if (components.length != componentsLevel.length) return;

        OpenLayers.Geometry.LineString.prototype.initialize.apply(this, arguments);
        this.componentsLevel = componentsLevel;
        this.levels = levels;

        for (var i = 0, len = this.components.length; i < len; i++) {
          this.components[i].originalIndex = i;
        }
    },

    /**
     * Method: getGeometries
     * Get this LineString as MultiLineString clipped to bounds and only with
     * points at the given lod.
     *
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     * lod - {int} Level of detail
     */
    getGeometries: function(bounds, lod) {
        var multiLineString = [];
        var points = [];
        var inside = false;
        var last = 0;

        for (var i = 1, len = this.components.length; i < len; i++) {
            if (this.componentsLevel[i] > lod) continue;

            var vertice = new OpenLayers.Bounds();
            vertice.bottom = Math.min(this.components[last].y,
                                      this.components[i].y);
            vertice.top =  Math.max(this.components[last].y,
                                    this.components[i].y);
            vertice.left = Math.min(this.components[last].x,
                                    this.components[i].x);
            vertice.right = Math.max(this.components[last].x,
                                     this.components[i].x);

            if (bounds.intersectsBounds(vertice)) {
                // inside. add to lineString.

                if (!inside) {
                    // first add the previous point.
                    points.push(this.components[last]);
                }

                // add current point
                points.push(this.components[i]);
                inside = true;
            } else {
                if (inside) {
                // create linestring and add it to multilinestring
                multiLineString.push(new OpenLayers.Geometry.LineString(points));
                // reset points array
                points = [];
                }
                // no longer inside
                inside = false;
            }
            last = i;
        }

        // push last linestring if not done already
        if (inside) multiLineString.push(new OpenLayers.Geometry.LineString(points));

        return multiLineString;
    },


    updateGeometries: function(bbox, zoom) {
        var bounds = bbox.scale(this.clip);

        var lod = 0;
        for (var i = 0; i < this.levels.length; i++) {
            if (this.levels[i] <= zoom) {
                lod = i;
            }
        }

        var geometries_to_remove = this.partitionedGeometries;
        this.partitionedGeometries = this.getGeometries(bounds, lod);

        return { remove: geometries_to_remove, add: this.partitionedGeometries };
    },

    CLASS_NAME: "OpenLayers.Geometry.ProgressiveLineString"
});

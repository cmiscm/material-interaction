/**
 * Utils
 * @author Jongmin Kim - cmiscm@google.com
 */

var CMUtiles = CMUtiles || ( function () {

        var _public = {},
            _prefixes = ['webkit', 'Moz', 'ms', 'O'];


        function vendor(el, prop) {
            var s = el.style, pp, i;
            prop = prop.charAt(0).toUpperCase() + prop.slice(1);
            for(i=0; i<_prefixes.length; i++) {
                pp = _prefixes[i]+prop;
                if(s[pp] !== undefined) return pp;
            }
            if(s[prop] !== undefined) return prop;
        }

        function getQueryParams(qs) {
            qs = qs.split("+").join(" ");
            var params = {}, tokens, re = /[?&]?([^=]+)=([^&]*)/g;
            while (tokens = re.exec(qs)) params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
            return params;
        }


        function distance(x1, y1, x2, y2) {
            var a = (x2 - x1),
                b = (y2 - y1),
                distance = Math.sqrt(a * a + b * b);
            return distance;
        }
        /*
        if (window.location.protocol == "file:") {
            CMUtiles.domLoadScript("local.js", function() {
                console.log('end load js');
            })
        } else {
            CMUtiles.domLoadScript("sever.js");
        }
        */
        function domLoadScript(url, callback) {
            var head, script;

            script = document.createElement("script");
            script.type = "text/javascript";
            script.src = url;
            script.onload = callback;
            head = document.getElementsByTagName("head")[0];
            head.appendChild(script);
            return script;
        }


        function removeDom(elem) {
            var parent = elem.parentNode;
            if (parent) parent.removeChild(elem);
        }

        function getFullSize(stageW, stageH, imgW, imgH) {
            var sPer = stageW / stageH,
                imgPer = imgW / imgH,
                tw = stageW,
                th = stageH,
                tx = 0,
                ty = 0;

            if (imgPer > sPer) {
                tw = (0.5 + (imgW * (stageH / imgH))) | 0;
                tx = (0.5 + ((stageW - tw) / 2)) | 0;
            } else {
                th = (0.5 + (imgH * (stageW / imgW))) | 0;
                ty = (0.5 + ((stageH - th) / 2)) | 0;
            }

            return {w:tw, h:th, x:tx, y:ty};
        }

        function getFitSize(stageW, stageH, imgW, imgH) {
            var sPer = stageW / stageH,
                imgPer = imgW / imgH,
                tw = stageW,
                th = stageH,
                tx = 0,
                ty = 0;

            if (imgPer < sPer) {
                tw = (0.5 + (imgW * (stageH / imgH))) | 0;
                tx = (0.5 + ((stageW - tw) / 2)) | 0;
            } else {
                th = (0.5 + (imgH * (stageW / imgW))) | 0;
                ty = (0.5 + ((stageH - th) / 2)) | 0;
            }

            return {w:tw, h:th, x:tx, y:ty};
        }

        function getInsideMax(no, total) {
            return (no + (total * (Math.abs((no / 10) | 0) + 1))) % total;
        }

        function getCurrent($cur, $top, $bottom, $min, $max) {
            return ($max - $min) / ($bottom - $top) * ($cur - $top) + $min;
        }

        function getWallPosition($index, $x_num, $x_gap, $y_gap) {
            var tx = ($index % $x_num) * $x_gap,
                ty = (($index / $x_num) | 0) * $y_gap;
            return {x:tx, y:ty};
        }

        function openPopup(url, name, width, height) {
            var wx = (screen.width - width) >> 1,
                wy = (screen.height - height) >> 1;
            window.open(url, name, "top="+wy+",left="+wx+",width="+width+",height="+height);
        }

        function addZeros(num, no) {
            var str = num.toString(),
                zero = "",
                len = str.length,
                total = no + 1;
            if (len < total) {
                var zeroTotal = total - len, i;
                for (i = 1; i <= zeroTotal; i++) zero += "0";
                str = zero + str;
            }
            return str;
        }

        function addDots(num, dot) {
            var arr = num.toString().split(""),
                tlen = arr.length,
                clen = (tlen / 3),
                i,
                fclen = (clen << 0);
            fclen = (fclen == clen)? fclen: fclen + 1;

            for (i = 1; i < fclen; i++) arr.splice(tlen - i * 3, 0, dot);
            return arr.join("");
        }


        function randomInteger(low, high) {
            return (0.5 + (Math.random()*(high-low) + low)) | 0;
        }

        function randomFloat(low, high) {
            return low + Math.random() * (high - low);
        }

        function isArray(o) {
            return Object.prototype.toString.call( o ) === "[object Array]";
        }

        function isObject(o) {
            return Object.prototype.toString.call( o ) === "[object Object]";
        }


        /*
        function ceil(value ) {
            //return (value + (value < 0 ? -0.5 : 0.5))|0;
            var f = (value << 0);
            return f = (f == value)? f: f + 1;
        }
        function floor(value ) {
            return value | 0;
        }
        function round(value ) {
            return (0.5 + value) | 0;
        }
        */

        function shuffle(oldArray) {
            var newArray = oldArray.slice();
            var len = newArray.length;
            var i = len;
            while (i--) {
                var p = parseInt(Math.random()*len);
                var t = newArray[i];
                newArray[i] = newArray[p];
                newArray[p] = t;
            }
            return newArray;
        }

        _public.domLoadScript = domLoadScript;
        _public.getFullSize = getFullSize;
        _public.getFitSize = getFitSize;
        _public.getInsideMax = getInsideMax;
        _public.openPopup = openPopup;
        _public.addZeros = addZeros;
        _public.addDots = addDots;
        _public.getCurrent = getCurrent;
        _public.getWallPosition = getWallPosition;
        _public.randomInteger = randomInteger;
        _public.randomFloat = randomFloat;
        _public.isArray = isArray;
        _public.isObject = isObject;
        _public.shuffle = shuffle;
        _public.removeDom = removeDom;
        _public.getQueryParams = getQueryParams;
        _public.vendor = vendor;
        _public.distance = distance;

    
    return _public;    
} )();

(function(global){

    function areHostMethods(object) {
        var methodNames = Array.prototype.slice.call(arguments, 1),
            t, i, len = methodNames.length;
        for (i = 0; i < len; i++) {
            t = typeof object[methodNames[i]];
            if (!(/^(?:function|object|unknown)$/).test(t)) return false;
        }
        return true;
    }

    var getUniqueId = (function () {
        if (typeof document.documentElement.uniqueID !== 'undefined') {
            return function (element) {
                return element.uniqueID;
            };
        }
        var uid = 0;
        return function (element) {
            return element.__uniqueID || (element.__uniqueID = 'uniqueID__' + uid++);
        };
    })();

    var getElement, setElement;
    (function () {
        var elements = { };
        getElement = function (uid) {
            return elements[uid];
        };
        setElement = function (uid, element) {
            elements[uid] = element;
        };
    })();

    function createListener(uid, handler) {
        return {
            handler: handler,
            wrappedHandler: createWrappedHandler(uid, handler)
        };
    }

    function createWrappedHandler(uid, handler) {
        return function (e) {
            handler.call(getElement(uid), e || window.event);
        };
    }

    function createDispatcher(uid, eventName) {
        return function (e) {
            if (handlers[uid] && handlers[uid][eventName]) {
                var handlersForEvent = handlers[uid][eventName];
                for (var i = 0, len = handlersForEvent.length; i < len; i++) {
                    handlersForEvent[i].call(this, e || window.event);
                }
            }
        };
    }

    function regEventEx(element, eventName, handler) {
        if(!element.eventHolder) element.eventHolder = [];
        element.eventHolder[element.eventHolder.length] = new Array(eventName, handler);
    }

    var addListener, removeListener, hasListener, removeListenerByType,
        shouldUseAddListenerRemoveListener = (
            areHostMethods(document.documentElement, 'addEventListener', 'removeEventListener') &&
            areHostMethods(window, 'addEventListener', 'removeEventListener')),

        shouldUseAttachEventDetachEvent = (
            areHostMethods(document.documentElement, 'attachEvent', 'detachEvent') &&
            areHostMethods(window, 'attachEvent', 'detachEvent')),

        // IE branch
        listeners = { },

        // DOM L0 branch
        handlers = { };

    hasListener = function(element, eventName, handler) {
        if (!element.eventHolder) {
            return false;
        } else {
            if (handler) {
                for (var i = 0; i < element.eventHolder.length; i++) {
                    if (element.eventHolder[i][0] == eventName && String(element.eventHolder[i][1]) == String(handler)) {
                        return true;
                    }
                }
            } else {
                for (var i = 0; i < element.eventHolder.length; i++) {
                    if (element.eventHolder[i][0] == eventName) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    removeListenerByType = function(element, eventName) {
        if (element.eventHolder) {
            var removed = 0;
            for (var i = 0; i < element.eventHolder.length; i++) {
                if (element.eventHolder[i][0] == eventName) {
                    removeListener(element, eventName, element.eventHolder[i][1]);
                    element.eventHolder.splice(i, 1);
                    removed++;
                    i--;
                }
            }
            return (removed > 0) ? true : false;
        } else {
            return false;
        }
    }

    if (shouldUseAddListenerRemoveListener) {
        addListener = function (element, eventName, handler) {
            element.addEventListener(eventName, handler, false);
            regEventEx(element, eventName, handler);
        };
        removeListener = function (element, eventName, handler) {
            element.removeEventListener(eventName, handler, false);
        };
    } else if (shouldUseAttachEventDetachEvent) {
        addListener = function (element, eventName, handler) {
            var uid = getUniqueId(element);
            setElement(uid, element);
            if (!listeners[uid]) {
                listeners[uid] = { };
            }
            if (!listeners[uid][eventName]) {
                listeners[uid][eventName] = [ ];
            }
            var listener = createListener(uid, handler);
            listeners[uid][eventName].push(listener);
            element.attachEvent('on' + eventName, listener.wrappedHandler);
        };

        removeListener = function (element, eventName, handler) {
            var uid = getUniqueId(element), listener;
            if (listeners[uid] && listeners[uid][eventName]) {
                for (var i = 0, len = listeners[uid][eventName].length; i < len; i++) {
                    listener = listeners[uid][eventName][i];
                    if (listener && listener.handler === handler) {
                        element.detachEvent('on' + eventName, listener.wrappedHandler);
                        listeners[uid][eventName][i] = null;
                    }
                }
            }
        };
    } else {
        addListener = function (element, eventName, handler) {
            var uid = getUniqueId(element);
            if (!handlers[uid]) {
                handlers[uid] = { };
            }
            if (!handlers[uid][eventName]) {
                handlers[uid][eventName] = [ ];
                var existingHandler = element['on' + eventName];
                if (existingHandler) {
                    handlers[uid][eventName].push(existingHandler);
                }
                element['on' + eventName] = createDispatcher(uid, eventName);
            }
            handlers[uid][eventName].push(handler);
        };

        removeListener = function (element, eventName, handler) {
            var uid = getUniqueId(element);
            if (handlers[uid] && handlers[uid][eventName]) {
                var handlersForEvent = handlers[uid][eventName];
                for (var i = 0, len = handlersForEvent.length; i < len; i++) {
                    if (handlersForEvent[i] === handler) {
                        handlersForEvent.splice(i, 1);
                    }
                }
            }
        };
    }

    /* export as global properties */
    global.addListener = addListener;
    global.removeListener = removeListener;
    global.hasListener = hasListener;
    global.removeListenerByType = removeListenerByType;

})(this);

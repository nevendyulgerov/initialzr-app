'use strict';

/* globals ammo */

/**
* Lib: Router
*/

(function (base) {
  'use strict';

  base.router = function () {
    var routes = [];
    var currentRoute = null;
    var err = function err(errText) {
      throw new Error('[Initialzr][Lib][Router]: ' + errText + '.');
    };
    var notRoutedPaths = {
      action: function action() {
        err('No routes found.');
      }
    };
    var _currentRoute = null;
    var initialRoute = null;
    var beforeRouteCallback = function beforeRouteCallback() {};
    var afterRouteCallback = function afterRouteCallback() {};

    var addRoute = function addRoute() {
      var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

      if (!ammo.isStr(path)) {
        err('Route path must be of type {string}');
      }

      if (!ammo.isFunc(action)) {
        err('Route action must be of type {function}.');
      }

      routes.push({ path: path, action: action });
    };

    var go = function go(path) {
      return window.location.href = '' + initialRoute + path;
    };

    var updateBeforeRoute = function updateBeforeRoute(callback) {
      beforeRouteCallback = ammo.isFunc(callback) ? callback : beforeRouteCallback;
    };

    var updateAfterRoute = function updateAfterRoute(callback) {
      afterRouteCallback = ammo.isFunc(callback) ? callback : afterRouteCallback;
    };

    var notFound = function notFound(options) {
      notRoutedPaths = options;
    };

    var checkForRoute = function checkForRoute() {
      var isMatch = false;
      var route = null;
      var current_params = currentRoute.split('/');

      beforeRouteCallback();

      for (var r = 0; r < routes.length; r++) {
        var routedParams = routes[r].path.split('/');

        if (current_params.length === routedParams.length) {
          var isParamsMatch = true;
          for (var i = 0; i < current_params.length; i++) {
            if (routedParams[i][0] !== ':') {
              if (routedParams[i] !== current_params[i]) {
                isParamsMatch = false;
                break;
              }
            }
          }
          if (isParamsMatch) {
            route = routes[r];
            isMatch = true;
            break;
          }
        }
      }

      if (!isMatch) {
        return executeNoRoutedPath();
      }
      executeRouteAction(route);
      afterRouteCallback();
    };

    var executeRouteAction = function executeRouteAction(route) {
      _currentRoute = route;

      var params = parseParams(route.path);
      var query = getRoute();

      if (route.action) {
        route.action(params, query);
      }
    };

    var executeNoRoutedPath = function executeNoRoutedPath() {
      if (ammo.isFunc(notRoutedPaths.action)) {
        notRoutedPaths.action();
      }
    };

    var parseParams = function parseParams(route) {
      var routedPath = route.split('/');
      var params = {};
      var temp = [];

      for (var i = 0; i < routedPath.length; i++) {
        if (routedPath[i][0] === ':') {
          temp.push({
            index: i,
            name: routedPath[i].slice(1, routedPath[i].length)
          });
        }
      }

      for (var j = 0; j < temp.length; j++) {
        params[temp[j].name] = getRoute().split('/')[temp[j].index];
      }

      return params;
    };

    var getRoute = function getRoute() {
      var match = window.location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    };

    var listener = function listener(pollInterval) {
      var current = currentRoute;

      ammo.poll(function (resolve) {
        if (current !== getRoute()) {
          if (_currentRoute) {
            _currentRoute = null;
          }

          current = getRoute();
          currentRoute = getRoute();
          checkForRoute();
        }
        resolve(true);
      }, function () {}, pollInterval);
    };

    var initRouter = function initRouter() {
      initialRoute = window.location.pathname;

      if (!window.location.href.match(/#(.*)$/)) {

        if (initialRoute.substr(initialRoute.length - 1) !== '/') {
          initialRoute = initialRoute + '/';
        }

        window.location.href = initialRoute + '#/';
      }
      initialRoute = initialRoute + '#';
    };

    var pollRouter = function pollRouter() {
      var pollInterval = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;

      if (!ammo.isNum(pollInterval)) {
        err('Poll interval must be of type {number}');
      }

      listener(pollInterval);
    };

    var getCurrentRoute = function getCurrentRoute() {
      return currentRoute;
    };
    var getInitialRoute = function getInitialRoute() {
      return initialRoute;
    };

    return {
      init: function init() {
        initRouter();
        return this;
      },
      route: function route(path, action) {
        addRoute(path, action);
        return this;
      },

      go: go,
      notFound: notFound,
      getCurrentRoute: getCurrentRoute,
      getInitialRoute: getInitialRoute,
      beforeRoute: function beforeRoute(callback) {
        updateBeforeRoute(callback);
        return this;
      },
      afterRoute: function afterRoute(callback) {
        updateAfterRoute(callback);
        return this;
      },
      poll: function poll(interval) {
        pollRouter(interval);
        return this;
      }
    };
  }();
})(window);
;'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (base) {
  "use strict";

  /**
  * Library: Ammo
  * Author: Neven Dyulgerov
  * v1.3.5
  *
  * Provides general purpose utility belt for building web applications with JS
  * Ammo is available as global variable {ammo}
  * Released under the MIT license
  */

  base.ammo = function () {
    var _this = this;

    /**
    * @description Provide DOM context
    * Contx
    * @param context
    * @returns {*|HTMLDocument}
    */
    var contx = function contx(context) {
      return context || base.document;
    };

    /**
    * @description Event handler for DOM Ready
    * @param callback
    */
    var onDomReady = function onDomReady(callback) {
      base.document.addEventListener('DOMContentLoaded', callback);
    };

    /**
    * @description Event handler for hover
    * @param domEls
    * @param onIn
    * @param onOut
    */
    var onHover = function onHover(domEls, onIn, onOut) {
      var lastHovered = void 0;
      _each(domEls, function (el) {
        el.addEventListener('mouseenter', function (e) {
          lastHovered = e.target;
          onIn(e);
        });
        el.addEventListener('mouseout', function (e) {
          onOut(e, lastHovered);
        });
      });
    };

    /**
    * @description Delegate event to given selector with className
    * @param event
    * @param className
    * @param callback
    * @param context
    */
    var delegateEvent = function delegateEvent(event, className, callback, context) {
      var classNames = className.indexOf('.') > -1 ? className.split('.') : [className];
      classNames = classNames.filter(function (item) {
        return !isUndef(item) && item !== '';
      });
      var containsCounter = 0;

      contx(context).addEventListener(event, function (e) {
        if (e.target) {
          classNames.map(function (className) {
            if (e.target.classList.contains(className)) {
              containsCounter++;
            }
            return className;
          });
        }

        if (containsCounter === classNames.length && containsCounter > 0) {
          callback(e);
        }
        containsCounter = 0;
      });
    };

    /**
    * @description Get node by given selector
    * @param selector
    * @param context
    * @returns {Node}
    */
    var getEl = function getEl(selector, context) {
      return contx(context).querySelector(selector);
    };

    /**
    * @description Get node list by given selector
    * @param selector
    * @param context
    */
    var getEls = function getEls(selector, context) {
      return contx(context).querySelectorAll(selector);
    };

    /**
    * @description Check if element is hovered
    * @param selector
    * @returns {boolean}
    */
    var isHovered = function isHovered(selector) {
      var domEl = getEl(selector);
      return domEl.parentNode.querySelector(':hover') === domEl;
    };

    /**
    * Public
    * Filter Class
    * @param className
    * @param els
    * @returns {Array}
    */
    var filterClass = function filterClass(className, els) {
      var filtered = [];
      _each(els, function (el) {
        if (el.classList.contains(className)) {
          filtered.push(el);
        }
      });
      return filtered;
    };

    /**
    * @description Append HTML content after the end of a node
    * @param html
    * @param context
    * @returns {*}
    */
    var appendAfter = function appendAfter(html, context) {
      contx(context).insertAdjacentHTML('afterend', html.toString());
      return _this;
    };

    /**
    * @description Append HTML content before the end of a node
    * @param html
    * @param context
    * @returns {*}
    */
    var appendBefore = function appendBefore(html, context) {
      contx(context).insertAdjacentHTML('beforeend', html.toString());
      return _this;
    };

    /**
    * @description Prepend HTML content after the beginning of a node
    * @param html
    * @param context
    * @returns {*}
    */
    var prependAfter = function prependAfter(html, context) {
      contx(context).insertAdjacentHTML('afterbegin', html.toString());
      return _this;
    };

    /**
    * @description Prepend HTML content before the beginning of a node
    * @param html
    * @param context
    */
    var prependBefore = function prependBefore(html, context) {
      contx(context).insertAdjacentHTML('beforebegin', html.toString());
      return _this;
    };

    /**
    * @description Remove node from the DOM
    * @param domEl
    */
    var removeEl = function removeEl(domEl) {
      domEl.parentNode.removeChild(domEl);
      return _this;
    };

    /**
    * Public
    * Remove
    * @param el
    * @param parent
    * @returns {*}
    */
    var remove = function remove(el, parent) {
      (parent || el.parentNode).removeChild(el);
      return base.ammo;
    };

    /**
    * Public
    * Each
    * @param elements
    * @param callback
    */
    var _each = function _each(elements, callback) {
      Object.keys(elements).forEach(function (k, i) {
        callback(elements[k], i);
      });
    };

    /**
    * Public
    * JSON Copy
    * @param obj
    */
    var jsonCopy = function jsonCopy(obj) {
      return JSON.parse(JSON.stringify(obj));
    };

    /**
    * @description Check if value is of type 'object'
    * @param val
    * @returns {boolean}
    */
    var isObj = function isObj(val) {
      return (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && !isArr(val) && !isNull(val);
    };

    /**
    * @description Check if value is of type 'null'
    * @param val
    * @returns {boolean}
    */
    var isNull = function isNull(val) {
      return val === null;
    };

    /**
    * @description Check if value is of type 'number'
    * @param val
    * @returns {boolean}
    */
    var isNum = function isNum(val) {
      return typeof val === 'number' && !isNaN(val);
    };

    /**
    * @description Check if value is of type 'function'
    * @param val
    * @returns {boolean}
    */
    var isFunc = function isFunc(val) {
      return typeof val === 'function';
    };

    /**
    * @description Check if value is of type 'array'
    * @param val
    * @returns {boolean}
    */
    var isArr = function isArr(val) {
      return Array.isArray(val);
    };

    /**
    * @description Check if value is of type 'string'
    * @param val
    * @returns {boolean}
    */
    var isStr = function isStr(val) {
      return typeof val === 'string';
    };

    /**
    * @description Check if value is of type 'undefined'
    * @param val
    * @returns {boolean}
    */
    var isUndef = function isUndef(val) {
      return typeof val === 'undefined';
    };

    /**
    * @description Check if value is of type 'boolean'
    * @param val
    * @returns {boolean}
    */
    var isBool = function isBool(val) {
      return typeof val === 'boolean';
    };

    /**
    * @description Check if object has property
    * @param obj
    * @param prop
    * @returns {boolean}
    */
    var hasProp = function hasProp(obj, prop) {
      return obj.hasOwnProperty(prop);
    };

    /**
    * @description Check if object has method
    * @param obj
    * @param method
    * @returns {boolean}
    */
    var hasMethod = function hasMethod(obj, method) {
      return hasProp(obj, method) && isFunc(obj[method]);
    };

    /**
    * @description Check if object has key
    * @param obj
    * @param key
    * @returns {boolean}
    */
    var hasKey = function hasKey(obj, key) {
      return getKeys(obj).indexOf(key) > -1;
    };

    /**
    * @description Get object keys
    * @param obj
    * @returns {Array}
    */
    var getKeys = function getKeys(obj) {
      return Object.keys(obj);
    };

    /**
    * @description Iterate over each key of an object
    * @param obj
    * @param callback
    */
    var eachKey = function eachKey(obj, callback) {
      Object.keys(obj).forEach(function (k, i) {
        return callback(obj[k], k, i);
      });
    };

    /**
    * @description Filter array of items
    * @param items
    * @param key
    * @param value
    */
    var filter = function filter(items, key, value) {
      var filtered = [];
      items.filter(function (item, index) {
        if (item[key] === value) {
          filtered.push({ index: index, item: item });
        }
      });
      return filtered;
    };

    /**
    * @description Get url param
    * @param name
    * @returns {Array|{index: number, input: string}|*|string}
    */
    var getUrlParam = function getUrlParam(name) {
      var match = new RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
      return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    };

    /**
    * @description Get random integer between two numbers
    * @param min
    * @param max
    * @returns {*}
    */
    var randomInclusive = function randomInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    /**
    * @description Iterate recursively
    * @param handler
    * @param complete
    * @param index
    * @returns {*}
    */
    var recurIter = function recurIter(handler, complete, index) {
      index = index || 0;
      handler(index, function (canRecur) {
        if (!canRecur) {
          return complete();
        }
        recurIter(handler, complete, ++index);
      });
    };

    /**
    * @description Poll over an interval of time
    * @param handler
    * @param complete
    * @param interval
    */
    var poll = function poll(handler, complete, interval) {
      setTimeout(function () {
        handler(function (canPoll) {
          if (canPoll) {
            return poll(handler, complete, interval);
          }
          complete();
        });
      }, interval);
    };

    /**
    * @description Buffer high-frequency events
    * @returns {function}
    */
    var buffer = function buffer() {
      var timers = {};
      return function (id, ms, clb) {
        if (!id) {
          timers[id] = '0';
        }
        if (timers[id]) {
          clearTimeout(timers[id]);
        }
        timers[id] = setTimeout(clb, ms);
      };
    };

    /**
    * @description Augment object with properties from other objects
    * @returns {object}
    */
    var extend = function extend() {
      var obj = arguments[0];
      var enhancedObj = Object.assign(obj, {});
      var extenders = [];
      eachKey(arguments, function (argument, key, index) {
        if (index > 0) {
          extenders.push(argument);
        }
      });
      extenders.forEach(function (extender) {
        Object.assign(enhancedObj, extender);
      });
      return enhancedObj;
    };

    /**
    * @description Convert variable value by type
    * @param val
    * @returns {*}
    */
    var convertByType = function convertByType(val) {
      if (!isStr(val)) {
        return undefined;
      }

      if (val === 'true') {
        return true;
      } else if (val === 'false') {
        return false;
      } else if (val === 'null') {
        return null;
      } else if (+val + '' === val) {
        return +val;
      }

      return val;
    };

    /**
    * @description Compile HTML strings to DOM nodes
    * @param html
    * @param items
    * @returns {object}
    */
    var template = function template(html, items) {
      var compiled = void 0;
      var observerTag = {
        start: '{{',
        end: '}}'
      };
      var dataAttr = {
        id: 'data-ammo-key',
        idValue: 'data-ammo-key-value',
        observer: 'data-ammo-observer'
      };
      var valueObserver = '_ao_';
      var identifierRegex = /(key:[a-zA-Z]+)/g;
      var getObserverSchema = function getObserverSchema() {
        return {
          index: 0,
          name: '',
          value: '',
          isAttr: false,
          attr: ''
        };
      };
      var getIdentifier = function getIdentifier(html) {
        var match = html.match(identifierRegex);
        var tag = match[0];
        var index = tag.indexOf(':');
        return tag.substring(index + 1, tag.length);
      };
      var setIdentifier = function setIdentifier(html, identifier, value) {
        var match = html.match(identifierRegex);
        var tag = match[0];
        var index = html.indexOf(tag);
        return '' + html.substring(0, index - 1) + dataAttr.id + '="' + identifier + '" ' + dataAttr.idValue + '="' + value.toLowerCase() + '"' + html.substring(index + tag.length + 1, html.length);
      };
      var identifier = getIdentifier(html);

      var getObservers = function getObservers(html, getObserverSchema, observerTag) {
        var observersArr = [];
        var indexStart = html.indexOf(observerTag.start);
        var indexEnd = html.indexOf(observerTag.end);
        if (indexStart > -1 && indexEnd > -1) {
          while (indexStart > -1 && indexEnd > -1) {
            var observer = getObserverSchema();
            observer.name = html.substring(indexStart, indexEnd).replace(observerTag.start, '').replace(observerTag.end, '');
            observersArr.push(observer);
            if (indexStart - 2 >= 0 && html[indexStart - 2] === '=') {
              observer.isAttr = true;
              var spaceIndex = indexStart - 3;
              var attrLetterCount = 0;
              var spaceFound = false;
              var attrName = '';
              while (!spaceFound && spaceIndex >= 0) {
                if (html[spaceIndex] === ' ') {
                  spaceFound = true;
                  observer.index = html.indexOf('>', spaceIndex);
                  break;
                }
                attrName += html[spaceIndex];
                spaceIndex--;
                attrLetterCount++;
              }
              observer.attr = attrName.split('').reverse().join('');
            } else {
              observer.index = html.indexOf('>', indexStart - observerTag.start.length);
            }
            indexStart = html.indexOf(observerTag.start, indexStart + 1);
            indexEnd = html.indexOf(observerTag.end, indexEnd + 1);
          }
        }
        return observersArr;
      };
      var observers = getObservers(html, getObserverSchema, observerTag);

      var insertValueObserverTags = function insertValueObserverTags(html) {
        var modifiedHtml = html;
        var valueObserverCount = 0;
        observers.forEach(function (observer) {
          if (!observer.isAttr) {
            if (valueObserverCount > 0) {
              modifiedHtml = [modifiedHtml.slice(0, observer.index + valueObserver.length - 1), valueObserver, modifiedHtml.slice(observer.index + valueObserver.length)].join('');
            } else {
              modifiedHtml = [modifiedHtml.slice(0, observer.index), valueObserver, modifiedHtml.slice(observer.index + 1)].join('');
            }
            valueObserverCount++;
          }
        });
        return modifiedHtml;
      };

      html = insertValueObserverTags(html);

      var compileTemplate = function compileTemplate(html, items, observers, identifier) {
        var compiled = '';
        items.forEach(function (item) {
          var template = html;
          template = setIdentifier(template, identifier, item[identifier]);

          if (observers.length > 0) {
            observers.forEach(function (observer) {
              observer.value = item[observer.name];
              var closingTagIndex = template.indexOf('>', observer.index);
              var observerAttr = ' data-ammo-observer="' + observer.name + '"';

              if (!observer.isAttr) {
                template = template.replace(new RegExp(valueObserver), observerAttr + '>');
                template = template.replace(new RegExp(observerTag.start + observer.name + observerTag.end, 'g'), item[observer.name]);
              } else {
                template = [template.slice(0, closingTagIndex), observerAttr, template.slice(closingTagIndex)].join('');
                template = template.replace(new RegExp(observerTag.start + observer.name + observerTag.end, 'g'), item[observer.name]);
              }
            });
          }
          compiled += template;
        });
        return compiled.replace(/{/g, '').replace(/}/g, '');
      };
      compiled = compileTemplate(html, items, observers, identifier);

      return {
        render: function render(domTarget, callback) {
          domTarget.innerHTML = compiled;
          if (isFunc(callback)) {
            callback();
          }
        },
        updateVal: function updateVal(key, name, value) {
          selectAll('[' + dataAttr.id + '="' + identifier + '"][' + dataAttr.idValue + '="' + key.toLowerCase() + '"]').each(function (el) {
            selectAll('[' + dataAttr.observer + '="' + name + '"]', el).each(function (observer) {
              return observer.innerHTML = value;
            });
          });
        },
        updateAttr: function updateAttr(key, name, value) {
          var internalObserver = observers.filter(function (observer) {
            return observer.name === name;
          })[0];
          selectAll('[' + dataAttr.id + '="' + identifier + '"][' + dataAttr.idValue + '="' + key.toLowerCase() + '"]').each(function (el) {
            selectAll('[' + dataAttr.observer + '="' + name + '"]', el).each(function (observer) {
              return observer.setAttribute(internalObserver.attr, value);
            });
          });
        },
        getId: function getId(item) {
          return item.getAttribute(dataAttr.id);
        },
        getIdValue: function getIdValue(item) {
          return item.getAttribute(dataAttr.idValue);
        }
      };
    };

    /**
    * @description AJAX API based on XMLHttpRequest
    * @param options
    */
    var request = function request(options) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            options.callback(null, JSON.parse(xhr.responseText));
          } else {
            options.callback(xhr.responseText, null);
          }
        }
      };
      xhr.open(options.type || 'GET', options.url);
      if (options.data) {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        var params = [];
        var dataKeys = getKeys(options.data);
        dataKeys.forEach(function (k) {
          params.push(k + '=' + options.data[k]);
        });
        xhr.send(params.join('&'));
      } else {
        xhr.send();
      }
    };

    /**
    * @description Local storage API
    * @param key
    * @returns {*}
    */
    var store = function store(key) {
      var storage = void 0;
      if (!isStr(key)) {
        return new Error("[Storage] Invalid storage key. Provide a key {string}.");
      }

      var storageTemplates = {
        localStorage: {
          getStorage: function getStorage() {
            return localStorage;
          },
          setStorageItem: function setStorageItem(key, value) {
            this.getStorage().setItem(key, value);
          },
          getStorageItem: function getStorageItem(key) {
            return this.getStorage().getItem(key);
          },
          removeStorageItem: function removeStorageItem(key) {
            this.getStorage().removeItem(key);
          }
        }
      };
      storage = storageTemplates.localStorage;

      var decodeData = function decodeData(data) {
        return JSON.parse(data);
      };
      var encodeData = function encodeData(data) {
        return JSON.stringify(data);
      };
      var _getData = function _getData(key) {
        return decodeData(storage.getStorageItem(key));
      };
      var _setData = function _setData(key, data) {
        storage.setStorageItem(key, encodeData(data));
      };
      var _removeData = function _removeData(key) {
        storage.removeStorageItem(key);
      };

      return {
        getData: function getData() {
          var data = _getData(key);
          return data !== null ? _getData(key) : undefined;
        },
        setData: function setData(newData) {
          _setData(key, newData);
          return this;
        },
        removeData: function removeData() {
          _removeData(key);
          return this;
        },
        getItem: function getItem(itemKey) {
          var data = this.getData();
          return data[itemKey];
        },
        setItem: function setItem(itemKey, itemValue) {
          var data = this.getData();
          data[itemKey] = itemValue;
          _setData(key, data);
          return this;
        },
        removeItem: function removeItem(itemKey) {
          var data = this.getData();
          data[itemKey] = undefined;
          _setData(key, data);
          return this;
        }
      };
    };

    /**
    * @description Create sequential execution for async functions
    * @returns {{chain: chain, execute: execute}}
    */
    var sequence = function sequence() {
      var chained = [];
      var value = void 0;
      var error = void 0;

      var chain = function chain(func) {
        if (chained) {
          chained.push(func);
        }
        return this;
      };
      var execute = function execute() {
        var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

        var callback = void 0;
        if (!chained || index >= chained.length) {
          return true;
        }

        callback = chained[index];
        callback({
          resolve: function resolve(_value) {
            value = _value;
            error = null;
            execute(++index);
          },
          reject: function reject(_error) {
            error = _error;
            value = null;
            execute(++index);
          },
          response: {
            value: value,
            error: error
          }
        });
      };

      return { chain: chain, execute: execute };
    };

    /**
    * @description Determine type checker
    * @param type
    * @returns {*}
    */
    var determineTypeChecker = function determineTypeChecker(type) {
      switch (type) {
        case 'number':
          return isNum;
        case 'object':
          return isObj;
        case 'null':
          return isNull;
        case 'function':
          return isFunc;
        case 'array':
          return isArr;
        case 'string':
          return isStr;
        case 'undefined':
          return isUndef;
        case 'bool':
          return isBool;
        default:
          return isUndef;
      }
    };

    /**
    * @description Set strong typed object
    * @param config
    * @returns {*}
    */
    var setStrongTypedObject = function setStrongTypedObject(config) {
      var proxy = {};
      eachKey(config, function (obj, key) {
        return proxy[key] = obj.value;
      });

      return new Proxy(proxy, {
        get: function get(target, prop) {
          return target[prop];
        },
        set: function set(target, prop, value) {
          var type = config[prop].type;
          var typeChecker = determineTypeChecker(type);

          if (!typeChecker(value)) {
            throw new Error('[Ammo.StrongType] Invalid type. Expected type for field {' + prop + '} is {' + type + '}');
          }

          target[prop] = value;
          return true;
        }
      });
    };

    /**
    * @description Create encapsulated, augmentative, object-based application
    * @param {object} props
    * @param {object} store
    * @returns {Error}
    */
    var app = function app(props, store) {
      var hasStore = isObj(store);
      var hasProps = isObj(props);
      var isGlobal = hasProps && isBool(props.global) && props.global;
      var isStoreStrongTyped = hasProps && isBool(props.strongTypes) && props.strongTypes;

      if (isGlobal && !hasProps || isGlobal && hasProps && isUndef(props.name)) {
        throw new Error('[Ammo.app] Invalid initialization. Global applications require a name. Pass a name as part of the app\'s props.');
      }
      var app = {
        props: hasProps ? props : {},
        store: hasStore ? isStoreStrongTyped ? setStrongTypedObject(store) : store : {},
        nodes: {}
      };
      var schemas = {
        'default': ['events', 'renderers', 'actions'],
        app: ['events', 'actions', 'core', 'modules', 'widgets'],
        module: ['events', 'renderers', 'actions', 'ui', 'views'],
        widget: ['events', 'renderers', 'actions', 'ui']
      };
      var storage = void 0;
      var history = void 0;
      var date = new Date();

      var factory = function factory() {
        var augment = function augment(nodeFamily) {
          var nodes = app.nodes;
          var families = !isArr(nodeFamily) ? [nodeFamily] : nodeFamily;
          families.map(function (family) {
            if (!hasProp(nodes, family)) {
              nodes[family] = {};
            }
          });
          return this;
        };

        var addSchema = function addSchema(schemaName, schema) {
          if (!hasProp(schemas, schemaName) && isArr(schema)) {
            schemas[schemaName] = schema;
          }
          return this;
        };

        var schema = function schema(_schema) {
          if (hasProp(schemas, _schema)) {
            augment(schemas[_schema]);
          }
          return this;
        };

        var addNode = function addNode(nodeFamily, nodeName, func) {
          var nodes = app.nodes;
          if (hasProp(nodes, nodeFamily) && !hasProp(nodes[nodeFamily], nodeName) && isFunc(func)) {
            nodes[nodeFamily][nodeName] = func;
          }
          return this;
        };

        var getNode = function getNode(nodeFamily, nodeName) {
          var nodes = app.nodes;
          if (hasProp(nodes, nodeFamily) && hasProp(nodes[nodeFamily], nodeName) && isFunc(nodes[nodeFamily][nodeName])) {
            return nodes[nodeFamily][nodeName];
          } else {
            return false;
          }
        };

        var callNode = function callNode(nodeFamily, nodeName, params) {
          var nodeParams = !isUndef(params) ? params : {};
          var node = getNode(nodeFamily, nodeName);
          if (node) {
            node(nodeParams);
          }
          return this;
        };

        var getNodes = function getNodes(nodeFamily) {
          return nodeFamily && hasProp(app.nodes, nodeFamily) ? app.nodes[nodeFamily] : app.nodes;
        };

        var configure = function configure(nodeFamily) {
          var nodes = app.nodes;
          if (hasProp(nodes, nodeFamily)) {
            return {
              node: function node(nodeName, func) {
                addNode(nodeFamily, nodeName, func);
                return this;
              },
              configure: configure
            };
          }
          return false;
        };

        var nodeExists = function nodeExists(nodeFamily, nodeName) {
          return hasProp(app.nodes, nodeFamily) && isFunc(app.nodes[nodeFamily][nodeName]);
        };

        var getProps = function getProps(name) {
          var props = app.props;
          return hasProp(props, name) ? props[name] : props;
        };

        var inherit = function inherit(app, nodeFamilies) {
          var nodes = app.getNodes();

          eachKey(nodes, function (nodeFamily, familyName) {
            if (nodeFamilies && nodeFamilies.indexOf(familyName) === -1) {
              return false;
            }
            augment(familyName);
            eachKey(nodeFamily, function (node, nodeName) {
              return addNode(familyName, nodeName, node);
            });
          });
          return this;
        };

        var overwrite = function overwrite(nodeFamily) {
          var nodes = app.nodes;
          if (hasProp(nodes, nodeFamily)) {
            return {
              node: function node(nodeName, func) {
                nodes[nodeFamily][nodeName] = func;
                return this;
              },
              overwrite: this.overwrite
            };
          }
          return false;
        };

        var getStore = function getStore(storeKey) {
          var store = app.store;
          return hasProp(store, storeKey) ? store[storeKey] : store;
        };

        var updateStore = function updateStore(storeKey, handler) {
          var store = app.store;

          if (!hasProp(store, storeKey)) {
            return false;
          }

          var modifiedStoreData = handler(store[storeKey]);
          store[storeKey] = modifiedStoreData;

          if (storage && storage.getData()) {
            storage.setItem(storeKey, modifiedStoreData);
          }
        };

        var syncWithPersistentStore = function syncWithPersistentStore() {
          if (isUndef(app.props.storeKey)) {
            throw new Error('[Ammo.app] Invalid synchronization with persistent storage. Synchronized apps require a store key. Pass a store key as part of the app\'s props.');
          }
          storage = base.ammo.store(app.props.storeKey);

          if (!storage.getData()) {
            storage.setData(app.store);
          } else {
            var dataKeys = getKeys(storage.getData());
            if (dataKeys.length > 0) {
              eachKey(storage.getData(), function (data, storeKey) {
                return updateStore(storeKey, function () {
                  return data;
                });
              });
            }
          }
          return this;
        };

        var clearPersistentStore = function clearPersistentStore() {
          if (!storage) {
            return false;
          }
          storage.setData({});
        };

        var getPersistentStore = function getPersistentStore(storeKey) {
          if (!storage) {
            return false;
          }
          var data = storage.getData();
          return isStr(storeKey) && data ? storage.getItem(storeKey) : data;
        };

        var createInstance = function createInstance() {
          return {
            schema: schema,
            addSchema: addSchema,
            augment: augment,
            configure: configure,
            addNode: addNode,
            getNode: getNode,
            callNode: callNode,
            nodeExists: nodeExists,
            getNodes: getNodes,
            getProps: getProps,
            inherit: inherit,
            overwrite: overwrite,
            getStore: getStore,
            updateStore: updateStore,
            syncWithPersistentStore: syncWithPersistentStore,
            clearPersistentStore: clearPersistentStore,
            getPersistentStore: getPersistentStore
          };
        };

        return createInstance();
      };

      var setGlobal = function setGlobal(instance) {
        return base[app.props.name] = base[app.props.name] || instance;
      };

      if (isGlobal) {
        setGlobal(factory());
        return base[app.props.name];
      } else {
        return factory();
      }
    };

    /**
    * @description Set style property for given node
    * @param selection
    * @param index
    * @param prop
    * @param value
    */
    var _style = function _style(selection, prop, value, index) {
      selection.style.setProperty(prop, isFunc(value) ? value(selection, index) || selection.style.getProperty(prop) : value, '');
    };

    /**
    * @description Set attribute property for given node
    * @param selection
    * @param prop
    * @param value
    * @param index
    */
    var _attr = function _attr(selection, prop, value, index) {
      var currValue = selection.getAttribute(prop);
      selection.setAttribute(prop, isFunc(value) ? value(selection, currValue, index) || currValue : value);
    };

    /**
    * @description Set innerHTML for given node
    * @param selection
    * @param value
    * @param index
    */
    var elText = function elText(selection, value, index) {
      selection.innerHTML = isFunc(value) ? value(selection.innerHTML, index) || selection.innerHTML : value;
    };

    /**
    * @description Filter nodes
    * @param selection
    * @param value
    * @param selector
    * @param index
    * @returns {*}
    */
    var filterNodes = function filterNodes(selection, value, selector, index) {
      if (isFunc(value)) {
        return value(selection, index);
      }
      if (isStr(value)) {
        if (value.indexOf(':') === -1) {
          return selection.classList.contains(value);
        }

        var matches = selection.parentNode.querySelectorAll('' + selector + value);
        var isMatch = false;
        _each(matches, function (el) {
          if (el.isSameNode(selection) && !isMatch) {
            isMatch = true;
          }
        });
        return isMatch;
      }
    };

    /**
    * @description DOM manipulation API for single node
    * @param selector
    * @param context
    * @returns {object}
    */
    var select = function select(selector, context) {
      var selection = isStr(selector) ? getEl(selector, context) : selector;
      return {
        find: function find(findSelector) {
          selection = getEl(findSelector, selection);
          return this;
        },
        text: function text(value) {
          elText(selection, value, 0);
          return this;
        },
        style: function style(prop, value) {
          _style(selection, prop, value, 0);
          return this;
        },
        attr: function attr(prop, value) {
          _attr(selection, prop, value, 0);
          return this;
        },
        data: function data(_data) {
          selection.innerHTML = _data;
          return this;
        },
        on: function on(event, callback) {
          selection.addEventListener(event, callback);
          return this;
        },

        get: function get() {
          return selection;
        }
      };
    };

    /**
    * @description DOM manipulation API for node lists
    * @param selector
    * @param context
    * @returns {object}
    */
    var selectAll = function selectAll(selector, context) {
      var selection = isStr(selector) ? getEls(selector, context) : selector;
      var filtered = void 0;

      return {
        filter: function filter(value) {
          filtered = [];
          _each(selection, function (el, index) {
            if (filterNodes(el, value, selector, index)) {
              filtered.push(el);
            }
          });
          selection = filtered;
          return this;
        },
        find: function find(findSelector) {
          if (filtered) {
            filtered = getEls(findSelector, filtered.firstChild);
          } else {
            selection = getEls(findSelector, selection.firstChild);
          }
          return this;
        },
        text: function text(value) {
          _each(filtered || selection, function (el, index) {
            return elText(el, value, index);
          });
          return this;
        },
        style: function style(prop, value) {
          _each(filtered || selection, function (el, index) {
            return _style(el, prop, value, index);
          });
          return this;
        },
        attr: function attr(prop, value) {
          _each(filtered || selection, function (el, index) {
            return _attr(el, prop, value, index);
          });
          return this;
        },
        data: function data(_data2) {
          _each(filtered || selection, function (el, index) {
            return el.innerHTML = _data2[index];
          });
          return this;
        },
        on: function on(event, callback) {
          _each(filtered || selection, function (el) {
            return el.addEventListener(event, callback);
          });
          return this;
        },
        each: function each(handler) {
          _each(filtered || selection, handler);
          return this;
        },
        eq: function eq(index) {
          var nodes = filtered || selection;
          return nodes.length > 0 && isObj(nodes[index]) ? nodes[index] : undefined;
        },
        index: function index(indexSelector) {
          var matchIndex = -1;
          _each(filtered || selection, function (el, index) {
            if (el.classList.contains(indexSelector) && matchIndex === -1) {
              matchIndex = index;
            }
          });
          return matchIndex;
        },
        async: function async(handler, complete) {
          var sequencer = sequence();

          _each(filtered || selection, function (el, index) {
            sequencer.chain(function (seq) {
              return handler(seq.resolve, el, index);
            });
          });

          if (isFunc(complete)) {
            sequencer.chain(function () {
              return complete();
            });
          }

          sequencer.execute();
          return this;
        },

        get: function get() {
          return filtered || selection;
        }
      };
    };

    /**
    * Public API
    */
    return {
      onDomReady: onDomReady,
      onHover: onHover,
      delegateEvent: delegateEvent,
      filterClass: filterClass,
      remove: remove,
      filter: filter,
      jsonCopy: jsonCopy,
      getEl: getEl,
      getEls: getEls,
      isHovered: isHovered,
      appendAfter: appendAfter,
      appendBefore: appendBefore,
      prependAfter: prependAfter,
      prependBefore: prependBefore,
      removeEl: removeEl,
      each: _each,
      isObj: isObj,
      isNull: isNull,
      isNum: isNum,
      isFunc: isFunc,
      isArr: isArr,
      isStr: isStr,
      isUndef: isUndef,
      isBool: isBool,
      hasProp: hasProp,
      hasMethod: hasMethod,
      hasKey: hasKey,
      getKeys: getKeys,
      eachKey: eachKey,
      getUrlParam: getUrlParam,
      randomInclusive: randomInclusive,
      recurIter: recurIter,
      poll: poll,
      buffer: buffer,
      extend: extend,
      template: template,
      request: request,
      store: store,
      sequence: sequence,
      app: app,
      select: select,
      selectAll: selectAll,
      setStrongTypedObject: setStrongTypedObject,
      convertByType: convertByType
    };
  }();
})(window);
;'use strict';

/* globals ammo */

/**
* App entrypoint
*/

(function () {
  'use strict';

  var props = {
    name: 'initialzr',
    global: true
  };

  var app = ammo.app(props).schema('app');

  app.configure('events').node('onReady', function (callback) {
    return ammo.onDomReady(callback);
  });

  app.configure('actions').node('init', function () {
    var _app$getNodes = app.getNodes(),
        events = _app$getNodes.events,
        core = _app$getNodes.core;

    events.onReady(function () {
      return core.router();
    });
  });

  app.callNode('actions', 'init');
})();
;'use strict';

/* globals initialzr */

/**
* Core: Global Events
*/

initialzr.addNode('core', 'globalEvents', function () {
  'use strict';

  var eventPrefix = 'initialzr';

  var VIEW_LOADING = 'VIEW_LOADING';
  var VIEW_READY = 'VIEW_READY';
  var MODULE_READY = 'MODULE_READY';
  var MODULE_CHANGE = 'MODULE_CHANGE';
  var WIDGET_READY = 'WIDGET_READY';
  var WIDGET_CHANGE = 'WIDGET_CHANGE';

  /**
  * @description Dispatch event
  * @param type
  * @param options
  * @returns {*}
  */
  var dispatchEvent = function dispatchEvent(type) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    switch (type) {
      case VIEW_LOADING:
        return document.dispatchEvent(new Event(eventPrefix + '.view.loading'));
      case VIEW_READY:
        return document.dispatchEvent(new Event(eventPrefix + '.view.ready'));
      case MODULE_READY:
        return document.dispatchEvent(new Event(eventPrefix + '.module.' + options.moduleName + '.ready'));
      case MODULE_CHANGE:
        return document.dispatchEvent(new Event(eventPrefix + '.module.' + options.moduleName + '.ready'));
      case WIDGET_READY:
        return document.dispatchEvent(new Event(eventPrefix + '.widget.' + options.widgetName + '.ready'));
      case WIDGET_CHANGE:
        return document.dispatchEvent(new Event(eventPrefix + '.widget.' + options.widgetName + '.change', [options.state]));
      default:
        return false;
    }
  };

  /**
  * @description Intercept event
  * @param type
  * @param options
  * @returns {*}
  */
  var interceptEvent = function interceptEvent(type) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    switch (type) {
      case VIEW_LOADING:
        return document.addEventListener(eventPrefix + '.view.loading', options.callback);
      case VIEW_READY:
        return document.addEventListener(eventPrefix + '.view.ready', options.callback);
      case MODULE_READY:
        return document.addEventListener(eventPrefix + '.module.' + options.moduleName + '.ready', options.callback);
      case MODULE_CHANGE:
        return document.addEventListener(eventPrefix + '.module.' + options.moduleName + '.ready', options.callback);
      case WIDGET_READY:
        return document.addEventListener(eventPrefix + '.widget.' + options.widgetName + '.ready', options.callback);
      case WIDGET_CHANGE:
        return document.addEventListener(eventPrefix + '.widget.' + options.widgetName + '.change', options.callback);
      default:
        return false;
    }
  };

  return {
    dispatchViewLoading: function dispatchViewLoading() {
      dispatchEvent(VIEW_LOADING);
      return this;
    },
    interceptViewLoading: function interceptViewLoading(callback) {
      interceptEvent(VIEW_LOADING, { callback: callback });
      return this;
    },
    dispatchViewReady: function dispatchViewReady() {
      dispatchEvent(VIEW_READY);
      return this;
    },
    interceptViewReady: function interceptViewReady(callback) {
      interceptEvent(VIEW_READY, { callback: callback });
      return this;
    },
    dispatchModuleReady: function dispatchModuleReady(moduleName) {
      dispatchEvent(MODULE_READY, { moduleName: moduleName });
      return this;
    },
    interceptModuleReady: function interceptModuleReady(moduleName, callback) {
      interceptEvent(MODULE_READY, { moduleName: moduleName, callback: callback });
      return this;
    },
    dispatchModuleChange: function dispatchModuleChange(moduleName, state) {
      dispatchEvent(MODULE_CHANGE, { moduleName: moduleName, state: state });
      return this;
    },
    interceptModuleChange: function interceptModuleChange(moduleName, callback) {
      interceptEvent(MODULE_CHANGE, { moduleName: moduleName, callback: callback });
      return this;
    },
    dispatchWidgetReady: function dispatchWidgetReady(widgetName) {
      dispatchEvent(WIDGET_READY, { widgetName: widgetName });
      return this;
    },
    interceptWidgetReady: function interceptWidgetReady(widgetName, callback) {
      interceptEvent(WIDGET_READY, { widgetName: widgetName, callback: callback });
      return this;
    },
    dispatchWidgetChange: function dispatchWidgetChange(widgetName, state) {
      dispatchEvent(WIDGET_CHANGE, { widgetName: widgetName, state: state });
      return this;
    },
    interceptWidgetChange: function interceptWidgetChange(widgetName, callback) {
      interceptEvent(WIDGET_CHANGE, { widgetName: widgetName, callback: callback });
      return this;
    }
  };
});
;'use strict';

/* globals ammo, initialzr */

/**
* Core: Router
*/

initialzr.addNode('core', 'manager', function () {
  'use strict';

  var props = {};
  var store = { processed: [] };
  var module = ammo.app(props, store).schema('default');

  var widgets = initialzr.getNodes('widgets');
  var globalEvents = initialzr.getNode('core', 'globalEvents')();

  module.configure('actions').node('normalizeProps', function (props) {
    var normalizedProps = {};
    ammo.eachKey(props, function (val, key) {
      return normalizedProps[key] = ammo.convertByType(val);
    });

    return normalizedProps;
  }).node('initWidgets', function (viewState, domWidgets, widgets, normalizeProps) {
    var processed = module.getStore('processed');

    ammo.selectAll(domWidgets).each(function (widget) {
      var props = normalizeProps(widget.dataset);
      var widgetName = props.widget;

      if (ammo.hasMethod(widgets, widgetName)) {

        // check if widget is unique for the current view
        props.isUnique = processed.indexOf(widgetName) === -1;

        // invoke widget with its dom node and props
        widgets[widgetName](widget, props);

        // update store
        processed.push(widgetName);
        module.updateStore('processed', function () {
          return processed;
        });
      }
    });
  }).node('monitorWidgets', function () {
    var actions = module.getNodes('actions');

    globalEvents.interceptViewLoading(function () {
      var domWidgets = ammo.selectAll('[data-widget]').filter(function (widget) {
        return widget.getAttribute('data-show-on');
      }).get();

      actions.initWidgets('loading', domWidgets, widgets, actions.normalizeProps);
    });

    globalEvents.interceptViewReady(function () {
      module.updateStore('processed', function () {
        return [];
      });
      var domWidgets = ammo.selectAll('[data-widget]').filter(function (widget) {
        return !widget.getAttribute('data-show-on');
      }).get();

      actions.initWidgets('ready', domWidgets, widgets, actions.normalizeProps);
    });
  }).node('removeModules', function () {
    var persistentModules = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    ammo.selectAll('[data-module]').filter(function (module) {
      return persistentModules.indexOf(module.getAttribute('data-module')) === -1;
    }).each(function (module) {
      return ammo.removeEl(module);
    });
  }).node('domContainsModule', function (moduleName) {
    var module = ammo.select('[data-module="' + moduleName + '"]').get();
    return ammo.isObj(module);
  }).node('getViewName', function () {
    var view = ammo.select('[data-module][data-view]').get();
    return view.getAttribute('data-module');
  }).node('notifyBodyUponViewLoading', function (getViewName) {
    globalEvents.interceptViewLoading(function () {
      var viewName = getViewName();
      var body = ammo.select('body').get();
      body.setAttribute('data-view', viewName);
    });
  });

  return {
    monitorWidgets: function monitorWidgets() {
      module.getNode('actions', 'monitorWidgets')();
      return this;
    },
    removeModules: function removeModules(persistentModules) {
      module.getNode('actions', 'removeModules')(persistentModules);
      return this;
    },
    notifyBodyUponViewLoading: function notifyBodyUponViewLoading() {
      module.getNode('actions', 'notifyBodyUponViewLoading')(module.getNode('actions', 'getViewName'));
      return this;
    },

    domContainsModule: module.getNode('actions', 'domContainsModule'),
    getViewName: module.getNode('actions', 'getViewName')
  };
});
;'use strict';

/* globals initialzr, router */

/**
* Core: Router
*/

initialzr.addNode('core', 'router', function () {
  'use strict';

  var modules = initialzr.getNodes('modules');
  var manager = initialzr.getNode('core', 'manager')();
  var persistentModules = ['header'];

  router.init().poll(150).beforeRoute(function () {
    manager.removeModules(persistentModules);

    if (!manager.domContainsModule('header')) {
      modules.header();
      manager.monitorWidgets().notifyBodyUponViewLoading();
    }
  }).afterRoute(modules.footer).route('/', modules.dashboard).route('/login', modules.login).route('/settings', modules.settings);
});
;'use strict';

/* globals initialzr */

/**
* Core: Version
*/

initialzr.addNode('core', 'version', function () {
  'use strict';

  return {
    version: '0.0.1',
    revision: 1
  };
});
;'use strict';

/* globals initialzr, ammo */

/**
* Module: Base
*/

initialzr.addNode('modules', 'base', function (options) {
  'use strict';

  var module = ammo.app().schema('module');

  module.configure('ui').node('index', function () {
    return '\n<div data-module="' + options.name + '">\n<span class="title">Module [' + options.name.toUpperCase() + ']</span>\n</div>\n';
  });

  module.configure('renderers').node('render', function (ui) {
    var target = ammo.select('[data-app]').get();
    ammo.appendBefore(ui, target);
  }).node('renderTitle', function (ui) {
    var domModule = ammo.select('[data-module="' + options.name + '"').get();
    ammo.appendBefore(ui, domModule);
  });

  module.configure('actions').node('init', function () {
    var _module$getNodes = module.getNodes(),
        ui = _module$getNodes.ui,
        renderers = _module$getNodes.renderers;

    var indexUI = ui.index();

    renderers.render(indexUI);
  });

  return module;
});
;'use strict';

/* globals initialzr */

/**
* Module: Dashboard
*/

initialzr.addNode('modules', 'dashboard', function () {
  'use strict';

  var module = initialzr.getNode('modules', 'base')({ name: 'dashboard' });
  var globalEvents = initialzr.getNode('core', 'globalEvents')();
  var manager = initialzr.getNode('core', 'manager')();

  module.configure('ui').node('title', function (title) {
    return '<span class="title">' + title.toUpperCase() + '</span>';
  });

  module.overwrite('ui').node('index', function () {
    return '\n<main data-module="dashboard" data-view>\n<div data-widget="loader" data-show-on="loading"></div>\n</main>\n';
  });

  module.overwrite('actions').node('init', function () {
    var _module$getNodes = module.getNodes(),
        ui = _module$getNodes.ui,
        renderers = _module$getNodes.renderers;

    var htmlTemplate = ui.index();

    renderers.render(htmlTemplate);

    // simulate loading
    setTimeout(function () {
      var hasModule = manager.domContainsModule('dashboard');
      if (!hasModule) {
        return false;
      }
      var titleUI = ui.title('dashboard');
      renderers.renderTitle(titleUI);

      globalEvents.dispatchViewReady();
    }, 1500);
  });

  module.callNode('actions', 'init');
});
;'use strict';

/* globals initialzr */

initialzr.addNode('modules', 'footer', function () {
  'use strict';

  var module = initialzr.getNode('modules', 'base')({ name: 'footer' });
  var globalEvents = initialzr.getNode('core', 'globalEvents')();

  module.configure('ui').node('navigation', function (items) {
    return '\n<nav>\n<div data-widget="navigation" data-show-on="loading">\n' + items.map(function (item) {
      return '\n<div class="item" data-href="' + item.url + '">' + item.name + '</div>\n';
    }).join('') + '\n</div>\n</nav>\n';
  });

  module.overwrite('ui').node('index', function (navigationUI) {
    return '<footer data-module="footer">' + navigationUI + '</footer>';
  });

  module.overwrite('actions').node('getNavigationItems', function () {
    return [{ name: 'Home', url: '/' }, { name: 'Login', url: '/login' }, { name: 'Settings', url: '/settings' }];
  }).node('init', function () {
    var _module$getNodes = module.getNodes(),
        ui = _module$getNodes.ui,
        renderers = _module$getNodes.renderers,
        actions = _module$getNodes.actions;

    var navigationItems = actions.getNavigationItems();
    var navigationUI = ui.navigation(navigationItems);
    var indexUI = ui.index(navigationUI);

    renderers.render(indexUI);
    globalEvents.dispatchViewLoading();
  });

  module.callNode('actions', 'init');
});
;'use strict';

/* globals initialzr, ammo */

/**
* Module: Header
*/

initialzr.addNode('modules', 'header', function () {
  'use strict';

  var module = initialzr.getNode('modules', 'base')({ name: 'header' });

  module.configure('ui').node('button', function () {
    return '\n<button class="trigger toggle-menu">\n<span class="icon fa fa-bars"></span>\n</button>\n';
  }).node('navigation', function (items) {
    return '\n<nav>\n<div data-widget="navigation" data-show-on="ready">\n' + items.map(function (item) {
      return '\n<div class="item" data-href="' + item.url + '">' + item.name + '</div>\n';
    }).join('') + '\n</div>\n</nav>\n';
  });

  module.overwrite('ui').node('index', function (buttonUI, navigationUI) {
    return '\n<header data-module="header">\n' + buttonUI + '\n' + navigationUI + '\n</header>\n';
  });

  module.configure('events').node('onToggleMenu', function (callback) {
    return ammo.delegateEvent('click', '.trigger.toggle-menu', callback);
  }).node('onResize', function (callback) {
    return window.addEventListener('resize', callback);
  });

  module.configure('renderers').node('toggleMenu', function (event) {
    var button = event.target;
    var nav = ammo.select('[data-module="header"] nav').get();
    var navHeight = nav.clientHeight;
    var isActive = button.classList.contains('active');

    if (!isActive) {
      ammo.select(nav).style('top', '-' + navHeight + 'px');
      nav.classList.add('active');
      button.classList.add('active');
    } else {
      ammo.select(nav).style('top', 0 + 'px');
      nav.removeAttribute('class');
      button.classList.remove('active');
    }
  }).node('resizeHeader', function () {
    var width = window.innerWidth;
    var mobileWidth = 640;

    if (width >= mobileWidth) {
      var nav = ammo.select('[data-module="header"] nav').get();
      var button = ammo.select('.trigger.toggle-menu').get();

      ammo.select(nav).style('top', '0px');
      nav.removeAttribute('class');
      button.classList.remove('active');
    }
  });

  module.configure('actions').node('getNavigationItems', function () {
    return [{ name: 'Home', url: '/' }, { name: 'Login', url: '/login' }, { name: 'Settings', url: '/settings' }];
  });

  module.overwrite('actions').node('init', function () {
    var _module$getNodes = module.getNodes(),
        ui = _module$getNodes.ui,
        events = _module$getNodes.events,
        renderers = _module$getNodes.renderers,
        actions = _module$getNodes.actions;

    var navigationItems = actions.getNavigationItems();
    var buttonUI = ui.button();
    var navigationUI = ui.navigation(navigationItems);
    var indexUI = ui.index(buttonUI, navigationUI);
    var buffer = ammo.buffer();

    renderers.render(indexUI);
    events.onToggleMenu(renderers.toggleMenu);
    events.onResize(function () {
      return buffer('resize.module.header', 150, function () {
        return renderers.resizeHeader();
      });
    });
  });

  module.callNode('actions', 'init');
});
;'use strict';

/* globals initialzr, ammo */

/**
* Module: Login
*/

initialzr.addNode('modules', 'login', function () {
  'use strict';

  var module = initialzr.getNode('modules', 'base')({ name: 'login' });
  var globalEvents = initialzr.getNode('core', 'globalEvents')();
  var manager = initialzr.getNode('core', 'manager')();

  module.configure('ui').node('title', function (title) {
    return '<span class="title">' + title.toUpperCase() + '</span>';
  });

  module.overwrite('ui').node('index', function () {
    return '\n<main data-module="login" data-view>\n<div data-widget="loader" data-show-on="loading"></div>\n</main>\n';
  });

  module.overwrite('actions').node('init', function () {
    var _module$getNodes = module.getNodes(),
        ui = _module$getNodes.ui,
        renderers = _module$getNodes.renderers;

    var indexUI = ui.index();

    renderers.render(indexUI);

    // simulate loading
    setTimeout(function () {
      var hasModule = manager.domContainsModule('login');
      if (!hasModule) {
        return false;
      }

      var titleUI = ui.title('login');
      renderers.renderTitle(titleUI);

      globalEvents.dispatchViewReady();
    }, 1500);
  });

  module.callNode('actions', 'init');
});
;'use strict';

/* globals initialzr, ammo */

initialzr.addNode('modules', 'settings', function () {
  'use strict';

  var props = {
    storeKey: 'settings',
    strongTypes: true
  };
  var store = {
    settings: { type: 'object', value: {} }
  };

  var base = initialzr.getNode('modules', 'base')({ name: 'settings' });
  var module = ammo.app(props, store).schema('module').inherit(base);
  var manager = initialzr.getNode('core', 'manager')();
  var globalEvents = initialzr.getNode('core', 'globalEvents')();

  module.configure('ui').node('title', function (title) {
    return '<span class="title">' + title.toUpperCase() + '</span>';
  });

  module.overwrite('ui').node('index', function () {
    return '\n<main data-module="settings" data-view>\n<div data-widget="loader" data-show-on="loading"></div>\n</main>\n';
  });

  module.overwrite('actions').node('init', function () {
    var _module$getNodes = module.getNodes(),
        ui = _module$getNodes.ui,
        renderers = _module$getNodes.renderers;

    var indexUI = ui.index();

    renderers.render(indexUI);

    // simulate loading
    setTimeout(function () {
      var hasModule = manager.domContainsModule('settings');
      if (!hasModule) {
        return false;
      }

      var titleUI = ui.title('settings');
      renderers.renderTitle(titleUI);

      globalEvents.dispatchViewReady();
    }, 1500);
  });

  module.callNode('actions', 'init');
});
;'use strict';

/* globals initialzr, ammo */

/**
* Widget: Loader
*/

initialzr.addNode('widgets', 'loader', function (domWidget, props) {
  'use strict';

  var widget = ammo.app().schema('widget');
  var globalEvents = initialzr.getNode('core', 'globalEvents')();

  widget.configure('ui').node('index', function () {
    return '\n<div class="loader-box">\n<div class="loader"></div>\n</div>\n';
  });

  widget.configure('renderers').node('render', function (widgetHtml) {
    return domWidget.innerHTML = widgetHtml;
  }).node('show', function () {
    return domWidget.classList.add('active');
  }).node('hide', function () {
    return domWidget.classList.contains('active') && domWidget.classList.remove('active');
  });

  widget.configure('actions').node('init', function () {
    var _widget$getNodes = widget.getNodes(),
        ui = _widget$getNodes.ui,
        renderers = _widget$getNodes.renderers;

    var indexUI = ui.index();

    renderers.render(indexUI);
    renderers.show();

    globalEvents.dispatchWidgetReady(props.widget).interceptViewReady(function () {
      return renderers.hide();
    }).interceptWidgetChange(props.widget, function (event, options) {
      switch (options.type) {
        case 'show':
          return renderers.show();
        case 'hide':
          return renderers.hide();
        default:
          return false;
      }
    });
  });

  widget.callNode('actions', 'init');
});
;'use strict';

/* globals initialzr, router, ammo */

/**
* Widget: Navigation
*/

initialzr.addNode('widgets', 'navigation', function (domWidget, props) {
  'use strict';

  var widget = ammo.app().schema('widget');

  widget.configure('ui').node('index', function (items) {
    return '\n<ul class="widget-list">\n' + (!props.layout ? items.map(function (item) {
      return '\n<li class="widget-item">\n<a href="#" class="item trigger go-to" data-href="' + item.href + '">' + item.content + '</a>\n</li>\n';
    }).join('') : '') + '\n\n' + (props.layout === 'arrows' ? items.map(function (item) {
      return '\n<li class="widget-item">\n<span class="label">' + item.content + '</span>\n<a href="#" class="item trigger go-to" data-href="' + item.href + '">\n<span class="icon fa fa-chevron-right"></span>\n</a>\n</li>\n';
    }).join('') : '') + '\n</ul>\n';
  });

  widget.configure('events').node('onSelectItem', function (callback) {
    return ammo.delegateEvent('click', '.trigger.go-to', callback, domWidget);
  });

  widget.configure('renderers').node('render', function (widgetHtml) {
    return domWidget.innerHTML = widgetHtml;
  }).node('highlightItem', function (href) {
    ammo.selectAll('.trigger.go-to', domWidget).filter(function (item) {
      return item.classList.contains('active') && item.classList.remove('active');
    });

    ammo.selectAll('[data-href="' + href + '"]', domWidget).each(function (item) {
      return item.classList.add('active');
    });
  });

  widget.configure('actions').node('init', function () {
    var _widget$getNodes = widget.getNodes(),
        ui = _widget$getNodes.ui,
        events = _widget$getNodes.events,
        renderers = _widget$getNodes.renderers;

    var items = [];
    ammo.eachKey(ammo.selectAll('.item', domWidget).get(), function (item) {
      items.push({
        href: item.getAttribute('data-href'),
        content: item.innerHTML
      });
    });

    var indexUI = ui.index(items);
    renderers.render(indexUI);

    events.onSelectItem(function (event) {
      event.preventDefault();
      var target = event.target.getAttribute('data-href');

      if (target) {
        return router.go('' + target);
      }
    });

    var currentRoute = router.getCurrentRoute();

    ammo.selectAll('.trigger.go-to', domWidget).filter(function (item) {
      return item.getAttribute('data-href') === currentRoute;
    }).each(function (item) {
      return renderers.highlightItem(item.getAttribute('data-href'));
    });
  });

  widget.callNode('actions', 'init');
});
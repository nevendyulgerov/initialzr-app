/* globals ammo */

/**
 * Lib: Router
 */

(base => {
  'use strict';

  base.router = (() => {
    let routes = [];
    let currentRoute = null;
    const err = errText => {
      throw new Error(`[Initialzr][Lib][Router]: ${errText}.`);
    };
    let notRoutedPaths = {
      action() {
        err('No routes found');
      }
    };
    let _currentRoute = null;
    let initialRoute = null;
    let beforeRouteCallback = () => {};
    let afterRouteCallback = () => {};
    let notFoundCallback = () => {};

    const addRoute = (path = '', action = () => {}) => {
      if (!ammo.isStr(path)) {
        err('Route path must be of type {string}');
      }

      if (!ammo.isFunc(action)) {
        err('Route action must be of type {function}.');
      }

      routes.push({path, action});
    };

    const go = path => window.location.href = `${initialRoute}${path}`;

    const updateBeforeRoute = callback => {
      beforeRouteCallback = ammo.isFunc(callback) ? callback : beforeRouteCallback;
    };

    const updateAfterRoute = callback => {
      afterRouteCallback = ammo.isFunc(callback) ? callback : afterRouteCallback;
    };

    const updateNotFoundRoute = callback => {
      notFoundCallback = ammo.isFunc(callback) ? callback : notFoundCallback;
    };

    const notFound = options => {
      notRoutedPaths = options;
    };

    const checkForRoute = () => {
      let isMatch = false;
      let route = null;
      let current_params = currentRoute.split('/');

      beforeRouteCallback();

      for (let r = 0; r < routes.length; r++) {
        let routedParams = routes[r].path.split('/');

        if (current_params.length === routedParams.length) {
          let isParamsMatch = true;
          for (let i = 0; i < current_params.length; i++) {
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
        notFoundCallback();
      } else {
        executeRouteAction(route);
      }
      afterRouteCallback();
    };

    const executeRouteAction = route => {
      _currentRoute = route;

      const params = parseParams(route.path);
      const query = getRoute();

      if (route.action) {
        route.action(params, query);
      }
    };

    const parseParams = route => {
      let routedPath = route.split('/');
      let params = {};
      let temp = [];

      for (let i = 0; i < routedPath.length; i++) {
        if (routedPath[i][0] === ':') {
          temp.push({
            index: i,
            name: routedPath[i].slice(1, routedPath[i].length)
          });
        }
      }

      for (let j = 0; j < temp.length; j++) {
        params[temp[j].name] = getRoute().split('/')[temp[j].index];
      }

      return params;
    };

    const getRoute = () => {
      const match = window.location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    };

    const listener = pollInterval => {
      let current = currentRoute;

      ammo.poll(resolve => {
        if (current !== getRoute()) {
          if (_currentRoute) {
            _currentRoute = null;
          }

          current = getRoute();
          currentRoute = getRoute();
          checkForRoute();
        }
        resolve(true);
      }, () => {
      }, pollInterval);
    };

    const initRouter = () => {
      initialRoute = window.location.pathname;

      if (!window.location.href.match(/#(.*)$/)) {

        if (initialRoute.substr(initialRoute.length - 1) !== '/') {
          initialRoute = `${initialRoute}/`;
        }

        window.location.href = `${initialRoute}#/`;
      }
      initialRoute = `${initialRoute}#`;
    };

    const pollRouter = (pollInterval = 100) => {
      if (!ammo.isNum(pollInterval)) {
        err('Poll interval must be of type {number}');
      }

      listener(pollInterval);
    };

    const getCurrentRoute = () => currentRoute;
    const getInitialRoute = () => initialRoute;

    return {
      init() {
        initRouter();
        return this;
      },
      route(path, action) {
        addRoute(path, action);
        return this;
      },
      go,
      notFound,
      getCurrentRoute,
      getInitialRoute,
      beforeRoute(callback) {
        updateBeforeRoute(callback);
        return this;
      },
      afterRoute(callback) {
        updateAfterRoute(callback);
        return this;
      },
      notFoundRoute(callback) {
        updateNotFoundRoute(callback);
        return this;
      },
      poll(interval) {
        pollRouter(interval);
        return this;
      }
    };
  })();
})(window);

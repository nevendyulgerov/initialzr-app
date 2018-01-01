/* globals initialzr */

/**
 * Core: Global Events
 */

initialzr.addNode('core', 'globalEvents', () => {
  'use strict';

  const eventPrefix = 'initialzr';

  const VIEW_LOADING = 'VIEW_LOADING';
  const VIEW_READY = 'VIEW_READY';
  const MODULE_READY = 'MODULE_READY';
  const MODULE_CHANGE = 'MODULE_CHANGE';
  const WIDGET_READY = 'WIDGET_READY';
  const WIDGET_CHANGE = 'WIDGET_CHANGE';

  /**
   * @description Dispatch event
   * @param type
   * @param options
   * @returns {*}
   */
  const dispatchEvent = (type, options = {}) => {
    switch ( type ) {
      case VIEW_LOADING:
        return document.dispatchEvent(new Event(`${eventPrefix}.view.loading`));
      case VIEW_READY:
        return document.dispatchEvent(new Event(`${eventPrefix}.view.ready`));
      case MODULE_READY:
        return document.dispatchEvent(new Event(`${eventPrefix}.module.${options.moduleName}.ready`));
      case MODULE_CHANGE:
        return document.dispatchEvent(new Event(`${eventPrefix}.module.${options.moduleName}.ready`));
      case WIDGET_READY:
        return document.dispatchEvent(new Event(`${eventPrefix}.widget.${options.widgetName}.ready`));
      case WIDGET_CHANGE:
        return document.dispatchEvent(new Event(`${eventPrefix}.widget.${options.widgetName}.change`, [options.state]));
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
  const interceptEvent = (type, options = {}) => {
    switch ( type ) {
      case VIEW_LOADING:
        return document.addEventListener(`${eventPrefix}.view.loading`, options.callback);
      case VIEW_READY:
        return document.addEventListener(`${eventPrefix}.view.ready`, options.callback);
      case MODULE_READY:
        return document.addEventListener(`${eventPrefix}.module.${options.moduleName}.ready`, options.callback);
      case MODULE_CHANGE:
        return document.addEventListener(`${eventPrefix}.module.${options.moduleName}.ready`, options.callback);
      case WIDGET_READY:
        return document.addEventListener(`${eventPrefix}.widget.${options.widgetName}.ready`, options.callback);
      case WIDGET_CHANGE:
        return document.addEventListener(`${eventPrefix}.widget.${options.widgetName}.change`, options.callback);
      default:
        return false;
    }
  };

  return {
    dispatchViewLoading() {
      dispatchEvent(VIEW_LOADING);
      return this;
    },
    interceptViewLoading(callback) {
      interceptEvent(VIEW_LOADING, { callback });
      return this;
    },

    dispatchViewReady() {
      dispatchEvent(VIEW_READY);
      return this;
    },
    interceptViewReady(callback) {
      interceptEvent(VIEW_READY, { callback });
      return this;
    },

    dispatchModuleReady(moduleName) {
      dispatchEvent(MODULE_READY, { moduleName });
      return this;
    },
    interceptModuleReady(moduleName, callback) {
      interceptEvent(MODULE_READY, { moduleName, callback });
      return this;
    },

    dispatchModuleChange(moduleName, state) {
      dispatchEvent(MODULE_CHANGE, { moduleName, state });
      return this;
    },
    interceptModuleChange(moduleName, callback) {
      interceptEvent(MODULE_CHANGE, { moduleName, callback });
      return this;
    },

    dispatchWidgetReady(widgetName) {
      dispatchEvent(WIDGET_READY, { widgetName });
      return this;
    },
    interceptWidgetReady(widgetName, callback) {
      interceptEvent(WIDGET_READY, { widgetName, callback });
      return this;
    },

    dispatchWidgetChange(widgetName, state) {
      dispatchEvent(WIDGET_CHANGE, { widgetName, state });
      return this;
    },
    interceptWidgetChange(widgetName, callback) {
      interceptEvent(WIDGET_CHANGE, { widgetName, callback });
      return this;
    }
  };
});

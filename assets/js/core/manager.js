/* globals ammo, initialzr */

/**
 * Core: Router
 */

initialzr.addNode('core', 'manager', () => {
  'use strict';

  const props = {};
  const store = { processed: [] };
  const module = ammo.app(props, store).schema('default');

  const widgets = initialzr.getNodes('widgets');
  const globalEvents = initialzr.getNode('core', 'globalEvents')();

  module.configure('actions')
    .node('normalizeProps', props => {
      const normalizedProps = {};
      ammo.eachKey(props, (val, key) =>
        normalizedProps[key] = ammo.convertByType(val));

      return normalizedProps;
    })
    .node('initWidgets', (viewState, domWidgets, widgets, normalizeProps) => {
      const processed = module.getStore('processed');

      ammo.selectAll(domWidgets).each(widget => {
        const props = normalizeProps(widget.dataset);
        const widgetName = props.widget;

        if (ammo.hasProp(widgets, widgetName)) {

          // check if widget is unique for the current view
          props.isUnique = processed.indexOf(widgetName) === -1;

          // invoke widget with its dom node and props
          widgets[widgetName](widget, props);

          // update store
          processed.push(widgetName);
          module.updateStore('processed', () => processed);
        }
      });
    })
    .node('monitorWidgets', () => {
      const actions = module.getNodes('actions');

      globalEvents.interceptViewLoading(() => {
        const domWidgets = ammo.selectAll('[data-widget]')
          .filter(widget => widget.getAttribute('data-show-on')).get();

        actions.initWidgets('loading', domWidgets, widgets, actions.normalizeProps);
      });

      globalEvents.interceptViewReady(() => {
        module.updateStore('processed', () => []);
        const domWidgets = ammo.selectAll('[data-widget]')
          .filter(widget => ! widget.getAttribute('data-show-on')).get();

        actions.initWidgets('ready', domWidgets, widgets, actions.normalizeProps);
      });
    })
    .node('removeModules', (persistentModules = []) => {
      ammo.selectAll('[data-module]')
        .filter(module => persistentModules.indexOf(module.getAttribute('data-module')) === -1)
        .each(module => ammo.removeEl(module));
    })
    .node('domContainsModule', moduleName => {
      const module = ammo.select(`[data-module="${moduleName}"]`).get();
      return ammo.isObj(module);
    });

  return {
    monitorWidgets() {
      module.getNode('actions', 'monitorWidgets')();
      return this;
    },
    removeModules(persistentModules) {
      module.getNode('actions', 'removeModules')(persistentModules);
      return this;
    },
    domContainsModule: module.getNode('actions', 'domContainsModule')
  };
});

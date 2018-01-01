/* globals initialzr, ammo */

initialzr.addNode('modules', 'settings', () => {
  'use strict';

  const props = {
    storeKey: 'settings',
    strongTypes: true
  };
  const store = {
    settings: { type: 'object', value: {} }
  };

  const base = initialzr.getNode('modules', 'base')({ name: 'settings' });
  const module = ammo.app(props, store).schema('module').inherit(base);
  const manager = initialzr.getNode('core', 'manager')();
  const globalEvents = initialzr.getNode('core', 'globalEvents')();

  module.configure('ui')
    .node('title', title => (`<span class="title">${title.toUpperCase()}</span>`));

  module.overwrite('ui')
    .node('index', () => (`
      <main data-module="settings" data-view>
        <div data-widget="loader" data-show-on="loading"></div>
      </main>
    `));

  module.overwrite('actions')
    .node('init', () => {
      const { ui, renderers } = module.getNodes();
      const indexUI = ui.index();

      renderers.render(indexUI);

      // simulate loading
      setTimeout(() => {
        const hasModule = manager.domContainsModule('settings');
        if (!hasModule) {
          return false;
        }

        const titleUI = ui.title('settings');

        if (hasModule) {
          renderers.renderTitle(titleUI);
        }
        globalEvents.dispatchViewReady();
      }, 1500);
    });

  module.callNode('actions', 'init');
});

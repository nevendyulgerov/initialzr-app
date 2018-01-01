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

  const base = initialzr.getNode('modules', 'base')();
  const module = ammo.app(props, store).schema('module').inherit(base);
  const globalEvents = initialzr.getNode('core', 'globalEvents')();

  module.overwrite('ui')
    .node('index', () => (`
      <main data-module="settings">
        <div data-widget="loader" data-show-on="loading"></div>
      </main>
    `))
    .node('title', title => (`<span class="title">${title.toUpperCase()}</span>`));

  module.overwrite('actions')
    .node('init', () => {
      const { ui, renderers } = module.getNodes();
      const indexUI = ui.index();

      renderers.render(indexUI);

      setTimeout(() => {
        const domModule = ammo.select('[data-module="settings"]').get();
        if (!domModule) {
          return false;
        }

        const titleUI = ui.title('login');

        if (domModule) {
          renderers.renderTitle(titleUI);
        }
        globalEvents.dispatchViewReady();
      }, 1500);
    });

  module.callNode('actions', 'init');
});

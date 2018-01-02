/* globals initialzr, ammo */

/**
 * Module: Login
 */

initialzr.addNode('modules', 'login', () => {
  'use strict';

  const module = initialzr.getNode('modules', 'base')({ name: 'login' });
  const globalEvents = initialzr.getNode('core', 'globalEvents')();
  const manager = initialzr.getNode('core', 'manager')();

  module.configure('ui')
    .node('title', title => (`<span class="title">${title.toUpperCase()}</span>`));

  module.overwrite('ui')
    .node('index', () => (`
      <main data-module="login" data-view>
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
        const hasModule = manager.domContainsModule('login');
        if (!hasModule) {
          return false;
        }

        const titleUI = ui.title('login');
        renderers.renderTitle(titleUI);

        globalEvents.dispatchViewReady();
      }, 1500);
    });

  module.callNode('actions', 'init');
});

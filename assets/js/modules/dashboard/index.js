/* globals initialzr, ammo */

/**
 * Module: Dashboard
 */

initialzr.addNode('modules', 'dashboard', () => {
  'use strict';

  const module = initialzr.getNode('modules', 'base')({ name: 'dashboard' });
  const globalEvents = initialzr.getNode('core', 'globalEvents')();
  const manager = initialzr.getNode('core', 'manager')();

  module.configure('ui')
    .node('title', title => (`<span class="title">${title.toUpperCase()}</span>`));

  module.overwrite('ui')
    .node('index', () => (`
      <main data-module="dashboard" data-view>
        <div data-widget="loader" data-show-on="loading"></div>
      </main>
    `));

  module.overwrite('actions')
    .node('init', () => {
      const { ui, renderers } = module.getNodes();
      const htmlTemplate = ui.index();

      renderers.render(htmlTemplate);

      // simulate loading
      setTimeout(() => {
        const hasModule = manager.domContainsModule('dashboard');
        if (!hasModule) {
          return false;
        }
        const titleUI = ui.title('dashboard');

        if (hasModule) {
          renderers.renderTitle(titleUI);
        }
        globalEvents.dispatchViewReady();
      }, 1500);
    });

  module.callNode('actions', 'init');
});

/* globals initialzr, ammo */

/**
 * Module: Dashboard
 */

initialzr.addNode('modules', 'dashboard', () => {
  'use strict';

  const module = initialzr.getNode('modules', 'base')({ name: 'dashboard' });
  const globalEvents = initialzr.getNode('core', 'globalEvents')();

  module.overwrite('ui')
    .node('index', () => (`
      <main data-module="dashboard">
        <div data-widget="loader" data-show-on="loading"></div>
      </main>
    `))
    .node('title', title => (`<span class="title">${title.toUpperCase()}</span>`));

  module.overwrite('actions')
    .node('init', () => {
      const { ui, renderers } = module.getNodes();
      const htmlTemplate = ui.index();

      renderers.render(htmlTemplate);
      setTimeout(() => {
        const domModule = ammo.select('[data-module="dashboard"]').get();
        if (!domModule) {
          return false;
        }
        const titleUI = ui.title('dashboard');

        if (domModule) {
          ammo.appendBefore(titleUI, domModule);
        }
        globalEvents.dispatchViewReady();
      }, 1500);
    });

  module.callNode('actions', 'init');
});

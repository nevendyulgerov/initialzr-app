/* globals initialzr, ammo */

/**
 * Module: Login
 */

initialzr.addNode('modules', 'login', () => {
  'use strict';

  const module = initialzr.getNode('modules', 'base')({ name: 'login' });
  const globalEvents = initialzr.getNode('core', 'globalEvents')();

  module.overwrite('ui')
    .node('index', () => (`
      <main data-module="login">
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
        const domModule = ammo.select('[data-module="login"]').get();
        if (!domModule) {
          return false;
        }

        const titleHtml = ui.title('login');

        if (domModule) {
          ammo.appendBefore(titleHtml, domModule);
        }
        globalEvents.dispatchViewReady();
      }, 1500);
    });

  module.callNode('actions', 'init');
});

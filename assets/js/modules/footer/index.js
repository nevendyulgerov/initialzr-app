/* globals initialzr */

initialzr.addNode('modules', 'footer', () => {
  'use strict';

  const module = initialzr.getNode('modules', 'base')({ name: 'footer' });
  const globalEvents = initialzr.getNode('core', 'globalEvents')();

  module.configure('ui')
    .node('navigation', items => (`
      <nav>
        <div data-widget="navigation" data-show-on="loading">
          ${items.map(item => (`
            <div class="item" data-href="${item.url}">${item.name}</div>
          `)).join('')}
        </div>
      </nav>
    `));

  module.overwrite('ui')
    .node('index', navigationUI => (`<footer data-module="footer">${navigationUI}</footer>`));

  module.overwrite('actions')
    .node('getNavigationItems', () => {
      return [
        { name: 'Home', url: '/' },
        { name: 'Login', url: '/login' },
        { name: 'Settings', url: '/settings' }
      ];
    })
    .node('init', () => {
      const { ui, renderers, actions } = module.getNodes();
      const navigationItems = actions.getNavigationItems();
      const navigationUI = ui.navigation(navigationItems);
      const indexUI = ui.index(navigationUI);

      renderers.render(indexUI);
      globalEvents.dispatchViewLoading();
    });

  module.callNode('actions', 'init');
});

/* globals initialzr, ammo */

/**
 * Module: Header
 */

initialzr.addNode('modules', 'header', () => {
  'use strict';

  const module = initialzr.getNode('modules', 'base')({ name: 'header' });

  module.configure('ui')
    .node('menuButton', () => (`
      <button class="trigger toggle-menu">
        <span class="icon fa fa-bars"></span>
      </button>
    `))
    .node('navigation', items => (`
      <nav>
        <div data-widget="navigation" data-show-on="ready">
          ${items.map(item => (`
            <div class="item" data-href="${item.url}">${item.name}</div>
          `)).join('')}
        </div>
      </nav>
    `));

  module.overwrite('ui')
    .node('index', (menuButtonUI, navigationUI) => (`
      <header data-module="header">
        ${menuButtonUI}
        ${navigationUI}
      </header>
    `));

  module.configure('events')
    .node('onToggleMenu', callback => ammo.delegateEvent('click', '.trigger.toggle-menu', callback));

  module.configure('renderers')
    .node('toggleMenu', event => {
      const target = event.target;
      const nav = ammo.select('[data-module="header"] nav').get();
      const isActive = target.classList.contains('active');

      if (isActive) {
        nav.classList.remove('active');
        target.classList.remove('active');
      } else {
        nav.classList.add('active');
        target.classList.add('active');
      }
    });

  module.configure('actions')
    .node('getNavigationItems', () => {
      return [
        { name: 'Home', url: '/' },
        { name: 'Login', url: '/login' },
        { name: 'Settings', url: '/settings' }
      ];
    });

  module.overwrite('actions')
    .node('init', () => {
      const { ui, events, renderers, actions } = module.getNodes();
      const navigationItems = actions.getNavigationItems();
      const menuButtonHtml = ui.menuButton();
      const navigationHtml = ui.navigation(navigationItems);
      const templateHtml = ui.index(menuButtonHtml, navigationHtml);

      renderers.render(templateHtml);
      events.onToggleMenu(renderers.toggleMenu);
    });

  module.callNode('actions', 'init');
});

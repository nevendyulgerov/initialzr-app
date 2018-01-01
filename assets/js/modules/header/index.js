/* globals initialzr, ammo */

/**
 * Module: Header
 */

initialzr.addNode('modules', 'header', () => {
  'use strict';

  const module = initialzr.getNode('modules', 'base')({ name: 'header' });

  module.configure('ui')
    .node('button', () => (`
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
    .node('index', (buttonUI, navigationUI) => (`
      <header data-module="header">
        ${buttonUI}
        ${navigationUI}
      </header>
    `));

  module.configure('events')
    .node('onToggleMenu', callback => ammo.delegateEvent('click', '.trigger.toggle-menu', callback))
    .node('onResize', callback => window.addEventListener('resize', callback));

  module.configure('renderers')
    .node('toggleMenu', event => {
      const button = event.target;
      const nav = ammo.select('[data-module="header"] nav').get();
      const navHeight = nav.clientHeight;
      const isActive = button.classList.contains('active');

      if (!isActive) {
        ammo.select(nav).style('top', `-${navHeight}px`);
        nav.classList.add('active');
        button.classList.add('active');
      } else {
        ammo.select(nav).style('top', `${0}px`);
        nav.removeAttribute('class');
        button.classList.remove('active');
      }
    })
    .node('resizeHeader', () => {
      const width = window.innerWidth;
      const mobileWidth = 640;

      if (width >= mobileWidth) {
        const nav = ammo.select('[data-module="header"] nav').get();
        const button = ammo.select('.trigger.toggle-menu').get();

        ammo.select(nav).style('top', `0px`);
        nav.removeAttribute('class');
        button.classList.remove('active');
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
      const buttonUI = ui.button();
      const navigationUI = ui.navigation(navigationItems);
      const indexUI = ui.index(buttonUI, navigationUI);
      const buffer = ammo.buffer();

      renderers.render(indexUI);
      events.onToggleMenu(renderers.toggleMenu);
      events.onResize(() => buffer('resize.module.header', 150, () => renderers.resizeHeader()));
    });

  module.callNode('actions', 'init');
});

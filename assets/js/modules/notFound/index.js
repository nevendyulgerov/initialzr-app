/* globals initialzr */

initialzr.addNode('modules', 'notFound', () => {
  'use strict';

  const module = initialzr.getNode('modules', 'base')({
    name: 'notFound',
    isView: true
  });
  const globalEvents = initialzr.getNode('core', 'globalEvents')();

  module.overwrite('ui')
    .node('index', title => (`
      <div data-module="notFound" data-view>
        <span class="title">${title.toUpperCase()}</span>
      </div>
    `));

  module.configure('ui')
    .node('title', title => (`<span class="title">${title.toUpperCase()}</span>`));

  module.overwrite('actions')
    .node('init', () => {
      const { ui, renderers } = module.getNodes();
      const indexUI = ui.index('not found');

      renderers.render(indexUI);
      globalEvents.dispatchViewReady();
    });

  module.callNode('actions', 'init');
});

/* globals initialzr, ammo */

/**
 * Module: Base
 */

initialzr.addNode('modules', 'base', options => {
  'use strict';

  const module = ammo.app().schema('module');

  module.configure('ui')
    .node('index', () => (`
      <div data-module="${options.name}" ${options.isView ? 'data-view' : ''}>
        <span class="title">${options.name.toUpperCase()}</span>
      </div>
    `));

  module.configure('renderers')
    .node('render', ui => {
      const target = ammo.select('[data-app]').get();
      ammo.appendBefore(ui, target);
    })
    .node('renderTitle', ui => {
      const domModule = ammo.select(`[data-module="${options.name}"`).get();
      ammo.appendBefore(ui, domModule);
    });

  module.configure('actions')
    .node('init', () => {
      const { ui, renderers } = module.getNodes();
      const indexUI = ui.index();

      renderers.render(indexUI);
    });

  return module;
});

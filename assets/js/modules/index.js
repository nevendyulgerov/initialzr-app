/* globals initialzr, ammo */

/**
 * Module: Base
 */

initialzr.addNode('modules', 'base', options => {
  'use strict';

  const module = ammo.app().schema('module');

  module.configure('ui')
    .node('index', () => (`
      <div data-module="${options.name}">
        <span class="title">Module [${options.name.toUpperCase()}]</span>
      </div>
    `));

  module.configure('renderers')
    .node('render', html => {
      const target = ammo.select('[data-app]').get();
      ammo.appendBefore(html, target);
    });

  module.configure('actions')
    .node('init', () => {
      const { ui, renderers } = module.getNodes();
      const htmlTemplate = ui.index();

      renderers.render(htmlTemplate);
    });

  return module;
});

/* globals ammo */

/**
 * App entrypoint
 */

(() => {
  'use strict';

  const props = {
    name: 'initialzr',
    global: true
  };

  const app = ammo.app(props).schema('app');

  app.configure('events')
    .node('onReady', callback => ammo.onDomReady(callback));

  app.configure('actions')
    .node('init', () => {
      const { events, core } = app.getNodes();
      events.onReady(() => core.router());
    });

  app.callNode('actions', 'init');
})();

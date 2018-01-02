/* globals initialzr, router */

/**
 * Core: Router
 */

initialzr.addNode('core', 'router', () => {
  'use strict';

  const modules = initialzr.getNodes('modules');
  const manager = initialzr.getNode('core', 'manager')();
  const persistentModules = ['header'];

  router.init()
    .poll(150)
    .beforeRoute(() => {
      manager.removeModules(persistentModules);

      if (!manager.domContainsModule('header')) {
        modules.header();
        manager
          .monitorWidgets()
          .notifyBodyUponViewLoading();
      }
    })
    .afterRoute(modules.footer)
    .notFoundRoute(modules.notFound)
    .route('/', modules.dashboard)
    .route('/login', modules.login)
    .route('/settings', modules.settings);
});

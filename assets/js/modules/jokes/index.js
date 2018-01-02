/* globals initialzr, ammo */

initialzr.addNode('modules', 'jokes', () => {
  'use strict';

  const baseModule = initialzr.getNode('modules', 'base')({ name: 'jokes' });
  const props = {
    strongTypes: true
  };
  const state = {
    jokes: { type: 'array', value: [] }
  };
  const module = ammo.app(props, state).inherit(baseModule);
  const manager = initialzr.getNode('core', 'manager')();
  const globalEvents = initialzr.getNode('core', 'globalEvents')();

  module.configure('ui')
    .node('title', title => (`<span class="title">${title.toUpperCase()}</span>`))
    .node('joke', joke => (`
      <div class="joke" data-type="${joke.type}" data-id="${joke.id}" title="${joke.type}">
        <p class="setup" title="Setup">${joke.setup}</p>
        <p class="punchline" title="Punchline">${joke.punchline}</p>
      </div>
    `));

  module.overwrite('ui')
    .node('index', () => (`
      <div data-module="jokes" data-view>
        <div data-widget="loader" data-show-on="loading"></div>
        <div class="jokes-list"></div>
      </div>
    `));

  module.configure('renderers')
    .node('renderJoke', jokeUI => {
      const domModule = ammo.select('[data-module="jokes"]').get();
      if (!domModule) {
        return false;
      }
      const jokesList = ammo.select('.jokes-list', domModule).get();
      ammo.appendBefore(jokeUI, jokesList);
    });

  module.configure('actions')
    .node('getJokes', callback => {
      ammo.request({
        url: `https://08ad1pao69.execute-api.us-east-1.amazonaws.com/dev/random_ten`,
        callback
      });
    });

  module.overwrite('actions')
    .node('init', () => {
      const { ui, renderers, actions } = module.getNodes();
      const indexUI = ui.index();
      renderers.render(indexUI);

      // simulate loading
      setTimeout(() => {
        if (!manager.domContainsModule('jokes')) {
          return false;
        }

        const titleUI = ui.title('jokes');
        renderers.renderTitle(titleUI);
        globalEvents.dispatchViewReady();

        actions.getJokes((err, jokes) => {
          if (err) {
            return console.error(err);
          }

          module.updateStore('jokes', () => jokes);

          ammo.recurIter((index, resolve) => {
            const joke = jokes[index];
            const jokeUI = ui.joke(joke);
            renderers.renderJoke(jokeUI);
            setTimeout(() => resolve(index + 1 < jokes.length), 300);
          });
        });
      }, 1500);
    });

  module.callNode('actions', 'init');
});

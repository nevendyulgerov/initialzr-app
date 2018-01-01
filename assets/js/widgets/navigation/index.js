/* globals initialzr, router, ammo */

/**
 * Widget: Navigation
 */

initialzr.addNode('widgets', 'navigation', (domWidget, props) => {
  'use strict';

  const widget = ammo.app().schema('widget');

  widget.configure('ui')
    .node('index', items => (`
      <ul class="widget-list">
        ${!props.layout ? (items.map(item => (`
          <li class="widget-item">
            <a href="#" class="item trigger go-to" data-href="${item.href}">${item.content}</a>
          </li>
        `)).join('')) : ''}

        ${props.layout === 'arrows' ? (items.map(item => (`
          <li class="widget-item">
            <span class="label">${item.content}</span>
            <a href="#" class="item trigger go-to" data-href="${item.href}">
                <span class="icon fa fa-chevron-right"></span>
            </a>
          </li>
        `)).join('')) : ''}
      </ul>
  `));

  widget.configure('events')
    .node('onSelectItem', callback => ammo.delegateEvent('click', '.trigger.go-to', callback, domWidget));

  widget.configure('renderers')
    .node('render', widgetHtml => domWidget.innerHTML = widgetHtml)
    .node('highlightItem', href => {
      ammo.selectAll('.trigger.go-to', domWidget).filter(item =>
        item.classList.contains('active') && item.classList.remove('active'));

      ammo.selectAll(`[data-href="${href}"]`, domWidget).each(item => item.classList.add('active'));
    });

  widget.configure('actions')
    .node('init', () => {
      const { ui, events, renderers } = widget.getNodes();
      const items = [];
      ammo.eachKey(ammo.selectAll('.item', domWidget).get(), item => {
        items.push({
          href: item.getAttribute('data-href'),
          content: item.innerHTML
        });
      });

      const template = ui.index(items);

      renderers.render(template);

      events.onSelectItem(event => {
        event.preventDefault();
        const target = event.target.getAttribute('data-href');

        if (target) {
          return router.go(`${target}`);
        }
      });

      const currentRoute = router.getCurrentRoute();

      ammo.selectAll('.trigger.go-to', domWidget)
        .filter(item => item.getAttribute('data-href') === currentRoute)
        .each(item => renderers.highlightItem(item.getAttribute('data-href')));
    });

  widget.callNode('actions', 'init');
});

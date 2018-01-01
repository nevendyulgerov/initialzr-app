/* globals initialzr, ammo */

/**
 * Widget: Loader
 */

initialzr.addNode('widgets', 'loader', (domWidget, props) => {
  'use strict';

  const widget = ammo.app().schema('widget');
  const globalEvents = initialzr.getNode('core', 'globalEvents')();

  widget.configure('ui')
    .node('index', () => (`
      <div class="loader-box">
        <div class="loader"></div>
      </div>
    `));

  widget.configure('renderers')
    .node('render', widgetHtml => {
      domWidget.innerHTML = widgetHtml;
      domWidget.classList.add('active');
    })
    .node('show', () => domWidget.classList.add('active'))
    .node('hide', () => domWidget.classList.contains('active') && domWidget.classList.remove('active'));

  widget.configure('actions')
    .node('init', () => {
      const { ui, renderers } = widget.getNodes();
      const indexUI = ui.index();

      renderers.render(indexUI);

      globalEvents
        .dispatchWidgetReady(props.widget)
        .interceptViewReady(() => renderers.hide())
        .interceptWidgetChange(props.widget, (event, options) => {
          switch ( options.type ) {
            case 'show':
              return renderers.show();
            case 'hide':
              return renderers.hide();
            default:
              return false;
          }
        });
    });

  widget.callNode('actions', 'init');
});

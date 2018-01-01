
const fs = require('fs');

const createFile = (path, fileExtension, content) => {
  'use strict';

  if (!fs.existsSync(path)){
    fs.mkdirSync(path);
  }

  fs.writeFile(`${path}/index.${fileExtension}`, content, (err) => {
    if ( err ) {
      return console.log(err);
    }
  });
};

const createModuleScript = (appName, moduleName) => {
  'use strict';

  const modulePath = `./assets/js/modules/${moduleName}`;
  const content = `
/* globals ${appName}, ammo */

${appName}.addNode('modules', '${moduleName}', () => {
  'use strict';

  const module = ammo.app().schema('module');

  module.configure('actions')
    .node('init', () => {
      const nodes = module.getNodes();
    });

  module.callNode('actions', 'init');
});`.trim();

  createFile(modulePath, 'js', content);
};

const createModuleStyle = moduleName => {
  'use strict';

  const modulePath = `./assets/sass/modules/${moduleName}`;
  const content = `
/**
 * Styles for module '${moduleName}'
 */

[data-module="${moduleName}"] {}`.trim();

  createFile(modulePath, 'scss', content);
};

const createWidgetScript = (appName, widgetName) => {
  'use strict';

  const widgetPath = `./assets/js/widgets/${widgetName}`;
  const content = `
/* globals ${appName}, ammo */

${appName}.addNode('widgets', '${widgetName}', () => {
  'use strict';

  const widget = ammo.app().schema('widget');

  widget.configure('actions')
    .node('init', () => {
      const nodes = module.getNodes();
    });

  widget.callNode('actions', 'init');
});`.trim();

  createFile(widgetPath, 'js', content);
};

const createWidgetStyle = widgetName => {
  'use strict';

  const widgetPath = `./assets/sass/widgets/${widgetName}`;
  const content = `
/**
 * Styles for widget '${widgetName}'
 */

[data-widget="${widgetName}"] {}`.trim();

  createFile(widgetPath, 'scss', content);
};

exports.createModule = (appName, moduleName) => {
  'use strict';

  createModuleScript(appName, moduleName);
  createModuleStyle(moduleName);
};

exports.createWidget = (appName, widgetName) => {
  'use strict';

  createWidgetScript(appName, widgetName);
  createWidgetStyle(widgetName);
};

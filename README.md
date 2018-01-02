# Initialzr App

Base for custom, event-driven, single-page applications, created with the Ammo API.

## Notes

### Architecture

This is a scaffolding app, which can be used as a base for event-driven, single-page applications. This app utilizes a declarative, functional design, a custom hash-based router and the Ammo API.

The app comes preconfigured to handle scss preprocessing and js concatenation. These two methods are uses to create a single stylesheet and a single javascript file, served to index.html - the app's entrypoint. The single unified stylesheet contains all style definitions from appDir/assets/sass. The single unified javascript file contains all script definitions from appDir/assets/js.

This app uses an architecture, in which a module's files (script and style) are separated by type. Scripts reside in appDir/assets/js. Styles reside in appDir/assets/sass.

The result of all preprocessed sass files is styles.css, residing in appDir/assets/css. The result of all concatenated js files is main.js, residing in appDir/assets/js.

The entrypoint for this application is index.html, residing in appDir/.

This application maintains separation of concept by de-coupling module/view's functionality from UI functionality. Module/view functionality is managed by modules, residing in appDir/assets/js/modules. UI functionality is managed by widgets, residing in appDir/assets/js/widgets.

Modules and widgets communicate safely through the globalEvents system. This system exposes a pub/sub API for intercepting and dispatching global app events.

### Build tools

Gulp and npm are used for creating the build tools.

The app comes with a number of build tools to automate common development tasks, including:

- `npm run server` - runs the local web development server at `http://localhost:8080`

- `npm run build` - primary build task - watches all relevant sass and js files and preprocess all sass files to style.css and all js files to main.js upon change

- `npm run dist` - creates a distributable, optimized package in appDir/dist

- `gulp module --option {appName} --option {moduleName}` - utility for creating modules in the app's context. The new module's files will reside in appDir/assets/js/modules/{moduleName}/ and appDir/assets/sass/modules/{moduleName}

- `gulp widget --option {appName} --option {widgetName}` - utility for creating widgets in the app's context. The new widgets's files will reside in appDir/assets/js/widgets/{widgetName}/ and appDir/assets/sass/widgets/{widgetName}

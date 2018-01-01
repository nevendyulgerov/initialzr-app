# Initialzr App

Base for custom single page event-driven applications, created with the Ammo API.

## Notes

### Architecture

This scaffolding app utilizes a custom router and the Ammo API.

The app comes preconfigured to handle scss preprocessing and js concatenation. These two methods are uses to create a single stylesheet and a single javascript file, served to index.html - the app's entrypoint. The single unified stylesheet contains all style definitions from appDir/assets/sass. The single unified javascript file contains all script definitions from appDir/assets/js.

This app uses an architecture, in which a module's files (script and style) are separated by type. Scripts reside in appDir/assets/js. Styles reside in appDir/assets/sass.

The result of all preprocessed sass files is styles.css, residing in appDir/assets/css. The result of all concatenated js files is main.js, residing in appDir/assets/js.

The entrypoint for this application is index.html, residing in appDir/.

This application maintains separation of concept by de-coupling module/view's functionality from UI functionality. Module/view functionality is managed by modules, residing in appDir/assets/js/modules. UI functionality is managed by widgets, residing in appDir/assets/js/widgets.

Modules and widgets communicate safely through the globalEvents system. This system exposes a pub/sub API for intercepting and dispatching global app events.

### Build tools

The app comes with a number of build tools to automate common development tasks, including:

- npm run build - primary build task - watches all relevant sass and js files

- gulp module --option {appName} --option {moduleName} - utility for creating modules in the app's context

- gulp widget --option {appName} --option {widgetName} - utility for creating widgets in the app's context

# Appcore Log

This plugin adds the `log()` method to an Appcore app. Under the hood, it uses [debug](http://ghub.io/debug), meaning it is both colorful and cross-platform compatible.

```js
app.use(require("@beneaththeink/appcore-log"));

app.ready(function() {
	app.log("My app is ready!");
});
```

The plugin also adds some alternative logging methods in case you need to be more specific.

```js
app.ready(function() {
	app.log.debug("A debug message.");
	app.log.info("An info message.");
	app.log.warn("A warning.");
	app.log.error("An error.");
});
```

Using these methods instead of the generic `log()` method means you can filter out messages based on their level.

```js
app.set("logLevel", "info"); // will only log info, warn and error messages
```

**Note:** This plugin will catch and log errors thrown by the application, instead of crashing the program like normal. Set `logErrors` to `false` before running the plugin to disable this feature.

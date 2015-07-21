var _ = require("underscore");
var debug = require("debug");

module.exports = function() {
	// self-awareness
	if (this.log_levels) return;
	this.use(require("@beneaththeink/appcore-options"));

	// add method, properties
	this.setupLoggers = setupLoggers;
	this.log_levels = [ "ERROR", "WARN", "INFO", "DEBUG" ];

	// call once to get going
	this.setupLoggers();

	// refresh anytime there is a new parent
	this.on("mount", this.setupLoggers);

	// log app errors
	this.on("error", logError);

	// log about app failure
	this.fail(function() {
		this.log("Errors preventing startup.");
	});
}

function logError(err) {
	if (this.state != null && this.get("logErrors") !== false) {
		var logval;
		if (typeof err === "string") logval = _.toArray(arguments);
		else if (err instanceof Error) logval = [ err.stack || err.toString() ];
		else if (err != null) logval = [ err.message || JSON.stringify(err) ];
		if (logval) this.log.error.apply(null, logval);
	}
}

function setupLoggers() {
	var log, enabled, logLevel, fullname;

	// auto-enable logging before we make loggers
	fullname = this.fullname;
	enabled = this.get("log");
	if (enabled === void 0) enabled = true;
	if (enabled) debug.names.push(new RegExp("^" + fullname));

	// parse the log level
	logLevel = this.get("logLevel");
	if (_.isString(logLevel)) logLevel = this.log_levels.indexOf(logLevel.toUpperCase());
	if (typeof logLevel !== "number" || isNaN(logLevel)) logLevel = -1;

	// make main logger
	log = this.log = debug(fullname);

	// set up each log level
	_.each(this.log_levels, function(lvl, name) {
		if (lvl < 0) return;
		log[name.toLowerCase()] = logLevel < 0 || logLevel >= lvl ?
			debug(fullname + " [" + name + "]") :
			function(){};
	});

	// add special loggers
	_.each({
		client: this.isClient,
		server: this.isServer,
		root: this.isRoot
	}, function(enabled, prop) {
		log[prop] = enabled ? (log.info || log) : function(){};
	});
}

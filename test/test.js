var Appcore = require("@beneaththeink/appcore");
var logger = require("../");
var test = require("tape");

test("adds log method to the app", function(t) {
	t.plan(1);
	
	var app = Appcore();
	app.use(logger);

	app.use(function() {
		t.equal(typeof this.log, "function", "app.log() is a function");
	});
});

/* global Module */

/* Magic Mirror
 * Module: mmm-touchgestures
 *
 * By Jan Löbel
 * MIT Licensed.
 */

Module.register("mmm-touchgestures", {
	defaults: {
		htmlTagElementName: "body",
		listenOn: "swipeleft swiperight swipeup swipedown",

		notification: {
			enabled: true,
			senderId: "mmm-touchgestures-gesture"
		},

		gestures: {
			"swipe": {
				enabled: true,
				threshold: 50
			}
		},

		actions: {
			"swipeleft" : function() {
				console.log("Triggered swipeleft");
			},
			"swiperight" : function() {
				console.log("Triggered swiperight");
			},
			"swipeup" : function() {
				console.log("Triggered swipeup");
			},
			"swipedown" : function() {
				console.log("Triggered swipedown");
			},
		},

		verbose: false
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		this.setupHammerJs();
	},

	setupHammerJs: function() {
		const self = this;

		// Setup Hammer.js
		const body = document.getElementsByTagName(this.config.htmlTagElementName)[0];
		const hammer = new Hammer(body);
		this.applyCustomHammerJsConfigs(hammer);
		hammer.on(self.config.listenOn, function(ev) {
			self.handleGesture(ev.type);
		});
	},

	applyCustomHammerJsConfigs: function(hammer) {
		if(!this.config.gestures) {
			return; // Nothing to do
		}

		// Apply configurations set by the config
		Object.keys(this.config.gestures).forEach(key => {
			hammer.get(key).set(this.config.gestures);
		});

		// Enable all directions for all possibilites, no matter what was configured
		hammer.get("pan").set({ direction: Hammer.DIRECTION_ALL });
		hammer.get("swipe").set({ direction: Hammer.DIRECTION_ALL });
	},

	handleGesture: function(gestureType) {
		this.log("Gesture detected:", gestureType);
		this.callAction(gestureType);

		if (this.config.notification.enabled) {
			this.sendSocketNotification(this.config.notification.senderId, { action: gestureType });
		}
	},

	callAction: function(gestureType) {
		if (this.config.actions && this.config.actions[gestureType]) {
			const result = this.config.actions[gestureType]();
			this._handleActionResult(result);	
		}
	},

	_handleActionResult(actionResult) {
		// If action return an object use it to send a socket notification
		if(actionResult === undefined) {
			this.log("No action result found");
			return;
		}

		if(typeof actionResult === 'object' && actionResult.constructor === Object) {
			this.log("Action result is object", actionResult);
			this.sendNotification(actionResult.notification, actionResult.payload);
		} else if(typeof actionResult === 'string' || actionResult instanceof String) {
			this.log("Action result is string", actionResult);
			this.sendNotification(actionResult);
		} else {
			this.log("Unknown return value", actionResult);
			console.error('Unknown return value from action:', actionResult);
		}
	},

	getDom: function() {
		return null; // Dont't use any ui components
	},

	getScripts: function() {
		return [ this.file("./lib/hammer.min.js") ]
	},

	log() {
		if(this.config.verbose) {
			console.log([].slice.apply(arguments));
		}
	}
});

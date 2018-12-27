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
			this.sendNotification({ action: gestureType });
		}
	},

	callAction: function(gestureType) {
		if (this.config.actions && this.config.actions[gestureType]) {
			this.config.actions[gestureType]();
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
	},

	sendNotification: function(data) {
		this.sendSocketNotification(this.config.notification.senderId, data);
	}
});

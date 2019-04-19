# mmm-touchgestures

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

Enables MagicMirror to support touch gestures by utilizing [hammer.js](https://hammerjs.github.io/). You can define how to handle a e.g.: swipe left, up, down or right.

## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:
```js
var config = {
    modules: [
        {
            module: 'mmm-touchgestures',
            config: {
                // See below for configurable options
            }
        }
    ]
}
```

## Configuration options

| Option           | Description
|----------------- |-----------
| `htmlTagElementName`        | *Optional* Name of the element tag to listen for touch gestures.<br><br>**Type:** `string` <br>Default: "body"
| `listenOn`                  | *Optional* Listen to this (space seperated) touch gestures. <br><br>**Type:** `string` <br>Default: "swipeleft swiperight swipeup swipedown"
| `notification`              | *Optional* Object to set notification settings.
| `notification.enabled`      | *Optional* Should a notification be send on a configured touch gesture.  <br><br>**Type:** `string` <br>Default: "true"
| `notification.senderId`     | *Optional* Name of the notification sender to use. <br><br>**Type:** `string` <br>Default: "mmm-touchgestures-gesture"
| `gestures`                  | *Optional* Object to set hammer.js gesture settings.
| `gestures.swipe`            | *Optional* Object to configure parameters for the swipe gesture. See: [http://hammerjs.github.io/recognizer-swipe/](http://hammerjs.github.io/recognizer-swipe/). <br><br> Note: `direction` will always be set to `DIRECTION_ALL` and can't be changed.
| `actions`                   | *Optional* Object to configure callback methods which get called if they exist.
| e.g.: `actions.swipeleft`   | *Optional* Define a method which get's executed if the `swipeleft` gesture will be detected. <br><br> Note: can be defined for each touch gesture, e.g.: `swiperight`, `swipeup`, ...
| `verbose`   | *Optional* Enable/Disable logging of the module. <br><br>**Type:** `boolean` <br>Default: "false"

## Actions
Action methods can return a simple string or object. If a string or object is returned it will be used to send a notification. So if you return e.g.: `PAGE_INCREMENT` as string it will send a notification with this title. If you want to return a object assure it has a structure like: `{ notification:'PAGE_INCREMENT', payload: {} }`.

## Default configuration

The default configuration looks like this:
```js
config: {
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
}
```
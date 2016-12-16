# ember-logging-amplitude [![Build Status](https://travis-ci.com/acquia/ember-logging-amplitude.svg?token=xpbhY9xz7Z9aqH5aUfgP&branch=master)](https://travis-ci.com/acquia/ember-logging-amplitude)

This addon provides a logging consumer for the [ember-logging-service](https://github.com/acquia/ember-logging-service/) addon.
The consumer handles sending user events to [Amplitude](https://amplitude.com/).

## Configuration

First you must install the ember-logging-service addon and follow instructions
to add application and user context callbacks.

There are two parts to configuring the Amplitude logging consumer.  Setting up the
credentials and setting up the application-specific information to send to
Amplitude.

# Configuring credentials
Configuring the ember-logging-amplitude addon is done from the `config/environment.js` file.

You must set `enabled = true` for each environment you wish to monitor (both in the
ember-logging-service and in the ember-logging-amplitude modules).

You also need to specify an array of tag names to send to the Amplitude service.
For example, to listen to any events of type user, interaction, or navigation:

```
ENV['ember-logging-service'] = {
  enabled: true
  .....
}

ENV['ember-logging-amplitude'] = {
  enabled: true,
  apiKey: your-amplitude-api-key-goes-here
  amplitudeConfig: {}
  tags: ['user', 'interaction', 'navigation']
}
```

The additional `amplitudeConfig` values can be found under the "Configuration Options"
section of the [JavaScript SDK](https://github.com/amplitude/Amplitude-Javascript)

#Basic usage

Triggering event follows the usage for the [logging service](https://github.com/acquia/ember-logging-service/).
Assuming you had configured the Amplitude logging consumer to listen for the
'navigation' tag at the default 'info' severity level, you could trigger an
event to be sent to Amplitude as:

```
import Ember from 'ember';

export default Ember.Component.extend({
  logger: Ember.inject.service(),

  trackNavigationEvent(navItem) {
    let logger = this.get('logger');
    logger.info(logger.tags.navigation, navItem);
  }
})
```

# Configuring application-specific information
Amplitude requires information regarding the context of the event and the current
application user at the time of the event.  This is information that 
you would set in the application and user context callbacks in the ember-logging-service.
Because that contextual data is set up by your application, ember-logging-amplitude
passes the event context to your custom callback to determine what values map
to the values expected by Amplitude.

When you install the ember-logging-amplitude addon, an application instance initializer
is created for you at `app/instance-initializers/register-amplitude-logging-consumer.js`.

This file sets up a sample callback to the logging consumer and defines the values
that need to be populated for integration with Amplitude.  This includes the
application version and the user id.  Additionally you can set an object of
extra user properties to track for the current user.  You can
fill in the values directly here or utilize the event context passed to the
function to dynamically determine what to send.  This callback is executed each
time an event is sent to Amplitude.

# Developing for ember-logging-amplitude

This README outlines the details of collaborating on this Ember addon.

## Installation

* `git clone git@github.com:acquia/ember-logging-amplitude.git` this repository
* `cd ember-logging-amplitude`
* `npm install`
* `bower install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

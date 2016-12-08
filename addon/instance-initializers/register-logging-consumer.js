// Read any configuration values from the environment configuration and user
// them to register the amplitidude service as a logging consumer
export default function registerLoggingConsumer(instance, config) {
  let loggingService, consumerService, levels;

  let addonOptions = config['ember-logging-amplitude'];
  if (!addonOptions.enabled) {
    return;
  }
  if (!addonOptions.tags) {
    // Needs to be tracking some tags to be useful.
    return;
  }
  loggingService = instance.lookup('service:logger');
  consumerService = instance.lookup('service:amplitudeLoggingConsumer');
  loggingService.registerTags(addonOptions.tags);
  levels = addonOptions.levels || loggingService.levels.info;
  loggingService.registerConsumer('ember-logging-amplitude', [consumerService.get('loggerCallback'), consumerService], levels, addonOptions.tags);
}

import ENV from '../config/environment';
import registerLoggingConsumer from 'ember-logging-amplititude/instance-initializers/register-logging-consumer';

export function initialize(instance) {
  registerLoggingConsumer(instance, ENV);
}

export default {
  name: 'ember-logging-amplititude',
  initialize
};

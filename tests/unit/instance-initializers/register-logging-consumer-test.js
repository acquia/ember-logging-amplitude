import { test, module } from 'qunit';
import registerLoggingConsumer from 'ember-logging-amplitude/instance-initializers/register-logging-consumer';
import AmplititudeLoggingConsumer from 'ember-logging-amplitude/services/amplitude-logging-consumer';
import Ember from 'ember';

const {
  isArray,
  Service
} = Ember;

module('Unit | Instance Initializers | register-logging-consumer');

test('it configures the logging consumer', function(assert) {
  assert.expect(5);

  let environmentMock = {
    'ember-logging-amplitude': {
      enabled: true,
      apiKey: 'my-api-key',
      tags: ['tag-1', 'tag-2']
    }
  };
  let loggerMock = Service.create({
    registerConsumer(id, callback, levels, tags) {
      assert.equal(id, 'ember-logging-amplitude', 'Consumer is given a unique ID.');
      assert.ok(isArray(callback), 'A callback array is provided.');
      assert.equal(levels, 'info', 'The default level is provided.');
      assert.deepEqual(tags, ['tag-1', 'tag-2'], 'Tags are passed through.');
    },
    registerTags(tags) {
      assert.deepEqual(tags, ['tag-1', 'tag-2'], 'Tags are registered.');
    },
    levels: {
      info: 'info'
    }
  });
  let consumer = AmplititudeLoggingConsumer.create();
  let instanceMock = {
    lookup(factoryName) {
      if (factoryName === 'service:amplitudeLoggingConsumer') {
        return consumer;
      }
      if (factoryName === 'service:logger') {
        return loggerMock;
      }
    }
  };

  registerLoggingConsumer(instanceMock, environmentMock);
});

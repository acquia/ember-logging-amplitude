import { test, module } from 'qunit';
import registerLoggingConsumer from 'ember-logging-amplitude/instance-initializers/register-logging-consumer';
import AmplititudeLoggingConsumer from 'ember-logging-amplitude/services/amplitude-logging-consumer';
import Ember from 'ember';

module('Unit | Instance Initializers | register-logging-consumer');

test('it configures the logging consumer', function(assert) {
  assert.expect(6);

  let environmentMock = {
    environment: 'unit-testing',
    'ember-logging-amplitude': {
      enabled: true,
      tags: ['tag-1', 'tag-2']
    }
  };
  let loggerMock = Ember.Service.create({
    registerConsumer(id, callback, levels, tags, environment) {
      assert.equal(id, 'ember-logging-amplitude', 'Consumer is given a unique ID.');
      assert.ok(Ember.isArray(callback), 'A callback array is provided.');
      assert.equal(levels, 'info', 'The default level is provided.');
      assert.deepEqual(tags, ['tag-1', 'tag-2'], 'Tags are passed through.');
      assert.equal(environment, 'unit-testing', 'The current environment is sent.');
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

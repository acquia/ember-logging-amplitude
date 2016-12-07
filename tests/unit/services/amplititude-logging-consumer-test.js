import QUnit from 'qunit';
import Ember from 'ember';
import AmplitudeLoggingConsumer from 'ember-logging-amplitude/services/amplitude-logging-consumer';

QUnit.module('Unit | Service | amplitude-logging-consumer');

QUnit.test('it has publicly accessible methods.', function(assert) {
  assert.expect(1);

  let consumer = AmplitudeLoggingConsumer.create();
  assert.ok(consumer.loggerCallback, 'Logger callback is accessible.');
});

QUnit.test('it sends events to amplitude but context only once.', function(assert) {
  assert.expect(9);

  let service = Ember.Object.create({
    setApplicationVersion(version) {
      assert.equal(version, '1.0', 'Version number is set.');
    },
    setUserId(userId) {
      assert.equal(userId, 'yep yep', 'User id is set.');
    },
    setUserProperties(props) {
      assert.deepEqual(props, { account_id: 'monsters', site_id: 'sesame' }); // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
    },
    sendEvent(name, data) {
      assert.equal(name, 'nope nope', 'Event name is sent.');
      assert.deepEqual(data, { street: 'Sesame', 'Application Route': 'current.route' }, 'Event data is sent.');
    }
  });
  let ampContextCallback = (context) => {
    return {
      applicationVersion: context.application.version,
      userId: context.user.id,
      userProperties: {
        account_id: context.application.clientId,
        site_id: context.application.siteId
      }
    };
  };
  let consumer = AmplitudeLoggingConsumer.create({
    amplitude: service,
    amplitudeContextCallback: ampContextCallback
  });
  let sendEvent = {
    name: 'nope nope',
    metadata: {
      street: 'Sesame'
    }
  };
  let sendContext = {
    application: {
      version: '1.0',
      clientId: 'monsters',
      siteId: 'sesame',
      routeName: 'current.route'
    },
    user: {
      id: 'yep yep'
    }
  };
  // Using assert.expect to track expected number of callbacks.
  consumer.loggerCallback(sendEvent, sendContext);
  consumer.loggerCallback(sendEvent, sendContext);
  consumer.loggerCallback(sendEvent, sendContext);
});
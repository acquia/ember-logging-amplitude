import QUnit from 'qunit';
import Ember from 'ember';
import Amplitude from 'ember-logging-amplitude/services/amplitude';

QUnit.module('Unit | Service | ember-cli-amplitude amplitude');

QUnit.test('it has publically accessible methods', function(assert) {
  assert.expect(5);

  let service = Amplitude.create();
  assert.ok(service.logoutUser, 'Log out user is available.');
  assert.ok(service.setUserId, 'Set user id is available.');
  assert.ok(service.setApplicationVersion, 'Set application version is available.');
  assert.ok(service.setUserProperties, 'Set user properties is available.');
  assert.ok(service.sendEvent, 'Send event is available.');
});

QUnit.test('it can set the user identity', function(assert) {
  assert.expect(1);

  let apiMock = Ember.Service.create({
    setUserId(userId) {
      assert.equal(userId, 'Gonzo', 'The user id has been set on the api.');
    }
  });

  let service = Amplitude.create({ api: apiMock });
  service.setUserId('Gonzo');
});

QUnit.test('it can clear the user identity', function(assert) {
  assert.expect(1);

  let apiMock = Ember.Service.create({
    setUserId(userId) {
      assert.equal(userId, null, 'The user id has been cleared on the api.');
    }
  });

  let service = Amplitude.create({ api: apiMock });
  service.logoutUser();
});

QUnit.test('it can set the application version', function(assert) {
  assert.expect(1);

  let apiMock = Ember.Service.create({
    getInstance() {
      return {
        setVersionName(name) {
          assert.equal(name, '1.0', 'The version name has been set on the api.');
        }
      };
    }
  });

  let service = Amplitude.create({ api: apiMock });
  service.setApplicationVersion('1.0');
});

QUnit.test('it can set user properties', function(assert) {
  assert.expect(1);

  let userProps = {
    'name': 'Gonzo',
    'passion': 'Chickens',
    'job': 'Balloon vendor'
  };

  let apiMock = Ember.Service.create({
    getInstance() {
      return {
        setUserProperties(props) {
          assert.deepEqual(props, userProps, 'The user properties were sent to the api.');
        }
      };
    }
  });

  let service = Amplitude.create({ api: apiMock });
  service.setUserProperties(userProps);
});

QUnit.test('it can send events', function(assert) {
  assert.expect(2);

  let eventData = {
    'location': 'County Fair'
  };

  let apiMock = Ember.Service.create({
    getInstance() {
      return {
        logEvent(name, data) {
          assert.equal(name, 'First sighting', 'Event name was passed to the api.');
          assert.deepEqual(data, eventData, 'Event metadata was passed to the api.');
        }
      };
    }
  });

  let service = Amplitude.create({ api: apiMock });
  service.sendEvent('First sighting', eventData);
});

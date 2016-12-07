import Ember from 'ember';

export default Ember.Service.extend({
  /**
   * A reference to the amplitude SDK.
   * @property api
   * @type {Object}
   * @public
   */
  api: window.amplitude,

  /**
   * Indicates that the current user is no longer active for tracking.
   * @method  logoutUser
   * @public
   */
  logoutUser() {
    this.setUserId(null);
  },

  /**
   * Sets up the current user.
   * @param {String}  userId    The ID of the current user
   * @method  setUserId
   * @public
   */
  setUserId(userId) {
    let amplitude = this.get('api');
    amplitude.setUserId(userId);
  },

  /**
   * Sets up the application version.
   * @param {String} version The version to indicate.
   * @method  setApplicationVersion
   * @public
   */
  setApplicationVersion(version) {
    let amplitude = this.get('api');
    amplitude.getInstance().setVersionName(version);
  },

  /**
   * Sets up any user properties.
   * @param {Object} properties   The properties and their values to set.
   * @method  setUserProperties
   * @public
   */
  setUserProperties(properties) {
    let amplitude = this.get('api');
    amplitude.getInstance().setUserProperties(properties);
  },

  /**
   * Sends an event to amplitude.
   * @param  {String} eventName       The event identifier
   * @param  {Object} eventProperties Any event properties to send along with
   *                                  the event.
   * @method  sendEvent
   * @public
   */
  sendEvent(eventName, eventProperties = {}) {
    let amplitude = this.get('api');
    amplitude.getInstance().logEvent(eventName, eventProperties);
  }
});

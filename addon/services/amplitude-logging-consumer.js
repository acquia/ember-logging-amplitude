import Ember from 'ember';

export default Ember.Service.extend({
  /**
   * Indicates if the application/user context has been sent yet.
   * @property _contextSent
   * @type {Boolean}
   * @private
   */
  _contextSent: false,

  /**
   * A reference to the amplitude wrapper service.
   * @property amplitude
   * @type {Service}
   * @public
   */
  amplitude: Ember.inject.service(),

  /**
   * A callback that is used to generate the amplititude specific context
   * from an event.  This should include the data required for setting the
   * context on Amplitude.
   *
   * The callback will receive the event context as a paramter and should return
   * an object with the following keys:
   *   applicationVersion  The version number for this application
   *   userId              An ID for the current user
   *   userProperties      An object of user properties to be stored
   *
   * @property amplitudeContextCallback
   * @type {Function}
   * @public
   */
  amplitudeContextCallback: null,

  /**
   * Overrides Service.init to set up event listeners.
   * @method  init
   * @public
   */
  init() {
    this._super(...arguments);
  },

  /**
   * Amplitude callback function for logger
   * @param  {Object} event   logger event object
   * @param  {Object} context Application and user context
   */
  loggerCallback(event, context) {
    event.metadata = event.metadata || {};
    event.metadata['Application Route'] = context.application.routeName;
    this._sendContext(context);
    this.get('amplitude').sendEvent(event.name, event.metadata);
  },

  /**
   * Sends the application and user context to Amplitude if it hasn't alreay
   * been sent.
   * @method  _sendContext
   * @private
   * @param  {Object} context Context object returned along with an event.
   */
  _sendContext(context) {
    if (this._contextSent) {
      return;
    }
    let callback = this.get('amplitudeContextCallback');
    if (Ember.typeOf(callback) !== 'function') {
      return;
    }
    let ampContext = callback(context);

    let service = this.get('amplitude');
    if (ampContext.applicationVersion) {
      service.setApplicationVersion(ampContext.applicationVersion); 
    }
    if (ampContext.userId) {
      service.setUserId(ampContext.userId); 
    }
    if (ampContext.userProperties) {
      service.setUserProperties(ampContext.userProperties);
    }
    this._contextSent = true;
  }
});

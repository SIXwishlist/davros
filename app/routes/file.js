import Ember from 'ember';

export default Ember.Route.extend({

  socketService: Ember.inject.service('websockets'),

  init: function() {
    this._super.apply(this, arguments);

    var socket = this.get('socketService').socketFor(this.get('socketUrl'));

    socket.on('message', this.messageHandler, this);
  },

  messageHandler: function(rawMessage) {
    var message = JSON.parse(rawMessage.data);
    console.log(message);

    if(message.file) {
      if(this.get('controller.model.id') === message.file) {
        this.get('controller.model').reload();
      }
    }
  },

  socketUrl: function() {
    return "ws://" + document.location.host;
  }.property(),

  model: function(params) {
    var id = params.path;
    if(!id) { id = '/'; }
    return this.store.find('file', id);
  },

  setupController: function(controller, model) {
    this._super(controller, model);

    model.reload();
  },

  renderTemplate: function() {
    if(this.get('controller.model.isDirectory')) {
      this.render('directory');
    } else {
      this.render('file');
    }
  }
});

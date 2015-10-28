/* global Backbone: true */

'use strict';

(function() {
  var PhotoModel = Backbone.Model.extend({
    initialize: function() {
      this.set('liked', false);
    },

    like: function() {
      this.set('liked', true);
      var likes = this.get('likes');
      this.set('likes', ++likes);
    },

    dislike: function() {
      this.set('liked', false);
    }
  });

  window.PhotoModel = PhotoModel;

})();

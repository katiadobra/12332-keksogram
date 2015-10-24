/* global Backbone: true PhotoModel: true */

'use strict';

(function() {
  /**
   * @constructor
   * @param {Object} attributes
   * @param {Object} options
   */
  var PicturesCollection = Backbone.Collection.extend({
    model: PhotoModel,
    url: 'data/pictures.json'
  });

  window.PicturesCollection = PicturesCollection;
})();

/* global Backbone: true */

'use strict';

define([
  'models/photo'
], function(PhotoModel) {
  /**
   * @constructor
   * @param {Object} attributes
   * @param {Object} options
   */
  var PhotosCollection = Backbone.Collection.extend({
    model: PhotoModel,
    url: 'data/pictures.json'
  });

  return PhotosCollection;
});

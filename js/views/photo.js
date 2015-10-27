/* global Backbone: true */

'use strict';

(function() {

  var REQUEST_FAILURE_TIMEOUT = 10000;
  /**
   * @type {Element}
   */
  var pictureTemplate = document.querySelector('#picture-template');

  /**
   * @constructor
   * @extends {Backbone.View}
   */
  var PhotoView = Backbone.View.extend({
    /**
     * @override
     */
    initialize: function() {
      this._onImageLoad = this._onImageLoad.bind(this);
      this._onImageFail = this._onImageFail.bind(this);
      // this._onModelLike = this._onModelLike.bind(this);
      this._onClick = this._onClick.bind(this);

      // this.model.on('change:liked', this._onModelLike);
    },

    /**
     * Маппинг событий происходящих на элементе на названия методов обработчиков
     * событий.
     * @type {Object.<string, string>}
     */
    events: {
      'click': '_onClick'
    },

    /**
     * Тег, использующийся для элемента представления.
     * @type {string}
     * @override
     */
    tagName: 'div',

    /**
     * Класс элемента.
     * @type {string}
     * @override
     */
    className: 'picture',

    /**
     * Отрисовка карточки отеля
     * @override
     */

    render: function() {
      this.el.appendChild(pictureTemplate.content.children[0].cloneNode(true));

      this.el.querySelector('.picture-likes').textContent = this.model.get('likes');
      this.el.querySelector('.picture-comments').textContent = this.model.get('comments');

      if (this.model.get('url')) {
        var pictureImg = new Image();
        pictureImg.src = this.model.get('url');

        this._imageLoadTimeout = setTimeout(function() {
          this.el.classList.add('picture-load-failure');
        }.bind(this), REQUEST_FAILURE_TIMEOUT);

        var oldImage = this.el.querySelector('img');

        pictureImg.addEventListener('load', function() {
          this.el.querySelector('img').parentNode.replaceChild(pictureImg, oldImage);
          pictureImg.width = 182;
          pictureImg.height = 182;
        }.bind(this));

        pictureImg.addEventListener('error', function() {
          this.classList.add('picture-load-failure');
        });


        pictureImg.addEventListener('load', this._onImageLoad);
        pictureImg.addEventListener('error', this._onImageFail);
        pictureImg.addEventListener('abort', this._onImageFail);
      }
    },

    /**
     * Обработчик кликов по элементу.
     * @param {MouseEvent} evt
     * @private
     */
    _onClick: function(evt) {
      evt.preventDefault();
      var clickedElement = evt.target; // or CurrentTarget??

      if (!clickedElement.classList.contains('picture-load-failure')) {
        // var galleryEvent = new CustomEvent('galleryclick', {
          // detail: { photoUrl: this.model.get['url'], photoIndex: this.index }
        this.trigger('galleryclick');
        //window.dispatchEvent(galleryEvent);
      }
    },

      // Клик по иконке сердца, добавляет отель в избранное или удаляет его
      // из избранного.
      // if (evt.target.classList.contains('hotel-favourite')) {
      //   if (this.model.get('liked')) {
      //     this.model.dislike();
      //   } else {
      //     this.model.like();
      //   }
      // }
    _onImageFail: function(evt) {
      var failedImage = evt.path[0];

      this._cleanupImageListeners(failedImage);
      this.el.classList.add('picture-load-failure');
      //clearTimeout(this._imageLoadTimeout); // ???
    },

    _onImageLoad: function(evt) {
      clearTimeout(this._imageLoadTimeout);

      var loadedImage = evt.path[0];


      this._cleanupImageListeners(loadedImage);
    },

    /**
     * Удаление обработчиков событий на элементе.
     * @param {Image} image
     * @private
     */
    _cleanupImageListeners: function(image) {
      image.removeEventListener('load', this._onImageLoad);
      image.removeEventListener('error', this._onImageError);
      image.removeEventListener('abort', this._onImageError);
    }
  });

  window.PhotoView = PhotoView;
})();

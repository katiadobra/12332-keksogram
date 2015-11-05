'use strict';

define([
  'views/photo-preview'
], function(GalleryPicture) {
  var Key = {
    'ESC': 27,
    'LEFT': 37,
    'RIGHT': 39
  };

  function loop(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  //@constructor
  // конструктор для галереи
  var Gallery = function() {
    this.element = document.querySelector('.gallery-overlay');
    this.closeBtn = this.element.querySelector('.gallery-overlay-close');
    this._photoElement = this.element.querySelector('.gallery-overlay-image');
    this.galleryPicture = null;

    this._photos = [];
    this._currentPhoto = 0;

    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
  };

  // метод show через прототип показывает галерею
  Gallery.prototype.show = function() {
    this.element.classList.remove('invisible');
    this.closeBtn.addEventListener('click', this._onCloseButtonClick); // add Listener for click
    document.body.addEventListener('keydown', this._onDocumentKeyDown); // add Listener for keyboard
    // this._photoElement.addEventListener('click', this._onPhotoClick);

    this._showCurrentPhoto();
  };

  // метод hide через прототип скрывает галерею
  Gallery.prototype.hide = function() {
    if (this.galleryPicture) {
      this.galleryPicture.destroy();
    }
    this.element.classList.add('invisible');
    this.closeBtn.removeEventListener('click', this._onCloseButtonClick);
    document.body.removeEventListener('keydown', this._onDocumentKeyDown);
    // this._photoElement.removeEventListener('click', this._onPhotoClick);

    this._photos = [];
    this._currentPhoto = 0;
  };

/** Обработчик события клика по закрывающему элементу _onCloseButtonClick,
 * который вызывает метод hide.
 */
  Gallery.prototype._onCloseButtonClick = function(evt) {
    evt.preventDefault(); // be on the safe side
    this.hide();
  };

/**  вызывает закрытие галереи по нажатию Esc
 * и переключение фотографий по нажатию клавиш влево и вправо
 */
  Gallery.prototype._onDocumentKeyDown = function(evt) {
    switch (evt.keyCode) {
      case Key.LEFT:
        this.setCurrentPhoto(this._currentPhoto - 1);
        this._showCurrentPhoto();
        break;
      case Key.RIGHT:
        this.setCurrentPhoto(this._currentPhoto + 1);
        this._showCurrentPhoto();
        break;
      case Key.ESC:
        this.hide();
        break;
      default: break;
    }
  };

/** записывает в приватное свойство _photos массив
 * с адресами фотографий, которые показываются в галерее.
 */
  Gallery.prototype.setPhotos = function(photos) {
    this._photos = photos;
  };

/** записывает в приватное свойство _currentPhoto индекс
 * текущей показанной фотографии, показывает ее на экране
 * и пишет ее номер в соответствующем блоке.
 */
  Gallery.prototype.setCurrentPhoto = function(index) {
    index = loop(index, 0, this._photos.length - 1);

    if (this._currentPhoto === index) {
      return;
    }

    this._currentPhoto = index;
    this._showCurrentPhoto();
  };

  Gallery.prototype._showCurrentPhoto = function() {
    var currentModel = this._photos.at(this._currentPhoto);
    if (currentModel.get('preview')) {
      this.galleryPicture = new GalleryPicture({model: currentModel});
    }

    this._element.replaceChild(this.galleryPicture.el, this._pictureElement);
    this._pictureElement = this.galleryPicture.el;
    this._pictureElement.addEventListener('click', this._onPhotoClick);
  };

/** вызывает метод setCurrentPhoto с определенными параметрами. */
  Gallery.prototype._onPhotoClick = function() {
    this.setCurrentPhoto(this._currentPhoto + 1);
    this._showCurrentPhoto();
  };

  return Gallery;
});

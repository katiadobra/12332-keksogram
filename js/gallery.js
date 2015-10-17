'use strict';

(function() {
  // var Key = {
  //   'ESC': 27
  // };

  //@constructor
  // конструктор для галереи
  var Gallery = function() {
    this.element = document.querySelector('.gallery-overlay');
    this.closeBtn = this.element.querySelector('.gallery-overlay-close');
    this._photoElement = document.querySelector('.gallery-overlay-preview');

    this._photos = [];
    this._currentPhoto = 0;
  };

  // метод show через прототип показывает галерею
  Gallery.prototype.show = function() {
    this.element.classList.remove('invisible');
    this.closeBtn.addEventListener('click', this._onCloseButtonClick); // add Listener for click
    document.body.addEventListener('keydown', this._onKeyDown); // add Listener for keyboard
    this._photoElement.addEventListener('click', this._onPhotoClick);

    this._showCurrentPhoto();
  };

  // метод hide через прототип скрывает галерею
  Gallery.prototype.hide = function() {
    this.element.classList.add('invisible');
    this.closeBtn.removeEventListener('click', this._onCloseButtonClick); // remove Listener for click
    document.body.addEventListener('keydown', this._onKeyDown); // remove Listener for keyboard
    this._photoElement.addEventListener('click', this._onPhotoClick);

    this._photos = [];
    this._currentPhoto = 0;
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
  Gallery.prototype.setCurrentPhoto = function() {

  };

/** вызывает метод setCurrentPhoto с определенными параметрами. */
  Gallery.prototype._onPhotoClick = function() {

  };

/**  вызывает закрытие галереи по нажатию Esc
 * и переключение фотографий по нажатию клавиш влево и вправо
 */
  Gallery.prototype._onDocumentKeyDown = function() {

  };

/** Обработчик события клика по закрывающему элементу _onCloseButtonClick,
 * который вызывает метод hide.
 */
  // Gallery.prototype.__onCloseButtonClick = function(evt) {
  //   evt.preventDefault();
  //   this.hide();
  // };

  window.Gallery = Gallery;
})();

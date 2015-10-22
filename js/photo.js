'use strict';

(function() {

  var pictureTemplate = document.querySelector('.picture-template');

  /**
   * конструктор для фото
   */
  var Photo = function(data, index) {
    this._data = data;
    this.index = index;

    /** чтобы обработчик являлся методом класса
     *событие клик привязывается к тому отелю, на котором вызвано
     */
    this._onClick = this._onClick.bind(this);
  };


  // метод render через прототип
  Photo.prototype.render = function(container) {
    var newPictureElement = pictureTemplate.content.children[0].cloneNode(true);

    var pictureImg = new Image();
    pictureImg.src = this._data['url'];

    newPictureElement.querySelector('.picture-likes').textContent = this._data['likes'];
    newPictureElement.querySelector('.picture-comments').textContent = this._data['comments'];

    container.appendChild(newPictureElement);


    pictureImg.onerror = function() {
      newPictureElement.classList.add('picture-load-failure');
    };

    pictureImg.onload = function() {
      newPictureElement.replaceChild(pictureImg, newPictureElement.querySelector('img'));
      pictureImg.width = 182;
      pictureImg.height = 182;
    };

    this._element = newPictureElement;
    this._element.addEventListener('click', this._onClick); // Обработчик события клик - метод конструктора Photo
  };


  // метод unrender
  Photo.prototype.unrender = function() {
    this._element.parentNode.removeChild(this._element);
    this._element.removeEventListener('click', this._onClick);
    this._element = null;
  };

  // метод like
  Photo.prototype.like = function() {

  };

  // метод для обработки клика
  Photo.prototype._onClick = function(evt) {
    /** создает кастомное событие galleryclick с добавочными данными
     *  в свойстве detail, которые указывают на текущий объект Photo.
     *  Это используется для передачи фотографий в фотогалерею. */
    evt.preventDefault();
    if (!this._element.classList.contains('picture-load-failure')) {
      var galleryEvent = new CustomEvent('galleryclick', {
        detail: { photoUrl: this._data['url'], photoIndex: this.index }
      });
      window.dispatchEvent(galleryEvent);
    }
  };

  Photo.prototype.getPhotos = function() {
    return this._data.pictures;
  };

  // Picture в глобальную область видимости
  window.Photo = Photo;
})();

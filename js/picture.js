'use strict';

(function() {

  var pictureTemplate = document.querySelector('.picture-template');

  // @constructor
  // конструктор для фото
  var Photo = function(data) {
    this._data = data;
    // this._onClick = this._onClick.bind(this);
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
  };


  // метод unrender
  Photo.prototype.unrender = function() {
    this._element.parentNode.removeChild(this._element);
    this._element = null;
  };

  // метод like
  Photo.prototype.like = function() {

  };

  // метод для обработки клика
  Photo.prototype._onClick = function() {

  };

  // Picture в глобальную область видимости
  window.Photo = Photo;
})();

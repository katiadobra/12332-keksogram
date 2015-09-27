'use strict';

(function(){

  // Hide filters
  var filters = document.querySelector('.filters');
      filters.classList.add('hidden');

  var picturesContainer = document.querySelector('.pictures')
  var pictureTemplate = document.querySelector('#picture-template');
  var picturesFragment = document.createDocumentFragment();

  // Add pictures
  pictures.forEach(function(picture, i){
    var newPictureElement = pictureTemplate.content.children[0].cloneNode(true);

    newPictureElement.querySelector('.picture-likes').textContent = picture['likes'];
    newPictureElement.querySelector('.picture-comments').textContent = picture['comments'];


    // Set img
    if (picture['url']) {
      var pictureImg = new Image();
      pictureImg.src = picture['url'];

      pictureImg.onerror = function(evt) {
        newPictureElement.classList.add('picture-load-failure');
      }

      pictureImg.onload = function() {
        newPictureElement.replaceChild(pictureImg, newPictureElement.querySelector('img'));
        pictureImg.width = 182;
        pictureImg.height = 182;
      }
    }
    
    picturesFragment.appendChild(newPictureElement);
  });

  picturesContainer.appendChild(picturesFragment);

  // Show filters
  filters.classList.remove('hidden');

})();
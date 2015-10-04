'use strict';

(function() {
  var Key = {
    'ESC': 27,
    'LEFT': 37,
    'RIGHT': 39
  };

  var picturesContainer = document.querySelector('.pictures');
  var galleryElement = document.querySelector('.gallery-overlay');
  var closeBtn = galleryElement.querySelector('.gallery-overlay-close');

  function doesHaveParent(el, className) {
    do {
      if (el.classList.contains(className)) {
        return !el.classList.contains('picture-nophoto');
      }
      el = el.parentElement;
    } while (el);

    return false;
  }

  function hideGallery() {
    galleryElement.classList.add('invisible');
    closeBtn.removeEventListener('click', closeHandler); // remove Listener for click
    document.body.addEventListener('keydown', keyHandler); // remove Listener for keyboard
  }

  function closeHandler(evt) {
    evt.preventDefault(); // be on the safe side
    hideGallery();
  }

  function keyHandler(evt) {
    switch (evt.keyCode) {
      case Key.LEFT:
        console.log('show previous photo');
        break;
      case Key.RIGHT:
        console.log('show next photo');
        break;
      case Key.ESC:
        hideGallery();
        break;
      default: break;
    }
  }

  function showGaller() {
    galleryElement.classList.remove('invisible');
    closeBtn.addEventListener('click', closeHandler); // add Listener for click
    document.body.addEventListener('keydown', keyHandler); // add Listener for keyboard
  }

// add Listener on pictures container
  picturesContainer.addEventListener('click', function(evt) {
    evt.preventDefault();
    if (doesHaveParent(evt.target, 'picture')) { // smart Delegation
      showGaller();
    }
  });

})();

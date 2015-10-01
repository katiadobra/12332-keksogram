'use strict';

(function(){

  var ReadyState = {
    'UNSENT': 0,
    'OPENED': 1,
    'HEADERS_RECEIVED': 2,
    'LOADING': 3,
    'DONE': 4
  };

  var REQUEST_FAILURE_TIMEOUT = 10000;
  var picturesContainer = document.querySelector('.pictures')
  var filters = document.querySelector('.filters');
  var pictures;


  // renderPictures
  function renderPictures(pictures) {
    var pictureTemplate = document.querySelector('.picture-template');
    var picturesFragment = document.createDocumentFragment();

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
  }


  function showLoadFailure() {
    picturesContainer.classList.add('pictures-failure ');
  }


  // Load pictures with XHR
  function loadPictures(callback) {
    filters.classList.add('hidden');

    var xhr = new XMLHttpRequest();

    xhr.timeout = REQUEST_FAILURE_TIMEOUT;
    xhr.open('get', 'data/pictures.json', true);
    xhr.send();


    xhr.onreadystatechange = function(evt ) {
      var loadedXhr = evt.target;

      switch (loadedXhr.readyState) {
        case ReadyState.OPENED:
        case ReadyState.HEADERS_RECEIVED:
        case ReadyState.LOADING:
          picturesContainer.classList.add('pictures-loading');
          break;

        case ReadyState.DONE:
        default:
          picturesContainer.classList.remove('pictures-loading');
          if (loadedXhr.status === 200) {
            var data = loadedXhr.response;
            callback(JSON.parse(data)); // data from JSON to render
            filters.classList.remove('hidden');
          }
          if (loadedXhr.status >= 400) {
            showLoadFailure();
          }
          break;
      }
    };

    xhr.ontimeout = function() {
      showLoadFailure();
    }
  }

  function filterPictures(pictures, value) {
    var filteredPictures = pictures.slice(0);
    switch (value) {
      case 'new':
        filteredPictures = filteredPictures.sort(function(a, b) {
          if (a.date > b.date) {
            return 1;
          }
          if (a.date < b.date) {
            return -1;
          }
          if (a.date === b.date) {
            return 0;
          }
        });
        break;

      case 'discussed':
        filteredPictures = filteredPictures.sort(function(a, b) {
          if (a.comments > b.comments) {
            return 1;
          }
          if (a.comments < b.comments) {
            return -1;
          }
          if (a.comments === b.comments) {
            return 0;
          }
        });
        break;

      case 'popular':
      default:
        filteredPictures = pictures.slice(0);
        break;
    }

    console.log('filteredPictures');
    return filteredPictures;
  }

  function initFilters() {
    var filterElements = document.querySelectorAll('.filters-item');
    for (var i = 0; i < filterElements.length; i++) {
      filterElements[i].onclick = function(evt) {
        var label = evt.target.htmlFor;
        var input = document.querySelector('#' + label);
        var selectedFilter = input.value;

        console.log('initFilters');

        setActiveFilter(selectedFilter);
      }
    }
  }

  function setActiveFilter(filterValue) {
    console.log('setActiveFilter');

    var filteredPictures = filterPictures(pictures, filterValue);
    renderPictures(filteredPictures);
  }



  initFilters();

  loadPictures(function(loadedPictures) {
    pictures = loadedPictures;

    console.log('loadPictures');
    setActiveFilter('popular');
  });

})();

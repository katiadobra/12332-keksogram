'use strict';

(function() {

  var ReadyState = {
    'UNSENT': 0,
    'OPENED': 1,
    'HEADERS_RECEIVED': 2,
    'LOADING': 3,
    'DONE': 4
  };

  var REQUEST_FAILURE_TIMEOUT = 10000;
  var PAGE_SIZE = 12;

  var picturesContainer = document.querySelector('.pictures');
  var filters = document.querySelector('.filters');
  var pictures; // initial state of pictures
  var currentPictures; // current state of renderd pictures
  var currentPage = 0;


// render Pictures
  function renderPictures(picToRender, pageNumber, replace) {
    replace = typeof replace !== 'undefined' ? replace : true;
    pageNumber = pageNumber || 0;

    if (replace) {
      picturesContainer.classList.remove('picture-load-failure');
      picturesContainer.innerHTML = '';
    }

    var pictureTemplate = document.querySelector('.picture-template');
    var picturesFragment = document.createDocumentFragment();

    var renderFrom = pageNumber * PAGE_SIZE;
    var renderTo = renderFrom + PAGE_SIZE;
    picToRender = picToRender.slice(renderFrom, renderTo);

    picToRender.forEach(function(picture) {
      var newPictureElement = pictureTemplate.content.children[0].cloneNode(true);

      newPictureElement.querySelector('.picture-likes').textContent = picture['likes'];
      newPictureElement.querySelector('.picture-comments').textContent = picture['comments'];


// set img
      if (picture['url']) {
        var pictureImg = new Image();
        pictureImg.src = picture['url'];

        pictureImg.onerror = function() {
          newPictureElement.classList.add('picture-load-failure');
        };

        pictureImg.onload = function() {
          newPictureElement.replaceChild(pictureImg, newPictureElement.querySelector('img'));
          pictureImg.width = 182;
          pictureImg.height = 182;
        };
      }

      picturesFragment.appendChild(newPictureElement);
    });

    picturesContainer.appendChild(picturesFragment);
  }

// on error
  function showLoadFailure() {
    picturesContainer.classList.add('pictures-failure ');
  }


// load pictures with XHR
  function loadPictures(callback) {
    filters.classList.add('hidden');

    var xhr = new XMLHttpRequest();

    xhr.timeout = REQUEST_FAILURE_TIMEOUT;
    xhr.open('get', 'data/pictures.json', true);
    xhr.send();


    xhr.onreadystatechange = function(evt) {
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
    };
  }


// filter pictures
  function filterPictures(pic, value) {
    var filteredPictures = pictures.slice(0);
    switch (value) {
      case 'new':
        filteredPictures = filteredPictures.sort(function(a, b) {
          if (a.date > b.date) {
            return -1;
          }
          if (a.date < b.date) {
            return 1;
          }
          if (a.date === b.date) {
            return 0;
          }
        });
        break;

      case 'discussed':
        filteredPictures = filteredPictures.sort(function(a, b) {
          if (a.comments > b.comments) {
            return -1;
          }
          if (a.comments < b.comments) {
            return 1;
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

    localStorage.setItem('value', value); // write to localStorage
    return filteredPictures;
  }

  function initFilters() {
    var filterElements = document.querySelectorAll('.filters-item');
    for (var i = 0; i < filterElements.length; i++) {
      filterElements[i].addEventListener('click', function(evt) {
        var label = evt.target.htmlFor;
        var input = document.querySelector('#' + label);
        var selectedFilter = input.value;

        setActiveFilter(selectedFilter);
      });
    }
  }


  function setActiveFilter(filterValue) {
    currentPictures = filterPictures(pictures, filterValue);
    currentPage = 0;
    renderPictures(currentPictures, currentPage, true);
  }


// scroll event
  function isNextPageAvailable() {
    return currentPage < Math.ceil(pictures.length / PAGE_SIZE);
  }

  function isAtTheBottom() {
    var GAP = 100; // 100px bottom
    return picturesContainer.getBoundingClientRect().bottom - GAP <= window.innerHeight;
  }

  function checkNextPage() { // if we are at the bottom of the page - render next page
    if ( isNextPageAvailable() && isAtTheBottom() ) {
      window.dispatchEvent(new CustomEvent('needload'));
    }
  }

  function initScroll() {
    var someTimeout;
    window.addEventListener('scroll', function() {
      clearTimeout(someTimeout);
      someTimeout = setTimeout(checkNextPage, 100); // call func every 100ms
    });

    window.addEventListener('needload', function() {
      renderPictures(currentPictures, currentPage++, false);
    });
  }


// init events
  initFilters();
  initScroll();

  loadPictures(function(loadedPictures) {
    pictures = loadedPictures;
    setActiveFilter(localStorage.getItem('value') || 'popular'); // filter from localStorage or default
  });

})();

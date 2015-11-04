/* global Photo: true Gallery: true */

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
  var gallery = new Gallery();
  var currentPictures; // current state of renderd pictures
  var currentPage = 0;

  var picturesFragment = document.createDocumentFragment();

// render Pictures
  function renderPictures(data, pageNumber, replace) {
    replace = typeof replace !== 'undefined' ? replace : true;
    pageNumber = pageNumber || 0;

    if (replace) {
      picturesContainer.classList.remove('picture-load-failure');
      picturesContainer.innerHTML = '';
    }


    var renderFrom = pageNumber * PAGE_SIZE;
    var renderTo = renderFrom + PAGE_SIZE;
    data = data.slice(renderFrom, renderTo);

    // вторым аргументом передаётся индекс фото
    data.forEach(function(picData, index) {
      var newPictureElement = new Photo(picData, index + renderFrom);
      newPictureElement.render(picturesFragment);
      // renderedPictures.push(newPicElement);
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
  function filterPictures(value) {
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

    //localStorage.setItem('value', value); // write to localStorage
    return filteredPictures;
  }

// for delegation
  function doesHaveParent(el, className) {
    do {
      if (el.classList.contains(className)) {
        return true;
      }
      el = el.parentElement;
    } while (el);

    return false;
  }

  // add Listener on pictures container
  function initFilters() {
    var filtersContainer = document.querySelector('.filters');
    filtersContainer.addEventListener('click', function(event) {
      var clickedFilter = event.target;

      while (clickedFilter !== filtersContainer) {
        if (clickedFilter.classList.contains('filters-radio')) {
          window.location.hash = 'filters/' + clickedFilter.value;
          return;
        }
        clickedFilter = clickedFilter.parentElement;
      }
    });
  }

  /**
   * Получаем хэш, и запускаем setActiveFilter
   */
  function parseURL() {
    var hashValue = location.hash;
    var filterName = hashValue.match(/^#filters\/(\S+)$/);
    if (filterName) {
      setActiveFilter(filterName[1]);
    } else {
      setActiveFilter('popular');
    }
  }

  function setActiveFilter(filterValue) {
    currentPictures = filterPictures(pictures, filterValue);
    currentPage = 0;
    renderPictures(currentPictures, currentPage, true);
    var input = document.querySelector('#' + 'filter-' + filterValue);
    input.checked = true;
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

  // function initGallery() {
  //   window.addEventListener('galleryclick', function(event) {
  //     var photos = getAllPhotosUrl();
  //     gallery.setPhotos(photos);

  //     // var indexCurrentPhoto = photos.indexOf(event.detail.photoUrl);
  //     gallery.setCurrentPhoto(event.detail.photoIndex);
  //     gallery.show();
  //   });
  // }

  function getAllPhotosUrl() {
    var photosUrl = [];
    currentPictures.forEach(function(item) {
      photosUrl.push(item['url']);
    });
    return photosUrl;
  }


// init events
  initFilters();
  initScroll();
  // initGallery();
  parseURL();

  loadPictures(function(loadedPictures) {
    pictures = loadedPictures;
    window.addEventListener('hashchange', function() {
      parseURL();
    });
  });

})();

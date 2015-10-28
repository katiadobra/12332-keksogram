/* global
  Gallery: true
  PhotosCollection: true
  PhotoView: true
*/

'use strict';

(function() {
  /**
   * @const
   * @type {number}
   */
  var REQUEST_FAILURE_TIMEOUT = 10000;
  /**
   * @const
   * @type {number}
   */
  var PAGE_SIZE = 12;
  /**
   * @type {number}
   */
  var currentPage = 0;

  /**
   * Контейнер списка фотографий.
   * @type {Element}
   */
  var picturesContainer = document.querySelector('.pictures');

  /**
   * Объект типа фотогалерея.
   * @type {Gallery}
   */
  var gallery = new Gallery();

  // var filters = document.querySelector('.filters');
  var currentPictures;
  var picturesFragment = document.createDocumentFragment();

  /**
   * @type {PhotosCollection}
   */
  var photosCollection = new PhotosCollection();

  /**
   * @type {Array.<Object>}
   */
  var initiallyLoaded = [];

  /**
   * @type {Array.<HotelView>}
   */
  var renderedViews = [];


// render Pictures
  function renderPictures(pageNumber, replace) {
    // replace = typeof replace !== 'undefined' ? replace : true;
    // pageNumber = pageNumber || 0;

    var renderFrom = pageNumber * PAGE_SIZE;
    var renderTo = renderFrom + PAGE_SIZE;
    // data = data.slice(renderFrom, renderTo);

    if (replace) {
      // picturesContainer.classList.remove('picture-load-failure');
      // picturesContainer.innerHTML = '';
      while (renderedViews.length) {
        var viewToRemove = renderedViews.shift();
        // Важная особенность представлений бэкбона: remove занимается только удалением
        // обработчиков событий, по факту это метод, который нужен для того, чтобы
        // подчистить память после удаления элемента из дома. Добавление/удаление
        // элемента в DOM должно производиться вручную.
        picturesContainer.removeChild(viewToRemove.el);
        viewToRemove.off('galleryclick');
        viewToRemove.remove();
      }
    }



    // вторым аргументом передаётся индекс фото
    photosCollection.slice(renderFrom, renderTo).forEach(function(model) {
      var view = new PhotoView({ model: model});
      // var newPictureElement = new Photo(picData, index + renderFrom);
      // newPictureElement.render(picturesFragment);
      // renderedPictures.push(newPicElement);

      view.render();
      picturesFragment.appendChild(view.el);
      renderedViews.push(view);

      view.on('galleryclick', function() {
        gallery.setPhotos(view.model.get('pictures'));
        gallery.setCurrentPhoto(0);
        gallery.show();
      });
    });

    picturesContainer.appendChild(picturesFragment);
  }


  /**
   * Добавляет класс ошибки контейнеру с отелями. Используется в случае
   * если произошла ошибка загрузки отелей или загрузка прервалась
   * по таймауту.
   */
  function showLoadFailure() {
    picturesContainer.classList.add('pictures-failure');
  }

// filter pictures
  function filterPictures(value) {
    var filteredPictures = initiallyLoaded.slice(0);

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
        filteredPictures = initiallyLoaded.slice(0);
        break;
    }

    photosCollection.reset(filteredPictures);
    localStorage.setItem('value', value); // write to localStorage
    // return filteredPictures;
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
    var filterContainer = document.querySelector('.filters');

    filterContainer.addEventListener('click', function(evt) {
      evt.preventDefault();
      if (doesHaveParent(evt.target, 'filters-item')) {
        var clickedFilter = evt.target.htmlFor;
        var input = document.querySelector('#' + clickedFilter);
        var filterValue = input.value;

        setActiveFilter(filterValue);
      }
    });
  }


  function setActiveFilter(filterValue) {
    filterPictures(filterValue);
    currentPage = 0;
    renderPictures(currentPage, true);

    var input = document.querySelector('#' + 'filter-' + filterValue);
    input.checked = true;
    bottomSpace();
  }


// scroll event
  function isNextPageAvailable() {
    return currentPage < Math.ceil(photosCollection.length / PAGE_SIZE);
  }

  function isAtTheBottom() {
    var GAP = 100; // 100px bottom
    return picturesContainer.getBoundingClientRect().bottom - GAP <= window.innerHeight;
  }

  /**
   * Испускает на объекте window событие loadneeded если скролл находится внизу
   * страницы и существует возможность показать еще одну страницу.
   */
  function checkNextPage() { // if we are at the bottom of the page - render next page
    if ( isNextPageAvailable() && isAtTheBottom() ) {
      window.dispatchEvent(new CustomEvent('needload'));
    }
  }

  /**
   * Создает два обработчика событий: на прокручивание окна, который в оптимизированном
   * режиме (раз в 100 миллисекунд скролла) проверяет можно ли отрисовать следующую страницу;
   * и обработчик события loadneeded, который вызывает функцию отрисовки следующей страницы.
   */
  function initScroll() {
    var someTimeout;
    window.addEventListener('scroll', function() {
      clearTimeout(someTimeout);
      someTimeout = setTimeout(checkNextPage, 100); // call func every 100ms
    });

    window.addEventListener('needload', function() {
      renderPictures(++currentPage, false);
    });
  }

  function bottomSpace() {
    if (picturesContainer.getBoundingClientRect().bottom < window.innerHeight) {
      renderPictures(currentPage++, false);
    }
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

  // function getAllPhotosUrl() {
  //   var photosUrl = [];
  //   currentPictures.forEach(function(item) {
  //     photosUrl.push(item['url']);
  //   });
  //   return photosUrl;
  // }


// init events
  // initFilters();
  // initScroll();
  // initGallery();

  // loadPictures(function(loadedPictures) {
  //   pictures = loadedPictures;
  //   setActiveFilter(localStorage.getItem('value') || 'popular');
    // filter from localStorage or default
  // });
  photosCollection.fetch({ timeout: REQUEST_FAILURE_TIMEOUT }).success(function(loaded, state, jqXHR) {
    initiallyLoaded = jqXHR.responseJSON;
    initFilters();
    initScroll();
    // initGallery();

    setActiveFilter(localStorage.getItem('value') || 'popular');
  }).fail(function() {
    showLoadFailure();
  });

})();

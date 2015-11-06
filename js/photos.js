'use strict';

requirejs.config({
  baseUrl: 'js'
});

define([
  'gallery',
  'models/photo',
  'models/photos',
  'views/photo',

  'logo-background',
  'resize-picture',
  'resize-form',
  'upload-form',
  'filter-form'
], function(Gallery, PhotoModel, PhotosCollection, PhotoView) {
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
   * @const
   * @type {string}
   */
  var REG_EXP = /^#filters\/(\S+)$/;
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


  /**
   * Выводит на страницу список отелей постранично.
   * @param {number} pageNumber
   * @param {boolean=} replace
   */
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



    // итератор по коллекции (аргументом итератора является не элемент массива,
    // а модель внутри коллекции)
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

  /**
   * Фильтрация списка отелей. Принимает на вход список отелей
   * и ID фильтра. В зависимости от переданного ID применяет
   * разные алгоритмы фильтрации. Возвращает отфильтрованный
   * список и записывает примененный фильтр в localStorage.
   * Не изменяет исходный массив.
   * @param {string} filterID
   * @return {Array.<Object>}
   */
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
    //localStorage.setItem('value', value); // write to localStorage
    return filteredPictures;
  }

  /**
   * Проверяет есть ли у переданного элемента или одного из его родителей
   * переданный CSS-класс.
   * @param {Element} element
   * @param {string} className
   * @return {boolean}
   */
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

  /**
   * Инициализация подписки на клики по кнопкам фильтра.
   * Используется делегирование событий: события обрабатываются на объекте,
   * содержащем все фильтры, и в момент наступления события, проверяется,
   * произошел ли клик по фильтру или нет и если да, то вызывается функция
   * установки фильтра.
   */
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
        location.hash = 'filter/' + filterValue;
      }
    });
  }

  /**
   * Получаем хэш, и запускаем setActiveFilter
   */
  function parseURL() {
    var hashValue = location.hash;
    var filterName = hashValue.match(REG_EXP);
    if (filterName) {
      setActiveFilter(filterName[1] || 'popular');
    }
    bottomSpace();
  }

  /**
   * Вызывает функцию фильтрации на списке отелей с переданным fitlerID
   * и подсвечивает кнопку активного фильтра.
   * @param {string} filterID
   */
  function setActiveFilter(filterValue) {
    filterPictures(filterValue);
    currentPage = 0;
    renderPictures(currentPage, true);

    var input = document.querySelector('#' + 'filter-' + filterValue);
    input.checked = true;
    bottomSpace();
  }


  /**
   * Испускает на объекте window событие loadneeded если скролл находится внизу
   * страницы и существует возможность показать еще одну страницу.
   */
  function isNextPageAvailable() {
    return currentPage < Math.ceil(photosCollection.length / PAGE_SIZE);
  }

  /**
   * Проверяет, находится ли скролл внизу страницы.
   * @return {boolean}
   */
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

  window.addEventListener('hashchange', function() {
    parseURL();
  });
  /**
   * Использование встроенного меода Beckbone - fetch для загрузки данных внутрь коллекции (XHR)
   */
  photosCollection.fetch({ timeout: REQUEST_FAILURE_TIMEOUT }).success(function(loaded, state, jqXHR) {
    initiallyLoaded = jqXHR.responseJSON;


    initFilters();
    initScroll();
    parseURL();

  }).fail(function() {
    showLoadFailure();
  });
});

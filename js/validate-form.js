'use strict';

(function() {

  var uploadResizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];


  var resizeX = uploadResizeForm['resize-x'];
  var resizeY = uploadResizeForm['resize-y'];
  var resizeSize = uploadResizeForm['resize-size'];
  var resizeImg = uploadResizeForm.querySelector('.resize-image-preview');

  // The initial values of the fields
  resizeX.value = 0;
  resizeY.value = 0;
  resizeSize.value = 100;
  resizeX.min = 0;
  resizeY.min = 0;
  resizeSize.min = 50;


  // Setting the maximum displacement and adjustment to these values.
  // If the sizes do not match - change the value of input
  function displacementIsValid() {
    var resizeImgW = resizeImg.offsetWidth;
    var resizeImgH = resizeImg.offsetHeight;

    var resizeValueX = parseInt(resizeX.value, 10);
    var resizeValueY = parseInt(resizeY.value, 10);
    var side = parseInt(resizeSize.value, 10);

    resizeX.min = 0;
    resizeY.min = 0;
    resizeX.max = resizeImgW - side;
    resizeY.max = resizeImgH - side;


    if (resizeValueX < 0 || resizeValueY < 0 || resizeValueX === '') {
      return false;
    } else if (resizeValueX + side > resizeImgW || resizeValueY + side > resizeImgH) {
      return false;
    }

    return true;
  }

  function sideIsValid() {
    var resizeImgW = resizeImg.offsetWidth;
    var resizeImgH = resizeImg.offsetHeight;
    var side = parseInt(resizeSize.value, 10);

    if (side < 0 || side > resizeImgW || side > resizeImgH) {
      return false;
    }

    return true;
  }

  resizeY.onchange = resizeX.onchange = function() {
    displacementIsValid();
  };

  resizeSize.onchange = function() {
    sideIsValid();
  };

  uploadResizeForm.onsubmit = function(e) {
    e.preventDefault();

    if ( displacementIsValid() && sideIsValid() ) {
      filterForm.elements['filter-image-src'] = resizeImg.src;

      uploadResizeForm.classList.add('invisible');
      filterForm.classList.remove('invisible');
    }
  };

})();

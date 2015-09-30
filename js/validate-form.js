'use strict';

(function() {
  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];

  var displacementX = resizeForm['resize-x'];
  var displacementY = resizeForm['resize-y'];
  var resizeSide = resizeForm['resize-size'];

  var resizeImg = resizeForm.querySelector('.resize-image-preview');
  var prevButton = resizeForm['resize-prev'];

  // Initial values
  displacementX.value = 0;
  displacementY.value = 0;
  resizeSide.value = 100;

  // Minimal values
  displacementX.min = 0;
  displacementY.min = 0;
  resizeSide.min = 1;

  
  // Setting the maximum displacement and adjustment to these values. 
  // If the sizes do not match - change the value of input

  function setDisplacement() {
    displacementX.max = Math.max(resizeImg.offsetWidth - resizeSide.value, 0);
    displacementY.max = Math.max(resizeImg.offsetHeight - resizeSide.value, 0);

    if (displacementX.value > displacementX.max) {
      displacementX.value = displacementX.max;
    }

    if (displacementY.value > displacementY.max) {
      displacementY.value = displacementY.max;
    }
  }

  function displacementIsValid() {
    setDisplacement();

    return displacementX.value <= displacementX.max && displacementY.value <= displacementY.max;
  }

  function setResizeSide() {
    var resizeImgW = resizeImg.offsetWidth;
    var resizeImgH = resizeImg.offsetHeight;

    var resizeValueX = parseInt(displacementX.value, 10);
    var resizeValueY = parseInt(displacementY.value, 10);

    resizeSide.max = Math.min(resizeImgW - resizeValueX, resizeImgH - resizeValueY);

    if (resizeSide.value > resizeSide.max) {
      resizeSide.value = Math.max(resizeSide.max, resizeSide.min);
    }
  }

  function sideIsValid() {
      setResizeSide();

      return resizeSide.value <= resizeSide.max;
  }

  displacementY.onchange =  function(evt) {
    if (!displacementX.max) {
      setDisplacement();
    }

    setResizeSide();
  }

  displacementX.onchange = function(evt) {
    // displacementX.max = resizeImgW - resizeValueX;
    // displacementY.max = resizeImgH - resizeValueY;

    if (!displacementX.max) {
      setDisplacement();
    }

    setResizeSide();
  }

  resizeSide.onchange = function(evt) {
    setDisplacement();
  }


  resizeForm.onsubmit = function(evt) {
    evt.preventDefault();

    if ( displacementIsValid() && sideIsValid() ) {
      filterForm.elements['filter-image-src'] = resizeImg.src;

      resizeForm.classList.add('invisible');
      filterForm.classList.remove('invisible');
    } 
  }
  
})()
//PUSH DOWN ADS
function runPushDown(){

  var waitForParentMsg;
  var recievedParentMsg;

  window.addEventListener('message', function(e) {

    waitForParentMsg = "startPushDown";
    recievedParentMsg = e.data.psMsg;

    if(waitForParentMsg === recievedParentMsg) {
        window.parent.postMessage({
          'psMsg':'childGotMsg'
        },'*');
        pushDown();
    }

  });


  function pushDown() {

    var adBody = document.querySelector('body');//Get ad body
    var adContainer = document.querySelector('div');//Get ad first/main div
	if (adContainer) adContainer.style.display="inline-block";

	// For off-road.com
	if (typeof Object.assign != 'function') {
	  Object.assign = function(target) {
		'use strict';
		if (target == null) {
		  throw new TypeError('Cannot convert undefined or null to object');
		}

		target = Object(target);
		for (var index = 1; index < arguments.length; index++) {
		  var source = arguments[index];
		  if (source != null) {
			for (var key in source) {
			  if (Object.prototype.hasOwnProperty.call(source, key)) {
				target[key] = source[key];
			  }
			}
		  }
		}
		return target;
	  };
	}

    Object.assign(adBody.style, {
      "margin":"0",
      "padding":"0",
      "display":"inline-block",
      "overflow":"hidden",
    });

    window.addEventListener('load', changeIframeSize);

    ['click','mouseover','load','transitioned'].forEach( function(event) {
    adBody.addEventListener(event, changeIframeSize, false);
    });

    //the function that gets our new height and changes the size of our iframe.
    function changeIframeSize(){
    clearTimeout(debounce);
    var debounce = setTimeout(function() {


        adBody.style.height = adContainer.offsetHeight+"px";
        var newSize = adBody.style.height;

        window.parent.postMessage({
            'psMsg':'childGotMsg',
            'newHeight': newSize
          },'*');

      },70);
    };

    // use mutation observer to follow through on all changes.
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.attributeName === 'style') {
          changeIframeSize();
        }
      });
    });

    observer.observe(adBody, {
      childList: false,
      attributes: true
    });

  };
};

//HPTO BACKGROUND SYNC ADS
function bgSync(header, sticky){

  window.addEventListener('message', function(e) {
    if("startBgSync" === e.data.bgMsg) {
      var contentConteinerSelector = header;
      var contentFixedConteinerSelector = sticky;
      var parentAdjustmentCSS=document.getElementById('parentAdjustmentCSS').innerHTML;

      var adSettingsToPass = {
        adType: 'vsBackgroundTakeover',
        contentConteinerSelector: contentConteinerSelector,
        contentFixedConteinerSelector: contentFixedConteinerSelector,
        parentAdjustmentCSS:parentAdjustmentCSS
      }

      var finalMessage = JSON.stringify(adSettingsToPass);
      window.parent.postMessage({
        'bgCleared':'bgGotMSG',
        'passSettings': finalMessage
      },'*');
    }
  });
};


//PUSH DOWN ADS
function runPushDown(){

  window.addEventListener('message', function(e) {

    if("startPushDown" === e.data.psMsg) {
        window.parent.postMessage({
          'psMsg':'childGotMsg'
        },'*');
        pushDown();
    }

  });

  function pushDown() {

    var adBody = document.querySelector('body');//Get ad body
    var adContainer = document.querySelector('div');//Get ad first/main div

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

//COMPARE CAR ADS
window.addEventListener('message', function(e) {

  const adSettingsToPass = {
    adType: "vsCompareCar",
    adColumnNumber: 4,
    adData: {
      DoNotShow: false, // true - don't show the 4th column,  false - show it
      Img: "http://www.autoguide.com/new-cars/images/nvd/2016/mediums/20868.jpg",
      ImgURL:
        "%%CLICK_URL_UNESC%%http://www.autoguide.com/new-cars/2016/hyundai/elantra/se/4dr-sdn-man/index.html",
      Make: "Hyundai",
      Year: "2016",
      Model: "Elantra",
      Trim: "4dr Sdn Man SE",
      StyleID: "375448"
    }
  };

  const carCompareParams = JSON.stringify(adSettingsToPass);

  if("startCarCompare" === e.data.ccMsg) {
    window.parent.postMessage({
      'ccMsg':'carCompareReady',
      'ccData': carCompareParams
    },"*");

 }
});

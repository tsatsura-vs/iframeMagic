function runAds() {

//RUN BG SYNC ADS
var countebg = 0;
var sendStartBg = setInterval(startBgSync, 100);
var bgSyncId = document.querySelector('.vsHPTO-iframe iframe');
var bgSyncFrame = bgSyncId.contentWindow;

function startBgSync() {
  bgSyncFrame.postMessage({
    'bgMsg':'startBgSync'
  }, '*');

  countebg++;
  console.log(countebg);

  if (countebg === 33) {
    clearInterval(sendStartBg);
  }
};


var hideBGAd = document.getElementById('bgSyncBlock');

window.addEventListener('message', function(bge) {
    if ("bgGotMSG" === bge.data.bgCleared) {
        var vsAdData = JSON.parse(bge.data.passSettings);

        if (vsAdData.adType == "vsBackgroundTakeover") {

          bgSyncId.style.display = "none";
          var headerHeight = 0;

          setTimeout(function() {
            //wait 500 until the page loads
            if (vsAdData.parentAdjustmentCSS) {
              var parentAdjustmentCSS = document.createElement("style");
              parentAdjustmentCSS.innerHTML = vsAdData.parentAdjustmentCSS;
              parentAdjustmentCSS.classList.add("showBg");
              document.head.appendChild(parentAdjustmentCSS);
            }

            Object.assign(bgSyncId.style,{
              "display":"block",
              "border":"0px",
              "width":"100%",
              "height":"100vh",
              "position":"fixed",
              "z-index":"0",
              "top":"0",
              "left":"0"
            });

            if (vsAdData.contentConteinerSelector) {
              headerHeight = document.querySelector(vsAdData.contentConteinerSelector).offsetHeight;
            }

            //check if styles are loaded and unhide our background
            if (document.querySelector('.showBg').innerHTML != "") {
              hideBGAd.style.display = "block";
            } else {
              setTimeout(function() {
                hideBGAd.style.display = "block";
              },600);
            }

            var defaultMarginTop = headerHeight;
            var iframeMarginTop = 0;

            function getScrollPos() {
              scrollPosition = document.documentElement.scrollTop
                ? document.documentElement.scrollTop
                : document.body.scrollTop;

              //check if fixed header exists..
              if (vsAdData.contentFixedConteinerSelector !== null && vsAdData.contentFixedConteinerSelector !== '') {
                headerFixedHeight = document.querySelector(vsAdData.contentFixedConteinerSelector);
              } else {
                headerFixedHeight = null;
              }

              // console.log(headerFixedHeight.offsetHeight);
              if (scrollPosition <= headerHeight && headerFixedHeight === null ) {

                iframeMarginTop = defaultMarginTop - scrollPosition;
                bgSyncId.style.marginTop = "" + iframeMarginTop + "px";
                bgSyncId.style.top = "0px";
                //console.log('no sticky');

              } else if (headerFixedHeight !== null) {

                  var sticky = headerFixedHeight.offsetHeight;
                  var stickyMarginTop = headerHeight - sticky;

                  if (scrollPosition <= stickyMarginTop) {
                    iframeMarginTop = defaultMarginTop - sticky - scrollPosition;
                    bgSyncId.style.top = sticky+"px";
                    bgSyncId.style.marginTop = "" + iframeMarginTop + "px";
                  } else {
                    bgSyncId.style.marginTop = "0px";
                    bgSyncId.style.top = sticky+"px";
                  }


              } else {
                bgSyncId.style.marginTop = "0px";
                bgSyncId.style.top = "0px";
              }
            }

            getScrollPos();

            window.onscroll = function(event) {
              getScrollPos();
            };
          }, 500);

        }

    clearInterval(sendStartBg);
  }


});


//RUN PUSH DOWN ADS
var counter = 0;
var sendStartMsg = setInterval(startPushDown, 300);
var pushDownId = document.querySelector('.vsPUSHDOWN-iframe iframe');
var pushDownFrame = pushDownId.contentWindow;

function startPushDown() {
  pushDownFrame.postMessage({
    'psMsg':'startPushDown'
  }, '*');

  counter++;

  if (counter === 33) {
    clearInterval(sendStartMsg);
  }
};

window.addEventListener('message', function(pse) {
    if (pse.data.psMsg === "childGotMsg") {

      Object.assign(pushDownId.style, {
       "height" : pse.data.newHeight
     });

     clearInterval(sendStartMsg);

    }
});
};

setTimeout(function(){
    runAds();
},700);

const body = document.querySelector("body");
const openCameraBtn = document.querySelector("#camera-btn");
const video = document.querySelector("#video");
const cameraPreview = document.querySelector(".camera--preview");
const canvas = document.querySelector("#canvas");
console.log('canvas' , canvas)
const canvasContext = canvas.getContext("2d");
const imageRange = document.querySelector("#img-range");
const textRange = document.querySelector("#text-range");
const cameraUi = document.querySelector(".camera-ui");
const overlayImage = document.querySelector("#overlay-img");
let imageOpacity = 0.5; // Initial overlay opacity
var baseHeight = undefined;

// get screen width and height for canvas video and image 

const previewWidth = body.clientWidth;
const previewHeight = body.clientHeight;
const heightCompare = ((previewWidth - 60 ) / 2 ) > previewHeight ?  previewHeight - 20 : ((previewWidth - 80 ) / 2 );
      baseHeight = heightCompare

// set canvas width and height 
canvas.width = baseHeight * 2
canvas.height = baseHeight


function canvasResizer (range) {
  baseHeight = heightCompare - (range / 2)
  canvas.width = baseHeight * 2
  canvas.height = baseHeight
  console.log('base ', baseHeight)
  // canvas.width = baseHeight
  // canvas.height = baseHeight
}

// camera configration
const cameraConfig = {
  video: {
    facingMode: { ideal: "environment" },
  },
  audio: false,
};

// detect if it's a mobile phone
const isMobile = () =>
  /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) &&
  navigator.maxTouchPoints > 1;

if (isMobile) {
  // trigger portrait as default
  body.id = "portrait";
  const screenStatus = window.matchMedia("(orientation: landscape)");

  // check if screen already in landscape
  LandscapeHandler(screenStatus);

  // track portrait and landscape mode on orientation change
  window
    .matchMedia("(orientation: landscape)")
    .addEventListener("change", (e) => {
      console.log("matches ", e.matches);
      // trigger ui if it's in landscape
      LandscapeHandler(e);
    });
}

async function LandscapeHandler(e) {
  if (e.matches) {
    body.id = "camera"; // trigger landscape ui

    // ask for permission and store it into stream
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          aspectRatio: 2,
          width: { ideal: baseHeight * 2  },
          height: { ideal: baseHeight }
        },
        audio: false
      })
      .then((stream) => {
        const track = stream.getTracks()[0]
        console.log(track.getSettings());
        console.log(cameraPreview.clientWidth)
        console.log(cameraPreview.clientHeight)

        video.srcObject = stream;
        video.play();
        drawFrame();

        // enterFullscreen(); // trigger full screen
      })
      .catch((error) => {
        // trigger fail ui
        // CameraAccessDenied();
        console.log(error);
      });
  } else {
    body.id = "portrait";
  }
}

// Draw video + overlay image in canvas
function drawFrame() {
  // Draw video
  canvasContext.globalAlpha = 1;
  canvasContext.drawImage(video, 0, 0, baseHeight * 2, baseHeight);

  // Draw overlay image with dynamic opacity
  canvasContext.globalAlpha = imageOpacity;
  canvasContext.drawImage(overlayImage, 0, 0, canvas.width, canvas.height);

  canvasContext.globalAlpha = 1;
  requestAnimationFrame(drawFrame);
}

// move screen into full screen 
function enterFullscreen() {
  const el = document.documentElement;

  if (el.requestFullscreen) {
    el.requestFullscreen();
  } else if (el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen(); // Safari
  } else if (el.msRequestFullscreen) {
    el.msRequestFullscreen(); // IE11
  }

  // optional: lock to landscape if supported
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock("landscape").catch((err) => {
      console.warn("Orientation lock failed:", err);
    });
  }
}


// Update image opacity from slider
imageRange.addEventListener("input", (e) => {
  const rangeValue = e.target.value;
  imageOpacity = rangeValue <= 0 ? 0 : (rangeValue - 1) / 99; // Range between 0 and 1
});

// update text width
cameraUi.style.gridTemplateColumns = `30px 1fr 30px ${textRange.value}px`; // update the text position on load

textRange.addEventListener("input", (e) => {
  const rangeValue = e.target.value;
  cameraUi.style.gridTemplateColumns = `30px 1fr 30px ${rangeValue}px`;
  canvasResizer(rangeValue);
});



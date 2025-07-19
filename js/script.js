const body = document.querySelector("body");
const openCameraBtn = document.querySelector("#camera-btn");
const video = document.querySelector("#video");
const cameraPreview = document.querySelector(".camera--preview");
const canvas = document.querySelector("#canvas");
// const output = document.querySelector("#output");
const canvasContext = canvas.getContext("2d");
const imageRange = document.querySelector("#img-range");
const textRange = document.querySelector("#text-range");
const cameraUi = document.querySelector(".camera-ui");
const overlayImage = document.querySelector("#overlay-img");
const backButton = document.querySelector(".btn--back");
const fullScreenButton = document.querySelector("#screen-btn");
let imageOpacity = 0.5; // Initial overlay opacity

// get screen width and height for canvas video and image

const previewWidth = body.clientWidth;
const previewHeight = body.clientHeight;
// set canvas width and height
canvas.width = getHeight() * 2;
canvas.height = getHeight();

function getHeight() {

  const bodyTag = document.querySelector('body');

  return (bodyTag.clientWidth - 60) / 2 > bodyTag.clientHeight
    ? bodyTag.clientHeight - 20
    : (bodyTag.clientWidth - 80) / 2;
}

function canvasResizer() {
  // output.innerHTML = `resize canvas ${getHeight()} `
  // baseHeight = getHeight() - range / 2;
  canvas.width = getHeight() * 2;
  canvas.height = getHeight();
}

// camera configration
const cameraConfig = {
  video: {
    facingMode: { ideal: "environment" },
    aspectRatio: 2,
    width: { ideal: getHeight() * 2 },
    height: { ideal: getHeight() },
  },
  audio: false,
};

// detect if it's a mobile phone
const isMobile = () =>
  /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) &&
  navigator.maxTouchPoints > 1;

if (isMobile()) {
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

    canvasResizer(); // update canvas width and height before start 

    // ask for permission and store it into stream
    navigator.mediaDevices
      .getUserMedia(cameraConfig)
      .then((stream) => {
        video.srcObject = stream;
        video.play();
        drawFrame();
      })
      .catch((error) => {
        body.id = "fail";
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
  canvasContext.drawImage(video, 0, 0, getHeight() * 2, getHeight());

  // Draw overlay image with dynamic opacity
  canvasContext.globalAlpha = imageOpacity;
  canvasContext.drawImage(overlayImage, 0, 0, canvas.width, canvas.height);

  canvasContext.globalAlpha = 1;
  requestAnimationFrame(drawFrame);
}

// move screen into full screen
function FullscreenHandler() {
  const el = document.documentElement;

  // if full screen already
  if (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement
  ) {
    fullScreenButton.classList.remove("btn--mini");

    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen(); // Safari
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen(); // IE11
    }
  } else if (el.requestFullscreen) {
    fullScreenButton.classList.add("btn--mini");
    el.requestFullscreen();
  } else if (el.webkitRequestFullscreen) {
    fullScreenButton.classList.add("btn--mini");
    el.webkitRequestFullscreen(); // Safari
  } else if (el.msRequestFullscreen) {
    fullScreenButton.classList.add("btn--mini");
    el.msRequestFullscreen(); // IE11
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
  // canvasResizer(rangeValue);
  // canvasResizer(rangeValue);
});

backButton.addEventListener("click", () => {
  console.log("close window ");
});

fullScreenButton.addEventListener("click", (e) => {
  FullscreenHandler();
  // resize canvas after doing full screen or minimize 
  // canvasResizer();
});

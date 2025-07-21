const body = document.querySelector("body");
const openCameraBtn = document.querySelector("#camera-btn");
const video = document.querySelector("#video");
const cameraPreview = document.querySelector(".camera--preview");
const canvas = document.querySelector("#canvas");
const canvasContext = canvas.getContext("2d");
const imageRange = document.querySelector("#img-range");
const textRange = document.querySelector("#text-range");
const cameraUi = document.querySelector(".camera-ui");
const overlayImage = document.querySelector("#overlay-img");
const backButton = document.querySelector(".btn--back");
const fullScreenButton = document.querySelector("#screen-btn");
const output = document.querySelector("#output");

// storage
let imageOpacity = 0.5; // Initial overlay opacity
var canvasSizeMemory = { width: undefined, height: undefined };

function getHeight() {
  return (cameraPreview.clientWidth - 60) / 2 > cameraPreview.clientHeight
    ? cameraPreview.clientHeight - 20
    : (cameraPreview.clientWidth - 80) / 2;
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

    // ask for permission and store it into stream
    navigator.mediaDevices
      .getUserMedia(cameraConfig)
      .then((stream) => {
        videoStreamStorage = stream; // store stream to use it later
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
    stopVideo();
  }
}

// stop current video
function stopVideo() {
  let stream = video.srcObject;

  if (stream && stream.getTracks) {
    stream.getTracks().forEach((track) => track.stop());
  }
  video.srcObject = null;
}

// Draw video + overlay image in canvas
function drawFrame() {
  // Draw video
  canvasContext.globalAlpha = 1;
  canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);

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
cameraUi.style.gridTemplateColumns = `35px 1fr 35px ${textRange.value}px`; // update the text position on load

textRange.addEventListener("input", (e) => {
  const rangeValue = e.target.value;
  cameraUi.style.gridTemplateColumns = `35px 1fr 35px ${rangeValue}px`;
  // canvas.width = canvasSizeMemory.width - rangeValue;
});

backButton.addEventListener("click", () => {
  console.log("close window ");
});

fullScreenButton.addEventListener("click", (e) => {
  FullscreenHandler();
});

// resize observer to observe full screen / mini screen
const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const { width, height } = entry.contentRect;

    let videoSize = getMax2to1Size(width, height - 20);
    canvas.width = videoSize.width;
    canvas.height = videoSize.height;
  }
});

function getMax2to1Size(containerWidth, containerHeight) {
  // Try using full container width first
  const expectedHeight = containerWidth / 2;

  if (expectedHeight <= containerHeight) {
    // Fits: full width, scaled height
    return {
      width: containerWidth,
      height: expectedHeight,
    };
  } else {
    // Use full height, scale width to maintain 2:1 ratio
    const adjustedWidth = containerHeight * 2;
    return {
      width: adjustedWidth,
      height: containerHeight,
    };
  }
}

resizeObserver.observe(cameraPreview);

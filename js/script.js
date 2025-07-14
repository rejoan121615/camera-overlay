const body = document.querySelector("body");
// const openCameraBtn = document.querySelector("#camera-btn");
const cameraAccessStatus = document.querySelector(
  "#camera .camera-access span"
);
var camera = undefined;
var cameraStream = undefined;

// openCameraBtn.addEventListener("click", () => {});

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

// detect if it's a mobile phone
const isMobile = () =>
  /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) &&
  navigator.maxTouchPoints > 1;

if (true) {
  // trigger portrait as default
  body.id = "portrait";
  const screenStatus = window.matchMedia("(orientation: landscape)");

  // check if screen already in landscape
  CamTriggerHandler(screenStatus);

  // track portrait and landscape mode on orientation change
  window
    .matchMedia("(orientation: landscape)")
    .addEventListener("change", (e) => {
      console.log("matches ", e.matches);
      // trigger ui if it's in landscape
      CamTriggerHandler(e);
    });
}

async function CamTriggerHandler(e) {
  if (e.matches) {
    body.id = "landscape"; // trigger landscape ui

    // create camera and store

    camera = {
      video: {
        facingMode: { ideal: "environment" },
      },
      audio: false,
    };

    // ask for permission and store it into stream
    navigator.mediaDevices
      .getUserMedia(camera)
      .then((stream) => {
        cameraAccessStatus.innerHTML = `: Granted`;
      })
      .catch((error) => {
        cameraAccessStatus.innerHTML = `: Denied`;
        CameraAccessDenied();
        console.log(error);
      });

    startCamera();
  } else {
    body.id = "portrait";
  }
}

async function startCamera() {
  // try {
  //   const constraints = {
  //     video: {
  //       facingMode: { ideal: "environment" },
  //     },
  //     audio: false,
  //   };
  //   const stream = await navigator.mediaDevices.getUserMedia(constraints);
  //   const video = document.getElementById("stream");
  //   video.srcObject = stream;
  // } catch (err) {
  //   document.getElementById("error").textContent =
  //     "Camera access failed: " + err.message;
  //   document.getElementById("error").style.display = "block";
  // }
}

function CameraAccessDenied() {
  const ua = navigator.userAgent.toLowerCase();

  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isAndroid = /android/.test(ua);

  const allInstructionUi = document.querySelectorAll('.instruction');

  allInstructionUi.forEach((item) => {
    item.style.display = 'none';
  })

  if (isIOS) {
    document.querySelector(".ios-instruction").style.display = "block";
  } else if (isAndroid) {
    document.querySelector(".android-instruction").style.display = "block";
  } else {
    document.querySelector(".other-instruction").style.display = "block";
  }
}

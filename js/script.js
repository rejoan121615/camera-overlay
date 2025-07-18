// const body = document.querySelector("body");
// const openCameraBtn = document.querySelector("#camera-btn");
// const cameraAccessStatus = document.querySelector(
//   "#camera-prepration .camera-access span"
// );

// // camera configration 
// const cameraConfig = (camera = {
//   video: {
//     facingMode: { ideal: "environment" },
//   },
//   audio: false,
// });


// // // detect if it's a mobile phone
// const isMobile = () =>
//   /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) &&
//   navigator.maxTouchPoints > 1;

// if (true) {
//   // trigger portrait as default
//   body.id = "portrait";
//   const screenStatus = window.matchMedia("(orientation: landscape)");

//   // check if screen already in landscape
//   CamTriggerHandler(screenStatus);

//   // track portrait and landscape mode on orientation change
//   window
//     .matchMedia("(orientation: landscape)")
//     .addEventListener("change", (e) => {
//       console.log("matches ", e.matches);
//       // trigger ui if it's in landscape
//       CamTriggerHandler(e);
//     });
// }

// openCameraBtn.addEventListener("click", (e) => {
//   navigator.mediaDevices
//     .getUserMedia(camera)
//     .then((stream) => {
//       console.log(stream);
//       cameraAccessStatus.innerHTML = `: Granted`;
//     })
//     .catch((error) => {
//       cameraAccessStatus.innerHTML = `: Denied`;
//       console.log(error);
//     });

  // e.target.style.display = 'none'
  // enterFullscreen();
  // startCamera();
// });


// async function CamTriggerHandler(e) {
//   if (e.matches) {
//     body.id = "landscape"; // trigger landscape ui

//     // ask for permission and store it into stream
//     navigator.mediaDevices
//       .getUserMedia(camera)
//       .then((stream) => {
//         console.log(stream);
        
//       })
//       .catch((error) => {
//         // trigger fail ui 
//         // CameraAccessDenied();
//         console.log(error);
//       });
//   } else {
//     body.id = "portrait";
//   }
// }

// function enterFullscreen() {
//   const el = document.documentElement;

//   console.log('your el ', el)

//   if (el.requestFullscreen) {
//     el.requestFullscreen();
//   } else if (el.webkitRequestFullscreen) {
//     el.webkitRequestFullscreen(); // Safari
//   } else if (el.msRequestFullscreen) {
//     el.msRequestFullscreen(); // IE11
//   }

//   // optional: lock to landscape if supported
//   if (screen.orientation && screen.orientation.lock) {
//     screen.orientation.lock("landscape").catch((err) => {
//       console.warn("Orientation lock failed:", err);
//     });
//   }
// }



// async function startCamera() {
//   try {
//     const constraints = {
//       video: {
//         facingMode: { ideal: "environment" },
//       },
//       audio: false,
//     };
//     const stream = await navigator.mediaDevices.getUserMedia(constraints);
//     const video = document.getElementById("stream");
//     video.srcObject = stream;
//   } catch (err) {
//     document.getElementById("error").textContent =
//       "Camera access failed: " + err.message;
//     document.getElementById("error").style.display = "block";
//   }
// }

// function CameraAccessDenied() {
//   const ua = navigator.userAgent.toLowerCase();

//   const isIOS = /iphone|ipad|ipod/.test(ua);
//   const isAndroid = /android/.test(ua);

//   const allInstructionUi = document.querySelectorAll('.instruction');

//   allInstructionUi.forEach((item) => {
//     item.style.display = 'none';
//   })

//   if (isIOS) {
//     document.querySelector(".ios-instruction").style.display = "block";
//   } else if (isAndroid) {
//     document.querySelector(".android-instruction").style.display = "block";
//   } else {
//     document.querySelector(".other-instruction").style.display = "block";
//   }
// }

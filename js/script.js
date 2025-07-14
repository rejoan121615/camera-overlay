const touchPoint = navigator.maxTouchPoints;
const output = document.querySelector('#output');

output.innerHTML = touchPoint;



console.log(navigator);



// window.matchMedia("(orientation: landscape)").addEventListener('change', (e) => {
//     console.log(e);
//     console.log('matches ', e.matches);
// })



// async function startCamera() {
//   try {
//     const constraints = {
//       video: {
//         facingMode: { ideal: "environment" }, // Tries to use back camera
//       },
//       audio: false,
//     };

//     const stream = await navigator.mediaDevices.getUserMedia(constraints);
//     const video = document.getElementById("camera");
//     video.srcObject = stream;
//   } catch (err) {
//     document.getElementById("error").textContent =
//       "Camera access failed: " + err.message;
//     document.getElementById("error").style.display = "block";
//   }
// }

// startCamera();

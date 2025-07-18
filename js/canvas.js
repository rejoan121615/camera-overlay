const video = document.querySelector("#video");
const canvas = document.querySelector("#canvas");
const canvasContext = canvas.getContext("2d");
// const switchBtn = document.querySelector("#switch");
const overlayImage = document.querySelector("#overlay-img");
const imageRange = document.querySelector("#img-range");
const textRange = document.querySelector("#text-range");
const cameraUi = document.querySelector('#camera-ui')
const cameraPreview = document.querySelector('.camera--preview')

let imageOpacity = 0.5; // Initial overlay opacity

// Request fullscreen on button click
// switchBtn.addEventListener("click", () => {
//   const elTag = document.documentElement;
//   if (elTag.requestFullscreen) {
//     elTag.requestFullscreen();
//   }
// });


const { naturalWidth, naturalHeight } = overlayImage;
const imgAspectRatio = naturalWidth / naturalHeight;

// console.log(naturalWidth)
// console.log(naturalHeight)
// console.log(imgAspectRatio)

// video.addEventListener("loadedmetadata", () => {
//   canvas.width = video.videoWidth;
//   canvas.height = video.videoHeight;
// });

// Access camera
navigator.mediaDevices
  .getUserMedia({ video: { facingMode: "environment"  }, audio: false })
  .then((stream) => {
    const videoTrack = stream.getVideoTracks()[0];
    const videoTrackSetting = videoTrack.getSettings();
    console.log(videoTrackSetting)

    video.srcObject = stream;
    video.play();

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

    drawFrame();
  })
  .catch((err) => {
    console.log("Camera access error:", err);
  });

// Update image opacity from slider
imageRange.addEventListener("input", (e) => {
  const rangeValue = e.target.value;
  imageOpacity = rangeValue <= 0 ? 0 :  (rangeValue - 1) / 99 ; // Range between 0 and 1
});


// update text width 
cameraUi.style.gridTemplateColumns = `30px 1fr 30px ${textRange.value}px`; // update the text position on load 

textRange.addEventListener('input', (e) => {
  const rangeValue = e.target.value;
  cameraUi.style.gridTemplateColumns = `30px 1fr 30px ${rangeValue}px`; 
  
})

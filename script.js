
const video = document.getElementById('video');

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
  faceapi.nets.faceExpressionNet.loadFromUri('./models')
]).then(startVideo);

function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: {} })
    .then(stream => {
      video.srcObject = stream;
      video.play();
      video.addEventListener('loadeddata', () => {
        createCanvasAndStartDetection();
      });
    })
    .catch(error => {
      console.error('Error accessing the camera:', error);
    });
}

function createCanvasAndStartDetection() {
  const container = document.createElement('div');
  container.style.display = 'flex';

  const canvas = faceapi.createCanvasFromMedia(video);
  container.appendChild(canvas);

  container.appendChild(video);

  document.body.append(container);

  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(detectFacialExpressions, 100);
}

async function detectFacialExpressions() {
  const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
  const canvas = document.querySelector('canvas');

  if (canvas) {
    const resizedDetections = faceapi.resizeResults(detections, { width: video.width, height: video.height });
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

    const expressions = resizedDetections[0]?.expressions;
    if (expressions) {
      const { happy, sad, surprised, angry } = expressions;

      // Adjust the conditions based on your preference
      if (happy > 0.7) {
        playYouTubeVideo('mnBUaFo9VQA&pp=ygUZaGFwcHkgaGFwcHkgbmV3IHllYXIgc29uZw%3D%3D'); // Replace with a happy music video ID
      } else if (sad > 0.7) {
        playYouTubeVideo('t9r4cHJF9ho&pp=ygUUcG9yYWRhbGFtIGRob25pIHNvbmc%3D'); // Replace with a sad music video ID
      } else if (surprised > 0.7) {
        playYouTubeVideo('nfH0pa0VSBI&pp=ygUMeWVsbyBwdWxsZWxv'); // Replace with a surprised music video ID
      } else if (angry > 0.7) {
        playYouTubeVideo('XrcAk6mXX44&pp=ygUlbmFsbGF2YSB5YXJ1IGtldHRhdmFuIHlhcnUgeXV2YW4gc29uZw%3D%3D'); // Replace with an angry music video ID
      }
    }
  }
}

function playYouTubeVideo(videoId) {
  // Construct the YouTube video URL
  const videoURL = `https://www.youtube.com/watch?v=${videoId}`;

  // Open the video in a new tab
  window.open(videoURL, '_blank');
}






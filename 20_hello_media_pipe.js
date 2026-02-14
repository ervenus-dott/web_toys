// Copyright 2023 The MediaPipe Authors.

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//      http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
settings.showOutlines = true;
gui.add(settings, 'showOutlines');
settings.debugCircle = true;
gui.add(settings, 'debugCircle');
settings.sizeThreshold = 0.5;
gui.add(settings, 'sizeThreshold', 0, 1, 0.01);

import {
  HandLandmarker,
  FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";

const demosSection = document.getElementById("demos");

let handLandmarker = undefined;
let runningMode = "IMAGE";
let enableWebcamButton = document.getElementById("webcamButton");
let webcamRunning = false;

// Before we can use HandLandmarker class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
const createHandLandmarker = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
  );
  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
      delegate: "GPU"
    },
    runningMode: runningMode,
    numHands: 2,
  });
};
createHandLandmarker();

/********************************************************************
// Demo 2: Continuously grab image from webcam stream and detect it.
********************************************************************/

const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");

// Check if webcam access is supported.
const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;

// If webcam supported, add event listener to button for when user
// wants to activate it.
if (hasGetUserMedia()) {
  enableWebcamButton.addEventListener("click", enableCam);
} else {
  console.warn("getUserMedia() is not supported by your browser");
}

// Enable the live webcam view and start detection.
function enableCam(event) {
  if (!handLandmarker) {
    // console.log("Wait! objectDetector not loaded yet.");
    return;
  }

  if (webcamRunning === true) {
    webcamRunning = false;
    enableWebcamButton.innerText = "ENABLE PREDICTIONS";
  } else {
    webcamRunning = true;
    enableWebcamButton.innerText = "DISABLE PREDICTIONS";
  }

  // getUsermedia parameters.
  const constraints = {
    video: true
  };

  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    video.srcObject = stream;
    video.addEventListener("loadeddata", predictWebcam);
  });
}
const landmarkToVec3 = (landmark) => [
  landmark.x * canvas.width,
  landmark.y * canvas.height,
  landmark.z * canvas.width,
];
// docs that has the diagram for the hand ideces
// https://chuoling.github.io/mediapipe/solutions/hands#javascript-solution-api
const getCenterBetweenIndexAndThumb = (landmarks, canvas) => {
    const thumbVec = landmarkToVec3(landmarks[4]);
    const indexVec = landmarkToVec3(landmarks[8]);
    const diff = glMatrix.vec3.sub([], thumbVec, indexVec);
    return {
      center: glMatrix.vec3.scaleAndAdd([], indexVec, diff, 0.5),
      diff,
    }
};
const getScaleAverage = (landmarks) => {
    const wristVec = landmarkToVec3(landmarks[0]);
    const indexKnuckleVec = landmarkToVec3(landmarks[5]);
    const pinkieKnuckleVec = landmarkToVec3(landmarks[17]);
    const diff1 = glMatrix.vec3.dist(wristVec, indexKnuckleVec);
    const diff2 = glMatrix.vec3.dist(indexKnuckleVec, pinkieKnuckleVec);
    const diff3 = glMatrix.vec3.dist(pinkieKnuckleVec, wristVec);
    const diffAverage = (diff1 + diff2 + diff3)/3;
    return diffAverage;
};

let lastVideoTime = -1;
let results = undefined;
let lastTime = 0;
const handSpamPreventionFlags = [];
async function predictWebcam(time) {
  canvasElement.style.width = video.videoWidth;;
  canvasElement.style.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvasElement.height = video.videoHeight;
  
  // Now let's start detecting the stream.
  if (runningMode === "IMAGE") {
    runningMode = "VIDEO";
    await handLandmarker.setOptions({ runningMode: "VIDEO" });
  }
  let startTimeMs = performance.now();
  if (lastVideoTime !== video.currentTime) {
    lastVideoTime = video.currentTime;
    results = handLandmarker.detectForVideo(video, startTimeMs);
  }
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  if (results.landmarks?.length) {
    // console.log('what is results.landmarks', results.landmarks);
    for (const [index, landmarks] of results.landmarks.entries()) {
      const landmarkAverages = getScaleAverage(landmarks)
      if (settings.showOutlines){
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
        color: "#00FF00",
        lineWidth: 5
      });
      drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 2 });
      const {center, diff} = getCenterBetweenIndexAndThumb(landmarks, canvas);
      const radius = (glMatrix.vec3.length(diff))/2;
      const normalizedRadius = radius / landmarkAverages;
      const bigEnough = normalizedRadius > settings.sizeThreshold;
      console.log('what are sizes', {bigEnough, radius, landmarkAverages, normalizedRadius});
      if (bigEnough && !handSpamPreventionFlags[index]) {
        window.spawnParticlesAtPosition(center);
        handSpamPreventionFlags[index] = true;
      } else if (!bigEnough) {
        handSpamPreventionFlags[index] = false;
      }
      // console.log('what is handParticleFlags', handSpamPreventionFlags);
      // console.log('what is radius, diff, center, landmarks[4], landmarks[8]', radius, diff, center, landmarks[4], landmarks[8]);
      if (settings.debugCircle) {
        canvasCtx.beginPath();
        canvasCtx.arc(center[0], center[1], radius, 0, 2 * Math.PI);
        canvasCtx.fillStyle = '#ffffff76';
        canvasCtx.fill();
        canvasCtx.beginPath();
        canvasCtx.fillStyle = '#07043a';
        canvasCtx.fillRect(center[0] - 5, center[1] - 5, 10, 10);
        canvasCtx.fill();
      }
    }
  }
}
  canvasCtx.restore();

  // Call this function again to keep predicting when the browser is ready.
  if (webcamRunning === true) {
    window.requestAnimationFrame(predictWebcam);
  }
  const delta = (time - lastTime) / 1000;
  // context.globalCompositeOperation = 'lighter';
  tickParticles(delta);
  lastTime = time;
}

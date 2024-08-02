var canvas = document.getElementById("toy-canvas");
var video = document.getElementById("stream-video");
var startWebcamButton = document.getElementById("start-webcam-button");
var inputWidthNumber = document.getElementById("input-width-number");
var inputWidth = document.getElementById("input-width");
var inputGapNumber = document.getElementById("input-gap-number");
var inputGap = document.getElementById("input-gap");
var inputThresholdNumber = document.getElementById("input-threshold-number");
var inputThreshold = document.getElementById("input-threshold");
var inputSizeNumber = document.getElementById("input-size-number");
var inputSize = document.getElementById("input-size");
var inputInvert = document.getElementById("input-invert");
var inputTime = document.getElementById("input-time");
var context = canvas.getContext("2d", { willReadFrequently: true });
var {width, height} = canvas;

const handleWidthInput = (event) => {
    //console.log('what is event?', event);
	var value = event.target.value * 1 || 64;
	width = value;
    height = Math.floor((width / 16) * 9);
	canvas.width = width;
    canvas.height = height;
	inputWidth.value = value;
	inputWidthNumber.value = value;
	// handleResize();
};
inputWidthNumber.addEventListener("input", handleWidthInput);
inputWidth.addEventListener("input", handleWidthInput);

var maxPixelGap = 3;
var handleGapInput = (event) => {
	var value = event.target.value * 1 || 0;
	maxPixelGap = value;
	inputGap.value = value;
	inputGapNumber.value = value;
};
inputGapNumber.addEventListener("input", handleGapInput);
inputGap.addEventListener("input", handleGapInput);

var threshold = 520;
var handleThreshholdInput = (event) => {
	var value = event.target.value * 1 || 0;
	threshold = value;
	inputThreshold.value = value;
	inputThresholdNumber.value = value;
};
inputThresholdNumber.addEventListener("input", handleThreshholdInput);
inputThreshold.addEventListener("input", handleThreshholdInput);

var minBlobSize = 100;
var handleSizeInput = (event) => {
	var value = event.target.value * 1 || 0;
	minBlobSize = value;
	inputSize.value = value;
	inputSizeNumber.value = value;
};
inputSizeNumber.addEventListener("input", handleSizeInput);
inputSize.addEventListener("input", handleSizeInput);

var invertVideoFeed = true;
var handleInvertInput = (event) => {
    //console.log('what is checked event', event);
	var value = event.target.checked;
	invertVideoFeed = value;
};
inputInvert.addEventListener("input", handleInvertInput);

// This is what gets our webcam input feed.

if (
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia
) {
    var constraints = {
        video: {
            width: 1280,
            height: 720,
            facingMode: 'user'
        }
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
            // apply the stream to the video element used in the texture
            video.srcObject = stream;
            video.play();
        })
        .catch(function (error) {
            console.error(
                'Unable to access the camera/webcam.',
                error
            );
        });

} else {

    console.error('MediaDevices interface not available.');

}

const uniqueColors = [
	[255, 0, 0],
	[0, 255, 0],
	[255, 255, 0],
	[0, 0, 255],
	[255, 0, 255],
	[0, 255, 255],
];

const contrast = (r, g, b) => {
	const total = r + g + b;
	return total > threshold;
};

const getPixelOffset = (x, y) => x + y * width;
const isAboveThreshold = (imageData, x, y) => {
	const i = getPixelOffset(x, y) * 4;
	const data = imageData.data;
	return contrast(data[i], data[i + 1], data[i + 2]);
};
const neighborOffsets = [
	[-1, -1],
	[0, -1],
	[1, -1],
	[-1, 0],
	[1, 0],
	[-1, 1],
	[0, 1],
	[1, 1],
];
const createBlob = (imageData, membership, blobs, startX, startY) => {
	// TODO: reuse the same array
	const bestDistances = new Uint16Array(width, height);
	const coordsToProcess = [
		// X coordinate, Y coordinate, distance from blob
		[startX, startY, 1],
	];
	const blobId = blobs.length + 1;
	const blob = {
		blobId,
		uniqueColor: uniqueColors[(blobId - 1) % uniqueColors.length],
		totalPixelCount: 0,
		centroid: null,
		xMin: startX,
		yMin: startY,
		xMax: startX,
		yMax: startY,
	};
	blobs.push(blob);
	let sumOfX = 0;
	let sumOfY = 0;
	while (coordsToProcess.length > 0) {
		const coords = coordsToProcess.pop();
		const offset = getPixelOffset(coords[0], coords[1]);
		if (membership[offset] !== 0) {
			// the pixel in question was already handled, move on to another
			continue;
		}
		let neighborDistance = 1;
		let isInBlob = true;
		if (!isAboveThreshold(imageData, coords[0], coords[1])) {
			// the pixel is not part of a blob, but it may connect us to a
			// nearby not-quite-contiguous blob
			isInBlob = false;
			neighborDistance = coords[2] + 1;
			if (bestDistances[offset] != 0 && bestDistances[offset] <= coords[2]) {
				continue;
			}
		}
		// if the pixel is part of this blob, handle it
		if (isInBlob) {
			blob.totalPixelCount += 1;
			sumOfX += coords[0];
			sumOfY += coords[1];
			membership[offset] = blob.blobId;
			const data = imageData.data;
			const i = offset * 4;
			data[i] = blob.uniqueColor[0];
			data[i + 1] = blob.uniqueColor[1];
			data[i + 2] = blob.uniqueColor[2];
			blob.xMin = Math.min(blob.xMin, coords[0]);
			blob.yMin = Math.min(blob.yMin, coords[1]);
			blob.xMax = Math.max(blob.xMax, coords[0]);
			blob.yMax = Math.max(blob.yMax, coords[1]);
		}
		// if the distance isn't too great, handle neighbors;
		if (neighborDistance >= maxPixelGap) continue;
		for (let n = 0; n < neighborOffsets.length; ++n) {
			let neighbor = neighborOffsets[n];
			let x = coords[0] + neighbor[0];
			let y = coords[1] + neighbor[1];
			if (x < 0 || x >= width || y < 0 || y >= height) {
				// the pixel would be outside the image, skip it
				continue;
			}
			let offset = getPixelOffset(x, y);
			if (membership[offset] !== 0) {
				// it's already been processed, don't process it again
				continue;
			}
			if (bestDistances[offset] > 0 && bestDistances <= neighborDistance) {
				// we've already evaluated it from the same or better distance,
				// don't process it again
				continue;
			}
			bestDistances[offset] = neighborDistance;
			coordsToProcess.push([x, y, neighborDistance]);
		}
	}
	blob.centroid = [
		sumOfX / blob.totalPixelCount,
		sumOfY / blob.totalPixelCount,
	];
};
const getBlobForPixel = (membership, blobs, x, y) => {
	const i = membership[getPixelOffset(x, y)];
	if (i === 0) {
		return null; // not part of a blob
	} else {
		return blobs[i - 1]; // part of an existing blob
	}
};

var detectBlobs = function(){
    var imageData = context.getImageData(0, 0, width, height);
	var data = imageData.data;
	var membership = new Uint32Array(width * height);
	var blobs = [];
	for (var y = 0; y < height; ++y) {
		for (var x = 0; x < width; ++x) {
			if (
				getBlobForPixel(membership, blobs, x, y) === null &&
				isAboveThreshold(imageData, x, y)
			) {
				// This is a pixel that's part of a blob, but not a blob we've
				// already seen.
				createBlob(imageData, membership, blobs, x, y);
			}
		}
	}
	context.putImageData(imageData, 0, 0);
    return blobs;
};

var renderBlobsBounds = function(blobs){
    // console.log("blobs", blobs);
	context.globalCompositeOperation = "difference";
	context.strokeStyle = "#fff";
	context.lineWidth = 2;
	const centroidSize = 4;
	for (let i = 0; i < blobs.length; i++) {
		const blob = blobs[i];
		if (blob.totalPixelCount < minBlobSize) {
			continue;
		}
		context.beginPath();
		context.moveTo(
			blob.centroid[0] - centroidSize,
			blob.centroid[1] - centroidSize,
		);
		context.lineTo(
			blob.centroid[0] + centroidSize,
			blob.centroid[1] + centroidSize,
		);
		context.stroke();
		context.beginPath();
		context.moveTo(
			blob.centroid[0] + centroidSize,
			blob.centroid[1] - centroidSize,
		);
		context.lineTo(
			blob.centroid[0] - centroidSize,
			blob.centroid[1] + centroidSize,
		);
		context.stroke();
		context.beginPath();
		context.rect(
			blob.xMin,
			blob.yMin,
			blob.xMax - blob.xMin,
			blob.yMax - blob.yMin,
		);
		context.stroke();
	}
};

var circleRadius = 1/9;
var circleSpacing = 1/3;
var tau = Math.PI * 2;
var circleStrokeWidth = 1/32;
var renderInteractionCircles = function(count, blobs){
    var smallerAxis = Math.min(width, height);
    //console.log('what is smallerAxis', smallerAxis);
    var centerX = width/2;
    var centerY = height/2;
    context.save();
    context.translate(centerX, centerY);
    context.globalCompositeOperation = 'source-over';

    var radialFraction = tau / count;
    var circleDistance = smallerAxis * circleSpacing;
    var circlePixelRadius = smallerAxis * circleRadius;
    for (let index = 0; index < count; index++) {
        var angle = index * radialFraction;
        var x = Math.cos(angle) * circleDistance;
        var y = Math.sin(angle) * circleDistance;
        var wasHit = false;
        for (let blobIndex = 0; blobIndex < blobs.length; blobIndex++) {
            var blob = blobs[blobIndex];
            var diffX = blob.centroid[0] - (x + centerX);
            var diffY = blob.centroid[1] - (y + centerY);
            var distance = Math.sqrt((diffX ** 2) + (diffY ** 2));
            if (distance < circlePixelRadius) {
                wasHit = true;
            };
        }
        context.beginPath();
        context.arc(x, y, circlePixelRadius, 0, tau);
        context.strokeStyle = wasHit ? '#fff' : '#0008';
        context.lineWidth = smallerAxis * circleStrokeWidth;
        context.stroke();
    }

    context.restore();
};

var vsyncLoop = function(){
    requestAnimationFrame(vsyncLoop);
    const start = Date.now();
    context.globalCompositeOperation = "source-over";
	context.fillStyle = "#fff";
	context.fillRect(0, 0, width, height);
	if (invertVideoFeed) {
		context.globalCompositeOperation = "difference";
	}
    context.drawImage(video, 0, 0, width, height);
    var blobs = detectBlobs();
    renderBlobsBounds(blobs);
    renderInteractionCircles(8, blobs);
    var end = Date.now();
	inputTime.value = end - start;
};

vsyncLoop();
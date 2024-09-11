var soundPaths = [
	'chords/a_major_7th.mp3',
	'chords/b_major_7th.mp3',
	'chords/c_sharp_minor_7th.mp3',
	'chords/e_major_7th.mp3',
    'chords/a_major_short.mp3',
    'chords/b_major_short.mp3',
    'chords/c_sharp_minor_short.mp3',
    'chords/e_major_short.mp3',
];
var soundBlobUrls = [];
var loadAudioDataBuffer = function (path) {
	return fetch(path)
		.then(function (request) {
			console.log('what is request?', request);
			return request.blob();
		})
		.then(function (blob) {
			return URL.createObjectURL(blob);
		});
};
var soundBlobUrlPromises = soundPaths.map(loadAudioDataBuffer);

Promise.all(soundBlobUrlPromises).then(function (allTheLoadedThings) {
	console.log('WHat is allTheLoadedThings', allTheLoadedThings);
	soundBlobUrls = allTheLoadedThings;
});

var playSound = function (soundPath) {
	var audio = new Audio();
	audio.src = soundPath;
	audio.play();
};

var collideWithCircle = function(config) {
	var index = config.index;
	playSound(soundBlobUrls[index % soundBlobUrls.length]);
};

vsyncLoop();

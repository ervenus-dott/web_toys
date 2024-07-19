var canvas = document.getElementById("toy-canvas");
var startAudioContextButton = document.getElementById("start-audio-context-button");
var audioTags = [
    ...document.querySelectorAll('audio')
];
var canvasContext = canvas.getContext("2d");
var audioContext;
try {
    audioContext = new AudioContext();
};
catch(e) {
    alert('Web Audio API is not supported in this browser');
};
var gainNode = new GainNode(audioContext);
gainNode.connect(audioContext.destination);
var audioBuffers = audioTags.map(function(audioTag, index){
    var audioBuffer = audioContext.createMediaElementSource(audioTag);
    var bufferGainNode = new GainNode(audioContext);
    bufferGainNode.connect(gainNode);
    audioBuffer.connect(bufferGainNode);
    return audioBuffer;
});

function init() {
    // check if context is in suspended state (autoplay policy)
	if (audioContext.state === 'suspended') {
		audioContext.resume();
	}
    audioTags.forEach(function(audioTag){
        audioTag.play();
    })
    
}
startAudioContextButton.addEventListener('click', init, false);

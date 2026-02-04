// code from https://dev.to/ndesmic/how-to-record-a-canvas-element-and-make-a-gif-4852
// author ndesmic

const recordBtn = document.getElementById("record-button");

let recording = false;
let mediaRecorder;
let recordedChunks;

recordBtn.addEventListener("click", () => {
  recording = !recording;
    if(recording){
            recordBtn.textContent = "Stop";
            const stream = canvas.captureStream(25);
            mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'video/webm;codecs=vp9',  
                ignoreMutedMedia: true
            });
            recordedChunks = [];
            mediaRecorder.ondataavailable = e => {
                if(e.data.size > 0){
                    recordedChunks.push(e.data);
                }
            };
            mediaRecorder.start();
        } else {
            recordBtn.textContent = "Record"
            mediaRecorder.stop();
            setTimeout(() => {
                const blob = new Blob(recordedChunks, {
                    type: "video/webm"
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "recording.webm";
                a.click();
                URL.revokeObjectURL(url);
            },0);
        }
});

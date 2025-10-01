const canvas = document.getElementById("color-web")
const context = canvas.getContext('2d');
const tau = Math.PI * 2;

let width = 0;
let height = 0;
let cx = 0;
let cy = 0;
let circleVert = [0, 0];
let mouseVert = [0, 0];
let isMouseDown = false;

const resize = function() {
    const rect = canvas.getBoundingClientRect();
    if (width !== rect.width || height !== rect.height) {
        width = rect.width;
        height = rect.height;
        cx = width / 2;
        cy = height / 2;
        circleVert[0] = cx;
        circleVert[1] = cy;
        canvas.width = width;
        canvas.height = height;
    }
}
resize()
// important resize loop making sure that we have up to date height and width info

var drawCircle = (vert, radius, color) => {
context.beginPath();
context.arc(vert[0], vert[1], radius, 0, tau);
context.fillStyle = color;
context.fill();
};

const renderLoop = function(time) {
    requestAnimationFrame(renderLoop);
    resize();
    context.globalCompositeOperation = 'screen';
    if (isMouseDown) {
        drawCircle(mouseVert, 10, '#19F5');
    }
};
requestAnimationFrame(renderLoop);

canvas.addEventListener('mousemove', (mouseEvent) => {
    // console.log('what is mouseEvent', mouseEvent);
    mouseVert[0] = mouseEvent.clientX;
    mouseVert[1] = mouseEvent.clientY;
});
canvas.addEventListener('mousedown', (mouseEvent) => {
    isMouseDown = true;
});
canvas.addEventListener('mouseup', (mouseEvent) => {
    isMouseDown = false;
});
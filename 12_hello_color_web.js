const canvas = document.getElementById("color-web")
const context = canvas.getContext('2d');
const canvasPreVis = document.getElementById("pre-vis")
const contextPreVis = canvasPreVis.getContext('2d');
const tau = Math.PI * 2;

let width = 0;
let height = 0;
let cx = 0;
let cy = 0;
let circleVert = [0, 0];
let mouseVert = [0, 0];
let isMouseDown = false;

const settings = {
    bilateralSymmetry: true,
    glow: true,
    radialSymmetry: 6,
    brushSize: 10,
    currentColor: '#ff9922',
    opacity: 0.3,
};
var gui = new lil.GUI();

gui.add(settings, 'bilateralSymmetry');
gui.add(settings, 'glow');
gui.add(settings, 'radialSymmetry', 1, 10, 1);
gui.add(settings, 'brushSize', 3, 25);
gui.addColor(settings, 'currentColor');
gui.add(settings, 'opacity', 0, 1);


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
        canvasPreVis.width = width;
        canvasPreVis.height = height;
    }
}
resize()
// important resize loop making sure that we have up to date height and width info

var drawCircle = (vert, radius, color, context) => {
context.beginPath();
context.arc(vert[0], vert[1], radius, 0, tau);
context.fillStyle = color;
context.fill();
};
const drawMirrored = function(context, drawCallback) {
    context.save();
    drawCallback();
    if (settings.bilateralSymmetry) {
        context.scale(-1, +1);
        drawCallback();
    }
    context.restore();
};
const drawRadial = function(context, drawCallback) {
    const n = settings.radialSymmetry || 1;
    const radialSegment = tau / n; 
    for (let i = 0; i < n; i += 1) {
        context.save();
        context.rotate(radialSegment * i);
        drawMirrored(context, drawCallback);
        context.restore();
    }
};

const renderLoop = function(time) {
    requestAnimationFrame(renderLoop);
    resize();
    contextPreVis.clearRect(0, 0, width, height);
    context.save();
    contextPreVis.save();
    context.translate(cx, cy);
    contextPreVis.translate(cx, cy);
    if (settings.glow) (
        context.globalCompositeOperation = 'screen'
    )
    const combinedColor = settings.currentColor + Math.round(settings.opacity * 255).toString(16).padStart(2, '0');
    // console.log('what is combined color', combinedColor);
    if (isMouseDown) {
        drawRadial(context, () => {            
            drawCircle(mouseVert, settings.brushSize, combinedColor, context);
        })
    }
    drawRadial(contextPreVis, () => {            
        drawCircle(mouseVert, settings.brushSize, combinedColor, contextPreVis);
    })
    context.restore();
    contextPreVis.restore();
};
requestAnimationFrame(renderLoop);

canvas.addEventListener('mousemove', (mouseEvent) => {
    // console.log('what is mouseEvent', mouseEvent);
    mouseVert[0] = mouseEvent.clientX - cx;
    mouseVert[1] = mouseEvent.clientY - cy;
});
canvas.addEventListener('mousedown', (mouseEvent) => {
    isMouseDown = true;
});
canvas.addEventListener('mouseup', (mouseEvent) => {
    isMouseDown = false;
});
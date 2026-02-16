const canvas = document.getElementById("ellipse-holder");
const context = canvas.getContext("2d");
const tau = Math.PI * 2;
const canvasCenter = [
    canvas.width / 2,
    canvas.height / 2,
];
const mousePos = canvasCenter.slice();
var handleMouseMoveEvent = (mouseEvent) => {
    // compensate for difference between canvas coordinate and event coordinate
    var rect = mouseEvent.target.getBoundingClientRect();
    mousePos[0] = mouseEvent.clientX - rect.x;
    mousePos[1] = mouseEvent.clientY - rect.y;
};
canvas.addEventListener('mousemove', handleMouseMoveEvent);

const drawCircle = (vert, radius, color) => {
    context.beginPath();
    context.arc(vert.x, vert.y, radius, 0, tau);
    context.fillStyle = color;
    context.fill();
};
const drawCross = (vertA, size, thickness, color) => {
    context.beginPath();
    context.moveTo(vertA[0] - size, vertA[1] - size);
    context.lineTo(vertA[0] + size, vertA[1] + size);
    context.moveTo(vertA[0] + size, vertA[1] - size);
    context.lineTo(vertA[0] - size, vertA[1] + size);
    context.strokeStyle = color;
    context.lineWidth = thickness;
    context.stroke();
};
const drawPetal = (vert, color) => {
    context.beginPath();
    context.ellipse(vert[0], vert[1] + 80, 80, 30, tau * 0.75, 0, tau);
    context.fillStyle = color;
    context.fill();
    drawCross(vert, 30, 3, 'rgba(20, 171, 236, 0.53)');
};
let lastTime = 0;

const loop = (now) => {
    let delta = (now - lastTime) / 1000;
    requestAnimationFrame(loop);
    context.save();
    // context.clearRect(0, 0, canvas.width, canvas.height);
    
    context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'rgba(0, 0, 0, 0.2)'
    context.fill();   
    
    context.save();    
    context.translate(...mousePos);
    context.rotate(delta * tau / 3);
    drawPetal([0, 0], 'pink');
    context.rotate(tau / 6);
    drawPetal([0, 0], 'yellow');
    context.rotate(tau / 6);
    drawPetal([0, 0], 'orange');
    context.rotate(tau / 6);
    drawPetal([0, 0], 'violet');
    context.rotate(tau / 6);
    drawPetal([0, 0], 'cyan');
    context.rotate(tau / 6);
    drawPetal([0, 0], 'magenta');
    context.restore();
    drawCross(canvasCenter, 10, 3, 'red');
    // context.stroke();

    context.restore();
};
requestAnimationFrame(loop);



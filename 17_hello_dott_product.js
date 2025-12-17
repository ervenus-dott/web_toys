const canvas = document.getElementById("dot-board");
const context = canvas.getContext("2d");
const tau = Math.PI * 2;

const drawCircle = (vert, radius, color) => {
    context.beginPath();
    context.arc(vert[0], vert[1], radius, 0, tau);
    context.fillStyle = color;
    context.fill();
};
const drawLine = (vertA, vertB, thickness, color) => {
    context.beginPath();
    context.moveTo(vertA[0], vertA[1]);
    context.lineTo(vertB[0], vertB[1]);
    context.strokeStyle = color;
    context.lineWidth = thickness;
    context.stroke();
};
let mouse = [0, 0];
let center = [canvas.width/2, canvas.height/2];

canvas.addEventListener('mousemove', function(mouseEvent){
    var rect = mouseEvent.target.getBoundingClientRect();
    mouse[0] = mouseEvent.clientX - rect.x;
    mouse[1] = mouseEvent.clientY - rect.y;
});


const loop = () => {
    requestAnimationFrame(loop);
    context.save();
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawCircle(center, 5, '#f00');
    drawCircle(mouse, 10, '#fff');
    drawLine(center, mouse, 3, '#960');
    const diff = glMatrix.vec2.sub([], mouse, center);
    const halfDiff = glMatrix.vec2.scale([], diff, 0.5);
    const midPoint = glMatrix.vec2.add([], center, halfDiff);
    drawCircle(halfDiff, 5, '#090');
    drawCircle(midPoint, 5, '#a90');
    const angle = glMatrix.vec2.signedAngle(center, mouse);
    console.log('what is angle', angle);
    drawCircle(diff, 10, '#0f0');
    context.restore();
};
requestAnimationFrame(loop);

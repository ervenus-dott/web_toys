const canvas = document.getElementById("spring-board");
const context = canvas.getContext("2d");
const reset = document.getElementById("reset-button");
const tau = Math.PI * 2;
// Learning from ActionScript 3.0 Animation Making things Move! By Keith Peters
// Chapter 8 springs
const canvasCenter = [canvas.width / 2, canvas.height / 2];
let springedCircle = {
    x: 0,
    y: 0,
    color: 'white',
    size: 10,
};
let spring = 0.1;
let velocityX = 0;
let velocityY = 0;
let velocityLostToFriction = 0.95;
let gravity = 5;
let resetSpringData = false;
let mouseX = 0;
let mouseY = 1;

reset.addEventListener('click', () => {
    resetSpringData = true;
    springedCircle.x = 0;
    springedCircle.y = 0;
    velocityX = 0;
    velocityY = 0;
});
canvas.addEventListener('mousemove', (mouseEvent) => {
    let rect = canvas.getBoundingClientRect();
    // console.log('what is rect', rect);
    mouseX = mouseEvent.clientX - rect.x;
    mouseY = mouseEvent.clientY - rect.y;
    // console.log('what is mouseX, mouseY', mouseX, mouseY);
});

const drawCircle = (x, y, color, size) => {
    context.beginPath();
    context.arc(x, y, size, 0, tau);
    context.strokeStyle = color;
    context.lineWidth = 3;
    context.stroke();
    context.fillStyle = color;
    context.fill();
};
const drawline = (orginX, orginY, endX, endY, color, size) => {
    context.beginPath();
    context.lineWidth = size / 10;
    context.strokeStyle = color;
    context.moveTo(orginX, orginY);
    context.lineTo(endX, endY);
    context.stroke();
};
const springMotionHandler = () => {
    let distanceToTargetX = mouseX - springedCircle.x;
    let distanceToTargetY = mouseY - springedCircle.y;
    let accelerationX = distanceToTargetX * spring;
    let accelerationY = distanceToTargetY * spring;
    if (resetSpringData) {
        resetSpringData = false;
        distanceToTargetX = 0;
        distanceToTargetY = 0;
        accelerationX = 0;
        accelerationY = 0;
    }
    velocityX += accelerationX;
    velocityY += accelerationY;
    velocityY += gravity;
    velocityX *= velocityLostToFriction;
    velocityY *= velocityLostToFriction;
    // console.log('what is velocityX, velocityY', velocityX, velocityY);
    springedCircle.x += velocityX;
    springedCircle.y += velocityY;
    drawline(springedCircle.x, springedCircle.y, mouseX, mouseY, springedCircle.color, springedCircle.size);
};

const loop = () => {
    requestAnimationFrame(loop);
    context.clearRect(0, 0, canvas.width, canvas.height);
    springMotionHandler();
    drawCircle(springedCircle.x, springedCircle.y, springedCircle.color, springedCircle.size);
};
loop();
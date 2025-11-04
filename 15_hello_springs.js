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
let velocityLostToFriction = 0.995;
let resetSpringData = false;

reset.addEventListener('click', () => {
    resetSpringData = true;
    springedCircle.x = 0;
    springedCircle.y = 0;
    velocityX = 0;
    velocityY = 0;
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

const springMotionHandler = () => {
    let distanceToTargetX = canvasCenter[0] - springedCircle.x;
    let distanceToTargetY = canvasCenter[1] - springedCircle.y;
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
    velocityX *= velocityLostToFriction;
    velocityY *= velocityLostToFriction;
    springedCircle.x += velocityX;
    springedCircle.y += velocityX;
};

const loop = () => {
    requestAnimationFrame(loop);
    springMotionHandler();
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawCircle(springedCircle.x, springedCircle.y, springedCircle.color, springedCircle.size);
};
loop();
const canvas = document.getElementById("spring-board");
const context = canvas.getContext("2d");
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
const canvas = document.getElementById("circle-grid-outlines");
const context = canvas.getContext("2d");
const tau = Math.PI * 2;

let columns = 10;
let rows = 20;
let canvasDimensions = canvas.getBoundingClientRect()
let circleArray = [];
const startup = () => {
    //`mousemove`, not `mouseover`
	document.getElementById("circle-grid-outlines").onmousemove = mouseMove;
};
let mouseX = 1;
let mouseY = 1;
let ballCoords = [1, 1];
let ballRadius = 80;

window.onload = startup;

function mouseMove(mouseMoveEvent) {
	// console.log('what is mouse move event?', mouseMoveEvent);
	const canvasRect = mouseMoveEvent.target.getBoundingClientRect();
	// console.log('what is canvasRect?', canvasRect);
	mouseX = mouseMoveEvent.clientX - canvasRect.x;
	mouseY = mouseMoveEvent.clientY - canvasRect.y;
}

const drawCircle = (vert, radius, color, context) => {
    // console.log('what is vert', vert);
    context.beginPath();
    context.arc(vert[0], vert[1], radius, 0, tau);
    context.fillStyle = color;
    context.fill();
};

const clear = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
};

const drawArrayCircles = (array) => {
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        drawCircle(element, 10, 'white', context);
    }
};
const moveBall = () => {
    ballCoords = [mouseX, mouseY];
	context.beginPath();
	context.arc(mouseX, mouseY, ballRadius, 0, 2 * Math.PI);
	context.fillStyle = 'hsla(25, 100%, 60%, 0.5)';
	context.fill();
	context.lineWidth = 5;
	context.strokeStyle = 'hsl(25, 100%, 60%)';
	context.stroke();
}
let spring = 0.1;
let velocityLostToFriction = 0.95;
let loopActive = true;
const springMotionHandler = (circle) => {
    circle.distanceToTargetX = circle.orginX - circle.x;
    circle.distanceToTargetY = circle.orginY - circle.y;
    circle.accelerationX = circle.distanceToTargetX * spring;
    circle.accelerationY = circle.distanceToTargetY * spring;
    circle.velocityX += circle.accelerationX;
    circle.velocityY += circle.accelerationY;
    // velocityY += gravity;
    circle.velocityX *= velocityLostToFriction;
    circle.velocityY *= velocityLostToFriction;
    circle.x += circle.velocityX;
    circle.y += circle.velocityY;
};
const handleCircleUpdate = (circle) => {
    if (
        circle.x + 5 > ballCoords[0] - ballRadius &&
        circle.x - 5 < ballCoords[0] + ballRadius &&
        circle.y + 5 > ballCoords[1] - ballRadius &&
        circle.y - 5 < ballCoords[1] + ballRadius
    ) {
        // console.log('what are circle and ballCoords', circle, ballCoords);
        var diffX = circle.x - ballCoords[0];
        var diffY = circle.y - ballCoords[1];
        const angle = Math.atan2(diffY, diffX);
        const distance = Math.sqrt(diffX * diffX + diffY * diffY);
        circle.x += Math.sin(angle) * (distance - ballRadius);
        circle.y += Math.cos(angle) * (distance - ballRadius);
    }
    // springMotionHandler(circle);
    const circleVerts = [circle.x, circle.y];
    drawCircle(circleVerts, 10, 'white', context);
};

    const loopSwitch = () => {
        if (loopActive) {
            loopActive = false;
        } else {
            loopActive = true;
            loop();
    }
}
const drawAndLogCircles = () => {
    circleArray = [];
    for (let index = 0; index < columns; index++) {
        let xCoordinate = canvasDimensions.width / (columns + 1);
        let currentX = xCoordinate * (index + 1);
        for (let index = 0; index < rows; index++) {
            let yCoordinate = canvasDimensions.height / (rows + 1);
            let currentY = yCoordinate * (index + 1);
            // console.log('what is currentY', currentY);
            let tempObject = {
                x: currentX,
                y: currentY,
                orginX: currentX,
                orginY: currentY,
                velocityX: 0,
                velocityY: 0,
                distanceToTargetX: 0,
                distanceToTargetY: 0,
                accelerationX: 0,
                accelerationY: 0,
            };
            // console.log('what is tempObject', tempObject);
            circleArray.push(tempObject);
            let circleVert = [currentX, currentY];
            drawCircle(circleVert, 10, 'white', context);
        };
    };
};
drawAndLogCircles();
const loop = () => {
    if (loopActive) {
    requestAnimationFrame(loop);
    }
    clear()
    circleArray.forEach(handleCircleUpdate);
    circleArray.forEach(springMotionHandler);
    moveBall();
};
loop();

const handleMouseMoveEvent = (event) => {
    // should prevent touch scrolling on mobile devices so we can read touch position while the user drags
    event.preventDefault();
    // clientX and clientY maybe empty if this is a touch event
    const rect = event.target.getBoundingClientRect();
    let x = event.clientX - rect.x;
    let y = event.clientY - rect.y;
    // search for the touch data and use that if we've got it
    if (event.touches) {
        let touch = event.touches[0];
        if (touch) {
            x = touch.clientX - rect.x;
            y = touch.clientY - rect.y;
        };
    };
    console.log('what is x, y', x, y);
};

canvas.addEventListener('mousedown', handleMouseMoveEvent);
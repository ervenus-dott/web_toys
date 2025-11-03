const canvas = document.getElementById("circle-grid-outlines");
const context = canvas.getContext("2d");
const tau = Math.PI * 2;

let columns = 10;
let rows = 20;
let canvasDimensions = canvas.getBoundingClientRect()
let circleVert = [0, 30];
let circleArray = [];

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
let loopActive = false;
const loop = () => {
    if (loopActive) {
    requestAnimationFrame(loop);
    }
    clear()
    circleArray.forEach(handleCicleUpdate);
};

const handleCicleUpdate = (circle) => {
	circle[0] += (Math.random() - 0.5) * 10;
	circle[1] += (Math.random() - 0.5) * 10;
    drawCircle(circle, 10, 'white', context);
};
const loopSwitch = () => {
    if (loopActive) {
        loopActive = false;
    } else {
        loopActive = true;
        loop();
    }
}
for (let index = 0; index < columns; index++) {
    let xCoordinate = canvasDimensions.width / (columns + 1);
    let currentX = xCoordinate * (index + 1);
    circleVert[0] = currentX;
    for (let index = 0; index < rows; index++) {
    let yCoordinate = canvasDimensions.height / (rows + 1);
    let currentY = yCoordinate * (index + 1);
    circleVert[1] = currentY;
    let tempArray = [circleVert[0], circleVert[1]];
    circleArray.push(tempArray);
    tempArray = [0, 0];
    drawCircle(circleVert, 10, 'white', context);
    };
};
var handleMouseMoveEvent = (event) => {
    // should prevent touch scrolling on mobile devices so we can read touch position while the user drags
    event.preventDefault();
    // clientX and clientY maybe empty if this is a touch event
    var rect = event.target.getBoundingClientRect();
    var x = event.clientX - rect.x;
    var y = event.clientY - rect.y;
    // search for the touch data and use that if we've got it
    if (event.touches) {
        var touch = event.touches[0];
        if (touch) {
            x = touch.clientX - rect.x;
            y = touch.clientY - rect.y;
        };
    };
    console.log('what is x, y', x, y);
};

canvas.addEventListener('mousedown', handleMouseMoveEvent);
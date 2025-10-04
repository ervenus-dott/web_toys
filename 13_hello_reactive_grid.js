const canvas = document.getElementById("circle-grid-outlines");
const context = canvas.getContext("2d");
const tau = Math.PI * 2;

let columns = 10;
let rows = 20;
let canvasDimensions = canvas.getBoundingClientRect()
let circleVert = [0, 30];
let circleArray = [[]];

var drawCircle = (vert, radius, color, context) => {
    let tempArray = [0, 0];
    
    tempArray[0] = vert[0];
    tempArray[1] = vert[1];

    circleArray.push(tempArray);
    // console.log('what is vert', vert);
    context.beginPath();
    context.arc(vert[0], vert[1], radius, 0, tau);
    context.fillStyle = color;
    context.fill();
};

for (let index = 0; index < columns; index++) {
    const xCoordinate = canvasDimensions.width / (columns + 1);
    const currentX = xCoordinate * (index + 1);
    circleVert[0] = currentX;
    for (let index = 0; index < rows; index++) {
    const yCoordinate = canvasDimensions.height / (rows + 1);
    const currentY = yCoordinate * (index + 1);
    circleVert[1] = currentY;
        drawCircle(circleVert, 10, 'white', context);
    };
};
var handleMouseMoveEvent = (event) => {
    // should prevent touch scrolling on mobile devices so we can read touch position while the user drags
    event.preventDefault();
    // clientX and clientY maybe empty if this is a touch event
    var x = event.clientX;
    var y = event.clientY;
    // search for the touch data and use that if we've got it
    if (event.touches) {
        var touch = event.touches[0];
        if (touch) {
            x = touch.clientX;
            y = touch.clientY;
        };
    };
    console.log('what is x, y', x, y);
};

canvas.addEventListener('mousedown', handleMouseMoveEvent);
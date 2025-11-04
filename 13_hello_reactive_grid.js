const canvas = document.getElementById("circle-grid-outlines");
const context = canvas.getContext("2d");
const tau = Math.PI * 2;

let columns = 10;
let rows = 20;
let canvasDimensions = canvas.getBoundingClientRect()
let circleVert = [0, 30];
let circleArray = [];
const startup = () => {
    //`mousemove`, not `mouseover`
	document.getElementById("circle-grid-outlines").onmousemove = mouseMove;
    
	loop();
};
let mouseX = 1;
let mouseY = 1;
let ballX = 1;
let ballY = 1;
let ballRadius = 20;

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
	//get the distance between the mouse and the ball on both axes
	//walk only the an eight of the distance to create a smooth fadeout
	let dx = (mouseX - ballX) * .125;
	let dy = (mouseY - ballY) * .125;
	//calculate the distance this would move ...
	let distance = Math.sqrt(dx * dx + dy * dy);
	//... and cap it at 5px
	if (distance > 5) {
		dx *= 20 / distance;
		dy *= 20 / distance;
	}

	//now move
	ballX += dx;
	ballY += dy;



	context.beginPath();
	context.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
	context.fillStyle = 'hsla(25, 100%, 60%, 0.5)';
	context.fill();
	context.lineWidth = 5;
	context.strokeStyle = 'hsl(25, 100%, 60%)';
	context.stroke();
}


let loopActive = true;
const handleCicleUpdate = (circle) => {
    circle[0] += (Math.random() - 0.5) * 10;
    circle[1] += (Math.random() - 0.5) * 10;
    drawCircle(circle, 10, 'white', context);
};
const loop = () => {
    if (loopActive) {
    requestAnimationFrame(loop);
    }
    clear()
    moveBall()
    circleArray.forEach(handleCicleUpdate);
};
loop();

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
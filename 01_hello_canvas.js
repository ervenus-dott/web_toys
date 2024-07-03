//var toyCanvas = document.getElementById("toy-canvas")

window.onload = startup;
var canvas = document.getElementById("toy-canvas");
var tuningFork = document.getElementById("tuning-fork");
var goatSneeze = document.getElementById("goat-sneeze");
var ctx = canvas.getContext("2d");

var ballX = 400;
var ballY = 400;
var ballRadius = 20;
var mouseX = 0;
var mouseY = 0;
var rectangles = [{
	name: 'A',
	x: 270,
	y: 200,
	width: 100,
	height: 50,
	colorOn: 'hsl(95, 100%, 80%)',
	colorOff: 'hsl(95, 100%, 50%)',
	active: false,
	audio: tuningFork,
}, {
	name: 'B',
	x: 150,
	y: 95,
	width: 50,
	height: 100,
	colorOn: 'hsl(210, 100%, 80%)',
	colorOff: 'hsl(210, 100%, 50%)',
	active: false,
}, {
	name: 'C',
	x: 185,
	y: 25,
	width: 60,
	height: 50,
	colorOn: 'hsl(60, 100%, 80%)',
	colorOff: 'hsl(60, 100%, 50%)',
	active: false,
}, {
	name: 'D',
	x: 120,
	y: 200,
	width: 70,
	height: 60,
	colorOn: 'hsl(30, 100%, 80%)',
	colorOff: 'hsl(30, 100%, 50%)',
	active: false,
}, {
	name: 'E',
	x: 58,
	y: 55,
	width: 50,
	height: 19,
	colorOn: 'hsl(0, 100%, 80%)',
	colorOff: 'hsl(0, 100%, 50%)',
	active: false,
}, {
	name: 'F',
	x: 408,
	y: 105,
	width: 69,
	height: 240,
	colorOn: 'hsl(290, 100%, 80%)',
	colorOff: 'hsl(290, 100%, 50%)',
	active: false,
	audio: goatSneeze,
}];
var isCircleInRect = function (rect) {
	if (
		(ballX + ballRadius) > rect.x &&
		(ballY + ballRadius) > rect.y &&
		(ballX - ballRadius) < rect.x + rect.width &&
		(ballY - ballRadius) < rect.y + rect.height
	) {
		return true;
	}
	return false;
};
function startup() {
	//`mousemove`, not `mouseover`
	document.getElementById("toy-canvas").onmousemove = mouseMove;

	loop();
}

//use `requestAnimationFrame` for the game loop
//so you stay sync with the browsers rendering
//makes it a smoother animation
function loop() {
	moveBall();
	requestAnimationFrame(loop);
}

function mouseMove(mouseMoveEvent) {
	// console.log('what is mouse move event?', mouseMoveEvent);
	const canvasRect = mouseMoveEvent.target.getBoundingClientRect();
	// console.log('what is canvasRect?', canvasRect);
	mouseX = mouseMoveEvent.clientX - canvasRect.x;
	mouseY = mouseMoveEvent.clientY - canvasRect.y;
}
function drawRect(rect, color) {
	ctx.fillStyle = color;
	ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
}

function moveBall() {
	//get the distance between the mouse and the ball on both axes
	//walk only the an eight of the distance to create a smooth fadeout
	var dx = (mouseX - ballX) * .125;
	var dy = (mouseY - ballY) * .125;
	//calculate the distance this would move ...
	var distance = Math.sqrt(dx * dx + dy * dy);
	//... and cap it at 5px
	if (distance > 5) {
		dx *= 5 / distance;
		dy *= 5 / distance;
	}

	//now move
	ballX += dx;
	ballY += dy;

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	rectangles.forEach(handleRectUpdate);

	ctx.beginPath();
	ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
	ctx.fillStyle = 'hsla(25, 100%, 60%, 0.5)';
	ctx.fill();
	ctx.lineWidth = 5;
	ctx.strokeStyle = 'hsl(25, 100%, 60%)';
	ctx.stroke();
}


function handleRectUpdate(rect) {
	rect.x += Math.random() - 0.5;
	rect.y += Math.random() - 0.5;
	const isColliding = isCircleInRect(rect);
	const rectColor = isColliding ? rect.colorOn : rect.colorOff;
	drawRect(rect, rectColor);
	if (rect.active !== isColliding) {
		console.log(`rectangle ${rect.name}'s state has changed!`, isColliding);
		rect.active = isColliding;
		if (rect.audio) {
			//console.log('what is audio?', rect.audio);
			if (rect.active) {
				rect.audio.play();
			} else {
				rect.audio.pause();
			}
		}
	}
}
//I intend to make squares so that when they are hovered over they do something more specifically they play a sound

// function playSoundOnHover() {
// 	var ctx = canvas.getContext("2d");
// 	ctx.fillRect(25, 25, 100, 100);
// 	console.log('what is ctx?', ctx);
// }
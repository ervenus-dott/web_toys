//var toyCanvas = document.getElementById("toy-canvas")

window.onload = startup;
var canvas = document.getElementById("toy-canvas");
var ctx = canvas.getContext("2d");

var ballX = 400;
var ballY = 400;
var ballRadius = 40;
var mouseX = 0;
var mouseY = 0;
var rectA = {
	x: 270,
	y: 200,
	width: 100,
	height: 50,
};
var rectB = {
	x: 150,
	y: 95,
	width: 50,
	height: 100,
};
var rectC = {
	x: 185,
	y: 25,
	width: 60,
	height: 50,
};
var rectD = {
	x: 120,
	y: 200,
	width: 70,
	height: 60,
};
var rectE = {
	x: 58,
	y: 55,
	width: 50,
	height: 19,
};
var isCircleInRect = function(rect){
	if (
		(ballX + ballRadius) > rect.x &&
		(ballY + ballRadius) > rect.y &&
		(ballX - ballRadius) < rect.x + rect.width &&
		(ballY - ballRadius) < rect.y + rect.height
	) {
		console.log('Success');
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
function drawRect(rect, color){
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

	ctx.beginPath();
	ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
	ctx.fillStyle = "green";
	ctx.fill();
	ctx.lineWidth = 5;
	ctx.strokeStyle = "red";
	ctx.stroke();

	const isCircleInRectA = isCircleInRect(rectA);
	const CircleAColor = isCircleInRectA? '#8ddfd8' : 'green';
	drawRect(rectA, CircleAColor);
	const isCircleInRectB = isCircleInRect(rectB);
	const circleBColor = isCircleInRectB ? 'blue' : 'orange';
	drawRect(rectB, circleBColor);
	const isCircleInRectC = isCircleInRect(rectC);
	const circleCColor = isCircleInRectC ? 'yellow' : 'blue';
	drawRect(rectC, circleCColor);
	const isCircleInRectD = isCircleInRect(rectD);
	const circleDColor = isCircleInRectD ? 'orange' : 'yellow';
	drawRect(rectD, circleDColor);
	const isCircleInRectE = isCircleInRect(rectE);
	const circleEColor = isCircleInRectE ? 'red' : 'magenta';
	drawRect(rectE, circleEColor);
}

//I intend to make squares so that when they are hovered over they do something more specifically they play a sound

// function playSoundOnHover() {
// 	var ctx = canvas.getContext("2d");
// 	ctx.fillRect(25, 25, 100, 100);
// 	console.log('what is ctx?', ctx);
// }
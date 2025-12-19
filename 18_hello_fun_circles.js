const canvas = document.getElementById("circle-holder");
const context = canvas.getContext("2d");
const tau = Math.PI * 2;
const canvasDimensions = [canvas.width, canvas.height]

const drawCircle = (vert, radius, color) => {
    context.beginPath();
    context.arc(vert[0], vert[1], radius, 0, tau);
    context.fillStyle = color;
    context.fill();
};
var tickBall = function(velocity, coord) {
    coord[0] = coord[0] + velocity[0];
    coord[1] = coord[1] + velocity[1];
    if (coord[0] > canvasDimensions[0]) {
        // coord[0] -= coord[0] - canvasDimensions[0];
        velocity[0] *= -1;
    }
    if (coord[0] < 0) {
        // coord[0] += coord[0];
        velocity[0] *= -1;
    }
    if (coord[1] > canvasDimensions[1]) {
        // coord[1] -= coord[1] - canvasDimensions[1];
        velocity[1] *= -1;
    }
    if (coord[1] < 0) {
        // coord[1] += coord[1];
        velocity[1] *= -1;
    }

    // console.log('what coord', coord);
    // console.log('what velocity', velocity);
    // getNewCoordFromAngleAndLength(endX, endY, arrowHeadStartPointAngle, distanceFromEndOfLineEnd);
};
const ballRadius = 15;
const balls = [];
for (let index = 0; index < 10; index++) {
    const ball = {
        velocity : [(Math.random()- 0.5) * 5, (Math.random()- 0.5) * 5],
        position : [canvas.width / 2, canvas.height / 2],
    }
    balls.push(ball);    
}
const loop = () => {
    requestAnimationFrame(loop);
    context.save();
    context.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach(({velocity, position}) => {
        tickBall(velocity, position);
        drawCircle(position, ballRadius, '#055');
    });
    context.restore();
};
requestAnimationFrame(loop);
/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('packing-container');
const context = canvas.getContext('2d');
const tau = Math.PI * 2;
let numCircles = 81
let circlePlots = [];

const drawCircle = ({x, y, radius, color}) => {
    context.beginPath();
    context.arc(x, y, radius, 0, tau);
    context.strokeStyle = color;
    context.stroke();
};


for (var i = 0; i < numCircles; i++) {
    const circlePlot = {
        id: i,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 2,
        color: 'white',
        maxSize: Infinity,
        nearestCollision: null,
    };
    circlePlots.push(circlePlot);
};

const checkCollision = (ball0, ball1) => {
    var dx = ball1.x - ball0.x;
    var dy = ball1.y - ball0.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    // console.log(`comparing ${ball0.id} to ${ball1.id}`, ball0.maxSize, ball1.maxSize);
    const halfDistance = dist / 2;
    if (ball0.maxSize === Infinity) {
        ball0.maxSize = halfDistance;
    }
    if (ball1.maxSize === Infinity) {
        ball1.maxSize = halfDistance;
    }
    if (dist <= (ball0.maxSize + ball1.maxSize)) {
        // if (ball0.maxSize > ball1.maxSize) {
        //     ball0.maxSize = dist - ball1.maxSize;
        // } else {
        //     ball1.maxSize = dist - ball0.maxSize;
        // }
        ball0.maxSize = Math.min(ball0.maxSize, halfDistance);
        ball1.maxSize = Math.min(ball1.maxSize, halfDistance);
        // ball0.radius = ball0.maxSize;
        // ball1.radius = ball1.maxSize;
        ball0.nearestCollision = ball1.id;
        ball1.nearestCollision = ball0.id;
        // console.log('intersection', dist, ball0, ball1);
    }
};

// useful reusable function to compare items in an array
const compareArrayItems = (array, comparisonFunction) => {
    for (let i = 0; i < array.length - 1; i++) {
        const itemA = array[i];
        for (let j = i + 1; j < array.length; j++) {
            const itemB = array[j];
            comparisonFunction(itemA, itemB);
        }
    }
};
compareArrayItems(circlePlots, checkCollision);

const circleGrowthIncrement = 1;
const loop = () => {
    // let delta = (now - lastTime) / 1000;
    requestAnimationFrame(loop);
    context.save();
    circlePlots.forEach((circlePlot) => {
        if (circlePlot.radius + circleGrowthIncrement < circlePlot.maxSize) {
            circlePlot.radius += circleGrowthIncrement;
        }
    });
    circlePlots.forEach(drawCircle);
    context.restore();
};
requestAnimationFrame(loop);

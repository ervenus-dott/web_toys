/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('packing-container');
const context = canvas.getContext('2d');
const tau = Math.PI * 2;
let numCircles = 12
let circlePlots = [];

const drawCircle = ({x, y, size, color}) => {
    context.beginPath();
    context.arc(x, y, size, 0, tau);
    context.fillStyle = color;
    context.fill();
};


for (var i = 0; i < numCircles; i++) {
    const circlePlot = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 10,
        color: 'white',
    };
    circlePlots.push(circlePlot);
};


const loop = () => {
    // let delta = (now - lastTime) / 1000;
    requestAnimationFrame(loop);
    context.save();
    
    circlePlots.forEach((circlePlot) => {        
        drawCircle(circlePlot);
        
    });
    context.restore();
};
requestAnimationFrame(loop);

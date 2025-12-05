const canvas = document.getElementById("circle-holder");
const context = canvas.getContext("2d");
const tau = Math.PI * 2;
let circleSize = 500;

const drawCircle = (vert, radius, color) => {
    context.beginPath();
    context.arc(vert[0], vert[1], radius, 0, tau);
    context.fillStyle = color;
    context.fill();
};
const image = new Image();
image.src = 'https://icelandictimes.com/cdn-cgi/image/width=768,quality=90,format=auto,onerror=redirect,metadata=none/wp-content/uploads/2023/11/Svarthvitur-litur_58P6721-768x512.jpg';

const loop = () => {
    requestAnimationFrame(loop);
    context.save();
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let index = 0; index < 20; index++) {
        const radius = circleSize + (index * -50);
        const color = index % 2 ? 'white' : 'black'
        // const color = '#f903'
        drawCircle([250, 250], Math.max(0, radius % 500), color);
    }
    circleSize += 1;
    circleSize %= 1000;
    if (circleSize === 0) {
        circleSize = 500;
    }
    context.globalCompositeOperation = 'exclusion';
    context.fillStyle = 'white';
    if (image.complete) {
        context.drawImage(image, -150, 0, canvas.width * 1.5, canvas.height);
    }
    for (let index = 0; index < 20; index++) {
        const radius = circleSize * 2 + (index * -100);
        context.fillRect(0, canvas.height / 2 - radius, canvas.width, Math.max(0, radius * 2));
    };
    context.globalCompositeOperation = 'overlay';
    context.fillStyle = '#0d445eff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.restore();
};
loop();
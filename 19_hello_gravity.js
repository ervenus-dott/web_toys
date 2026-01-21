const canvas = document.getElementById("circle-holder");
const context = canvas.getContext("2d");
const tau = Math.PI * 2;
// const numParticles = 3
let particles = [{
    x: 137,
    y: 251,
    vx: 0,
    vy: 0,
    color: 'red',
    size: 10,
    mass: 1500,
    stayStill: true,
    outOfBounds: false,
},
{
    x: 312,
    y: 111,
    vx: 0,
    vy: 0,
    color: 'rgba(0, 103, 84, 1)',
    size: 10,
    mass: 1350,
    stayStill: true,
    outOfBounds: false,
}];

const drawCircle = ({x, y, size, color}) => {
    context.beginPath();
    context.arc(x, y, size, 0, tau);
    context.fillStyle = color;
    context.fill();
};

// for (var i = 0; i < numParticles; i++) {
//     size = Math.random() * 25 + 5;
//     const particle = {
//         x: Math.random() * canvas.width,
//         y: Math.random() * canvas.height,
//         vx: 0,
//         vy: 0,
//         color: 'white',
//         // size: 10,
//         size: size,
//         mass: size,
//         stayStill: false,
//     };
//     particles.push(particle);
// };
const checkCollision = (ball0, ball1) => {
    var dx = ball1.x - ball0.x;
    var dy = ball1.y - ball0.y;
    var dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < ball0.radius + ball1.radius) {
        // calculate angle, sine, and cosine
        var angle = Math.atan2(dy, dx);
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);
        // rotate ball0's positio
        var x0 = 0;
        var y0 = 0;
        // rotate ball1's position
        var x1 = dx * cos + dy * sin;
        var y1 = dy * cos - dx * sin;
        // rotate ball0's velocity
        var vx0 = ball0.vx * cos + ball0.vy * sin;
        var vy0 = ball0.vy * cos - ball0.vx * sin;
        291
        // BILLIARD BALL PHYSICS
        // rotate ball1's velocity
        var vx1 = ball1.vx * cos + ball1.vy * sin;
        var vy1 = ball1.vy * cos - ball1.vx * sin;
    }
};

    
const gravitate = (partA, partB) => {
    var dx = partB.x - partA.x;
    var dy = partB.y - partA.y;
    var distSQ = dx * dx + dy * dy;
    var dist = Math.sqrt(distSQ);
    var force = partA.mass * partB.mass / distSQ;
    var ax = force * dx / dist;
    var ay = force * dy / dist;
    partA.vx += ax / partA.mass;
    partA.vy += ay / partA.mass;
    partB.vx -= ax / partB.mass;
    partB.vy -= ay / partB.mass;
    if (partA.stayStill) {
        // console.log("what is part A's vx and vy", partA.vx, partA.vy);
        
        partA.vx = 0;
        partA.vy = 0;
    }
    if (partB.stayStill) {
        // console.log("what is part B's vx and vy", partB.vx, partB.vy);

        partB.vx = 0;
        partB.vy = 0;
    }
    if (
        partA.x < -1000 || 
        partA.x > 1500 ||
        partA.y < -1000 || 
        partA.y > 1500  
    ) {partA.outOfBounds = true}
    if (
        partB.x < -1000 || 
        partB.x > 1500 ||
        partB.y < -1000 || 
        partB.y > 1500  
    ) {partB.outOfBounds = true}
};

const loop = () => {
    requestAnimationFrame(loop);
    // context.save();
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    for(var i = 0; i < particles.length; i++) {
        var particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
    }
    
    for(i=0; i < particles.length - 1; i++) {
        var partA = particles[i];
        for(var j= i + 1; j < particles.length; j++) {
            var partB = particles[j];
            // checkCollision(partA, partB);

            gravitate(partA, partB);
        }
    }
   
    particles = particles.filter((p) => !p.outOfBounds);

    particles.forEach((particle) => {
        drawCircle(particle);
    });
    context.restore();
};
requestAnimationFrame(loop);




const createCelestialObjects = ({position}) => {
    size = 5;
    position = [position[0] - (size * 4), position[1] - (size * 4)];
    const celestialObject = {
        x: position[0],
        y: position[1],
        vx: (Math.random() - 0.5) * 7,
        vy: (Math.random() - 0.5) * 7,
        color: 'white',
        size: size,
        mass: 1,
        stayStill: false,
        outOfBounds: false,
    }
    particles.push(celestialObject);
    drawCircle(celestialObject);
};

canvas.addEventListener('mousedown', function(mouseEvent){
    mouseEvent.preventDefault();
    const currentPosition = {
        position: [mouseEvent.clientX, mouseEvent.clientY],
    };
    createCelestialObjects(currentPosition);
});

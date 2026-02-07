var tau = Math.PI * 2;

var drawCircle = ({pos, radius, lineWidth = 10, color, fill = false}) => {
    context.beginPath();
    context.arc(pos[0], pos[1], radius, 0, tau);
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.stroke();
    if (fill) {
        context.fillStyle = color;
        context.fill();
    };
};
var drawStar = ({pos, rotation, points, innerRadius, outerRadius, lineWidth = 10, color, fill = false}) => {
    context.beginPath();
    var spikeSpacing = tau / points;
    var insetSpacing = spikeSpacing / 2;
    for (let i = 0; i < points; i++) {
        var spikeAngle = (i * spikeSpacing) + rotation;
        var insetAngle = spikeAngle + insetSpacing;
        var spikeMethod = i === 0 ? 'moveTo' : 'lineTo';
        context[spikeMethod](
            pos[0] + Math.cos(spikeAngle) * outerRadius,
            pos[1] + Math.sin(spikeAngle) * outerRadius,
        );
        context.lineTo(
            pos[0] + Math.cos(insetAngle) * innerRadius,
            pos[1] + Math.sin(insetAngle) * innerRadius,
        );
    };
    context.closePath();
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.stroke();
    if (fill) {
        context.fillStyle = color;
        context.fill();
    };
};

var settings = {
    gravity: 9.8,
    drag: 0.2,
    explosionForce: 10,
    minParticles: 62,
    maxParticles: 200,
    minSize: 1,
    maxSize: 29,
    shape: 'star',
    fill: true,
};

var gui = new lil.GUI();

gui.add(settings, 'gravity', 0, 40, 1/500);
gui.add(settings, 'drag', 0, 10, 1/500);
gui.add(settings, 'explosionForce', 0.1, 100, 1/500);
gui.add(settings, 'minParticles', 1, 100, 1);
gui.add(settings, 'maxParticles', 1, 200, 1);
gui.add(settings, 'minSize', 1, 100, 1);
gui.add(settings, 'maxSize', 1, 200, 1);
gui.add(settings, 'shape', ['star', 'circle']);
gui.add(settings, 'fill');

var particles = [
    // {
    //     position: [canvas.width / 2, canvas.height / 2],
    //     radius: 10,
    //     velocity: [0, 0],
    //     color: 'white',
    //     lifeSpan: 100,
    //     tick: 0,
    // }
];
var tickParticles = function(delta) {
    particles.forEach(function(particle){
        particle.velocity[1] += (settings.gravity * delta);
        particle.velocity[0] *= 1 - (settings.drag * delta);
        particle.velocity[1] *= 1 - (settings.drag * delta);
        glMatrix.vec2.add(particle.position, particle.position, particle.velocity);
        particle.tick += 1;
        var lifeFraction = particle.tick / particle.lifeSpan;
        if(
            particle.position[0] - particle.radius > canvas.width ||
            particle.position[0] + particle.radius < 0 ||
            particle.position[1] - particle.radius > canvas.height ||
            lifeFraction > 1
            // particle.position[1] + particle.radius < 0
        ){
            // console.log('dead', particle);
            particle.dead = true;
            return;
        };
        var [r, g, b, a] = linearGradient(gradient, lifeFraction);
        var color = `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${a})`;    
        var radius = particle.radius * a;
        if (settings.shape === 'circle') {
            drawCircle({
                pos: particle.position,
                radius,
                lineWidth: radius * 0.1,
                color: color,
                fill: settings.fill,
            });
        }
        else if (settings.shape === 'star') {
            drawStar({
                pos: particle.position,
                rotation: -tau / 4,
                points: 5,
                innerRadius: radius * 0.5,
                outerRadius: radius,
                lineWidth: radius * 0.1,
                color: color || 'white',
                fill: settings.fill,
            })            
        }
    })
    particles = particles.filter(function(particle){
        return ! particle.dead;
    });
};
var getValueInRange = function(min, max) {
    var difference = max - min;
    return min + (difference * Math.random());
};
var spawnParticlesAtPosition = function(pos) {
    var particleCount = getValueInRange(settings.minParticles, settings.maxParticles);
    for (let i = 0; i < particleCount; i++) {
        var radius = getValueInRange(settings.minSize, settings.maxSize);
        var velocityAngle = getValueInRange(0, tau);
        var velocityMagnitude = getValueInRange(0, settings.explosionForce);
        var particle = {
            position: pos.slice(),
            radius,
            velocity: [
                Math.cos(velocityAngle) * velocityMagnitude,
                (Math.sin(velocityAngle) * velocityMagnitude) - 5,
            ],
            lifeSpan: (Math.random() * 100) + 50,
            tick: 0,
            // color: `hsl(${Math.random() * 360} 100% 50%)`
        };
        particles.push(particle);
    }
}
var gradient = [
    [1, 0.5, 0, 0, 0],
    [1, 0.5, 0, 1, 0.159],
    [0.858198, 0, 0.794648, 1, 0.3],
    [0.044487, 0.0495, 0.928845, 1, 0.538],
    [0.044487, 0.0495, 0.928845, 0, 1],
];


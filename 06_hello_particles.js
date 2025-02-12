var canvas = document.getElementById("toy-canvas");
var context = canvas.getContext('2d');
var tau = Math.PI * 2;

var drawCircle = (vert, radius, color) => {
    context.beginPath();
    context.arc(vert[0], vert[1], radius, 0, tau);
    context.fillStyle = color;
    context.fill();
};

var settings = {
    gravity: 9.8,
    drag: 0.2,
    minParticles: 3,
    maxParticles: 7,
};

var gui = new lil.GUI();

gui.add(settings, 'gravity', 2, 40, 1/500);
gui.add(settings, 'drag', 1, 10, 1/500);
gui.add(settings, 'minParticles', 1, 100, 1);
gui.add(settings, 'maxParticles', 1, 200, 1);

var particles = [
    {
        position: [canvas.width / 2, canvas.height / 2],
        radius: 10,
        velocity: [0, 0],
        color: 'white',
    }
];
var tickParticles = function(delta) {
    particles.forEach(function(particle){
        particle.velocity[1] += (settings.gravity * delta);
        particle.velocity[0] *= 1 - (settings.drag * delta);
        particle.velocity[1] *= 1 - (settings.drag * delta);
        glMatrix.vec2.add(particle.position, particle.position, particle.velocity);
        if(
            particle.position[0] - particle.radius > canvas.width ||
            particle.position[0] + particle.radius < 0 ||
            particle.position[1] - particle.radius > canvas.height
            // particle.position[1] + particle.radius < 0
        ){
            // console.log('dead', particle);
            particle.dead = true;
            return;
        };
        drawCircle(particle.position, particle.radius, particle.color || 'white');
    })
    particles = particles.filter(function(particle){
        return ! particle.dead;
    });
};

canvas.addEventListener('click', function(clickEvent){
    var rect = clickEvent.target.getBoundingClientRect();
    var coords = [
        clickEvent.clientX - rect.x,
        clickEvent.clientY - rect.y
    ];
    var difference = settings.maxParticles - settings.minParticles;
    var particleCount = settings.minParticles + (difference * Math.random());
    for (let i = 0; i < particleCount; i++) {        
        var particle = {
            position: coords.slice(),
            radius: 10,
            velocity: [
                (Math.random() - 0.5) * 10,
                Math.random() * -10
            ],
            color: `hsl(${Math.random() * 360} 100% 50%)`
        };
        particles.push(particle);
    }
    // console.log('what is difference', coords);
});


var lastTime = 0;
var animate = function(time) {
    requestAnimationFrame(animate);
    context.fillStyle = `#0008`
    context.fillRect(0, 0, canvas.width, canvas.height);
    var delta = (time - lastTime) / 1000;
    tickParticles(delta);
    lastTime = time;
}
requestAnimationFrame(animate)

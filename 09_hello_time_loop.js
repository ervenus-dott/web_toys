var canvas = document.getElementById("toy-canvas");
var context = canvas.getContext('2d');
var tau = Math.PI * 2;

var playerAvatar = {
    points: [],
    lines: [],
    position: [0, 0],
    rotation: tau / 2,
    scale: [2.5, 2.5],
    velocity: [0, 0],
    lineColor: '#0F0',
};
var enemyTemplate = {
    points: [],
    lines: [],
    position: [0, 0],
    rotation: 0,
    scale: [5, 5],
    velocity: [0, 0],
    lineColor: '#F00',
};
var goodieTemplate = {
    points: [],
    lines: [],
    position: [0, 0],
    rotation: 0,
    scale: [10, 10],
    velocity: [0, 0],
    lineColor: '#00F',
};
var gridFloor = {
    points: [],
    lines: [],
    position: [0, 0],
    rotation: 0,
    scale: [10, 10],
    velocity: [0, 0],
};

loadObjPath('./object_grid.obj').then(function (obj) {
    console.log('what is objGrid', obj)
    Object.values(obj).forEach((mesh) => {
        mesh.position = [0, 0];
        mesh.rotation = 0;
        mesh.scale = [1, 1];
    });
    // adds the grid floor
    var floor = obj['Circle.009'];
    gridFloor.points = floor.points;
    gridFloor.lines = floor.lines;

    goodieTemplate.points = obj.Circle.points;
    goodieTemplate.lines = obj.Circle.lines;
});
loadObjPath('./unicorn-goat.obj').then(function (obj) {
    enemyTemplate.points = obj.enemy_1.points;
    enemyTemplate.lines = obj.enemy_1.lines;
    playerAvatar.points = obj.goaticorn.points;
    playerAvatar.lines = obj.goaticorn.lines;
});

var drawCircle = (vert, radius, color) => {
    context.beginPath();
    context.arc(vert[0], vert[1], radius, 0, tau);
    context.fillStyle = color;
    context.fill();
};

var settings = {
    x: 0,
    y: 0,
    scale: 10,
    rotation: 0,
};

var gui = new lil.GUI();
var moveRange = 5;
gui.add(settings, 'x', -moveRange, moveRange);
gui.add(settings, 'y', -moveRange, moveRange);
gui.add(settings, 'scale', 1, 50);
// gui.add(settings, 'rotation', 0, tau);

var drawLine = (a, b, color) => {
    context.beginPath();
    context.moveTo(a[0], a[1]);
    context.lineTo(b[0], b[1]);
    context.strokeStyle = color;
    context.lineWidth = 1;
    context.stroke();
};

var cameraTransforms = glMatrix.mat3.create();
var transforms = glMatrix.mat3.create();
var identity = glMatrix.mat3.create();
var transformedVert = glMatrix.vec2.create();
var renderGameObject = ({points, lines, position, rotation, scale, lineColor}) => {
    glMatrix.mat3.translate(transforms, identity, position);
    glMatrix.mat3.rotate(transforms, transforms, rotation);
    glMatrix.mat3.scale(transforms, transforms, scale);
    glMatrix.mat3.multiply(transforms, cameraTransforms, transforms);
    var transformedVerts = points.map((vert) => {
        glMatrix.vec2.transformMat3(transformedVert, vert, transforms);
        return [...transformedVert];
    });
    lines.forEach((indeces) => {
        var pointA = transformedVerts[indeces[0]];
        var pointB = transformedVerts[indeces[1]];
        drawLine(pointA, pointB, lineColor || '#999');
    });
    // transformedVerts.forEach((vert, index) => {
    //     drawCircle(vert, 2, `hsl(${index * 10 % 360}, 75%, 50%)`);
    // });
};
var inputHistory = [];
var snapShotPlayer = function() {
    inputHistory.push({
        position: playerAvatar.position.slice(),
        time: performance.now(),
    });
};
snapShotPlayer();
var handleMouseMoveEvent = (mouseEvent) => {
    // compensate for difference between canvas coordinate and event coordinate
    var rect = mouseEvent.target.getBoundingClientRect();
    var difference = {
        x: mouseEvent.clientX - rect.x,
        y: mouseEvent.clientY - rect.y,
    };
    difference.x -= canvas.width / 2;
    difference.y -= canvas.height / 2;
    // console.log('what is difference', difference);
    playerAvatar.position[0] = difference.x / settings.scale;
    playerAvatar.position[1] = -difference.y / settings.scale;
    snapShotPlayer()
};
canvas.addEventListener('mousemove', handleMouseMoveEvent);

var getSampleJustBeforeTimeOffset = function(offset) {
    var then = performance.now() - offset;
    var result = inputHistory.slice().reverse().find((sample) => {
        return sample.time < then;
    })
    return result;
};

var lastTime = 0;
var animate = function(time) {
    requestAnimationFrame(animate);
    // context.globalCompositeOperation = 'source-over';
    context.fillStyle = `#0008`
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
    var delta = (time - lastTime) / 1000;
    // context.globalCompositeOperation = 'lighter';
    // tickParticles(delta);
    glMatrix.mat3.rotate(cameraTransforms, identity, settings.rotation);
    glMatrix.mat3.scale(cameraTransforms, cameraTransforms, [settings.scale, -settings.scale]);
    glMatrix.mat3.translate(cameraTransforms, cameraTransforms, [-settings.x, -settings.y]);

    renderGameObject(gridFloor);

    for (let i = 0; i < 5; i++) {
        var sample = getSampleJustBeforeTimeOffset(2000 * (i + 1));
        if (sample) {
            enemyTemplate.position = sample.position;
            renderGameObject(enemyTemplate);
        }        
    }
    renderGameObject(playerAvatar);
    context.restore();
    lastTime = time;
};
requestAnimationFrame(animate);

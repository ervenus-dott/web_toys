var canvas = document.getElementById("toy-canvas");
var context = canvas.getContext('2d');
var tau = Math.PI * 2;

var shapeGrid = [];

loadObjPath('./object_grid.obj').then(function (obj) {
    // console.log('what is objGrid', obj)
    shapeGrid = Object.values(obj).map((mesh) => {
        mesh.position = [0, 0];
        mesh.rotation = 0;
        mesh.scale = [1, 1];
        return mesh;
    });
    console.log('what is shapeGrid', shapeGrid);
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
    scale: 70,
    rotation: 0,
};

var gui = new lil.GUI();
var moveRange = 5;
gui.add(settings, 'x', -moveRange, moveRange);
gui.add(settings, 'y', -moveRange, moveRange);
gui.add(settings, 'scale', 10, 100);
gui.add(settings, 'rotation', 0, tau);

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
    transformedVerts.forEach((vert, index) => {
        drawCircle(vert, 2, `hsl(${index * 10 % 360}, 75%, 50%)`);
    });
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

    shapeGrid.forEach(renderGameObject);
    context.restore();
    lastTime = time;
};
requestAnimationFrame(animate);

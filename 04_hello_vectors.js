var enemy = {
    verts: [],
    lines: [],
    position: [420, 144],
    rotation: 0,
    scale: [80, 80],
    velocity: [0, 0],
};
var lazer = {
    verts: [],
    lines: [],
    position: [-420, -144],
    rotation: 0,
    scale: [80, 80],
    velocity: [0, 0],
    lineColor: '#F00',
};
var goaticorn = {
    verts: [],
    lines: [],
    position: [256, 144],
    rotation: 0,
    scale: [50, 50],
    velocity: [0, 0],
    lineColor: '#842',
};
var bear = {
    verts: [],
    lines: [],
    position: [80, 144],
    rotation: 0,
    scale: [20, 20],
};

loadObjPath('./unicorn-goat.obj').then(function (obj) {
    enemy.verts = obj.enemy_1.points;
    enemy.lines = obj.enemy_1.lines;
    goaticorn.verts = obj.goaticorn.points;
    goaticorn.lines = obj.goaticorn.lines;
    lazer.verts = obj.enemy_1_lazer.points;
    lazer.lines = obj.enemy_1_lazer.lines;
});

bear.verts = [
    [0.256251, 0.229275],
    [0.204999, 0.002696],
    [-1.739261, -1.55638],
    [0.010789, -0.115986],
    [-1.31038, -1.669669],
    [-1.009354, -1.698801],
    [-0.786012, -1.553143],
    [-0.475275, -1.68909],
    [0.155909, -1.669669],
    [0.622014, -1.524011],
    [0.777382, -1.407485],
    [1.039566, -1.533722],
    [1.427987, -1.465748],
    [1.729013, -1.213275],
    [1.85525, -0.747169],
    [1.699882, -0.349038],
    [1.311461, -0.154828],
    [1.272619, -0.174249],
    [1.078408, 0.282146],
    [0.893908, 0.495777],
    [1.136671, 0.680277],
    [1.661039, 1.117251],
    [2.03975, 1.699882],
    [2.156276, 2.447592],
    [1.952355, 2.622381],
    [1.651329, 2.641802],
    [1.554224, 2.457303],
    [1.369724, 2.952539],
    [1.097829, 3.107908],
    [0.787093, 3.146749],
    [0.136488, 3.039934],
    [0.068514, 2.738908],
    [-0.086854, 3.078776],
    [-0.426723, 3.195302],
    [-0.863696, 3.185592],
    [-1.242406, 2.894276],
    [-1.31038, 2.40875],
    [-1.31038, 2.253381],
    [-1.465748, 2.690355],
    [-1.669669, 2.855434],
    [-2.077511, 2.738908],
    [-2.359116, 2.486434],
    [-2.397958, 2.000908],
    [-2.145485, 1.437698],
    [-1.640538, 0.719119],
    [-1.096748, 0.456935],
    [-1.300669, 0.185041],
    [-1.524011, -0.38788],
    [-1.737643, -0.57238],
    [-1.883301, -0.883117],
    [-1.912432, -1.281248],
    [0.06204, 0.310196],
    [-0.107894, 0.334473],
    [-0.253551, 0.269736],
    [-0.32638, 0.124078],
    [-0.221183, -0.053948],
    [0.486144, -0.087948],
    [0.582503, -0.196343],
    [0.572122, -0.338062],
    [0.37446, -0.157091],
    [0.300351, -0.234509],
    [0.280245, -0.331972],
    [0.327689, -0.421896],
    [0.456291, -0.433236],
    [-0.596061, -0.128408],
    [-0.692419, -0.236804],
    [-0.682038, -0.378523],
    [-0.484377, -0.197551],
    [-0.410268, -0.27497],
    [-0.390162, -0.372433],
    [-0.437606, -0.462356],
    [-0.566208, -0.473697],
    [1.23054, -0.824854],
    [1.23054, -0.565907],
    [1.351921, -0.800577],
    [1.343829, -0.930051],
    [-1.315688, -0.681064],
    [-1.283117, -0.937955],
    [1.012053, -1.140446],
    [-1.406588, -0.929139],
    [-1.382274, -1.056567],
    [-1.026668, -1.223557],
    [1.659421, 2.238816],
    [1.497579, 1.850395],
    [1.23054, 1.648093],
    [0.987777, 1.615724],
    [0.898764, 1.615724],
    [0.712645, 1.073553],
    [0.61554, 0.79033],
    [-0.934906, 0.570225],
    [-0.926814, 0.918185],
    [-0.999643, 1.193316],
    [-1.161485, 1.581737],
    [-1.250498, 1.913513],
    [-1.250498, 1.945882],
    [-1.10484, 1.703119],
    [-0.805433, 1.500816],
    [-0.586946, 1.500816],
    [-0.247078, 1.646474],
    [0.117067, 1.913513],
    [0.157527, 2.221013],
    [0.157527, 2.221013],
    [0.61554, 1.664277],
    [0.348501, 1.874671],
    [0.235211, 2.068882],
    [-0.578854, 0.740159],
    [-0.125696, 0.837264],
    [0.278909, 0.829172],
    [0.278909, 0.829172],
];

var canvas = document.getElementById("toy-canvas");
var scoreHolder = document.getElementById("score-holder");
var score = 0;

var handleMouseMoveEvent = (mouseEvent) => {
    // compensate for difference between canvas coordinate and event coordinate
    var rect = mouseEvent.target.getBoundingClientRect();
    var difference = {
        x: mouseEvent.clientX - rect.x,
        y: mouseEvent.clientY - rect.y,
    };
    // console.log('what is difference', difference);
    goaticorn.position[0] = difference.x;
    goaticorn.position[1] = difference.y;
};
canvas.addEventListener('mousemove', handleMouseMoveEvent);

var shootLazer = (speed) => {
    lazer.position[0] = goaticorn.position[0];
    lazer.position[1] = goaticorn.position[1];
    lazer.rotation = goaticorn.rotation;
    var rotation = goaticorn.rotation + (tau / -4);
    lazer.velocity[0] = Math.cos(rotation) * speed * 3;
    lazer.velocity[1] = Math.sin(rotation) * speed * 3;
};
canvas.addEventListener('mousedown', function(mouseEvent){
    mouseEvent.preventDefault();
    shootLazer(4);
})

var goaticornRotationSpeed = 7
var handleKeyDownEvent = (keyEvent) => {
    var speed = 3;
    // console.log('what is keyEvent', keyEvent);
    if (keyEvent.code === 'KeyW') {
        goaticorn.velocity[1] = -speed;
    } else if (keyEvent.code === 'KeyD') {
        goaticorn.velocity[0] = speed;
    } else if (keyEvent.code === 'KeyS') {
        goaticorn.velocity[1] = speed;
    } else if (keyEvent.code === 'KeyA') {
        goaticorn.velocity[0] = -speed;
    }else if (keyEvent.code === 'KeyE') {
        goaticorn.scale = [50, 50];
    } else if (keyEvent.code === 'KeyR') {
        goaticorn.scale = [100, 100];
    } else if (keyEvent.code === 'KeyX') {
        goaticornRotationSpeed *= -1;
    } else if (keyEvent.code === 'ArrowUp') {
        enemy.velocity[1] = -speed;
    } else if (keyEvent.code === 'ArrowRight') {
        enemy.velocity[0] = speed;
    } else if (keyEvent.code === 'ArrowDown') {
        enemy.velocity[1] = speed;
    } else if (keyEvent.code === 'ArrowLeft') {
        enemy.velocity[0] = -speed;
    } else if (keyEvent.code === 'Space') {
        shootLazer(speed);
    }
};
window.addEventListener('keydown', handleKeyDownEvent);

var handleKeyUpEvent = (keyEvent) => {
    if (keyEvent.code === 'KeyW') {
        goaticorn.velocity[1] = 0;
    } else if (keyEvent.code === 'KeyD') {
        goaticorn.velocity[0] = 0;
    } else if (keyEvent.code === 'KeyS') {
        goaticorn.velocity[1] = 0;
    } else if (keyEvent.code === 'KeyA') {
        goaticorn.velocity[0] = 0;
    } else if (keyEvent.code === 'ArrowUp') {
        enemy.velocity[1] = 0;
    } else if (keyEvent.code === 'ArrowRight') {
        enemy.velocity[0] = 0;
    } else if (keyEvent.code === 'ArrowDown') {
        enemy.velocity[1] = 0;
    } else if (keyEvent.code === 'ArrowLeft') {
        enemy.velocity[0] = 0;
    }
};
window.addEventListener('keyup', handleKeyUpEvent);

var context = canvas.getContext('2d');
var tau = Math.PI * 2;
var drawCircle = (vert, radius, color) => {
    context.beginPath();
    context.arc(vert[0], vert[1], radius, 0, tau);
    context.fillStyle = color;
    context.fill();
};
var drawLine = (a, b, color) => {
    context.beginPath();
    context.moveTo(a[0], a[1]);
    context.lineTo(b[0], b[1]);
    context.strokeStyle = color;
    context.lineWidth = 1;
    context.stroke();
};

var transforms = glMatrix.mat3.create();
var identity = glMatrix.mat3.create();
var transformedVert = glMatrix.vec2.create();
var renderGameObject = ({verts, lines, position, rotation, scale, lineColor}) => {
    glMatrix.mat3.translate(transforms, identity, position);
    glMatrix.mat3.rotate(transforms, transforms, rotation);
    glMatrix.mat3.scale(transforms, transforms, scale);
    var transformedVerts = verts.map((vert) => {
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
}

var vsyncLoop = (time) => {
    requestAnimationFrame(vsyncLoop);
    var seconds = time / 1000;
    goaticorn.rotation = seconds / goaticornRotationSpeed * tau;
    bear.rotation = seconds / 2 * -tau;
    enemy.rotation = seconds / 2 * tau;

    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    glMatrix.vec2.add(
        goaticorn.position,
        goaticorn.position,
        goaticorn.velocity,
    );
    glMatrix.vec2.add(
        enemy.position,
        enemy.position,
        enemy.velocity,
    );
    glMatrix.vec2.add(
        lazer.position,
        lazer.position,
        lazer.velocity,
    );

    var enemySize = 50;
    if (
        lazer.position[0] > enemy.position[0] - enemySize &&
        lazer.position[0] < enemy.position[0] + enemySize &&
        lazer.position[1] > enemy.position[1] - enemySize &&
        lazer.position[1] < enemy.position[1] + enemySize
    ) {
        enemy.lineColor = '#F00';
        score += 1;
        scoreHolder.innerText = score;
    } else {
        delete enemy.lineColor;
    }

    renderGameObject(goaticorn);
    renderGameObject(bear);
    renderGameObject(enemy);
    renderGameObject(lazer);
}
requestAnimationFrame(vsyncLoop);



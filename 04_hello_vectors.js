var goaticornVerts = [
    [0.22, -0.49],
    [0, -0.28],
    [0.3, -0.72],
    [0, -0.83],
    [0.6, -0.41],
    [0.83, 0.08],
    [0.77, 0.38],
    [0.63, 0.7],
    [0.48, 0.92],
    [0.44, 0.97],
    [0.4, 0.98],
    [0.34, 0.95],
    [0.31, 0.92],
    [0.32, 0.67],
    [0.37, 0.45],
    [0.42, 0.14],
    [0.45, -0.11],
    [0.38, 0.05],
    [0.35, 0.2],
    [0.25, 0.37],
    [0.09, 0.56],
    [0.03, 0.58],
    [0, 0.58],
    [0.14, 0.21],
    [0.1, 0.33],
    [0.03, 0.39],
    [0, 0.39],
    [0.06, 0.22],
    [0.02, 0.24],
    [0, 0.25],
    [0.35, -0.14],
    [0.39, -0.21],
    [0.43, -0.25],
    [0.47, -0.25],
    [0.5, -0.23],
    [0.47, -0.19],
    [0.43, -0.14],
    [0.4, -0.13],
    [0.09, -0.64],
    [0, -1.41],
    [0.05, -0.6],
    [0, -0.59],
    [-0.22, -0.49],
    [-0.3, -0.72],
    [-0.6, -0.41],
    [-0.83, 0.08],
    [-0.77, 0.38],
    [-0.63, 0.7],
    [-0.48, 0.92],
    [-0.44, 0.97],
    [-0.4, 0.98],
    [-0.34, 0.95],
    [-0.31, 0.92],
    [-0.32, 0.67],
    [-0.37, 0.45],
    [-0.42, 0.14],
    [-0.45, -0.11],
    [-0.38, 0.05],
    [-0.35, 0.2],
    [-0.25, 0.37],
    [-0.09, 0.56],
    [-0.03, 0.58],
    [-0.14, 0.21],
    [-0.1, 0.33],
    [-0.03, 0.39],
    [-0.06, 0.22],
    [-0.02, 0.24],
    [-0.35, -0.14],
    [-0.39, -0.21],
    [-0.43, -0.25],
    [-0.47, -0.25],
    [-0.5, -0.23],
    [-0.47, -0.19],
    [-0.43, -0.14],
    [-0.4, -0.13],
    [-0.09, -0.64],
    [-0.05, -0.6],
];

var canvas = document.getElementById("toy-canvas");
var context = canvas.getContext('2d');
var tau = Math.PI * 2;
var drawCircle = (vert, radius, color) => {
    context.beginPath();
    context.arc(vert[0], vert[1], radius, 0, tau);
    context.fillStyle = color;
    context.fill();
};

var scaleyDo = glMatrix.mat3.create();
var translation = glMatrix.vec2.fromValues(256, 144);
glMatrix.mat3.translate(scaleyDo, scaleyDo, translation);
glMatrix.mat3.scale(scaleyDo, scaleyDo, [100, 100]);

goaticornVerts.forEach((vert) => {
    var transformedVert = glMatrix.vec2.create();
    glMatrix.vec2.transformMat3(transformedVert, vert, scaleyDo);
    drawCircle(transformedVert, 2, '#66f');
})
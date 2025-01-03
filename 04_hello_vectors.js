var enemyVerts = [];
var goaticornVerts = [];
var goaticornLines = [];

loadObjPath('./unicorn-goat.obj').then(function (obj) {
    enemyVerts = obj.enemy_1.points;
    goaticornVerts = obj.goaticorn.points;
    goaticornLines = obj.goaticorn.lines;
});

var bearVerts = [
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
    context.lineWidth = 3;
    context.stroke();
};

var transforms = glMatrix.mat3.create();
var identity = glMatrix.mat3.create();
var transformedVert = glMatrix.vec2.create();
var vsyncLoop = (time) => {
    requestAnimationFrame(vsyncLoop);
    var seconds = time / 1000;
    var goatRotation = seconds / 7 * tau;
    var bearRotation = seconds / 2 * -tau;

    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    glMatrix.mat3.translate(transforms, identity, [256, 144]);
    glMatrix.mat3.rotate(transforms, transforms, goatRotation);
    glMatrix.mat3.scale(transforms, transforms, [100, 100]);
    var transformedGoaticornVerts = goaticornVerts.map((vert, index) => {
        glMatrix.vec2.transformMat3(transformedVert, vert, transforms);
        drawCircle(transformedVert, 2, `hsl(${index * 10 % 360}, 75%, 50%)`);
        return [...transformedVert];
    });
    // console.log('what is transformedGoaticornVerts', transformedGoaticornVerts);
    goaticornLines.forEach((indeces)=>{
        var pointA = transformedGoaticornVerts[indeces[0]];
        var pointB = transformedGoaticornVerts[indeces[1]];
        drawLine(pointA, pointB, '#999');
    });

    glMatrix.mat3.translate(transforms, identity, [80, 144]);
    glMatrix.mat3.rotate(transforms, transforms, bearRotation);
    glMatrix.mat3.scale(transforms, transforms, [20, 20]);
    bearVerts.forEach((vert, index) => {
        glMatrix.vec2.transformMat3(transformedVert, vert, transforms);
        drawCircle(transformedVert, 2, `hsl(${index * 10 % 360}, 75%, 50%)`);
    });


    glMatrix.mat3.translate(transforms, identity, [420, 144]);
    glMatrix.mat3.rotate(transforms, transforms, bearRotation);
    glMatrix.mat3.scale(transforms, transforms, [80, 80]);
    enemyVerts.forEach((vert, index) => {
        glMatrix.vec2.transformMat3(transformedVert, vert, transforms);
        drawCircle(transformedVert, 2, `hsl(${index * 10 % 360}, 75%, 50%)`);
    })
}
requestAnimationFrame(vsyncLoop);

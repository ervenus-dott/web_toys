var canvas = document.getElementById("toy-canvas");

var context = canvas.getContext('2d');
var tau = Math.PI * 2;


var drawCircle = (vert, radius, color) => {
    context.beginPath();
    context.arc(vert[0], vert[1], radius, 0, tau);
    context.fillStyle = color;
    context.fill();
};
var backgroundFillRect = () => {
    context.fillStyle = "green";
    context.fillRect(20, 10, 150, 100);
};

var settings = {
    circleRadius: 10,
    cellSpacing: 20,
    startOffset: 16,
    endOffset: 10,
    perlin_octaves: 4,
    perlin_amp_falloff: 0.5,
    scale: 1 / 25,
    backgroundOpacity: 255,
    speed: 1,
};

var createGridOfPoints = function(cellSpacing) {
    // var startOffset = cellSpacing / 1.5;
    // var endOffset = cellSpacing / 1.1;
    var points = [];
    for (let y = settings.startOffset; y < canvas.height; y += cellSpacing) {
        for (let x = settings.startOffset; x < canvas.width - settings.endOffset; x += cellSpacing) {
            points.push([x, y]);
        }    
    }
    return points;
};

var samplePerlinAtPoint = function(point) {
    var x = point[0];
    var y = point[1];
    var rawValue = noise(x * settings.scale, y * settings.scale);
    var perlinDiff = perlinMax - perlinMin;
    var value = (rawValue - perlinMin) / perlinDiff;
    // console.log('what is x and y', x, y);
    point[2] = value * tau;
    point[3] = `hsl(0 0 ${value * 100}%)`;
};
var renderPoint = function(point) {
    // drawCircle(point, settings.circleRadius, point[3]);
    drawAngledArrow({
        startX: point[0],
        startY: point[1],
        angle: point[2],
        length: settings.circleRadius,
        arrowLength: 2,
        arrowWidth: 2,            
        color: 'blue',
    });
};

var points = createGridOfPoints(settings.cellSpacing);
var gui = new lil.GUI();

gui.add(settings, 'cellSpacing', 2, 40, 1/500);
gui.add(settings, 'startOffset', 1, 10, 1/500);
gui.add(settings, 'endOffset', 1, 10, 1/500);
gui.add(settings, 'circleRadius', 1, 10, 1/500);
gui.add(settings, 'speed', 0.1, 100, 0.1);
// gui.onChange(function(){
//     context.fillStyle = "black";
//     context.fillRect(0, 0, canvas.width, canvas.height);
//     drawGrid(settings.cellSpacing);
// })

// this is all a test below if it doesnt work 
// comment the shit below out

var image = context.createImageData(canvas.width, canvas.height);
var data = image.data;
var perlinMin = 0;
var perlinMax = 0;
var perlinRerender = function() {  
  for (var x = 0; x < canvas.width; x++) {
    for (var y = 0; y < canvas.height; y++) {
      var value = noise(x * settings.scale, y * settings.scale);
      perlinMin = Math.min(perlinMin, value);
      perlinMax = Math.max(perlinMax, value);
      value *= 256;
  
      var cell = (x + y * canvas.width) * 4;
      data[cell] = data[cell + 1] = data[cell + 2] = value;
      // data[cell] += Math.max(0, (25 - value) * 8);
      data[cell + 3] = settings.backgroundOpacity; // alpha.
    }
  } 
  context.putImageData(image, 0, 0);
};
perlinRerender();

gui.add(settings, 'perlin_octaves', 0.01, 10)
gui.add(settings, 'perlin_amp_falloff', 0.01, 2)
gui.add(settings, 'scale', 1 / 500, 1 / 25, 1 / 500)
gui.add(settings, 'backgroundOpacity', 0, 255, 1)
//   gui.onChange(function(){
//     updateShit()
//   });

gui.onChange(function(){
    var start = Date.now();
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    noiseDetail(settings.perlin_octaves, settings.perlin_amp_falloff);
    perlinMin = 0;
    perlinMax = 0;
    if(settings.backgroundOpacity) {
        perlinRerender()
    };
    points = createGridOfPoints(settings.cellSpacing);
    points.forEach(samplePerlinAtPoint);
    points.forEach(renderPoint);
    renderPerformanceStats(start);
})
var wiggle = function(delta) {
    var flowPoint = function(point) {
        point[0] += Math.cos(point[2]) * delta * settings.speed;
        point[1] += Math.sin(point[2]) * delta * settings.speed;
        if (point[0] < 0) {
            point[0] = canvas.width
        }
        else if (point[0] > canvas.width) {
            point[0] = 0
        }
        if (point[1] < 0) {
            point[1] = canvas.height
        }
        else if (point[1] > canvas.height) {
            point[1] = 0
        }
    };    
    points.forEach(samplePerlinAtPoint);
    points.forEach(flowPoint); 
    points.forEach(renderPoint); 
}
var lastTime = 0;
var animate = function(time) {
    requestAnimationFrame(animate);
    context.fillStyle = `#0001`
    context.fillRect(0, 0, canvas.width, canvas.height);
    var delta = (time - lastTime) / 1000;
    wiggle(delta);
    lastTime = time;
}
requestAnimationFrame(animate)

function renderPerformanceStats(start) {
    var end = Date.now();
    context.font = '16px sans-serif';
    context.textAlign = 'center';
    context.fillText('Rendered in ' + (end - start) + ' ms', canvas.width / 2, canvas.height - 20);

    if (console) {
        console.log('Rendered in ' + (end - start) + ' ms');
    }
}
  
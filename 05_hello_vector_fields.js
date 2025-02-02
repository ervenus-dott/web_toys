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
    circleRadius: 2,
    cellSpacing: 20,
    startOffset: 16,
    endOffset: 10,
    perlin_octaves: 4,
    perlin_amp_falloff: 0.5,
    scale: 1 / 25,
    backgroundOpacity: 255,
}

var drawGrid = function(cellSpacing) {
    // var startOffset = cellSpacing / 1.5;
    // var endOffset = cellSpacing / 1.1;
    for (let y = settings.startOffset; y < canvas.height; y += cellSpacing) {
        for (let x = settings.startOffset; x < canvas.width - settings.endOffset; x += cellSpacing) {
            var value = Math.abs(noise(x * settings.scale, y * settings.scale));
            var color = `hsl(0 0 ${value * 100}%)`;
            drawCircle([x, y], settings.circleRadius, color);
            // console.log('what is x and y', x, y);
            
            arrowObj2.startX = x;
            arrowObj2.startY = y;
            // console.log('what is value', value);
            arrowObj2.angle = value * 360;
            arrowObj2.length = settings.circleRadius;
            arrowObj2.color = 'blue';
            drawAngledArrow(arrowObj2);


        }    
    }
};

drawGrid(settings.cellSpacing)
var gui = new lil.GUI()

gui.add(settings, 'cellSpacing', 2, 40, 1/500);
gui.add(settings, 'startOffset', 1, 10, 1/500);
gui.add(settings, 'endOffset', 1, 10, 1/500);
gui.add(settings, 'circleRadius', 1, 10, 1/500);
// gui.onChange(function(){
//     context.fillStyle = "black";
//     context.fillRect(0, 0, canvas.width, canvas.height);
//     drawGrid(settings.cellSpacing);
// })

// this is all a test below if it doesnt work 
// comment the shit below out

var image = context.createImageData(canvas.width, canvas.height);
var data = image.data;
var perlinRerender = function() {  
  for (var x = 0; x < canvas.width; x++) {
    for (var y = 0; y < canvas.height; y++) {
      var value = Math.abs(noise(x * settings.scale, y * settings.scale));
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
    if(settings.backgroundOpacity) {
        perlinRerender()
    };
    drawGrid(settings.cellSpacing);
    renderPerformanceStats(start);
})


function renderPerformanceStats(start) {
    var end = Date.now();
    context.font = '16px sans-serif';
    context.textAlign = 'center';
    context.fillText('Rendered in ' + (end - start) + ' ms', canvas.width / 2, canvas.height - 20);

    if (console) {
        console.log('Rendered in ' + (end - start) + ' ms');
    }
}
  
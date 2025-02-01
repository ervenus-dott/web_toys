var canvas = document.getElementById("toy-canvas");
var context = canvas.getContext('2d');
var tau = Math.PI * 2;

var angle = 85; // Degree
var x1 = 125;   //start x coord
var y1 = 125;   //start y coord
var length =  100; // lenth of the line

x2 = x1 + Math.cos(Math.PI * angle / 180) * length;
y2 = y1 + Math.sin(Math.PI * angle / 180) * length;

context.moveTo(x1, y1);
context.lineTo(x2, y2);
// context.lineWidth = 10;
context.strokeStyle = 'white';
context.stroke();

//var drawAngledLine = function(angle, startX, StartY, lineLength)
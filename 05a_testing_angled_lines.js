var canvas = document.getElementById("toy-canvas");
var context = canvas.getContext('2d');
var tau = Math.PI * 2;

// var angle = 85; // Degree
// var x1 = 125;   //start x coord
// var y1 = 125;   //start y coord
// var length =  100; // lenth of the line

var lineObj = {
    angle: 85,
    startX: 125,
    startY: 125,
    lineLength: 100,
};
var arrowObj = {
    angle: 68,
    startX: 140,
    startY: 170,
    length: 75,
    arrowLength: 10,
    arrowWidth: 5,
    color: 'red',
};
var arrowObj2 = {
    angle: 360,
    startX: 70,
    startY: 310,
    length: 7,
    arrowLength: 2,
    arrowWidth: 2,
    color: 'white',
};
var createdAngle = 34;
var arrowObj3 = {
    angle: createdAngle,
    startX: 310,
    startY: 70,
    length: 85,
    arrowLength: 10,
    arrowWidth: 5,
    color: 'green',
};
drawAngledLine(lineObj.angle, lineObj.startX, lineObj.startY, lineObj.lineLength);
drawAngledArrow(arrowObj);
drawAngledArrow(arrowObj2);
arrowObj3.angle = 21;
drawAngledArrow(arrowObj3);



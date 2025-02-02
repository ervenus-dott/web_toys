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

//ArrowHead information

// x2 = x1 + Math.cos(Math.PI * angle / 180) * length;
// y2 = y1 + Math.sin(Math.PI * angle / 180) * length;

// context.moveTo(x1, y1);
// context.lineTo(x2, y2);
// // context.lineWidth = 10;
// context.strokeStyle = 'white';
// context.stroke();

var endXAndYCoordsFromAngleLength = (startX, startY, angle, length) => {
    endValueA = startValueA + Math.cos(Math.PI * angle / 180) * length;
    endValueB = startValueB + Math.sin(Math.PI * angle / 180) * length;
};

var drawAngledLine = function(angle, startX, startY, lineLength) {
    endX = startX + Math.cos(Math.PI * angle / 180) * lineLength;
    endY = startY + Math.sin(Math.PI * angle / 180) * lineLength;
    
    context.beginPath()
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    // context.lineWidth = 10;
    context.strokeStyle = 'white';
    context.stroke();
    
    console.log('what x coord is endX', endX);
    console.log('what y coord is endY', endY);
    console.log('what angle is angle', angle);
    // getNewCoordFromAngleAndLength(endX, endY, arrowHeadStartPointAngle, distanceFromEndOfLineEnd);
};
drawAngledLine(lineObj.angle, lineObj.startX, lineObj.startY, lineObj.lineLength);
var arrowHeadStartPointAngle = lineObj.angle + 90;
var arrowHeadWidth = 10

var drawAngledArrow = function({startX, startY, angle, length, arrowWidth, arrowLength, color}) {
    var endX = startX + Math.cos(Math.PI * angle / 180) * (length - arrowLength);
    var endY = startY + Math.sin(Math.PI * angle / 180) * (length - arrowLength);

    var firstArrowStartX = endX + Math.cos(Math.PI * (angle - 90) / 180) * arrowWidth;
    var firstArrowStartY = endY + Math.sin(Math.PI * (angle - 90) / 180) * arrowWidth;

    var firstArrowSideX = startX + Math.cos(Math.PI * angle / 180) * length;
    var firstArrowSideY = startY + Math.sin(Math.PI * angle / 180) * length;
    
    var secondArrowStartX = endX + Math.cos(Math.PI * (angle + 90) / 180) * arrowWidth;
    var secondArrowStartY = endY + Math.sin(Math.PI * (angle + 90) / 180) * arrowWidth;

    // var firstArrowSideX = startX + Math.cos(Math.PI * angle / 180) * length;
    // var firstArrowSideY = startY + Math.sin(Math.PI * angle / 180) * length;
    context.beginPath()
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.moveTo(firstArrowStartX, firstArrowStartY);
    context.lineTo(firstArrowSideX, firstArrowSideY);
    context.moveTo(secondArrowStartX, secondArrowStartY);
    context.lineTo(firstArrowSideX, firstArrowSideY);
    // context.lineWidth = 10;


    
    context.strokeStyle = color;
    context.stroke();
    console.log('what x coord is endX', endX);
    console.log('what x coord is arrowheadStartX', firstArrowStartX);
    console.log('what x coord is arrowheadEndX', firstArrowSideX);
    console.log('what y coord is endY', endY);
    console.log('what y coord is arrowheadStartY', firstArrowStartY);
    console.log('what y coord is arrowheadEndY', firstArrowSideY);
    console.log('what angle is angle', angle);
};

drawAngledArrow(arrowObj);
drawAngledArrow(arrowObj2);
arrowObj3.angle = 21;
drawAngledArrow(arrowObj3);



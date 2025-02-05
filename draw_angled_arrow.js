var drawAngledLine = function (angle, startX, startY, lineLength) {
    var endX = startX + Math.cos(Math.PI * angle / 180) * lineLength;
    var endY = startY + Math.sin(Math.PI * angle / 180) * lineLength;

    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    // context.lineWidth = 10;
    context.strokeStyle = 'white';
    context.stroke();

    // console.log('what x coord is endX', endX);
    // console.log('what y coord is endY', endY);
    // console.log('what angle is angle', angle);
    // getNewCoordFromAngleAndLength(endX, endY, arrowHeadStartPointAngle, distanceFromEndOfLineEnd);
};
var deg = Math.PI / 180;
var drawAngledArrow = function ({ startX, startY, angle, length, arrowWidth, arrowLength, color }) {
    var endX = startX + Math.cos(angle) * (length - arrowLength);
    var endY = startY + Math.sin(angle) * (length - arrowLength);

    var firstArrowStartX = endX + Math.cos(angle - (deg * 90)) * arrowWidth;
    var firstArrowStartY = endY + Math.sin(angle - (deg * 90)) * arrowWidth;

    var firstArrowSideX = startX + Math.cos(angle) * length;
    var firstArrowSideY = startY + Math.sin(angle) * length;

    var secondArrowStartX = endX + Math.cos(angle + (deg * 90)) * arrowWidth;
    var secondArrowStartY = endY + Math.sin(angle + (deg * 90)) * arrowWidth;

    // var firstArrowSideX = startX + Math.cos(Math.PI * angle / 180) * length;
    // var firstArrowSideY = startY + Math.sin(Math.PI * angle / 180) * length;
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.moveTo(firstArrowStartX, firstArrowStartY);
    context.lineTo(firstArrowSideX, firstArrowSideY);
    context.moveTo(secondArrowStartX, secondArrowStartY);
    context.lineTo(firstArrowSideX, firstArrowSideY);
    // context.lineWidth = 10;
    context.strokeStyle = color;
    context.stroke();
    // console.log('what x coord is endX', endX);
    // console.log('what x coord is arrowheadStartX', firstArrowStartX);
    // console.log('what x coord is arrowheadEndX', firstArrowSideX);
    // console.log('what y coord is endY', endY);
    // console.log('what y coord is arrowheadStartY', firstArrowStartY);
    // console.log('what y coord is arrowheadEndY', firstArrowSideY);
    // console.log('what angle is angle', angle);
};

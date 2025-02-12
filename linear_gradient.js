function lerp(pointA, pointB, normalValue) {
    return [
        pointA[0] + (pointB[0] - pointA[0]) * normalValue,
        pointA[1] + (pointB[1] - pointA[1]) * normalValue,
        pointA[2] + (pointB[2] - pointA[2]) * normalValue,
        pointA[3] + (pointB[3] - pointA[3]) * normalValue,
    ];
}

function linearGradient(stops, value) {
    let stopIndex = 0;
    while(stops[stopIndex + 1][4] < value){
        stopIndex++;    
    }

    const remainder = value - stops[stopIndex][4];
    const stopFraction = remainder / (stops[stopIndex + 1][4] - stops[stopIndex][4]);

    return lerp(stops[stopIndex], stops[stopIndex + 1], stopFraction);
}

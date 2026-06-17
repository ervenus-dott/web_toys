/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('packing-container');
const context = canvas.getContext('2d');
const tau = Math.PI * 2;
let numCircles = 81
let circlePlots = [];

const drawCircle = ({x, y, radius, color}) => {
    context.beginPath();
    context.arc(x, y, radius, 0, tau);
    context.strokeStyle = color;
    context.stroke();
};


for (var i = 0; i < numCircles; i++) {
    const circlePlot = {
        id: i,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 2,
        color: 'white',
        maxSize: Infinity,
        nearestCollision: null,
    };
    circlePlots.push(circlePlot);
};

const determinant3 = (a, b, c, d, e, f, g, h, i) => 
    a * e * i + 
    b * f * g + 
    c * d * h - 
    c * e * g - 
    b * d * i - 
    a * f * h;

const pointInCicumCircle = (a, b, c, d,) => determinant3(
    a.x - d.x, a.y - d.y, (a.x - d.x)**2 + (a.y - d.y)**2,
    b.x - d.x, b.y - d.y, (b.x - d.x)**2 + (b.y - d.y)**2,
    c.x - d.x, c.y - d.y, (c.x - d.x)**2 + (c.y - d.y)**2,
) > 0;

const normSquared = ({x, y}) => x**2 + y**2;

const sortTriangle = (triangle) => {
    const [a, b, c] = triangle;
    const angleAB = Math.atan2(b.y - a.y, b.x - a.x);
    const angleAC = Math.atan2(c.y - a.y, c.x - a.x);
    if (angleAB > angleAC) return [a, c, b];
    return [a, b, c];
}

const triangulationFunction = (pointList) => {
    const xList = pointList.map(points => points.x);
    const yList = pointList.map(points => points.y);
    const boundingboxmin = {x: Math.min(...xList), y: Math.min(...yList)};
    const boundingboxmax = {x: Math.max(...xList), y: Math.max(...yList)};
    const xSide = boundingboxmax.x - boundingboxmin.x;
    const ySide = boundingboxmax.y - boundingboxmin.y;
    const hypot = Math.hypot(xSide, ySide);
    const semiperim = (xSide + ySide + hypot) / 2;
    const altitudeHypot = 2 * Math.sqrt(semiperim * (semiperim - xSide) * (semiperim - ySide) * (semiperim - hypot)) / hypot;
    const scaleFactor = hypot / altitudeHypot + 0.5;
    const largestSide = Math.max(xSide, ySide);
    const firstPoint = {x: boundingboxmin.x - 0.25 * largestSide, y: boundingboxmin.y - 0.25 * largestSide};
    const secondPoint = {x: firstPoint.x, y: firstPoint.y + scaleFactor * largestSide};
    const thirdPoint = {x: firstPoint.x + scaleFactor * largestSide, y: firstPoint.y};
    const superTriangle = sortTriangle([firstPoint, secondPoint, thirdPoint]);
    let pointID = 0;
    const pointOrdering = new Map();
    for (const point of pointList) pointOrdering.set(point, pointID++);
    for (const point of superTriangle) pointOrdering.set(point, pointID++);
    const reversePointOrder = new Map();
    for (const [reversepoint, reversepointid] of pointOrdering) reversePointOrder.set(reversepointid, reversepoint);
    let triangulation = [superTriangle];
    for (const point of pointList) {
        const badTriangles = new Set();
        for (const triangle of triangulation) {
            if (pointInCicumCircle(triangle[0], triangle[1], triangle[2], point)) {
                badTriangles.add(triangle);
            }
        }

        let polygon = [];
        for (const triangle of badTriangles) {
            for (let i = 0; i < 3; i++) {
                const point1 = pointOrdering.get(triangle[i]);
                const point2 = pointOrdering.get(triangle[(i + 1) % 3]);
                const edge = [Math.min(point1, point2), Math.max(point1, point2)];
                polygon.push(edge);
            }

        }
        polygon = polygon.filter(edge => 
            polygon.filter(edge1 => edge[0] == edge1[0] && edge[1] == edge1[1]).length == 1
        )
        triangulation = triangulation.filter(triangle => !badTriangles.has(triangle))
        for (const edge of polygon) {
            const point1 = reversePointOrder.get(edge[0]);
            const point2 = reversePointOrder.get(edge[1]);
            triangulation.push(sortTriangle([point, point1, point2]));
        }
    }
    const toRemove = new Set();
    for (const triangle of triangulation) {
        const [a, b, c] = triangle;
        if (superTriangle.includes(a) || superTriangle.includes(b) || superTriangle.includes(c)) 
            toRemove.add(triangle)
    }
    return triangulation.filter(triangle => !toRemove.has(triangle))
}
const triangulationToVoroni = (triangulation) => {
    const pointOrdering = new Map();
    let pointID = 0;
    for (const triangle of triangulation)
        for (const point of triangle) pointOrdering.set(point, pointID++);
    const adjacentTriangles = new Map();
    const circles = [];
    for (const triangle of triangulation) {
        const [a, b, c] = triangle;
        const sx = determinant3(normSquared(a), a.y, 1, normSquared(b), b.y, 1, normSquared(c), c.y, 1) / 2;
        const sy = determinant3(a.x, normSquared(a), 1, b.x, normSquared(b), 1, c.x, normSquared(c), 1) / 2;
        const circumcenterDivisor = determinant3(a.x, a.y, 1, b.x, b.y, 1, c.x, c.y, 1);
        const radiusDivisor = determinant3(a.x, a.y, normSquared(a), b.x, b.y, normSquared(b), c.x, c.y, normSquared(c));
        const circumcenter = {x: sx / circumcenterDivisor, y: sy / circumcenterDivisor}; 
        const radius = Math.sqrt(radiusDivisor / circumcenterDivisor + normSquared({x:sx, y:sy}) / circumcenterDivisor**2);
        circles.push({
            x: circumcenter.x,
            y: circumcenter.y,
            maxSize: radius,
            radius: 0,
            color: 'white',
            id: circles.length,
        })
    } 
    return circles;
}
const pointHolder = [];
for (let i = 0; i < numCircles; i++) {
    const triangleCoords = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
    }
    pointHolder.push(triangleCoords);
}
const circlePoints = triangulationFunction(pointHolder);
console.log('hey what are these fuckin circlePoints', circlePoints);
circlePlots = triangulationToVoroni(circlePoints);
const checkCollision = (ball0, ball1) => {
    var dx = ball1.x - ball0.x;
    var dy = ball1.y - ball0.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    // console.log(`comparing ${ball0.id} to ${ball1.id}`, ball0.maxSize, ball1.maxSize);
    const halfDistance = dist / 2;
    if (ball0.maxSize === Infinity) {
        ball0.maxSize = halfDistance;
    }
    if (ball1.maxSize === Infinity) {
        ball1.maxSize = halfDistance;
    }
    if (dist <= (ball0.maxSize + ball1.maxSize)) {
        // if (ball0.maxSize > ball1.maxSize) {
        //     ball0.maxSize = dist - ball1.maxSize;
        // } else {
        //     ball1.maxSize = dist - ball0.maxSize;
        // }
        ball0.maxSize = Math.min(ball0.maxSize, halfDistance);
        ball1.maxSize = Math.min(ball1.maxSize, halfDistance);
        // ball0.radius = ball0.maxSize;
        // ball1.radius = ball1.maxSize;
        ball0.nearestCollision = ball1.id;
        ball1.nearestCollision = ball0.id;
        // console.log('intersection', dist, ball0, ball1);
    }
};

// useful reusable function to compare items in an array
const compareArrayItems = (array, comparisonFunction) => {
    for (let i = 0; i < array.length - 1; i++) {
        const itemA = array[i];
        for (let j = i + 1; j < array.length; j++) {
            const itemB = array[j];
            comparisonFunction(itemA, itemB);
        }
    }
};
// compareArrayItems(circlePlots, checkCollision);
const drawCross = (vertA, size, thickness, color) => {
    context.beginPath();
    context.moveTo(vertA[0] - size, vertA[1] - size);
    context.lineTo(vertA[0] + size, vertA[1] + size);
    context.moveTo(vertA[0] + size, vertA[1] - size);
    context.lineTo(vertA[0] - size, vertA[1] + size);
    context.strokeStyle = color;
    context.lineWidth = thickness;
    context.stroke();
};

const circleGrowthIncrement = 1;
const mixfactor = 0.05;
const loop = () => {
    // let delta = (now - lastTime) / 1000;
    requestAnimationFrame(loop);
    context.save();
    circlePlots.forEach((circlePlot) => {
        if (circlePlot.radius + circleGrowthIncrement < circlePlot.maxSize) {
            circlePlot.radius = circlePlot.maxSize * mixfactor + circlePlot.radius * (1 - mixfactor);
        }
    });
    context.clearRect(0, 0, canvas.width, canvas.height);
    circlePlots.forEach(drawCircle);
    pointHolder.forEach(point => drawCross([point.x, point.y], 5, 2, 'red'));
    context.restore();
};
requestAnimationFrame(loop);

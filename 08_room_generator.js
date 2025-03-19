var canvas = document.getElementById("toy-canvas");
var context = canvas.getContext('2d');
var tau = Math.PI * 2;

var rooms = {
    '0,0': {
        pos: [0, 0],
        connections: [
            [1, 0],
            [0, 1],
        ],
        color: 'green',
    },
    '1,0': {
        pos: [1, 0],
        connections: [
            [0, 0],
        ],
        color: '#666',
    },
    '0,1': {
        pos: [0, 1],
        connections: [
            [0, 0],
        ],
        color: 'red',
    },
}

var settings = {
    energy: 8,
    seed: 'seed',
    viewScale: 50,
    branchesPerRoom: 2,
};

var gui = new lil.GUI();
gui.add(settings, 'energy', 2, 20, 1);
gui.add(settings, 'viewScale', 20, 100, 1);
gui.add(settings, 'branchesPerRoom', 1, 4, 1);
gui.add(settings, 'seed');

var rng = new Math.seedrandom(settings.seed);

var drawCircle = (vert, radius, color) => {
    context.beginPath();
    context.arc(vert[0], vert[1], radius, 0, tau);
    context.fillStyle = color;
    context.fill();
};
var drawLine = (a, b, color, lineWidth = 1) => {
    context.beginPath();
    context.moveTo(a[0], a[1]);
    context.lineTo(b[0], b[1]);
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.stroke();
};


var getRandomInt = function(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(rng() * (maxFloored - minCeiled + 1) + minCeiled); 
    // The maximum is inclusive and the minimum is inclusive
};

var cardinals = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
];

var isRoomAtPosition = function(pos) {
    var key = pos.join(',');
    return !! rooms[key]
};

var getAbsoluteCoordinateByIndex = function(pos, index) {
    var cardinal = cardinals[index];
    return [
        pos[0] + cardinal[0],
        pos[1] + cardinal[1],
    ];
};
var makeRoom = function(pos) {
    var room = {
        pos,
        connections: [],
        color: '#666',
    };
    var key = pos.join(',');
    rooms[key] = room;
    return room;
};
var roomValuesGenerator = function(energy) {
    rooms = {};
    var currentRoom = makeRoom([0, 0]);
    currentRoom.color = 'green';
    for (let i = 0; i < energy; i++) {
        var numConnections = getRandomInt(1, settings.branchesPerRoom);
        var newRoom;
        while (currentRoom.connections.length < numConnections) {
            var newCoordinate = getAbsoluteCoordinateByIndex(currentRoom.pos, getRandomInt(0,3));
            if (!isRoomAtPosition(newCoordinate)){
                currentRoom.connections.push(newCoordinate); 
                newRoom = makeRoom(newCoordinate);
                newRoom.connections.push(currentRoom.pos);
            };                
        };
        currentRoom = newRoom;
    };
    currentRoom.color = 'red';
};
var renderRooms = function() {
    context.fillStyle = `#000`
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);    
    context.scale(settings.viewScale, settings.viewScale);
    Object.values(rooms).forEach((room) => {
        room.connections.forEach((connection) => {
            drawLine(room.pos, connection, '#aaa', 0.125);
        });
    })
    Object.values(rooms).forEach((room) => {
        drawCircle(room.pos, 0.45, room.color);
        context.font = '0.25px monospace';
        context.textAlign = 'center';
        context.fillStyle = '#fff';
        context.fillText(
            room.pos.join(','),
            room.pos[0],
            room.pos[1] + 0.15,
        );
    })
    context.restore();
};

var updateMap = function(){
    rng = new Math.seedrandom(settings.seed);
    roomValuesGenerator(settings.energy);
    renderRooms();
};
gui.onChange(updateMap);
updateMap();
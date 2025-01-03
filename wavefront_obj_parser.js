var loadObjPath = async function (path) {
    var response = await fetch(path);
    // console.log('what is response?', response);
    var text = await response.text();
    // console.log('what is text?', text);
    return parseObjText(text);
};

var parseObjText = function(text) {
    // Done: o instruction should start a new object
    // Done: v instruction should create a new vertex and track its index
    // TODO: l instruction should add a new line with corrected vertex indeces
    // Done: Return an object map of named objects

    var result = {};
    var badNewLineRegex = /\r/g;
    var allWhitespaceRegex = /\s+/g;
    var lines = text.trim().replace(badNewLineRegex, '').split('\n');
    // console.log('what is lines?', lines);
    var currentObject;
    var vertexOffset = 1;
    lines.forEach(function (line){
        var split = line.trim().split(allWhitespaceRegex);
        //console.log('what is split', split)
        var instruction = split.shift();
        if (instruction === 'o') {
            var name = split.shift();
            currentObject = {
                name,
                vertexOffset,
                points:[],
                lines:[],
            };
            result[name] = currentObject;
        } else if (instruction === 'v') {
            var x = split.shift() * 1;
            var y = split.shift() * 1;
            var z = split.shift() * 1;
            var point = [x, y, z];
            currentObject.points.push(point);
            vertexOffset += 1;
        } else if (instruction === 'l') {
            var a = (split.shift() * 1) - currentObject.vertexOffset;
            var b = (split.shift() * 1) - currentObject.vertexOffset;
            var line = [a, b];
            currentObject.lines.push(line);
        } else {
            console.warn('unkown instruction!', instruction);
        }

    })
    console.log('what is parsed obj', result);
    return result;
}
var appleCount = 5;
var gigawatts = 1.21;
var hexValue = 0xff;
var binaryValue = 0b0101;
var booleanValue = false;
var trueValue = true;
var empty;
var lessEmpty = null;
var goatName = 'Gruff';
var goatNameWithTitle = "Gruff \"The Destroyer\"";
var goatTag = '<div class="goat">Gruff The Destroyer</div>';
var concatenatedString = (
    goatNameWithTitle 
    + ' ate ' 
    + appleCount 
    + ' apples today.'
);
//console.log should NEVER be used with just one argument it 
//should always be given a string message that tells you what 
//you're about to log and the second argument is the value you want to see
console.log('what is concatenatedString?', concatenatedString);

appleCount = appleCount + 2; //result should now be 7
appleCount += 7; //result should now be 14
appleCount *= 3; //result should now be 42
appleCount /= 2; //result should be 21
appleCount **= 2; //result should be 441, this is the power operator.
/*
The operand b for Modulo is what is divided and 
the remainder is the result
*/
appleCount %= 100; 
console.log(
    'did concatenatedString change after changing appleCount?',
    concatenatedString
);
//rebake those apples rebake that pie
concatenatedString = (
    goatNameWithTitle 
    + ' ate ' 
    + appleCount 
    + ' apples today.'
);
console.log(
    'What is concatenatedString after being redefined?',
    concatenatedString
);
var buyClickerButton = document.getElementById('buy-clicker');
var addOneAppleButton = document.getElementById('add-apples');
var buyPlaceholderButton = document.getElementById('buy-placeholder');
var applesOutput = document.getElementById('apples-output');
var clickersOutput = document.getElementById('clickers-output');
var clickerCount = 0;
var placeholderOutput = document.getElementById('placeholder-output');
var placeholderCount = 0;
var placeholderProduction = 0;
var add = function(a, b) {
    return a + b;
};
var divide = function(a, b) {
    return a / b;
};

console.log('add(6, 9)', add(6, 9));
console.log('add(7, 19)', add(7, 19));
console.log('add(19, 7)', add(19, 7));
console.log('divide(4, 20)', divide(4, 20));
console.log('divide(20, 4)', divide(20, 4));
console.log('add(divide(4000, 10), divide(100, 5))', add(divide(4000, 10), divide(100, 5)));

var updateAppleText = function () {
    applesOutput.innerText = appleCount + ' apples';
};
updateAppleText();
var addOneApple = function() {
    appleCount += 1;
    updateAppleText();
};
addOneAppleButton.addEventListener('pointerdown', addOneApple);

var clickerCost = 25;
var buyClicker = function() {
    if (appleCount >= clickerCost){
        appleCount -= clickerCost;
        clickerCost = Math.floor(1.25*clickerCost);
        buyClickerButton.innerText = `buy 1 clicker for ${clickerCost} apples`;
        clickerCount += 1;
        clickersOutput.innerText = `${clickerCount} clickers`;
        updateAppleText();
    }

};
buyClickerButton.addEventListener('click', buyClicker);

//we're defining a function that will be run by our interval
var evaluateClickers = function() {
    appleCount += clickerCount;
    updateAppleText();
};
//setInterval will run a function repeatedly at the given interval
setInterval(evaluateClickers, 1000);

var placeHolderCost = 3;
var buyPlaceholder = function() {
    if (appleCount >= placeHolderCost){
        appleCount -= placeHolderCost;
        placeHolderCost = Math.floor(1.52*placeHolderCost);
        buyPlaceholderButton.innerText = `buy 1 placeholder for ${placeHolderCost} apples`;
        placeholderCount += 1;
        placeholderProduction += 80;
        placeholderOutput.innerText = `${placeholderCount} Placeholders`;
        updateAppleText();
    }

};
buyPlaceholderButton.addEventListener('click', buyPlaceholder);

//we're defining a function that will be run by our interval
var evaluatePlaceholders = function() {
    appleCount += placeholderProduction;
    updateAppleText();
};
//setInterval will run a function repeatedly at the given interval
setInterval(evaluatePlaceholders, 1000);
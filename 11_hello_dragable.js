var titlebar = document.querySelector(".dragable-window.goat .title-bar");
var dragableWindow = document.querySelector(".dragable-window.goat");

var isMouseDown = false;
var layerX = 0;
var layerY = 0;

var handleTitlebarClick = (clickEvent) => {
    clickEvent.preventDefault();
    var parentRect = dragableWindow.getBoundingClientRect()
    var titleRect = titlebar.getBoundingClientRect()
    console.log('what is parentRect', parentRect);
    console.log('what is titleRect', titleRect);
    console.log('what is click event', clickEvent);
    isMouseDown = true;
    layerY = (titleRect.top - parentRect.top) + clickEvent.layerY;
    layerX = (titleRect.left - parentRect.left) + clickEvent.layerX;
};
titlebar.addEventListener('mousedown', handleTitlebarClick);

var handleMouseMove = (moveEvent) => {
    if(isMouseDown) {    
        console.log('what is moveEvent', moveEvent);
        dragableWindow.style.left = Math.round(moveEvent.clientX - layerX) + 'px';
        dragableWindow.style.top = Math.round(moveEvent.clientY - layerY) + 'px';
    }
};
document.body.addEventListener('mousemove', handleMouseMove);

var handleMouseRelease = (releaseEvent) => {
    console.log('what is releaseEvent', releaseEvent);
    isMouseDown = false;
};
document.body.addEventListener('mouseup', handleMouseRelease);

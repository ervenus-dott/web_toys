var dragableWindow;

var isMouseDown = false;
var layerX = 0;
var layerY = 0;

var handleTitlebarClick = (clickEvent) => {
    console.log('what is click event', clickEvent);
    var titlebar = clickEvent.target.closest(".title-bar");
    dragableWindow = clickEvent.target.closest(".dragable-window");
    if (!titlebar || !dragableWindow) {return;}
    clickEvent.preventDefault();
    var parentRect = dragableWindow.getBoundingClientRect()
    var titleRect = titlebar.getBoundingClientRect()
    console.log('what is parentRect', parentRect);
    console.log('what is titleRect', titleRect);
    isMouseDown = true;
    layerY = (titleRect.top - parentRect.top) + clickEvent.layerY;
    layerX = (titleRect.left - parentRect.left) + clickEvent.layerX;
};
document.body.addEventListener('mousedown', handleTitlebarClick);

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

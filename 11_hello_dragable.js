var imageMap = {
    capybara: 'https://blog.nature.org/wp-content/uploads/2020/02/29555193323_15d785590f_k.jpg?w=1024', 
    cat: 'https://i.guim.co.uk/img/media/327aa3f0c3b8e40ab03b4ae80319064e401c6fbc/377_133_3542_2834/master/3542.jpg?width=465&dpr=1&s=none&crop=none',
    goat: 'https://assets.farmsanctuary.org/content/uploads/2020/05/27054636/2018_10-23_FSNY_Racecar_goat_DSC_5147_Credit_Farm-Sanctuary-1600x1068.jpg',
};
var renderWindowContent = (type) => {
    var x = Math.random() * window.innerWidth;
    var y = Math.random() * window.innerHeight;
    return /* html */ `
    <div class="dragable-window ${type}" style="top: ${y}px; left: ${x}px;">
        <div class="title-bar">
            <span>${type} Window</span>
            <button class="close">x</button>
        </div>
        <div class="window-content" style="width: 200px; height: 100px;">
            <img src="${imageMap[type]}" alt="${type}">
        </div>
    </div>
    `;
};

document.body.addEventListener('click', (clickEvent) => {
    // console.log('what is click event', clickEvent);
    console.log('what is dataset', clickEvent.target.dataset);
    var windowType = clickEvent.target.dataset.windowType;
    if (!windowType) {return;}
    document.body.innerHTML += renderWindowContent(windowType);
})

var dragableWindow;

var isMouseDown = false;
var layerX = 0;
var layerY = 0;

var closeButton = document.getElementById("close")
// TODO: Make x close the window
closeButton.addEventListener('click', (clickEvent) => {       
    dragableWindow.outerText = ""
})

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

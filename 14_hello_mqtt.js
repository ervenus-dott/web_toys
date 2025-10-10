const downloadLink = document.getElementById("download-link");
const canvas = document.getElementById("color-web");
const context = canvas.getContext("2d");
const canvasPreVis = document.getElementById("pre-vis");
const contextPreVis = canvasPreVis.getContext("2d");
const tau = Math.PI * 2;

let width = 0;
let height = 0;
let cx = 0;
let cy = 0;
let circleVert = [0, 0];
let mouseVert = [0, 0];
let isDrawing = false;
let isTouchDown = false;

function dlCanvas() {
  const base64ImageURL = canvas.toDataURL("image/png");
  downloadLink.href = base64ImageURL;
}
downloadLink.addEventListener("click", dlCanvas, false);

const settings = {
  bilateralSymmetry: true,
  glow: true,
  radialSymmetry: 6,
  brushSize: 10,
  currentColor: "#ff9922",
  opacity: 0.3,
};
var gui = new lil.GUI();

gui.add(settings, "bilateralSymmetry").listen();
gui.add(settings, "glow").listen();
gui.add(settings, "radialSymmetry", 1, 10, 1).listen();
gui.add(settings, "brushSize", 3, 25).listen();
gui.addColor(settings, "currentColor").listen();
gui.add(settings, "opacity", 0, 1).listen();
// const handleColorChange = () => {
//   sendSettingsMessage(settings.currentColor, settings.opacity);
// };
// colorController.onFinishChange(handleColorChange);
// opacityController.onFinishChange(handleColorChange);

const resize = function () {
  const rect = canvas.getBoundingClientRect();
  if (width !== rect.width || height !== rect.height) {
    width = rect.width;
    height = rect.height;
    cx = width / 2;
    cy = height / 2;
    circleVert[0] = cx;
    circleVert[1] = cy;
    canvas.width = width;
    canvas.height = height;
    canvasPreVis.width = width;
    canvasPreVis.height = height;
  }
};
resize();
// important resize loop making sure that we have up to date height and width info

var drawCircle = (vert, radius, color, context) => {
  context.beginPath();
  context.arc(vert[0], vert[1], radius, 0, tau);
  context.fillStyle = color;
  context.fill();
};
const drawMirrored = function (context, drawCallback) {
  context.save();
  drawCallback();
  if (settings.bilateralSymmetry) {
    context.scale(-1, +1);
    drawCallback();
  }
  context.restore();
};
const drawRadial = function (context, drawCallback) {
  const n = settings.radialSymmetry || 1;
  const radialSegment = tau / n;
  for (let i = 0; i < n; i += 1) {
    context.save();
    context.rotate(radialSegment * i);
    drawMirrored(context, drawCallback);
    context.restore();
  }
};

const renderLoop = function (time) {
  requestAnimationFrame(renderLoop);
  resize();
  contextPreVis.clearRect(0, 0, width, height);
  context.save();
  contextPreVis.save();
  context.translate(cx, cy);
  contextPreVis.translate(cx, cy);
  if (settings.glow) context.globalCompositeOperation = "screen";
  const combinedColor = settings.currentColor +
    Math.round(settings.opacity * 255).toString(16).padStart(2, "0");
  // console.log('what is combined color', combinedColor);
  if (isDrawing) {
    drawRadial(context, () => {
      drawCircle(mouseVert, settings.brushSize, combinedColor, context);
    });
  }
  drawRadial(contextPreVis, () => {
    drawCircle(mouseVert, settings.brushSize, combinedColor, contextPreVis);
  });
  context.restore();
  contextPreVis.restore();
};
requestAnimationFrame(renderLoop);
var handleMouseMoveEvent = (event) => {
  // should prevent touch scrolling on mobile devices so we can read touch position while the user drags
  event.preventDefault();
  // clientX and clientY maybe empty if this is a touch event
  var x = event.clientX;
  var y = event.clientY;
  // search for the touch data and use that if we've got it
  if (event.touches) {
    var touch = event.touches[0];
    if (touch) {
      x = touch.clientX;
      y = touch.clientY;
    }
  }
  mouseVert[0] = x - cx;
  mouseVert[1] = y - cy;
  sendMouseMoveMessage(mouseVert[0], mouseVert[1]);
};
canvas.addEventListener("mousemove", handleMouseMoveEvent);
canvas.addEventListener("touchmove", handleMouseMoveEvent);
canvas.addEventListener("mousedown", (mouseEvent) => {
  isDrawing = true;
  sendMouseMouseDownMessage(isDrawing);
});
canvas.addEventListener("mouseup", (mouseEvent) => {
  isDrawing = false;
  sendMouseMouseDownMessage(isDrawing);
});
canvas.addEventListener("touchstart", (mouseEvent) => {
  isDrawing = true;
  sendMouseMouseDownMessage(isDrawing);
});
canvas.addEventListener("touchstop", (mouseEvent) => {
  isDrawing = false;
  sendMouseMouseDownMessage(isDrawing);
});

const client = mqtt.connect("wss://mqtt-dashboard.com:8884/mqtt");
const clientID = Math.floor(Math.random() * 1e18).toString(36).slice(2, 7);
const topicPrefix = "ercillias_drawing_toy/";
client.on("connect", () => {
    console.log("mqtt connected");
    client.subscribe(`${topicPrefix}#`, (err) => {
        if (err) {
            console.log("error subscribing to topic", err);
        }
        client.publish(`${topicPrefix}hello`, JSON.stringify({clientID}));
    });
});
client.on("disconnect", () => {
    console.log("mqtt disconnected");
});
client.on("error", (error) => {
    console.log("mqtt error", error);
});
client.on("message", (topic, message) => {
    // message is Buffer
    const messageString = message.toString();
    console.log("mqtt message recieved", topic, messageString);
    const json = JSON.parse(messageString);
    if (json.clientID === clientID) {
        return;
        // ignore messages that we send
    } else if (topic === `${topicPrefix}move`) {
        mouseVert[0] = json.x;
        mouseVert[1] = json.y;
    } else if (topic === `${topicPrefix}down`) {
        isDrawing = json.isDown;
    } else if (topic === `${topicPrefix}settings`) {
        Object.assign(settings, json);
        // colorController.setValue(json.color);
        // opacityController.setValue(json.opacity);
    }

});

const sendMouseMoveMessage = (x, y) => {
  client.publish(`${topicPrefix}move`, JSON.stringify({ clientID, x, y }));
};
const sendMouseMouseDownMessage = (isDown) => {
  client.publish(`${topicPrefix}down`, JSON.stringify({ clientID, isDown }));
};
const sendSettingsMessage = () => {
  client.publish(`${topicPrefix}settings`, JSON.stringify({ clientID, ...settings }));
};
gui.onFinishChange(sendSettingsMessage);
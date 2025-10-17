const connectStatus = document.getElementById("connect-status");
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
let isTouchDown = false;
let userMap = {};
let eventList = [];

function dlCanvas() {
  const base64ImageURL = canvas.toDataURL("image/png");
  downloadLink.href = base64ImageURL;
}
downloadLink.addEventListener("click", dlCanvas, false);

const clearCanvas = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    eventList.length = 0;
};
const clearAndSendMessage = () => {
    clearCanvas()
    sendClearMessage()
};
const settings = {
  bilateralSymmetry: true,
  glow: true,
  radialSymmetry: 6,
  brushSize: 10,
  currentColor: "#ff9922",
  opacity: 0.1,
  clearCanvas: clearAndSendMessage,
};
var gui = new lil.GUI();


gui.add(settings, "bilateralSymmetry").listen();
gui.add(settings, "glow").listen();
gui.add(settings, "radialSymmetry", 1, 10, 1).listen();
gui.add(settings, "brushSize", 3, 25).listen();
gui.addColor(settings, "currentColor").listen();
gui.add(settings, "opacity", 0, 1).listen();
gui.add(settings, "clearCanvas").listen();
let globalScale = 1;
let framesAtThisSize = 0;
const resize = function () {
  const rect = canvas.getBoundingClientRect();
  if (width !== rect.width || height !== rect.height) {
    width = rect.width;
    height = rect.height;
    cx = width / 2;
    cy = height / 2;
    globalScale = 1 / Math.min(cx, cy);
    canvas.width = width;
    canvas.height = height;
    canvasPreVis.width = width;
    canvasPreVis.height = height;
    framesAtThisSize = 0;
    return;
  }
  framesAtThisSize += 1;
  if (framesAtThisSize === 20) {
    playBackEventList();
  }
};
// important resize loop making sure that we have up to date height and width info

var drawCircle = (vert, radius, color, context) => {
  context.beginPath();
  context.arc(vert[0], vert[1], radius, 0, tau);
  context.fillStyle = color;
  context.fill();
};
const drawMirrored = function (context, drawCallback, settings) {
  context.save();
  drawCallback();
  if (settings.bilateralSymmetry) {
    context.scale(-1, +1);
    drawCallback();
  }
  context.restore();
};
const drawRadial = function (context, drawCallback, settings) {
  const n = settings.radialSymmetry || 1;
  const radialSegment = tau / n;
  for (let i = 0; i < n; i += 1) {
    context.save();
    context.rotate(radialSegment * i);
    drawMirrored(context, drawCallback, settings);
    context.restore();
  }
};
const drawFromSettings = function(settings) {
  context.save();
  if (settings.glow) {
    context.globalCompositeOperation = "screen";
  } 
  const combinedColor = settings.currentColor +
    Math.round(settings.opacity * 255).toString(16).padStart(2, "0");
  // console.log('what is combined color', combinedColor);
  const mouseVert = [
    settings.x,
    settings.y,
  ];
  if (settings.isDown) {
    drawRadial(context, () => {
      drawCircle(mouseVert, settings.brushSize / 100, combinedColor, context);
    }, settings);
  }
  drawRadial(contextPreVis, () => {
    drawCircle(mouseVert, settings.brushSize / 100, combinedColor, contextPreVis);
  }, settings);
  context.restore();
}

const renderLoop = function (time) {
  requestAnimationFrame(renderLoop);
  resize();
  drawCurrentState(true)
};

const drawCurrentState = (drawOverlay) => {
  const scale = 1 / globalScale;
  if (drawOverlay) {  
    contextPreVis.clearRect(0, 0, width, height);
    contextPreVis.save();
    contextPreVis.translate(cx, cy);
    contextPreVis.scale(scale, scale);
    contextPreVis.restore();
    return;
  }
  context.save();
  // context.fillStyle = '#0001';
  // context.fillRect(0, 0, width, height);
  context.translate(cx, cy);
  context.scale(scale, scale);
  drawFromSettings(settings);
  Object.values(userMap).forEach(drawFromSettings)
  context.restore();
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
    var rect = event.target.getBoundingClientRect();
    var difference = {
        x: x - rect.x,
        y: y - rect.y,
    };
    difference.x -= width / 2;
    difference.y -= height / 2;
    // console.log('what is difference', difference);
    settings.x = difference.x * globalScale;
    settings.y = difference.y * globalScale;
    if (settings.isDown) {
      drawCurrentState();
    }
  sendMouseMoveMessage(settings.x, settings.y);
};
const handleOn = (mouseEvent) => {
  settings.isDown = true;
  sendMouseDownMessage(settings.isDown);
}
const handleOff = (mouseEvent) => {
  settings.isDown = false;
  sendMouseDownMessage(settings.isDown);
}
canvas.addEventListener("mousemove", handleMouseMoveEvent);
canvas.addEventListener("touchmove", handleMouseMoveEvent);
canvas.addEventListener("mousedown", handleOn);
canvas.addEventListener("touchstart", handleOn);
canvas.addEventListener("mouseup", handleOff);
canvas.addEventListener("mouseleave", handleOff);
canvas.addEventListener("touchstop", handleOff);

const client = mqtt.connect("wss://mqtt-dashboard.com:8884/mqtt");
const sendAndLog = (topic, message, options) => {
    const json = { clientID, ...message };
    eventList.push([topic, json]);
    client.publish(topic, JSON.stringify(json), options);
}; 
const playBackEventList = () => {
  eventList.forEach(([topic, event]) => {
    processEvent(topic, event);
    drawCurrentState();
  });
};
let connectedDrawUpdateState = false;
const clientID = Math.floor(Math.random() * 1e18).toString(36).slice(2, 7);
const topicPrefix = 'ercillias_drawing_toy';
const globalTopicPrefix = `${topicPrefix}/`;
const privateTopicPrefix = `${topicPrefix}-${clientID}/`;
client.on("connect", () => {
  connectStatus.innerText = "connected!";
  console.log("mqtt connected");
  client.subscribe([`${globalTopicPrefix}#`, `${privateTopicPrefix}#`], (err) => {
    if (err) {
      console.log("error subscribing to topic", err);
    }
    sendHelloMessage();
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
    // console.log("mqtt message recieved", topic, messageString);
    const json = JSON.parse(messageString);
    if (json.clientID === clientID) {
        return;
        // ignore messages that we send
    }
    eventList.push([topic, json]);
    processEvent(topic, json);
    drawCurrentState();
});
const processEvent = (topic, json) => {
    if (topic === `${globalTopicPrefix}move`) {
      const userSettings = userMap[json.clientID];
      if (userSettings) {
        userSettings.x = json.x;
        userSettings.y = json.y;
      }
    } else if (topic === `${globalTopicPrefix}down`) {
        const userSettings = userMap[json.clientID];
        if (userSettings) {
          userSettings.isDown = json.isDown;
        }
    } else if (topic === `${globalTopicPrefix}clear`) {
        clearCanvas();
    } 
    else if (topic.endsWith('eventList')) {
      if(!connectedDrawUpdateState){
        connectedDrawUpdateState = true;
        // let tempEventList = eventList;
        eventList = [...json.eventList, ...eventList];
        // console.log('what is mutated eventList', eventList);
        playBackEventList();
        // eventList = tempEventList;
      }
      // console.log('not needed');
      return
    }
     else if (topic === `${globalTopicPrefix}hello`) {
        userMap[json.clientID] = json;
        sendPrivateSettingsMessage(json.clientID);
        sendEventListMessage(json.clientID, eventList);
    } else if (topic.endsWith('settings')) {
        // console.log('settings recieved from:', topic);
        userMap[json.clientID] = json;
        // colorController.setValue(json.color);
        // opacityController.setValue(json.opacity);
    }
};


const sendMouseMoveMessage = (x, y) => {
  sendAndLog(`${globalTopicPrefix}move`, { x, y } );
};
const sendHelloMessage = () => {
  sendAndLog(`${globalTopicPrefix}hello`, settings, {qos: 2});
};
const sendMouseDownMessage = (isDown) => {
  sendAndLog(`${globalTopicPrefix}down`, { isDown }, {qos: 2});
};
const sendClearMessage = () => {
  sendAndLog(`${globalTopicPrefix}clear`, { });
};
const sendEventListMessage = (specificClientID, eventList) => {
  const topic = `${topicPrefix}-${specificClientID}/eventList`;
  client.publish(topic, JSON.stringify({eventList}), {qos: 2});
  // console.log('what is the sending eventList', eventList);
};
const sendPrivateSettingsMessage = (specificClientID) => {
  const topic = `${topicPrefix}-${specificClientID}/settings`;
  sendAndLog(topic, settings, {qos: 2});
  console.log('what is the json settings object', JSON.stringify({ clientID, ...settings }));
};
const sendSettingsMessage = () => {
  const topic = `${globalTopicPrefix}settings`;
  sendAndLog(topic, settings, {qos: 2});
  console.log('what is the json settings object', JSON.stringify({ clientID, ...settings }));
};
gui.onFinishChange(() => {
  sendSettingsMessage()
});

resize();

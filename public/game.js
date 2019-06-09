const config = {
  credential: {
    serviceId: "simpleapp",
    key: "27f8ca5ee273153d9a9c5944c766fa097d2e16de4dda425a"
  },
  sdk: {
    logLevel: "VERBOSE",
    country: "KR"
    // mode: "dev"
    // audioType: 'music'
  },
  view: {
    local: "localVideo",
    remote: "remoteVideo"
  }
};
const configForCam = {
  credential: {
    serviceId: "simpleapp",
    key: "27f8ca5ee273153d9a9c5944c766fa097d2e16de4dda425a"
  },
  sdk: {
    logLevel: "VERBOSE",
    country: "KR"
    // mode: "dev"
    // audioType: 'music'
  },
  view: {
    local: "localVideo",
    remote: "remoteCam"
  },
  media: {
    video: {
      width: 320,
      height: 240,
      bitrate: 400
    },
    audio: false
  }
};
const roomId = window.location.href.split("?").pop();

const msgbox = document.querySelector("#messagebox");
const frameInfo = document.querySelector("#frameInfoDiv");
const live = new ELive(config);
const liveCam = new ELive(configForCam);

let isCaptureScreen = false;
let isCast = false;
let health;

if (roomId.startsWith("room_")) {
  console.log("try watch " + roomId);
  isCast = false;
  document.querySelector("#localVideoDiv").style.display = "none";
  document.querySelector("#localVideoDiv").style.visibility = "hidden";
  live.watch(roomId);
  liveCam.watch(roomId + "_cam");
}
live.on("onDisplayUserMedia", stream => {
  console.log("success to get stream from user media");
});
live.on("init", () => {
  console.log("init is called to the app");
});

live.on("onComplete", msg => {
  console.log("oncomplete is called");
  // msgbox.innerHTML = "Talk and fun time~";
  document.querySelector("#roomid").disabled = false;
  document.querySelector("#close").disabled = false;
  document.querySelector("#captureScreen").disabled = false;
});
live.on("onStat", msg => {
  health = msg;
  let info = "";
  if (isCast) {
    info += "frameRate: " + health.localFrameRate + "<br>";
    info += "Width: " + health.localVideoWidth + "<br>";
    info += "Height: " + health.localVideoHeight + "<br>";
    info += `BPS: ${health.sentBPS}<br>`;
  } else {
    info += `frameRate: ${health.remoteFrameRate}<br>Width: ${
      health.remoteVideoWidth
    }<br>`;
    info += `Height: ${health.remoteVideoHeight}<br>`;
    info += `BPS: ${health.receivedBPS}<br>`;
  }
  frameInfo.innerHTML = info;
  console.log(health);
  console.log(live.ctx.currentStat);
  console.log(health.sentBPS + " ");
});
liveCam.on("onComplete", msg => {
  if (isCast) return;
});
liveCam.on("onStat", msg => {
  // console.log(msg);
});

document.querySelector("#captureScreen").addEventListener("click", evt => {
  if (isCaptureScreen) {
    live.stopCaptureScreen();
  } else {
    live.captureScreen();
  }
  evt.preventDefault();
});
document.querySelector("#cast").addEventListener("click", evt => {
  isCast = true;
  let roomid = document.querySelector("#roomid").value || "demo";
  roomid = "room_" + roomid;
  live.cast(roomid);
  liveCam.cast(roomid + "_cam");
  msgbox.innerHTML = `Talk with friend with this <a href='${
    window.location.href
  }?${roomid}' target='__new'>link</a>`;
  document.querySelector("#remoteVideoDiv").style.display = "none";
  document.querySelector("#remoteVideoDiv").style.visibility = "hidden";
  document.querySelector("#remoteVideo").style.display = "none";
  document.querySelector("#remoteVideo").style.visibility = "hidden";
  evt.preventDefault();
});
document.querySelector("#close").addEventListener("click", evt => {
  live.close();
  liveCam.close();
  document.querySelector("#roomid").disabled = true;
  //document.querySelector("#switchCamera").disabled = true;
  document.querySelector("#close").disabled = true;
  document.querySelector("#captureScreen").disabled = true;
  evt.preventDefault();
});

const videoWrapper = document.getElementById('video-wrapper');
const videoSelectBtn = document.getElementById('select-btn');
const videoCloseBtn = document.getElementById('close-btn');
const videoElement = document.getElementById('video');
const pipModule = document.getElementById('pip-module');
const pipToggleButton = document.getElementById('pip-toggle-btn').querySelector('input');

let mediaStream;

const selectMediaStream = async (videoElement) => {
  try {
    let clearPreStream;
    if (mediaStream) {
      preStreamArr = mediaStream.getVideoTracks();
      clearPreStream = generateClearPreStream(preStreamArr);
    }
    mediaStream = await navigator.mediaDevices.getDisplayMedia();
    clearPreStream && clearPreStream();
    videoElement.srcObject = mediaStream;
    videoElement.onloadedmetadata = () => {
      videoElement.play();
    };
    return true;
  } catch (error) {
    console.log('error to get media stream', error);
  }
};

const generateClearPreStream = (preStreamArr) => {
  return () => preStreamArr[0].stop();
};

const stopMediaStreamOn = () => {
  const mediaStreamTrack = mediaStream.getVideoTracks();
  mediaStreamTrack && mediaStreamTrack[0].stop();
  hideVideoAndControl();
};

const showVideoAndControl = () => {
  videoWrapper.style.display = 'block';
  pipModule.style.display = 'flex';
  videoCloseBtn.style.display = 'block';
};

const hideVideoAndControl = () => {
  videoWrapper.style.display = 'none';
  pipModule.style.display = 'none';
  videoCloseBtn.style.display = 'none';
};

const turnOnPip = () => {
  pipToggleButton.checked = true;
  videoElement.hidden = true;
};
const turnOffPip = () => {
  pipToggleButton.checked = false;
  videoElement.hidden = false;
};

pipToggleButton.addEventListener('change', async (event) => {
  try {
    if (document.pictureInPictureElement) {
      console.log('exit pip');
      await document.exitPictureInPicture();
    } else {
      console.log('start pip');
      await videoElement.requestPictureInPicture();
    }
  } catch (error) {
    console.log('enter/exit pip mode error', error);
  }
});

videoSelectBtn.addEventListener('click', async () => {
  const selected = await selectMediaStream(videoElement);
  if (selected) {
    showVideoAndControl();
  }
});

videoCloseBtn.addEventListener('click', async () => {
  if (document.pictureInPictureElement) {
    await document.exitPictureInPicture();
  }
  stopMediaStreamOn();
});

videoElement.addEventListener('enterpictureinpicture', function (event) {
  console.log('> Video entered Picture-in-Picture');
  turnOnPip();
});

videoElement.addEventListener('leavepictureinpicture', function (event) {
  console.log('> Video left Picture-in-Picture');
  turnOffPip();
});

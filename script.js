const videoWrapper = document.getElementById('video-wrapper');
const videoSelectBtn = document.getElementById('select-btn');
const videoCloseBtn = document.getElementById('close-btn');
const videoElement = document.getElementById('video');
const pipModule = document.getElementById('pip-module');
const pipToggleState = document.getElementById('pip-toggle-btn').querySelector('input');
// const toggleState = togglePipButton.getElementsByTagName('input');
let mediaStream;
videoSelectBtn.addEventListener('click', async () => {
  const selected = await selectMediaStream(videoElement);
  if (selected) {
    videoCloseBtn.style.display = 'block';
  }
});
videoCloseBtn.addEventListener('click', async () => {
  const mediaStreamTrack = mediaStream.getVideoTracks();
  mediaStreamTrack[0].stop();
  if (document.pictureInPictureElement) {
    await document.exitPictureInPicture();
  }
  mediaStream = null;
  videoWrapper.style.display = 'none';
  pipModule.style.display = 'none';
  videoCloseBtn.style.display = 'none';
});
console.log(pipToggleState);

pipToggleState.addEventListener('change', async (event) => {
  // If there is no element in Picture-in-Picture yet, let’s request
  // Picture-in-Picture for the video, otherwise leave it.
  try {
    if (document.pictureInPictureElement) {
      console.log('exit pip');
      await document.exitPictureInPicture();
      pipToggleState.checked = false;
      videoElement.hidden = false;
    } else {
      console.log('pip');
      await videoElement.requestPictureInPicture();
      pipToggleState.checked = true;

      // pipToggleState.setAttribute('checked', true);

      videoElement.hidden = true;
    }
  } catch (err) {
    // Video failed to enter/leave Picture-in-Picture mode.
  }
});

const turnOffPipToggleButton = () => {
  console.log(pipToggleState.value);
  pipToggleState.checked = false;
};

const selectMediaStream = async (videoElement) => {
  try {
    mediaStream = await navigator.mediaDevices.getDisplayMedia();

    videoElement.srcObject = mediaStream;
    videoElement.onloadedmetadata = () => {
      videoElement.play();
    };
    videoWrapper.style.display = 'block';
    pipModule.style.display = 'flex';
    return true;
  } catch (error) {
    console.log('error to get media stream', error);
  }
};

videoElement.addEventListener('enterpictureinpicture', function (event) {
  console.log('> Video entered Picture-in-Picture');

  pipWindow = event.pictureInPictureWindow;
  console.log(`> Window size is ${pipWindow.width}x${pipWindow.height}`);

  pipWindow.addEventListener('resize', onPipWindowResize);
});

videoElement.addEventListener('leavepictureinpicture', function (event) {
  console.log(event);
  console.log('> Video left Picture-in-Picture');

  turnOffPipToggleButton();
  // pip 만종료한 경우
  videoElement.hidden = false;

  // 완전히 종료한경우
  console.log(mediaStream);
  // videoWrapper.style.display = 'none';

  pipWindow.removeEventListener('resize', onPipWindowResize);
});

function onPipWindowResize(event) {
  console.log(`> Window size changed to ${pipWindow.width}x${pipWindow.height}`);
}

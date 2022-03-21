const video = document.querySelector("video")
const videoController = document.getElementById("videoController")
const playBtn = document.getElementById("play")
const playBtnIcon = playBtn.querySelector("i")
const muteBtn = document.getElementById("mute")
const muteIcon = muteBtn.querySelector("i")
const totalTime = document.getElementById("totalTime")
const currentTime = document.getElementById("currentTime")
const volumeRange = document.getElementById("volume")
const timeline = document.getElementById("timeline")
const fullScreenBtn = document.getElementById("fullScreen")
const fullScreenIcon = fullScreenBtn.querySelector("i")
const videoContainer = document.getElementById("videoContainer")
const videoplayer = document.getElementById("videoplayer")
const videoControls = document.querySelector("videoControls")


let controlsTimeout = null
let constrolsMovementTimeout = null
let volumeValue = 0.03
video.volume = volumeValue

const handlePlayClick = (e) => {
  if (video.paused) {
    video.play()
  } else {
    video.pause()
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause"
}

const handlePause = () => (playBtnIcon.classList = "fas fa-play");
const handlePlay = () => (playBtnIcon.classList = "fas fa-pause");

const handleMute = (e) => {
  if (video.muted) {
    muteIcon.classList = "fas fa-volume-mute"
    video.muted = false
  } else {
    video.muted = true
  }
  muteIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue
}

const handleVolumeChange = (event) => {
  const {
    target: { value }
  } = event
  if (video.muted) {
    video.muted = false
    muteBtn.innerText = "fas fa-volume-mute"
  }
  volumeValue = value
  video.volume = value
}

const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substring(11, 19)

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration))
  timeline.max = Math.floor(video.duration)
}

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime))
  timeline.value = Math.floor(video.currentTime)
}

const handleTimeLineChange = (event) =>{
  const {
    target: { value }
  } = event
  video.currentTime = value
}

const handleFullScreen = () => {
  const fullscreen = document.fullscreenElement
  if (fullscreen) {
    document.exitFullscreen()
    fullScreenIcon.classList = "fas fa-expand"
  } else {
    videoContainer.requestFullscreen()
    fullScreenIcon.classList = "fas fa-compress"
  }
}

const hideControls = () => videoController.classList.remove("showing")

const handleMouseMove = () => {
  if (controlsTimeout) {
  clearTimeout(controlsTimeout);
  controlsTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsTimeout = setTimeout(() => {
    videoControls.classList.remove("showing");
  }, 3000);
  };


const handleEnded = () => {
  const { id } = videoContainer.dataset
  fetch(`/api/videos/${id}/view`, {
    method: "POST",
  })
}

playBtn.addEventListener("click", handlePlayClick)
muteBtn.addEventListener("click", handleMute)
video.addEventListener("pause", handlePause)
video.addEventListener("play", handlePlay)
volumeRange.addEventListener("input", handleVolumeChange)
video.addEventListener("loadedmetadata", handleLoadedMetadata)
video.addEventListener("timeupdate", handleTimeUpdate)
timeline.addEventListener("input", handleTimeLineChange)
fullScreen.addEventListener("click" , handleFullScreen)
video.addEventListener("mouseenter", handleMouseMove)
video.addEventListener("ended", handleEnded)
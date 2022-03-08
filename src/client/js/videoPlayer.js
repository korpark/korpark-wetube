const video = document.querySelector("video")
const playBtn = document.getElementById("play")
const playBtnIcon = playBtn.querySelector("i")
const muteBtn = document.getElementById("mute")
const muteBtnIcon = muteBtn.querySelector("i")
const totalTime = document.getElementById("totalTime")
const currenTime = document.getElementById("currenTime")
const volumeRange = document.getElementById("volume")
const timeline = document.getElementById("timeline")
const fullScreen = document.getElementById("fullScreen")
const videoContainer = document.getElementById("videoContainer")
const videoControls = document.getElementById("videoControls")

let controlsTimeout = null
let constrolsMovementTimeout = null
let volumeValue = 0.01
video.volume = volumeValue

const handlePlayClick = (e) => {
  if (video.paused) {
    video.play()
  } else {
    video.pause()
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause"
}

const handlePause = () => (playBtn.innerText = "Play");
const handlePlay = () => (playBtn.innerText = "Pause");

const handleMute = (e) => {
  if (video.muted) {
    video.muted = false
  } else {
    video.muted = true
  }
  muteBtnIcon.classList = video.muted
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
    muteBtn.innerText = "소리 끄기"
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
  currenTime.innerText = formatTime(Math.floor(video.currentTime))
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
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen()
    fullScreenIcon.classList = "fas fa-compress";
  }
}

const hideControls = () => videoControls.classList.remove("showing")

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout)
    controlsTimeout = null
  }
  if (constrolsMovementTimeout) {
    clearTimeout(constrolsMovementTimeout)
    constrolsMovementTimeout = null
  }
  videoControls.classList.add("showing")
  constrolsMovementTimeout = setTimeout(hideControls, 1000)
}

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 1000)
  
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
video.addEventListener("mouseleave", handleMouseLeave)

"use strict";

var video = document.querySelector("video");
var playBtn = document.getElementById("play");
var playBtnIcon = playBtn.querySelector("i");
var muteBtn = document.getElementById("mute");
var muteBtnIcon = muteBtn.querySelector("i");
var totalTime = document.getElementById("totalTime");
var currenTime = document.getElementById("currenTime");
var volumeRange = document.getElementById("volume");
var timeline = document.getElementById("timeline");
var fullScreen = document.getElementById("fullScreen");
var videoContainer = document.getElementById("videoContainer");
var videoControls = document.getElementById("videoControls");
var controlsTimeout = null;
var constrolsMovementTimeout = null;
var volumeValue = 0.01;
video.volume = volumeValue;

var handlePlayClick = function handlePlayClick(e) {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }

  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

var handlePause = function handlePause() {
  return playBtn.innerText = "Play";
};

var handlePlay = function handlePlay() {
  return playBtn.innerText = "Pause";
};

var handleMute = function handleMute(e) {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }

  muteBtnIcon.classList = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

var handleVolumeChange = function handleVolumeChange(event) {
  var value = event.target.value;

  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "소리 끄기";
  }

  volumeValue = value;
  video.volume = value;
};

var formatTime = function formatTime(seconds) {
  return new Date(seconds * 1000).toISOString().substring(11, 19);
};

var handleLoadedMetadata = function handleLoadedMetadata() {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

var handleTimeUpdate = function handleTimeUpdate() {
  currenTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

var handleTimeLineChange = function handleTimeLineChange(event) {
  var value = event.target.value;
  video.currentTime = value;
};

var handleFullScreen = function handleFullScreen() {
  var fullscreen = document.fullscreenElement;

  if (fullscreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  }
};

var hideControls = function hideControls() {
  return videoControls.classList.remove("showing");
};

var handleMouseMove = function handleMouseMove() {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }

  if (constrolsMovementTimeout) {
    clearTimeout(constrolsMovementTimeout);
    constrolsMovementTimeout = null;
  }

  videoControls.classList.add("showing");
  constrolsMovementTimeout = setTimeout(hideControls, 1000);
};

var handleMouseLeave = function handleMouseLeave() {
  controlsTimeout = setTimeout(hideControls, 1000);
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
video.addEventListener("pause", handlePause);
video.addEventListener("play", handlePlay);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimeLineChange);
fullScreen.addEventListener("click", handleFullScreen);
video.addEventListener("mouseenter", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);
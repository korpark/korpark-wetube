"use strict";

var video = document.querySelector("video");
var playBtn = document.getElementById("play");
var muteBtn = document.getElementById("mute");
var totalTime = document.getElementById("totalTime");
var currenTime = document.getElementById("currenTime");
var volumeRange = document.getElementById("volume");
var timeline = document.getElementById("timeline");
var fullScreen = document.getElementById("fullScreen");
var videoContainer = document.getElementById("videoContainer");
var videoControls = document.getElementById("videoControls");
var volumeValue = 0.5;
video.volume = volumeValue;

var handlePlayClick = function handlePlayClick(e) {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }

  video.paused ? "Play" : "Pause";
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

  muteBtn.innerText = video.muted ? "소리 켜기" : "소리 끄기";
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
    fullScreen.innerText = "Enter Full Screen";
  } else {
    videoContainer.requestFullscreen();
    fullScreen.innerText = "Exit Full Screen";
  }
};

var handleMouseMove = function handleMouseMove() {
  videoControls.classList.add("showing");
};

var handleMouseLeave = function handleMouseLeave() {
  setTimeout(function () {
    videoControls.classList.remove("showing");
  }, 3000);
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
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);
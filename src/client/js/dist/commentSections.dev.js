"use strict";

var videoContainer = document.getElementById("videoContainer");
var form = document.getElementById("commentForm");

var handleSubmit = function handleSubmit(event) {
  event.preventDefault();
  var textarea = form.querySelector("textarea");
  var text = textarea.value;
  var videoId = videoContainer.dataset.id;
  fetch("/api/videos/".concat(videoId, "/comment")), {
    method: "POST",
    body: {
      text: text
    }
  };
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
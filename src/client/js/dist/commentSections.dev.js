"use strict";

var videoContainer = document.getElementById("videoContainer");
var form = document.getElementById("commentForm");
var commentDelete = document.getElementById("commentDelete");
var videoComment = document.getElementById("videoComment");

var addComment = function addComment(text, id) {
  var videoComments = document.querySelector(".video__comments ul");
  var newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  var icon = document.createElement("i");
  icon.className = "fas fa-comment";
  var span = document.createElement("span");
  span.innerText = " ".concat(text);
  var span2 = document.createElement("span");
  span2.innerText = "❌";
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.appendChild(newComment);
};

var handleSubmit = function handleSubmit(event) {
  var textarea, text, videoId, response, _ref, newCommentId;

  return regeneratorRuntime.async(function handleSubmit$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          event.preventDefault();
          textarea = form.querySelector("textarea");
          text = textarea.value;
          videoId = videoContainer.dataset.id;

          if (!(text === "")) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return");

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(fetch("/api/videos/".concat(videoId, "/comment"), {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              text: text
            })
          }));

        case 8:
          response = _context.sent;
          textarea.value = "";
          window.location.reload();

          if (!(response.status === 201)) {
            _context.next = 18;
            break;
          }

          textarea.value = "";
          _context.next = 15;
          return regeneratorRuntime.awrap(response.json());

        case 15:
          _ref = _context.sent;
          newCommentId = _ref.newCommentId;
          addComment(text, newCommentId);

        case 18:
        case "end":
          return _context.stop();
      }
    }
  });
};

var handleDelete = function handleDelete(event) {
  var li, id;
  return regeneratorRuntime.async(function handleDelete$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          li = event.target.parentElement;
          id = li.dataset.id;
          fetch("/api/videos/".concat(id, "/comment"), {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              id: id
            })
          });
          li.remove();

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

commentDelete.addEventListener("click", handleDelete);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteComment = exports.createComment = exports.registerView = exports.search = exports.deleteVideo = exports.postUpload = exports.getUpload = exports.postEdit = exports.getEdit = exports.watch = exports.home = void 0;

var _Video = _interopRequireDefault(require("../models/Video"));

var _Comment = _interopRequireDefault(require("../models/Comment"));

var _User = _interopRequireDefault(require("../models/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var home = function home(req, res) {
  var videos;
  return regeneratorRuntime.async(function home$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(_Video["default"].find({}).sort({
            createdAt: "desc"
          }).populate("owner"));

        case 2:
          videos = _context.sent;
          return _context.abrupt("return", res.render("home", {
            pageTitle: "Home",
            videos: videos
          }));

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.home = home;

var watch = function watch(req, res) {
  var id, video;
  return regeneratorRuntime.async(function watch$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          id = req.params.id;
          _context2.next = 3;
          return regeneratorRuntime.awrap(_Video["default"].findById(id).populate("owner").populate("comments"));

        case 3:
          video = _context2.sent;

          if (video) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", res.render("404", {
            pageTitle: "Video not found."
          }));

        case 6:
          return _context2.abrupt("return", res.render("watch", {
            pageTitle: video.title,
            video: video
          }));

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.watch = watch;

var getEdit = function getEdit(req, res) {
  var id, _id, video;

  return regeneratorRuntime.async(function getEdit$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          id = req.params.id;
          _id = req.session.user._id;
          _context3.next = 4;
          return regeneratorRuntime.awrap(_Video["default"].findById(id));

        case 4:
          video = _context3.sent;

          if (video) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(404).render("404", {
            pageTitle: "Video not found."
          }));

        case 7:
          if (!(String(video.owner) !== String(_id))) {
            _context3.next = 10;
            break;
          }

          req.flash("error", "Not authorized");
          return _context3.abrupt("return", res.status(403).redirect("/"));

        case 10:
          return _context3.abrupt("return", res.render("edit", {
            pageTitle: "Edit: ".concat(video.title),
            video: video
          }));

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.getEdit = getEdit;

var postEdit = function postEdit(req, res) {
  var id, plz, OWNER, _id, _req$body, title, description, hashtags, video;

  return regeneratorRuntime.async(function postEdit$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          id = req.params.id;
          _context4.next = 3;
          return regeneratorRuntime.awrap(_Video["default"].findById(id));

        case 3:
          plz = _context4.sent;
          OWNER = plz.owner;
          _id = req.session.user._id;
          _req$body = req.body, title = _req$body.title, description = _req$body.description, hashtags = _req$body.hashtags;
          _context4.next = 9;
          return regeneratorRuntime.awrap(_Video["default"].exists({
            OWNER: _id
          }));

        case 9:
          video = _context4.sent;

          if (video) {
            _context4.next = 12;
            break;
          }

          return _context4.abrupt("return", res.status(404).render("404", {
            pageTitle: "Video not found."
          }));

        case 12:
          if (!(String(OWNER) !== String(_id))) {
            _context4.next = 15;
            break;
          }

          req.flash("error", "You are not the the owner of the video.");
          return _context4.abrupt("return", res.status(403).redirect("/"));

        case 15:
          _context4.next = 17;
          return regeneratorRuntime.awrap(_Video["default"].findByIdAndUpdate(id, {
            title: title,
            description: description,
            hashtags: _Video["default"].formatHashtags(hashtags)
          }));

        case 17:
          req.flash("success", "Changes saved.");
          return _context4.abrupt("return", res.redirect("/videos/".concat(id)));

        case 19:
        case "end":
          return _context4.stop();
      }
    }
  });
};

exports.postEdit = postEdit;

var getUpload = function getUpload(req, res) {
  return res.render("upload", {
    pageTitle: "Upload Video"
  });
};

exports.getUpload = getUpload;

var postUpload = function postUpload(req, res) {
  var _id, _req$files, video, thumb, _req$body2, title, description, hashtags, newVideo, user;

  return regeneratorRuntime.async(function postUpload$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _id = req.session.user._id;
          _req$files = req.files, video = _req$files.video, thumb = _req$files.thumb;
          _req$body2 = req.body, title = _req$body2.title, description = _req$body2.description, hashtags = _req$body2.hashtags;
          _context5.prev = 3;
          _context5.next = 6;
          return regeneratorRuntime.awrap(_Video["default"].create({
            title: title,
            description: description,
            fileUrl: video[0].location,
            owner: _id,
            hashtags: _Video["default"].formatHashtags(hashtags)
          }));

        case 6:
          newVideo = _context5.sent;
          _context5.next = 9;
          return regeneratorRuntime.awrap(_User["default"].findById(_id));

        case 9:
          user = _context5.sent;
          user.videos.push(newVideo._id);
          user.save();
          return _context5.abrupt("return", res.redirect("/"));

        case 15:
          _context5.prev = 15;
          _context5.t0 = _context5["catch"](3);
          console.log(_context5.t0);
          return _context5.abrupt("return", res.status(400).render("upload", {
            pageTitle: "Upload Video",
            errorMessage: _context5.t0._message
          }));

        case 19:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[3, 15]]);
};

exports.postUpload = postUpload;

var deleteVideo = function deleteVideo(req, res) {
  var id, _id, video;

  return regeneratorRuntime.async(function deleteVideo$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          id = req.params.id;
          _id = req.session.user._id;
          _context6.next = 4;
          return regeneratorRuntime.awrap(_Video["default"].findById(id));

        case 4:
          video = _context6.sent;

          if (video) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", res.status(404).render("404", {
            pageTitle: "Video not found."
          }));

        case 7:
          if (!(String(video.owner) !== String(_id))) {
            _context6.next = 9;
            break;
          }

          return _context6.abrupt("return", res.status(403).redirect("/"));

        case 9:
          _context6.next = 11;
          return regeneratorRuntime.awrap(_Video["default"].findByIdAndDelete(id));

        case 11:
          return _context6.abrupt("return", res.redirect("/"));

        case 12:
        case "end":
          return _context6.stop();
      }
    }
  });
};

exports.deleteVideo = deleteVideo;

var search = function search(req, res) {
  var keyword, videos;
  return regeneratorRuntime.async(function search$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          keyword = req.query.keyword;
          videos = [];

          if (!keyword) {
            _context7.next = 6;
            break;
          }

          _context7.next = 5;
          return regeneratorRuntime.awrap(_Video["default"].find({
            title: {
              $regex: new RegExp("".concat(keyword, "$"), "i")
            }
          }).populate("owner"));

        case 5:
          videos = _context7.sent;

        case 6:
          return _context7.abrupt("return", res.render("search", {
            pageTitle: "Search",
            videos: videos
          }));

        case 7:
        case "end":
          return _context7.stop();
      }
    }
  });
};

exports.search = search;

var registerView = function registerView(req, res) {
  var id, video;
  return regeneratorRuntime.async(function registerView$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          id = req.params.id;
          _context8.next = 3;
          return regeneratorRuntime.awrap(_Video["default"].findById(id));

        case 3:
          video = _context8.sent;

          if (video) {
            _context8.next = 6;
            break;
          }

          return _context8.abrupt("return", res.sendStatus(404));

        case 6:
          video.meta.views = video.meta.views + 1;
          _context8.next = 9;
          return regeneratorRuntime.awrap(video.save());

        case 9:
          return _context8.abrupt("return", res.sendStatus(200));

        case 10:
        case "end":
          return _context8.stop();
      }
    }
  });
};

exports.registerView = registerView;

var createComment = function createComment(req, res) {
  var user, text, id, video, comment;
  return regeneratorRuntime.async(function createComment$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          user = req.session.user, text = req.body.text, id = req.params.id;
          _context9.next = 3;
          return regeneratorRuntime.awrap(_Video["default"].findById(id));

        case 3:
          video = _context9.sent;

          if (!video) {
            res.sendStatus(404);
          }

          _context9.next = 7;
          return regeneratorRuntime.awrap(_Comment["default"].create({
            text: text,
            owner: user._id,
            video: id
          }));

        case 7:
          comment = _context9.sent;
          video.comments.push(comment._id);
          video.save();
          return _context9.abrupt("return", res.status(201).json({
            newCommentId: comment._id
          }));

        case 11:
        case "end":
          return _context9.stop();
      }
    }
  });
};

exports.createComment = createComment;

var deleteComment = function deleteComment(req, res) {
  var id, _ref, owner;

  return regeneratorRuntime.async(function deleteComment$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          id = req.params.id;
          _context10.next = 3;
          return regeneratorRuntime.awrap(_Comment["default"].findById(id));

        case 3:
          _ref = _context10.sent;
          owner = _ref.owner;

          if (!(String(owner._id) === req.session.user._id)) {
            _context10.next = 10;
            break;
          }

          _context10.next = 8;
          return regeneratorRuntime.awrap(_Comment["default"].findByIdAndDelete(id));

        case 8:
          _context10.next = 11;
          break;

        case 10:
          req.sentStatus(404);

        case 11:
        case "end":
          return _context10.stop();
      }
    }
  });
};

exports.deleteComment = deleteComment;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.s3DeleteAvatarMiddleware = exports.videoUpload = exports.avatarUpload = exports.publicOnlyMiddleware = exports.protectorMiddleware = exports.localsMiddleware = void 0;

var _multer = _interopRequireDefault(require("multer"));

var _multerS = _interopRequireDefault(require("multer-s3"));

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var s3 = new _awsSdk["default"].S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
  }
});
var isHeroku = process.env.NODE_ENV === "production";
var s3ImageUploader = (0, _multerS["default"])({
  s3: s3,
  bucket: 'korwetube/images',
  acl: 'public-read'
});
var s3VideoUploader = (0, _multerS["default"])({
  s3: s3,
  bucket: 'korwetube/videos',
  acl: 'public-read',
  contentType: _multerS["default"].AUTO_CONTENT_TYPE
});

var localsMiddleware = function localsMiddleware(req, res, next) {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user || {};
  res.locals.isHeroku = isHeroku;
  next();
};

exports.localsMiddleware = localsMiddleware;

var protectorMiddleware = function protectorMiddleware(req, res, next) {
  if (req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Log in first.");
    return res.redirect("/login");
  }
};

exports.protectorMiddleware = protectorMiddleware;

var publicOnlyMiddleware = function publicOnlyMiddleware(req, res, next) {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/");
  }
};

exports.publicOnlyMiddleware = publicOnlyMiddleware;
var avatarUpload = (0, _multer["default"])({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000000
  },
  storage: isHeroku ? s3ImageUploader : undefined
});
exports.avatarUpload = avatarUpload;
var videoUpload = (0, _multer["default"])({
  dest: "uploads/videos/",
  limits: {
    fileSize: 100000000000000000000
  },
  storage: isHeroku ? s3VideoUploader : undefined
});
exports.videoUpload = videoUpload;

var s3DeleteAvatarMiddleware = function s3DeleteAvatarMiddleware(req, res, next) {
  if (!req.file) {
    return next();
  }

  s3.deleteObject({
    Bucket: "clonetubetest",
    Key: "images/".concat(req.session.user.avatarURL.split('/')[4])
  }, function (err, data) {
    if (err) {
      throw err;
    }

    console.log("s3 deleteObject", data);
  });
  next();
};

exports.s3DeleteAvatarMiddleware = s3DeleteAvatarMiddleware;
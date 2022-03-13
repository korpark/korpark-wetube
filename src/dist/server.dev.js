"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _expressFlash = _interopRequireDefault(require("express-flash"));

var _connectMongo = _interopRequireDefault(require("connect-mongo"));

var _rootRouter = _interopRequireDefault(require("./routers/rootRouter.js"));

var _videoRouter = _interopRequireDefault(require("./routers/videoRouter.js"));

var _userRouter = _interopRequireDefault(require("./routers/userRouter.js"));

var _middlewares = require("./middlewares.js");

var _apiRouter = _interopRequireDefault(require("./routers/apiRouter.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
var logger = (0, _morgan["default"])("dev");
app.set("view engine", "pug"); // views는 wetube까지만 보는데 우리는 src 안에 있는 파일들을 보고 싶으니 경로 바꾸기

app.set("views", process.cwd() + "/src/views");
app.use(logger); // urlencoded가 route에 들어가기 전에 form을 javascript 형식을 쓸 수 있게 만든다
// req.body (x)

app.use(_express["default"].urlencoded({
  extended: true
})); // req.body (o)

app.use(_express["default"].json());
app.use((0, _expressSession["default"])({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  store: _connectMongo["default"].create({
    mongoUrl: process.env.DB_URL
  })
}));
app.use((0, _expressFlash["default"])());
app.use(_middlewares.localsMiddleware);
app.use("/uploads", _express["default"]["static"]("uploads"));
app.use("/static", _express["default"]["static"]("assets"));
app.use("/videos", _videoRouter["default"]);
app.use("/", _rootRouter["default"]);
app.use("/users", _userRouter["default"]);
app.use("/api", _apiRouter["default"]);
var _default = app;
exports["default"] = _default;
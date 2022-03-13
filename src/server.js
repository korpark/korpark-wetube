import express from "express";
import morgan from "morgan"
import session from "express-session"
import flash from "express-flash";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter.js";
import videoRouter from "./routers/videoRouter.js";
import userRouter from "./routers/userRouter.js";
import { localsMiddleware } from "./middlewares.js";
import apiRouter from "./routers/apiRouter.js";


const app = express()
const logger = morgan("dev")

app.set("view engine", "pug")
// views는 wetube까지만 보는데 우리는 src 안에 있는 파일들을 보고 싶으니 경로 바꾸기
app.set("views", process.cwd() + "/src/views")
app.use(logger)
// urlencoded가 route에 들어가기 전에 form을 javascript 형식을 쓸 수 있게 만든다
// req.body (x)
app.use(express.urlencoded({extended : true}))

// req.body (o)
app.use(express.json())
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);
app.use(flash());
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
app.use("/videos", videoRouter);
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);

export default app;
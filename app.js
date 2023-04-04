const express = require("express");
const path = require("path");
//const cors = require("cors");
const { ham } = require("./controllers/populate");
const morgan = require("morgan");
const helmet = require("helmet");
const app = express();
const tourRouter = require("./routers/tour.js");
const userRouter = require("./routers/user.js");
const globalErrorHandler = require("./controllers/errorController.js");
const customer = require("./models/transaction");
const rateLimit = require("express-rate-limit");
const sanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const views = require("./routers/views");
//0) set views
app.set("view engine", "pug");
app.set("views", "./views");
app.use(express.static(`${__dirname}/public`));

app.use(helmet());
//1)middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
ham();
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message:
    "Too many accounts created from this IP, please try again after an hour",
  //standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  //legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use("/api", limiter);
app.use(sanitize());
app.use(xss());
// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

//limit moi ip max la 100 req trong 1h
//3)our middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
//app.use(cors());
//2)router
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//transaction banking
/*const transfer = async function (from, to, amount) {
  const session = client.startSession();
  session.startTransaction();
  await customer.findOneAndUpdate(
    { name: from },
    { $inc: { balance: -amount } },
    {
      new: true,
      session,
    }
  );
  await customer.findOneAndUpdate({ name: to }, { $inc: { balance: amount } });
  console.log("chuyen thanh cong");
};
customer.insertMany([
  {
    name: "A",
    balance: 20,
  },
  {
    name: "B",
    balance: 60,
  },
]);
console.log("da them 2 ng dung");
console.log("A chuyen B 50k");
transfer("A", "B", 50);*/
app.get("/", views);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.all("*", (req, res, next) => {
  const err = new Error(`can't find ${req.originalUrl} now`);
  err.statusCode = 404;
  err.status = "fail";
  next(err);
});
//
app.use(globalErrorHandler);
/*app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    messege: err.messege,
  });
});*/
//app.use("/api/v1/tours", userRouter);
//4)view engine
app.set("view engine", "ejs");
app.set("views", "./views");
//5)start server
module.exports = app;

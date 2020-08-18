const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const methodOverride=require('method-override')
dotenv.config({ path: "./config/config.env" });

require("./config/passport")(passport);

const app = express();
connectDB();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
const {editIcon, formatDate, truncate, stripTags,select } = require("./helpers/hbs");

app.engine(
  ".hbs",
  exphbs({
    helpers: { formatDate, truncate, stripTags, editIcon,select },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

app.use(
  session({
    secret: "keyboa",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(function(req,res,next){
  res.locals.user=req.user || null
  next()
})

app.use(methodOverride(function(req,res){
  if(req.body && typeof req.body==='object' && '_method' in req.body){
    let method=req.body._method
    delete req.body._method
    return method
  }
}))
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

const PORT = process.env.port || 5000;
app.listen(
  PORT,
  console.log(`server is running in ${process.env.NODE_ENV} mode on ${PORT}`)
);

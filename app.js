const express = require("express");
const path = require("path");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const https = require("https");
const mongoose = require("mongoose");
const { get } = require("http");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: true }));

app.route("/").get(function (req, res) {
  res.render("home");
});

app
  .route("/weather")
  .get(function (req, res) {
    res.render("weather");
  })
  .post(function (req, res) {
    const querry = req.body.cityName;
    const appKey = "6ddf8f9a51dd4c99e65ce93dcbb10eff";
    const units = "metric";
    const url =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      querry +
      "&appid=" +
      appKey +
      "&units=" +
      units;
    https.get(url, function (response) {
      console.log(response.statusCode);
      response.on("data", function (data) {
        const weatherData = JSON.parse(data);
        const temp = weatherData.main.temp;
        const weatherDescription = weatherData.weather[0].description;
        res.write("<p>The weather is currently" + weatherDescription + "</p>");
        res.write(
          "<h1>the temprature in " +
            querry +
            " is " +
            temp +
            "degree Celcius.</h1>"
        );
        res.send();
      });
    });
  });

mongoose.connect("mongodb://localhost:27017/todo", {
  useNewUrlParser: true,
});
const listSchema = new mongoose.Schema({
  title: String,
  content: String,
});
const List = new mongoose.model("List", listSchema);
app.route("/list");

app
  .get("/todo", function (req, res) {
    List.find(function (err, foundlist) {
      if (err) console.log(err);
      else {
        res.render("todo", { foundlist: foundlist });
      }
    });
  })
  .post(function (req, res) {
    const list = new List({
      title: req.body.title,
      content: req.body.content,
    });
    list.save();
    res.redirect("/todo");
  });
const contactSchema = new mongoose.Schema({
  username: String,
  querry: String,
});
const Contact = new mongoose.model("Contact", contactSchema);

app
  .route("/contact")
  .get(function (req, res) {
    res.render("contact");
  })
  .post(function (req, res) {
    const contact = new Contact({
      username: req.body.username,
      querry: req.body.querry,
    });
    contact.save();
    res.redirect("/contact");
  });
const signinSchema = new mongoose.Schema({
  EmailAddress: String,
  password: String,
});
const Signin = new mongoose.model("signin", signinSchema);
app
  .route("/signin")
  .get(function (req, res) {
    res.render("signin");
  })
  .post(function (req, res) {
    const signin = new Signin({
      EmailAddress: req.body.EmailAddress,
      password: req.body.password,
    });
    signin.save();
    res.redirect("/");
  });

const signupSchema = new mongoose.Schema({
  FirstName: String,
  SecondName: String,
  LastName: String,
  PhoneNumber: String,
  EmailAddress: String,
  password: String,
});
const Signup = new mongoose.model("signup", signupSchema);

app
  .route("/signup")
  .get(function (req, res) {
    res.render("signup");
  })
  .post(function (req, res) {
    const signup = new Signup({
      FirstName: req.body.FirstName,
      SecondName: req.body.SecondName,
      LastName: req.body.LastName,
      PhoneNumber: req.body.PhoneNumber,
      EmailAddress: req.body.EmailAddress,
      password: req.body.password,
    });
    signup.save();
    res.redirect("/");
  });

app.listen(3000, function () {
  console.log("server is running on port 3000");
});

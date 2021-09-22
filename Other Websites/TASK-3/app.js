const express = require("express");
var session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const Student = require("./modules/admin");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/srmsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const adminSchema = new mongoose.Schema({
  email: String,
  password: String,
});

adminSchema.plugin(passportLocalMongoose);
const Admin = mongoose.model("Admin", adminSchema);

const app = express();
app.set("view engine", "ejs");

app.use(express.urlencoded({
  extended: false
}));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(Admin.createStrategy());

passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

app.post("/register", function (req, res) {
  Admin.register({
      username: req.body.username
    },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.redirect("/");
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/dashboard");
        });
      }
    }
  );
});
app.post("/login", function (req, res) {
  const user = new Admin({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, function (err) {

    if (err) {
      res.render('failure')
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/dashboard");
      });
    }
  });
});

app.get("/dashboard", function (req, res) {
  if (req.isAuthenticated()) {
    const Students = Student.find({}, function (err, found) {
      console.log(found);
      res.render("dashboard", {
        students: found
      });
    });
  } else {
    res.redirect("/");
  }
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

app.post("/dashboard", async function (req, res) {
  const student = new Student({
    name: req.body.name,
    class: req.body.class,
    rollNo: req.body.rollNo,
    fatherName: req.body.fatherName,
    dob: req.body.dob,
    mobileNo: req.body.mobileNo,
    maths: req.body.maths,
    eng: req.body.eng,
    phy: req.body.phy,
    chem: req.body.chem,
    hindi: req.body.hindi,
  });

  await student.save();
  res.render("success", {
    text: "data inserted successfully"
  });
});

app.get("/profile/:id", async function (req, res) {
  console.log(req.params.id);
  await Student.find({
    _id: req.params.id
  }, function (err, result) {
    if (result) {
      res.render("profile", {
        student: result
      });
    }
  });
});

app.post("/getresult", async function (req, res) {
  await Student.find({
    rollNo: req.body.rollNo
  }, function (err, found) {
    if (err) {
      res.render('failure')

    } else {
      res.render("marksheet", {
        student: found
      });

    }
  });

  const student = await Student.find({
    rollNo: req.body.rollNo
  })
  if (student) {
    res.render("marksheet", {
      student: found
    });

  } else {
    res.render('failure')

  }


});
app.post("/update", async function (req, res) {
  console.log(req.body);

  await Student.find({
    rollNo: req.body.rollno
  }, function (err, found) {
    res.render("update", {
      student: found
    });
  });


});

app.post("/updateResult/:id", async function (req, res) {
  console.log(req.body);
  const student = await Student.findById(req.params.id);
  Student.update({
      _id: req.params.id
    }, {
      name: req.body.name,
      class: req.body.class,
      rollNo: req.body.rollNo,
      fatherName: req.body.fatherName,
      dob: req.body.dob,
      mobileNo: req.body.mobileNo,
      maths: req.body.maths,
      eng: req.body.eng,
      phy: req.body.phy,
      chem: req.body.chem,
      hindi: req.body.hindi,
    }, {
      overwrite: true
    },
    function (err) {
      if (!err) {
        res.render("success", {
          text: "updated successfully"
        });
      }
    }
  );
});

app.post("/delete", async function (req, res) {
  const student = await Student.findOneAndRemove({
    rollNo: req.body.rollno
  });
  res.render("success", {
    text: "deleted successfully"
  });
});


app.listen(3000, function () {
  console.log("Listening to port 3000");
});
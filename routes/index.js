const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const saltRounds = 10;

const User = require("../models/User.model");

const isLoggedIn = require("../middleware/isLoggedIn");
const isLoggedOut = require("../middleware/isLoggedOut");
const admin = require("../middleware/admin");

// GET home page 
router.get("/", (req, res, next) => {
  res.render("index");
});


// //registro
router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", (req, res, next) => {
  let { username, password, passwordRepeat } = req.body;

  if (username == "" || password == "" || passwordRepeat == "") {
    res.render("signup", {
      errorMessage: "Por favor rellene todos los campos.",
    });
    return;
  }

  if (password != passwordRepeat) {
    res.render("signup", {
      errorMessage: "Las contraseñas NO coinciden.",
    });
    return;
  }

  User.find({ username })
    .then((result) => {
      if (result.length != 0) {
        res.render("signup", {
          errorMessage:
            "El usuario ya existe, por favor elija otro.",
        });
        return;
      }

      let salt = bcrypt.genSaltSync(saltRounds);
      let passwordEncriptada = bcrypt.hashSync(password, salt);

      User.create({
        username,
        password: passwordEncriptada
      })
        .then(() => {
          res.redirect("/login");
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

// // Login 
router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  let { username, password } = req.body;

  if (username == "" || password == "") {
    res.render("login", { errorMessage: "Faltan campos por rellenar." });
  }


  let salt = bcrypt.genSaltSync(saltRounds);
  let passwordEncriptada = bcrypt.hashSync(password, salt);

  User.find({ username })
    .then((result) => {
      if (result.length == 0) {
        res.render("login", {
          errorMessage: "El usuario no existe, por favor regístrate.",
        });
      }
      console.log("result[0].password = " + result[0].password)
      console.log("password = " + password)
      console.log("result = " + result)

      console.log("passwordEncriptada = " + passwordEncriptada)
      // if (bcrypt.compareSync(password, result[0].username)) {
      if (username == result[0].username) {

        // let usuario = {
        //   username: result.username,
        //   admin: result.admin,
        // };

        // req.session.currentUser = usuario;

        res.redirect("/profile");
      } else {
        res.render("login", {
          errorMessage: "Credenciales incorrectas.",

        });
      }
    })
    .catch((err) => next(err));
});

// // Perfil

router.get("/profile", (req, res, next) => {
  // res.render("profile", { username: req.session.currentUser.username });
  res.render("profile");
});

// // logout
// router.get("/logout", isLoggedIn, (req, res, next) => {
//   req.session.destroy((err) => {
//     if (err) {
//       next(err);
//     } else {
//       res.redirect("/user/login");
//     }
//   });
// });

// // administrador
// router.get("/admin", isLoggedIn, admin, (req, res, next) => {
//   res.send("Eres administrador!");
// });

// // No administrador
// router.get("/no-admin", isLoggedIn, (req, res, next) => {
//   res.send("No eres administrador!");
// });



module.exports = router;

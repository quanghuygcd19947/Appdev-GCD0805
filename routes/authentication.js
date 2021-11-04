var express = require("express");
// const session = require("express-session");
var router = express.Router();
const database = require("../database/models/index");
const Role = database.db.Role;
const Account = database.db.Account;

/* GET Staff Index page. */
router.get("/", async function (req, res) {
  try {
    res.render("login");
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async function (req, res) {
  try {
    const { username, password } = req.body;
    console.log("🚀 ~ file: authentication.js ~ line 20 ~ username", username)
    const user = await Account.findOne({
      include: Role,
      where: {
        username,
        password,
      },
    });

    req.session.user = user;

    if (!user) {
      console.log("INVALID LOGIN");
      res.redirect("/authentication");
    }

    switch (user.Role.name) {
      case "admin":
        res.redirect("/admin");
        break;
      case "trainingStaff":
        res.redirect("/trainingStaff");
        break;
      case "trainer":
        res.redirect("/trainer");
        break;
      case "trainee":
        res.redirect("/trainee");
        break;
      default:
        res.redirect("/authentication");
        break;
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/logout", async function (req, res) {
  req.session.destroy(function () {
    res.redirect("/authentication");
  });
});

module.exports = router;

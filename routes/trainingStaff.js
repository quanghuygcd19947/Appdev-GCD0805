var express = require("express");
var router = express.Router();
const database = require("../database/models/index");
const Role = database.db.Role;
const Account = database.db.Account;
const Trainee = database.db.Trainee;

/* GET home page. */
router.get("/", function (req, res, next) {
    res.send("Hello admin");
  });

  /* GET create trainee page. */
router.get("/createTrainee", async function (req, res, next) {
    const traineeRole = await Role.findOne({
      where: {
        name: "trainee",
      },
    });
    res.render("trainee_view/create", { traineeRole: traineeRole });
  });

  router.post("/addTrainee", async function (req, res) {
    const { username, password, fullname, age, dateOfBirth, education, email } =
      req.body;
  
    const trainee = await Trainee.create({
      fullname,
      age,
      dateOfBirth,
      education,
      email,
    });
  
    if (trainee) {
      await Account.create({
        username,
        password,
        roleId,
        userId: trainee.dataValues.id,
      });
  
      res.redirect("/trainingStaff");
    }
  });
  
  module.exports = router;
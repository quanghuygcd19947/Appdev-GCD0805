var express = require("express");
var router = express.Router();
const database = require("../database/models/index");
const Role = database.db.Role;
const TrainingStaff = database.db.TrainingStaff;
const Account = database.db.Account;
const Trainer = database.db.Trainer;

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("Hello admin");
});

/* GET create staff page. */
router.get("/createStaff", async function (req, res, next) {
  const staffRole = await Role.findOne({
    where: {
      name: "trainingStaff",
    },
  });
  res.render("trainingStaff_view/create", { staffRole: staffRole });
});

router.post("/addStaff", async function (req, res) {
  const { username, password, fullname, age, email, address, roleId } =
    req.body;

  const staff = await TrainingStaff.create({
    fullname,
    age,
    email,
    address,
  });

  if (staff) {
    await Account.create({
      username,
      password,
      roleId,
      userId: staff.dataValues.id,
    });

    res.redirect("/admin");
  }
});

/* GET create trainer page. */
router.get("/createTrainer", async function (req, res, next) {
  const trainerRole = await Role.findOne({
    where: {
      name: "trainer",
    },
  });
  res.render("trainer_view/create", { trainerRole: trainerRole });
});

router.post("/addTrainer", async function (req, res) {
  const { username, password, fullname, speciality, age, address, email } =
    req.body;

  const trainer = await Trainer.create({
    fullname,
    speciality,
    age,
    address,
    email,
  });

  if (trainer) {
    await Account.create({
      username,
      password,
      roleId,
      userId: trainer.dataValues.id,
    });

    res.redirect("/admin");
  }
});

module.exports = router;

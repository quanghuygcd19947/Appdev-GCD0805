var express = require("express");
var router = express.Router();
const database = require("../database/models/index");
const Role = database.db.Role;
const TrainingStaff = database.db.TrainingStaff;
const Account = database.db.Account;
const Trainer = database.db.trainer;

/* GET home page. */
router.get("/", async function (req, res, next) {
  const accounts = await Account.findAll({
    include: Role
  });

  const staffAccounts = await Account.findAll({
    include: [{
      model: Role,
      where: {
        name: 'trainingStaff'
      }
    }]
  });

  const trainerAccounts = await Account.findAll({
    include: [{
      model: Role,
      where: {
        name: 'trainer'
      }
    }]
  })

  res.render('admin_view/index', {staffAccounts, trainerAccounts});
});

/* GET ... page. */
const getUserByRole = async (roleName, userId) => {
  let user;
  switch(roleName) {
    case 'trainingStaff': {
      user = await TrainingStaff.findOne({
        where: {
          id: userId
        }
      })
      return user;
    }
    case 'trainer': {
      user = await Trainer.fineOne({
        where: {
          id: userId
        }
      })
      return user;
    }
    default: {
      res.send('Not found any users');
    }
  }
  res.send(user);
}

router.get("/viewAccount", async function (req, res, next) {
  try {
    const {id} = req.query;
    const account = await Account.findOne({
      where: {
        id
      },
      include: Role
    })

    const user = await getUserByRole(account.Role.name, account.userId);
    const accountDetail = {...account.dataValues, User: user};

    res.send(accountDetail);
  } catch (error) {
    console.log(error);
    res.redirect('/admin');
  }
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
  const { username, password, fullname, specialty, age, address, email, roleId } =
    req.body;

  const trainer = await Trainer.create({
    fullname,
    specialty,
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

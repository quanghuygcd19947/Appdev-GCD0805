var express = require("express");
const course = require("../database/models/course");
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

  res.render('layouts/master', {
    content: "../admin_view/index",
    staffAccounts,
    trainerAccounts});
});

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
      user = await Trainer.findOne({
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

const getAccountById = async (accountId) => {
  const account = await Account.findOne({
    where: {
      id: accountId
    },
    include: Role
  })
  return account;
}

const deleteUserByRole = async (roleName, userId) => {
  let result;

  switch(roleName) {
    case 'trainingStaff': {
      result = await TrainingStaff.destroy({
        where: {
          id: userId
        }
      })
      return result;
    }

    case 'trainer': {
      result = await Trainer.destroy({
        where: {
          id: userId
        }
      })
      return result;
    }
    default: {
      res.send('Not found any users');
    }
  }
  res.send(result);
}

/* GET account page. */
router.get("/viewAccount", async function (req, res, next) {
  try {
    const {id} = req.query;
    const account = await getAccountById(id);

    const user = await getUserByRole(account.Role.name, account.userId);
    const accountDetail = {...account.dataValues, User: user};

    res.render("layouts/master", {
      content: "../account_view/details",
      accountDetail
    })
    //res.send(accountDetail);
  } catch (error) {
    console.log(error);
    res.redirect('/admin');
  }
});

/* GET delete account page. */
router.get("/deleteAccount", async (req, res) => {
  try {
    const {id} = req.query;
    const account = await getAccountById(id);
    const result = await deleteUserByRole(account.Role.name, account.userId);
    await Account.destroy({
      where: {
        id
      }
    })
    if(result) {
      res.redirect('/admin');
    }
  } catch (error) {
    console.log("🚀 ~ file: admin.js ~ line 68 ~ router.get ~ error", error)
    res.redirect('/admin');
  }
})

/* GET create staff page. */
router.get("/createStaff", async function (req, res, next) {
  const staffRole = await Role.findOne({
    where: {
      name: "trainingStaff",
    },
  });
  res.render("layouts/master", {
    content: "../trainingStaff_view/create",
    staffRole: staffRole });
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

router.get("/updateStaff/:updateId", async function (req, res, next) {
  try {
    const { updateId } = req. params;
    const staffAccount = await Account.findAll({
      where: {
        id: updateId,
      },
    });
    const { id, username, password } = staffAccount[0].dataValues;
    console.log("🚀 ~ file: admin.js ~ line 184 ~ staffAccount", staffAccount)

    res.render("layouts/master", {
      content: "../staff_view/update",
      id,
      username,
      password,
    })
  } catch (error) {
  console.log("🚀 ~ file: admin.js ~ line 192 ~ error", error)
  }
})

router.post("/editStaff", async function (req, res) {
  const { id, username, password } = req.body;
  try {
    const updatedStaff = await Account.update({
      username,
      password,
    },
    {
      where: {
        id: id
      }
    })

    res.redirect("/admin");
  } catch (error) {
  console.log("🚀 ~ file: admin.js ~ line 208 ~ error", error)
  }
})

/* GET create trainer page. */
router.get("/createTrainer", async function (req, res, next) {
  const trainerRole = await Role.findOne({
    where: {
      name: "trainer",
    },
  });
  res.render("layouts/master", {
    content: "trainer_view/create",
    trainerRole: trainerRole });
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

router.get("/updateTrainer/:updateId", async function (req, res, next) {
  try {
    const { updateId } = req. params;
    const trainerAccount = await Account.findAll({
      where: {
        id: updateId,
      },
    });
    const { id, username, password } = trainerAccount[0].dataValues;
    console.log("🚀 ~ file: admin.js ~ line 255 ~ trainerAccount", trainerAccount)

    res.render("layouts/master", {
      content: "../trainer_view/update",
      id,
      username,
      password,
    })
  } catch (error) {
  console.log("🚀 ~ file: admin.js ~ line 263 ~ error", error)
  }
})

router.post("/editTrainer", async function (req, res) {
  const { id, username, password } = req.body;
  try {
    const updatedTrainer = await Account.update({
      username,
      password,
    },
    {
      where: {
        id: id
      }
    })

    res.redirect("/admin");
  } catch (error) {
  console.log("🚀 ~ file: admin.js ~ line 279 ~ error", error)
  }
})



module.exports = router;

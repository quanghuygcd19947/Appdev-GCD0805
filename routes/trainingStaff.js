var express = require("express");
var router = express.Router();
const database = require("../database/models/index");
const Role = database.db.Role;
const Account = database.db.Account;
const Trainee = database.db.trainee;
const Trainer = database.db.trainer;
const Course = database.db.course;
const TrainerCourse = database.db.TrainerCourse;

/* GET home page. */
router.get("/", async function (req, res, next) {
  const accounts = await Account.findAll({
    include: Role
  });

  const traineeAccounts = await Account.findAll({
    include: [{
      model: Role,
      where: {
        name: 'trainee'
      }
    }]
  });

  res.render('staff_view/index', {traineeAccounts, traineeAccounts});
});

const getUserByRole = async (roleName, userId) => {
  let user;

  switch(roleName) {
    case 'trainee': {
      user = await Trainee.findOne({
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
    case 'trainee': {
      result = await Trainee.destroy({
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

    res.send(accountDetail);
  } catch (error) {
    console.log(error);
    res.redirect('/trainingStaff');
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
      res.redirect('/trainingStaff');
    }
  } catch (error) {
    console.log("🚀 ~ file: trainingStaff.js ~ line 123 ~ router.get ~ error", error)
    res.redirect('/admin');
  }
})

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
    const { username, password, fullname, age, dateOfBirth, education, email, roleId } =
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

  /* GET Asign Trainer. */
router.get("/asignTrainer", async (req, res) => {
  const trainers = await Trainer.findAll();
  const courses = await Course.findAll();

  res.render("/trainer_view/assign", {
    trainers,
    courses,
  })
})

router.post("assignTrainer", async (req, res) => {
  try {
    const {trainerId, courseId} = req.body;
    //res.send(`${trainerId}, ${courseId}`);
    const result = TrainerCourse.create({
      trainerId,
      courseId
    })

      res.redirect('/trainingStaff')

  } catch (error) {
  console.log("🚀 ~ file: trainingStaff.js ~ line 165 ~ router.post ~ error", error)
  }
})




  
  module.exports = router;
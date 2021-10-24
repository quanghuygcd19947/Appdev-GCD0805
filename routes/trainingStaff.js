var express = require("express");
var router = express.Router();
const database = require("../database/models/index");
const Role = database.db.Role;
const Account = database.db.Account;
const Trainee = database.db.trainee;
const Trainer = database.db.trainer;
const Course = database.db.course;
const CourseCategory = database.db.courseCategory;
const TrainerCourse = database.db.TrainerCourse;

/* GET home page. */
router.get("/", async function (req, res, next) {
  const accounts = await Account.findAll({
    include: Role,
  });

  const traineeAccounts = await Account.findAll({
    include: [
      {
        model: Role,
        where: {
          name: "trainee",
        },
      },
    ],
  });

  const courseCategories = await CourseCategory.findAll();
  const courses = await Course.findAll({
    include: CourseCategory,
  });

  const trainerCourses = await TrainerCourse.findAll({
    include: [Trainer, Course],
  });

  res.render("staff_view/index", {
    traineeAccounts,
    traineeAccounts,
    courseCategories,
    courses,
  });
});

const getUserByRole = async (roleName, userId) => {
  let user;

  switch (roleName) {
    case "trainee": {
      user = await Trainee.findOne({
        where: {
          id: userId,
        },
      });
      return user;
    }

    default: {
      res.send("Not found any users");
    }
  }
  res.send(user);
};

const getAccountById = async (accountId) => {
  const account = await Account.findOne({
    where: {
      id: accountId,
    },
    include: Role,
  });
  return account;
};

const deleteUserByRole = async (roleName, userId) => {
  let result;

  switch (roleName) {
    case "trainee": {
      result = await Trainee.destroy({
        where: {
          id: userId,
        },
      });
      return result;
    }

    default: {
      res.send("Not found any users");
    }
  }
  res.send(result);
};

/* GET account page. */
router.get("/viewAccount", async function (req, res, next) {
  try {
    const { id } = req.query;
    const account = await getAccountById(id);

    const user = await getUserByRole(account.Role.name, account.userId);
    const accountDetail = { ...account.dataValues, User: user };

    res.send(accountDetail);
  } catch (error) {
    console.log(error);
    res.redirect("/trainingStaff");
  }
});

/* GET delete account page. */
router.get("/deleteAccount", async (req, res) => {
  try {
    const { id } = req.query;
    const account = await getAccountById(id);
    const result = await deleteUserByRole(account.Role.name, account.userId);
    await Account.destroy({
      where: {
        id,
      },
    });
    if (result) {
      res.redirect("/trainingStaff");
    }
  } catch (error) {
    console.log(
      "🚀 ~ file: trainingStaff.js ~ line 123 ~ router.get ~ error",
      error
    );
    res.redirect("/admin");
  }
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
  const {
    username,
    password,
    fullname,
    age,
    dateOfBirth,
    education,
    email,
    roleId,
  } = req.body;

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

/* GET create course category page. */
router.get("/createcourseCategory", async function (req, res) {
  res.render("./courseCategory_view/create");
});

router.post("/addCourseCategory", async function (req, res) {
  const { name, description } = req.body;

  const courseCategory = await CourseCategory.create({
    name,
    description,
  });

  res.redirect("/trainingStaff");
});

/* GET create course page. */
router.get("/createCourse", async function (req, res) {
  const courseCategories = await CourseCategory.findAll();
  res.render("./course_view/create", {
    courseCategories,
  });
});

router.post("/addCourse", async function (req, res) {
  const { name, description, courseCategoryId } = req.body;
  const course = await Course.create({
    name,
    description,
    courseCategoryId,
  });

  res.redirect("/trainingStaff");
});

/* GET Asign Trainer. */
router.get("/assignTrainer", async (req, res) => {
  const trainers = await Trainer.findAll();
  
  const courses = await Course.findAll();
  res.render("trainer_view/assign", {
    trainers,
    courses,  
  });
});

router.post("/assignTrainer", async (req, res) => {
  try {
    const { trainerId, courseId } = req.body;
    
    const result = await TrainerCourse.create({
      trainerId,
      courseId,
    });

    res.redirect("/trainingStaff");
  } catch (error) {
    console.log("🚀 ~ file: trainingStaff.js ~ line 233 ~ router.post ~ error", error)
  }
});

module.exports = router;

var express = require("express");
var router = express.Router();
const database = require("../database/models/index");
const { Op } = require("sequelize");
const Role = database.db.Role;
const Account = database.db.Account;
const Trainee = database.db.trainee;
const Trainer = database.db.trainer;
const Course = database.db.course;
const CourseCategory = database.db.courseCategory;
const TrainerCourse = database.db.TrainerCourse;
const TraineeCourse = database.db.TraineeCourse;

/* GET home page. */
router.get("/", async function (req, res) {
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
  //res.send(trainerCourses);

  const traineeCourses = await TraineeCourse.findAll({
    include: [Trainee, Course],
  });
  //res.send(traineeCourses);

  res.render("layouts/master", {
    content: "../staff_view/index",
    traineeAccounts,
    traineeAccounts,
    courseCategories,
    courses,
    trainerCourses,
    traineeCourses,
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
router.get("/viewAccount", async function (req, res) {
  try {
    const { id } = req.query;
    const account = await getAccountById(id);

    const user = await getUserByRole(account.Role.name, account.userId);
    const accountDetail = { ...account.dataValues, User: user };

    res.render("layouts/master", {
      content: "../account_view/details",
      accountDetail
    })
    //res.send(accountDetail);
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
    res.redirect("/trainningStaff");
  }
});

/* GET create trainee page. */
router.get("/createTrainee", async function (req, res) {
  const traineeRole = await Role.findOne({
    where: {
      name: "trainee",
    },
  });
  res.render("layouts/master", {
    content:"../trainee_view/create",
     traineeRole: traineeRole });
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

router.get('/updateTrainee/:id', async (req, res) => {
  const {id} = req.params;
  const traineeAccount = await Account.findOne({
    where: {
      id
    },
    include: Role
  })

  const {id: accountId, username, password} = traineeAccount

  const traineeInfo = await Trainee.findOne({
    where: {
      id: traineeAccount.userId
    }
  })

  const traineeData = {...traineeInfo.dataValues, username, password, accountId};    //destructuring ES6
  
  res.render("layouts/master", {
    content: "../trainee_view/update",
    traineeData
  })
})

router.post('/editTrainee', async (req, res) => {
  const {accountId, username, password, traineeId, fullname, education, dateOfBirth, age, email} = req.body;

  const updatedAccount = await Account.update({ username, password}, {
    where: {
      id: accountId
    }
  })

  const updatedTrainee = await Account.update({ fullname, education, dateOfBirth, age, email}, {
    where: {
      id: traineeId
    }
  })

  res.redirect('/trainingStaff');

})

/* GET create course category page. */
router.get("/createcourseCategory", async function (req, res) {
  res.render("layouts/master", {
    content: "../courseCategory_view/create"
  });
});

router.post("/addCourseCategory", async function (req, res) {
  const { name, description } = req.body;

  const courseCategory = await CourseCategory.create({
    name,
    description,
  });

  res.redirect("/trainingStaff");
});

router.get("/updateCourseCategory/:updateId", async function (req, res) {
  const { updateId } = req.params;
  try {
    const courseCategories = await CourseCategory.findAll({
      where: {
        id: updateId
      }
    })
    const { id, name, description } = courseCategories[0].dataValues;
    res.render("layouts/master", {
      content: "../courseCategory_view/update",
      id: id,
      name: name,
      description: description
    })
  } catch (error) {
  console.log("🚀 ~ file: trainingStaff.js ~ line 266 ~ error", error)
  }
})

router.post("/editCourseCategory", async function (req, res) {
  const { id, name, description } = req.body;
  try {
    const updatedCourseCategory = await CourseCategory.update({
      name,
      description
    },
    {
      where: {
        id: id
      }
    })

    res.redirect('/trainingStaff');
  } catch (error) {
  console.log("🚀 ~ file: trainingStaff.js ~ line 285 ~ error", error)
  }
})

router.get("/deleteCourseCategory/:deleteId", async function (req, res) {
  const { deleteId } = req.params;
  try {
    const deletedCousreCategory = await CourseCategory.destroy({
      where: {
        id: deleteId
      }
    })

    res. redirect('/trainingStaff');
  } catch (error) {
  console.log("🚀 ~ file: trainingStaff.js ~ line 300 ~ error", error)
  }
})


/* GET create course page. */
router.get("/createCourse", async function (req, res) {
  const courseCategories = await CourseCategory.findAll();
  res.render("layouts/master", {
    content: "../course_view/create",
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

router.get("/updateCourse/:updateId", async function (req, res) {
  const { updateId } = req.params;
  try {
    const courseCategories = await CourseCategory.findAll();
    const courses = await Course.findAll({
      where: {
        id: updateId
      }
    })
    const { id, name, description } = courses[0].dataValues;

    res.render("layouts/master", {
      content: "../course_view/update",
      id: id,
      courseName: name,
      description: description,
      courseCategories: courseCategories
    })
  } catch (error) {
  console.log("🚀 ~ file: trainingStaff.js ~ line 289 ~ error", error)
  }
})

router.post("/editCourse", async function (req, res) {
  const { id, name, description, courseCategoryId } = req.body;
  try {
    const updateCourse = await Course.update({
      name, 
      description,
      courseCategoryId
    },
    {
      where: {
        id: id
      }
    })

    res.redirect('/trainingStaff');
  } catch (error) {
  console.log("🚀 ~ file: trainingStaff.js ~ line 307 ~ error", error)
  }
})

router.get("/deleteCourse/:deleteId", async function (req, res) {
  const { deleteId } = req.params;
  
  try {
    const deletedcourse = await Course.destroy({
      where: {
        id: deleteId
      }
    })

    res.redirect('/trainingStaff');
  } catch (error) {
    console.log("🚀 ~ file: trainingStaff.js ~ line 324 ~ error", error)
  }
})

/* GET Assign Trainer. */
router.get("/assignTrainer", async (req, res) => {
  const trainers = await Trainer.findAll();
  
  const courses = await Course.findAll();
  res.render("layouts/master", {
    content: "../trainer_view/assign",
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

router.get("/removeTrainerTask/:trainerId/:courseId", async (req, res) => {
  const {trainerId, courseId} = req.params;
  // res.send(`trainerId: ${trainerId}, courseId: ${courseId}`)

//   await TrainerCourse.destroy({
//     where: {
//       [Op.and]: [{ trainerId: trainerId }, { courseId: courseId }],
//     }
//   })

await TrainerCourse.destroy({
  where: {
    trainerId: trainerId,
    courseId: courseId
  }
})

res.redirect('/trainingStaff');
})

/* GET Assign Trainee. */
router.get("/assignTrainee", async (req, res) => {
  const trainees = await Trainee.findAll();

  const courses = await Course.findAll();
  res.render("layouts/master", {
    content: "../trainee_view/assign",
    trainees,
    courses,
  });
});

router.post("/assignTrainee", async (req, res) => {
  try {
    const { traineeId, courseId } = req.body;

    const result = await TraineeCourse.create({
      traineeId,
      courseId,
    });

    res.redirect("/trainingStaff")
  } catch (error) {
  console.log("🚀 ~ file: trainingStaff.js ~ line 326 ~ router.post ~ error", error)
  }
})

router.get("/removeTraineeTask/:traineeId/:courseId", async (req, res) => {
  const {traineeId, courseId} = req.params;
  // res.send(`traineeId: ${traineeId}, courseId: ${courseId}`)

await TraineeCourse.destroy({
  where: {
    traineeId: traineeId,
    courseId: courseId
  }
})

res.redirect('/trainingStaff');
})

/* GET Search Course. */
router.get("/search", async (req, res) => {
  res.render("layouts/master",{
    content: "../search_view/search"
  })
})

router.post("/doSearch", async (req, res) => {
// res.send(req.body);
  const {courseName} = req.body;

  const trainers = await TrainerCourse.findAll({
    include: [{
      model: Course,
      attributes: ['name'],
      where: {
        name: courseName
      }
    },
    {
      model: Trainer,
      attributes: ['fullname'],     
    }],
    
  })

  const trainees = await TraineeCourse.findAll({
    include: [{
      model: Course,
      attributes: ['name'],
      where: {
        name: courseName
      }
    },
    {
      model: Trainee,
      attributes: ['fullname']
    }]
   
  })

  res.render("layouts/master",{
    content: "../search_view/search",
    trainees,
    trainers
  })
})


module.exports = router;

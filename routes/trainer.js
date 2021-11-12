var express = require("express");
const session = require("express-session");
var router = express.Router();
const database = require("../database/models/index");
const Trainer = database.db.trainer;
const Course = database.db.course;
const Trainee = database.db.trainee;
const TrainerCourse = database.db.TrainerCourse;
const TraineeCourse = database.db.TraineeCourse;


router.get("/", async function (req, res, next) {
  try {
    const { userId } = req.session.user;
    const trainerCourses = await TrainerCourse.findAll({
      include: Course,
      where: {
        trainerId: userId,
      },
    });

    res.render("layouts/master", {
      content: "../trainer_view/index",
      trainerCourses,
      trainerId: userId,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/viewTraineeOnCourses/:courseId", async (req, res) => {
  const { courseId } = req.params;
  const traineeCourses = await TraineeCourse.findAll({
    include: Trainee,
    where: {
      courseId,
    },
  });
  console.log(
    "🚀 ~ file: trainer.js ~ line 45 ~ router.get ~ traineeCourses",
    traineeCourses
  );
  res.render("layouts/master", {
    content: "../trainer_view/trainer_course_detail",
    traineeCourses,
  });
});

router.get("/updatetrainer/:trainerId", async function (req, res, next) {
  try {
    const { trainerId } = req.params;
    const trainer = await Trainer.findOne({
      where: {
        id: trainerId,
      },
    });

    res.render("layouts/master", {
      content: "../trainer_view/updateTrainerCourse",
      trainer,
      name: req.session.user.username,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/editTrainer", async function (req, res, next) {
  const { id, fullname, age, specialty, email, address } = req.body;
  try {
    const updatedTrainer = await Trainer.update(
      {
        fullname,
        age,
        specialty,
        email,
        address,
      },
      {
        where: {
          id: id,
        },
      }
    );
    res.redirect("/trainer");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
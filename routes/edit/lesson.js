const express = require("express");
const router = express.Router();
const models = require("../../models");

// GET Edit lesson
router.get("/:project/lessons/:lesson", async (req, res, next) => {
  const login = req.session.userLogin;
  const userId = req.session.userId;

  const projectURL = req.params.project;
  const project = await models.Project.findOne({ url: projectURL });
  const lessonURL = req.params.lesson;
  const lesson = await models.Lesson.findOne({ url: lessonURL });

  if (!project || !lesson) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
  } else if (!login || !userId || userId != project.owner) {
    res.redirect("/");
  } else {
    const tasks = await models.Task.find({ lesson: lesson.id });
    const title = "Редактирование урока";

    res.render("create/edit-lesson", {
      title,
      project,
      lesson,
      tasks
    });
  }
});

// POST Edit lesson
router.post("/:project/lessons/:lesson", async (req, res, next) => {
  const login = req.session.userLogin;
  const userId = req.session.userId;

  const projectURL = req.params.project;
  const project = await models.Project.findOne({ url: projectURL });
  const lessonURL = req.params.lesson;
  const lesson = await models.Lesson.findOne({ url: lessonURL });

  if (!project || !lesson) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
  } else if (!login || !userId || userId != project.owner) {
    res.redirect("/");
  } else {
    let { title, number, discripiton, logo, duration } = req.body;

    if (logo == "") {
      logo = project.logo;
    }

    const newLesson = await models.Lesson.findOneAndUpdate(
      {
        _id: lesson.id,
        curse: project.id
      },
      {
        title,
        number,
        discripiton,
        logo,
        duration
      },
      { new: true }
    );

    if (!newLesson) {
      res.json({
        ok: false,
        error: "Что-то пошло не так"
      });
    } else {
      res.json({
        ok: true
      });
    }
  }
});

module.exports = router;

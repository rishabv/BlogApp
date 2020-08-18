const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const Story = require("../models/story");

router.get("/", ensureGuest, (req, res) => {
  res.render("login", {
    layout: "login",
  });
});

router.get("/signup", ensureGuest, (req, res) => {
  res.render("signup", {
    layout: "login",
  });
});

router.get("/Dashboard", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user.id }).lean();
    res.render("dashboard", { name: req.user.firstName, img:req.user.image,stories });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

module.exports = router;
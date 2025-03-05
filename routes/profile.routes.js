const router = require("express").Router();

const authGuard = require("./guards/auth.guard.js");
const profileController = require("../controllers/profile.controller.js");

router.get("/", authGuard.isAuth, profileController.getProfile);
router.get("/:id", authGuard.isAuth, profileController.getProfile);

module.exports = router;

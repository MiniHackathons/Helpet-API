const express = require("express");

const router = express.Router();
const userController = require("../controllers/user");
const packageJson = require("../package");

const users = require("./users");
const posts = require("./posts");
const notifications = require("./notifications");
const mailService = require("./mailService");

/* GET home page. */
router.get("/", function(req, res) {
  res.send({
    name: "Helpet-API",
    version: packageJson.version,
    timestamp: new Date()
  });
});

router.post("/login", userController.login);
router.post("/login/oauth", userController.oauthLogin);
router.use("/users", users);
router.use("/posts", posts);
router.use("/notifications", notifications);
router.use(mailService);

module.exports = router;

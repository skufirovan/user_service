import userController from "../controller/user-controller";

const Router = require("express").Router;

const router = new Router();

router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.post("/getUserById", userController.getUserById);
router.post("/getAllUsers", userController.getAllUsers);
router.post("/blockUser", userController.blockUser);

module.exports = router;

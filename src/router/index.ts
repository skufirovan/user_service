import userController from "../controller/user-controller";

const Router = require("express").Router;

export const router = new Router();

router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.get("/user/:id", userController.getUserById);
router.get("/user", userController.getAllUsers);
router.patch("/user/block/:id", userController.blockUser);

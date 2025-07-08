import userController from "../controller/user-controller";
import { authMiddleware } from "../middlewares/auth-middleware";

const Router = require("express").Router;

export const router = new Router();

router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.get("/user/:id", authMiddleware, userController.getUserById);
router.get("/user", authMiddleware, userController.getAllUsers);
router.patch("/user/block/:id", authMiddleware, userController.blockUser);

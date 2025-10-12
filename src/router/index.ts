import userController from "../controller/user-controller";
import { authMiddleware } from "../middlewares/auth-middleware";
import { validateMiddleware } from "../middlewares/validate-middleware";
import { loginSchema, registrationSchema } from "../validation/user-schemas";

const Router = require("express").Router;

export const router = new Router();

router.post(
  "/registration",
  validateMiddleware(registrationSchema),
  userController.registration
);
router.post("/login", validateMiddleware(loginSchema), userController.login);
router.get("/user/:id", authMiddleware, userController.getUserById);
router.get("/user", authMiddleware, userController.getAllUsers);
router.patch("/user/block/:id", authMiddleware, userController.blockUser);

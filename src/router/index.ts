import userController from "../controllers/user-controller";
import { authMiddleware, validateMiddleware } from "../middlewares";
import {
  loginSchema,
  registrationSchema,
  updateProfileSchema,
} from "../validation/user-schemas";

const Router = require("express").Router;

export const router = new Router();

router.post(
  "/registration",
  validateMiddleware(registrationSchema),
  userController.registration
);
router.post("/login", validateMiddleware(loginSchema), userController.login);
router.patch(
  "/profile",
  [authMiddleware, validateMiddleware(updateProfileSchema)],
  userController.updateProfile
);

router.get("/users", authMiddleware, userController.getAllUsers);
router.get("/users/:id", authMiddleware, userController.getUserById);
router.patch("/users/:id/block", authMiddleware, userController.blockUser);

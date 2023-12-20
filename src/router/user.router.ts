import express from "express";
import { CreateUserValidator } from "./validator/create-user.validator";
import { InputValidationMiddleware } from "../middleware/inputValidationMiddleware";
import { container } from "../composition-root";
import { UserController } from "../controller/user.controller";

const router = express.Router();
const userController = container.resolve(UserController);

router.get("/", userController.getUsers.bind(userController));
router.post(
  "/",
  CreateUserValidator,
  InputValidationMiddleware,
  userController.createUser.bind(userController),
);
router.get("/:id", userController.getUser.bind(userController));
router.delete("/:id", userController.deleteUser.bind(userController));

export default router;
